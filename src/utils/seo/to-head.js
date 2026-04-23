// Adapts a MetaPayload (the shape produced by buildAreaPageMeta /
// buildSpotDetailMeta) into the object shape that @unhead/vue's useHead()
// expects. Keeping the translation in one place means:
//
//   1. The client-side call sites stay tiny / readable.
//   2. If we ever need to tweak the tag set (e.g. add twitter:card), there
//      is exactly one file to edit -- both area pages and spot pages pick
//      it up automatically, and the edge function continues to emit the
//      exact same tags since it consumes the same MetaPayload source.
//
// The function is pure and has no runtime dependencies so it is trivially
// unit-testable under Node / Vitest.

/**
 * @param {import('../../../netlify/edge-functions/lib/meta.js').MetaPayload} meta
 * @returns {{
 *   title: string,
 *   meta: Array<{ name?: string, property?: string, content: string }>,
 *   link: Array<{ rel: string, href: string, key?: string }>,
 *   script: Array<{ type: string, innerHTML: string, key?: string }>,
 * }}
 */
export function metaPayloadToHead(meta) {
    if (!meta || typeof meta !== 'object') {
        return { title: '', meta: [], link: [], script: [] };
    }

    const metaTags = [];
    if (meta.description) {
        metaTags.push({ name: 'description', content: meta.description });
    }
    if (meta.ogTitle) metaTags.push({ property: 'og:title', content: meta.ogTitle });
    if (meta.ogDescription) {
        metaTags.push({ property: 'og:description', content: meta.ogDescription });
    }
    if (meta.ogUrl) metaTags.push({ property: 'og:url', content: meta.ogUrl });
    if (meta.ogImage) metaTags.push({ property: 'og:image', content: meta.ogImage });
    if (meta.ogType) metaTags.push({ property: 'og:type', content: meta.ogType });

    const linkTags = [];
    if (meta.canonical) {
        // `key` lets @unhead dedupe across re-renders so we never leave
        // stale <link rel="canonical"> tags in the DOM.
        linkTags.push({ rel: 'canonical', href: meta.canonical, key: 'canonical' });
    }

    const scriptTags = [];
    if (meta.jsonLd) {
        scriptTags.push({
            type: 'application/ld+json',
            // Match the attribute the edge function uses so cleanup code in
            // main.js can identify and remove server-injected copies after
            // the client takes over.
            'data-nr-seo': 'route',
            innerHTML: JSON.stringify(meta.jsonLd),
            key: 'seo-jsonld',
        });
    }

    return {
        title: meta.title || '',
        meta: metaTags,
        link: linkTags,
        script: scriptTags,
    };
}
