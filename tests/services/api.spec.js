import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    BaseApiService,
    MayaApiService,
    MapBoxApiService,
    mayaClient,
    mapBoxClient,
    getFlavour,
} from '@/services/api';
import { auth } from '@/firebase';
import { logger } from '@/utils/logger';

vi.mock('@/firebase', () => ({
    auth: {
        authStateReady: vi.fn().mockResolvedValue(),
        currentUser: {
            accessToken: 'refreshed_firebase_token',
        },
    },
}));

vi.mock('@/utils/ptid', () => ({ getPtid: () => 'ptid-abc' }));

vi.mock('@/utils/logger', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        event: vi.fn(),
    },
}));

describe('BaseApiService', () => {
    let apiService;
    let alertMock;

    beforeEach(() => {
        vi.clearAllMocks();
        alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);
        apiService = new BaseApiService('https://api.example.com', {
            'Custom-Header': 'val',
        });
    });

    it('throws error if domain is not provided', () => {
        expect(() => new BaseApiService()).toThrow('Domain is not provided');
    });

    it('responseInterceptor returns response as is', () => {
        const resp = { data: { success: true } };
        expect(apiService.responseInterceptor(resp)).toEqual(resp);
    });

    it('errorInterceptor handles ECONNABORTED timeout alert and throws error', () => {
        const error = { code: 'ECONNABORTED' };
        expect(() => apiService.errorInterceptor(error)).toThrow();
        expect(alertMock).toHaveBeenCalledWith(
            'Something went wrong. Please try again.',
        );
    });

    it('errorInterceptor throws non-timeout error without alert if no response', () => {
        const error = { code: 'ERR_NETWORK' };
        expect(() => apiService.errorInterceptor(error)).toThrow();
        expect(alertMock).not.toHaveBeenCalled();
    });

    it('handleErrors logs server/network error when request is missing', () => {
        const err = new Error('network error');
        apiService.handleErrors(err);
        expect(logger.error).toHaveBeenCalledWith(err, {
            source: 'http',
            context: 'Http server/network error',
        });
    });

    it('handleErrors logs http call error when request is present', () => {
        const err = {
            request: { responseURL: 'https://api.example.com/test' },
        };
        apiService.handleErrors(err);
        expect(logger.error).toHaveBeenCalledWith(err, {
            source: 'http',
            context: 'Errors in http call',
            url: 'https://api.example.com/test',
        });
    });

    describe('HTTP methods', () => {
        it('post returns response data on success', async () => {
            vi.spyOn(apiService.client, 'post').mockResolvedValue({
                data: { result: 'ok' },
            });
            const data = await apiService.post('/test', { foo: 'bar' });
            expect(data).toEqual({ result: 'ok' });
        });

        it('post handles error and returns err response data', async () => {
            const errResponse = {
                response: { data: { error: 'invalid payload' } },
            };
            vi.spyOn(apiService.client, 'post').mockRejectedValue(errResponse);
            const data = await apiService.post('/test', { foo: 'bar' });
            expect(data).toEqual({ error: 'invalid payload' });
            expect(logger.error).toHaveBeenCalled();
        });

        it('patch returns response data on success', async () => {
            vi.spyOn(apiService.client, 'patch').mockResolvedValue({
                data: { updated: true },
            });
            const data = await apiService.patch('/test', { foo: 'bar' });
            expect(data).toEqual({ updated: true });
        });

        it('patch handles error and returns err response data', async () => {
            const errResponse = {
                response: { data: { error: 'patch failed' } },
            };
            vi.spyOn(apiService.client, 'patch').mockRejectedValue(errResponse);
            const data = await apiService.patch('/test');
            expect(data).toEqual({ error: 'patch failed' });
        });

        it('get returns response data on success', async () => {
            vi.spyOn(apiService.client, 'get').mockResolvedValue({
                data: { list: [1, 2] },
            });
            const data = await apiService.get('/list');
            expect(data).toEqual({ list: [1, 2] });
        });

        it('get returns empty object if response is null', async () => {
            vi.spyOn(apiService.client, 'get').mockResolvedValue(null);
            const data = await apiService.get('/empty');
            expect(data).toEqual({});
        });

        it('get handles error and returns err response data', async () => {
            const errResponse = {
                response: { data: { error: 'not found' } },
            };
            vi.spyOn(apiService.client, 'get').mockRejectedValue(errResponse);
            const data = await apiService.get('/list');
            expect(data).toEqual({ error: 'not found' });
        });

        it('delete returns response data on success', async () => {
            vi.spyOn(apiService.client, 'delete').mockResolvedValue({
                data: { deleted: true },
            });
            const data = await apiService.delete('/item/1');
            expect(data).toEqual({ deleted: true });
        });

        it('delete returns empty object if response is null', async () => {
            vi.spyOn(apiService.client, 'delete').mockResolvedValue(null);
            const data = await apiService.delete('/item/1');
            expect(data).toEqual({});
        });

        it('delete handles error and returns err response data', async () => {
            const errResponse = {
                response: { data: { error: 'forbidden' } },
            };
            vi.spyOn(apiService.client, 'delete').mockRejectedValue(
                errResponse,
            );
            const data = await apiService.delete('/item/1');
            expect(data).toEqual({ error: 'forbidden' });
        });
    });
});

describe('MayaApiService', () => {
    let mayaService;
    let alertMock;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);
        mayaService = new MayaApiService('dweb');
    });

    it('attaches Bearer token and PSAuthKey when PSAuthKey is present', async () => {
        localStorage.setItem('PSAuthKey', 'existing_token');
        auth.currentUser = { accessToken: 'new_access_token' };

        const interceptorHandler =
            mayaService.client.interceptors.request.handlers[0].fulfilled;

        const config = { headers: {}, method: 'get', url: '/auth/user' };
        const resultConfig = await interceptorHandler(config);

        expect(auth.authStateReady).toHaveBeenCalled();
        expect(localStorage.getItem('PSAuthKey')).toBe('new_access_token');
        expect(resultConfig.headers['Authorization']).toBe(
            'Bearer new_access_token',
        );
        expect(resultConfig.headers['PSAuthKey']).toBe('new_access_token');
    });

    it('logs warning when PSAuthKey is invalid (missing/blank/null string)', async () => {
        localStorage.clear();

        const interceptorHandler =
            mayaService.client.interceptors.request.handlers[0].fulfilled;

        const config = { headers: {}, method: 'post', url: '/auth/login' };
        const resultConfig = await interceptorHandler(config);

        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining(
                '[PSAuthKey Error] Sender check failed: PSAuthKey is empty or invalid for POST /auth/login',
            ),
        );
        expect(resultConfig.headers['Authorization']).toBeUndefined();
        expect(resultConfig.headers['PSAuthKey']).toBe('');
    });

    it('logs the endpoint pattern, never the query string or IDs', async () => {
        localStorage.clear();

        const interceptorHandler =
            mayaService.client.interceptors.request.handlers[0].fulfilled;

        await interceptorHandler({
            headers: {},
            method: 'get',
            url: 'sites-and-spot-requests?mobile=98765',
        });
        await interceptorHandler({
            headers: {},
            method: 'get',
            url: '/booking/42/payments',
        });

        expect(logger.warn).toHaveBeenNthCalledWith(
            1,
            expect.stringMatching(/for GET sites-and-spot-requests$/),
        );
        expect(logger.warn).toHaveBeenNthCalledWith(
            2,
            expect.stringMatching(/for GET \/booking\/:id\/payments$/),
        );
    });

    it('rejects request error in request interceptor rejected handler', async () => {
        const interceptorErrorHandler =
            mayaService.client.interceptors.request.handlers[0].rejected;

        const reqErr = new Error('request failure');
        await expect(interceptorErrorHandler(reqErr)).rejects.toThrow(reqErr);
    });

    it('handles 401 response error with login alert', () => {
        const error = {
            response: { status: 401 },
        };
        expect(() => mayaService.errorInterceptor(error)).toThrow();
        expect(alertMock).toHaveBeenCalledWith(
            'Your session has expired. Please login and try again.',
        );
    });

    it('handles 500 default error with team alert', () => {
        const error = {
            response: { status: 500 },
            message: 'Internal Server Error',
        };
        expect(() => mayaService.errorInterceptor(error)).toThrow();
        expect(alertMock).toHaveBeenCalledWith(
            expect.stringContaining('Something went wrong'),
        );
        // Reported once by reportApiError (see the New Relic block below),
        // not a second time through the logger.
        expect(logger.error).not.toHaveBeenCalled();
    });

    it('returns early in errorInterceptor if error.response is undefined', () => {
        const error = { code: 'ERR_NETWORK' };
        expect(() => mayaService.errorInterceptor(error)).toThrow();
    });
});

describe('MapBoxApiService & getFlavour & Clients', () => {
    it('MapBoxApiService instantiates correctly', () => {
        const mapBox = new MapBoxApiService();
        expect(mapBox.domain).toBe('https://api.mapbox.com');
    });

    it('exports mayaClient and mapBoxClient instances', () => {
        expect(mayaClient).toBeInstanceOf(MayaApiService);
        expect(mapBoxClient).toBeInstanceOf(MapBoxApiService);
    });

    it('getFlavour returns dweb or mweb string', () => {
        expect(['dweb', 'mweb']).toContain(getFlavour);
    });
});

describe('MayaApiService errorInterceptor New Relic reporting', () => {
    let alertSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        window.newrelic = {
            noticeError: vi.fn(),
            addPageAction: vi.fn(),
        };
    });

    afterEach(() => {
        alertSpy.mockRestore();
        delete window.newrelic;
    });

    const makeError = (status) => ({
        response: { status, data: {} },
        message: 'boom',
    });

    it('shows a session-expired message for 401 and notices a real error', () => {
        const error = makeError(401);
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining('session has expired'),
        );
        expect(window.newrelic.noticeError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                source: 'maya',
                ptid: 'ptid-abc',
                status: 401,
            }),
        );
        expect(window.newrelic.addPageAction).not.toHaveBeenCalled();
    });

    it('tags the request shape without query strings or user data', () => {
        const error = {
            ...makeError(500),
            config: { method: 'get', url: '/site?site-id=X' },
        };
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        const attributes = window.newrelic.noticeError.mock.calls[0][1];
        expect(attributes).toEqual({
            source: 'maya',
            status: 500,
            method: 'GET',
            endpoint: '/site',
            ptid: 'ptid-abc',
        });
    });

    it.each([
        ['ECONNABORTED', 'timeout of 10000ms exceeded'],
        ['ERR_NETWORK', 'Network Error'],
    ])('reports a call without an answer (%s) as status 0', (code, message) => {
        const error = {
            code,
            message,
            config: { method: 'get', url: '/booking/history' },
        };
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(window.newrelic.noticeError).toHaveBeenCalledTimes(1);
        expect(window.newrelic.noticeError.mock.calls[0][1]).toEqual({
            source: 'maya',
            status: 0,
            error_code: code,
            method: 'GET',
            endpoint: '/booking/history',
            ptid: 'ptid-abc',
        });
    });

    it.each([
        ['get', '/booking/42/payments', '/booking/:id/payments'],
        [
            'patch',
            'auth/user/9876543210/kycStatus',
            'auth/user/[user]/kycStatus',
        ],
    ])('normalizes the %s %s endpoint', (method, url, endpoint) => {
        const error = { ...makeError(500), config: { method, url } };
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(window.newrelic.noticeError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                method: method.toUpperCase(),
                endpoint,
            }),
        );
    });

    it('shows a not-found message for 404 and notices a real error', () => {
        const error = makeError(404);
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("couldn't find a parking spot"),
        );
        expect(window.newrelic.noticeError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({ status: 404 }),
        );
        expect(window.newrelic.addPageAction).not.toHaveBeenCalled();
    });

    it('prefers Maya\'s DisplayMsg over the hardcoded 404 copy when present', () => {
        const error = {
            response: {
                status: 404,
                data: { DisplayMsg: 'No sites match that search.' },
            },
            message: 'boom',
        };
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(alertSpy).toHaveBeenCalledWith('No sites match that search.');
    });

    it('shows the generic fallback and notices a real error for other statuses', () => {
        const error = makeError(500);
        expect(() => mayaClient.errorInterceptor(error)).toThrow();

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining('Something went wrong'),
        );
        expect(window.newrelic.noticeError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({ status: 500 }),
        );
        expect(window.newrelic.addPageAction).not.toHaveBeenCalled();
    });
});
