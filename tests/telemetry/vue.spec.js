// telemetryPlugin connects Vue and vue-router to the agent: component and
// router errors are reported (production Vue would otherwise only log
// them), the agent-level error filter is installed, and SPA routes are
// named after their route records.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, defineComponent, nextTick } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { _resetTelemetryState } from '@/telemetry';
import { telemetryPlugin } from '@/telemetry/vue.js';

function stubAgent() {
    window.newrelic = {
        noticeError: vi.fn(),
        pauseReplay: vi.fn(),
        setCurrentRouteName: vi.fn(),
        setCustomAttribute: vi.fn(),
        setErrorHandler: vi.fn(),
        start: vi.fn(),
    };
    return window.newrelic;
}

function fakeApp(errorHandler) {
    return { config: { errorHandler } };
}

function fakeRouter() {
    return { onError: vi.fn(), beforeResolve: vi.fn(), afterEach: vi.fn() };
}

describe('telemetryPlugin', () => {
    let consoleError;

    beforeEach(() => {
        _resetTelemetryState();
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        delete window.newrelic;
        vi.restoreAllMocks();
    });

    it('does nothing when the agent is not on the page', () => {
        const app = fakeApp(undefined);
        const router = fakeRouter();
        telemetryPlugin.install(app, { router });
        expect(app.config.errorHandler).toBeUndefined();
        expect(router.onError).not.toHaveBeenCalled();
        expect(router.beforeResolve).not.toHaveBeenCalled();
        expect(router.afterEach).not.toHaveBeenCalled();
    });

    it('installs the agent error filter', () => {
        const agent = stubAgent();
        telemetryPlugin.install(fakeApp(), {});
        expect(agent.setErrorHandler).toHaveBeenCalledTimes(1);
        const [filter] = agent.setErrorHandler.mock.calls[0];
        expect(filter(new Error('ResizeObserver loop limit exceeded'))).toBe(
            true,
        );
    });

    describe('app.config.errorHandler', () => {
        it('reports the error and logs it like Vue would', () => {
            const agent = stubAgent();
            const app = fakeApp();
            telemetryPlugin.install(app, {});
            const error = new Error('render failed');
            app.config.errorHandler(
                error,
                { $options: { name: 'TemplateSrp' } },
                'https://vuejs.org/error-reference/#runtime-1',
            );
            expect(agent.noticeError).toHaveBeenCalledWith(error, {
                source: 'vue',
                vue_info: 'runtime-1',
                component: 'TemplateSrp',
            });
            expect(consoleError).toHaveBeenCalledWith(error);
        });

        it('names <script setup> components by their file name', () => {
            const agent = stubAgent();
            const app = fakeApp();
            telemetryPlugin.install(app, {});
            app.config.errorHandler(
                new Error('x'),
                { $options: { __name: 'OrganismLogin' } },
                'setup function',
            );
            expect(agent.noticeError.mock.calls[0][1]).toEqual({
                source: 'vue',
                vue_info: 'setup function',
                component: 'OrganismLogin',
            });
        });

        it('copes with errors outside a component', () => {
            const agent = stubAgent();
            const app = fakeApp();
            telemetryPlugin.install(app, {});
            app.config.errorHandler(new Error('x'), null, undefined);
            expect(agent.noticeError.mock.calls[0][1]).toEqual({
                source: 'vue',
                vue_info: '',
            });
        });

        it('hands over to an existing handler instead of logging', () => {
            stubAgent();
            const previous = vi.fn();
            const app = fakeApp(previous);
            telemetryPlugin.install(app, {});
            const error = new Error('x');
            const instance = { $options: {} };
            app.config.errorHandler(error, instance, 'render function');
            expect(previous).toHaveBeenCalledWith(
                error,
                instance,
                'render function',
            );
            expect(consoleError).not.toHaveBeenCalled();
        });
    });

    describe('router hooks', () => {
        it('reports and logs router errors', () => {
            const agent = stubAgent();
            const router = fakeRouter();
            telemetryPlugin.install(fakeApp(), { router });
            const [onError] = router.onError.mock.calls[0];
            const error = new Error('Failed to fetch dynamically imported');
            onError(error);
            expect(agent.noticeError).toHaveBeenCalledWith(error, {
                source: 'router',
            });
            expect(consoleError).toHaveBeenCalledWith(error);
        });

        it.each([
            ['the route name', { name: 'home', matched: [] }, 'home'],
            [
                'the matched path pattern for unnamed routes',
                {
                    matched: [
                        { path: '/payment' },
                        { path: '/payment/:pathMatch(.*)*' },
                    ],
                },
                '/payment/:pathMatch(.*)*',
            ],
            ['"unknown" when nothing matched', { matched: [] }, 'unknown'],
        ])('names the route after %s', (_label, to, expected) => {
            const agent = stubAgent();
            const router = fakeRouter();
            telemetryPlugin.install(fakeApp(), { router });
            const [afterEach] = router.afterEach.mock.calls[0];
            afterEach(to, {}, undefined);
            expect(agent.setCurrentRouteName).toHaveBeenCalledWith(expected);
        });

        it('keeps the route name when a navigation fails', () => {
            const agent = stubAgent();
            const router = fakeRouter();
            telemetryPlugin.install(fakeApp(), { router });
            const [afterEach] = router.afterEach.mock.calls[0];
            afterEach({ name: 'srp', matched: [] }, {}, new Error('aborted'));
            expect(agent.setCurrentRouteName).not.toHaveBeenCalled();
        });

        it.each([
            ['pauses replay for', { sessionReplay: false }, 1],
            ['leaves replay alone for', {}, 0],
        ])('%s routes with meta %o', (_label, meta, pauses) => {
            const agent = stubAgent();
            const router = fakeRouter();
            telemetryPlugin.install(fakeApp(), { router });
            const [beforeResolve] = router.beforeResolve.mock.calls[0];
            beforeResolve({ name: 'paymentGateway', matched: [], meta });
            expect(agent.pauseReplay).toHaveBeenCalledTimes(pauses);
        });
    });

    it('names routes during real navigations', async () => {
        const agent = stubAgent();
        const page = { render: () => null };
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: page },
                { path: '/spot-details/:spotId', component: page },
            ],
        });
        const app = createApp(page);
        app.use(router);
        app.use(telemetryPlugin, { router });

        await router.push('/');
        expect(agent.setCurrentRouteName).toHaveBeenLastCalledWith('home');
        await router.push('/spot-details/Blr%23Koramangala%23Compound');
        expect(agent.setCurrentRouteName).toHaveBeenLastCalledWith(
            '/spot-details/:spotId',
        );
    });

    it('keeps opted-out pages out of replays during real navigations', async () => {
        const agent = stubAgent();
        const page = { render: () => null };
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', name: 'home', component: page },
                {
                    path: '/internal/:tool',
                    component: page,
                    meta: { sessionReplay: false },
                    beforeEnter: (to) =>
                        to.params.tool === 'admin-only' ? '/' : true,
                },
            ],
        });
        const app = createApp(page);
        app.use(router);
        app.use(telemetryPlugin, { router });

        await router.push('/');
        // A guard that sends the visitor elsewhere doesn't count.
        await router.push('/internal/admin-only');
        expect(agent.pauseReplay).not.toHaveBeenCalled();
        await router.push('/internal/kyc-status?mobile=9876543210');
        expect(agent.pauseReplay).toHaveBeenCalledTimes(1);
        expect(document.documentElement.hasAttribute('data-nr-block')).toBe(
            true,
        );
    });

    it('reports errors thrown while rendering a real component', async () => {
        const agent = stubAgent();
        const Broken = defineComponent({
            name: 'Broken',
            render() {
                throw new Error('render failed');
            },
        });
        const app = createApp(Broken);
        app.use(telemetryPlugin, {});
        app.mount(document.createElement('div'));
        await nextTick();
        expect(agent.noticeError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'render failed' }),
            expect.objectContaining({ source: 'vue', component: 'Broken' }),
        );
        app.unmount();
    });
});
