<template>
    <div class="search-spot-portal-root p-5">
        <!-- Search Bar -->
        <div class="search-control mb-4">
            <MoleculeSearchBox
                :initial-value="searchName"
                placeholder="Spot Name"
                @clear-input="onClearNameInput"
                @on-search="searchSpotsByName"
            ></MoleculeSearchBox>
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
// import SelectInput from '@/components/global/SelectInput.vue';
import { mayaClient } from '../services/api';

export default {
    name: 'SiteSearchPage',
    components: {
        LoaderModal,
        MoleculeSearchBox,
    },

    data() {
        return {
            isLoading: false,
            hasError: false,
            errorMessage: '',
            sites: [],
            searchName: '',
        };
    },

    created() {
        const name = this.$route.query.name;
        if (name) {
            this.searchName = name;
            this.fetchSitesByName(name);
        }
    },

    methods: {
        async fetchSitesByName(name) {
            this.isLoading = true;
            this.hasError = false;
            this.errorMessage = '';
            this.sites = [];
            name = name.trim();
            try {
                const encodedName = encodeURIComponent(name);
                const res = await mayaClient.get(
                    `/sites-by-name?name=${encodedName}`,
                );
                console.log("this is res", res)
                this.sites = res || [];
            } catch (err) {
                this.hasError = true;
                this.errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    'Something went wrong';
                this.$buefy.dialog.alert({
                    title: 'Error',
                    message: this.errorMessage,
                    type: 'is-danger',
                });
            } finally {
                this.isLoading = false;
            }
        },

        async searchSpotsByName(siteName) {
            if (siteName !== '') {
                const sanitized = this.sanitizeName(siteName);
                if (!sanitized) {
                    this.$buefy.dialog.alert({
                        title: 'Error',
                        message: 'Invalid Site Name',
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'alert-circle',
                        ariaRole: 'alertdialog',
                        ariaModal: true,
                    });
                } else {
                    this.searchName = sanitized;
                    this.$router.push({
                        path: this.$route.path,
                        query: { name: sanitized },
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

        async onClearNameInput() {
            if (this.$route.query.name) {
                this.searchName = '';
                this.sites = [];
                this.$router.push({ name: 'spot-search' });
            }
        },

        sanitizeName(input) {
            const sanitized = input.trim();
            return sanitized.length > 0 ? sanitized : null;
        },
    },
};
</script>

<style scoped>
.search-spot-portal-root {
    background: #f5f5fb;
    padding: 16px;
    text-align: center;

    h1 {
        font-size: 24px;
        margin-bottom: 10px;
    }
}

.table {
    margin-top: 32px;
}

.cursor-pointer {
    cursor: pointer;
    color: blue;
}
</style>
