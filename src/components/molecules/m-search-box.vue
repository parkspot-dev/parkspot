<template>
  <div class="field">
    <div class="ps_search control has-icons-left">
      <atom-input
        @input="search"
        v-on:click.native="history"
        class="input has-text-weight-semibold"
        :placeholder="placeholder"
        :value="value"
      />

      <span class="icon is-small is-left">
        <atom-boxicon
          :name="name"
          :color="color"
          :size="size"
          :animation="animation"
        />
      </span>
      <transition name="fade">
        <!-- <div class="list-wrapper" v-show="toggle">
          <div class="list-wrapper-second-layer">
            <div class="line-breaker"></div>
            <div class="main-list">
              <ul class="listbox" v-show="toggle">
                <li
                  @click="flytosrp(result)"
                  :key="result"
                  v-for="result in results.slice(0, 3)"
                  class="list-item"
                >
                  <div class="list-description">
                    <span class="list-icon">
                      <atom-boxicon :name="name" :color="color" :size="size" />
                    </span>
                    <div class="list-description-style">
                      <div class="list-description-style-second">
                        <span>{{ result }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <ul class="last-list"></ul>
          </div>
        </div> -->
        <!-- //! Original Code is below commented -->
        <ul class="ps_searchbox" v-show="toggle">
          <li
            @click="flytosrp(result)"
            :key="result"
            v-for="result in results.slice(0, 3)"
            class="ps_searchbox_list"
          >
            {{ result }}
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import AtomInput from "@/components/atoms/atom-input/atom-input.vue";
import AtomBoxicon from "../atoms/atom-boxicons/atom-boxicon.vue";

export default {
  name: "m-search-box",
  components: {
    AtomInput,
    AtomBoxicon,
  },
  data() {
    return {
      toggle: false, //search list
      name: "search",
      color: "black",
      size: "sm",
      animation: "tada",
      placeholders: "Search your spot...",
      value: "",
    };
  },
  props: {
    results: Array,
    fieldName: String,
  },
  computed: {
    placeholder() {
      if (this.fieldName) {
        return (this.placeholders = this.fieldName);
      }
      return this.placeholders;
    },
  },
  methods: {
    history() {
      this.toggle = true;
      let historyData = window.localStorage.getItem("sKey");
      this.search(historyData.slice(0, 3));
    },
    //this is from input element
    search(value) {
      this.toggle = true;
      this.$emit("search", value);
    },
    //this is from list of search results
    flytosrp(result) {
      this.toggle = false;
      this.value = result;
      window.localStorage.setItem("sKey", this.value);
      this.$emit("flytosrp", result);
    },
    // flytosrps(){
    // this.$emit('flysrp',this.results[0])    on keyup.enter not working
    // }
  },
};
</script>
<style scoped>
.input:focus {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.ps_searchbox {
  position: absolute;
  width: 99.849%;
  left: 0.6px;
  padding: 0;
  margin: 0;
  z-index: 2;
}

.ps_searchbox_list {
  cursor: pointer;
  border: 1px solid #ddd;
  margin-top: -1px;
  background-color: #f6f6f6;
  padding: 12px;
  text-decoration: none;
  font-size: 12px;
  color: black;
  display: block;
}
.ps_searchbox_list:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.ps_searchbox_list:hover {
  background-color: #ffdb4a;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* //!  Experimental CSS Pls Delete */
/* .list-wrapper {
  position: absolute;
  width: 100%;
  text-align: left;
  margin-top: -1px;
  z-index: 989;
  cursor: pointer;
  -webkit-user-select: none;
}
.list-wrapper-second-layer {
  background: #fff;
  box-shadow: 0 9px 8px -3px rgb(64 60 67 / 24%),
    8px 0 8px -7px rgb(64 60 67 / 24%), -8px 0 8px -7px rgb(64 60 67 / 24%);
  display: flex;
  flex-direction: column;
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0 0 24px 24px;
  padding-bottom: 4px;
  overflow: hidden;
}
.line-breaker {
  border-top: 1px solid #e8eaed;
  margin: 0 14px;
  padding-bottom: 4px;
}
.last-list {
  flex: auto;
  padding-bottom: 16px;
}
.main-list {
  margin: 0;
  padding: 0;
}
.list-box {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
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
  margin: 0 20px 0 14px;
}
.list-description-style {
  display: flex;
  flex: auto;
  flex-direction: column;
  min-width: 0;
  max-height: none;
  padding: 6px 0;
}
.list-description-style-second {
  display: flex;
  font-size: 16px;
  color: #212121;
  flex: auto;
  align-items: center;
  word-break: break-word;
  padding-right: 8px;
}
.input {
  border-radius: 14px;
  width: 100%;
}
.input:focus {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}
.list-icon {
  min-height: 20px;
  min-width: 20px;
  height: 20px;
  width: 20px;
}
.list-icon::before {
  content: "";
  background-color: white;
  opacity: 0.5;
}
.ps_searchbox {
  position: absolute;
  width: 99.849%;
  left: 0.6px;
  padding: 0;
  margin: 0;
  z-index: 2;
}

.ps_searchbox_list {
  cursor: pointer;
  border: 1px solid #ddd;
  margin-top: -1px;
  background-color: #f6f6f6;
  padding: 12px;
  text-decoration: none;
  font-size: 12px;
  color: black;
  display: block;
}
.ps_searchbox_list:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.list-item:hover {
  background-color: #ffdb4a;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */
</style>