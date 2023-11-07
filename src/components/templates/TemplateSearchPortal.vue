<template>
    <div class="search-portal-wrapper">
        <div class="summary" v-if="isSummary">
            <div class="so-btn">
                <AtomButton @click.native="showSummary">
                    {{ summary.btn }} Summary
                </AtomButton>
            </div>
            <br />
            <div class="so-summary" v-show="summary.show">
                <p class="so-total">
                    Total Request : {{ summary.totalRequest }}
                </p>
                <hr />
                <div class="so-live-request">
                    <p>
                        <span>Today : </span>
                        <span>{{ summary.today }}</span>
                    </p>
                    <p>
                        <span>yesterday : </span>
                        <span>{{ summary.yesterday }}</span>
                    </p>
                </div>
                <hr />
                <div class="so-priority">
                    <p>High : {{ summary.high }}</p>
                    <p>Low : {{ summary.low }}</p>
                    <p>Medium : {{ summary.medium }}</p>
                </div>

                <hr />
                <div class="so-status">
                    <p>
                        <span>Registered :</span>
                        <span>{{ summary.status[1] }}</span>
                    </p>
                    <p>
                        <span>Processing :</span>
                        <span>{{ summary.status[2] }}</span>
                    </p>
                    <p>
                        <span>Suggested : </span>
                        <span>{{ summary.status[3] }}</span>
                    </p>
                </div>
            </div>
        </div>
        <b-table
            :paginated="true"
            :per-page="30"
            :data="isEmpty ? [] : parkingRequests"
            :bordered="true"
            :hoverable="true"
            :loading="isLoading"
            :focusable="true"
            :mobile-cards="hasMobileCards"
            :narrowed="true"
            :sticky-header="true"
            height="5000"
        >
            <b-table-column
                field="ID"
                label="ID"
                width="40"
                numeric
                v-slot="props"
                sortable
                headerClass="id-column-parent"
                cellClass="id-column-parent"
            >
                <div class="id-column">
                    {{ props.row.ID }}
                </div>
            </b-table-column>

            <b-table-column
                field="UpdatedAt"
                label="Date"
                centered
                v-slot="props"
                sortable
            >
                <div class="date-column">
                    <div>
                        <p class="tag">UpdatedAt:</p>
                        <strong>
                            {{
                                new Date(
                                    props.row.UpdatedAt,
                                ).toLocaleDateString('en-GB')
                            }}
                        </strong>
                    </div>

                    <div>
                        <p class="tag">CreatedAt:</p>
                        <strong>
                            {{
                                new Date(
                                    props.row.CreatedAt,
                                ).toLocaleDateString('en-GB')
                            }}
                        </strong>
                    </div>
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
                        'my-status': props.row.Priority === 2,
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
                <div class="contact-column">
                    <div class="primary">
                        <p>
                            Name:
                            <strong>{{ props.row.Name }}</strong>
                        </p>
                        <p>
                            Mobile:
                            <a :href="`tel:+91${props.row.Mobile}`">
                                <strong>{{ props.row.Mobile }}</strong>
                            </a>
                        </p>
                        <p>
                            Email:
                            <strong>{{ props.row.EmailID }}</strong>
                        </p>
                        <p>
                            Landmark :
                            <strong>{{ props.row.Landmark }}</strong>
                        </p>
                        <p v-if="props.row.Distance">
                            Distance :
                            <strong>{{ props.row.Distance }} Km</strong>
                        </p>
                    </div>

                    <div class="secondary">
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
                    </div>
                </div>
            </b-table-column>

            <b-table-column field="comments" label="Comments" v-slot="props">
                <AtomTextarea
                    :size="'is-small'"
                    :value="props.row.Comments"
                    class="comment-width"
                    :maxlength="1000"
                    :rowNo="8"
                    @changed="onCommentUpdate(props.row, ...arguments)"
                ></AtomTextarea>
            </b-table-column>

            <b-table-column
                field="Agent"
                label="Agent"
                width="100px"
                sortable
                searchable
            >
                <template #searchable="props">
                    <AtomSelectInput
                        :size="'is-small'"
                        :list="agentList"
                        v-model="props.filters['Agent']"
                        label=""
                        placeholder="Agent"
                    >
                    </AtomSelectInput>
                </template>
                <template v-slot="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ props.row.Agent }}
                            </span>
                            <AtomSelectInput
                                :size="'is-small'"
                                :list="agentList"
                                @changed="
                                    onAgentUpdate(props.row, ...arguments)
                                "
                                label=""
                                placeholder="Select Agent"
                            >
                            </AtomSelectInput>
                        </div>
                    </div>
                </template>
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
                        :size="'is-small'"
                        :list="statusList"
                        class="column-width"
                        v-model="props.filters['Status']"
                    >
                    </AtomSelectInput>
                </template>
                <template v-slot="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ statusList[props.row.Status].name }}
                            </span>
                            <AtomSelectInput
                                :size="'is-small'"
                                :list="statusList"
                                class="column-width"
                                @changed="
                                    onStatusUpdate(props.row, ...arguments)
                                "
                            >
                            </AtomSelectInput>
                        </div>
                        <div class="next-call-part">
                            <span
                                class="tag my-status"
                                :class="{
                                    'is-danger': isCallDelayed(
                                        props.row.NextCall,
                                    ),
                                }"
                            >
                                <span class="upcoming">
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
                                        ).toLocaleDateString('en-GB')
                                    }}
                                </b>
                            </span>
                            <AtomDatePicker
                                :size="'is-small'"
                                class="column-width"
                                @changed="onDateUpdate(props.row, ...arguments)"
                            >
                            </AtomDatePicker>
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column field="lat_lng" label="Lat/Lng" v-slot="props">
                <div class="lat-lng-column">
                    <div class="lat-lng-link">
                        <a
                            target="_blank"
                            @click="
                                toSrp(props.row.Latitude, props.row.Longitude)
                            "
                        >
                            {{
                                props.row.Latitude.toFixed(6) +
                                ',' +
                                props.row.Longitude.toFixed(6)
                            }}
                        </a>
                    </div>

                    <div class="lat-lng-input">
                        <p>LatLng:</p>
                        <AtomInput
                            :size="'is-small'"
                            :value="
                                getLatLng(
                                    props.row.Latitude.toFixed(6),
                                    props.row.Longitude.toFixed(6),
                                )
                            "
                            @changed="updateLatLng(props.row, ...arguments)"
                        >
                        </AtomInput>
                    </div>
                </div>
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
import AtomButton from '../atoms/AtomButton.vue';
import { getCoordinate } from '../../includes/LatLng';

export default {
    name: 'TemplateSearchPortal',
    components: {
        AtomTextarea,
        AtomSelectInput,
        AtomDatePicker,
        AtomInput,
        AtomButton,
    },
    props: {
        parkingRequests: {
            type: Array,
        },
        isLoading: {
            type: Boolean,
        },
        isSummary: {
            type: Boolean,
            default: false,
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

            agentList: [
                { id: 'NA', name: 'NA' },
                { id: 'Preeti', name: 'Preeti' },
                { id: 'Nitya', name: 'Nitya' },
                { id: 'Ish', name: 'Ish' },
                { id: 'Sud', name: 'Sud' },
            ],

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
                agent: '',
                status: '',
                nextCall: '',
            },

            summary: {
                btn: 'Show',
                show: false,
                totalRequest: 0,
                high: 0,
                medium: 0,
                low: 0,
                agent: [0, 0, 0, 0],
                status: [0, 0, 0, 0, 0, 0],
                today: 0,
                yesterday: 0,
            },
            showSecondaryDetails: {
                ID: 0,
                isShow: false,
            },
        };
    },
    watch: {
        parkingRequests(requests) {
            this.summary.totalRequest = requests.length;
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            requests.forEach((request) => {
                if (request.Priority === 3) {
                    this.summary.high++;
                }

                if (request.Priority === 2) {
                    this.summary.medium++;
                }

                if (request.Priority === 1) {
                    this.summary.low++;
                }

                this.summary.agent[request.Agent]++;

                this.summary.status[request.Status]++;

                if (
                    new Date(request.CreatedAt).toLocaleDateString() ===
                    today.toLocaleDateString()
                ) {
                    this.summary.today++;
                }

                if (
                    new Date(request.CreatedAt).toLocaleDateString() ===
                    yesterday.toLocaleDateString()
                ) {
                    this.summary.yesterday++;
                }
            });
        },
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

        onAgentUpdate(spotData, agentid) {
            this.agentList.forEach((Agent) => {
                if (Agent.id === agentid) {
                    spotData['Agent'] = Agent.name;
                }
            });
            this.$emit('updateRequest', spotData);
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
            const date = new Date();
            const dd = date.getDate();
            let mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            if (spotData['Comments'] !== comments) {
                spotData['Comments'] = `${comments} [${dd}/${mm}]`;
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

        showSummary() {
            this.summary.show = !this.summary.show;
            if (this.summary.show) {
                this.summary.btn = 'Hide';
            } else {
                this.summary.btn = 'Show';
            }
        },
    },
};
</script>

<style lang="scss">
$portal-font-size: 13px;

@media only screen and (max-width: 1024px) {
    .id-column-parent {
        color: rgb(0, 0, 0) !important;
        background: #cfcfcd !important;
    }
}

.search-portal-wrapper .status-column .status-part .tag:not(body).my-status {
    background-color: var(--primary-color);
}

.tag:not(body) {
    background-color: var(--primary-color);
}

.search-portal-wrapper {
    padding: 1rem 1rem;

    @media only screen and (max-width: 1024px) {
        padding: 1rem;
    }

    .column-width {
        width: 200px;
        @media only screen and (max-width: 1024px) {
            width: 150px;
        }
    }

    .comment-width {
        width: 350px;
        @media only screen and (max-width: 1024px) {
            width: 200px;
        }
    }

    .summary {
        .so-btn {
            text-align: right;
        }
        .so-summary {
            position: absolute;
            top: 120px;
            right: 12px;
            z-index: 9999;
            padding: 1.25rem;
            max-width: 430px;
            border: 1px solid var(--parkspot-black);
            background-color: #f5f5dc;
            // display: none;

            .so-total {
                font-size: 16px;
                font-weight: var(--semi-bold-font);
                text-align: center;
            }

            .so-live-request {
                display: flex;
                font-size: $portal-font-size;
                gap: 6rem;
            }

            .so-priority {
                display: flex;
                justify-content: space-between;
                font-size: $portal-font-size;
            }

            .so-status {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                column-gap: 2.5rem;

                p {
                    display: flex;
                    justify-content: space-between;
                    font-size: $portal-font-size;
                }
            }
        }
    }

    .id-column {
        font-size: $portal-font-size;
    }

    .date-column {
        display: flex;
        flex-direction: column;
        font-size: $portal-font-size;
        gap: 10px;
    }

    .contact-column {
        position: relative;
        font-size: $portal-font-size;

        .more-icon {
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;

            @media only screen and (max-width: 1024px) {
                position: unset;
            }
        }
    }

    .status-column {
        font-size: $portal-font-size;

        .status-part {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .next-call-part {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }

    .lat-lng-column {
        font-size: $portal-font-size;

        .lat-lng-link {
            margin-bottom: 20px;
        }

        .lat-lng-input {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
}
</style>
