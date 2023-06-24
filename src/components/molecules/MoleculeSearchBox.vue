<template>
    <div class="search-control">
        <p></p>
        <atom-input v-model="searchModel" :placeholder="placeholder">
        </atom-input>
        <atom-button
            class="search-button"
            @click.native="emitSearchEvent"
            left="magnify"
            >Search</atom-button
        >
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

<style>
.search-button {
    margin-left: 8px;
}
</style>
