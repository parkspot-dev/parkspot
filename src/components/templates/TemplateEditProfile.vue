<template>
    <BodyWrapper>
        <LoaderModal v-if="!user"></LoaderModal>
        <div class="edit-profile-main" v-else>
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
                    General
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
import LoaderModal from '../extras/LoaderModal.vue';
import { mapState } from 'vuex';
export default {
    name: 'TemplateUserProfile',
    components: {
        BodyWrapper,
        OrganismUserGeneralInfo,
        LoaderModal,
    },
    data() {
        return {
            activeForm: 'OrganismUserGeneralInfo',
        };
    },
    computed: {
        ...mapState('user', {
            user: (state) => state.user,
        }),
    },
};
</script>

<style lang="scss" scoped>
.edit-profile-main {
    margin: 0 auto;
    max-width: 878px;
}
.profile-group-head {
    position: relative;
    display: flex;
    gap: 16px;
    margin-bottom: 30px;

    .user-avatar {
        margin-bottom: 32px;
        width: 48px;
        height: 48px;
        border-radius: 100%;

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
            color: var(--parkspot-black);

            a {
                color: var(--parkspot-black);
            }

            span {
                margin: 0 3px;
                color: #abaab5;
            }
        }

        h2 {
            display: inline-block;
            font-size: 14px;
            font-weight: normal;
            color: #6e6d7a;
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
                    font-weight: 600;
                    color: var(--parkspot-black);
                }
            }
        }
    }
}
</style>
