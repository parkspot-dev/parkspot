const PTID_KEY = 'ptid';

/**
 * Per-tab page-tracking id, persisted in sessionStorage so it stays stable
 * across SPA navigation but doesn't leak across tabs/sessions.
 * @return {string}
 */
export function getPtid() {
    if (typeof sessionStorage === 'undefined') {
        return '';
    }
    let ptid = sessionStorage.getItem(PTID_KEY);
    if (!ptid) {
        ptid =
            typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(PTID_KEY, ptid);
    }
    return ptid;
}
