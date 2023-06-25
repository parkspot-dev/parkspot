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
                            <!-- fromLS should be renamed -->
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
                return (
                    option.placeName
                        .toString()
                        .toLowerCase()
                        .indexOf(this.searchWord.toLowerCase()) >= 0
                );
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
            // let suggestions = [];
            // this.getSearchHistory((localSearchHistory) => {
            //     suggestions = localSearchHistory;
            // });
            // this.addSuggestionLocations(suggestions);
        },

        async getAsyncData() {
            // import map libraries
            await google.maps.importLibrary('maps');
            const autocompleteService =
                new google.maps.places.AutocompleteService();

            // Add a listener for when the input field is focused
            this.getSearchHistory((results) => {
                console.log(results);
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
<style lang="scss">
/* Style the Autocomplete input field */
.pac-container {
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    margin-top: 1px;
    position: absolute;
    z-index: 1000;
}

.pac-container input {
    width: 100%;
    height: 38px;
    padding: 10px;
    border: none;
    outline: none;
}

/* Style the Autocomplete dropdown menu */
.pac-item {
    font-size: 14px;
    padding: 5px 10px;
    cursor: pointer;
}

.pac-item:hover {
    background-color: #f5f5f5;
}

.pac-item-selected,
.pac-item-selected:hover {
    background-color: #e5e5e5;
}
</style>
