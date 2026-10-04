// @vitest-environment node
// Deployment markers go to NerdGraph as a changeTrackingCreateEvent
// mutation with the values inlined, so no value may end its string
// literal early. A marker that was not recorded must reject, and no
// error may echo the user API key.
import { describe, expect, it, vi } from 'vitest';
import { Buffer } from 'node:buffer';

import {
    NERDGRAPH_API,
    browserEntityGuid,
    deploymentMutation,
    recordDeployment,
} from '../../../scripts/newrelic/change-tracking.js';

// Made up, in the shape of a user API key.
const USER_API_KEY = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');

// The browser app in .env.production.
const GUID = 'NzYyOTAwNXxCUk9XU0VSfEFQUExJQ0FUSU9OfDE1ODkxODUwODk';

const SHA = '0123456789abcdef0123456789abcdef01234567';
const DEPLOY_ID = '6650f1e2a1b2c3d4e5f60718';

const EVENT = Object.freeze({
    entityGuid: GUID,
    version: '0123456789ab',
    commit: SHA,
    deepLink: `https://${DEPLOY_ID}--parkspot.netlify.app`,
    description: 'Netlify production deploy',
    groupId: DEPLOY_ID,
});

const CHANGE_TRACKING_ID = '7d3a8a1e-1c4b-4a3f-9e1d-2b6c8f0a9e55';

function respond(body, { status = 200 } = {}) {
    return new Response(
        typeof body === 'string' ? body : JSON.stringify(body),
        { status, headers: { 'Content-Type': 'application/json' } },
    );
}

function created(messages = []) {
    return respond({
        data: {
            changeTrackingCreateEvent: {
                changeTrackingEvent: { changeTrackingId: CHANGE_TRACKING_ID },
                messages,
            },
        },
    });
}

function record(fetchImpl, overrides = {}) {
    return recordDeployment({
        apiKey: USER_API_KEY,
        fetchImpl,
        ...EVENT,
        ...overrides,
    });
}

async function messageOf(promise) {
    try {
        await promise;
    } catch (error) {
        return error.message;
    }
    throw new Error('expected an error');
}

describe('scripts/newrelic/change-tracking', () => {
    describe('browserEntityGuid()', () => {
        it('encodes the account and browser app IDs', () => {
            expect(browserEntityGuid('7629005', '1589185089')).toBe(GUID);
            expect(Buffer.from(GUID, 'base64url').toString()).toBe(
                '7629005|BROWSER|APPLICATION|1589185089',
            );
        });

        it('leaves out the base64 padding', () => {
            // 23 bytes, which plain base64 pads with "=".
            expect(browserEntityGuid('1', '2')).toBe(
                'MXxCUk9XU0VSfEFQUExJQ0FUSU9OfDI',
            );
        });
    });

    describe('deploymentMutation()', () => {
        it('builds the mutation for one deployment', () => {
            expect(deploymentMutation(EVENT)).toBe(
                'mutation { changeTrackingCreateEvent(changeTrackingEvent: { ' +
                    'categoryAndTypeData: { ' +
                    'kind: { category: "deployment", type: "basic" }, ' +
                    'categoryFields: { deployment: { ' +
                    `version: "0123456789ab", commit: "${SHA}", ` +
                    `deepLink: "https://${DEPLOY_ID}--parkspot.netlify.app" ` +
                    '} } }, ' +
                    `entitySearch: { query: "id = '${GUID}'" }, ` +
                    'description: "Netlify production deploy", ' +
                    `groupId: "${DEPLOY_ID}" }) ` +
                    '{ changeTrackingEvent { changeTrackingId } messages } }',
            );
        });

        it('leaves out the optional fields that are not given', () => {
            const mutation = deploymentMutation({
                entityGuid: GUID,
                version: 'v1',
            });
            expect(mutation).toContain(
                'categoryFields: { deployment: { version: "v1" } } }, ' +
                    `entitySearch: { query: "id = '${GUID}'" } })`,
            );
            expect(mutation).not.toMatch(/commit|deepLink|description|groupId/);
        });

        it('keeps every value inside its string literal', () => {
            const mutation = deploymentMutation({
                entityGuid: GUID,
                version: 'v1',
                description: 'a" }, groupId: "x\n\\',
            });
            expect(mutation).toContain(
                'description: "a\\" }, groupId: \\"x\\n\\\\" })',
            );
            expect(mutation).not.toContain('groupId: "x');
        });
    });

    describe('recordDeployment()', () => {
        it('posts the mutation, with the key only in the API-Key header', async () => {
            const fetchImpl = vi.fn(async () => created());
            await expect(record(fetchImpl)).resolves.toEqual({
                id: CHANGE_TRACKING_ID,
                messages: [],
            });
            expect(fetchImpl).toHaveBeenCalledTimes(1);
            const [url, init] = fetchImpl.mock.calls[0];
            expect(url).toBe(NERDGRAPH_API);
            expect(init.method).toBe('POST');
            expect(init.headers).toEqual({
                'Content-Type': 'application/json',
                'API-Key': USER_API_KEY,
            });
            expect(JSON.parse(init.body)).toEqual({
                query: deploymentMutation(EVENT),
            });
            expect(init.body).not.toContain(USER_API_KEY);
            expect(init.signal).toBeInstanceOf(AbortSignal);
        });

        it('passes on the messages New Relic sends back', async () => {
            const fetchImpl = vi.fn(async () =>
                created(['description was trimmed']),
            );
            await expect(record(fetchImpl)).resolves.toEqual({
                id: CHANGE_TRACKING_ID,
                messages: ['description was trimmed'],
            });
        });

        it('rejects when NerdGraph cannot be reached', async () => {
            const fetchImpl = vi.fn(async () => {
                throw new TypeError('fetch failed');
            });
            expect(await messageOf(record(fetchImpl))).toBe(
                '[newrelic] could not reach NerdGraph: TypeError: fetch failed',
            );
        });

        it('gives up after the timeout', async () => {
            const fetchImpl = (url, { signal }) =>
                new Promise((resolve, reject) => {
                    signal.addEventListener('abort', () =>
                        reject(signal.reason),
                    );
                });
            expect(
                await messageOf(record(fetchImpl, { timeoutMs: 5 })),
            ).toMatch(/^\[newrelic\] could not reach NerdGraph: TimeoutError/);
        });

        it.each([401, 403, 500])(
            'rejects a %i without echoing the key',
            async (status) => {
                const response = respond(
                    { error: `bad key ${USER_API_KEY}` },
                    { status },
                );
                const fetchImpl = vi.fn(async () => response);
                const message = await messageOf(record(fetchImpl));
                expect(message).toBe(`[newrelic] NerdGraph answered ${status}`);
                expect(message).not.toContain(USER_API_KEY);
                // The body was released, not left hanging.
                expect(response.bodyUsed).toBe(true);
            },
        );

        it('rejects GraphQL errors, which come with a 200', async () => {
            const fetchImpl = vi.fn(async () =>
                respond({
                    errors: [
                        { message: 'Entity not found' },
                        { message: 'Not authorized' },
                    ],
                }),
            );
            expect(await messageOf(record(fetchImpl))).toBe(
                '[newrelic] NerdGraph refused the deployment: ' +
                    'Entity not found; Not authorized',
            );
        });

        it('clips long GraphQL errors', async () => {
            const fetchImpl = vi.fn(async () =>
                respond({ errors: [{ message: 'x'.repeat(1000) }] }),
            );
            const message = await messageOf(record(fetchImpl));
            expect(message).toBe(
                '[newrelic] NerdGraph refused the deployment: ' +
                    `${'x'.repeat(300)}...`,
            );
        });

        it('rejects an answer that is not JSON', async () => {
            const fetchImpl = vi.fn(async () => respond('<html>'));
            expect(await messageOf(record(fetchImpl))).toBe(
                '[newrelic] NerdGraph sent back no JSON (SyntaxError)',
            );
        });

        it.each([
            ['no data', {}],
            ['no event', { data: { changeTrackingCreateEvent: null } }],
            [
                'no ID',
                {
                    data: {
                        changeTrackingCreateEvent: {
                            changeTrackingEvent: {},
                            messages: [],
                        },
                    },
                },
            ],
        ])('rejects an answer with %s', async (_label, body) => {
            const fetchImpl = vi.fn(async () => respond(body));
            expect(await messageOf(record(fetchImpl))).toBe(
                '[newrelic] NerdGraph sent back no change tracking ID',
            );
        });
    });
});
