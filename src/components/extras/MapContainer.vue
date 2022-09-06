<template>
    <div id="map" style="min-height: 450px"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
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
    },
    emits: ['location'],
    data() {
        return {
            accessToken: process.env.VUE_APP_MAP_ACCESS_TOKEN,
            img: require('@/assets/pstopmini.png'),
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
        mapCenter(newCenter) {
            this.recenterMap(newCenter);
        },
    },
    mounted() {
        mapboxgl.accessToken = this.accessToken;

        // create map
        this.map = new mapboxgl.Map(this.mapConfig);

        // create the popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            'Your current location.',
        );

        // create the marker
        this.marker = new mapboxgl.Marker({
            draggable: this.drag,
        })
            .setLngLat(this.mapConfig.center)
            .setPopup(popup)
            .addTo(this.map);

        if (this.drag) {
            this.map.on('click', (e) => {
                this.marker.setPopup(popup).setLngLat(e.lngLat).addTo(this.map);
                this.updateMapConfig(this.marker.getLngLat());
                this.$emit('location', this.marker.getLngLat());
            });

            this.marker.on('dragend', () => {
                this.updateMapConfig(this.marker.getLngLat());
                this.$emit('location', this.marker.getLngLat());
            });
        }

        // create DOM element for the parking site marker
        for (const spots of this.spotsList) {
            const psMarker = document.createElement('div');

            psMarker.className = 'marker';
            psMarker.style.backgroundImage = 'url(' + this.img + ')';
            psMarker.style.width = '50px';
            psMarker.style.height = '50px';
            psMarker.style.backgroundSize = '110%';

            const psPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<p><strong>${spots.Name}</strong></p><p><strong>Distance :</strong> ${spots.Distance} Km</p>`,
            );

            new mapboxgl.Marker(psMarker)
                .setLngLat([spots.Long, spots.Lat])
                .setPopup(psPopup)
                .addTo(this.map);
        }
    },
    methods: {
        ...mapMutations({
            updateMapConfig: 'map/update-map-config',
        }),
        recenterMap(center) {
            this.map.flyTo({
                center: center,
            });
            this.marker.setLngLat(center);
        },
    },
};
</script>

<style lang="scss" scoped>
#map {
    width: 100%;
}
</style>
