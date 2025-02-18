<template>
    <div ref="observer">
        <div name="location" rules="required">
            <SearchInput @change.native="validate" class="mb-4"></SearchInput>
            <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
        </div>
        <div name="map" rules="required">
            <AtomParagraph>
                Note: Drag the marker to pin the exact location.
            </AtomParagraph>
            <MapContainer
                :key="reRender"
                :drag="true"
                @location="validate"
            ></MapContainer>
            <span class="has-text-danger is-size-7">{{ errors[0] }}</span>
        </div>
    </div>
</template>

<script>
import SearchInput from '../extras/SearchInput.vue';
import MapContainer from '../extras/MapContainer.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import { mapGetters, mapMutations } from 'vuex';
export default {
    name: 'OrganismAddressForm',
    components: {
        SearchInput,
        MapContainer,
        AtomParagraph,
    },
    props: {
        formSubmitted: {
            type: Boolean,
            default: false,
        },
        reRender: {
            type: Number,
            default: 0,
        },
    },
    emits: ['formValidate'],
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            locDetails: 'map/getLocDetails',
        }),
    },
    watch: {
        formSubmitted(newVal) {
            if (newVal) {
                this.$refs.observer
                    .validate()
                    .then((el) => {
                        if (el) {
                            this.submit();
                            this.$emit('formValidate', el);
                        } else {
                            this.$emit('formValidate', el);
                        }
                    })
                    .catch((er) => {
                        console.log(er);
                    });
            }
        },
    },
    methods: {
        ...mapMutations({
            updateLocationDetails: 'user/update-location-details',
        }),
        submit() {
            this.updateLocationDetails(this.locDetails);
        },
    },
};
</script>

<style></style>
