<template>
    <b-modal v-model="isCardModalActive"> <slot></slot> </b-modal>
</template>

<script>
export default {
    name: 'MoleculeModal',
    props: {
        // indicates visible or not
        modal: Boolean,
    },
    data() {
        return {
            isCardModalActive: null,
        };
    },
    watch: {
        modal() {
            this.isCardModalActive = this.modal;
        },
    },
    mounted() {
        this.isCardModalActive = this.modal;
    },
};
</script>

<style lang="scss">
.modal-close {
    display: none;
}

.modal-background {
    background-color: rgb(10 10 10 / 15%);
}
</style>