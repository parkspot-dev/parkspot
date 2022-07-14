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
            <!-- <div class="media-left">
              <img
                width="32"
                :src="`https://image.tmdb.org/t/p/w500/${props.option.poster_path}`"
              />
            </div> -->
            <div class="media-content">
              {{ props.option.place_name }}
              <!-- <br />
              <small>
                Released at {{ props.option.release_date }}, rated
                <b>{{ props.option.vote_average }}</b>
              </small> -->
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
    selected(newValue) {
      this.updateMapConfig([newValue.center[0], newValue.center[1]]); // needed for recentering of map.
      this.updateSelectedLocation(newValue.place_name); // get the actual value of selected option.
    },
  },
  methods: {
    ...mapMutations({
      updateSelectedLocation: "map/update-selected-location",
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
