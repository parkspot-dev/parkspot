/**
 * Bounds an otherwise-unbounded promise with a timeout.
 *
 * Firebase's `authStateReady()` and `getIdToken()` can stall indefinitely in
 * in-app webviews, private/partitioned storage, or when Google's auth
 * endpoints are blocked/slow. Awaiting them un-timed on the critical path is
 * what lets the auth UI hang for minutes. This helper caps that wait: if the
 * promise settles first we pass its result (or error) through; if the timer
 * wins we resolve with `fallback` instead of hanging.
 *
 * On timeout the resolved value is `fallback` (default `undefined`) — the
 * promise is NOT rejected — so callers stay on their happy path and degrade
 * gracefully. A rejection from the wrapped promise still propagates, so wrap
 * the call in try/catch (or `.catch`) when you also want to swallow errors.
 *
 * @template T
 * @param {Promise<T>} promise - the operation to bound.
 * @param {number} ms - timeout in milliseconds.
 * @param {T} [fallback] - value to resolve with when the timer wins.
 * @returns {Promise<T>} resolves with the promise's value, or `fallback` on timeout.
 */
export function withTimeout(promise, ms, fallback = undefined) {
    let timer;

    const timeout = new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
    });

    return Promise.race([
        Promise.resolve(promise).then(
            (value) => {
                clearTimeout(timer);
                return value;
            },
            (err) => {
                clearTimeout(timer);
                throw err;
            },
        ),
        timeout,
    ]);
}
