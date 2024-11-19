<template>
    <div class="main-box">
        <AtomHeading :level="'h1'" class="mb-5 has-text-centered">
            Find the Perfect Parking Spot Near You
        </AtomHeading>
        <div class="search-box">
            <SearchInput class="search-input"></SearchInput>
            <AtomButton class="btn" @click.native="flyToSrp" :withSearch="true">
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
import AtomButton from '../atoms/AtomButton.vue';
import AtomHeading from '../atoms/AtomHeading.vue';
import SearchInput from '../extras/SearchInput.vue';
import AtomParagraph from '../atoms/AtomParagraph.vue';
import TopSearchesCard from './TopSearchesCard.vue';
import { getCoordinate } from '../../includes/LatLng';
import { mapGetters } from 'vuex';
export default {
    name: 'SearchComponent',
    components: {
        AtomHeading,
        AtomButton,
        SearchInput,
        AtomParagraph,
        TopSearchesCard,
    },

    computed: {
        ...mapGetters({
            LocDetails: 'map/getLocDetails',
        }),
    },
    data() {
        return {
            items: [
                {
                    id: 1,
                    title: 'Parking Spot in JP-Nagar',
                    spots: 40,
                    path: '/bangalore/parking-near-jp-nagar',
                },
                {
                    id: 2,
                    title: 'Parking Spot in BTM',
                    spots: 20,
                    path: '/bangalore/parking-near-btm',
                },
                {
                    id: 3,
                    title: 'Parking Spot in Hyderabad',
                    spots: 60,
                    path: '/hyderabad/parking-near-hyderabad',
                },
            ],
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
        url('https://www.optex.co.jp/e/business-sectors/tdphtg0000006ax6-img/tdphtg0000006axd.png')
            no-repeat center/cover;
    color: var(--parkspot-white);
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding: 40px 0;
    width: 100%;
}

.search-box {
    align-items: center;
    align-self: center;
    background-color: var(--parkspot-white);
    border-radius: var(--border-default);
    display: flex;
    justify-content: center;
    margin-top: 20px;
    width: 40%;
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
    margin-top: 60px;
    text-align: center;
}

.cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem;
}

@media screen and (max-width: 768px) {
    .main-box{
        padding: 40px 20px;
    }

    .search-box {
        width: 90%;
    }

    .btn {
        width: 40%;
    }

    .cards-row {
        gap: 1rem;
    }
}
</style>
