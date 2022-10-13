/**
 * Take comma seperated latlng and convert into array.
 * @param {string} latlng string.
 * @return {Array} coordinate.
 */
function latLngFilter(latlng) {
    let coordinate = latlng.split(',');
    coordinate = coordinate.map((coord) => coord.trim());
    return coordinate;
}

export { latLngFilter };
