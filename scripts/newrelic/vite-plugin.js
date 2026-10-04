// Injects the New Relic Browser agent into index.html at build time.
//
// The agent used to be the copy/paste snippet from the New Relic UI,
// pasted into index.html: one hard-coded config for every environment
// (local dev included), no PII obfuscation, and an agent version that
// only moved when someone pasted a new snippet. This plugin builds the
// same snippet from:
//   - NEW_RELIC_* env vars (.env.production, Netlify env); nothing is
//     injected unless NEW_RELIC_BROWSER_ENABLED is "true",
//   - the vendored loader in ./vendor, checked against LOADER_SHA256,
//   - OBFUSCATION_RULES from src/telemetry/sanitize.js as
//     `init.obfuscate`, so what the agent collects on its own (uncaught
//     errors, AJAX and page URLs, interaction names) is masked like what
//     the app reports through `@/telemetry`.
//
// The snippet replaces PLACEHOLDER in index.html, right after GTM, so it
// runs before the app bundle and sees errors thrown while the page
// boots. vite-ssg renders every prerendered page from the built
// index.html, so those pages get it too. The loader fetches the rest of
// the agent (same version) from js-agent.newrelic.com.
//
// Env vars:
//   NEW_RELIC_BROWSER_ENABLED            "true" to inject the agent
//   NEW_RELIC_ACCOUNT_ID                 account that owns the app
//   NEW_RELIC_TRUST_KEY                  parent account of a sub-account
//                                        (defaults to the account ID)
//   NEW_RELIC_BROWSER_APPLICATION_ID     browser app ID
//   NEW_RELIC_BROWSER_LICENSE_KEY        browser key (NRBR-...)
//   NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS comma-separated API origins
//                                        that get W3C trace headers
//   NEW_RELIC_ENVIRONMENT                see build-info.js
//
// It also turns on hidden source maps for the client build when the
// real environment has NEW_RELIC_SOURCEMAPS="true". Only
// netlify/plugins/newrelic sets it, and that plugin uploads the maps and
// deletes them before the deploy; .env files can't set it, so a build
// nobody cleans up after never has maps.
//
// Everything here ships in public HTML. The browser key is public by
// design; license, ingest and user API keys must never reach this
// plugin, which is why every value is checked against a strict format
// and never echoed in errors.

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { OBFUSCATION_RULES } from '../../src/telemetry/sanitize.js';
import { resolveBuildInfo } from './build-info.js';

export const PLACEHOLDER = '<!-- new-relic-browser-agent -->';

// To upgrade the agent, see vendor/README.md.
export const LOADER_VERSION = '1.323.0';
export const LOADER_SHA256 =
    '86d513c034d367c6c43739b594854177c9ffb4f045405ef3187c3030e2901209';
export const LOADER_PATH = fileURLToPath(
    new URL(`./vendor/nr-loader-spa-${LOADER_VERSION}.min.js`, import.meta.url),
);

// US datacenter; EU accounts use bam.eu01.nr-data.net.
const BEACON = 'bam.nr-data.net';

const BROWSER_KEY = /^NR(?:BR|JS)-\w+$/;
const NUMERIC_ID = /^\d+$/;
const ORIGIN = /^https?:\/\/[a-z\d.-]+(?::\d+)?$/i;

// XHR/fetch calls that are not worth an AjaxRequest event each:
// analytics beacons that burn ingest and say nothing about our own
// APIs. Entries match as a hostname suffix. The agent already skips its
// own beacon.
const AJAX_DENY_LIST = [
    // GTM, GA4 and Google Ads
    'googletagmanager.com',
    'google-analytics.com',
    'analytics.google.com',
    'doubleclick.net',
    'googleadservices.com',
    // Mapbox GL usage telemetry
    'events.mapbox.com',
];

function readVar(env, name, pattern, description, fallback) {
    const value = env[name]?.trim() || fallback;
    if (!value || !pattern.test(value)) {
        throw new Error(`[newrelic] ${name} must be ${description}`);
    }
    return value;
}

function parseOrigins(value = '') {
    const origins = value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    origins.forEach((origin, index) => {
        if (!ORIGIN.test(origin)) {
            throw new Error(
                `[newrelic] NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS entry ` +
                    `${index + 1} is not an origin like ` +
                    'https://maya-in.parkspot.in',
            );
        }
    });
    return origins;
}

/**
 * Build NREUM.init, NREUM.loader_config and NREUM.info from env vars, or
 * return null when the agent is disabled. A half-configured or unsafe
 * setup throws, so it fails the build instead of shipping pages that
 * silently report nothing (or leak a key).
 * @param {Record<string, string | undefined>} env
 * @return {{ init: object, loaderConfig: object, info: object } | null}
 */
export function resolveAgentConfig(env) {
    const enabled = env.NEW_RELIC_BROWSER_ENABLED?.trim() || 'false';
    if (enabled !== 'true' && enabled !== 'false') {
        throw new Error(
            '[newrelic] NEW_RELIC_BROWSER_ENABLED must be "true" or "false"',
        );
    }
    if (enabled === 'false') return null;

    const accountID = readVar(
        env,
        'NEW_RELIC_ACCOUNT_ID',
        NUMERIC_ID,
        'a numeric account ID',
    );
    // Only sub-accounts need it: their parent account's ID.
    const trustKey = readVar(
        env,
        'NEW_RELIC_TRUST_KEY',
        NUMERIC_ID,
        'a numeric account ID',
        accountID,
    );
    const applicationID = readVar(
        env,
        'NEW_RELIC_BROWSER_APPLICATION_ID',
        NUMERIC_ID,
        'a numeric browser application ID',
    );
    const licenseKey = readVar(
        env,
        'NEW_RELIC_BROWSER_LICENSE_KEY',
        BROWSER_KEY,
        'a browser key (NRBR-... or NRJS-...); license, ingest and user ' +
            'API keys must never ship to the browser',
    );
    const { environment, version } = resolveBuildInfo(env);

    return {
        init: {
            distributed_tracing: {
                enabled: true,
                // W3C trace context only. Same-origin calls always carry
                // it; cross-origin APIs only once listed here, and their
                // CORS config must allow the traceparent and tracestate
                // headers first or every preflight fails.
                exclude_newrelic_header: true,
                cors_use_newrelic_header: false,
                cors_use_tracecontext_headers: true,
                allowed_origins: parseOrigins(
                    env.NEW_RELIC_BROWSER_DT_ALLOWED_ORIGINS,
                ),
            },
            ajax: {
                deny_list: AJAX_DENY_LIST,
                // Request and response bodies carry phone numbers, Aadhaar
                // numbers, KYC images and payment details. Never capture
                // them.
                capture_payloads: 'none',
            },
            performance: { capture_measures: true },
            privacy: { cookies_enabled: true },
            // Session replay builds on the session trace.
            session_trace: { enabled: true },
            session_replay: {
                enabled: true,
                // Started by enableSessionReplay() (@/telemetry) once the
                // visitor has seen the consent notice. Which sessions are
                // kept (those with an error) is set in the New Relic UI.
                autoStart: false,
                preload: false,
                mask_all_inputs: true,
                mask_text_selector: '*',
            },
            // The rest of the agent runs under the site's disclosure-only
            // posture, like GTM (see the Consent Mode block in
            // index.html); only session replay waits for the notice.
            browser_consent_mode: { enabled: false },
        },
        loaderConfig: {
            accountID,
            trustKey,
            agentID: applicationID,
            licenseKey,
            applicationID,
        },
        info: {
            beacon: BEACON,
            errorBeacon: BEACON,
            licenseKey,
            applicationID,
            sa: 1,
            // Page-level attributes on every event from the first harvest.
            jsAttributes: {
                environment,
                ...(version && { 'application.version': version }),
            },
        },
    };
}

/**
 * Read the vendored loader and check it is the one we pinned.
 * @param {string} [path]
 * @return {string}
 */
export function readLoader(path = LOADER_PATH) {
    const bytes = fs.readFileSync(path);
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (digest !== LOADER_SHA256) {
        throw new Error(
            `[newrelic] ${path} does not match LOADER_SHA256 (got ` +
                `${digest}); see scripts/newrelic/vendor/README.md`,
        );
    }
    return bytes.toString('utf8');
}

// JSON that is safe inside an inline <script>: no "</script>" or "<!--"
// can appear, whatever the strings hold.
function inlineJson(value) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

// The agent would apply a string rule literally, and only once, so the
// rules go in as RegExp objects, which JSON can't express.
function inlineRules(rules) {
    const items = rules.map(
        ({ regex, replacement }) =>
            `{regex:new RegExp(${inlineJson(regex.source)},` +
            `${inlineJson(regex.flags)}),` +
            `replacement:${inlineJson(replacement)}}`,
    );
    return `[${items.join(',')}]`;
}

/**
 * The <script> to put in place of PLACEHOLDER.
 * @param {{ init: object, loaderConfig: object, info: object }} config
 * @param {string} loader the loader source
 * @return {string}
 */
export function renderSnippet(config, loader) {
    // The loader goes in as is; anything that could end the script
    // early or switch the HTML parser into a comment state is refused.
    if (/<\/script|<!--/i.test(loader)) {
        throw new Error('[newrelic] the loader cannot be inlined safely');
    }
    return [
        '<script type="text/javascript">',
        `window.NREUM||(NREUM={});NREUM.init=${inlineJson(config.init)};`,
        `NREUM.init.obfuscate=${inlineRules(OBFUSCATION_RULES)};`,
        `NREUM.loader_config=${inlineJson(config.loaderConfig)};`,
        `NREUM.info=${inlineJson(config.info)};`,
        loader,
        '</script>',
    ].join('\n');
}

/**
 * Vite plugin: swaps PLACEHOLDER in index.html for the agent snippet
 * (or for nothing when the agent is disabled). A build without the
 * placeholder fails, so the agent can't disappear unnoticed. Also turns
 * on hidden source maps when NEW_RELIC_SOURCEMAPS asks for them.
 * @return {import('vite').Plugin}
 */
export function newRelicBrowser() {
    let snippet = '';
    let isBuild = false;

    return {
        name: 'newrelic-browser',
        config(_config, { command, isSsrBuild }) {
            // "hidden" writes the maps but leaves out the
            // sourceMappingURL comment, so browsers never ask for them.
            // The SSR bundle never ships, so it needs none.
            if (
                command === 'build' &&
                !isSsrBuild &&
                process.env.NEW_RELIC_SOURCEMAPS === 'true'
            ) {
                return { build: { sourcemap: 'hidden' } };
            }
        },
        configResolved(config) {
            isBuild = config.command === 'build';
            // Like Vite: .env.[mode] files, overridden by real env vars
            // (Netlify UI and netlify.toml contexts).
            const env = loadEnv(config.mode, config.envDir, [
                'NEW_RELIC_',
                'CONTEXT',
                'COMMIT_REF',
            ]);
            const agentConfig = resolveAgentConfig(env);
            snippet = agentConfig
                ? renderSnippet(agentConfig, readLoader())
                : '';
        },
        transformIndexHtml(html) {
            if (!html.includes(PLACEHOLDER)) {
                if (isBuild) {
                    throw new Error(
                        `[newrelic] ${PLACEHOLDER} is missing from index.html`,
                    );
                }
                return html;
            }
            // A function, so "$1"-style patterns in the loader are kept.
            return html.replace(PLACEHOLDER, () => snippet);
        },
    };
}
