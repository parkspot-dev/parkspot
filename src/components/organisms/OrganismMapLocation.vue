<template>
    <div class="map-location">
        <div class="map-location-header">
            <h1>Map Location</h1>
            <h2>Please fill all the fields</h2>
        </div>
        <GmapMap
            ref="mapRef"
            :center="{ lat: 51.093048, lng: 6.84212 }"
            :zoom="10"
            style="width: 600px; height: 30rem"
        >
            <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center = m.position"
            />
        </GmapMap>
        <AtomButton class="is-pulled-right" @click.native="saveProfile">
            Save Profile
        </AtomButton>
    </div>
</template>

<script>
import AtomButton from '../atoms/AtomButton.vue';

export default {
    name: 'OrganismMapLocation',
    components: {
        AtomButton,
    },
    data() {
        return {
            markers: [
                {
                    position: {
                        lat: 51.093048,
                        lng: 6.84212,
                    },
                },
                {
                    position: {
                        lat: 51.198429,
                        lng: 6.69529,
                    },
                },
                {
                    position: {
                        lat: 51.165218,
                        lng: 7.067116,
                    },
                },
                {
                    position: {
                        lat: 51.09256,
                        lng: 6.84074,
                    },
                },
            ],
        };
    },
    mounted() {
        // At this point, the child GmapMap has been mounted, but
        // its map has not been initialized.
        // Therefore we need to write mapRef.$mapPromise.then(() => ...)

        this.$refs.mapRef.$mapPromise.then((map) => {
            map.panTo({ lat: 1.38, lng: 103.8 });
        });
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
