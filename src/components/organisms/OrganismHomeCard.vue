<template>
    <div class="home-card">
        <b-tabs @input="onChange">
            <b-tab-item value="VO">
                <template #header>
                    <div class="header-tab-btn">
                        <b-icon class="tab-icon" :icon="'car'"></b-icon>
                        <span class="tab-btn-text"> Car owner</span>
                    </div>
                </template>
                <template>
                    <div class="card-main-body">
                        <h2 class="title">Search a spot for your car</h2>
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
                        <b-icon
                            class="tab-icon"
                            :icon="'home-map-marker'"
                        ></b-icon>
                        <span class="tab-btn-text"> Spot Owner </span>
                    </div>
                </template>
                <template>
                    <div class="card-main-body">
                        <h2 class="title">
                            Make money by renting out your parking spot
                        </h2>
                        <p class="subtitle mb-5">
                            Start earning money by listing unused parking spot
                            in our platform.
                        </p>
                        <AtomButton class="mb-5" @click.native="contactUs">
                            Register now
                        </AtomButton>
                        <div class="learn-more">
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
import SearchInput from '../extras/SearchInput.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { mapGetters } from 'vuex';
import { getCoordinate } from '../../includes/LatLng';
export default {
    name: 'HomeCard',
    components: {
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
        min-width: 104px;
        width: 104px;
        padding: 28px 16px 20px 16px;

        .tab-icon {
            width: 24px;
            height: 24px;
            margin: 0 auto;
        }

        .tab-btn-text {
            display: flex;
            font-size: 14px;
            font-weight: 500;
            justify-content: center;
            margin-top: 16px;
        }
    }

    .card-main-body {
        padding: 33px 49px;

        @media only screen and (max-width: 620px) {
            padding: 18px 13px;
        }

        .title {
            font-size: 48px;
            font-weight: 700;
            line-height: 58px;
            color: black;
            margin-bottom: 30px;

            @media only screen and (max-width: 620px) {
                font-size: 32px;
                line-height: 39px;
            }
        }

        .subtitle {
            font-size: 16px;
            color: #8c8c8c;
            line-height: 19px;
        }

        .learn-more {
            font-size: 14px;
            border-bottom: 1px solid #8c8c8c;
            color: #8c8c8c;
            line-height: 19px;
            cursor: pointer;
        }
    }
}
</style>
