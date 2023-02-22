<template>
    <div class="map-location">
        <div class="map-location-header">
            <h1>Map Location</h1>
            <h2>Please fill all the fields</h2>
        </div>

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
