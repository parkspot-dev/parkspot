// Netlify build plugin: hands every build to New Relic Browser.
//   onPreBuild   turns on hidden source maps for the build command
//                (NEW_RELIC_SOURCEMAPS, read by
//                scripts/newrelic/vite-plugin.js)
//   onPostBuild  uploads them to the browser app, then deletes every map
//                from the publish directory, before the deploy
//   onSuccess    records a deployment marker, for production deploys
//
// It needs NEW_RELIC_API_KEY, a user key (see README.md). Without it,
// all the plugin does is make sure no source map is deployed. New Relic
// problems never block a deploy: they end up as warnings in the deploy
// log and summary. The build fails only if a map, which holds the original
// source, might be published: if the maps can't be listed or deleted.
//
// Netlify only accepts event handlers as exports.

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { recordDeployment } from '../../../scripts/newrelic/change-tracking.js';
import { resolveRelease } from '../../../scripts/newrelic/release.js';
import {
    deleteSourcemaps,
    findSourcemaps,
    uploadSourcemaps,
} from '../../../scripts/newrelic/sourcemaps.js';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));

// The env the build command sees, read the way the Vite plugin reads it:
// .env.production, overridden by real env vars (vite-ssg builds in
// production mode).
function readRelease() {
    return resolveRelease({
        ...process.env,
        ...loadEnv('production', ROOT, 'NEW_RELIC_'),
    });
}

export function onPreBuild({ netlifyConfig, constants }) {
    let release;
    try {
        release = readRelease();
    } catch (error) {
        // onSuccess fails the plugin with the same message, once the
        // deploy is out.
        console.warn(`${error.message}: no source maps or deployment marker`);
        return;
    }
    if (!release) {
        console.log(
            '[newrelic] NEW_RELIC_API_KEY is not set or the browser agent ' +
                'is off: no source maps or deployment marker',
        );
        return;
    }
    if (constants.IS_LOCAL) {
        console.log(
            '[newrelic] local build: no source maps or deployment marker',
        );
        return;
    }
    // Reaches the build command's env, like any variable set in the UI.
    netlifyConfig.build.environment.NEW_RELIC_SOURCEMAPS = 'true';
    console.log(`[newrelic] hidden source maps on, for ${release.origin}`);
}

// "3 x New Relic answered 403" for each distinct reason.
function describeFailures(failed) {
    const counts = new Map();
    for (const { reason } of failed) {
        counts.set(reason, (counts.get(reason) ?? 0) + 1);
    }
    return [...counts].map(([reason, count]) => `${count} x ${reason}`);
}

async function upload(publishDir, files, constants, utils) {
    let release = null;
    if (!constants.IS_LOCAL) {
        try {
            release = readRelease();
        } catch {
            // Already reported by onPreBuild, and again by onSuccess.
        }
    }
    if (!release) {
        console.warn(
            `[newrelic] deleting ${files.length} source maps that were ` +
                'not asked for',
        );
        return;
    }
    const result = await uploadSourcemaps({
        publishDir,
        files,
        origin: release.origin,
        applicationId: release.applicationId,
        apiKey: release.apiKey,
        commit: release.commit,
    });
    const sent = result.uploaded.length + result.existing.length;
    const total = sent + result.failed.length;
    const failures = describeFailures(result.failed);
    console.log(
        `[newrelic] ${result.uploaded.length} source maps uploaded, ` +
            `${result.existing.length} already there, for ${release.origin}`,
    );
    if (result.skipped.length) {
        console.log(
            `[newrelic] ${result.skipped.length} source maps have no ` +
                'script next to them (CSS maps, for one): not uploaded',
        );
    }
    for (const failure of failures) {
        console.warn(`[newrelic] source maps not uploaded: ${failure}`);
    }
    utils.status.show({
        title: 'New Relic source maps',
        summary:
            `${sent} of ${total} source maps uploaded to New Relic, ` +
            'then removed from the deploy',
        ...(failures.length > 0 && {
            text: `Not uploaded: ${failures.join('; ')}`,
        }),
    });
}

export async function onPostBuild({ constants, utils }) {
    const publishDir = path.resolve(constants.PUBLISH_DIR);
    let files;
    try {
        files = await findSourcemaps(publishDir);
    } catch (error) {
        // Throws, so nothing below runs.
        utils.build.failBuild(
            '[newrelic] could not look for source maps to delete',
            { error },
        );
    }
    if (!files.length) {
        if (process.env.NEW_RELIC_SOURCEMAPS === 'true') {
            console.warn(
                '[newrelic] source maps were asked for, but the build ' +
                    'wrote none: is newRelicBrowser() still in ' +
                    'vite.config.js?',
            );
        }
        return;
    }
    try {
        await upload(publishDir, files, constants, utils);
    } catch (error) {
        console.warn(`[newrelic] could not upload the source maps: ${error}`);
    } finally {
        try {
            await deleteSourcemaps(publishDir, files);
        } catch (error) {
            utils.build.failBuild(
                '[newrelic] could not delete the source maps, so the build ' +
                    'was stopped before they could be deployed',
                { error },
            );
        }
    }
}

export async function onSuccess({ constants, utils }) {
    if (constants.IS_LOCAL) return;
    let release;
    try {
        release = readRelease();
    } catch (error) {
        utils.build.failPlugin(
            `${error.message}: no source maps or deployment marker for ` +
                'this deploy',
        );
        return;
    }
    if (!release?.deployment) return;
    const { apiKey, entityGuid, version, commit, deployment } = release;
    try {
        const { id, messages } = await recordDeployment({
            apiKey,
            entityGuid,
            version,
            commit,
            ...deployment,
        });
        console.log(`[newrelic] deployment marker for ${version}: ${id}`);
        for (const message of messages) {
            console.warn(`[newrelic] NerdGraph: ${message}`);
        }
    } catch (error) {
        // A retry could record the deploy twice, so there is none.
        utils.build.failPlugin(
            `${error.message}: no deployment marker for this deploy (the ` +
                'deploy itself is fine)',
        );
    }
}
