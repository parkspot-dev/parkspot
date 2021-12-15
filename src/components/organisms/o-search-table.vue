<template>
  <section class="o_search_table">
    <div class="table-container">
      <table class="table is-narrow is-hoverable">
        <thead class="table__head">
          <th><atom-text :text="`ID`" /></th>
          <th><atom-text :text="`Date Requested`" /></th>
          <th><atom-text :text="`Name`" /></th>
          <th><atom-text :text="`Mobile No.`" /></th>
          <th><atom-text :text="`Car Model`" /></th>
          <th><atom-text :text="`Nearest Location`" /></th>
          <th><atom-text :text="`City`" /></th>
          <th><atom-text :text="`Duration`" /></th>
          <th><atom-text :text="`Map URL`" /></th>
          <th><atom-text :text="`Spot Status`" /></th>
          <th><atom-text :text="`Comments`" /></th>
          <th>
            <atom-button
              class="button is-light"
              :class="editComment ? 'is-success' : 'is-warning'"
              :text="editComment ? 'Save' : 'Edit'"
              v-on:click.native="onEdit"
            />
          </th>
        </thead>

        <tbody class="table__body">
          <m-search-table-row
            :key="spot.ID"
            v-for="spot in spotDetails"
            :details="spot"
            :editComment="editComment"
            v-on:is-preview="preview"
          />
        </tbody>
      </table>
      <m-vo-portal-comment-popup
        :isPreview="isPreview"
        v-on:close-preview="closePreview"
        v-on:update-comments="updateComment"
        >{{ passedComment }}</m-vo-portal-comment-popup
      >
    </div>
  </section>
</template>
<script>
import AtomButton from "../atoms/atom-button/atom-button.vue";
import AtomText from "../atoms/atom-text/atom-text.vue";
import mSearchTableRow from "../molecules/m-search-table-row.vue";
import MVoPortalCommentPopup from "../molecules/m-vo-portal-comment-popup.vue";
export default {
  components: { mSearchTableRow, AtomText, AtomButton, MVoPortalCommentPopup },
  name: "o-search-table",
  data() {
    return {
      button: "Edit",
      spotDetails: [],
      editComment: false,
      isPreview: false,
      passedComment: "",
      passedID: "",
    };
  },
  mounted() {
    this.getSpotDetails();
  },
  methods: {
    async getSpotDetails() {
      const res = await fetch(
        "https://maya.parkspot.in/internal/parking-requests"
      );
      const data = await res.json();
      this.spotDetails = data;
      console.log(this.spotDetails);
    },
    onEdit() {
      this.editComment = !this.editComment;
      console.log(this.editComment);
    },
    preview(data) {
      this.isPreview = !this.isPreview;
      this.passedComment = data.comments;
      this.passedID = data.id;
    },
    closePreview(data) {
      this.isPreview = data;
    },
    async updateComment(data) {
      // console.log(`updated commnets ${data}`);
      const res = await fetch(
        "https://maya.parkspot.in/owner/request-comments",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ID: this.passedID,
            Comments: data,
          }),
        }
      );
      const msg = await res.json();
      //  console.log(msg);

      this.getSpotDetails();
    },
  },
};
</script>

<style scoped>
.table__head,
.table__body {
  font-size: 14px;
}
</style>