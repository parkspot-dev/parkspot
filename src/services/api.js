import axios from 'axios';
import { auth } from '../firebase';
import { reportError } from '../telemetry';
import { getPtid } from '../utils/ptid';
import { logger } from '../utils/logger';

/**
 * Path of a request without its query string, with ID-like segments
 * (anything containing a digit) replaced so the value stays
 * low-cardinality: `/booking/42/payments` -> `/booking/:id/payments`.
 * @param { string } [url] - request URL relative to the client's baseURL.
 * @return { string }
 */
function endpointOf(url = '') {
    return url.split(/[?#]/)[0].replace(/\/[^/]*\d[^/]*(?=\/|$)/g, '/:id');
}

/**
 * Report a failed Maya call to New Relic. The user and page are added by
 * the agent itself (enduser.id, route_name); the ptid tells tabs apart.
 * A call that got no answer has status 0 and axios's error code:
 * ECONNABORTED for a timeout, or for a request the browser dropped
 * (message "Request aborted"); ERR_NETWORK when the request failed or the
 * browser withheld the answer (a response without CORS headers).
 * @param { any } error - the axios error.
 */
function reportApiError(error) {
    reportError(error, {
        source: 'maya',
        status: error.response?.status ?? 0,
        error_code: error.response ? undefined : error.code,
        method: error.config?.method?.toUpperCase(),
        endpoint: endpointOf(error.config?.url),
        ptid: getPtid(),
    });
}

// BaseApiService create http client with basic configurations and error handling.
/** Class representing a BaseApiService. */
class BaseApiService {
    /**
     * Create a BaseApiService.
     *  @param { string } domain - .
     *  @param { object } commonHeaders - .
     *  @param { number } timeout - .
     *  @param { boolean } withCredentials - .
     */
    constructor(
        domain,
        commonHeaders = {},
        timeout = 1000,
        withCredentials = false,
    ) {
        if (!domain) throw new Error('Domain is not provided');
        this.domain = domain;
        this.client = axios.create({
            headers: {
                common: commonHeaders,
            },
            baseURL: domain,
            timeout: timeout, // `timeout` specifies the number of milliseconds before the request times out.
            withCredentials: withCredentials,
        });
        this.client.interceptors.response.use(
            this.responseInterceptor,
            this.errorInterceptor,
        );
    }
    /**
     * interceptor to catch network/server errors.
     * @param { any } error - .
     */
    errorInterceptor(error) {
        // check if it's a server error
        if (!error.response) {
            if (error.code == 'ECONNABORTED') {
                // timeout
                alert('Something went wrong. Please try again.');
            }
        }
        throw error;
    }

    // Interceptor for responses
    responseInterceptor = (response) => response;

    /**
     * handleError is used to log http errors. Maya's errorInterceptor has
     * already reported its own (with more detail), so New Relic only gets
     * this report for the other clients.
     * @param { any } error - .
     */
    handleErrors(error) {
        if (!error.request) {
            logger.error(error, {
                source: 'http',
                context: 'Http server/network error',
            });
            return;
        }
        logger.error(error, {
            source: 'http',
            context: 'Errors in http call',
            url: error.request?.responseURL,
        });
    }

    /**
     * handle post request api call.
     * @param { any } resource - url .
     * @param { object } payload -  .
     */
    async post(resource, payload = {}) {
        try {
            const response = await this.client.post(resource, payload);
            return response.data;
        } catch (err) {
            this.handleErrors(err);
            return err.response?.data;
        }
    }

    /**
     * handle patch request api call.
     * @param { any } resource - url .
     * @param { object } payload -  .
     */
    async patch(resource, payload = {}) {
        try {
            const response = await this.client.patch(resource, payload);
            return response.data;
        } catch (err) {
            this.handleErrors(err);
            return err.response?.data;
        }
    }

    /**
     * handle get request api call.
     * @param { any } resource - url .
     */
    async get(resource) {
        try {
            const response = await this.client.get(resource);
            if (!response) {
                return {};
            }
            return response.data;
        } catch (err) {
            this.handleErrors(err);
            return err.response?.data;
        }
    }

    /**
     * handle delete request api call.
     * @param { any } resource - url .
     */
    async delete(resource) {
        try {
            const response = await this.client.delete(resource);
            if (!response) {
                return {};
            }
            return response.data;
        } catch (err) {
            this.handleErrors(err);
            return err.response?.data;
        }
    }
}

// MayaApiService inherits BaseApiService to create http clients for Maya services. The
// domain is configurable per environment (VITE_MAYA_API_DOMAIN); UAT Netlify builds set it
// to https://maya-uat.parkspot.in, anything else falls back to production.
export const MAYA_API_DOMAIN =
    import.meta.env.VITE_MAYA_API_DOMAIN || 'https://maya-in.parkspot.in';

/** Class representing a MayaApiService extends BaseApiService. */
class MayaApiService extends BaseApiService {
    /**
     * Create a MayaApiService.
     *  @param { function } flavour - getFlavour function.
     */
    constructor(flavour) {
        const mayaDomain = MAYA_API_DOMAIN;
        const baseHeaderMap = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Flavour': flavour,
        };
        super(mayaDomain, baseHeaderMap, 10000, true);
        this.client.interceptors.request.use(
            async (config) => {
                // SSR pre-render has no `localStorage`, no signed-in user,
                // and no business making live calls to production Maya from
                // a build host. Replace the network adapter with a no-op so
                // the action's success path receives an empty payload and
                // the page can render its anonymous shell. Without this
                // short-circuit, touching `localStorage` would throw a
                // `ReferenceError` mid-request and pollute build logs with
                // misleading "Http server/network error" entries.
                if (typeof localStorage === 'undefined') {
                    config.adapter = () =>
                        Promise.resolve({
                            data: {},
                            status: 204,
                            statusText: 'No Content (SSR)',
                            headers: {},
                            config,
                            request: {},
                        });
                    return config;
                }
                await auth.authStateReady();
                if (localStorage.getItem('PSAuthKey')) {
                    localStorage.setItem(
                        'PSAuthKey',
                        auth.currentUser?.accessToken,
                    );
                }
                const token = localStorage.getItem('PSAuthKey');
                const isInvalidToken =
                    !token ||
                    !token.trim() ||
                    token.trim().toLowerCase() === 'undefined' ||
                    token.trim().toLowerCase() === 'null';

                if (isInvalidToken) {
                    // The endpoint pattern, not the URL: query strings
                    // carry searched mobile numbers.
                    logger.warn(
                        `[PSAuthKey Error] Sender check failed: PSAuthKey is empty or invalid for ${config.method?.toUpperCase()} ${endpointOf(config.url)}`,
                    );
                } else {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                config.headers['PSAuthKey'] = `${token || ''}`;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );
    }

    /**
     * errorInterceptor is used to handle status codes in accordance with Maya's contract.
     * @param { any } error -  .
     */
    errorInterceptor(error) {
        reportApiError(error);
        if (!error.response) {
            // network/timeout error, handled (and re-thrown) by base interceptor.
            return super.errorInterceptor(error);
        }
        switch (error.response.status) {
            case 401: // authentication error, logout the user
                alert('Your session has expired. Please login and try again.');
                break;

            case 404: // requested spot/site does not exist or isn't supported
                alert(
                    error.response.data?.DisplayMsg ||
                        'We couldn\'t find a parking spot for this search. Please try a different location.',
                );
                break;

            default:
                alert(
                    'Something went wrong.\nNo worries, our team is always there to help. \nPlease reach out to us at +91 80929 96057.',
                );
        }
        throw error;
    }
}

/** Class representing a MapBoxApiService extends BaseApiService */
class MapBoxApiService extends BaseApiService {
    /**
     * Create a MapBoxApiService.
     */
    constructor() {
        const mapBoxDomain = 'https://api.mapbox.com'; //   TODO: we can pick from .env files.
        const baseHeaderMap = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        super(mapBoxDomain, baseHeaderMap, 5000, false);
    }
}

/**
 * Detect device flavour ("mweb" / "dweb") from the user-agent.
 *
 * SSR-safe: when there is no `navigator` (i.e. inside `vite-ssg build` or
 * any other server runtime), we default to "dweb" rather than throwing. The
 * value is used only to tag outgoing HTTP requests; nothing semantic depends
 * on it for the SSG render path because no Maya calls are issued at build
 * time.
 *
 * @return {string} "mweb" or "dweb".
 */
const getFlavour = (function () {
    if (typeof navigator === 'undefined') {
        return 'dweb';
    }
    const details = navigator.userAgent || '';
    const regexp = /android|iphone|kindle|ipad/i;
    return regexp.test(details) ? 'mweb' : 'dweb';
})();
const mayaClient = new MayaApiService(getFlavour);

const mapBoxClient = new MapBoxApiService();

export {
    mayaClient,
    mapBoxClient,
    BaseApiService,
    MayaApiService,
    MapBoxApiService,
    getFlavour,
};
