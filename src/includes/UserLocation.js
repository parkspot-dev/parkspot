/**
 * It is used to get location of the user.
 * @param {function} callback
 */
function getUserLocation(callback) {
    const geolocation = navigator.geolocation;
    if (geolocation) {
        geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const userLocation = { lat: lat, lng: lng };
                callback(userLocation);
            },
            (error) => {
                let detailError;

                if (error.code === error.PERMISSION_DENIED) {
                    detailError = 'User denied the request for Geolocation.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    detailError = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    detailError = 'The request to get user location timed out.';
                } else if (error.code === error.UNKNOWN_ERROR) {
                    detailError = 'An unknown error occurred.';
                }

                console.log(detailError);
            },
        );
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

export { getUserLocation };
