<template>
    <div class="home-card">
        <b-tabs expanded>
            <b-tab-item>
                <template #header>
                    <div class="header-tab-btn">
                        <AtomIcon
                            :icon="'car-back'"
                            :size="'is-medium'"
                        ></AtomIcon>
                        <span> Car Owner </span>
                    </div>
                </template>
                <template>
                    <div class="card-main-body">
                        <h2>Search a spot for the car</h2>
                        <SearchInput class="mb-6"></SearchInput>
                        <AtomButton>Search now</AtomButton>
                    </div>
                </template>
            </b-tab-item>
            <b-tab-item>
                <template #header>
                    <div class="header-tab-btn">
                        <AtomIcon
                            :icon="'home-account'"
                            :size="'is-medium'"
                        ></AtomIcon>
                        <span> Spot Owner </span>
                    </div>
                </template>
                <template>
                    <div class="card-main-body">
                        <h2>Register unused parking spot</h2>
                        <p class="mb-5">
                            Start earning money by listing unused parking spot
                            in our platform.
                        </p>
                        <AtomButton class="mb-6">Search now</AtomButton>
                        <p>Learn more about being a spot owner.</p>
                    </div>
                </template>
            </b-tab-item>
        </b-tabs>
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
import SearchInput from '../extras/SearchInput.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    name: 'HomeCard',
    components: {
        AtomIcon,
        SearchInput,
        AtomButton,
    },
};
</script>

<style lang="scss" scoped>
.home-card {
    width: 562px;
    height: 509px;
    border-radius: var(--border-default);
    background: white;

    .header-tab-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-main-body {
        padding: 33px 49px;
        h2 {
            font-size: 48px;
            font-weight: 700;
            line-height: 58px;
            color: black;
            margin-bottom: 62px;
        }

        p {
            font-size: 16px;
            color: #8c8c8c;
            line-height: 19px;
        }
    }
}
</style>