<template>
    <BodyWrapper>
        <div class="edit-profile-main">
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
                    <h2>Set up your parkspot account.</h2>
                </div>
            </div>
            <div class="edit-main">
                <div class="primary"></div>
                <div class="secondary">
                    <ul>
                        <li>
                            <a href="">General</a>
                        </li>
                        <li>
                            <a href="">KYC Verification</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <AtomButton></AtomButton>
    </BodyWrapper>
</template>

<script>
import BodyWrapper from '../extras/BodyWrapper.vue';
import AtomButton from '../atoms/AtomButton.vue';
import { mapState } from 'vuex';
export default {
    name: 'TemplateUserProfile',
    components: {
        BodyWrapper,
        AtomButton,
    },
    computed: {
        ...mapState('user', {
            user: (state) => state.user,
        }),
    },
};
</script>

<style lang="scss" scoped>
.profile-group-head {
    position: relative;
    display: flex;
    gap: 15px;

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
    }
    .secondary {
        ul {
            li {
                padding: 7px 0;
                a {
                    color: #6e6d7a;
                }
            }
        }
    }
}
</style>