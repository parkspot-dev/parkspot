<template>
    <div class="search-spot-portal-root p-5">
        <!-- Search Bar -->
        <div class="search-control mb-4">
            <MoleculeSearchBox
                :initial-value="searchQuery"
                :placeholder="searchPlaceholder"
                @clear-input="onClearSearchInput"
                @on-search="searchSpots"
            ></MoleculeSearchBox>
        </div>

        <!-- Search Type Selection -->
        <div class="is-flex is-justify-content-center mb-4">
            <b-field>
                <b-radio
                    v-model="searchType"
                    native-value="name"
                    type="is-info"
                    class="mr-4"
                >
                    By Name
                </b-radio>
                <b-radio
                    v-model="searchType"
                    native-value="mobile"
                    type="is-info"
                >
                    By Mobile Number
                </b-radio>
            </b-field>
        </div>

        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>

        <!-- Show message when no data -->
        <div
            v-if="!isLoading && sites.length === 0"
            class="has-text-centered mt-6"
        >
            <b-icon icon="alert-circle" size="is-large" type="is-info"></b-icon>
            <p class="mt-3 has-text-grey">
                No spots found. Try another search.
            </p>
        </div>

        <!-- Buefy Table -->
        <b-table
            v-else
            :data="sites"
            :paginated="true"
            :per-page="16"
            :bordered="true"
            :hoverable="true"
            :focusable="true"
            :mobile-cards="true"
            :narrowed="true"
            :sticky-header="true"
            class="table"
            height="700"
        >
            <b-table-column
                field="SiteID"
                label="Spot ID"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div
                        class="cursor-pointer"
                        @click="spotDetails(props.row.SiteID)"
                    >
                        {{ props.row.SiteID }}
                    </div>
                </template>
            </b-table-column>
            <b-table-column
                field="Name"
                label="Spot Name"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>{{ props.row.Name }}</div>
                </template>
            </b-table-column>

            <b-table-column
                field="Address"
                label="Address"
                cell-class="has-text-left"
            >
                <template #default="props">
                    <div>{{ props.row.Address }}</div>
                </template>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '@/components/molecules/MoleculeSearchBox.vue';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'SiteSearchPage',
    components: {
        LoaderModal,
        MoleculeSearchBox,
    },

    data() {
        return {
            searchQuery: '',
            searchType: 'name',
        };
    },

    computed: {
        ...mapState('spotSearch', [
            'sites',
            'isLoading',
            'hasError',
            'errorMessage',
        ]),
        searchPlaceholder() {
            return this.searchType === 'name' ? 'Spot Name' : 'Mobile Number';
        },
    },

    created() {
        const name = this.$route.query.name;
        const mobile = this.$route.query.mobile;

        if (mobile) {
            this.searchType = 'mobile';
            this.searchQuery = mobile;
            this.triggerSearch(mobile, 'mobile');
        } else if (name) {
            this.searchType = 'name';
            this.searchQuery = name;
            this.triggerSearch(name, 'name');
        }
    },

    methods: {
        ...mapActions('spotSearch', ['fetchSites']),

        async triggerSearch(query, searchType) {
            try {
                await this.fetchSites({ query, searchType });
            } catch (err) {
                console.error(err);
                this.$buefy.dialog.alert({
                    title: 'Error',
                    message: this.errorMessage || 'Something went wrong',
                    type: 'is-danger',
                });
            }
        },

        async searchSpots(query) {
            if (query !== '') {
                const sanitized = this.sanitizeInput(query);
                if (!sanitized) {
                    this.$buefy.dialog.alert({
                        title: 'Error',
                        message: `Invalid ${this.searchType === 'name' ? 'Site Name' : 'Mobile Number'}`,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'alert-circle',
                        ariaRole: 'alertdialog',
                        ariaModal: true,
                    });
                } else {
                    this.searchQuery = sanitized;
                    const newQuery = {};
                    newQuery[this.searchType] = sanitized;
                    this.$router.push({
                        path: this.$route.path,
                        query: newQuery,
                    });
                }
            }
        },

        spotDetails(spotID) {
            const route = this.$router.resolve({
                name: 'spot-detail',
                params: {
                    spotId: spotID,
                },
            });
            window.open(route.href);
        },

        async onClearSearchInput() {
            this.searchQuery = '';
            this.$store.commit('spotSearch/set-sites', []);
            if (this.$route.query.name || this.$route.query.mobile) {
                this.$router.push({ name: 'spot-search' });
            }
        },

        sanitizeInput(input) {
            const sanitized = input.trim();
            return sanitized.length > 0 ? sanitized : null;
        },
    },
};
</script>

<style lang="scss" scoped>
.search-spot-portal-root {
    background: var(--parkspot-white);
    padding: 16px;
    text-align: center;

    h1 {
        font-size: 24px;
        margin-bottom: 12px;
    }
}

.table {
    margin-top: 32px;
}

.cursor-pointer {
    cursor: pointer;
    color: var(--secondary-color);
}
</style>
