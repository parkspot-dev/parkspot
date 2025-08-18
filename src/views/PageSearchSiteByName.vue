<template>
    <div class="kyc-status-portal-root p-5">
        <!-- Search Bar -->
        <div class="search-control mb-4">
            <MoleculeSearchBox
                :initialValue="searchName"
                @clear-input="onClearNameInput"
                @on-search="searchSitesByName"
                placeholder="Site Name"
            ></MoleculeSearchBox>
        </div>

        <!-- Loading modal displayed during data fetch -->
        <LoaderModal v-if="isLoading"></LoaderModal>

        <!-- Show message when no data -->
        <div v-if="!isLoading && sites.length === 0" class="has-text-centered mt-6">
            <b-icon icon="alert-circle" size="is-large" type="is-info"></b-icon>
            <p class="mt-3 has-text-grey">No sites found. Try another search.</p>
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
                label="Site ID"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>{{ props.row.SiteID }}</div>
                </template>
            </b-table-column>
            <b-table-column
                field="Name"
                label="Site Name"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>{{ props.row.Name }}</div>
                </template>
            </b-table-column>

            <b-table-column
                field="Address"
                label="Address"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>{{ props.row.Address }}</div>
                </template>
            </b-table-column>
            <b-table-column
                field="Type"
                label="Type"
                cell-class="has-text-left"
            >
                <template v-slot="props">
                    <div>{{ props.row.Type }}</div>
                </template>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import LoaderModal from '../components/extras/LoaderModal.vue';
import MoleculeSearchBox from '@/components/molecules/MoleculeSearchBox.vue';
import SelectInput from '@/components/global/SelectInput.vue';
import { mayaClient } from '../services/api';

export default {
    name: 'SiteSearchPage',
    components: {
        LoaderModal,
        MoleculeSearchBox,
        SelectInput,
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

            try {
                console.log("searching site name", name)
                const res = await mayaClient.get(`sites-by-name`, {
                    params: { name },
                });
                this.sites = res.data || [];
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

        async searchSitesByName(siteName) {
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
                    this.fetchSitesByName(sanitized);
                }
            }
        },

        async onClearNameInput() {
            if (this.$route.query.name) {
                this.searchName = '';
                this.sites = [];
                this.$router.push({ name: 'site-search' });
            }
        },

        sanitizeName(input) {
            let sanitized = input.trim();
            return sanitized.length > 0 ? sanitized : null;
        },
    },
};
</script>

<style scoped>
.kyc-status-portal-root {
    padding: 40px;
}
.table {
    margin-top: 20px;
}
</style>