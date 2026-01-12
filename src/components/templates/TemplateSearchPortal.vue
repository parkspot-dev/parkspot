<template>
    <div class="search-portal-wrapper">
        <div class="header">
            <div class="expiring-request">
                <span class="material-symbols-outlined"> report </span>
                <div>
                    There are {{ expiringRequestsCount }}
                    <span class="hyperlink" @click="handleExpiringRequests"
                        >expiring requests</span
                    >
                </div>
            </div>
            <div v-if="isSummary" class="summary">
                <div class="so-btn">
                    <AtomButton @click="showSummary">
                        {{ summary.btn }} Summary
                    </AtomButton>
                </div>
                <br />
                <div v-show="summary.show" class="so-summary">
                    <span class="close-button">
                        <AtomIcon
                            :icon="'close'"
                            size=""
                            @click="showSummary"
                        />
                    </span>
                    <div class="summary-layout">
                        <div class="summary-header">
                            <p class="total-request">
                                Total Requests: {{ summary.totalRequest }}
                            </p>
                            <p class="total-agent">
                                Total Agents:
                                {{ Object.keys(summary.agent).length }}
                            </p>
                        </div>

                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th>Requests</th>
                                    <th>Agents</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>Today: {{ summary.today }}</p>
                                        <p>
                                            Yesterday: {{ summary.yesterday }}
                                        </p>
                                    </td>

                                    <td>
                                        <div
                                            v-for="(
                                                count, name
                                            ) in summary.agent"
                                            :key="name"
                                        >
                                            {{ name }} : {{ count }}
                                        </div>
                                    </td>

                                    <td>
                                        <p>High: {{ summary.high }}</p>
                                        <p>Medium: {{ summary.medium }}</p>
                                        <p>Low: {{ summary.low }}</p>
                                    </td>

                                    <td>
                                        <p>
                                            Registered: {{ summary.status[1] }}
                                        </p>
                                        <p>
                                            Processing: {{ summary.status[2] }}
                                        </p>
                                        <p>
                                            Suggested: {{ summary.status[3] }}
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="filters">
            <div class="filters-label">Filters:</div>
            <div class="filters-group">
                <FilterDropdown
                    :options="requestsFilterOptions"
                    :searchable="false"
                    :selected-value="filters.isExpiring ? 'Expiring' : ''"
                    label="Requests Type"
                    @remove="removeExpiringFilter"
                    @update="handleExpiringRequests"
                />

                <FilterDropdown
                    :options="agentList.map((agent) => agent.name)"
                    :searchable="false"
                    :selected-value="filters.Agent ? filters.Agent : ''"
                    label="Agent"
                    @remove="removeAgentFilter"
                    @update="handleAgentFilter"
                />

                <FilterDropdown
                    :options="statusList.map((status) => status.name)"
                    :searchable="false"
                    :selected-value="filters.Status ? filters.Status : ''"
                    label="Status"
                    @remove="removeStatusFilter"
                    @update="handleStatusFilter"
                />
            </div>
        </div>
        <b-table
            v-if="isDesktopView"
            :paginated="true"
            :per-page="10"
            :data="isEmpty ? [] : filteredParkingRequests"
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
                v-slot="props"
                field="ID"
                label="ID"
                width="40"
                numeric
                sortable
                header-class="id-column-parent"
                cell-class="id-column-parent"
            >
                <div class="id-column">
                    {{ props.row.ID }}
                    <div
                        v-if="props.row.IsExpiring"
                        class="material-symbols-outlined expiring-icon"
                    >
                        report
                    </div>
                </div>
            </b-table-column>

            <b-table-column
                field="UpdatedAt"
                label="Date"
                searchable
                centered
                sortable
            >
                <template #searchable="{ filters: filter }">
                    <AtomDatePicker
                        :assigned-date="filter.UpdatedAt"
                        placeholder="Filter by Updated Date"
                        @changed="
                            (date) => (filter.UpdatedAt = formatDate(date))
                        "
                    />
                </template>

                <template #default="{ row }">
                    <div class="date-column">
                        <p class="tag">UpdatedAt:</p>
                        <strong>{{ getFormattedDate(row.UpdatedAt) }}</strong>

                        <p class="tag">CreatedAt:</p>
                        <strong>{{ getFormattedDate(row.CreatedAt) }}</strong>
                    </div>
                </template>
            </b-table-column>

            <b-table-column
                v-slot="props"
                field="Priority"
                label="Priority"
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
                v-slot="props"
                field="contact"
                label="Contact Details"
            >
                <div class="contact-column">
                    <div class="primary">
                        <p>
                            Name:
                            <strong>{{ props.row.Name }}</strong>
                        </p>
                        <p v-if="props.row.Agent !== 'NA' || isAdmin">
                            Mobile:
                            <strong v-if="isAdmin">{{
                                props.row.Mobile
                            }}</strong>
                            <button
                                v-else
                                class="btn px-2"
                                @click="onConnect(props.row)"
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
                v-slot="props"
                field="comments"
                label="Comments"
                width="10px"
            >
                <div class="comment-wrapper">
                    <div class="previous-comments">
                        {{ props.row.Comments }}
                    </div>
                    <AtomTextarea
                        v-model="newCommentMap[props.row.ID]"
                        :maxlength="3000"
                        :row-no="4"
                        :size="'is-small'"
                        :placeholder="'Add new comment...'"
                        class="comment-width"
                        @changed="
                            onCommentUpdate(props.row, oldComments, $event)
                        "
                        @mousedown="storeOldComment(props.row)"
                    ></AtomTextarea>
                </div>
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
                        v-model="props.filters['Agent']"
                        :list="agentList"
                        :size="'is-small'"
                        label=""
                        placeholder="Agent"
                    >
                    </AtomSelectInput>
                </template>
                <template #default="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ props.row.Agent }}
                            </span>
                            <AtomSelectInput
                                v-if="isAdmin"
                                v-model="props.row.Agent"
                                :list="agentList"
                                :size="'is-small'"
                                label=""
                                placeholder="Select Agent"
                                @change="onAgentUpdate(props.row, $event)"
                            >
                            </AtomSelectInput>
                            <button
                                v-else
                                class="btn"
                                @click="
                                    onAgentUpdate(props.row, agentList[0].id)
                                "
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
                        v-model="props.filters['Status']"
                        :list="statusList"
                        :size="'is-small'"
                        class="column-width"
                        placeholder="Select Status"
                    >
                    </AtomSelectInput>
                </template>
                <template #default="props">
                    <div class="status-column">
                        <div class="status-part">
                            <span class="tag my-status">
                                {{ statusList[props.row.Status].name }}
                            </span>
                            <AtomSelectInput
                                :key="props.row.ID"
                                v-model="props.row.Status"
                                :list="statusList"
                                :size="'is-small'"
                                class="column-width"
                                placeholder="Select Status"
                                @change="onStatusUpdate(props.row, $event)"
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
                                :assigned-date="props.row.NextCall"
                                :size="'is-small'"
                                class="column-width"
                                @changed="
                                    (date) => onDateUpdate(props.row, date)
                                "
                            >
                            </AtomDatePicker>
                        </div>
                    </div>
                </template>
            </b-table-column>

            <b-table-column v-slot="props" field="lat_lng" label="Lat/Lng">
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
                            :model-value="`${props.row.Latitude.toFixed(6)}, ${props.row.Longitude.toFixed(6)}`"
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

        <div v-else>
            <div v-if="isLoading" class="loading">Loading...</div>
            <div v-else>
                <MobileView
                    v-if="!isEmpty"
                    :parking-requests="parkingRequests"
                    :is-empty="isEmpty"
                    :is-admin="isAdmin"
                    :new-comment-map="newCommentMap"
                    :status-list="statusList"
                    :agent-list="agentList"
                    :get-formatted-date="getFormattedDate"
                    :get-priority="getPriority"
                    :is-call-delayed="isCallDelayed"
                    :to-srp="toSrp"
                    :store-old-comment="storeOldComment"
                    :old-comments="oldComments"
                    @connect="onConnect"
                    @comment-update="onCommentUpdate"
                    @agent-update="onAgentUpdate"
                    @status-update="onStatusUpdate"
                    @date-update="onDateUpdate"
                    @latlng-update="updateLatLng"
                />
                <div v-else class="has-text-centered">No records</div>
            </div>
        </div>
    </div>

    <!-- Connect popup -->
    <div v-if="isOpen" class="popup-container">
        <div class="popup">
            <div class="mobile">
                Contact With {{ selectedRow.Name }} on
                <span>{{ selectedRow.Mobile }}</span>
            </div>
            <div>Change Status</div>
            <SelectInput
                :key="selectedRow.id"
                :default-value="defaultStatus"
                :list="statusList.map((status) => status.name)"
                name="updateStatus"
                @change="onStatusUpdate(selectedRow, $event.target.value)"
            />
            <div>Previous Comments</div>
            <AtomTextarea
                v-model="selectedRow.Comments"
                :maxlength="1000"
                :read-only="true"
                :row-no="8"
                :size="'is-small'"
                class="comment-width"
            ></AtomTextarea>
            <div class="note">
                <div>Add Note</div>
                <AtomInput
                    v-model="newComment"
                    :placeholder="'Type here...'"
                    @mousedown="storeOldComment(selectedRow)"
                >
                </AtomInput>
                <div v-if="newComment.length < 3" class="error">
                    Note is required
                </div>
                <div class="frequent-comments">
                    <span
                        v-for="(tag, index) in FREQUENT_COMMENTS"
                        :key="index"
                        class="tag"
                        @click="
                            onCommentUpdate(
                                selectedRow,
                                selectedRow.Comments,
                                `${selectedRow.Comments}\n${tag}`,
                            )
                        "
                    >
                        {{ tag }}
                    </span>
                </div>
            </div>

            <button
                :disabled="!newComment || newComment.length < 3"
                class="btn"
                @click="
                    onCommentUpdate(
                        selectedRow,
                        selectedRow.Comments,
                        newComment,
                    )
                "
            >
                Update
            </button>
        </div>
    </div>
</template>

<script>
import { FREQUENT_COMMENTS } from '@/constant/constant';
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
import FilterDropdown from '../global/FilterDropdown.vue';
import MobileView from '../search-portal/MobileView.vue';
import { RequestPriority } from '@/constant/enums';

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
        FilterDropdown,
        MobileView,
    },
    props: {
        parkingRequests: {
            type: Array,
            default: () => [],
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
            // filters were declared explicitly to use in v-model else they have no use
            filters: {
                Agent: '',
                Status: '',
                UpdatedAt: null,
                isExpiring: false,
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
            oldComments: '',
            isOpen: false,
            selectedRow: {},
            newComment: '',
            defaultStatus: '',
            FREQUENT_COMMENTS: FREQUENT_COMMENTS,
            newCommentMap: {},
            requestsFilterOptions: ['Expiring'],
            windowWidth: 0,
            forceDesktop: false,
            isMobileDevice: false,
            QUERY_PARAMS: {
                AGENT: 'agent',
                STATUS: 'status',
                IS_EXPIRING: 'isExpiring',
            },
        };
    },
    computed: {
        ...mapState('searchPortal', [
            'agentList',
            'expiringRequestsCount',
            'filteredParkingRequests',
        ]),
        ...mapState('user', ['userProfile', 'isAdmin']),
        isDesktopView() {
            if (this.isMobileDevice) {
                return false;
            }
            return this.windowWidth > 768 || this.forceDesktop;
        },
    },

    watch: {
        parkingRequests(newRequests) {
            this.updateSummary(newRequests);

            if (this.$route.query[this.QUERY_PARAMS.IS_EXPIRING]) {
                this.extractExpiringRequests();
                this.filters.isExpiring = true;
            }

            if (this.$route.query[this.QUERY_PARAMS.AGENT]) {
                const agentName = this.$route.query['agent'];
                this.filters.Agent = agentName;
                this.extractRequestsByAgentName(agentName);
            }
            if (this.$route.query[this.QUERY_PARAMS.STATUS]) {
                const statusId = parseInt(this.$route.query['status']);
                const statusRow = this.statusList.find(
                    (item) => item.id === statusId,
                );
                this.filters.Status = statusRow.name;
                if (statusRow) {
                    this.extractRequestsByStatus(statusRow.id);
                }
            }
        },
    },
    mounted() {
        if (this.userProfile && !this.isAdmin) {
            // If not an admin then agentList will only contain 'NA' and user Fullname
            const agents = [{ id: 0, FullName: this.userProfile?.FullName }];
            this.setAgents(agents);
        }

        if (this.parkingRequests && this.parkingRequests.length > 0) {
            this.updateSummary(this.parkingRequests);
        }

        if (typeof window !== 'undefined') {
            this.windowWidth = window.innerWidth;
            window.addEventListener('resize', this.updateWidth);

            const ua = navigator.userAgent.toLowerCase();
            this.isMobileDevice =
                ua.includes('android') || ua.includes('iphone');
        }
    },

    beforeUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.updateWidth);
        }
    },

    
    methods: {
        ...mapActions('searchPortal', [
            'getAgents',
            'setAgents',
            'extractExpiringRequests',
            'resetFilterParkingRequests',
            'extractRequestsByAgentName',
            'extractRequestsByStatus',
        ]),

        applyFilters() {
            this.resetFilterParkingRequests();

            if (this.filters.isExpiring) {
                this.extractExpiringRequests();
            }

            if (this.filters.Status) {
                const statusRow = this.statusList.find(
                    (item) => item.name === this.filters.Status,
                );
                if (statusRow) {
                    this.extractRequestsByStatus(statusRow.id);
                }
            }

            if (this.filters.Agent) {
                this.extractRequestsByAgentName(this.filters.Agent);
            }
        },

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

        updateWidth() {
            this.windowWidth = window.innerWidth;
        },

        isCallDelayed(nextCall) {
            if (new Date().getTime() > new Date(nextCall).getTime()) {
                return true;
            } else {
                return false;
            }
        },

        onDateUpdate(spotData, date) {
            spotData['NextCall'] = date;
            this.$emit('updateRequest', spotData);
        },

        storeOldComment(row) {
            this.oldComments = row.Comments || ''; // Ensure a default value
        },

        onCommentUpdate(row, oldComment, newComment) {
            if (!newComment) {
                return;
            }

            newComment = `${oldComment}\n${newComment}`;
            const date = new Date();
            const dd = date.getDate();
            let mm = date.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            row.Comments = `${newComment} [${dd}/${mm}]`;
            this.$emit('updateRequest', row);
            // Reset stored old comment
            this.oldComments = row.Comments;
            this.isOpen = false;
            this.newComment = '';
            this.oldComments = '';
            this.newCommentMap[row.ID] = ''; // Reset the new comment for the row
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
            const selectedStatus = this.statusList.find(
                (row) => row.id === this.selectedRow.Status,
            );
            this.defaultStatus = selectedStatus.name;
        },

        // formatDate to formate the date in 'YYYY-MM-DD' ex: "2024-08-12"
        formatDate(date) {
            if (!date) return '';
            return moment(date).format('YYYY-MM-DD');
        },

        handleExpiringRequests() {
            // Update the URL to include the isExpiring parameter
            const url = new URL(window.location.href);
            url.searchParams.set('isExpiring', true);
            window.history.pushState({}, '', url.toString());
            this.filters.isExpiring = true;
            this.applyFilters();
        },

        handleAgentFilter(agent) {
            const url = new URL(window.location.href);
            url.searchParams.set('agent', agent);
            window.history.pushState({}, '', url.toString());
            this.filters.Agent = agent
            this.applyFilters();
        },
        handleStatusFilter(status) {
            const url = new URL(window.location.href);
            const statusRow = this.statusList.find(
                (item) => item.name === status,
            );
            url.searchParams.set('status', statusRow.id);
            window.history.pushState({}, '', url.toString());
            this.filters.Status = status;
            this.applyFilters();
        },

        updateSummary(requests) {
            this.summary.totalRequest = requests.length;
            this.summary.today = 0;
            this.summary.yesterday = 0;
            this.summary.high = 0;
            this.summary.medium = 0;
            this.summary.low = 0;
            this.summary.status = [0, 0, 0, 0];
            this.summary.agent = {};

            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            requests.forEach((request) => {
                if (request.Priority === RequestPriority.High)
                    this.summary.high++;
                if (request.Priority === RequestPriority.Medium)
                    this.summary.medium++;
                if (request.Priority === RequestPriority.Low)
                    this.summary.low++;
                this.summary.status[request.Status]++;

                const agentName = request.Agent;
                if (agentName) {
                    if (!this.summary.agent[agentName]) {
                        this.summary.agent[agentName] = 0;
                    }
                    this.summary.agent[agentName]++;
                }

                const createdDate = new Date(
                    request.CreatedAt,
                ).toLocaleDateString();
                if (createdDate === today.toLocaleDateString())
                    this.summary.today++;
                if (createdDate === yesterday.toLocaleDateString())
                    this.summary.yesterday++;
            });
        },

        removeExpiringFilter() {
            this.filters.isExpiring = false;
            const url = new URL(window.location.href);
            url.searchParams.delete('isExpiring');
            window.history.pushState({}, '', url.toString());
            this.applyFilters();
        },
        removeAgentFilter() {
            this.filters.Agent = '';
            const url = new URL(window.location.href);
            url.searchParams.delete('agent');
            window.history.pushState({}, '', url.toString());
            this.applyFilters();
        },
        removeStatusFilter() {
            this.filters.Status = '';
            const url = new URL(window.location.href);
            url.searchParams.delete('status');
            window.history.pushState({}, '', url.toString());
            this.applyFilters();
        },
    },
};
</script>
<style lang="scss">
$portal-font-size: 13px;

.header {
    display: flex;
    justify-content: space-between;
}

@media (max-width: 900px) {
    .header {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .comment-wrapper {
        display: flex;
        flex-direction: column;
        max-width: 160px;
    }
}

.expiring-request {
    align-items: center;
    align-items: center;
    background-color: rgba(253, 57, 57, 0.169);
    border-radius: 12px;
    border: 1px solid rgb(253, 57, 57);
    color: red;
    display: flex;
    font-size: 14px;
    gap: 10px;
    height: max-content;
    justify-content: center;
    padding: 8px 16px;
}

.expiring-icon {
    color: red;
    text-align: center;
    width: 100%;
}

.hyperlink {
    color: rgb(56, 56, 255);
    cursor: pointer;
    text-decoration: underline;
}

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
            width: 100%;
        }
    }

    .summary {
        .so-btn {
            text-align: right;
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

.frequent-comments {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    span {
        border: 1px dashed black;
        cursor: pointer;
        padding: 12px 16px;
    }
}

.previous-comments {
    font-size: 12px;
    height: 100px;
    margin: 20px 0;
    max-height: 100px;
    overflow-y: scroll;
    white-space: pre-line;
}

.filters {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: Arial, sans-serif;
    margin: 5px;
    margin-bottom: 20px;
}

.filters-label {
    font-weight: bold;
}

.remove-filter {
    margin-left: 8px;
    font-weight: bold;
    cursor: pointer;
    color: #666;
}

.remove-filter:hover {
    color: #e74c3c;
}

.is-hidden-mobile {
    display: block;
}

.is-hidden-tablet {
    display: none;
}

@media (max-width: 1100px) {
    .is-hidden-mobile {
        display: none;
    }

    .is-hidden-tablet {
        display: block;
    }
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 18px;
    font-weight: bold;
    color: rgb(63, 63, 63);
}

.loading::after {
    content: '';
    width: 18px;
    height: 18px;
    margin-left: 10px;
    border: 3px solid rgb(63, 63, 63);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.summary-layout {
    background-color: #f5f5dc;
    border-radius: 8px;
    border: none;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    margin: 16px auto;
    max-width: 540px;
    padding: 12px;
    position: absolute;
    right: 20px;
    top: 48px;
    z-index: 999;
}

.summary-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.total-request,
.total-agent {
    color: var(--parkspot-black);
    font-size: $portal-font-size;
    font-weight: bold;
    margin: 4;
}

.summary-table {
    background-color: transparent;
    border-collapse: collapse;
    font-size: $portal-font-size;
    table-layout: fixed;
    width: 100%;
}

.summary-table th,
.summary-table td {
    border: 1px dotted var(--parkspot-black);
    color: var(--parkspot-black);
    line-height: 1.5;
    padding: 8px 8px;
    text-align: center;
    vertical-align: middle;
}

.summary-table th {
    background-color: #ffe08a66;
    font-weight: bold;
}

.summary-table th,
.summary-table td {
    width: 25%;
}

.summary-table th:last-child,
.summary-table td:last-child {
    width: 35%;
}

.summary-table td p {
    line-height: 1.4;
    margin: 4px 0;
}

@media (max-width: 768px) {
    .summary-layout {
        padding: 8px;
        width: 96%;
    }

    .summary-header {
        align-items: flex-start;
        flex-direction: column;
        gap: 4px;
    }

    .summary-table {
        font-size: $portal-font-size;
    }

    .summary-table th,
    .summary-table td {
        padding: 8px 4px;
    }

    .summary-table th:last-child,
    .summary-table td:last-child {
        width: 30%;
    }
}

.filters {
    align-items: center;
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.filters-label {
    flex-shrink: 0;
    white-space: nowrap;
}

.filters-group {
    display: flex;
    gap: 8px;
}

.filters-group > * {
    flex: 0 0 auto;
}

@media (max-width: 600px) {
    .filters {
        align-items: stretch;
        flex-direction: column;
    }

    .filters-group {
        flex-direction: column;
    }

    .filters-group > * {
        width: 100%;
    }
}
</style>
