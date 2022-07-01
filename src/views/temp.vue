<template>
  <div class="section">
    <div class="container">
      <MoleculeUpload></MoleculeUpload>
      <MoleculeRadioButton></MoleculeRadioButton>
    </div>
  </div>
</template>
<script>
import MoleculeUpload from "../components/molecules/MoleculeUpload.vue";
import MoleculeRadioButton from "../components/molecules/MoleculeRadioButton.vue";
export default {
  name: "Temp",
  components: { MoleculeUpload, MoleculeRadioButton },
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>
