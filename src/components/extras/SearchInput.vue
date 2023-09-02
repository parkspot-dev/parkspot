<template>
    <section>
        <div class="search-box-controller">
            <b-field :label="label">
                <b-autocomplete
                    v-model="searchWord"
                    :data="filteredDataArray"
                    ref="autocomplete"
                    placeholder="e.g. Bengaluru"
                    field="placeName"
                    icon="magnify"
                    :loading="isFetching"
                    @typing="getAsyncData"
                    @select="onSelect"
                    keep-first
                    :open-on-focus="true"
                    @click.native="displayRecentSearches()"
                >
                    <template slot-scope="props">
                        <div class="media">
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
                                {{ props.option.placeName }}
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        {{ searchWord || 'No Recent Searches' }}
                    </template>
                </b-autocomplete>
            </b-field>
        </div>
    </section>
</template>

<script>
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
            searchWord: '',
            mapOptions: {
                fields: ['place_id', 'geometry', 'name', 'formatted_address'],
                strictBounds: false,
                componentRestrictions: {
                    country: 'in',
                }, // 2-letters code
                locationBias: 'IP_BIAS',
                types: ['address'],
            },
            isFetching: false,
        };
    },
    computed: {
        ...mapState('map', ['suggestionLocations']),
        filteredDataArray() {
            return this.suggestionLocations.filter((option) => {
                return option.placeName
                    ? option.placeName
                          .toString()
                          .toLowerCase()
                          .indexOf(this.searchWord.toLowerCase()) >= 0
                    : option.placeName;
            });
        },
    },
    methods: {
        ...mapActions('map', [
            'getSelectedLocationLatLng',
            'updateInitialSelectedLatLng',
            'addSuggestionLocations',
        ]),

        async displayRecentSearches() {
            let suggestions = [];
            this.getSearchHistory((localSearchHistory) => {
                suggestions = localSearchHistory;
            });
            this.addSuggestionLocations(suggestions);
        },

        async getAsyncData() {
            // import map libraries
            await google.maps.importLibrary('maps');
            const autocompleteService =
                new google.maps.places.AutocompleteService();

            // Add a listener for when the input field is focused
            this.getSearchHistory((results) => {
                autocompleteService.getPlacePredictions(
                    {
                        ...this.mapOptions,
                        sessionToken:
                            new google.maps.places.AutocompleteSessionToken(),
                        input: this.searchWord,
                    },
                    (predictions, status) => {
                        if (
                            status === google.maps.places.PlacesServiceStatus.OK
                        ) {
                            const searchHistory = results;

                            const autocompletePredictions = predictions.map(
                                (prediction) => {
                                    return {
                                        placeName: prediction.description,
                                        placeId: prediction.place_id,
                                    };
                                },
                            );

                            const suggestions = Array.from(
                                new Set([
                                    ...searchHistory,
                                    ...autocompletePredictions,
                                ]),
                            );

                            const suggestionsSet = new Set(
                                suggestions.map(JSON.stringify),
                            );
                            const uniqueSuggestions = Array.from(
                                suggestionsSet,
                            ).map(JSON.parse);
                            this.addSuggestionLocations(uniqueSuggestions);
                        }
                    },
                );
            });
        },

        async onSelect(selectedLocation) {
            await google.maps.importLibrary('maps');
            this.saveSearchHistory({ ...selectedLocation, fromLS: true });
            const geocoder = new google.maps.Geocoder();
            const res = await geocoder.geocode({
                placeId: selectedLocation.placeId,
            });
            this.getSelectedLocationLatLng(res.results[0]);
            this.$emit('changed');
        },

        saveSearchHistory(selectedLocation) {
            // Save the formatted address to local storage or a database
            let searchHistory = [];
            this.getSearchHistory((localSearchHistory) => {
                searchHistory = localSearchHistory;
            });
            searchHistory.unshift(selectedLocation); // add in the top , so the top will always be latest
            const newSearchHistory = searchHistory.slice(0, 3); // only upto 3
            const searchHistorySet = new Set(
                newSearchHistory.map(JSON.stringify),
            );
            const uniqueSearchHistory = Array.from(searchHistorySet).map(
                JSON.parse,
            );
            localStorage.setItem(
                'searchHistory',
                JSON.stringify(uniqueSearchHistory),
            );
        },

        getSearchHistory(callback) {
            // Retrieve the search history from local storage or a database
            const searchHistory = localStorage.getItem('searchHistory');
            callback(searchHistory ? JSON.parse(searchHistory) : []);
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
    position: relative;
    clear: both;
    font-size: 1rem;
    text-align: inherit;
}

::placeholder {
    color: #dbdbdb;
    opacity: 1; /* Firefox */
}

/* stylelint-disable-next-line selector-no-vendor-prefix */
:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #dbdbdb;
}

/* stylelint-disable-next-line selector-no-vendor-prefix */
::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #dbdbdb;
}
</style>
