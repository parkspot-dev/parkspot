import { reportError } from '@/telemetry';

const failures = new Map();

function reportStorageFailure(operation, area, error) {
    const key = `${operation}:${area}`;
    let failure = failures.get(key);
    if (!failure) {
        failure = new Error(`Storage ${operation} failed`);
        failures.set(key, failure);
    }
    reportError(failure, {
        source: 'storage',
        storage_area: area,
        storage_operation: operation,
        storage_error_name: String(error?.name || 'Error'),
    });
}

function resolveStorage(area) {
    if (typeof window === 'undefined') return null;
    try {
        return area === 'session' ? window.sessionStorage : window.localStorage;
    } catch (error) {
        reportStorageFailure('access', area, error);
        return null;
    }
}

export function getStoredValue(key, area = 'local') {
    try {
        const value = resolveStorage(area)?.getItem(key);
        return value === undefined ? null : value;
    } catch (error) {
        reportStorageFailure('read', area, error);
        return null;
    }
}

export function setStoredValue(key, value, area = 'local') {
    try {
        resolveStorage(area)?.setItem(key, String(value));
    } catch (error) {
        reportStorageFailure('write', area, error);
    }
}

export function removeStoredValue(key, area = 'local') {
    try {
        resolveStorage(area)?.removeItem(key);
    } catch (error) {
        reportStorageFailure('remove', area, error);
    }
}
