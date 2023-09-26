<template>
    <div class="search-control">
        <p></p>
        <AtomInput
            v-model="searchModel"
            :placeholder="placeholder"
            @keyup.native.enter="emitSearchEvent"
        >
        </AtomInput>
        <AtomButton
            class="search-button"
            @click.native="emitSearchEvent"
            left="magnify"
            >Search
        </AtomButton>
    </div>
</template>

<script>
import AtomInput from '../atoms/AtomInput.vue';
import AtomButton from '../atoms/AtomButton.vue';
export default {
    name: 'MoleculeSearchBox',
    components: { AtomInput, AtomButton },
    props: {
        placeholder: {
            type: String,
            default: 'Search Text',
        },
    },
    data() {
        return {
            searchModel: '',
        };
    },
    methods: {
        emitSearchEvent() {
            this.$emit('on-search', this.searchModel);
        },
    },
};
</script>

<style lang="scss" scoped>
.search-button {
    margin-left: 8px;
}
</style>
