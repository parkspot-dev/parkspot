<template>
  <ValidationObserver ref="observer" v-slot="{}">
    <ValidationProvider
      name="location"
      rules="required"
      v-slot="{ validate, errors }"
    >
      <SearchInput @change.native="validate" class="mb-4"></SearchInput>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <ValidationProvider
      name="map"
      rules="required"
      v-slot="{ validate, errors }"
    >
      <AtomParagraph>
        Note: Drag the marker to pin the exact location.
      </AtomParagraph>
      <MapContainer
        :key="reRender"
        :drag="true"
        @location="validate"
      ></MapContainer>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import SearchInput from "../extras/SearchInput.vue";
import MapContainer from "../extras/MapContainer.vue";
import AtomParagraph from "../atoms/AtomParagraph.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "OrganismAddressForm",
  components: {
    SearchInput,
    MapContainer,
    AtomParagraph,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    formSubmitted: {
      type: Boolean,
      default: false,
    },
    reRender: {
      type: Number,
      default: 0,
    },
  },
  emits: ["formValidate"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      locDetails: "map/getLocDetails",
    }),
  },
  watch: {
    formSubmitted(newVal) {
      if (newVal) {
        this.$refs.observer
          .validate()
          .then((el) => {
            if (el) {
              this.submit();
              this.$emit("formValidate", el);
            } else {
              this.$emit("formValidate", el);
            }
          })
          .catch((er) => {
            console.log(er);
          });
      }
    },
  },
  methods: {
    ...mapMutations({
      updateLocationDetails: "user/update-location-details",
    }),
    submit() {
      this.updateLocationDetails(this.locDetails);
    },
  },
};
</script>

<style></style>
