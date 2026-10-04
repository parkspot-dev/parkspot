// Release metadata for everything that reports a build to New Relic, so
// the browser agent's page attributes and the deploy markers agree on
// what "environment" and "version" mean.
//
// Netlify sets CONTEXT ("production", "deploy-preview", "branch-deploy")
// and COMMIT_REF in the build environment:
// https://docs.netlify.com/configure-builds/environment-variables/

// Long enough to stay unique, short enough for a chart legend.
const VERSION_LENGTH = 12;

// Lowercase only, so "Production" and "production" can't split a facet.
// It also keeps a mistyped NRAK-... key out of the public page.
const ENVIRONMENT = /^[a-z][a-z\d-]{0,31}$/;
const COMMIT = /^[\da-f]{7,40}$/i;

/**
 * Resolve the `environment` and `application.version` of this build.
 * NEW_RELIC_ENVIRONMENT wins over Netlify's CONTEXT; builds outside
 * Netlify are "local" and have no version. Rejected values are not
 * echoed: a secret pasted into the wrong variable would end up in the
 * build log.
 * @param {Record<string, string | undefined>} env
 * @return {{ environment: string, version: string | undefined }}
 */
export function resolveBuildInfo(env) {
    const environment =
        env.NEW_RELIC_ENVIRONMENT?.trim() || env.CONTEXT?.trim() || 'local';
    if (!ENVIRONMENT.test(environment)) {
        throw new Error(
            '[newrelic] NEW_RELIC_ENVIRONMENT (or CONTEXT) must be lowercase ' +
                'letters, digits and "-", start with a letter and be at most ' +
                '32 characters',
        );
    }
    const commit = env.COMMIT_REF?.trim();
    if (commit && !COMMIT.test(commit)) {
        throw new Error('[newrelic] COMMIT_REF must be a git commit SHA');
    }
    return {
        environment,
        version: commit ? commit.slice(0, VERSION_LENGTH) : undefined,
    };
}
