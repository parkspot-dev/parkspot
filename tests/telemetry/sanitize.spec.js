// src/telemetry/sanitize.js is the only thing standing between app data
// and New Relic, and its value rules double as the agent's
// `init.obfuscate` config. These tests pin both layers: which attribute
// names are dropped, and which substrings are masked.
import { describe, expect, it } from 'vitest';
import {
    MAX_ATTRIBUTES,
    MAX_STRING_LENGTH,
    OBFUSCATION_RULES,
    isDeniedKey,
    sanitizeAttributes,
    sanitizeError,
    scrubText,
} from '@/telemetry/sanitize.js';

describe('isDeniedKey()', () => {
    it.each([
        'email',
        'customer_phone',
        'mobileNumber',
        'whatsapp',
        'PSAuthKey',
        'Authorization',
        'licenseKey',
        'refresh_token',
        'bankAccountNo',
        'account_number',
        'ifsc_code',
        'aadhaar_number',
        'IdNumber',
        'address_line1',
        'kyc_base64',
        'name',
        'user_name',
        'displayName',
        'item_name',
        'accountHolderName',
        'cno',
        'p',
        'h',
        'transaction_id',
        'order_id',
        'paymentId',
        'PaymentSessionID',
        'sasUrl',
        'upiUrl',
        'qrCode',
        'vpa',
        'vehicle',
        'vehicle_no',
        'latlng',
        'Long',
        'search_term',
        'landmark',
        'image',
        'selfie',
        'photoURL',
        'avatar',
        'enhanced_conversion_data',
        'gclid',
        'ip',
    ])('drops %s', (key) => {
        expect(isDeniedKey(key)).toBe(true);
    });

    it.each([
        'source',
        'status',
        'endpoint',
        'method',
        'ptid',
        'funnel_name',
        'lead_type',
        'item_id',
        'item_count',
        'price',
        'value',
        'currency',
        'error_code',
        'order_status',
        'route_name',
        'user_role',
        'spot_id',
        'city',
        'image_count',
        // Contains "pan", which is only denied as a whole key.
        'company',
        'pincode',
    ])('keeps %s', (key) => {
        expect(isDeniedKey(key)).toBe(false);
    });
});

describe('scrubText()', () => {
    it.each([42, null, undefined, '', true])('returns %o unchanged', (v) => {
        expect(scrubText(v)).toBe(v);
    });

    it.each([
        [
            'query strings of absolute URLs',
            'GET https://api.parkspot.in/v1/srp?latlng=12.9,77.6&r=2 failed',
            'GET https://api.parkspot.in/v1/srp failed',
        ],
        [
            'fragments',
            'at https://www.parkspot.in/payment/validate#p=abc',
            'at https://www.parkspot.in/payment/validate',
        ],
        [
            'queries in stack frames, keeping line and column',
            'at h (https://www.parkspot.in/assets/index-B1x.js?v=2:1:2345)',
            'at h (https://www.parkspot.in/assets/index-B1x.js:1:2345)',
        ],
        [
            'queries of root-relative paths',
            'Request /payment/validate?p=abc&h=def failed',
            'Request /payment/validate failed',
        ],
        ['a path at the start', '/srp?latlng=12.9,77.6', '/srp'],
        [
            'data: URLs',
            'img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUg== broke',
            'img src=[data-url] broke',
        ],
        [
            'the username in Maya user routes',
            'PATCH auth/user/9876543210/kycStatus 500',
            'PATCH auth/user/[user]/kycStatus 500',
        ],
        [
            'an email username in Maya user routes',
            'PATCH auth/user/a.b@example.com/kycStatus',
            'PATCH auth/user/[user]/kycStatus',
        ],
        [
            'Mapbox geocoding searches',
            'GET https://api.mapbox.com/geocoding/v5/mapbox.places/Koramangala%205th%20Block.json?access_token=pk.x 404',
            'GET https://api.mapbox.com/geocoding/v5/mapbox.places/[query] 404',
        ],
        [
            'geocoding searches with a slash or an apostrophe',
            "/geocoding/v5/mapbox.places/12/3%20St%20Mary's%20Road.json",
            '/geocoding/v5/mapbox.places/[query]',
        ],
        [
            'JWTs',
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.c2lnbmF0dXJl-_x',
            'Bearer [jwt]',
        ],
        [
            'emails',
            'No account for a.b+c@example.co.in yet',
            'No account for [email] yet',
        ],
        ['bare mobile numbers', 'call 9876543210 now', 'call [phone] now'],
        ['+91 numbers with spaces', 'cno: +91 98765 43210', 'cno: [phone]'],
        ['+91 numbers with a hyphen', '+91-9876543210', '[phone]'],
        ['numbers with a trunk prefix', '(09876543210)', '([phone])'],
        ['split numbers', 'call 98765-43210.', 'call [phone].'],
        [
            'Aadhaar numbers',
            'IdNumber 234567890123 rejected',
            'IdNumber [aadhaar] rejected',
        ],
        [
            'Aadhaar numbers as the KYC form shows them',
            'Aadhaar 2345 6789 0123',
            'Aadhaar [aadhaar]',
        ],
        ['hyphenated Aadhaar numbers', '(2345-6789-0123)', '([aadhaar])'],
        [
            'emails inside a query before the email rule runs',
            'https://x.parkspot.in/a?email=a@b.com',
            'https://x.parkspot.in/a',
        ],
    ])('masks %s', (_label, input, expected) => {
        expect(scrubText(input)).toBe(expected);
    });

    it('masks long base64 payloads without a data: prefix', () => {
        const blob = 'QUJD'.repeat(75);
        expect(scrubText(`upload ${blob}== failed`)).toBe(
            'upload [base64] failed',
        );
    });

    it.each([
        ['digit runs inside IDs', 'order_9876543210x'],
        ['numbers glued to letters', 'ab9876543210'],
        ['eleven-digit runs', '19876543210'],
        ['numbers not starting 6-9', '5876543210'],
        ['millisecond timestamps', '1696300000000'],
        ['twelve-digit runs starting 0 or 1', '123456789012'],
        ['digit groups split unevenly', '23456789-2345'],
        // The last group is twelve digits, like an Aadhaar number.
        ['UUIDs', '550e8400-e29b-41d4-a716-446655440000'],
        [
            'SHA-256 digests',
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        ],
        [
            'stack frames without a query',
            'at f (https://www.parkspot.in/assets/PageSrp-BXk3j2l1.js:10:20)',
        ],
        ['plain messages', 'Request failed with status code 500'],
    ])('leaves %s alone', (_label, input) => {
        expect(scrubText(input)).toBe(input);
    });
});

describe('OBFUSCATION_RULES', () => {
    it('only holds global regexes with string replacements', () => {
        expect(Object.isFrozen(OBFUSCATION_RULES)).toBe(true);
        for (const { regex, replacement } of OBFUSCATION_RULES) {
            expect(regex).toBeInstanceOf(RegExp);
            // The agent calls `replace()` once per rule; without /g only
            // the first match would be masked.
            expect(regex.flags).toContain('g');
            expect(typeof replacement).toBe('string');
        }
    });

    it('avoids lookbehind, which Safari < 16.4 cannot parse', () => {
        for (const { regex } of OBFUSCATION_RULES) {
            expect(regex.source).not.toMatch(/\(\?<[=!]/);
        }
    });
});

describe('sanitizeAttributes()', () => {
    it.each([undefined, null, 'x', 42])('returns {} for %o', (input) => {
        expect(sanitizeAttributes(input)).toEqual({});
    });

    it('drops denied keys and keeps the rest', () => {
        expect(
            sanitizeAttributes({
                source: 'maya',
                status: 500,
                email: 'a@b.com',
                customer_phone: '9876543210',
                order_id: 'ORD-1',
                funnel_name: 'srp',
            }),
        ).toEqual({ source: 'maya', status: 500, funnel_name: 'srp' });
    });

    it('scrubs and truncates strings', () => {
        const clean = sanitizeAttributes({
            message: 'failed for 9876543210',
            text: 'word '.repeat(MAX_STRING_LENGTH),
        });
        expect(clean.message).toBe('failed for [phone]');
        expect(clean.text).toHaveLength(MAX_STRING_LENGTH);
    });

    it('keeps finite numbers and booleans', () => {
        expect(
            sanitizeAttributes({
                a: 0,
                b: -1.5,
                c: false,
                d: NaN,
                e: Infinity,
            }),
        ).toEqual({ a: 0, b: -1.5, c: false });
    });

    it('joins arrays of primitives and drops everything else', () => {
        expect(
            sanitizeAttributes({
                tags: ['a', 1, true, { x: 1 }],
                objects: [{ x: 1 }],
                nested: { x: 1 },
                missing: undefined,
                empty: null,
                fn: () => {},
            }),
        ).toEqual({ tags: 'a,1,true' });
    });

    it('flattens GA4 items into name-free attributes', () => {
        expect(
            sanitizeAttributes({
                items: [
                    { item_id: 'S1', item_name: 'Koramangala', price: 50 },
                    { item_id: 'S2', price: '25' },
                    { item_name: 'No id or price' },
                ],
            }),
        ).toEqual({ item_count: 3, item_id: 'S1,S2', price: 75 });
    });

    it('drops item IDs that repeat a denied value', () => {
        expect(
            sanitizeAttributes({
                transaction_id: 'P123',
                items: [
                    { item_id: 'P123', price: 50 },
                    { item_id: 'S2', price: 25 },
                ],
            }),
        ).toEqual({ item_count: 2, item_id: 'S2', price: 75 });
    });

    it(`keeps at most ${MAX_ATTRIBUTES} attributes`, () => {
        const many = Object.fromEntries(
            Array.from({ length: MAX_ATTRIBUTES + 12 }, (_, i) => [
                `attr_${i}`,
                i,
            ]),
        );
        expect(Object.keys(sanitizeAttributes(many))).toHaveLength(
            MAX_ATTRIBUTES,
        );
    });

    it('does not modify its input', () => {
        const input = { email: 'a@b.com', note: 'call 9876543210' };
        sanitizeAttributes(input);
        expect(input).toEqual({ email: 'a@b.com', note: 'call 9876543210' });
    });
});

describe('sanitizeError()', () => {
    it('scrubs strings', () => {
        expect(sanitizeError('no user 9876543210')).toBe('no user [phone]');
    });

    it.each([undefined, null, 42])('returns %o unchanged', (input) => {
        expect(sanitizeError(input)).toBe(input);
    });

    it('returns a clean error as is, extra properties included', () => {
        const error = new TypeError('x is undefined');
        error.code = 'E1';
        expect(sanitizeError(error)).toBe(error);
    });

    it('rebuilds an error whose message or stack needs scrubbing', () => {
        const error = new TypeError('no booking for a@b.com');
        error.stack = 'TypeError: no booking for a@b.com\n    at f (x.js:1:2)';
        const clean = sanitizeError(error);
        expect(clean).not.toBe(error);
        expect(clean).toBeInstanceOf(Error);
        expect(clean.name).toBe('TypeError');
        expect(clean.message).toBe('no booking for [email]');
        expect(clean.stack).toBe(
            'TypeError: no booking for [email]\n    at f (x.js:1:2)',
        );
    });

    it('scrubs an Error cause', () => {
        const cause = new Error('GET /v1/user?mobile=9876543210 failed');
        const clean = sanitizeError(new Error('outer', { cause }));
        expect(clean.message).toBe('outer');
        expect(clean.cause).toBeInstanceOf(Error);
        expect(clean.cause.message).toBe('GET /v1/user failed');
        expect(clean.cause.stack).not.toContain('9876543210');
    });

    it('keeps a clean Error cause by identity', () => {
        const cause = new Error('socket hang up');
        const error = new Error('outer', { cause });
        expect(sanitizeError(error)).toBe(error);
    });

    it('scrubs a string cause', () => {
        const clean = sanitizeError(
            new Error('outer', { cause: 'user a@b.com' }),
        );
        expect(clean.cause).toBe('user [email]');
    });

    it('drops a cause that is neither an Error nor a string', () => {
        // e.g. an axios config with the request body in it
        const error = new Error('outer', {
            cause: { data: { cno: '9876543210' } },
        });
        const clean = sanitizeError(error);
        expect(clean).not.toBe(error);
        expect(clean.message).toBe('outer');
        expect('cause' in clean).toBe(false);
    });

    it('turns error-like objects into scrubbed Errors', () => {
        const clean = sanitizeError({ message: 'cno 9876543210 taken' });
        expect(clean).toBeInstanceOf(Error);
        expect(clean.name).toBe('Error');
        expect(clean.message).toBe('cno [phone] taken');
    });
});
