<template>
    <section>
        <b-field :label="label">
            <b-autocomplete
                v-model="search"
                :data="filteredLocationName"
                ref="autocomplete"
                placeholder="e.g. Bengaluru"
                field="place_name"
                icon="magnify"
                :loading="isFetching"
                @typing="getAsyncData"
                @select="onSelect"
                keep-first
                :open-on-focus="true"
                @click.native="addRecentSearches()"
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
                            {{ props.option.place_name }}
                        </div>
                    </div>
                </template>
                <template #empty>
                    {{ search || 'No Recent Searches' }}
                </template>
            </b-autocomplete>
        </b-field>
    </section>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions, mapMutations } from 'vuex';
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
            selected: null,
            isFetching: false,
            search: '',
        };
    },
    computed: {
        ...mapGetters({
            LocationName: 'map/getLocationName',
        }),
        filteredLocationName() {
            return this.LocationName.filter((option) => {
                return (
                    option.place_name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) >= 0
                );
            });
        },
    },
    watch: {
        selected(location) {
            this.updateMapConfig([location.center[0], location.center[1]]); // needed for recentering of map.
            this.updateSelectedLocation(location); // get the actual value of selected option.
            this.updateSelectedCity(location.context[0]); // update selected city
            this.updateSelectedState(location.context[1]); // update selected state
            this.updateSelectedCountry(location.context[2]); // update selected country
        },
    },
    methods: {
        ...mapMutations({
            updateSelectedLocation: 'map/update-selected-location',
            updateSelectedCity: 'map/update-selected-city',
            updateSelectedState: 'map/update-selected-state',
            updateSelectedCountry: 'map/update-selected-country',
            updateMapConfig: 'map/update-map-config',
            updateRecentLocation: 'map/update-recent-location',
        }),
        ...mapActions({
            searchLocation: 'map/searchLocation',
            getFromRecent: 'map/getFromRecent',
        }),

        getAsyncData: _.debounce(async function (name) {
            /* eslint-disable */
            /*  'this' is working as expected here but
                eslint is showing error so it is disabled
                fot this function   */
            this.isFetching = true;
            try {
                await this.searchLocation(name);
            } catch (error) {
                console.log(error);
            } finally {
                this.isFetching = false;
            }
        }, 500),

        async addRecentSearches() {
            const recentSearches = await this.getFromRecent();
            if (this.LocationName.length === 0) {
                for (const recentSearch of recentSearches) {
                    this.LocationName.push(recentSearch);
                }
            }
        },

        onSelect(option) {
            this.selected = option;
            this.$emit('changed');
        },
    },
};
</script>

<style scoped>
.custom-color {
    color: var(--grey-shade);
}
</style>