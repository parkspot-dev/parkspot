<template>
    <div class="main-box">
        <div class="search-box">
            <SearchInput class="search-input"></SearchInput>
            <AtomButton class="btn" :with-search="true" @click.native="flyToSrp">
                Search now
            </AtomButton>
        </div>
        <div class="most-search-container">
            <AtomParagraph class="custom-subtitle"
                >Most Searched Places</AtomParagraph
            >
            <div class="cards-row">
                <TopSearchesCard
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                />
            </div>
        </div>
    </div>
</template>
<script>
import { getCoordinate } from '../../includes/LatLng';
import { mapGetters } from 'vuex';
import { TOP_SEARCH_PLACES } from '../../constant/constant';
import AtomButton from '../atoms/AtomButton.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import SearchInput from '../extras/SearchInput.vue';
import TopSearchesCard from './TopSearchesCard.vue';

export default {
    name: 'SearchComponent',
    components: {
        AtomButton,
        AtomParagraph,
        SearchInput,
        TopSearchesCard,
    },

    computed: {
        ...mapGetters({
            LocDetails: 'map/getLocDetails',
        }),
    },
    data() {
        return {
            // TODO: Fetch dynamically from Firebase
            items: TOP_SEARCH_PLACES
        };
    },

    methods: {
        flyToSrp() {
            const coordinate = getCoordinate(this.LocDetails.lnglat.toString())
                .reverse()
                .toString();
            this.$router.push({
                name: 'srp',
                query: {
                    latlng: coordinate,
                },
                params: {
                    location: this.LocDetails.locDetails.locName,
                },
            });
        },
    },
};
</script>

<style scoped>
.main-box {
    background: linear-gradient(rgba(0, 0, 0, 0.635), rgba(0, 0, 0, 0.635)),
        url('/assets/parking-background.png')
            no-repeat center/cover;
    color: var(--parkspot-white);
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 80px 0;
    width: 100%;
}

.search-box {
    align-items: center;
    align-self: center;
    background-color: var(--parkspot-white);
    border-radius: var(--border-default);
    display: flex;
    justify-content: center;
    width: 40%;
}

.most-search-container{
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.search-input {
    width: 80%;
}

.btn {
    font-weight: 700;
    width: 20%;
}

.custom-subtitle {
    color: var(--primary-color);
    font-weight: var(--semi-bold-font);
    text-align: center;
}

.cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: center;
}

@media screen and (min-width : 768px) and (max-width : 1200px){
    .main-box {
        padding: 40px 80px;
    }
    .search-box{
        width: 80%;
    }
}

@media screen and (max-width: 768px) {
    .main-box {
        padding: 40px 20px;
    }

    .search-box {
        width: 300px;
    }

    .btn {
        width: 40%;
    }

    .cards-row {
        gap: 40px;
    }
}
</style>
