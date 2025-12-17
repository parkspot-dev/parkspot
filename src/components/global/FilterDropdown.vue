<template>
    <div>
        <div class="label" @click="toggleDropdown">
            {{ selectedValue || label }}
            <span
                v-if="selectedValue && removable"
                class="material-symbols-outlined"
                @click.stop="removeSelectedItem"
                >close</span
            >
            <span
                v-else
                class="material-symbols-outlined"
                :class="{ rotate: isOpen }"
                >keyboard_arrow_down</span
            >
        </div>

        <div v-if="isOpen" ref="dropdown" class="menu">
            <div
                v-for="(option, index) in filteredOptions"
                :key="index"
                class="dropdown-item"
                @click="updateSelectedOptions(option)"
            >
                <div>{{ option }}</div>
            </div>
        </div>
    </div>
</template>

<script>
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
        removable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    computed: {
        filteredOptions() {
            return this.options;
        },
    },

    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },

        removeSelectedItem() {
            this.$emit('remove', null);
        },

        updateSelectedOptions(value) {
            this.isOpen = false;
            this.$emit('update', value);
        },

        handleClickOutside(event) {
            if (
                this.$refs.dropdown &&
                !this.$refs.dropdown.contains(event.target) &&
                !this.$el.contains(event.target)
            ) {
                this.isOpen = false;
            }
        },
    },
};
</script>

<style scoped>
.label {
    background-color: white;
    border-radius: 16px;
    border: 1px solid rgba(128, 128, 128, 0.263) !important;
    cursor: pointer;
    display: flex;
    font-size: 12px !important;
    font-weight: 400 !important;
    gap: 8px;
    justify-content: space-between;
    padding: 4px 8px 4px 12px;
    width: 150px;
}

.label:hover {
    background-color: rgba(128, 128, 128, 0.074);
}

.material-symbols-outlined {
    font-size: 20px !important;
}

.menu {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 2px 6px rgba(128, 128, 128, 0.61) !important;
    display: flex;
    flex-direction: column;
    position: absolute;
    transition: 1s;
    width: 150px;
    z-index: 999;
}

.menu::before {
    border-bottom: 8px solid gray;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    content: '';
    height: 0;
    left: 50%;
    position: absolute;
    top: -8px;
    width: 0;
    z-index: 1000;
}

.rotate {
    transform: rotate(180deg);
    transition: 1s;
}

.dropdown-item {
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 8px;
    margin-bottom: 4px;

    div {
        cursor: pointer !important;
        font-size: 12px !important;
    }
}

.dropdown-item:hover {
    background-color: gainsboro;
}
</style>
