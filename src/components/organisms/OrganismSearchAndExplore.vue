<template>
    <div class="main-box">
        <AtomHeading :level="'h2'" class="mb-5 has-text-centered">
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
                <MoleculeTopSearchCard
                    v-for="item in items"
                    :key="item.id"
                    :items="item"
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
import MoleculeTopSearchCard from '../molecules/MoleculeTopSearchCard.vue';
import { getCoordinate } from '../../includes/LatLng';
import { mapGetters } from 'vuex';
export default {
    name: 'OrganismSearchAndExplore',
    components: {
        AtomHeading,
        AtomButton,
        SearchInput,
        AtomParagraph,
        MoleculeTopSearchCard,
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
                    path: '/bangalore/parking-near-jp-nagar',
                },
                {
                    id: 2,
                    title: 'Parking Spot in BTM',
                    link: '/bangalore/parking-near-btm',
                },
                {
                    id: 3,
                    title: 'Parking Spot in Hyderabad',
                    link: '/hyderabad/parking-near-hyderabad',
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
        url('https://img.freepik.com/free-photo/parking_1127-2044.jpg?ga=GA1.1.1781815373.1722565677&semt=ais_hybrid')
            no-repeat center/cover;
    padding: 20px 0;
    margin-top: 20px;
    display: flex;
    width: 100%;
    flex-direction: column;
    border-radius: 10px;
    color: var(--parkspot-white);
}
.search-box {
    margin-top: 20px;
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    background-color: var(--parkspot-white);
    border-radius: 4px;
}

.search-input {
    width: 80%;
}

.btn {
    width: 20%;
    font-weight: 700;
}

.custom-subtitle {
    margin-top: 60px;
    font-weight: var(--semi-bold-font);
    text-align: center;
    color: var(--primary-color);
}

.cards-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem;
}

@media screen and (max-width: 768px) {
    .search-box {
        width: 90%;
    }

    .btn {
        width: 40%;
    }
}
</style>
