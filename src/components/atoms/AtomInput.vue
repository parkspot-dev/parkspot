<template>
      <component :is="wrapper">
            <b-field :label="label" :message="errorMessage" :type="errorType">
                  <b-input
                        :id="id"
                        :disabled="disabled"
                        :type="type"
                        :value="value"
                        :placeholder="placeholder"
                        @input.native="onInput($event.target.value)"
                        @focus.native="onFocus($event.target.value)"
                        @blur="onChange($event.target.value)"
                  ></b-input>
            </b-field>
      </component>
</template>

<script>
export default {
      name: "AtomInput",
      props: {
            /**
             * The html element name used for the wrapper.
             * @values div, section
             */
            wrapper: {
                  type: String,
                  default: "div",
                  validator: (value) => {
                        return value.match(/(div|section)/);
                  },
            },
            /**
             * The label of the input field
             */
            label: {
                  type: String,
                  default: null,
            },

            /**
             * Unique identifier of the form input field.
             */
            id: {
                  type: String,
                  default: null,
            },

            /**
             * Whether the input is disabled or not
             */
            disabled: {
                  type: Boolean,
                  default: false,
            },

            /**
             * The type of the form input field.
             * @values text, number, email
             */
            type: {
                  type: String,
                  default: "text",
                  validator: (value) => {
                        return value.match(/(text|number|email)/);
                  },
            },

            /**
             *  User input value in the input field
             */
            value: {
                  type: String,
                  default: null,
            },

            /**
             * The placeholder value for the input field
             */
            placeholder: {
                  type: String,
                  default: null,
            },
            /**
             * Label type for validation
             * @value is-danger, is-success
             */
            errorType: {
                  type: Object,
                  default: null,
            },
            /**
             * Label message displayed after
             * validation completed
             */
            errorMessage: {
                  type: Array,
                  default: null,
            },
      },
      emits: ["input", "focus", "changed"],
      methods: {
            onInput(value) {
                  this.$emit("input", value);
            },

            onFocus(value) {
                  this.$emit("focus", value);
            },

            onChange(value) {
                  this.$emit("changed", value);
            },
      },
};
</script>

<style></style>
