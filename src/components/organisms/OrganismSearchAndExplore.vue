<template>
    <div class="main-box">
        <AtomHeading :level="headingLevel" class="mb-5 has-text-centered">
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
export default {
    name: 'OrganismSearchAndExplore',
    components: {
        AtomHeading,
        AtomButton,
        SearchInput,
        AtomParagraph,
        MoleculeTopSearchCard,
    },

    data() {
        return {
            items: [
                {
                    id: 1,
                    title: 'Parking Spot in JP-Nagar',
                    description:
                        'A serene spot in the city to relax and unwind.',
                    link: '/places/central-park',
                },
                {
                    id: 2,
                    title: 'Parking Spot in BTM',
                    description: 'Discover fresh produce and unique crafts.',
                    link: '/places/downtown-market',
                },
                {
                    id: 3,
                    title: 'Parking Spot in Hyderabad',
                    description: 'Enjoy beautiful sunsets and sandy shores.',
                    link: '/places/sunset-beach',
                },
            ],
        };
    },
};
</script>

<style scoped>
.main-box {
    background-color: white;
    padding: 20px 0;
    border-radius: 10px;
    margin-top: 20px;
    display: flex;
    width: 100%;
    flex-direction: column;
}

.search-box {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    background-color: #ffffff;
}

.search-input {
    width: 80%;
}

.btn {
    width: 20%;
    position: relative;
    right: 4px;
    font-weight: 700;
}

.custom-subtitle {
    margin-top: 60px;
    font-weight: var(--semi-bold-font);
    text-align: center;
    color: var(--secondary-color);
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
