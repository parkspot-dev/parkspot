<template>
    <b-modal v-model="isCardModalActive" :on-cancel="onCancel">
        <slot></slot>
    </b-modal>
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
    methods: {
        onCancel() {
            this.$emit('cancel', false);
        },
    },
};
</script>

<style lang="scss">
.modal-close {
    display: none !important;
}

.modal-background {
    background-color: rgb(10 10 10 / 15%) !important;
}
</style>