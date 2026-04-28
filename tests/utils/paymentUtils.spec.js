import { describe, expect, it } from 'vitest';
import { getAccountInfo, getPaymentAppLabel } from '@/utils/paymentUtils';

describe('paymentUtils', () => {
    describe('Structure tests', () => {
        it('exports the payment utility functions', () => {
            expect(getPaymentAppLabel).toBeDefined();
            expect(getAccountInfo).toBeDefined();
        });
    });

    describe('Behavior tests', () => {
        it('returns an empty string when payment app is not set', () => {
            expect(getPaymentAppLabel(0)).toBe('');
        });

        it('returns the payment app label for a valid code', () => {
            expect(getPaymentAppLabel(1)).toBe('PhonePe');
        });

        it('prefers bank account information when account number and IFSC are available', () => {
            expect(
                getAccountInfo(
                    {
                        BankAccountNumber: ' 123456 ',
                        IfscCode: ' hdfc0001 ',
                        UpiId: 'owner@upi',
                    },
                    'PhonePe',
                ),
            ).toBe('123456/HDFC0001');
        });

        it('returns the upi id with the payment app label when present', () => {
            expect(
                getAccountInfo(
                    {
                        UpiId: ' owner@upi ',
                    },
                    'PhonePe',
                ),
            ).toBe('owner@upi/PhonePe');
        });

        it('returns the mobile number without a payment app label when no label is provided', () => {
            expect(
                getAccountInfo({
                    Mobile: ' 855788258 ',
                }),
            ).toBe('855788258');
        });

        it('returns an empty string when no account information is available', () => {
            expect(getAccountInfo({})).toBe('');
        });
    });

    describe('Accessibility tests', () => {
        it('returns plain text values that can be announced directly in the UI', () => {
            expect(typeof getPaymentAppLabel(1)).toBe('string');
            expect(typeof getAccountInfo({ Mobile: '855788258' }, 'Gpay')).toBe(
                'string',
            );
        });
    });

    describe('Focused snapshot tests', () => {
        it('matches the focused account info snapshot', () => {
            expect({
                bank: getAccountInfo({
                    BankAccountNumber: '123',
                    IfscCode: 'hdfc0001',
                }),
                mobile: getAccountInfo({ Mobile: '855788258' }, 'Gpay'),
                upi: getAccountInfo({ UpiId: 'owner@upi' }, 'PhonePe'),
            }).toMatchInlineSnapshot(`
              {
                "bank": "123/HDFC0001",
                "mobile": "855788258/Gpay",
                "upi": "owner@upi/PhonePe",
              }
            `);
        });
    });
});
