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
                field="UpdatedAt"
                label="Date"
                centered
                v-slot="props"
                sortable
            >
                <div>
                    <p class="tag">UpdatedAt:</p>
                    <strong>
                        {{ new Date(props.row.UpdatedAt).toLocaleDateString() }}
                    </strong>
                    <br />
                    <br />
                    <p class="tag">CreatedAt:</p>
                    <strong>
                        {{ new Date(props.row.CreatedAt).toLocaleDateString() }}
                    </strong>
                </div>
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
                        'is-info': props.row.Priority === 1,
                        'is-warning': props.row.Priority === 2,
                        'is-danger': props.row.Priority === 3,
                    }"
                >
                    <b> {{ getPriority(props.row.Priority) }}</b>
                </span>
            </b-table-column>

            <b-table-column
                field="contact"
                label="Contact Details"
                v-slot="props"
            >
                <p>
                    Name:
                    <strong>{{ props.row.Name }}</strong>
                </p>
                <p>
                    Mobile:
                    <strong>{{ props.row.Mobile }}</strong>
                </p>
                <p>
                    Email:
                    <strong>{{ props.row.EmailID }}</strong>
                </p>
                <p>
                    Landmark :
                    <strong>{{ props.row.Landmark }}</strong>
                </p>
                <p>
                    City:
                    {{ props.row.City }}
                </p>
                <p>
                    Duration :
                    {{ props.row.Duration }}
                </p>
                <p>
                    Car Model:
                    {{ props.row.CarModel }}
                </p>
            </b-table-column>

            <b-table-column field="comments" label="Comments" v-slot="props">
                <AtomTextarea
                    :value="props.row.Comments"
                    class="comment-width"
                    :maxlength="1000"
                    @changed="onCommentUpdate(props.row, ...arguments)"
                ></AtomTextarea>
            </b-table-column>

            <b-table-column
                field="NextCall"
                label="Status/Next Call"
                width="100px"
                sortable
                searchable
            >
                <template #searchable="props">
                    <AtomSelectInput
                        :list="statusList"
                        class="column-width"
                        v-model="props.filters['Status']"
                    >
                    </AtomSelectInput>
                </template>
                <template v-slot="props">
                    <span class="tag is-warning">
                        {{ statusList[props.row.Status].name }}
                    </span>
                    <AtomSelectInput
                        :list="statusList"
                        class="column-width"
                        @changed="onStatusUpdate(props.row, ...arguments)"
                    >
                    </AtomSelectInput>
                    <span
                        class="tag is-warning"
                        :class="{
                            'is-danger': isCallDelayed(props.row.NextCall),
                        }"
                    >
                        <span>
                            {{
                                isCallDelayed(props.row.NextCall)
                                    ? 'Delayed :'
                                    : 'Upcoming :'
                            }}
                        </span>
                        <b>
                            {{
                                new Date(
                                    props.row.NextCall,
                                ).toLocaleDateString()
                            }}
                        </b>
                    </span>
                    <AtomDatePicker
                        class="column-width"
                        @changed="onDateUpdate(props.row, ...arguments)"
                    >
                    </AtomDatePicker>
                </template>
            </b-table-column>

            <b-table-column field="lat_lng" label="Lat/Lng" v-slot="props">
                <a
                    target="_blank"
                    @click="toSrp(props.row.Latitude, props.row.Longitude)"
                >
                    {{
                        props.row.Latitude.toFixed(6) +
                        ',' +
                        props.row.Longitude.toFixed(6)
                    }}
                </a>
                <br />
                <br />
                <p>LatLng:</p>
                <AtomInput
                    :value="
                        getLatLng(
                            props.row.Latitude.toFixed(6),
                            props.row.Longitude.toFixed(6),
                        )
                    "
                    @changed="updateLatLng(props.row, ...arguments)"
                >
                </AtomInput>
            </b-table-column>

            <template #empty>
                <div class="has-text-centered">No records</div>
            </template>
        </b-table>
    </div>
</template>

<script>
import AtomTextarea from '../atoms/AtomTextarea.vue';
import AtomSelectInput from '../atoms/AtomSelectInput.vue';
import AtomDatePicker from '../atoms/AtomDatePicker.vue';
import AtomInput from '../atoms/AtomInput.vue';
import { getCoordinate } from '../../includes/LatLng';

export default {
    name: 'TemplateInventory',
    components: {
        AtomTextarea,
        AtomSelectInput,
        AtomDatePicker,
        AtomInput,
    },
    props: {
        lists: {
            type: Array,
        },
        isLoading: {
            type: Boolean,
        },
    },
    emits: ['updateRequest', 'toSrp'],
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
                { id: 0, name: 'StatusNotSet' },
                { id: 1, name: 'Registered' },
                { id: 2, name: 'Processing' },
                {
                    id: 3,
                    name: 'SpotSuggested',
                },
                { id: 4, name: 'SpotAccepted' },
                { id: 5, name: 'SpotDenied' },
                { id: 6, name: 'Archive' },
            ],

            model: {
                comments: '',
                status: '',
                nextCall: '',
            },
        };
    },
    methods: {
        getPriority(val) {
            switch (val) {
                case 1:
                    return 'Low';
                case 2:
                    return 'Medium';
                case 3:
                    return 'High';
            }
        },

        getLatLng(lat, lng) {
            return lat + ',' + lng;
        },

        isCallDelayed(nextCall) {
            if (new Date().getTime() > new Date(nextCall).getTime()) {
                return true;
            } else {
                return false;
            }
        },

        onDateUpdate(spotData, date) {
            spotData['NextCall'] = date.toJSON();
            this.$emit('updateRequest', spotData);
        },

        onCommentUpdate(spotData, comments) {
            if (spotData['Comments'] !== comments) {
                spotData['Comments'] = comments;
                this.$emit('updateRequest', spotData);
            }
        },

        onStatusUpdate(spotData, status) {
            spotData['Status'] = status;
            this.$emit('updateRequest', spotData);
        },

        updateLatLng(spotData, latlng) {
            const coordinate = getCoordinate(latlng);
            if (
                spotData['Latitude'].toString() !== coordinate[0] ||
                spotData['Longitude'].toString() !== coordinate[1]
            ) {
                spotData['Latitude'] = parseFloat(coordinate[0]);
                spotData['Longitude'] = parseFloat(coordinate[1]);
                this.$emit('updateRequest', spotData);
            }
        },

        toSrp(lat, lng) {
            this.$emit('toSrp', lat, lng);
        },
    },
};
</script>

<style scoped>
.custom-wrap {
    padding: 1rem;
}

.column-width {
    width: 200px;
}

.comment-width {
    width: 400px;
}
</style>
