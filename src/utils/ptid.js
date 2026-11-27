import { reportError } from '@/telemetry';

const PTID_KEY = 'ptid';
const ptidStorageError = new Error('Unable to persist page-tracking id');

/**
 * Per-tab page-tracking id, persisted in sessionStorage so it stays stable
 * across SPA navigation but doesn't leak across tabs/sessions.
 * @return {string}
 */
export function getPtid() {
    if (typeof window === 'undefined') {
        return '';
    }
    let storage;
    try {
        storage = window.sessionStorage;
    } catch (error) {
        reportError(ptidStorageError, {
            source: 'ptid',
            failure: 'storage_access',
            storage_error_name: String(error?.name || 'Error'),
        });
        return '';
    }
    try {
        let ptid = storage.getItem(PTID_KEY);
        if (!ptid) {
            ptid =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            storage.setItem(PTID_KEY, ptid);
        }
        return ptid;
    } catch (error) {
        reportError(ptidStorageError, {
            source: 'ptid',
            failure: 'storage_read_write',
            storage_error_name: String(error?.name || 'Error'),
        });
        return '';
    }
}
