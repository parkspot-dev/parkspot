<template>
    <section>
        <!-- <b-field :label="label">
            <b-autocomplete
                v-model="search"
                :data="filteredLocationName"
                ref="autocomplete"
                placeholder="e.g. Bengaluru"
                field="description"
                icon="magnify"
                :loading="isFetching"
                @typing="getAsyncData"
                @select="onSelect"
                keep-first
                :open-on-focus="true"
                @click.native="addToRecentSearches()"
            >
                <template slot-scope="props">
                    <div class="media">
                        <p>fromLS should be renamed</p>
                        <div
                            class="media-left custom-color"
                            v-show="props.option.fromLS"
                        >
                            <AtomIcon :icon="'history'"> </AtomIcon>
                        </div>

                        <div
                            class="media-content"
                            :class="{
                                'custom-color': props.option.fromLS,
                            }"
                        >
                            {{ props.option.description }}
                        </div>
                    </div>
                </template>
                <template #empty>
                    {{ search || 'No Recent Searches' }}
                </template>
            </b-autocomplete>
        </b-field> -->

        <div class="search-box-controller">
            <input
                class="search-box"
                ref="autocomplete"
                type="text"
                :placeholder="'search location'"
                @click="getAsyncData"
            />
            <AtomIcon class="search-icon" :icon="'magnify'"> </AtomIcon>
        </div>
    </section>
</template>

<script>
import _ from 'lodash';
import { mapActions, mapState } from 'vuex';
import AtomIcon from '../atoms/AtomIcon.vue';

export default {
    name: 'SearchInput',
    components: {
        AtomIcon,
    },
    props: {
        /**
         * label heading
         */
        label: {
            type: String,
        },
    },
    emits: ['changed'],
    data() {
        return {
            isFetching: false,
            search: '',
        };
    },
    computed: {
        ...mapState('map', {
            LocationName: (state) => state.locations,
        }),
        filteredLocationName() {
            return this.LocationName.filter((option) => {
                return (
                    option.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) >= 0
                );
            });
        },
    },
    watch: {},
    methods: {
        ...mapActions('map', [
            'getPredictedLocations',
            'getFromRecent',
            'getSelectedLocationLatLng',
        ]),

        getAsyncData: _.debounce(async function (name) {
            /* eslint-disable */
            /*  'this' is working as expected here but
                eslint is showing error so it is disabled
                fot this function   */
            this.isFetching = true;
            try {
                await google.maps.importLibrary('maps');
                const inputRef = this.$refs.autocomplete;
                const options = {
                    fields: [
                        'place_id',
                        'geometry',
                        'name',
                        'formatted_address',
                    ],
                    strictBounds: false,
                    componentRestrictions: { country: 'in' }, // 2-letters code
                    locationBias: 'IP_BIAS',
                    types: ['establishment'],
                };
                const autocomplete = new google.maps.places.Autocomplete(
                    inputRef,
                    options,
                );
                autocomplete.addListener('place_changed', () =>
                    this.onSelect(autocomplete),
                );
            } catch (error) {
                console.log(error);
            } finally {
                this.isFetching = false;
            }
        }, 500),

        async addToRecentSearches() {
            console.log('addToRecentSearches');
            const recentSearches = await this.getFromRecent();
            if (this.LocationName.length === 0) {
                for (const recentSearch of recentSearches) {
                    this.LocationName.push(recentSearch);
                }
            }
        },

        async onSelect(autocomplete) {
            const selectedLocation = autocomplete.getPlace();
            const geocoder = new google.maps.Geocoder();
            const res = await geocoder.geocode({
                placeId: selectedLocation.place_id,
            });

            this.getSelectedLocationLatLng(res.results[0]);
            // this.$emit('changed');
        },
    },
};
</script>

<style lang="scss" scoped>
.custom-color {
    color: var(--grey-shade);
}

.search-box-controller {
    box-sizing: border-box;
    clear: both;
    font-size: 1rem;
    position: relative;
    text-align: inherit;

    .search-box {
        width: 100%;
        border: 1px solid #dbdbdb;
        height: 2.5em;
        padding-bottom: calc(0.5em - 1px);
        padding-left: calc(0.75em - 1px);
        padding-right: calc(0.75em - 1px);
        padding-top: calc(0.5em - 1px);
        font-size: 1rem;
        align-items: center;
        display: inline-flex;
        position: relative;
        padding-left: 2.5em;
    }

    .search-icon {
        color: #dbdbdb;
        height: 1.85em;
        pointer-events: none;
        position: absolute;
        top: 0;
        width: 1.75em;
        z-index: 4;
        left: 0;
        font-size: 24px;
    }
}

::placeholder {
    color: #dbdbdb;
    opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #dbdbdb;
}

::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #dbdbdb;
}
</style>
