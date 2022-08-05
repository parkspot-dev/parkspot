<template>
  <Wrapper>
    <b-table
      :data="isEmpty ? [] : lists"
      :bordered="true"
      :hoverable="true"
      :loading="isLoading"
      :focusable="true"
      :mobile-cards="hasMobileCards"
      :scrollable="true"
      :sticky-header="true"
      height="600"
    >
      <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
        {{ props.row.ID }}
      </b-table-column>

      <b-table-column field="priority" label="Priority" v-slot="props">
        {{ getPriority(props.row.Priority) }}
      </b-table-column>

      <b-table-column field="name" label="Name" v-slot="props">
        {{ props.row.Name }}
      </b-table-column>

      <b-table-column field="mobile" label="Mobile" v-slot="props">
        {{ props.row.Mobile }}
      </b-table-column>

      <b-table-column field="email" label="Email" v-slot="props">
        {{ props.row.EmailID }}
      </b-table-column>

      <b-table-column field="comments" label="Comments" v-slot="props">
        <AtomTextarea
          :value="props.row.Comments"
          class="custom-colComment"
          @onChange="onCommentUpdate"
        ></AtomTextarea>
      </b-table-column>

      <b-table-column
        field="status"
        label="Status"
        width="100px"
        v-slot="props"
      >
        <AtomSelectInput
          :list="statusList"
          class="custom-columnWidth"
          :value="props.row.Status + 1"
          @changed="onStatusUpdate"
        ></AtomSelectInput>
      </b-table-column>

      <b-table-column field="next_call" label="Next Call" v-slot="props">
        <!-- {{ new Date(props.row.NextCall) }} -->
        <AtomDatePicker
          class="custom-columnWidth"
          :assignedDate="props.row.NextCall"
          @changed="onDateUpdate"
        ></AtomDatePicker>
      </b-table-column>

      <b-table-column
        field="last_update"
        label="Last Updated"
        centered
        v-slot="props"
      >
        <span class="tag is-success">
          {{ new Date(props.row.UpdatedAt).toLocaleDateString() }}
        </span>
      </b-table-column>

      <b-table-column field="duration" label="Duration" v-slot="props">
        {{ props.row.Duration }}
      </b-table-column>

      <b-table-column field="car_model" label="Car Model" v-slot="props">
        {{ props.row.CarModel }}
      </b-table-column>

      <b-table-column field="location" label="Location" v-slot="props">
        {{
          props.row.Latitude.toFixed(6) + "/" + props.row.Longitude.toFixed(6)
        }}
      </b-table-column>

      <b-table-column field="landmark" label="Landmark" v-slot="props">
        {{ props.row.Landmark }}
      </b-table-column>

      <b-table-column field="city" label="City" v-slot="props">
        {{ props.row.City }}
      </b-table-column>

      <b-table-column field="date" label="Date" centered v-slot="props">
        <span class="tag is-success">
          {{ new Date(props.row.CreatedAt).toLocaleDateString() }}
        </span>
      </b-table-column>

      <b-table-column> <AtomButton> Update </AtomButton> </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
  </Wrapper>
</template>

<script>
import Wrapper from "../extras/Wrapper.vue";
import AtomButton from "../atoms/AtomButton.vue";
import AtomTextarea from "../atoms/AtomTextarea.vue";
import AtomSelectInput from "../atoms/AtomSelectInput.vue";
import AtomDatePicker from "../atoms/AtomDatePicker.vue";
export default {
  name: "TemplateInventory",
  components: {
    Wrapper,
    AtomButton,
    AtomTextarea,
    AtomSelectInput,
    AtomDatePicker,
  },
  props: {
    lists: {
      type: Array,
    },
  },
  data() {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true,

      statusList: [
        { id: 1, name: "StatusNotSet" },
        { id: 2, name: "Registered" },
        { id: 3, name: "Processing" },
        { id: 4, name: "SpotSuggested" },
        { id: 5, name: "SpotAccepted" },
        { id: 6, name: "SpotDenied" },
        { id: 7, name: "Archive" },
      ],
      priorityList: [
        { id: 1, name: "Not Set" },
        { id: 2, name: "Low" },
        { id: 3, name: "Medium" },
        { id: 4, name: "High" },
      ],
      statusColumn: "",
      priorityColumn: "",
    };
  },
  methods: {
    getPriority(val) {
      switch (val) {
        case 1:
          return "Low";
        case 2:
          return "Medium";
        case 3:
          return "High";
      }
    },
    getStatus(val) {
      console.log(val);
      this.statusColumn = val;
    },
    onDateUpdate(date) {
      console.log("chekcing", date);
    },
    onCommentUpdate() {
      console.log("chekcing");
    },
    onStatusUpdate(status) {
      console.log("chekcing", status);
    },
  },
};
</script>

<style scoped>
.custom-columnWidth {
  width: 200px;
}
.custom-colComment {
  width: 400px;
}
</style>
