<template>
    <section>
        <div class="search-box-controller">
            <input
                class="search-box"
                id="autocomplete"
                type="text"
                :placeholder="'search location'"
                v-model="searchWord"
            />
            <AtomIcon class="search-icon" :icon="'magnify'"> </AtomIcon>
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
            search: '',
            searchWord: '',
        };
    },
    computed: {
        ...mapState('map', {
            LocationName: (state) => state.locations,
        }),
    },
    async created() {
        // initial check for search history
        let searchHistory = [];
        this.getSearchHistory((localSearchHistory) => {
            searchHistory = localSearchHistory;
        });
        if (searchHistory.length) {
            this.searchWord = searchHistory[0].formatted_address;
            this.updateInitialSelectedLatLng(searchHistory[0]);
        }

        // import map libraries
        await google.maps.importLibrary('maps');
        const inputRef = document.getElementById('autocomplete');
        const options = {
            fields: ['place_id', 'geometry', 'name', 'formatted_address'],
            strictBounds: false,
            componentRestrictions: {
                country: 'in',
            }, // 2-letters code
            locationBias: 'IP_BIAS',
            types: ['address'],
        };

        // Create a new autocomplete object and attach it to the input field
        const autocomplete = new google.maps.places.Autocomplete(
            inputRef,
            options,
        );

        // Create a new autocomplete service object
        const autocompleteService =
            new google.maps.places.AutocompleteService();

        // Add a listener for when the input field changes
        autocomplete.addListener('place_changed', () => {
            this.onSelect(autocomplete);
        });

        // Add a listener for when the input field is focused
        inputRef.addEventListener('focus', () => {
            this.getSearchHistory((results) => {
                autocompleteService.getPlacePredictions(
                    {
                        input: this.searchWord,
                        types: ['address'],
                        componentRestrictions: {
                            country: 'in',
                        },
                        sessionToken:
                            new google.maps.places.AutocompleteSessionToken(),
                        fields: [
                            'place_id',
                            'geometry',
                            'name',
                            'formatted_address',
                        ],
                        strictBounds: false,
                    },
                    (predictions, status) => {
                        if (
                            status === google.maps.places.PlacesServiceStatus.OK
                        ) {
                            const searchHistory = results.map(
                                (result) => result.formatted_address,
                            );
                            const autocompletePredictions = predictions.map(
                                (prediction) => prediction.description,
                            );
                            autocomplete.setOptions({
                                types: ['address'],
                                componentRestrictions: {
                                    country: 'in',
                                },
                                sessionToken:
                                    new google.maps.places.AutocompleteSessionToken(),
                                fields: [
                                    'place_id',
                                    'geometry',
                                    'name',
                                    'formatted_address',
                                ],
                                strictBounds: false,
                                // Combine search history and autocomplete predictions
                                // and remove duplicates
                                suggestions: Array.from(
                                    new Set([
                                        ...searchHistory,
                                        ...autocompletePredictions,
                                    ]),
                                ),
                            });
                        }
                    },
                );
            });
        });
    },
    methods: {
        ...mapActions('map', [
            'getPredictedLocations',
            'getFromRecent',
            'getSelectedLocationLatLng',
            'updateInitialSelectedLatLng',
        ]),

        async onSelect(autocomplete) {
            const selectedLocation = autocomplete.getPlace();
            this.saveSearchHistory(selectedLocation);
            const geocoder = new google.maps.Geocoder();
            const res = await geocoder.geocode({
                placeId: selectedLocation.place_id,
            });

            this.getSelectedLocationLatLng(res.results[0]);
            this.$emit('changed');
        },

        saveSearchHistory(formattedAddress) {
            // Save the formatted address to local storage or a database
            let searchHistory = [];
            this.getSearchHistory((localSearchHistory) => {
                searchHistory = localSearchHistory;
            });
            searchHistory.unshift(formattedAddress); // add in the top , so the top will always be latest
            searchHistory.slice(0, 3); // only upto 3
            const uniqueSearchHistory = [...new Set(searchHistory)];
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
