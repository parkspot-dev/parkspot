<template>
    <div class="srp-container">
        <div class="srp-lists">
            <div class="srp-control">
                <SearchInput
                    class="map-search"
                    @changed="onChange"
                ></SearchInput>
                <div class="filter-component">
                    <div v-click-outside="onOutsideFilter">
                        <b-button
                            icon-left="tune-variant"
                            @click="activateFilter"
                        >
                            Filters
                        </b-button>
                        <div class="filter-dropdown" v-if="isFilter">
                            <ul>
                                <AtomCheckbox
                                    :values="filterOptions"
                                    :size="'is-small'"
                                    @input="handleFilter"
                                ></AtomCheckbox>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="srp-results-heading">
                <p>
                    Spots found:
                    <strong>
                        <b-tag type="is-light">
                            {{ spots.length }}
                        </b-tag>
                    </strong>
                </p>
            </div>
            <hr />
            <div class="srp-list-items">
                <MoleculeSRPCard
                    v-for="spot in spots"
                    :key="spot.ID"
                    :spot="spot"
                    @on-details="details"
                    @click.native="selected(spot)"
                ></MoleculeSRPCard>
            </div>
        </div>
        <div class="srp-map">
            <MapContainer
                class="map-container"
                :spotsList="spots"
                :key="reRender"
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
export default {
    name: 'TemplateSrp',
    directives: {
        clickOutside: vClickOutside.directive,
    },
    components: {
        // PaginationBody,
        MoleculeSRPCard,
        MapContainer,
        SearchInput,
        AtomCheckbox,
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
            filterOptions: ['Available', 'Rented out'],
            isFilter: false,
        };
    },
    computed: {
        ...mapState('map', ['selectedLocation']),
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
        selected(spot) {
            console.log(spot);
        },
        activateFilter() {
            this.isFilter = !this.isFilter;
        },
        onOutsideFilter() {
            this.isFilter = false;
        },
        handleFilter(filterOptions) {
            this.$emit('filter', filterOptions);
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

        .filter-component {
            position: relative;

            .filter-dropdown {
                position: absolute;
                padding: 12px 5px 5px 12px;
                width: 120px;
                z-index: 999;
                border-radius: 4px;
                border: 1px solid #000000;
                background-color: #ffffff;

                ul {
                    font-size: 16px;
                }
            }
        }
    }

    .srp-lists {
        flex: 20%;
        padding-bottom: 2rem;

        .srp-results-heading {
            span {
                color: rgb(151, 149, 149);
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
            #000000 var(--mask-height),
            #000000 calc(100% - var(--mask-height)),
            transparent
        );
        /* Here we scale the content gradient to the width of the container
      minus the scrollbar width. The height is the full container height */
        --mask-size-content: calc(100% - var(--scrollbar-width)) 100%;
        /* The scrollbar mask is a black pixel */
        --mask-image-scrollbar: linear-gradient(#000000, #000000);
        /* The width of our black pixel is the width of the scrollbar.
      The height is the full container height */
        --mask-size-scrollbar: var(--scrollbar-width) 100%;
        /* If content exceeds height of container, overflow! */
        overflow-y: auto;
        /* Keep some space between content and scrollbar */
        padding-right: 20px;
        /* Need to make sure container has bottom space,
      otherwise content at the bottom is always faded out */
        padding-bottom: var(--mask-height);
        height: 70vh;
        /* Apply the mask image and mask size variables */
        mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
        mask-size: var(--mask-size-content), var(--mask-size-scrollbar);
        /* Position the content gradient in the top left, and the
      scroll gradient in the top right */
        mask-position: 0 0, 100% 0;
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
