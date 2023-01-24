<template>
    <BodyWrapper>
        <AtomButton>yahoo</AtomButton>
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

<style lang="scss">
</style>