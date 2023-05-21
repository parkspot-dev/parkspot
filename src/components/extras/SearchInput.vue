<template>
    <section>
        <b-field :label="label">
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
                            {{ props.option.description }}
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
            selected: null,
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
    watch: {
        selected(newLocation) {},
    },
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
                await this.getPredictedLocations(name);
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

        onSelect(selectedLocation) {
            this.getSelectedLocationLatLng(selectedLocation);
            this.selected = selectedLocation;
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
