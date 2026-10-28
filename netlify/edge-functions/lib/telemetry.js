// New Relic reporting for edge functions.
//
// No New Relic agent runs on Netlify's Deno edge, so each handled request
// becomes one log record (outcome, timings, status, route, client class)
// posted to the New Relic Log API with a plain fetch. The post goes out
// after the response, through context.waitUntil, with its own timeout,
// and nothing here throws: a New Relic outage or a missing key changes
// nothing for visitors.
//
// Privacy: records carry no URL, user agent, IP or geo data. Attributes
// go through the browser app's PII rules (src/telemetry/sanitize.js), and
// so does error text: query strings, emails, phone numbers and tokens are
// masked (paths are kept, for debugging).
//
// Env vars, set in the Netlify UI with the Functions scope (values in
// netlify.toml never reach edge functions):
//   NEW_RELIC_LICENSE_KEY       ingest license key; unset, nothing is sent
//   NEW_RELIC_ENVIRONMENT       environment tag; defaults to the deploy
//                               context ("production", "deploy-preview",
//                               "branch-deploy")
//   NEW_RELIC_EDGE_SAMPLE_RATE  share of info records to send, 0 to 1
//                               (default 1); warn and error records are
//                               always sent
//
// In New Relic: FROM Log SELECT count(*)
//   WHERE service.name = 'parkspot-edge' FACET edge_function, outcome

import {
    sanitizeAttributes,
    scrubText,
} from '../../../src/telemetry/sanitize.js';

// US datacenter; EU accounts use https://log-api.eu.newrelic.com/log/v1.
export const LOG_API = 'https://log-api.newrelic.com/log/v1';
export const SERVICE_NAME = 'parkspot-edge';
// The send runs after the response, so this only bounds how long a stuck
// request keeps the invocation alive.
export const SEND_TIMEOUT_MS = 3000;
// New Relic keeps the first 4,094 characters of a string queryable.
export const MAX_ERROR_TEXT_LENGTH = 4094;

// Same rule as the browser's environment tag
// (scripts/newrelic/build-info.js).
const ENVIRONMENT = /^[a-z][a-z\d-]{0,31}$/;

// The user agent is never sent, only a class: by name for the crawlers
// and link-preview bots these functions exist for, then any other bot,
// then "browser". First match wins.
const CLIENTS = [
    ['google-ads', /adsbot-google|mediapartners-google/i],
    ['googlebot', /googlebot|google-inspectiontool/i],
    ['bingbot', /bingbot|bingpreview/i],
    ['facebook', /facebookexternalhit|facebookcatalog/i],
    ['whatsapp', /whatsapp/i],
    // "TelegramBot (like TwitterBot)"
    ['telegram', /telegrambot/i],
    ['twitter', /twitterbot/i],
    ['linkedin', /linkedinbot/i],
    ['slack', /slackbot/i],
    [
        'other-bot',
        /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|go-http/i,
    ],
];

function classifyClient(userAgent) {
    if (!userAgent) return 'none';
    const match = CLIENTS.find(([, pattern]) => pattern.test(userAgent));
    return match ? match[0] : 'browser';
}

// An invalid override is ignored, not sent: it may be a secret pasted
// into the wrong variable.
function resolveEnvironment(override, deployContext) {
    const candidates = [override?.trim(), deployContext];
    return (
        candidates.find((value) => value && ENVIRONMENT.test(value)) ??
        'unknown'
    );
}

// Anything but a number from 0 to 1 means "send everything".
function parseSampleRate(value) {
    const rate = Number(value?.trim() || 1);
    return rate >= 0 && rate <= 1 ? rate : 1;
}

function clip(text) {
    return text.length > MAX_ERROR_TEXT_LENGTH
        ? text.slice(0, MAX_ERROR_TEXT_LENGTH)
        : text;
}

function errorAttributes(error) {
    if (!(error instanceof Error)) {
        return {
            'error.class': typeof error,
            'error.message': clip(scrubText(String(error))),
        };
    }
    return {
        'error.class': String(error.name),
        'error.message': clip(scrubText(String(error.message))),
        ...(typeof error.stack === 'string' && {
            'error.stack': clip(scrubText(error.stack)),
        }),
    };
}

async function send(body, licenseKey, fetchImpl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    try {
        const response = await fetchImpl(LOG_API, {
            method: 'POST',
            headers: {
                'Api-Key': licenseKey,
                'Content-Type': 'application/json',
            },
            body,
            signal: controller.signal,
        });
        if (!response.ok) {
            // 403 is a wrong key. The key itself is never logged.
            console.error(`[newrelic] the Log API answered ${response.status}`);
        }
        // Release the connection; the body only holds a request ID.
        await response.body?.cancel();
    } catch (error) {
        console.error(`[newrelic] could not reach the Log API: ${error}`);
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Start reporting one edge function invocation. Add attributes with set()
 * along the way, then call finish() once, right before returning the
 * response: it queues the record and returns at once.
 * @param {string} functionName e.g. "seo-inject"
 * @param {Request} request
 * @param {object} context the Netlify edge function context
 * @param {object} [deps] test seams
 * @param {(name: string) => string | undefined} [deps.env]
 * @param {typeof fetch} [deps.fetchImpl]
 * @param {() => number} [deps.now]
 * @param {() => number} [deps.random]
 * @return {{
 *     elapsed: () => number,
 *     set: (attributes: Record<string, unknown>) => void,
 *     finish: (
 *         outcome: string,
 *         options?: { level?: 'info' | 'warn' | 'error', error?: unknown },
 *     ) => void,
 * }}
 */
export function startTelemetry(
    functionName,
    request,
    context,
    {
        env = (name) => globalThis.Netlify?.env.get(name),
        fetchImpl = fetch,
        now = Date.now,
        random = Math.random,
    } = {},
) {
    const startedAt = now();
    const attributes = {};
    let finished = false;

    return {
        // Milliseconds since startTelemetry(), for timing the steps.
        elapsed: () => now() - startedAt,

        set(values) {
            Object.assign(attributes, values);
        },

        // `level` defaults to "error" with an error, "info" otherwise;
        // only "info" records are sampled. Only the first call counts.
        finish(outcome, { level, error } = {}) {
            if (finished) return;
            finished = true;
            try {
                const licenseKey = env('NEW_RELIC_LICENSE_KEY')?.trim();
                if (!licenseKey) return;
                const severity =
                    level ?? (error === undefined ? 'info' : 'error');
                const sampleRate =
                    severity === 'info'
                        ? parseSampleRate(env('NEW_RELIC_EDGE_SAMPLE_RATE'))
                        : 1;
                if (random() >= sampleRate) return;

                const record = {
                    timestamp: startedAt,
                    message: `${functionName} ${outcome}`,
                    attributes: {
                        ...sanitizeAttributes(attributes),
                        level: severity,
                        edge_function: functionName,
                        outcome,
                        duration_ms: now() - startedAt,
                        client: classifyClient(
                            request.headers.get('user-agent'),
                        ),
                        request_id: context.requestId,
                        // Each record stands for 1 / sample_rate requests.
                        sample_rate: sampleRate,
                        ...(error !== undefined && errorAttributes(error)),
                    },
                };
                const body = JSON.stringify([
                    {
                        common: {
                            attributes: {
                                'service.name': SERVICE_NAME,
                                'environment': resolveEnvironment(
                                    env('NEW_RELIC_ENVIRONMENT'),
                                    context.deploy?.context,
                                ),
                                'deploy_id': context.deploy?.id,
                                'edge_region': context.server?.region,
                            },
                        },
                        logs: [record],
                    },
                ]);
                const sending = send(body, licenseKey, fetchImpl);
                // Keeps the invocation alive until the send settles,
                // without holding back the response.
                context.waitUntil?.(sending);
            } catch {
                // Reporting must never break a page.
            }
        },
    };
}
