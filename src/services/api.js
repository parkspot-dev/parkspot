import axios from 'axios';
import { auth } from '../firebase';

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
     * handleError is used to log http errors.
     * @param { any } error - .
     */
    handleErrors(error) {
        if (!error.request) {
            console.log({ 'Http server/network error': error });
            return;
        }
        console.log({
            message: 'Errors in http call',
            url: error.request.responseURL,
            err: error,
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
            return err.response.data;
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
            return err.response.data;
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
            return err.response.data;
        }
    }
}

// MayaApiService inherits BaseApiService to create http clients for Maya services.
/** Class representing a MayaApiService extends BaseApiService. */
class MayaApiService extends BaseApiService {
    /**
     * Create a MayaApiService.
     *  @param { function } flavour - getFlavour function.
     */
    constructor(flavour) {
        const mayaDomain = 'https://maya-in.parkspot.in'; //   TODO: we can pick from .env files.
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
                if(localStorage.getItem(
                    'PSAuthKey',
                )) {
                    localStorage.setItem('PSAuthKey', auth.currentUser?.accessToken)
                }
                config.headers['PSAuthKey'] = `${localStorage.getItem(
                    'PSAuthKey',
                )}`;
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
        super.errorInterceptor(error);
        if (!error.response) {
            // this case is handled in base interceptor.
            return;
        }
        switch (error.response.status) {
            case 401: // authentication error, logout the user
                alert('Please login and try again.');
                break;

            default:
                alert(
                    'Something went wrong.\nNo worries, our team is always there to help. \nPlease reach out to us at +91 80929 96057.',
                );
                console.error(
                    'maya interceptor default',
                    error.response.status,
                    error.message,
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

export { mayaClient, mapBoxClient };
