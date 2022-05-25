<template>
  <div v-click-outside="onClose" class="field">
    <div class="control has-icons-left">
      <atom-input
        class="input has-text-weight-semibold"
        :placeholder="placeholder"
        :value="location.address"
        @input="search"
        @click.native="history"
        @keyup.down.native="onArrow"
        @keyup.up.native="onArrow"
        @keyup.enter.native="onEnter()"
      />

      <span class="icon is-small is-left">
        <atom-boxicon
          :name="name"
          :color="color"
          :size="size"
          :animation="animation"
        />
      </span>
      <div v-show="showSuggestions" class="list-wrapper">
        <div class="list-wrapper__wrapper">
          <div class="list-wrapper__seperator"></div>
          <div class="list-wrapper__list-items-wrapper">
            <ul
              v-for="(result, i) in suggestions"
              v-show="showSuggestions"
              :key="i"
              class="list-wrapper__list-items"
              :class="
                i === arrowCounter ? 'list-wrapper__list-items--active' : ''
              "
            >
              <li class="list-item" @click="flytosrp(result)">
                <div class="list-description">
                  <span class="list-description__icon">
                    <atom-boxicon
                      :name="name"
                      :color="`#a3a3a3`"
                      :size="size"
                    />
                  </span>
                  <div class="list-description__description">
                    <div class="list-description__description-text">
                      <span>{{ result.address }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <ul class="last-list"></ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AtomInput from "@/components/atoms/atom-input/atom-input.vue";
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";

export default {
  name: "MSearchBox",
  components: {
    AtomInput,
    AtomBoxicon,
  },
  props: {
    proximity: {
      type: Array,
      default() {
        return [77.4977, 12.9716];
      },
    },
    fieldName: {
      type: String,
      default: "Search your spot...",
    },
  },
  data() {
    return {
      showSuggestions: false, //search list
      name: "search",
      color: "black",
      size: "sm",
      animation: "tada",
      placeholders: "",
      arrowCounter: 0,
      location: {
        address: "",
        lat: null,
        lng: null,
      },
      suggestions: [],
    };
  },
  computed: {
    placeholder() {
      return this.placeholders;
    },
  },
  mounted() {
    this.placeholders = this.fieldName;
  },
  methods: {
    history() {
      this.showSuggestions = true;
      let historyData = window.localStorage.getItem("sKey");
      this.search(historyData);
    },
    //this is from input element
    async search(query) {
      this.showSuggestions = true;
      if (!query.length) {
        this.suggestions = [];
        return;
      }
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoiaWFtZmlhc2NvIiwiYSI6ImNrOWZiankzdjA5d2kzbWp3NGNzNmIwaHAifQ.E2UwYdvpjc6yNoCmBjfTaQ&proximity=${this.proximity[0]},${this.proximity[1]}`
      );
      const data = await res.json();
      this.suggestions = data.features.slice(0, 3).map(this.extractLocation);
    },
    extractLocation(features) {
      return {
        address: features.place_name,
        lat: features.center[1],
        lng: features.center[0],
      };
    },
    flytosrp(location) {
      this.showSuggestions = false;
      this.location = location;
      window.localStorage.setItem("sKey", this.location.address);
      this.$emit("flytosrp", location);
    },

    // arrow key functions
    onArrow(event) {
      this.arrowCounter =
        event.code == "ArrowDown" ? ++this.arrowCounter : --this.arrowCounter;
      if (this.arrowCounter >= this.suggestions.length) {
        this.arrowCounter = this.arrowCounter % this.suggestions.length;
      } else if (this.arrowCounter < 0) {
        this.arrowCounter = this.suggestions.length + this.arrowCounter;
      }
      this.location = this.suggestions[this.arrowCounter];
    },

    onEnter() {
      if (this.location.length == 0) {
        this.location = this.suggestions[0];
      }
      this.$emit("flytosrp", this.location);
    },
    // click outsite functions
    onClose() {
      this.showSuggestions = false;
    },
  },
};
</script>
<style scoped>
.control.has-icons-left .icon.is-left {
  left: 1px;
  top: 5px;
}

.list-wrapper {
  position: absolute;
  width: 100%;
  text-align: left;
  margin-top: -12px;
  z-index: 989;
  cursor: pointer;
  /* -webkit-user-select: none; */
}
.list-wrapper__wrapper {
  background: #fff;
  box-shadow: 0 9px 8px -3px rgb(64 60 67 / 24%),
    8px 0 8px -7px rgb(64 60 67 / 24%), -8px 0 8px -7px rgb(64 60 67 / 24%);
  display: flex;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
  border-left: 1px solid rgb(92, 92, 223);
  border-right: 1px solid rgb(92, 92, 223);
  border-bottom: 1px solid rgb(92, 92, 223);
  border-radius: 0 0 15px 15px;
  padding-bottom: 4px;
  overflow: hidden;
}
.list-wrapper__seperator {
  border-top: 1px solid #e8eaed;
  margin: 0 14px;
  padding-bottom: 4px;
}
.last-list {
  flex: auto;
  padding-bottom: 16px;
}
.list-wrapper__list-items-wrapper {
  margin: 0;
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
  min-width: 0;
  max-height: none;
  padding: 0;
}
.list-description {
  flex: auto;
  display: flex;
  align-items: center;
  margin: 0 20px 0 10px;
  gap: 0.5rem;
}
.list-description__description {
  display: flex;
  flex: auto;
  flex-direction: column;
  min-width: 0;
  max-height: none;
  padding: 6px 0;
}
.list-description__description-text {
  display: flex;
  font-size: 14px;
  font-weight: 600;
  color: #3a3a3a;
  flex: auto;
  align-items: center;
  word-break: break-word;
  padding-right: 8px;
}
.input {
  border-radius: 15px;
  width: 100%;
}
.input:focus,
.input:active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.list-description__icon {
  min-height: 20px;
  min-width: 20px;
  height: 20px;
  width: 20px;
}
.list-description__icon::before {
  content: "";
  background-color: white;
  opacity: 0.5;
}
.list-item:hover {
  background-color: #ffdb4a;
}
.list-wrapper__list-items--active {
  background-color: #ffdb4a;
}
</style>
