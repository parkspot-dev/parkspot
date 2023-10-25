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
        for (const spot of this.spotsList) {
            const encodedSpotId = 'abcd';
            const psMarker = document.createElement('div');

            psMarker.className = 'marker';
            psMarker.style.backgroundImage = 'url(' + this.img + ')';
            psMarker.style.width = '50px';
            psMarker.style.height = '50px';
            psMarker.style.backgroundSize = '110%';

            const psPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `
<style>
  .name {
    font-weight: bold;
    font-size: 1rem;
  }

  .address {
    font-size: 0.75rem;
  }

  .rate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem
  }

  .view-spot {
    display: flex;
    align-items: center;
    font-size: .75rem;
    font-weight: 700;
    background-color: #ffe08a;
    border-radius: 3px;
    border-color: #dbdbdb;
    border-width: 1px;
    cursor: pointer;
    justify-content: center;
    padding-bottom: calc(.5em - 1px);
    padding-left: 1em;
    padding-right: 1em;
    padding-top: calc(.5em - 1px);
    text-align: center;
    white-space: nowrap;
  }
</style>
<div>
  <div class="name">${spot.Name}</div>
  <div class="address"> ${spot.Address} <div>India</div>
  </div>
</div>
<div style="margin-top:.5rem"><b>Distance: </b> ${spot.Distance} Km</div>
<div style="margin-top:.5rem">
  <a href="">Click</a> for map direction.
</div>
<div class="rate">
  <div>&#8377; ${spot.Rate}/-</div>
  <button class="view-spot">
    <a href="https://www.parkspot.in/spot-details/${encodedSpotId}" target="_blank"> View Spot </a>
  </button>
</div>`,
            );

            new mapboxgl.Marker(psMarker)
                .setLngLat([spot.Long, spot.Lat])
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
/* stylelint-disable-next-line selector-max-id */
#map {
    width: 100%;
}
</style>
