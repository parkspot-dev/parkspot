<template>
    <section>
        <div class="block">
            <b-radio
                :key="value"
                :value="currentSelectedRadio"
                name="name"
                v-for="value in values"
                :native-value="value"
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
            default: null,
        },
        /**
         * List of radio buttons
         * @values in Array
         */
        values: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {
            radio: '',
        };
    },
};
</script>
<style lang="scss" scoped>
</style>
