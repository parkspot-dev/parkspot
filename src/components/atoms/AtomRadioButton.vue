<template>
    <section>
        <div class="block">
            <b-radio
                v-for="value in values"
                :key="value"
                :value="currentSelectedRadio"
                name="name"
                :native-value="value"
                :size="size"
            >
                {{ value }}
            </b-radio>
        </div>
    </section>
</template>

<script>
export default {
    name: 'AtomRadioButton',
    props: {
        /**
         * selected radio option
         * @selectedRadio in string
         */
        currentSelectedRadio: {
            type: String,
            required: true,
        },
        /**
         * List of radio buttons
         * @values in Array
         */
        values: {
            type: Array,
            default: null,
        },
        size: {
            type: String,
            default: 'is-small',
        }
    },
    data() {
        return {
            radio: '',
        };
    },
};
</script>
<style lang="scss" scoped></style>
