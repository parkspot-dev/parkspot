<template>
  <section>
    <b-field :label="label">
      <b-autocomplete
        :data="getLocationName"
        placeholder="e.g. Bengaluru"
        field="place_name"
        icon="magnify"
        :loading="isFetching"
        @typing="getAsyncData"
        @select="(option) => (selected = option)"
      >
        <template slot-scope="props">
          <div class="media">
            <div class="media-content">
              {{ props.option.place_name }}
            </div>
          </div>
        </template>
      </b-autocomplete>
    </b-field>
  </section>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "SearchInput",
  props: {
    /**
     * label heading
     */
    label: {
      type: String,
    },
  },
  data() {
    return {
      selected: null,
      isFetching: false,
    };
  },
  computed: {
    ...mapGetters({
      getLocationName: "map/getLocationName",
    }),
  },
  watch: {
    selected(newSelectedVal) {
      this.updateMapConfig([
        newSelectedVal.center[0],
        newSelectedVal.center[1],
      ]); // needed for recentering of map.
      this.updateSelectedLocation(newSelectedVal.place_name); // get the actual value of selected option.
      this.updateSelectedCity(newSelectedVal.context[0].text); // update selected city
      this.updateSelectedState(newSelectedVal.context[1].text); // update selected state
      this.updateSelectedCountry(newSelectedVal.context[2].text); // update selected country
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedLocation: "map/update-selected-location",
      updateSelectedCity: "map/update-selected-city",
      updateSelectedState: "map/update-selected-state",
      updateSelectedCountry: "map/update-selected-country",
      updateMapConfig: "map/update-map-config",
    }),
    ...mapActions({
      searchLocation: "map/searchLocation",
    }),
    // You have to install and import debounce to use it,
    // it's not mandatory though.
    getAsyncData: _.debounce(async function (name) {
      this.isFetching = true;
      try {
        await this.searchLocation(name);
      } catch (error) {
        console.log(error);
      } finally {
        this.isFetching = false;
      }
    }, 500),
  },
};
</script>
