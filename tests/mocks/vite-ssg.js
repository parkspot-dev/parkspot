export function ViteSSG(_App, _routerOptions, setupFn) {
    const createApp = () => undefined;
    createApp.__setup = setupFn;
    return createApp;
}
