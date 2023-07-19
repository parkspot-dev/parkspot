<template>
    <div id="map" style="min-height: 450px"></div>
</template>

<script>
export default {
    name: 'MapContainer',
    props: {
        /**
         * map drag option for form only
         */
        drag: {
            type: Boolean,
            default: false,
        },
        spotsList: {
            type: Array,
        },
        // it will contains map center
        center: Object,
        // it will contain latlng of user
        userLatLng: Object,
    },
    emits: ['location'],
    data() {
        return {
            parkspotMarkerIcon: require('@/assets/parkspotMarkerIcon.png'),
            map: null, // map for google map
            userMarker: null, // user marker for location,
            mapCenter: { lat: 12.9716, lng: 77.5946 },
        };
    },
    mounted() {
        this.initMap();
    },
    methods: {
        async initMap() {
            const { Map, InfoWindow } = await google.maps.importLibrary('maps');
            const { AdvancedMarkerElement, PinElement } =
                await google.maps.importLibrary('marker');

            // creating map with config
            this.map = new Map(document.getElementById('map'), {
                center: this.center,
                zoom: 12,
                mapId: 'PARKSPOT_MAP',
            });

            // user marker styles
            const pinScaled = new PinElement({
                scale: 1.5,
            });

            // adding user marker in the map
            this.userMarker = new AdvancedMarkerElement({
                map: this.map,
                position: this.userLatLng,
                title: 'Your Location',
                content: pinScaled.element,
                gmpDraggable: this.drag, // make draggable marker
            });

            // Create an info window to share between markers.
            const userInfoWindow = new InfoWindow();
            this.userMarker.addListener('click', ({ domEvent, latLng }) => {
                userInfoWindow.close();
                userInfoWindow.setContent(this.userMarker.title);
                userInfoWindow.open(this.userMarker.map, this.userMarker);
            });

            // when drag is true we can drag the marker
            if (this.drag) {
                this.userMarker.addListener('dragend', (event) => {
                    const position = this.userMarker.position;
                    userInfoWindow.close();
                    userInfoWindow.open(this.userMarker.map, this.userMarker);
                    this.$emit('change-position', {
                        lat: position.lat,
                        lng: position.lng,
                    });
                });
            }

            if (this.spotsList) {
                this.spotsList.forEach((spot) => {
                    const encodedSpotId = encodeURIComponent(spot.ID);
                    const contentString = `<div dir="ltr" style="" jstcache="0">
                        <div jstcache="34" class="poi-info-window gm-style">
                            <div jstcache="2">
                                <div jstcache="3" class="title full-width" jsan="7.title,7.full-width"> ${spot.Name} </div>
                                <div class="address">
                                    <div jstcache="4" jsinstance="0" class="address-line full-width" jsan="7.address-line,7.full-width"> ${spot.Address} </div>
                                    <div jstcache="4" jsinstance="*3" class="address-line full-width" jsan="7.address-line,7.full-width">India</div>
                                </div>
                            </div>
                            <div jstcache="5" style="margin-top: 0.5rem;">Distance: ${spot.Distance} Km</div>
                            <div jstcache="5" style="margin-top: 0.5rem;">
                                Click
                                <a href="https://www.google.com/maps/dir/'${this.center.lat},${this.center.lng}'/'${spot.Latitude},${spot.Longitude}'/@18.2566348,76.9574504,6z/data=!3m1!4b1!4m10!4m9!1m3!2m2!1d${this.center.lat},${this.center.lng}!1m3!2m2!1d${spot.Longitude}!2d${spot.Latitude}!3e0" target="_blank"> here </a>
                                for map direction.
                            </div>
                            <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 1.5rem">
                                <div style="font-size:1rem;font-weight: 700;color: rgba(0,95,0,1);line-height: 1.25;">&#8377; ${spot.Rate}/-</div>
                                <button style="background-color: #ffe08a;border-color: transparent;border-radius: 3px;color: rgba(0, 0, 0, 0.7);">
                                    <a style="display:flex;align-items: center;background-color: #ffe08a;color: rgba(0, 0, 0, 0.7);" href="https://www.parkspot.in/spot-details/${encodedSpotId}" target="_blank">
                                        <span style="font-size:0.75rem;font-weight:700"> View Spot </span>
                                        <span  style="display: inline-flex;width: 18px;height: 21px;"> <svg xmlns="http://www.w3.org/2000/svg"  class="pointer-events-none max-h-full max-w-full"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"><path vector-effect="non-scaling-stroke" d="M10 17l5-5M10 7l5 5"></path></g></svg> </span>
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>`;

                    // Create an info window to share between markers.
                    const spotInfoWindow = new InfoWindow({
                        content: contentString,
                        ariaLabel: 'Uluru', // font used by google
                    });
                    const lat = spot.Lat;
                    const lng = spot.Long;

                    // creating spot marker
                    const glyphImg = document.createElement('img');
                    glyphImg.src = this.parkspotMarkerIcon;
                    const glyphSvgPinElement = new PinElement({
                        glyph: glyphImg,
                    });

                    // adding spot marker in the map
                    const spotMarker = new AdvancedMarkerElement({
                        map: this.map,
                        position: { lat: lat, lng: lng },
                        title: spot.Name,
                        content: glyphSvgPinElement.element,
                    });

                    // Add a click listener for each marker, and set up the info window.
                    spotMarker.addListener('click', ({ domEvent, latLng }) => {
                        spotInfoWindow.close();
                        spotInfoWindow.open(spotMarker.map, spotMarker);
                    });
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
}
</style>
