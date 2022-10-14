/**
 * Take comma seperated latlng and convert into array.
 * @param {string} latlng string.
 * @return {Array} coordinate i.e., coordinate[0]-> lat and coordinate[1]-> lng.
 */
function getCoordinate(latlng) {
    let coordinate = latlng.split(',');
    if (coordinate.length == 2) {
        coordinate = coordinate.map((coord) => coord.trim());
        return coordinate;
    }
    return null;
}

export { getCoordinate };
