<template>
  <div class="field">
    <div class="control has-icons-left">
      <atom-input
        ref="atomInput"
        @input="search"
        v-on:click.native="history"
        v-closable="{
          exclude: ['atomInput'],
          handler: 'onClose',
        }"
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
      <div class="list-wrapper" v-show="toggle">
        <div class="list-wrapper__wrapper">
          <div class="list-wrapper__seperator"></div>
          <div class="list-wrapper__list-items-wrapper">
            <ul class="list-wrapper__list-items" v-show="toggle">
              <li
                @click="flytosrp(result)"
                :key="result"
                v-for="result in results.slice(0, 3)"
                class="list-item"
              >
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
                      <span>{{ result }}</span>
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
      this.search(historyData);
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
    onClose() {
      this.toggle = false;
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
</style>