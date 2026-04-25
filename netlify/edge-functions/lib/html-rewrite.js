// Pure-string HTML rewriter. We do not use Netlify's HTMLRewriter streaming
// API because the index.html shell is small (~80 KB) and a one-pass regex
// replace keeps the logic testable under plain Node/Vitest.
//
// The rewriter is intentionally conservative: every replacement uses a
// narrow regex that matches the specific shape emitted by the Vite build.
// If a pattern does not match, the original HTML is returned unchanged,
// preserving backwards compatibility.

function escapeHtmlAttr(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeHtmlText(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function replaceTitle(html, newTitle) {
    return html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtmlText(newTitle)}</title>`,
    );
}

function replaceMetaByName(html, name, content) {
    // Match <meta ... name="X" ... content="..." ... > with attrs in any order.
    const pattern = new RegExp(
        `<meta\\b(?=[^>]*\\bname=["']${escapeRegex(name)}["'])[^>]*>`,
        'i',
    );
    const replacement = `<meta name="${escapeHtmlAttr(name)}" content="${escapeHtmlAttr(content)}">`;
    if (pattern.test(html)) return html.replace(pattern, replacement);
    return html.replace(/<\/head>/i, `    ${replacement}\n</head>`);
}

function replaceMetaByProperty(html, property, content) {
    const pattern = new RegExp(
        `<meta\\b(?=[^>]*\\bproperty=["']${escapeRegex(property)}["'])[^>]*>`,
        'i',
    );
    const replacement = `<meta property="${escapeHtmlAttr(property)}" content="${escapeHtmlAttr(content)}">`;
    if (pattern.test(html)) return html.replace(pattern, replacement);
    return html.replace(/<\/head>/i, `    ${replacement}\n</head>`);
}

function replaceLinkRel(html, rel, href) {
    const pattern = new RegExp(
        `<link\\b(?=[^>]*\\brel=["']${escapeRegex(rel)}["'])[^>]*>`,
        'i',
    );
    const replacement = `<link rel="${escapeHtmlAttr(rel)}" href="${escapeHtmlAttr(href)}">`;
    if (pattern.test(html)) return html.replace(pattern, replacement);
    return html.replace(/<\/head>/i, `    ${replacement}\n</head>`);
}

function appendJsonLd(html, data) {
    const script = `<script type="application/ld+json" data-nr-seo="route">${
        // JSON embedded in HTML must escape </script occurrences.
        JSON.stringify(data).replace(/</g, '\\u003c')
    }</script>`;
    return html.replace(/<\/head>/i, `    ${script}\n</head>`);
}

function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply a MetaPayload to the Vite-built index.html shell.
 *
 * This function is total: if the input HTML does not look like the expected
 * shell (missing <head>/<title>), it returns the input unchanged. The caller
 * is expected to treat the return value as opaque and serve it as-is.
 *
 * @param {string} html
 * @param {import('./meta.js').MetaPayload} meta
 * @returns {string}
 */
export function applyMetaToHtml(html, meta) {
    if (typeof html !== 'string' || !html) return html;
    if (!/<\/head>/i.test(html)) return html; // Not our shell.

    let out = html;

    try {
        if (meta.title) out = replaceTitle(out, meta.title);
        if (meta.description) out = replaceMetaByName(out, 'description', meta.description);
        if (meta.canonical) out = replaceLinkRel(out, 'canonical', meta.canonical);
        if (meta.ogTitle) out = replaceMetaByProperty(out, 'og:title', meta.ogTitle);
        if (meta.ogDescription) out = replaceMetaByProperty(out, 'og:description', meta.ogDescription);
        if (meta.ogUrl) out = replaceMetaByProperty(out, 'og:url', meta.ogUrl);
        if (meta.ogImage) out = replaceMetaByProperty(out, 'og:image', meta.ogImage);
        if (meta.ogType) out = replaceMetaByProperty(out, 'og:type', meta.ogType);
        if (meta.jsonLd) out = appendJsonLd(out, meta.jsonLd);
    } catch {
        // Any transformation failure: return the pre-edit HTML to preserve
        // the existing user experience. This is the backwards-compat guard.
        return html;
    }

    return out;
}
