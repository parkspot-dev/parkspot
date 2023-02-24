<template>
    <BodyWrapper>
        <div class="profile-masthead">
            <section class="profile-simple-masthead">
                <div class="masthead-wrapper">
                    <div class="masthead-avatar">
                        <img :src="user.photoURL" alt="profile pic" />
                    </div>
                    <div class="masthead-content">
                        <h1 class="masthead-profile-name">
                            {{ user.displayName }}
                        </h1>
                        <p class="masthead-profile-locality">India</p>
                        <div class="masthead-actions">
                            <AtomButton>Edit Profile</AtomButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
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
.profile-masthead {
    .profile-simple-masthead {
        padding: 60px 0 28px;

        .masthead-wrapper {
            display: flex;
            justify-content: center;

            .masthead-avatar {
                width: 120px;
                height: 120px;
                border-radius: 100%;
                margin-bottom: 32px;

                img {
                    width: 100%;
                    height: auto;
                    border-radius: 100%;
                }
            }
            .masthead-content {
                margin-left: 40px;

                .masthead-profile-name {
                    color: black;
                    font-size: 32px;
                    font-weight: 700;
                    line-height: 38px;
                    margin-top: 5px;
                    margin-bottom: 10px;
                }

                .masthead-profile-locality {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 28px;
                    margin-bottom: 8px;
                }

                .masthead-actions {
                }
            }
        }
    }
}
</style>