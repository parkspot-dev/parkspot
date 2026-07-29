export const sanitizeMobile = (input) => {
    if (!input || typeof input !== 'string') {
        return null;
    }

    // Filter all non-digit characters
    let sanitized = input.replace(/[^\d]/g, '');

    // If this contains extra 91 (Country code)
    if (sanitized.length > 10 && sanitized.startsWith('91')) {
        sanitized = sanitized.slice(2);
    }

    if (sanitized.length !== 10) {
        return null;
    }

    return sanitized;
};
