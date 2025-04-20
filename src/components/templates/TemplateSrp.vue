<template>
    <div class="srp-container">
        <div class="srp-lists">
            <div class="srp-control">
                <SearchInput
                    class="map-search"
                    @changed="onChange"
                ></SearchInput>
            </div>
            <!-- Filters -->
            <h4>Filters</h4>
            <div class="filters">
                <FilterDropdown
                    :options="distanceFilterOptions"
                    :searchable="false"
                    :selectedValue="this.filterSelectedValues.distance"
                    @remove="removeFilter('distance')"
                    @update="addFilter('distance', $event)"
                    label="Search Within"
                />

                <FilterDropdown
                    :options="rentFilerOptions"
                    :searchable="false"
                    :selectedValue="filterSelectedValues.rent"
                    @remove="removeFilter('rent')"
                    @update="addFilter('rent', $event)"
                    label="Rent Range"
                />

                <FilterDropdown
                    :options="statusFilterOptions"
                    :searchable="false"
                    :selectedValue="filterSelectedValues.status"
                    @remove="removeFilter('status')"
                    @update="handleStatusFilter('status', $event)"
                    label="Availability"
                />
            </div>
            <div class="srp-results-heading">
                <p>
                    Spots found:
                    <strong>
                        <b-tag type="is-light">
                            {{ filteredSpots.length }}
                        </b-tag>
                    </strong>
                </p>
                <div class="sort">
                    Short by:
                    <FilterDropdown
                        :options="sortFilterOptions"
                        :searchable="false"
                        :selectedValue="selectedSort.name"
                        :removable="false"
                        @remove="removeFilter('rent')"
                        @update="sortFilteredResults($event, 'asc')"
                        label="Select"
                    />
                </div>
            </div>
            <hr />
            <div class="srp-list-items">
                <MoleculeSRPCard
                    v-for="spot in filteredSpots"
                    :key="spot.ID"
                    :spot="spot"
                    @on-details="details"
                ></MoleculeSRPCard>
            </div>
        </div>
        <div class="srp-map">
            <MapContainer
                :center="this.center"
                :key="reRender"
                :spotsList="spots"
                class="map-container"
            ></MapContainer>
        </div>
    </div>
</template>

<script>
// import PaginationBody from '../extras/PaginationBody.vue';
import MoleculeSRPCard from '../molecules/MoleculeSRPCard.vue';
// import AtomRadioButton from '../atoms/AtomRadioButton.vue';
import AtomCheckbox from '../atoms/AtomCheckbox.vue';
import MapContainer from '../extras/MapContainer.vue';
import SearchInput from '../extras/SearchInput.vue';
import { mapState } from 'vuex';
import vClickOutside from 'v-click-outside';
import FilterDropdown from '../global/FilterDropdown.vue';
import {
    DISTANCE_FILTER_OPTIONS,
    RENT_FILTER_OPTIONS,
    SORT_FILTER_OPTIONS,
    STATUS_FILTER_OPTIONS,
} from '@/constant/constant';
import FilterManager from '@/modules/filter';
import SelectInput from '../global/SelectInput.vue';
export default {
    name: 'TemplateSrp',
    directives: {
        clickOutside: vClickOutside.directive,
    },
    components: {
        MoleculeSRPCard,
        MapContainer,
        SearchInput,
        AtomCheckbox,
        FilterDropdown,
        SelectInput,
    },
    emits: ['changed', 'flyToSrp', 'details'],
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
    data() {
        return {
            center: null,
            statusFilterOptions: STATUS_FILTER_OPTIONS,
            distanceFilterOptions: DISTANCE_FILTER_OPTIONS,
            rentFilerOptions: RENT_FILTER_OPTIONS,
            sortFilterOptions: SORT_FILTER_OPTIONS,
            filterSelectedValues: {
                rent: '',
                distance: '',
                status: '',
            },
            filterManager: null,
        };
    },
    computed: {
        ...mapState('map', [
            'selectedLocation',
            'filters',
            'filteredSpots',
            'selectedSort',
        ]),
    },
    created() {
        this.filterManager = new FilterManager(this.$store, this);

        const methodsToBind = [
            'addFilter',
            'removeFilter',
            'handleStatusFilter',
            'loadFiltersFromQuery',
            'sortFilteredResults',
        ];

        methodsToBind.forEach((method) => {
            this[method] = (...args) => this.filterManager[method](...args);
        });
    },
    mounted() {
        const latlang = this.$route.query['latlng'];
        if (latlang) {
            this.center = latlang.split(',').map(Number).reverse();
        }
        // Load and apply filter values from the query parameters
        this.loadFiltersFromQuery();
    },
    methods: {
        onPageChange(page) {
            this.$emit('changed', page);
        },
        details(spotID) {
            this.$emit('details', spotID);
        },
        onChange() {
            this.$emit('flyToSrp');
        },
    },
};
</script>

<style lang="scss" scoped>
.srp-container {
    display: flex;
    gap: 2rem;
    padding-left: 3rem;
    height: 90vh;

    .srp-control {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        margin-bottom: 24px;

        .map-search {
            width: 100%;
        }
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: space-between;
        min-height: 44px;
        position: relative;

        h3 {
            align-self: center;
            vertical-align: middle;
        }
    }

    .srp-lists {
        flex: 20%;
        padding-bottom: 2rem;

        .srp-results-heading {
            align-items: center;
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            span {
                color: rgb(151, 149, 149);
            }

            .sort {
                align-items: center;
                display: flex;
                gap: 8px;
                justify-content: center;
            }
        }

        hr {
            margin-top: 8px;
        }
    }

    .srp-list-items {
        /* scroll bar width, for use in mask calculations */
        --scrollbar-width: 8px;

        /* mask fade distance, for use in mask calculations */
        --mask-height: 32px;

        /* The CSS mask */
        /* The content mask is a linear gradient from top to bottom */
        --mask-image-content: linear-gradient(
            to bottom,
            transparent,
            var(--parkspot-black) var(--mask-height),
            var(--parkspot-black) calc(100% - var(--mask-height)),
            transparent
        );

        /* Here we scale the content gradient to the width of the container
      minus the scrollbar width. The height is the full container height */
        --mask-size-content: calc(100% - var(--scrollbar-width)) 100%;

        /* The scrollbar mask is a black pixel */
        --mask-image-scrollbar: linear-gradient(
            var(--parkspot-black),
            var(--parkspot-black)
        );

        /* The width of our black pixel is the width of the scrollbar.
      The height is the full container height */
        --mask-size-scrollbar: var(--scrollbar-width) 100%;

        /* If content exceeds height of container, overflow! */
        overflow-y: auto;

        /* Keep some space between content and scrollbar */
        padding-right: 4px;

        /* Need to make sure container has bottom space,
      otherwise content at the bottom is always faded out */
        padding-bottom: var(--mask-height);
        height: 70vh;

        /* Apply the mask image and mask size variables */
        mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
        mask-size: var(--mask-size-content), var(--mask-size-scrollbar);

        /* Position the content gradient in the top left, and the
      scroll gradient in the top right */
        mask-position:
            0 0,
            100% 0;

        /* We don't repeat our mask images */
        mask-repeat: no-repeat, no-repeat;
    }

    /* custom scroll design */
    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgb(202, 201, 201);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: var(--secondary-color);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgb(0, 88, 114);
    }

    .srp-map {
        flex: 50%;
    }

    .map-container {
        position: relative;
        height: 100%;
    }
}

@media only screen and (max-width: 1024px) {
    .srp-container {
        flex-direction: column-reverse;
        padding-left: 0;
        height: unset;
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
