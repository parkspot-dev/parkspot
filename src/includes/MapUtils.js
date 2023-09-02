/**
 * Returns google maps search url.
 * https://developers.google.com/maps/documentation/urls/get-started#search-action
 *
 * @param {number} lat
 * @param {number} lng
 * @return {string} Google maps place search url with set lat and lng.
 */
function getMapSearchUrl(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Returns google maps direction url.
 * https://developers.google.com/maps/documentation/urls/get-started#directions-action
 *
 * @param {number} lat
 * @param {number} lng
 * @return {string} Google maps place direction url with set destination. Since the origin
 * is not specified it will pick user current location as the origin.
 */
function getMapDirectionUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export { getMapSearchUrl, getMapDirectionUrl };
