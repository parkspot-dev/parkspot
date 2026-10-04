// The `@/telemetry` facade is the only code that talks to the browser
// agent. It has to scrub what it forwards, report each error once, and
// never throw into the caller, whether the agent is present, missing
// (SSR, ad blockers, disabled builds) or broken.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    NR_EVENTS,
    _resetTelemetryState,
    clearUser,
    disableSessionReplay,
    enableSessionReplay,
    getAgent,
    log,
    reportError,
    setAttribute,
    setErrorFilter,
    setRouteName,
    setUser,
    trackEvent,
} from '@/telemetry';

const API_METHODS = [
    'addPageAction',
    'log',
    'noticeError',
    'pauseReplay',
    'setCurrentRouteName',
    'setCustomAttribute',
    'setErrorHandler',
    'setUserId',
    'start',
];

function stubAgent() {
    window.newrelic = Object.fromEntries(
        API_METHODS.map((method) => [method, vi.fn()]),
    );
    return window.newrelic;
}

// Every public function, called with representative arguments.
const callEverything = () => {
    reportError(new Error('boom'), { source: 'test' });
    reportError('boom');
    trackEvent(NR_EVENTS.PAYMENT_STATUS, { status: 'paid' });
    log('info', 'hello');
    setAttribute('route_name', 'home');
    setAttribute('route_name', null);
    setUser('uid-1', { role: 'admin' });
    clearUser();
    setRouteName('home');
    setErrorFilter(() => false);
    enableSessionReplay();
    disableSessionReplay();
};

describe('@/telemetry', () => {
    beforeEach(() => {
        _resetTelemetryState();
    });

    afterEach(() => {
        // Restore `window` (stubbed away by the SSR test) first.
        vi.unstubAllGlobals();
        delete window.newrelic;
    });

    it('re-exports the event names', () => {
        expect(NR_EVENTS.PAYMENT_STATUS).toBe('payment_status');
    });

    describe('without an agent', () => {
        it('does nothing and never throws', () => {
            expect(getAgent()).toBeUndefined();
            expect(callEverything).not.toThrow();
        });

        it('does nothing during SSR, where there is no window', () => {
            vi.stubGlobal('window', undefined);
            expect(getAgent()).toBeUndefined();
            expect(callEverything).not.toThrow();
        });

        it('copes with an agent that lacks a method', () => {
            window.newrelic = {};
            expect(callEverything).not.toThrow();
        });

        it('swallows errors thrown by the agent', () => {
            window.newrelic = Object.fromEntries(
                API_METHODS.map((method) => [
                    method,
                    () => {
                        throw new Error('agent bug');
                    },
                ]),
            );
            expect(callEverything).not.toThrow();
        });
    });

    describe('reportError()', () => {
        it('sends the error with scrubbed attributes', () => {
            const agent = stubAgent();
            const error = new Error('boom');
            reportError(error, {
                source: 'maya',
                status: 500,
                cno: '9876543210',
            });
            expect(agent.noticeError).toHaveBeenCalledWith(error, {
                source: 'maya',
                status: 500,
            });
        });

        it('scrubs the error itself', () => {
            const agent = stubAgent();
            reportError(new Error('no user a@b.com'));
            const [sent] = agent.noticeError.mock.calls[0];
            expect(sent.message).toBe('no user [email]');
        });

        it('reports the same error object only once', () => {
            const agent = stubAgent();
            const error = new Error('boom');
            reportError(error, { source: 'maya', status: 500 });
            reportError(error, { context: 'getSpot' });
            expect(agent.noticeError).toHaveBeenCalledTimes(1);
            expect(agent.noticeError.mock.calls[0][1]).toEqual({
                source: 'maya',
                status: 500,
            });
        });

        it('reports repeated strings every time', () => {
            const agent = stubAgent();
            reportError('boom');
            reportError('boom');
            expect(agent.noticeError).toHaveBeenCalledTimes(2);
            expect(agent.noticeError).toHaveBeenCalledWith('boom', {});
        });

        it('turns other values into strings', () => {
            const agent = stubAgent();
            reportError(404);
            expect(agent.noticeError).toHaveBeenCalledWith('404', {});
        });

        it.each([undefined, null])('ignores %o', (value) => {
            const agent = stubAgent();
            reportError(value);
            expect(agent.noticeError).not.toHaveBeenCalled();
        });

        it('does not mark errors reported while the agent was missing', () => {
            const error = new Error('early');
            reportError(error);
            const agent = stubAgent();
            reportError(error);
            expect(agent.noticeError).toHaveBeenCalledTimes(1);
        });
    });

    it('trackEvent() sends a PageAction with scrubbed attributes', () => {
        const agent = stubAgent();
        trackEvent('form_submit_attempt', {
            funnel_name: 'vo_lead',
            email: 'a@b.com',
        });
        expect(agent.addPageAction).toHaveBeenCalledWith(
            'form_submit_attempt',
            { funnel_name: 'vo_lead' },
        );
    });

    describe('log()', () => {
        it('sends a scrubbed line with its level and attributes', () => {
            const agent = stubAgent();
            log('warn', 'retrying for 9876543210', {
                attempt: 2,
                phone: '9876543210',
            });
            expect(agent.log).toHaveBeenCalledWith('retrying for [phone]', {
                level: 'warn',
                customAttributes: { attempt: 2 },
            });
        });

        it('caps the line at 1024 characters', () => {
            const agent = stubAgent();
            log('info', 'word '.repeat(400));
            expect(agent.log.mock.calls[0][0]).toHaveLength(1024);
        });

        it.each([
            [undefined, ''],
            [null, ''],
            [42, '42'],
        ])('stringifies %o', (message, expected) => {
            const agent = stubAgent();
            log('info', message);
            expect(agent.log.mock.calls[0][0]).toBe(expected);
        });
    });

    describe('setAttribute()', () => {
        it('sets a scrubbed value', () => {
            const agent = stubAgent();
            setAttribute('note', 'call 9876543210', true);
            expect(agent.setCustomAttribute).toHaveBeenCalledWith(
                'note',
                'call [phone]',
                true,
            );
        });

        it('does not persist by default', () => {
            const agent = stubAgent();
            setAttribute('route_name', 'home');
            expect(agent.setCustomAttribute).toHaveBeenCalledWith(
                'route_name',
                'home',
                false,
            );
        });

        it('removes the attribute for null', () => {
            const agent = stubAgent();
            setAttribute('route_name', null);
            expect(agent.setCustomAttribute).toHaveBeenCalledWith(
                'route_name',
                null,
            );
        });

        it.each([
            ['denied keys', 'email', 'a@b.com'],
            ['values that cannot be sent', 'meta', { a: 1 }],
        ])('ignores %s', (_label, name, value) => {
            const agent = stubAgent();
            setAttribute(name, value);
            expect(agent.setCustomAttribute).not.toHaveBeenCalled();
        });
    });

    describe('setUser() / clearUser()', () => {
        it('sets the user id, starting a new session on a user switch', () => {
            const agent = stubAgent();
            setUser('uid-1', { role: 'admin' });
            expect(agent.setUserId).toHaveBeenCalledWith('uid-1', true);
            expect(agent.setCustomAttribute).toHaveBeenCalledWith(
                'user_role',
                'admin',
                true,
            );
        });

        it('skips the role when there is none', () => {
            const agent = stubAgent();
            setUser(42);
            expect(agent.setUserId).toHaveBeenCalledWith('42', true);
            expect(agent.setCustomAttribute).not.toHaveBeenCalled();
        });

        it.each([undefined, null, ''])('ignores user id %o', (id) => {
            const agent = stubAgent();
            setUser(id, { role: 'admin' });
            expect(agent.setUserId).not.toHaveBeenCalled();
        });

        it('clearUser() unsets the user and the role', () => {
            const agent = stubAgent();
            clearUser();
            expect(agent.setUserId).toHaveBeenCalledWith(null, true);
            expect(agent.setCustomAttribute).toHaveBeenCalledWith(
                'user_role',
                null,
            );
        });
    });

    it('setRouteName() names the route and tags later data', () => {
        const agent = stubAgent();
        setRouteName('spot-detail');
        expect(agent.setCurrentRouteName).toHaveBeenCalledWith('spot-detail');
        expect(agent.setCustomAttribute).toHaveBeenCalledWith(
            'route_name',
            'spot-detail',
            false,
        );
    });

    it('setErrorFilter() installs the agent error handler', () => {
        const agent = stubAgent();
        const filter = () => false;
        setErrorFilter(filter);
        expect(agent.setErrorHandler).toHaveBeenCalledWith(filter);
    });

    describe('enableSessionReplay()', () => {
        it('starts the agent once', () => {
            const agent = stubAgent();
            enableSessionReplay();
            enableSessionReplay();
            expect(agent.start).toHaveBeenCalledTimes(1);
            expect(agent.start).toHaveBeenCalledWith();
        });

        it('tries again if the agent was not there yet', () => {
            enableSessionReplay();
            const agent = stubAgent();
            enableSessionReplay();
            expect(agent.start).toHaveBeenCalledTimes(1);
        });
    });

    describe('disableSessionReplay()', () => {
        const blocked = () =>
            document.documentElement.hasAttribute('data-nr-block');

        it('pauses replay and blocks the whole page', () => {
            const agent = stubAgent();
            disableSessionReplay();
            expect(agent.pauseReplay).toHaveBeenCalledWith();
            // New Relic's session replay records nothing inside [data-nr-block].
            expect(blocked()).toBe(true);
        });

        it('keeps replay from starting on this page', () => {
            const agent = stubAgent();
            disableSessionReplay();
            enableSessionReplay();
            expect(agent.start).not.toHaveBeenCalled();
        });

        it('leaves the page alone without an agent, but still keeps replay off', () => {
            disableSessionReplay();
            expect(blocked()).toBe(false);
            const agent = stubAgent();
            enableSessionReplay();
            expect(agent.start).not.toHaveBeenCalled();
        });
    });
});
