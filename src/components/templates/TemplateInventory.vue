<template>
      <div class="custom-wrap">
            <b-table
                  :data="isEmpty ? [] : lists"
                  :bordered="true"
                  :hoverable="true"
                  :loading="isLoading"
                  :focusable="true"
                  :mobile-cards="hasMobileCards"
                  :scrollable="true"
                  :sticky-header="true"
                  height="800"
            >
                  <b-table-column
                        field="ID"
                        label="ID"
                        width="40"
                        numeric
                        v-slot="props"
                        sortable
                  >
                        {{ props.row.ID }}
                  </b-table-column>

                  <b-table-column
                        field="CreatedAt"
                        label="Date"
                        centered
                        v-slot="props"
                        sortable
                  >
                        <span class="tag is-success">
                              {{
                                    new Date(
                                          props.row.CreatedAt
                                    ).toLocaleDateString()
                              }}
                        </span>
                  </b-table-column>

                  <b-table-column
                        field="Priority"
                        label="Priority"
                        v-slot="props"
                        sortable
                  >
                        <span
                              class="tag"
                              :class="{
                                    'is-low': props.row.Priority === 1,
                                    'is-medium': props.row.Priority === 2,
                                    'is-high': props.row.Priority === 3,
                              }"
                        >
                              {{ getPriority(props.row.Priority) }}
                        </span>
                  </b-table-column>

                  <b-table-column
                        field="contact"
                        label="Contact Details"
                        v-slot="props"
                  >
                        <p>
                              Name: <strong>{{ props.row.Name }}</strong>
                        </p>
                        <p>
                              Mobile: <strong>{{ props.row.Mobile }}</strong>
                        </p>
                        <p>
                              Email: <strong>{{ props.row.EmailID }}</strong>
                        </p>
                        <p>
                              Landmark :
                              <strong>{{ props.row.Landmark }}</strong>
                        </p>
                        <p>City: {{ props.row.City }}</p>
                        <p>Duration : {{ props.row.Duration }}</p>
                        <p>Car Model: {{ props.row.CarModel }}</p>
                  </b-table-column>

                  <b-table-column
                        field="comments"
                        label="Comments"
                        v-slot="props"
                  >
                        <AtomTextarea
                              :value="props.row.Comments"
                              class="custom-colComment"
                              @changed="
                                    onCommentUpdate(props.row, ...arguments)
                              "
                        ></AtomTextarea>
                  </b-table-column>

                  <b-table-column
                        field="status_nextCall"
                        label="Status/Next Call"
                        width="100px"
                        v-slot="props"
                  >
                        <span class="tag is-warning">
                              {{ statusList[props.row.Status].name }}
                        </span>
                        <AtomSelectInput
                              :list="statusList"
                              class="custom-columnWidth"
                              @changed="onStatusUpdate(props.row, ...arguments)"
                        >
                        </AtomSelectInput>
                        <span
                              class="tag is-warning"
                              :class="{
                                    'is-danger': getStatus(props.row.NextCall),
                              }"
                        >
                              <span>
                                    {{
                                          getStatus(props.row.NextCall)
                                                ? "delayed "
                                                : "upcoming "
                                    }}
                              </span>
                              <strong>
                                    {{
                                          new Date(
                                                props.row.NextCall
                                          ).toLocaleDateString()
                                    }}
                              </strong>
                        </span>
                        <AtomDatePicker
                              class="custom-columnWidth"
                              @changed="onDateUpdate(props.row, ...arguments)"
                        >
                        </AtomDatePicker>
                  </b-table-column>

                  <b-table-column
                        field="UpdatedAt"
                        label="Last Updated"
                        centered
                        v-slot="props"
                        sortable
                  >
                        <span class="tag is-success">
                              {{
                                    new Date(
                                          props.row.UpdatedAt
                                    ).toLocaleDateString()
                              }}
                        </span>
                  </b-table-column>

                  <b-table-column
                        field="lat_lng"
                        label="Lat/Lng"
                        v-slot="props"
                  >
                        {{
                              props.row.Latitude.toFixed(6) +
                              "/" +
                              props.row.Longitude.toFixed(6)
                        }}
                  </b-table-column>

                  <template #empty>
                        <div class="has-text-centered">No records</div>
                  </template>
            </b-table>
      </div>
</template>

<script>
import AtomTextarea from "../atoms/AtomTextarea.vue";
import AtomSelectInput from "../atoms/AtomSelectInput.vue";
import AtomDatePicker from "../atoms/AtomDatePicker.vue";
export default {
      name: "TemplateInventory",
      components: {
            AtomTextarea,
            AtomSelectInput,
            AtomDatePicker,
      },
      props: {
            lists: {
                  type: Array,
            },
            isLoading: {
                  type: Boolean,
            },
      },
      emits: ["updateRequest"],
      data() {
            return {
                  isEmpty: false,
                  isBordered: false,
                  isStriped: false,
                  isNarrowed: false,
                  isHoverable: false,
                  isFocusable: false,
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

                  model: {
                        comments: "",
                        status: "",
                        nextCall: "",
                  },
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
                  if (new Date().getTime() > new Date(val).getTime()) {
                        return true;
                  } else {
                        return false;
                  }
            },
            onDateUpdate(spotData, date) {
                  spotData["NextCall"] = date.toJSON();
                  this.$emit("updateRequest", spotData);
            },
            onCommentUpdate(spotData, comments) {
                  spotData["Comments"] = comments;
                  this.$emit("updateRequest", spotData);
            },
            onStatusUpdate(spotData, status) {
                  spotData["Status"] = status - 1;
                  this.$emit("updateRequest", spotData);
            },
      },
};
</script>

<style scoped>
.custom-wrap {
      padding: 1rem;
}
.custom-columnWidth {
      width: 200px;
}
.custom-colComment {
      width: 400px;
}

.is-high {
      background-color: red;
      color: white;
}
.is-medium {
      background-color: rgb(233, 221, 161);
      color: white;
}
.is-low {
      background-color: var(--primary-color);
      color: white;
}
</style>
