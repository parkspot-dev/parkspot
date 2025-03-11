<template>
    <div class="search-portal-wrapper">
        <div class="summary" v-if="isSummary">
            <div class="so-btn">
                <AtomButton @click.native="showSummary" v-show="!summary.show">
                    {{ summary.btn }} Summary
                </AtomButton>
            </div>
            <br />
            <div class="so-summary" v-show="summary.show">
                <span class="close-button">
                    <AtomIcon
                        @click.native="showSummary"
                        :icon="'close'"
                        size=""
                    >
                    </AtomIcon>
                </span>
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
            :per-page="10"
            :data="isEmpty ? [] : parkingRequests"
            :bordered="true"
            :hoverable="true"
            :loading="isLoading"
            :focusable="true"
            :mobile-cards="hasMobileCards"
            :narrowed="true"
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
                        <br />
                        <strong>
                            {{ getFormattedDate(props.row.UpdatedAt) }}
                        </strong>
                    </div>
                    <br />
                    <div>
                        <p class="tag">CreatedAt:</p>
                        <br />
                        <strong>
                            {{ getFormattedDate(props.row.CreatedAt) }}
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
                        <p v-if="props.row.Agent !== 'NA' || isAdmin">
                            Mobile:
                            <button
                                @click="onConnect(props.row)"
                                class="btn px-2"
                            >
                                Connect
                            </button>
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

            <b-table-column
                field="comments"
                label="Comments"
                v-slot="props"
                width="10px"
            >
                <AtomTextarea
                    :size="'is-small'"
                    v-model="props.row.Comments"
                    class="comment-width"
                    :maxlength="1000"
                    :rowNo="8"
                    @mousedown="storeOldComment(props.row)"
                    @changed="
                        onCommentUpdate(
                            props.row,
                            oldComments[props.row.id],
                            $event,
                        )
                    "
                ></AtomTextarea>
            </b-table-column>

            <b-table-column
                field="Agent"
                label="Agent"
                searchable
                sortable
                width="76px"
            >
                <template #searchable="props">
                    <!-- TODO: Remove AtomSelectInput completely from all files. Use Global Select Input -->
                    <AtomSelectInput
                        :list="agentList"
                        :size="'is-small'"
                        label=""
                        placeholder="Agent"
                        v-model="props.filters['Agent']"
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
                                v-if="isAdmin"
                                :list="agentList"
                                :size="'is-small'"
                                @change="onAgentUpdate(props.row, $event)"
                                label=""
                                placeholder="Select Agent"
                                v-model="filters.Agent"
                            >
                            </AtomSelectInput>
                            <button
                                v-else
                                @click="
                                    onAgentUpdate(props.row, agentList[0].id)
                                "
                                class="btn"
                            >
                                Assign to me
                            </button>
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                field="NextCall"
                label="Status/Next Call"
                searchable
                sortable
                width="80px"
            >
                <template #searchable="props">
                    <AtomSelectInput
                        :list="statusList"
                        :size="'is-small'"
                        class="column-width"
                        placeholder="Select Status"
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
                                :key="props.row.ID || `fallback-${index}`"
                                :list="statusList"
                                :size="'is-small'"
                                @change="onStatusUpdate(props.row, $event)"
                                class="column-width"
                                placeholder="Select Status"
                                v-model="filters.Status"
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
                            :modelValue="`${props.row.Latitude.toFixed(6)}, ${props.row.Longitude.toFixed(6)}`"
                            @change="
                                updateLatLng(props.row, $event.target.value)
                            "
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

    <!-- Mobile Number popup -->
    <div v-if="isOpen" class="popup-container">
        <div class="popup">
            <div class="mobile">
                Contact With {{ this.selectedRow.Name }} on
                <span>{{ this.selectedRow.Mobile }}</span>
            </div>
            <div>Change Status</div>
            <SelectInput
                :key="selectedRow.id"
                :defaultValue="defaultStatus"
                :list="statusList.map((status) => status.name)"
                @change="onStatusUpdate(selectedRow, $event.target.value)"
                name="updateStatus"
            />
            <div>Previous Comments</div>
            <AtomTextarea
                :maxlength="1000"
                :readOnly="true"
                :rowNo="8"
                :size="'is-small'"
                class="comment-width"
                v-model="selectedRow.Comments"
            ></AtomTextarea>
            <div class="note">
                <div>Add Note</div>
                <AtomInput
                    :placeholder="'Type here...'"
                    @mousedown="storeOldComment(selectedRow)"
                    v-model="this.newComment"
                >
                </AtomInput>
                <div v-if="newComment.length < 3" class="error">
                    Note is required
                </div>
                <div class="cicks">
                    <span
                        v-for="(tag, index) in CONNECT_POPUP_CLICKS"
                        :key="index"
                        @click="
                            onCommentUpdate(
                                selectedRow,
                                selectedRow.Comments,
                                `${selectedRow.Comments}\n${tag}`,
                            )
                        "
                        class="tag"
                    >
                        {{ tag }}
                    </span>
                </div>
            </div>

            <button
                :disabled="!newComment || newComment.length < 3"
                @click="
                    onCommentUpdate(
                        selectedRow,
                        oldComments[selectedRow.id],
                        `${oldComments[selectedRow.id]}\n${newComment}`,
                    )
                "
                class="btn"
            >
                Update
            </button>
        </div>
    </div>
</template>

<script>
import { CONNECT_POPUP_CLICKS } from '@/constant/constant';
import { getCoordinate } from '../../includes/LatLng';
import { mapActions, mapState } from 'vuex';
import AtomButton from '../atoms/AtomButton.vue';
import AtomDatePicker from '../atoms/AtomDatePicker.vue';
import AtomIcon from '../atoms/AtomIcon';
import AtomInput from '../atoms/AtomInput.vue';
import AtomSelectInput from '../atoms/AtomSelectInput.vue';
import AtomTextarea from '../atoms/AtomTextarea.vue';
import moment from 'moment';
import SelectInput from '../global/SelectInput.vue';

export default {
    name: 'TemplateSearchPortal',
    components: {
        AtomIcon,
        AtomTextarea,
        AtomSelectInput,
        AtomDatePicker,
        AtomInput,
        AtomButton,
        SelectInput,
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
    computed: {
        ...mapState('searchPortal', ['agentList']),
        ...mapState('user', ['userProfile', 'isAdmin']),
    },
    mounted() {
        if (this.userProfile && !this.isAdmin) {
            // If not an admin then agentList will only contain 'NA' and user Fullname
            const agents = [{ id: 0, FullName: this.userProfile?.FullName }];
            this.setAgents(agents);
        }
    },
    data() {
        return {
            // filters were declared explicitly to use in v-model else they have no use
            filters: {
                Agent: '',
                Status: '',
            },
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
                { id: 3, name: 'SpotSuggested' },
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
            oldComments: {},
            isOpen: false,
            selectedRow: {},
            newComment: '',
            defaultStatus: '',
            CONNECT_POPUP_CLICKS: CONNECT_POPUP_CLICKS,
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
        ...mapActions('searchPortal', ['getAgents', 'setAgents']),
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
            this.agentList.forEach((agent) => {
                if (agent.id === agentid) {
                    spotData['Agent'] = agent.name;
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

        storeOldComment(row) {
            if (!this.oldComments[row.id]) {
                this.oldComments[row.id] = row.Comments || ''; // Ensure a default value
            }
        },

        onCommentUpdate(row, oldComment, newComment) {
            if (oldComment === newComment) {
                // Return if there is no change in the comment
                return;
            }
            const date = new Date();
            const dd = date.getDate();
            let mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            if (oldComment !== newComment) {
                row.Comments = `${newComment} [${dd}/${mm}]`;
                this.$emit('updateRequest', row);
                // Reset stored old comment
                this.oldComments[row.id] = row.Comments;
            }
            (this.isOpen = false), (this.newComment = '');
        },

        onStatusUpdate(spotData, status) {
            // Get the status id from name
            if (typeof status === 'string') {
                const foundStatus = this.statusList.find(
                    (item) => item.name === status,
                );
                status = foundStatus.id;
            }
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
        getFormattedDate(date) {
            return moment(date).format('DD MMM YY, hh:mm A');
        },

        onConnect(selectedRow = {}) {
            this.selectedRow = selectedRow;
            this.isOpen = !this.isOpen;
            const selectedStatus = this.statusList.find(row => row.id === this.selectedRow.Status)
            this.defaultStatus = selectedStatus.name;
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
    background-color: #ffe08a66;
    border-radius: 16px;
    color: black;
}

.tag:not(body) {
    background-color: #ffe08a66;
    border-radius: 16px;
    color: black;
}

.search-portal-wrapper {
    padding: 1rem 1rem;

    @media only screen and (max-width: 1024px) {
        padding: 1rem;
    }

    .close-button {
        background: none;
        border: none;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    .column-width {
        width: 100px;

        @media only screen and (max-width: 1024px) {
            width: 150px;
        }
    }

    .comment-width {
        width: 330px;

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

// Mobile Popup CSS
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.popup {
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: hidden;
    padding: 52px 20px 20px 20px;
    position: relative;
    width: 30%;

    .note {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: -32px;
    }

    .mobile {
        font-weight: var(--bold-font);
        left: 0;
        padding: 20px 0;
        position: absolute;
        right: 0;
        text-align: center;
        top: 0;
        width: 100%;

        span {
            color: var(--secondary-color);
            text-decoration: underline;
        }
    }
}

.error {
    color: red;
}

.btn {
    background-color: var(--primary-color);
    border-radius: 5px;
    border: none;
    box-shadow:
        1px 1px 2px rgba(0, 0, 0, 0.2),
        -1px -1px 1px rgba(255, 255, 255, 0.5),
        0px 0px 2px rgba(0, 0, 0, 0.1);
    color: black;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 0;
}

.btn:disabled {
    cursor: not-allowed;
}

.cicks {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    span {
        border: 1px dashed black;
        cursor: pointer;
        padding: 12px 16px;
    }
}
</style>
