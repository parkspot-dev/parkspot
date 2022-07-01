<template>
  <section>
    <b-field>
      <b-upload
        @input="upload($event)"
        :value="dropFiles"
        multiple
        drag-drop
        expanded
      >
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Drop your files here or click to upload</p>
          </div>
        </section>
      </b-upload>
    </b-field>

    <div class="tags">
      <span
        v-for="(file, index) in dropFiles"
        :key="index"
        class="tag is-primary"
      >
        {{ file.name }}
        <button
          class="delete is-small"
          type="button"
          @click="deleteDropFile(index)"
        ></button>
      </span>
    </div>
    <!-- <button @click="testClick">test</button> -->
  </section>
</template>

<script>
export default {
  name: "AtomUploads",
  emits: ["uploadFiles"],
  data() {
    return {
      dropFiles: [],
    };
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    upload(event) {
      console.log(event);
      const files = [...this.dropFiles];
      console.log("drop files");
      console.log(files);
      this.$emit("uploadFiles", files);
    },
  },
};
</script>

<style></style>
