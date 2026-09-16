const nr = () => (typeof window !== 'undefined' ? window.newrelic : null);

export const logger = {
    info: (msg, attrs) =>
        nr()?.log?.(msg, { level: 'info', customAttributes: attrs }),
    warn: (msg, attrs) =>
        nr()?.log?.(msg, { level: 'warn', customAttributes: attrs }),
    error: (err, attrs) => nr()?.noticeError?.(err, attrs),
    event: (name, attrs) => nr()?.addPageAction?.(name, attrs),
};
