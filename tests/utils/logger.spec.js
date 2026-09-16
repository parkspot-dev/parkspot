import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/utils/logger';

describe('logger utility', () => {
    let originalNewRelic;

    beforeEach(() => {
        originalNewRelic = window.newrelic;
    });

    afterEach(() => {
        window.newrelic = originalNewRelic;
    });

    it('delegates to window.newrelic when present', () => {
        const mockLog = vi.fn();
        const mockNoticeError = vi.fn();
        const mockAddPageAction = vi.fn();

        window.newrelic = {
            log: mockLog,
            noticeError: mockNoticeError,
            addPageAction: mockAddPageAction,
        };

        logger.info('info msg', { foo: 'bar' });
        expect(mockLog).toHaveBeenCalledWith('info msg', {
            level: 'info',
            customAttributes: { foo: 'bar' },
        });

        logger.warn('warn msg', { bar: 'baz' });
        expect(mockLog).toHaveBeenCalledWith('warn msg', {
            level: 'warn',
            customAttributes: { bar: 'baz' },
        });

        const testErr = new Error('test error');
        logger.error(testErr, { detail: '123' });
        expect(mockNoticeError).toHaveBeenCalledWith(testErr, {
            detail: '123',
        });

        logger.event('custom_event', { key: 'val' });
        expect(mockAddPageAction).toHaveBeenCalledWith('custom_event', {
            key: 'val',
        });
    });

    it('handles missing window.newrelic gracefully', () => {
        delete window.newrelic;

        expect(() => logger.info('test')).not.toThrow();
        expect(() => logger.warn('test')).not.toThrow();
        expect(() => logger.error(new Error('test'))).not.toThrow();
        expect(() => logger.event('test')).not.toThrow();
    });
});
