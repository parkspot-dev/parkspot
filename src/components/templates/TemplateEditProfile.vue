<template>
    <BodyWrapper class="profile-container">
        <LoaderModal :isLoading="!user"></LoaderModal>
        <div class="edit-profile-main" v-if="user">
            <div class="profile-group-head">
                <div class="user-avatar">
                    <img :src="user.photoURL" alt="profile pic" />
                </div>
                <div class="user-details">
                    <h1>
                        <a href=""> {{ user.displayName }}</a>
                        <span>/</span>
                        Edit Profile
                    </h1>
                    <h2>Set up your Parkspot account.</h2>
                </div>
            </div>
            <div class="edit-main">
                <div class="secondary">
                    <ul>
                        <li>
                            <a
                                @click="updateActiveForm(1)"
                                :class="isActive === 1 ? 'link-active' : ''"
                            >
                                General
                            </a>
                        </li>
                        <!-- disabling below features not fully ready yet -->
                        <li>
                            <a
                                @click="updateActiveForm(2)"
                                :class="isActive === 2 ? 'link-active' : ''"
                            >
                                Parking Facility
                            </a>
                        </li>
                        <li>
                            <a
                                @click="updateActiveForm(3)"
                                :class="isActive === 3 ? 'link-active' : ''"
                            >
                                KYC Verification
                            </a>
                        </li>
                        <li>
                            <a
                                @click="updateActiveForm(4)"
                                :class="isActive === 4 ? 'link-active' : ''"
                            >
                                Map Location
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="primary">
                    <keep-alive>
                        <component :is="activeForm"></component>
                    </keep-alive>
                </div>
            </div>
        </div>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import OrganismUserGeneralInfo from '../organisms/OrganismUserGeneralInfo.vue';
import OrganismParkingFacility from '../organisms/OrganismParkingFacility.vue';
import OrganismKycForm from '../organisms/OrganismKycForm.vue';
import OrganismMapLocation from '../organisms/OrganismMapLocation.vue';
import LoaderModal from '../extras/LoaderModal.vue';
import { mapState } from 'vuex';
export default {
    name: 'TemplateUserProfile',
    components: {
        BodyWrapper,
        OrganismUserGeneralInfo,
        OrganismParkingFacility,
        OrganismKycForm,
        LoaderModal,
        OrganismMapLocation,
    },
    data() {
        return {
            activeForm: 'OrganismUserGeneralInfo',
            isActive: 1,
        };
    },
    computed: {
        ...mapState('user', ['user', 'isSavedProfileData']),
    },
    methods: {
        updateActiveForm(formNo) {
            if (this.isSavedProfileData) {
                this.isActive = formNo;
                switch (formNo) {
                    case 1:
                        this.activeForm = 'OrganismUserGeneralInfo';
                        break;

                    case 2:
                        this.activeForm = 'OrganismParkingFacility';
                        break;
                    case 3:
                        this.activeForm = 'OrganismKycForm';
                        break;
                    case 4:
                        this.activeForm = 'OrganismMapLocation';
                        break;
                }
            } else {
                alert('please save the data..!');
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.profile-container {
    background-color: #f8f8ff;
}

.edit-profile-main {
    max-width: 878px;
    margin: 0 auto;
}
.profile-group-head {
    position: relative;
    display: flex;
    gap: 16px;
    margin-bottom: 30px;

    .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        margin-bottom: 32px;

        img {
            width: 100%;
            height: auto;
            border-radius: 100%;
        }
    }

    .user-details {
        margin-left: 12px;

        h1 {
            font-size: 20px;
            font-weight: 500;
            line-height: 29px;
            color: black;
            a {
                color: black;
            }

            span {
                color: #abaab5;
                margin: 0 3px;
            }
        }

        h2 {
            display: inline-block;
            color: #6e6d7a;
            font-size: 14px;
            font-weight: normal;
        }
    }
}

.edit-main {
    display: flex;
    .primary {
        flex: 1 1 70%;
    }
    .secondary {
        flex: 1 1 30%;
        font-size: 15px;

        ul {
            li {
                padding: 7px 0;
                a {
                    color: #6e6d7a;
                }
                .link-active {
                    color: black;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>
