<template>
  <b-field>
    <b-datepicker
      v-model="date"
      placeholder="Click to select..."
      @input="onChange"
    >
    </b-datepicker>
  </b-field>
</template>

<script>
export default {
  name: 'AtomDatePicker',
  props: {
    assignedDate: {
      type: Date,
    },
  },
  emits: ['changed'],
  data() {
    return {
      date: new Date(),
    };
  },
  methods: {
    onChange(val) {
      this.$emit('changed', val);
    },
  },
};
</script>
