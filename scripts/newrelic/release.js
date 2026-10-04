// What netlify/plugins/newrelic needs to hand a build to New Relic: where
// to upload its source maps, and the deployment marker to record. Read
// from the same env vars as the browser agent (vite-plugin.js), so maps
// and markers land on the app the pages report to.
//
// Env vars, besides the agent's:
//   NEW_RELIC_API_KEY           user API key (NRAK-...). Netlify UI only,
//                               Builds scope; nothing is released
//                               without it.
//   NEW_RELIC_SOURCEMAP_ORIGIN  where the scripts are served from, when
//                               that isn't Netlify's URL (production) or
//                               DEPLOY_PRIME_URL (other contexts), e.g. a
//                               custom domain on a branch deploy
// and Netlify's CONTEXT, COMMIT_REF, URL, DEPLOY_PRIME_URL, DEPLOY_ID and
// DEPLOY_URL:
// https://docs.netlify.com/configure-builds/environment-variables/

import { resolveBuildInfo } from './build-info.js';
import { browserEntityGuid } from './change-tracking.js';
import { resolveAgentConfig } from './vite-plugin.js';

const USER_API_KEY = /^NRAK-[A-Z\d]+$/;
const ORIGIN = /^https?:\/\/[a-z\d.-]+(?::\d+)?$/i;
const DEPLOY_ID = /^[\da-f]{24}$/i;

// The first value that is set, without trailing slashes.
function readOrigin(...values) {
    const value = values.map((origin) => origin?.trim()).find(Boolean);
    return value?.replace(/\/+$/, '');
}

/**
 * Resolve the release of this build, or null when there is nothing to
 * release: the agent is off, or NEW_RELIC_API_KEY is not set. A value
 * that is set but wrong throws, and is not echoed.
 *
 * Source maps go up from every deploy context. `deployment` is only set
 * for production deploys with a commit: every context reports to the
 * same browser app, and markers from previews would clutter production's
 * charts.
 * @param {Record<string, string | undefined>} env
 * @return {null | {
 *     apiKey: string,
 *     accountId: string,
 *     applicationId: string,
 *     entityGuid: string,
 *     environment: string,
 *     version: string | undefined,
 *     commit: string | undefined,
 *     origin: string,
 *     deployment: null | {
 *         description: string,
 *         groupId?: string,
 *         deepLink?: string,
 *     },
 * }}
 */
export function resolveRelease(env) {
    const agent = resolveAgentConfig(env);
    const apiKey = env.NEW_RELIC_API_KEY?.trim();
    if (!agent || !apiKey) return null;
    if (!USER_API_KEY.test(apiKey)) {
        throw new Error(
            '[newrelic] NEW_RELIC_API_KEY must be a user API key ' +
                '(NRAK-...); license and browser keys cannot upload source ' +
                'maps or record deployments',
        );
    }
    const { accountID: accountId, applicationID: applicationId } =
        agent.loaderConfig;
    const { environment, version } = resolveBuildInfo(env);
    const production = env.CONTEXT?.trim() === 'production';
    const origin = readOrigin(
        env.NEW_RELIC_SOURCEMAP_ORIGIN,
        production ? env.URL : env.DEPLOY_PRIME_URL,
    );
    if (!origin || !ORIGIN.test(origin)) {
        throw new Error(
            "[newrelic] NEW_RELIC_SOURCEMAP_ORIGIN (or Netlify's URL and " +
                'DEPLOY_PRIME_URL) must be the origin the scripts are ' +
                'served from, like https://www.parkspot.in',
        );
    }
    let deployment = null;
    if (production && version) {
        deployment = { description: `Netlify ${environment} deploy` };
        // Both are optional, so a value in an unexpected shape is left
        // out rather than failing the marker.
        const deployId = env.DEPLOY_ID?.trim();
        if (deployId && DEPLOY_ID.test(deployId)) {
            deployment.groupId = deployId;
        }
        const deployUrl = readOrigin(env.DEPLOY_URL);
        if (deployUrl && ORIGIN.test(deployUrl)) {
            deployment.deepLink = deployUrl;
        }
    }
    return {
        apiKey,
        accountId,
        applicationId,
        entityGuid: browserEntityGuid(accountId, applicationId),
        environment,
        version,
        // resolveBuildInfo() made sure it is a SHA.
        commit: version && env.COMMIT_REF.trim(),
        origin,
        deployment,
    };
}
