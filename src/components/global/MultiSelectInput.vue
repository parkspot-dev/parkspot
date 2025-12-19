<template>
    <div
        class="select-wrapper custom-multi-select"
        :class="{ border: showBorder }"
    >
        <label v-if="label" :for="name" class="label">{{ label }}</label>

        <div class="selected-items" @click="focusInput">
            <span v-for="(item, index) in selected" :key="index" class="tag">
                {{ getOptionLabel(item) }}
                <button @click.stop="removeSelection(item)">×</button>
            </span>
            <input
                :id="name"
                ref="searchInput"
                :placeholder="selected.length === 0 ? placeholder : ''"
                type="text"
                @focus="isOpen = true"
                @input="filterOptions"
            />
        </div>
        <div v-if="isOpen" class="dropdown-container">
            <ul v-if="isOpen && filteredOptions.length" class="options-list">
                <li
                    v-for="(option, index) in filteredOptions"
                    :key="index"
                    :class="{ selected: isSelected(option) }"
                    @click="toggleSelection(option)"
                >
                    {{ getOptionLabel(option) }}
                </li>
            </ul>
            <ul
                v-else-if="isOpen && !filteredOptions.length"
                class="options-list"
            >
                <li>No options found</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    label: {
        type:String,
        default: '',
    },
    name: { type: String, required: true },
    modelValue: {
        type: Array,
        default: () => [],
    },
    list: {
        type: Array,
        required: true,
    },
    labelKey: {
        type: String,
        default: 'label',
    },
    placeholder: {
        type: String,
        default: '',
    },
    valueKey: {
        type: String,
        default: 'value',
    },
    showBorder: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchInput = ref(null);
const searchQuery = ref('');

const selected = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const filteredOptions = computed(() => {
    if (!searchQuery.value) return props.list;
    const q = searchQuery.value.toLowerCase();
    return props.list.filter((item) =>
        getOptionLabel(item).toLowerCase().includes(q),
    );
});

const getOptionLabel = (item) =>
    typeof item === 'object' ? item[props.labelKey] : item;

const getOptionValue = (item) =>
    typeof item === 'object' ? item[props.valueKey] : item;

const isSelected = (item) =>
    selected.value.some((i) => getOptionValue(i) === getOptionValue(item));

const toggleSelection = (item) => {
    const value = getOptionValue(item);
    if (isSelected(item)) {
        selected.value = selected.value.filter(
            (i) => getOptionValue(i) !== value,
        );
    } else {
        selected.value = [...selected.value, item];
    }
    searchQuery.value = '';
    searchInput.value.focus();
};

const removeSelection = (item) => {
    selected.value = selected.value.filter(
        (i) => getOptionValue(i) !== getOptionValue(item),
    );
};

const filterOptions = (e) => {
    searchQuery.value = e.target.value;
};

const handleClickOutside = (e) => {
    if (!e.target.closest('.custom-multi-select')) {
        isOpen.value = false;
    }
};

const focusInput = () => {
    searchInput.value.focus();
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() =>
    document.removeEventListener('click', handleClickOutside),
);
</script>

<style lang="scss" scoped>
.label {
    font-size: 0.9rem;
    font-weight: 440;
    padding-top: 10px;
}
.options-list {
    background-color: white;
    border: 1px solid gainsboro;
    font-size: 12px;
    list-style: none;
    margin: 0;
    max-height: 20%;
    overflow-y: auto;
    padding: 0;
    position: absolute;
    z-index: 2;
}
.options-list li {
    cursor: pointer;
    padding: 6px;
    transition: background-color 0.2s ease;
}

.options-list li:hover {
    background-color: #f0f0f0;
}

.options-list li.selected {
    color: var(--secondary-color);
    font-weight: 600;
}
.select-wrapper {
    display: flex;
    flex-direction: column;
    min-width: 100%;
}

.border {
    border: 1px solid gray;
    border-radius: 2px;
}
.selected-items {
    align-items: center;
    border-radius: 4px;
    border: 1px solid gainsboro;
    cursor: text;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    min-height: 12px;
    padding: 6px;
}
.selected-items input[type='text'] {
    border: none;
    flex: 1 1 120px;
    min-width: 120px;
    font-size: 14px;
    outline: none;
}
.selected-items input::placeholder {
    color: #aaa;
}
.tag {
    align-items: center;
    background-color: var(--secondary-color);
    border-radius: 4px;
    color: var(--parkspot-white);
    display: flex;
    font-size: 12px;
    opacity: 0.8;
    padding: -4px 0px;
}
.tag button {
    background: none;
    border: none;
    color: var(--parkspot-white);
    cursor: pointer;
    font-size: 14px;
    margin-left: 2px;
}
</style>
