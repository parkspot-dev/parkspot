<template>
    <div class="social-links">
        <ul>
            <li>
                <a
                    class="social-icon-fb"
                    href="https://www.facebook.com/parkspot.in"
                    target="_blank"
                >
                    <AtomIcon :icon="'facebook'" :size="'is-medium'">
                    </AtomIcon>
                </a>
            </li>
            <li>
                <a
                    class="social-icon-insta"
                    href="https://www.instagram.com/parkspot.in/"
                    target="_blank"
                >
                    <AtomIcon
                        :icon="'instagram'"
                        :size="'is-medium'"
                    ></AtomIcon>
                </a>
            </li>
            <li>
                <a
                    class="social-icon-linkdn"
                    href="https://www.linkedin.com/company/parkspot-in/"
                    target="_blank"
                >
                    <AtomIcon :icon="'linkedin'" :size="'is-medium'">
                    </AtomIcon>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import AtomIcon from '../atoms/AtomIcon.vue';
export default {
    name: 'SocialLink',
    components: {
        AtomIcon,
    },
};
</script>

<style lang="scss" scoped>
.social-links {
    ul {
        display: block;
        left: 0;
        list-style-type: none;
        position: fixed;
        top: 95px;
        z-index: 99;

        li {
            a {
                align-items: center;
                color: #fff;
                display: flex;
                height: 52px;
                justify-content: center;
                transition: -webkit-transform 80ms;
                transition: transform 80ms;
                transition: transform 80ms, -webkit-transform 80ms;
                width: 52px;
                &:hover {
                    transform: scale(1.25);
                }
            }

            .social-icon-fb {
                background: #3b5999;
            }
            .social-icon-insta {
                background: #e4405f;
            }
            .social-icon-linkdn {
                background: #0e76a8;
            }
        }
    }
}
</style>