// Parsers for ParkSpot spot IDs (the ":spotId" route param).
// Spot IDs are hash-delimited: "HYD#REQ#104", "BLR#REQ#806", "BLR#GS#Mansion#2".
// Browsers percent-encode '#' to '%23' when used in a path segment.

const CITY_CODE_DISPLAY = {
    HYD: { display: 'Hyderabad', state: 'Telangana' },
    BLR: { display: 'Bengaluru', state: 'Karnataka' },
    BOM: { display: 'Mumbai', state: 'Maharashtra' },
    DEL: { display: 'Delhi', state: 'Delhi' },
    PNQ: { display: 'Pune', state: 'Maharashtra' },
    MAA: { display: 'Chennai', state: 'Tamil Nadu' },
};

/**
 * Parse a raw spotId path segment into structured pieces. The segment may
 * still be URL-encoded (contain %23) when it arrives at the edge function.
 *
 * @param {string} rawSegment the value of the :spotId route param
 * @returns {{
 *   raw: string,
 *   id: string,
 *   cityCode: string | null,
 *   cityDisplay: string | null,
 *   stateDisplay: string | null,
 *   kind: string | null,
 *   number: string | null,
 * }}
 */
export function parseSpotId(rawSegment) {
    const raw = String(rawSegment ?? '');
    let id = raw;
    try {
        id = decodeURIComponent(raw);
    } catch {
        id = raw;
    }

    const parts = id.split('#').filter(Boolean);
    const cityCode = parts[0] ? parts[0].toUpperCase() : null;
    const cityInfo = cityCode ? CITY_CODE_DISPLAY[cityCode] : null;
    const kind = parts[1] || null;
    const number = parts.slice(2).join(' ') || null;

    return {
        raw,
        id,
        cityCode,
        cityDisplay: cityInfo ? cityInfo.display : null,
        stateDisplay: cityInfo ? cityInfo.state : null,
        kind,
        number,
    };
}

/**
 * Render the spot's "friendly" name for use inside a <title>:
 *   "Parking #104"  |  "Parking Spot #Mansion 2"
 * Falls back gracefully when parts are missing.
 *
 * @param {ReturnType<typeof parseSpotId>} parsed
 * @returns {string}
 */
export function friendlySpotName(parsed) {
    if (parsed?.number) return `Parking #${parsed.number}`;
    if (parsed?.kind) return `Parking Spot (${parsed.kind})`;
    return 'Parking Spot';
}
