// @vitest-environment node
// The release config decides where source maps are uploaded for and
// which deploys get a marker. It must stay null (nothing released) until
// both the agent and a user API key are set, refuse a value in the wrong
// shape without echoing it, and only mark production deploys.
import { describe, expect, it } from 'vitest';

import { resolveRelease } from '../../../scripts/newrelic/release.js';

const ENABLED = Object.freeze({
    NEW_RELIC_BROWSER_ENABLED: 'true',
    NEW_RELIC_ACCOUNT_ID: '7629005',
    NEW_RELIC_BROWSER_APPLICATION_ID: '1589185089',
    NEW_RELIC_BROWSER_LICENSE_KEY: 'NRBR-b5f8ce862e40dfb4cd2',
});

// Made-up values in the shape of server-side keys.
const USER_API_KEY = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');
const LICENSE_KEY = ['0123456789abcdef0123456789abcdef0123', 'NRAL'].join('');

const SHA = '0123456789abcdef0123456789abcdef01234567';
const DEPLOY_ID = '6650f1e2a1b2c3d4e5f60718';

// What Netlify sets on a production build.
const PRODUCTION = Object.freeze({
    ...ENABLED,
    NEW_RELIC_API_KEY: USER_API_KEY,
    CONTEXT: 'production',
    COMMIT_REF: SHA,
    URL: 'https://www.parkspot.in',
    DEPLOY_PRIME_URL: 'https://master--parkspot.netlify.app',
    DEPLOY_ID,
    DEPLOY_URL: `https://${DEPLOY_ID}--parkspot.netlify.app`,
});

const PREVIEW = Object.freeze({
    ...PRODUCTION,
    CONTEXT: 'deploy-preview',
    DEPLOY_PRIME_URL: 'https://deploy-preview-42--parkspot.netlify.app',
});

function messageOf(fn) {
    try {
        fn();
    } catch (error) {
        return error.message;
    }
    throw new Error('expected an error');
}

describe('scripts/newrelic/release', () => {
    it('releases nothing without a user API key', () => {
        expect(resolveRelease({ ...PRODUCTION, NEW_RELIC_API_KEY: '' })).toBe(
            null,
        );
        expect(
            resolveRelease({ ...PRODUCTION, NEW_RELIC_API_KEY: undefined }),
        ).toBe(null);
    });

    it('releases nothing while the agent is off', () => {
        expect(
            resolveRelease({
                ...PRODUCTION,
                NEW_RELIC_BROWSER_ENABLED: 'false',
            }),
        ).toBe(null);
    });

    it('resolves a production release, with a deployment marker', () => {
        expect(resolveRelease(PRODUCTION)).toEqual({
            apiKey: USER_API_KEY,
            accountId: '7629005',
            applicationId: '1589185089',
            entityGuid: 'NzYyOTAwNXxCUk9XU0VSfEFQUExJQ0FUSU9OfDE1ODkxODUwODk',
            environment: 'production',
            version: '0123456789ab',
            commit: SHA,
            origin: 'https://www.parkspot.in',
            deployment: {
                description: 'Netlify production deploy',
                groupId: DEPLOY_ID,
                deepLink: `https://${DEPLOY_ID}--parkspot.netlify.app`,
            },
        });
    });

    it('uploads for the deploy URL elsewhere, without a marker', () => {
        expect(resolveRelease(PREVIEW)).toMatchObject({
            environment: 'deploy-preview',
            origin: 'https://deploy-preview-42--parkspot.netlify.app',
            deployment: null,
        });
    });

    it('keeps the UAT environment name', () => {
        expect(
            resolveRelease({
                ...PREVIEW,
                CONTEXT: 'branch-deploy',
                NEW_RELIC_ENVIRONMENT: 'uat',
            }),
        ).toMatchObject({ environment: 'uat', deployment: null });
    });

    it('takes NEW_RELIC_SOURCEMAP_ORIGIN over Netlify URLs', () => {
        const release = resolveRelease({
            ...PREVIEW,
            NEW_RELIC_SOURCEMAP_ORIGIN: ' https://uat.parkspot.in/ ',
        });
        expect(release.origin).toBe('https://uat.parkspot.in');
    });

    it('marks no deployment without a commit', () => {
        const release = resolveRelease({ ...PRODUCTION, COMMIT_REF: '' });
        expect(release).toMatchObject({
            version: undefined,
            commit: undefined,
            deployment: null,
        });
    });

    it('leaves out deploy details in an unexpected shape', () => {
        const release = resolveRelease({
            ...PRODUCTION,
            DEPLOY_ID: 'not-a-deploy-id',
            DEPLOY_URL: 'https://example.com/some/path',
        });
        expect(release.deployment).toEqual({
            description: 'Netlify production deploy',
        });
    });

    it.each([
        ['a license key', LICENSE_KEY],
        ['a browser key', 'NRBR-b5f8ce862e40dfb4cd2'],
        ['a mangled user key', `${USER_API_KEY} `.repeat(2)],
    ])('refuses %s without echoing it', (_label, apiKey) => {
        const message = messageOf(() =>
            resolveRelease({ ...PRODUCTION, NEW_RELIC_API_KEY: apiKey }),
        );
        expect(message).toBe(
            '[newrelic] NEW_RELIC_API_KEY must be a user API key (NRAK-...); ' +
                'license and browser keys cannot upload source maps or ' +
                'record deployments',
        );
        expect(message).not.toContain(apiKey.trim());
    });

    it.each([
        ['no URL', { URL: undefined }],
        ['a URL with a path', { URL: 'https://www.parkspot.in/app' }],
        ['a URL without a scheme', { URL: 'www.parkspot.in' }],
        [
            'an override with a query',
            { NEW_RELIC_SOURCEMAP_ORIGIN: 'https://www.parkspot.in?x=1' },
        ],
    ])('refuses %s as the origin', (_label, overrides) => {
        expect(
            messageOf(() => resolveRelease({ ...PRODUCTION, ...overrides })),
        ).toBe(
            "[newrelic] NEW_RELIC_SOURCEMAP_ORIGIN (or Netlify's URL and " +
                'DEPLOY_PRIME_URL) must be the origin the scripts are served ' +
                'from, like https://www.parkspot.in',
        );
    });

    it('passes on agent config errors', () => {
        expect(
            messageOf(() =>
                resolveRelease({ ...PRODUCTION, NEW_RELIC_ACCOUNT_ID: 'x' }),
            ),
        ).toBe('[newrelic] NEW_RELIC_ACCOUNT_ID must be a numeric account ID');
    });
});
