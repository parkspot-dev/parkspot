// @vitest-environment node
// Edge telemetry turns each handled request into one New Relic log
// record. It must never send what identifies a visitor (URL, user agent,
// IP, geo data), never put the license key anywhere but the Api-Key
// header, and never throw or hold back a response.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    LOG_API,
    MAX_ERROR_TEXT_LENGTH,
    SEND_TIMEOUT_MS,
    startTelemetry,
} from '../../netlify/edge-functions/lib/telemetry.js';

// Made up, in the shape of an ingest license key.
const LICENSE_KEY = ['0123456789abcdef0123456789abcdef0123', 'NRAL'].join('');

const URL_WITH_PII =
    'https://www.parkspot.in/spot-details/HYD%23REQ%23104' +
    '?phone=9876543210&gclid=abc123';

const CHROME_UA =
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

const STARTED_AT = Date.UTC(2026, 9, 3, 6, 30);

// `null` leaves the user-agent header out.
function makeRequest(userAgent = CHROME_UA) {
    const headers = userAgent === null ? {} : { 'user-agent': userAgent };
    return new Request(URL_WITH_PII, { headers });
}

// The Netlify edge context, with the fields a record must never carry
// (ip, geo) filled in.
function makeContext(overrides = {}) {
    return {
        requestId: '01J9ZK3QX4M2T8V6N0B5C7D9EF',
        deploy: { context: 'production', id: '6650f1e2a1b2c3d4e5f60718' },
        server: { region: 'ap-south-1' },
        ip: '203.0.113.7',
        geo: {
            city: 'Secunderabad',
            country: { code: 'IN', name: 'India' },
            latitude: 17.4399,
            longitude: 78.4983,
        },
        waitUntil: vi.fn(),
        ...overrides,
    };
}

// What the Log API answers to an accepted post.
const accepted = () =>
    new Response('{"requestId":"9d4b6f3e-0c1a-4b7e-a2f5-6e8d9c0b1a2f"}', {
        status: 202,
    });

function setup({
    env = { NEW_RELIC_LICENSE_KEY: LICENSE_KEY },
    request = makeRequest(),
    context = makeContext(),
    fetchImpl = vi.fn(async () => accepted()),
    random = () => 0,
} = {}) {
    let clock = STARTED_AT;
    const telemetry = startTelemetry('seo-inject', request, context, {
        env: (name) => env[name],
        fetchImpl,
        now: () => clock,
        random,
    });
    return {
        telemetry,
        context,
        fetchImpl,
        tick(ms) {
            clock += ms;
        },
        // Wait for the queued sends, then return what they posted.
        async sent() {
            await Promise.all(
                context.waitUntil.mock.calls.map(([promise]) => promise),
            );
            return fetchImpl.mock.calls.map(([url, init]) => ({
                url,
                init,
                body: JSON.parse(init.body),
            }));
        },
    };
}

// The attributes of the only record posted.
async function recordOf({ sent }) {
    const posts = await sent();
    expect(posts).toHaveLength(1);
    const [{ common, logs }] = posts[0].body;
    expect(logs).toHaveLength(1);
    return { common: common.attributes, ...logs[0] };
}

describe('netlify/edge-functions/lib/telemetry', () => {
    let consoleError;

    beforeEach(() => {
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('posts one log record per request', async () => {
        const test = setup();
        test.tick(12);
        test.telemetry.set({
            route_name: 'spot-detail',
            status: 200,
            upstream_ms: test.telemetry.elapsed(),
        });
        test.tick(3);
        test.telemetry.finish('injected');

        expect(test.context.waitUntil).toHaveBeenCalledTimes(1);
        const [{ url, init, body }] = await test.sent();
        expect(url).toBe(LOG_API);
        expect(init.method).toBe('POST');
        expect(init.headers).toEqual({
            'Api-Key': LICENSE_KEY,
            'Content-Type': 'application/json',
        });
        expect(init.signal).toBeInstanceOf(AbortSignal);
        expect(body).toEqual([
            {
                common: {
                    attributes: {
                        'service.name': 'parkspot-edge',
                        'environment': 'production',
                        'deploy_id': '6650f1e2a1b2c3d4e5f60718',
                        'edge_region': 'ap-south-1',
                    },
                },
                logs: [
                    {
                        timestamp: STARTED_AT,
                        message: 'seo-inject injected',
                        attributes: {
                            route_name: 'spot-detail',
                            status: 200,
                            upstream_ms: 12,
                            level: 'info',
                            edge_function: 'seo-inject',
                            outcome: 'injected',
                            duration_ms: 15,
                            client: 'browser',
                            request_id: '01J9ZK3QX4M2T8V6N0B5C7D9EF',
                            sample_rate: 1,
                        },
                    },
                ],
            },
        ]);
        expect(consoleError).not.toHaveBeenCalled();
    });

    it('never sends the URL, user agent, IP, geo data or key', async () => {
        const test = setup();
        test.telemetry.finish('injected');
        const [{ init }] = await test.sent();
        for (const value of [
            'HYD',
            '9876543210',
            'gclid',
            'abc123',
            'Pixel 8',
            'Chrome',
            '203.0.113.7',
            'Secunderabad',
            'India',
            '17.4399',
            '78.4983',
            LICENSE_KEY,
        ]) {
            expect(init.body).not.toContain(value);
        }
    });

    it.each([undefined, '', ' '])(
        'sends nothing without a license key (%o)',
        (key) => {
            const test = setup({ env: { NEW_RELIC_LICENSE_KEY: key } });
            test.telemetry.finish('error', { error: new Error('boom') });
            expect(test.fetchImpl).not.toHaveBeenCalled();
            expect(test.context.waitUntil).not.toHaveBeenCalled();
        },
    );

    it('trims the license key', async () => {
        const test = setup({
            env: { NEW_RELIC_LICENSE_KEY: ` ${LICENSE_KEY}\n` },
        });
        test.telemetry.finish('injected');
        const [{ init }] = await test.sent();
        expect(init.headers['Api-Key']).toBe(LICENSE_KEY);
    });

    it('reports a request once', async () => {
        const test = setup();
        test.telemetry.finish('injected');
        test.telemetry.finish('error', { error: new Error('late') });
        const { attributes } = await recordOf(test);
        expect(attributes.outcome).toBe('injected');
    });

    it('still sends where the context has no waitUntil', () => {
        const test = setup({ context: makeContext({ waitUntil: undefined }) });
        test.telemetry.finish('injected');
        expect(test.fetchImpl).toHaveBeenCalledTimes(1);
    });

    it('never throws', () => {
        const brokenEnv = startTelemetry(
            'seo-inject',
            makeRequest(),
            makeContext(),
            {
                env: () => {
                    throw new Error('env unavailable');
                },
            },
        );
        expect(() => brokenEnv.finish('injected')).not.toThrow();

        const fetchImpl = vi.fn();
        const noHeaders = startTelemetry('seo-inject', {}, makeContext(), {
            env: () => LICENSE_KEY,
            fetchImpl,
        });
        expect(() => noHeaders.finish('injected')).not.toThrow();
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('keeps its own attributes over those from set()', async () => {
        const test = setup();
        test.telemetry.set({
            outcome: 'spoofed',
            level: 'debug',
            client: 'googlebot',
            duration_ms: -1,
        });
        test.telemetry.finish('injected');
        const { attributes } = await recordOf(test);
        expect(attributes).toMatchObject({
            outcome: 'injected',
            level: 'info',
            client: 'browser',
            duration_ms: 0,
        });
    });

    it('sends set() attributes through the PII rules', async () => {
        const test = setup();
        test.telemetry.set({
            route_name: 'discover-hyderabad',
            enriched: true,
            enrichment_ms: 7,
            referrer: 'https://www.google.com/search?q=parking+near+me',
            phone: '9876543210',
            lat: 17.4399,
            upstream: { status: 200 },
        });
        test.telemetry.finish('injected');
        const { attributes } = await recordOf(test);
        expect(attributes).toMatchObject({
            route_name: 'discover-hyderabad',
            enriched: true,
            enrichment_ms: 7,
            referrer: 'https://www.google.com/search',
        });
        for (const key of ['phone', 'lat', 'upstream']) {
            expect(attributes).not.toHaveProperty([key]);
        }
    });

    describe('errors', () => {
        it('are reported with scrubbed text', async () => {
            const error = new TypeError(
                'fetch failed for https://www.parkspot.in/spot-details/' +
                    'HYD%23REQ%23104?phone=9876543210 ' +
                    '(owner a.b@example.com, 98765 43210)',
            );
            error.stack =
                `TypeError: ${error.message}\n` +
                '    at handler (file:///var/task/seo-inject.js?v=3:58:33)';
            const test = setup();
            test.telemetry.finish('error', { error });

            const message =
                'fetch failed for https://www.parkspot.in/spot-details/' +
                'HYD%23REQ%23104 (owner [email], [phone])';
            const { attributes } = await recordOf(test);
            expect(attributes).toMatchObject({
                'level': 'error',
                'outcome': 'error',
                'error.class': 'TypeError',
                'error.message': message,
                'error.stack':
                    `TypeError: ${message}\n` +
                    '    at handler (file:///var/task/seo-inject.js:58:33)',
            });
        });

        it('are clipped to what New Relic can query', async () => {
            const test = setup();
            test.telemetry.finish('error', {
                error: new Error('step failed. '.repeat(400)),
            });
            const { attributes } = await recordOf(test);
            expect(attributes['error.message']).toHaveLength(
                MAX_ERROR_TEXT_LENGTH,
            );
            expect(attributes['error.stack']).toHaveLength(
                MAX_ERROR_TEXT_LENGTH,
            );
        });

        it('that are not Errors are reported by their type', async () => {
            const test = setup();
            test.telemetry.finish('error', {
                error: 'upstream said 9876543210',
            });
            const { attributes } = await recordOf(test);
            expect(attributes).toMatchObject({
                'level': 'error',
                'error.class': 'string',
                'error.message': 'upstream said [phone]',
            });
            expect(attributes).not.toHaveProperty(['error.stack']);
        });
    });

    it.each([
        [
            'Mozilla/5.0 (compatible; Googlebot/2.1; ' +
                '+http://www.google.com/bot.html)',
            'googlebot',
        ],
        [
            'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                'Chrome/126.0.6478.126 Mobile Safari/537.36 ' +
                '(compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'googlebot',
        ],
        ['Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)', 'googlebot'],
        ['AdsBot-Google (+http://www.google.com/adsbot.html)', 'google-ads'],
        ['Mediapartners-Google', 'google-ads'],
        [
            'Mozilla/5.0 (compatible; bingbot/2.0; ' +
                '+http://www.bing.com/bingbot.htm)',
            'bingbot',
        ],
        [
            'facebookexternalhit/1.1 ' +
                '(+http://www.facebook.com/externalhit_uatext.php)',
            'facebook',
        ],
        ['WhatsApp/2.23.20.0', 'whatsapp'],
        ['Twitterbot/1.0', 'twitter'],
        [
            'LinkedInBot/1.0 (compatible; Mozilla/5.0; ' +
                'Apache-HttpClient +http://www.linkedin.com)',
            'linkedin',
        ],
        ['Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)', 'slack'],
        ['TelegramBot (like TwitterBot)', 'telegram'],
        [
            'Mozilla/5.0 (compatible; AhrefsBot/7.0; ' +
                '+http://ahrefs.com/robot/)',
            'other-bot',
        ],
        ['curl/8.7.1', 'other-bot'],
        [
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
                '(KHTML, like Gecko) HeadlessChrome/126.0.0.0 Safari/537.36',
            'other-bot',
        ],
        [CHROME_UA, 'browser'],
        [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) ' +
                'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 ' +
                'Mobile/15E148 Safari/604.1',
            'browser',
        ],
        ['', 'none'],
        [null, 'none'],
    ])('classifies the user agent %o as %o', async (userAgent, client) => {
        const test = setup({ request: makeRequest(userAgent) });
        test.telemetry.finish('injected');
        const { attributes } = await recordOf(test);
        expect(attributes.client).toBe(client);
    });

    describe('sampling', () => {
        const sampled = (rate) => ({
            NEW_RELIC_LICENSE_KEY: LICENSE_KEY,
            NEW_RELIC_EDGE_SAMPLE_RATE: rate,
        });

        it('drops the info records the rate leaves out', () => {
            const test = setup({ env: sampled('0.25'), random: () => 0.3 });
            test.telemetry.finish('injected');
            expect(test.fetchImpl).not.toHaveBeenCalled();
            expect(test.context.waitUntil).not.toHaveBeenCalled();
        });

        it('tags the info records it keeps with the rate', async () => {
            const test = setup({ env: sampled('0.25'), random: () => 0.2 });
            test.telemetry.finish('injected');
            const { attributes } = await recordOf(test);
            expect(attributes).toMatchObject({
                level: 'info',
                sample_rate: 0.25,
            });
        });

        it.each([
            ['unchanged', { level: 'warn' }, 'warn'],
            ['error', { error: new Error('boom') }, 'error'],
        ])('always sends %s records', async (outcome, options, level) => {
            const test = setup({ env: sampled('0'), random: () => 0.99 });
            test.telemetry.finish(outcome, options);
            const { attributes } = await recordOf(test);
            expect(attributes).toMatchObject({ level, sample_rate: 1 });
        });

        it('sends no info records at a rate of 0', () => {
            const test = setup({ env: sampled('0'), random: () => 0 });
            test.telemetry.finish('injected');
            expect(test.fetchImpl).not.toHaveBeenCalled();
        });

        it.each(['', ' ', 'abc', '-0.1', '1.5', '50%'])(
            'treats a rate of %o as 1',
            async (rate) => {
                const test = setup({ env: sampled(rate), random: () => 0.999 });
                test.telemetry.finish('injected');
                const { attributes } = await recordOf(test);
                expect(attributes.sample_rate).toBe(1);
            },
        );
    });

    describe('environment', () => {
        const withEnvironment = (value) => ({
            NEW_RELIC_LICENSE_KEY: LICENSE_KEY,
            NEW_RELIC_ENVIRONMENT: value,
        });

        it.each(['uat', ' uat '])(
            'comes from NEW_RELIC_ENVIRONMENT=%o',
            async (value) => {
                const test = setup({ env: withEnvironment(value) });
                test.telemetry.finish('injected');
                const { common } = await recordOf(test);
                expect(common.environment).toBe('uat');
            },
        );

        it.each(['UAT', ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-'), LICENSE_KEY])(
            'falls back to the deploy context for %o, never sending it',
            async (value) => {
                const test = setup({ env: withEnvironment(value) });
                test.telemetry.finish('injected');
                const [{ init }] = await test.sent();
                expect(
                    JSON.parse(init.body)[0].common.attributes,
                ).toMatchObject({ environment: 'production' });
                expect(init.body).not.toContain(value);
            },
        );

        it('is "unknown" without either', async () => {
            const test = setup({ context: makeContext({ deploy: undefined }) });
            test.telemetry.finish('injected');
            const { common } = await recordOf(test);
            expect(common).toEqual({
                'service.name': 'parkspot-edge',
                'environment': 'unknown',
                'edge_region': 'ap-south-1',
            });
        });
    });

    describe('when the Log API fails', () => {
        it('logs the status, never the key', async () => {
            const fetchImpl = vi.fn(
                async () =>
                    new Response('{"error":"invalid license key"}', {
                        status: 403,
                    }),
            );
            const test = setup({ fetchImpl });
            test.telemetry.finish('injected');
            await test.sent();
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(
                '[newrelic] the Log API answered 403',
            );
            expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
                LICENSE_KEY,
            );
        });

        it('logs a network failure', async () => {
            const fetchImpl = vi.fn(async () => {
                throw new TypeError('fetch failed');
            });
            const test = setup({ fetchImpl });
            test.telemetry.finish('injected');
            await test.sent();
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(
                '[newrelic] could not reach the Log API: TypeError: fetch failed',
            );
        });

        it(`gives up after ${SEND_TIMEOUT_MS} ms`, async () => {
            vi.useFakeTimers();
            let signal;
            const fetchImpl = vi.fn(
                (_url, init) =>
                    new Promise((_resolve, reject) => {
                        signal = init.signal;
                        signal.addEventListener('abort', () =>
                            reject(signal.reason),
                        );
                    }),
            );
            const test = setup({ fetchImpl });
            test.telemetry.finish('injected');

            await vi.advanceTimersByTimeAsync(SEND_TIMEOUT_MS - 1);
            expect(signal.aborted).toBe(false);
            await vi.advanceTimersByTimeAsync(1);
            await test.sent();
            expect(consoleError).toHaveBeenCalledExactlyOnceWith(
                expect.stringMatching(
                    /^\[newrelic\] could not reach the Log API: AbortError/,
                ),
            );
        });

        it('releases the response body', async () => {
            const cancel = vi.fn().mockResolvedValue(undefined);
            const fetchImpl = vi.fn().mockResolvedValue({
                ok: true,
                status: 202,
                body: { cancel },
            });
            const test = setup({ fetchImpl });
            test.telemetry.finish('injected');
            await test.sent();
            expect(cancel).toHaveBeenCalledTimes(1);
            expect(consoleError).not.toHaveBeenCalled();
        });
    });
});
