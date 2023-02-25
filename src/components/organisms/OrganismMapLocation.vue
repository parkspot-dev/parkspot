<template>
    <div class="map-location">
        <div class="map-location-header">
            <h1>Map Location</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <GmapMap
            ref="mapRef"
            :center="{ lat: 12.92442, lng: 77.580643 }"
            :zoom="10"
            style="width: 600px; height: 30rem"
            @click="onMapClick"
        >
            <GmapMarker
                ref="myMarker"
                :position="google && new google.maps.LatLng(markerPostion)"
            />
        </GmapMap>
        <AtomButton class="is-pulled-right" @click.native="saveProfile">
            Save Profile
        </AtomButton>
    </div>
</template>

<script>
import AtomButton from '../atoms/AtomButton.vue';
import { gmapApi } from 'vue2-google-maps';

export default {
    name: 'OrganismMapLocation',
    components: {
        AtomButton,
    },
    data() {
        return {
            markerPostion: { lat: 12.92442, lng: 77.580643 },
        };
    },
    computed: {
        google: gmapApi,
    },
    mounted() {
        // At this point, the child GmapMap has been mounted, but
        // its map has not been initialized.
        // Therefore we need to write mapRef.$mapPromise.then(() => ...)

        this.$refs.mapRef.$mapPromise.then((map) => {
            map.panTo({ lat: 12.92442, lng: 77.580643 });
        });
    },
    methods: {
        onMapClick(mapsMouseEvent) {
            this.markerPostion = mapsMouseEvent.latLng.toJSON();
        },
    },
};
</script>

<style lang="scss" scoped>
.map-location-header {
    background-color: var(--secondary-color);
    padding: 20px 30px;
    margin-bottom: 30px;

    h1 {
        color: black;
        font-weight: 600;
        font-size: 24px;
    }

    h2 {
        color: #e8faff;
        font-size: 14px;
    }
}
</style>
