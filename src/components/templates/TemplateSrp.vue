<template>
    <div class="srp-container">
        <div class="srp-lists">
            <PaginationBody
                :totals="totals"
                @changed="onPageChange"
                :current="currentPage"
            ></PaginationBody>
            <div class="srp-list-items">
                <MoleculeSRPCard
                    v-for="spot in spots"
                    :key="spot.ID"
                    :spot="spot"
                    @on-details="details"
                    @click.native="selected(spot)"
                ></MoleculeSRPCard>
            </div>
            <PaginationBody
                :totals="totals"
                @changed="onPageChange"
                :current="currentPage"
            ></PaginationBody>
        </div>
        <div class="srp-map">
            <MapContainer
                class="map-container"
                :spotsList="spots"
                :key="reRender"
                :mapOptions="mapOptions"
            ></MapContainer>
            <SearchInput class="map-search"></SearchInput>
        </div>
    </div>
</template>

<script>
import PaginationBody from '../extras/PaginationBody.vue';
import MoleculeSRPCard from '../molecules/MoleculeSRPCard.vue';
import MapContainer from '../extras/MapContainer.vue';
import SearchInput from '../extras/SearchInput.vue';
import { mapState } from 'vuex';
export default {
    name: 'TemplateSrp',
    components: {
        PaginationBody,
        MoleculeSRPCard,
        MapContainer,
        SearchInput,
    },
    props: {
        spots: {
            type: Array,
        },
        totals: {
            type: Number,
        },
        reRender: {
            type: Number,
        },
        currentPage: {
            type: Number,
        },
    },
    emits: ['changed', 'details'],
    computed: {
        ...mapState('map', ['mapOptions']),
    },
    methods: {
        onPageChange(page) {
            this.$emit('changed', page);
        },
        details(spotID) {
            this.$emit('details', spotID);
        },
        selected(spot) {
            console.log(spot);
        },
    },
};
</script>

<style scoped>
.srp-container {
    display: flex;
    gap: 2rem;
    padding-left: 3rem;
}

.srp-lists {
    flex: 20%;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.srp-list-items {
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.srp-map {
    flex: 60%;
}

.map-container {
    position: relative;
    height: 100%;
}

.map-search {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 500px;
}

@media only screen and (max-width: 1024px) {
    .srp-container {
        flex-direction: column-reverse;
        padding-left: 0;
    }

    .srp-lists {
        padding: 2rem 8rem;
    }

    .map-container {
        height: 50vh;
    }

    .map-search {
        top: 10%;
        left: 5%;
        width: 50vw;
    }
}

@media only screen and (max-width: 700px) {
    .srp-lists {
        padding: 2rem 4rem;
    }
}

@media only screen and (max-width: 500px) {
    .srp-lists {
        padding: 2rem 1rem;
    }
}
</style>
