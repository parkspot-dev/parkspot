// @vitest-environment node
// The seo-inject handler with Netlify's runtime stubbed out: what
// visitors get back, and the New Relic record each handled request
// leaves behind. Whatever happens to telemetry, the page must not change.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import seoInject from '../../netlify/edge-functions/seo-inject.js';
import { LOG_API } from '../../netlify/edge-functions/lib/telemetry.js';

// Made up, in the shape of an ingest license key.
const LICENSE_KEY = ['0123456789abcdef0123456789abcdef0123', 'NRAL'].join('');

const RTDB = 'https://parkspot-a4313-default-rtdb.firebaseio.com';

const GOOGLEBOT_UA =
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const SHELL = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '    <title>ParkSpot</title>',
    '    <meta name="description" content="Monthly car parking">',
    '</head>',
    '<body><div id="app"></div></body>',
    '</html>',
].join('\n');

function htmlResponse(html = SHELL) {
    return new Response(html, {
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=0, must-revalidate',
            'content-length': String(new TextEncoder().encode(html).length),
        },
    });
}

function makeRequest(path, userAgent = GOOGLEBOT_UA) {
    return new Request(`https://www.parkspot.in${path}`, {
        headers: { 'user-agent': userAgent },
    });
}

function makeContext(upstream = htmlResponse()) {
    return {
        requestId: '01J9ZK3QX4M2T8V6N0B5C7D9EF',
        deploy: { context: 'production', id: '6650f1e2a1b2c3d4e5f60718' },
        server: { region: 'ap-south-1' },
        ip: '203.0.113.7',
        next: vi.fn(async () => upstream),
        waitUntil: vi.fn(),
    };
}

describe('netlify/edge-functions/seo-inject', () => {
    let env;
    let fetchMock;
    let rtdb;
    let consoleError;

    beforeEach(() => {
        env = { NEW_RELIC_LICENSE_KEY: LICENSE_KEY };
        rtdb = vi.fn(async () => new Response('null', { status: 200 }));
        fetchMock = vi.fn(async (url, init) => {
            if (url === LOG_API) return new Response('{}', { status: 202 });
            if (url.startsWith(RTDB)) return rtdb(url, init);
            throw new Error(`unexpected fetch: ${url}`);
        });
        vi.stubGlobal('fetch', fetchMock);
        vi.stubGlobal('Netlify', { env: { get: (name) => env[name] } });
        consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    // Wait for the queued sends, then return the records posted, each
    // with its common attributes merged in.
    async function records(context) {
        await Promise.all(
            context.waitUntil.mock.calls.map(([promise]) => promise),
        );
        return fetchMock.mock.calls
            .filter(([url]) => url === LOG_API)
            .flatMap(([, init]) => JSON.parse(init.body))
            .flatMap(({ common, logs }) =>
                logs.map((log) => ({
                    ...common.attributes,
                    ...log.attributes,
                })),
            );
    }

    it('leaves other paths alone', async () => {
        const context = makeContext();
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104/reviews'),
            context,
        );
        expect(response).toBeUndefined();
        expect(context.next).not.toHaveBeenCalled();
        expect(context.waitUntil).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('injects spot-detail metadata and reports it', async () => {
        const context = makeContext();
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );

        const html = await response.text();
        expect(html).toMatch(/<title>[^<]*#104[^<]*Hyderabad[^<]*<\/title>/);
        expect(html).toContain('<div id="app"></div>');
        expect(response.status).toBe(200);
        expect(response.headers.get('cache-control')).toBe(
            'public, max-age=0, must-revalidate',
        );
        expect(response.headers.get('content-length')).toBeNull();

        expect(context.waitUntil).toHaveBeenCalledTimes(1);
        const [record] = await records(context);
        expect(record).toMatchObject({
            'service.name': 'parkspot-edge',
            'environment': 'production',
            'edge_function': 'seo-inject',
            'outcome': 'injected',
            'level': 'info',
            'route_name': 'spot-detail',
            'status': 200,
            'client': 'googlebot',
        });
        expect(record.upstream_ms).toEqual(expect.any(Number));
        expect(record.duration_ms).toEqual(expect.any(Number));
        // The spot ID stays out of New Relic logs.
        const [[, init]] = fetchMock.mock.calls;
        expect(init.body).not.toContain('HYD');
        expect(consoleError).not.toHaveBeenCalled();
    });

    it('reports a shell it could not rewrite as a warning', async () => {
        const shell = '<html><body><div id="app"></div></body></html>';
        const context = makeContext(htmlResponse(shell));
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );
        expect(await response.text()).toBe(shell);
        const [record] = await records(context);
        expect(record).toMatchObject({ outcome: 'unchanged', level: 'warn' });
    });

    it('passes non-HTML responses through untouched', async () => {
        const upstream = new Response('{"ok":true}', {
            headers: { 'content-type': 'application/json' },
        });
        const context = makeContext(upstream);
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );
        expect(response).toBe(upstream);
        const [record] = await records(context);
        expect(record).toMatchObject({ outcome: 'not_html', level: 'info' });
    });

    it('falls through on an error, and reports it', async () => {
        const error = new Error('upstream down');
        const context = makeContext();
        context.next.mockRejectedValue(error);
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );
        expect(response).toBeUndefined();
        expect(consoleError).toHaveBeenCalledWith(
            '[seo-inject] fell through due to error:',
            error,
        );
        const [record] = await records(context);
        expect(record).toMatchObject({
            'outcome': 'error',
            'level': 'error',
            'route_name': 'spot-detail',
            'error.class': 'Error',
            'error.message': 'upstream down',
        });
    });

    it('serves the page as usual without a license key', async () => {
        delete env.NEW_RELIC_LICENSE_KEY;
        const context = makeContext();
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );
        expect(await response.text()).toContain('#104');
        expect(context.waitUntil).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('serves the page as usual when New Relic is down', async () => {
        fetchMock.mockRejectedValue(new TypeError('fetch failed'));
        const context = makeContext();
        const response = await seoInject(
            makeRequest('/spot-details/HYD%23REQ%23104'),
            context,
        );
        expect(await response.text()).toContain('#104');
        await records(context);
        expect(consoleError).toHaveBeenCalledExactlyOnceWith(
            '[newrelic] could not reach the Log API: TypeError: fetch failed',
        );
    });

    // Area pages are prerendered now; the branch is a rollback hatch.
    describe('area pages', () => {
        it('reports the enrichment lookup', async () => {
            rtdb.mockImplementation(async () =>
                Response.json({ Sites: [{ ID: 'A' }, { ID: 'B' }] }),
            );
            const context = makeContext();
            const response = await seoInject(
                makeRequest('/hyderabad/parking-near-gachibowli/'),
                context,
            );
            expect(await response.text()).toContain(
                '2 verified parking spots available.',
            );
            const [record] = await records(context);
            expect(record).toMatchObject({
                outcome: 'injected',
                route_name: 'discover-hyderabad',
                enriched: true,
            });
            expect(record.enrichment_ms).toEqual(expect.any(Number));
        });

        it('reports a failed lookup', async () => {
            const context = makeContext();
            await seoInject(
                makeRequest('/Bangalore/parking-near-marathahalli/'),
                context,
            );
            const [record] = await records(context);
            expect(record).toMatchObject({
                outcome: 'injected',
                route_name: 'discover',
                enriched: false,
            });
        });
    });
});
