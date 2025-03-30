<template>
    <div>
        <div class="label" @click="toggleDropdown">
            {{ selectedItem || label }}
            <span
                v-if="selectedItem"
                class="material-symbols-outlined"
                @click.stop="removeSelectedItem"
            >close</span>
            <span
                v-else
                class="material-symbols-outlined"
                :class="{ 'rotate': isOpen }"
            >keyboard_arrow_down</span>
        </div>

        <div v-if="isOpen" class="menu">
            <div
                v-for="(option, index) in filteredOptions"
                :key="index"
                class="dropdown-item"
            >
                <input
                    :id="`option-${index}`"
                    :value="option"
                    type="radio"
                    v-model="selectedItem"
                    @input="updateSelectedOptions(option)"
                />
                <label :for="`option-${index}`">{{ option }}</label>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'FilterDropdown',
    props: {
        label: String,
        options: {
            type: Array,
            default: () => [],
        },
        selectedValue: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            isOpen: false,
            selectedItem: '',
        };
    },
    watch: {
        selectedValue(newValue) {
            this.selectedItem = newValue;
        },
    },
    computed: {
        filteredOptions() {
            return this.options;
        },
    },
    methods: {
        ...mapActions('map', ['srpCall']),
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        removeSelectedItem() {
            this.selectedItem = ''
            this.$emit('remove', null);
        },
        updateSelectedOptions(value) {
            this.isOpen = false;
            this.$emit('update', value);
        },
    },
};
</script>

<style scoped>
.label {
    border-radius: 15px;
    border: 1px solid rgba(128, 128, 128, 0.263) !important;
    cursor: pointer;
    display: flex;
    font-size: 12px !important;
    font-weight: 400 !important;
    gap: 8px;
    justify-content: center;
    padding: 4px 8px;
    width: fit-content;
}
.label:hover {
    background-color: rgba(128, 128, 128, 0.074);
}
.material-symbols-outlined {
    font-size: 20px !important;
}

.menu {
    background-color: white;
    display: flex;
    flex-direction: row;
    gap: 20px;
    left: 0;
    padding: 0;
    position: absolute;
    transition: 1s;
    width: 100% !important;
}

.rotate {
    transform: rotate(180deg);
    transition: 1s;
}

.dropdown-item {
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 5px;
}
</style>