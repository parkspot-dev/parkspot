<template>
    <div ref="provider" :rules="rules" :name="fieldName" class="custom-wrapper">
        <AtomTooltip v-if="tooltip" class="custom-tooltip" :label="tooltipMsg">
            <AtomIcon :icon="ICON.INFO" :size="'is-small'"></AtomIcon>
        </AtomTooltip>
        <AtomSelectInput
            v-model="innerValue"
            :error-message="errors"
            :error-type="{ 'is-danger': errors[0], 'is-success': valid }"
            :list="list"
            :placeholder="placeholder"
            :label="label"
            class="mb-5"
        ></AtomSelectInput>
    </div>
</template>

<script>
import AtomSelectInput from '../atoms/AtomSelectInput.vue';
import AtomIcon from '../atoms/AtomIcon.vue';
import AtomTooltip from '../atoms/AtomTooltip.vue';
import { ICON } from '../../constant/constant';
export default {
    name: 'MoleculeSelectInput',
    components: {
        AtomSelectInput,
        AtomIcon,
        AtomTooltip,
    },
    props: {
        rules: {
            type: [Object, String],
            default: '',
        },
        list: {
            type: Array,
            default: null,
            required: true,
        },
        placeholder: {
            type: String,
        },
        fieldName: {
            type: String,
            default: 'field',
        },
        label: {
            type: String,
        },
        //  for tooltip
        tooltip: {
            type: Boolean,
            default: false,
        },
        tooltipMsg: {
            type: String,
            default: 'Please write something meaningful if you are using this.',
        },
        // must be included in props
        value: {
            type: null,
        },
    },
    data() {
        return {
            innerValue: '',
            ICON,
        };
    },
    watch: {
        // Handles internal model changes.
        innerValue(newVal) {
            this.$emit('input', newVal);
        },
        // Handles external model changes.
        value(newVal) {
            this.innerValue = newVal;
        },
    },
    created() {
        if (this.value) {
            this.innerValue = this.value;
        }
    },
};
</script>

<style scoped>
.custom-wrapper {
    position: relative;
}

.custom-tooltip {
    position: absolute;
    top: 0%;
    left: 16%;
}
</style>
