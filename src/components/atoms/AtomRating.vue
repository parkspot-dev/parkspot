<template>
    <b-rate
        v-model="rate"
        :icon-pack="iconPack"
        :icon="icon"
        :max="max"
        :size="size"
        :locale="locale"
        :spaced="isSpaced"
        :disabled="isDisabled"
    />
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
    rate: {
        type: Number,
        default: 5,
    },
    size: {
        type: String,
        default: 'is-small',
    },
});

const rate = computed(() => props.rate);
const max = ref(5);
const iconPack = ref('mdi');
const icon = ref('star');
const isSpaced = ref(false);
const isDisabled = ref(true);
const locale = ref(undefined);
</script>
