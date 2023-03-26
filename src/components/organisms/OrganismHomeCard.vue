<template>
    <div class="home-card">
        <b-tabs expanded @input="onChange">
            <b-tab-item value="VO">
                <template #header>
                    <div class="header-tab-btn">
                        <AtomIcon
                            :icon="'car-back'"
                            :size="'is-medium'"
                        ></AtomIcon>
                        <span> Find Parking </span>
                    </div>
                </template>
                <template>
                    <div class="card-main-body">
                        <h2>Search a spot for your car</h2>
                        <SearchInput class="mb-6"></SearchInput>
                        <AtomButton @click.native="flyToSrp">
                            Search now
                        </AtomButton>
                    </div>
                </template>
            </b-tab-item>
            <b-tab-item value="SO">
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
                        <AtomButton class="mb-5" @click.native="contactUs">
                            Register now
                        </AtomButton>
                        <div>
                            <span @click="contactUs">
                                Learn more about being a spot owner.
                            </span>
                        </div>
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
import { mapGetters } from 'vuex';
import { getCoordinate } from '../../includes/LatLng';
export default {
    name: 'HomeCard',
    components: {
        AtomIcon,
        SearchInput,
        AtomButton,
    },
    computed: {
        ...mapGetters({
            LocDetails: 'map/getLocDetails',
        }),
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
        onChange(tabName) {
            this.$emit('changed', tabName);
        },

        contactUs() {
            this.$router.push({ name: 'contactUs' });
        },
    },
};
</script>

<style lang="scss" scoped>
.home-card {
    max-width: 562px;
    height: 509px;
    border-radius: var(--border-default);
    background: white;
    padding-top: 15px;
    padding-bottom: 10px;

    .header-tab-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-main-body {
        padding: 33px 49px;

        @media only screen and (max-width: 620px) {
            padding: 18px 13px;
        }

        h2 {
            font-size: 48px;
            font-weight: 700;
            line-height: 58px;
            color: black;
            margin-bottom: 62px;

            @media only screen and (max-width: 620px) {
                font-size: 32px;
                line-height: 39px;
            }
        }

        p {
            font-size: 16px;
            color: #8c8c8c;
            line-height: 19px;
        }

        span {
            font-size: 14px;
            border-bottom: 1px solid #8c8c8c;
            color: #8c8c8c;
            line-height: 19px;
            cursor: pointer;
        }
    }
}
</style>