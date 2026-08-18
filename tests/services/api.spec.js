import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/firebase', () => ({
    auth: { authStateReady: vi.fn().mockResolvedValue(undefined) },
}));
vi.mock('@/router', () => ({
    default: { currentRoute: { value: { fullPath: '/srp?latlng=1,2' } } },
}));
vi.mock('@/store', () => ({
    default: { state: { user: { user: { uid: 'user-123' } } } },
}));
vi.mock('@/utils/ptid', () => ({ getPtid: () => 'ptid-abc' }));

describe('MayaApiService errorInterceptor', () => {
    let mayaClient;
    let alertSpy;

    beforeEach(async () => {
        vi.resetModules();
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        window.newrelic = {
            noticeError: vi.fn(),
            addPageAction: vi.fn(),
        };
        ({ mayaClient } = await import('@/services/api'));
    });

    afterEach(() => {
        alertSpy.mockRestore();
        delete window.newrelic;
    });

    const makeError = (status) => ({
        response: { status, data: {} },
        message: 'boom',
    });

    it('shows a session-expired message for 401 and logs it as an expected page action', () => {
        expect(() => mayaClient.errorInterceptor(makeError(401))).toThrow();

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining('session has expired'),
        );
        expect(window.newrelic.addPageAction).toHaveBeenCalledWith(
            'ExpectedApiOutcome',
            expect.objectContaining({
                ptid: 'ptid-abc',
                session: 'user-123',
                pageUrl: '/srp?latlng=1,2',
                status: 401,
            }),
        );
        expect(window.newrelic.noticeError).not.toHaveBeenCalled();
    });

    it('shows a not-found message for 404 and logs it as an expected page action', () => {
        expect(() => mayaClient.errorInterceptor(makeError(404))).toThrow();

        expect(alertSpy).toHaveBeenCalledWith(
            expect.stringContaining("couldn't find a parking spot"),
        );
        expect(window.newrelic.addPageAction).toHaveBeenCalledWith(
            'ExpectedApiOutcome',
            expect.objectContaining({ status: 404 }),
        );
        expect(window.newrelic.noticeError).not.toHaveBeenCalled();
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
