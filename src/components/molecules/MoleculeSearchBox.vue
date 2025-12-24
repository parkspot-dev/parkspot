<template>
    <div class="search-control">
        <p></p>
        <div class="search-input">
            <AtomInput
                v-model="searchModel"
                :placeholder="placeholder"
                @keyup.native.enter="emitSearchEvent"
            >
            </AtomInput>
            <span
                v-if="searchModel"
                class="cancel-icon"
                @click="emitClearEvent"
            >
                <AtomIcon :icon="'close'" size=""> </AtomIcon>
            </span>
        </div>
        <AtomButton
            class="search-button"
            left="magnify"
            @click.native="emitSearchEvent"
            >Search
        </AtomButton>
    </div>
</template>

<script>
import AtomInput from '../atoms/AtomInput.vue';
import AtomButton from '../atoms/AtomButton.vue';
import AtomIcon from '../atoms/AtomIcon';
export default {
    name: 'MoleculeSearchBox',
    components: { AtomInput, AtomButton, AtomIcon },
    props: {
        placeholder: {
            type: String,
            default: 'Search Text',
        },
        initialValue: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            searchModel: this.initialValue,
        };
    },
    methods: {
        emitSearchEvent() {
            this.$emit('on-search', this.searchModel);
        },

        emitClearEvent() {
            this.searchModel = '';
            this.$emit('clear-input');
        },
    },
};
</script>

<style lang="scss" scoped>
.search-button {
    margin-left: 8px;
}

.search-control {
    display: flex;
    justify-content: center;
    margin: 16px;
}

.search-input {
    display: flex;
    justify-content: space-between;
    position: relative;
    .cancel-icon {
        color: rgb(147, 147, 147);
        cursor: pointer;
        padding: 4px;
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
