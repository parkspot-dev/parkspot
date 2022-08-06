<template>
      <section>
            <div class="block">
                  <b-radio
                        :key="value"
                        v-model="radio"
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
      name: "AtomRadioButton",
      data() {
            return {
                  radio: "",
            };
      },
      props: {
            /**
             * List of radio buttons
             * @values in Array
             */
            values: {
                  type: Array,
                  default: null,
            },
      },
};
</script>
