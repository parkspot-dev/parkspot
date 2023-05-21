<template>
    <div id="map" style="min-height: 450px"></div>
</template>

<script>
// import mapboxgl from 'mapbox-gl';
import { Loader } from '@googlemaps/js-api-loader';
import { mapGetters, mapMutations } from 'vuex';
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
        // it will contains center, zoom and many other config
        mapOptions: Object,
    },
    emits: ['location'],
    data() {
        return {
            accessToken: process.env.VUE_APP_MAP_ACCESS_TOKEN,
            parkspotMarkerIcon: require('@/assets/parkspotMarkerIcon.png'),
            map: null, // map for mapbox
            marker: null, // marker for location
        };
    },
    computed: {
        ...mapGetters({
            mapConfig: 'map/getMapConfig',
            mapCenter: 'map/getNewMapCenter',
        }),
    },
    watch: {
        // mapCenter(newCenter) {
        //     this.recenterMap(newCenter);
        // },
    },
    mounted() {
        const loader = new Loader({
            apiKey: process.env.VUE_APP_GOOGLE_MAP_TOKEN,
            version: 'weekly',
        });

        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary('maps');
            const { AdvancedMarkerElement, PinElement } =
                await google.maps.importLibrary('marker');

            // creating map with config
            this.map = new Map(document.getElementById('map'), {
                center: { lat: 17.471356, lng: 78.3344256 },
                zoom: 12,
                mapId: 'DEMO_MAP_ID',
            });

            // user marker styles
            const pinScaled = new PinElement({
                scale: 1.5,
                // background: '#ffdd57',
                // borderColor: '#0085ad',
                // glyphColor: '#0085ad',
            });

            // adding user marker in the map
            this.marker = new AdvancedMarkerElement({
                map: this.map,
                position: { lat: 17.471356, lng: 78.3344256 },
                title: 'Uluru',
                content: pinScaled.element,
            });

            this.spotsList.forEach((spot) => {
                const lat = spot.Lat;
                const lng = spot.Long;

                // creating spot marker
                const glyphImg = document.createElement('img');
                glyphImg.src = this.parkspotMarkerIcon;
                const glyphSvgPinElement = new PinElement({
                    glyph: glyphImg,
                });

                // adding spot marker in the map
                new AdvancedMarkerElement({
                    map: this.map,
                    position: { lat: lat, lng: lng },
                    title: spot.Name,
                    content: glyphSvgPinElement.element,
                });
            });
        });
    },
    methods: {
        ...mapMutations({
            updateMapConfig: 'map/update-map-config',
        }),
        // recenterMap(center) {
        //     this.map.flyTo({
        //         center: center,
        //     });
        //     this.marker.setLngLat(center);
        // },
    },
};
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
}
</style>
