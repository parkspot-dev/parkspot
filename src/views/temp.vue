<template>
  <div class="section">
    <div class="container">
      <AtomHeadings level="h1">I am the heading h1</AtomHeadings>
      <AtomHeadings level="h2">I am the heading h2</AtomHeadings>
      <AtomHeadings level="h3">I am the heading h3</AtomHeadings>
      <AtomHeadings level="h4">I am the heading h4</AtomHeadings>
      <AtomHeadings level="h5">I am the heading h5</AtomHeadings>
      <AtomHeadings level="h6">I am the heading h6</AtomHeadings>
      <AtomParagraph
        >Design isn’t just about the look and feel. Design is
        <a href="https://viljamis.com/2017/design-tools-processes/"
          >how it works</a
        >, and we believe the best way to focus on this is to work as close to
        the end result as possible. That’s
        <a href="https://viljamisdesign.com/process/">why we start</a> all our
        projects with simple sketches, and quickly transition into designing
        working prototypes in code. This is done by the same designers who
        started the work, which ensures that our original design intent is
        carried all the way to the end product.</AtomParagraph
      >
      <AtomTooltip :label="'this is the tooltip example'">
        <AtomIcon :icon="'information-outline'" :size="'is-small'"></AtomIcon>
      </AtomTooltip>
      <MoleculeSelectInput :label="'Document'"></MoleculeSelectInput>
    </div>
  </div>
</template>
<script>
import AtomHeadings from "../components/atoms/AtomHeadings.vue";
import AtomParagraph from "../components/atoms/AtomParagraph.vue";
import AtomIcon from "../components/atoms/AtomIcon.vue";
import AtomTooltip from "../components/atoms/AtomTooltip.vue";
import MoleculeSelectInput from "../components/molecules/MoleculeSelectInput.vue";
export default {
  name: "Temp",
  components: {
    AtomHeadings,
    AtomParagraph,
    AtomIcon,
    AtomTooltip,
    MoleculeSelectInput,
  },
  computed: {
    count() {
      return this.$store.getters["device/getFlavour"];
    },
  },
};
</script>
