// @vitest-environment node
// resolveBuildInfo() names the environment and version every New Relic
// report from a build carries, so browser data and deploy markers line
// up. Its values end up in public HTML, so it must reject anything else.
import { describe, expect, it } from 'vitest';

import { resolveBuildInfo } from '../../../scripts/newrelic/build-info.js';

const SHA = '0123456789abcdef0123456789abcdef01234567';

function messageOf(fn) {
    try {
        fn();
    } catch (error) {
        return error.message;
    }
    throw new Error('expected an error');
}

describe('scripts/newrelic/build-info', () => {
    it('is "local" without a version outside Netlify', () => {
        expect(resolveBuildInfo({})).toEqual({
            environment: 'local',
            version: undefined,
        });
    });

    it("uses Netlify's deploy context", () => {
        expect(resolveBuildInfo({ CONTEXT: 'deploy-preview' })).toEqual({
            environment: 'deploy-preview',
            version: undefined,
        });
    });

    it('lets NEW_RELIC_ENVIRONMENT override the context', () => {
        const env = { CONTEXT: 'branch-deploy', NEW_RELIC_ENVIRONMENT: 'uat' };
        expect(resolveBuildInfo(env).environment).toBe('uat');
    });

    it('skips blank values and trims the rest', () => {
        const env = {
            NEW_RELIC_ENVIRONMENT: ' ',
            CONTEXT: ' production ',
            COMMIT_REF: '',
        };
        expect(resolveBuildInfo(env)).toEqual({
            environment: 'production',
            version: undefined,
        });
    });

    it('shortens COMMIT_REF to 12 characters', () => {
        expect(resolveBuildInfo({ COMMIT_REF: SHA }).version).toBe(
            '0123456789ab',
        );
        expect(resolveBuildInfo({ COMMIT_REF: 'f4a53e6' }).version).toBe(
            'f4a53e6',
        );
    });

    it.each([
        'Production',
        'prod env',
        'feature/x',
        '-uat',
        '<script>',
        'a'.repeat(33),
    ])('rejects environment %o', (name) => {
        expect(() => resolveBuildInfo({ NEW_RELIC_ENVIRONMENT: name })).toThrow(
            /NEW_RELIC_ENVIRONMENT \(or CONTEXT\) must be lowercase/,
        );
    });

    it.each(['main', 'f4a53e', `${SHA}0`])('rejects COMMIT_REF %o', (ref) => {
        expect(() => resolveBuildInfo({ COMMIT_REF: ref })).toThrow(
            /COMMIT_REF must be a git commit SHA/,
        );
    });

    it('never echoes a rejected value', () => {
        const key = ['NRAK', '0123456789ABCDEFGHIJKLMNOPQ'].join('-');
        expect(
            messageOf(() => resolveBuildInfo({ NEW_RELIC_ENVIRONMENT: key })),
        ).not.toContain(key);
        expect(
            messageOf(() => resolveBuildInfo({ COMMIT_REF: key })),
        ).not.toContain(key);
    });
});
