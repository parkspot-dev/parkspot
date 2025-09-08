<template>
    <div class="is-hidden-tablet">
        <div v-if="!isEmpty" class="mobile-card-list">
            <div
                v-for="row in parkingRequests"
                :key="row.ID"
                class="mobile-card box"
            >
                <div class="card-header">
                    <span
                        v-if="row.IsExpiring"
                        class="material-symbols-outlined"
                    >
                        report
                    </span>
                    <span>ID: {{ row.ID }}</span>
                </div>

                <div class="card-body">
                    <p><b>Updated:</b> {{ getFormattedDate(row.UpdatedAt) }}</p>
                    <p><b>Created:</b> {{ getFormattedDate(row.CreatedAt) }}</p>
                    <p>
                        <b>Priority: </b>
                        <span
                            class="tag"
                            :class="{
                                'is-info': row.Priority === 1,
                                'my-status': row.Priority === 2,
                                'is-danger': row.Priority === 3,
                            }"
                        >
                            <b>{{ getPriority(row.Priority) }}</b>
                        </span>
                    </p>

                    <p><b>Name:</b> {{ row.Name }}</p>
                    <p v-if="row.Agent !== 'NA' || isAdmin">
                        <b>Mobile: </b>
                        <span v-if="isAdmin">{{ row.Mobile }}</span>
                        <button
                            v-else
                            class="button is-small"
                            @click="$emit('connect', row)"
                        >
                            Connect
                        </button>
                    </p>

                    <p v-if="row.EmailID"><b>Email:</b> {{ row.EmailID }}</p>
                    <p v-if="row.Landmark">
                        <b>Landmark:</b> {{ row.Landmark }}
                    </p>
                    <p v-if="row.Distance">
                        <b>Distance:</b> {{ row.Distance }} Km
                    </p>
                    <p v-if="row.City"><b>City:</b> {{ row.City }}</p>
                    <p v-if="row.Duration">
                        <b>Duration:</b> {{ row.Duration }}
                    </p>
                    <p v-if="row.CarModel"><b>Car:</b> {{ row.CarModel }}</p>

                    <div class="comment-section">
                        <p><b>Comments: </b></p>
                        <div class="previous-comments">{{ row.Comments }}</div>
                        <AtomTextarea
                            :maxlength="3000"
                            :rowNo="3"
                            size="is-small"
                            placeholder="Add new comment..."
                            v-model="newCommentMap[row.ID]"
                            @mousedown="storeOldComment(row)"
                            @changed="
                                $emit(
                                    'comment-update',
                                    row,
                                    oldComments,
                                    $event,
                                )
                            "
                        />
                    </div>

                    <div class="status-section">
                        <p><b>Agent:</b> {{ row.Agent }}</p>
                        <AtomSelectInput
                            v-if="isAdmin"
                            :list="agentList"
                            size="is-small"
                            @change="$emit('agent-update', row, $event)"
                            v-model="row.Agent"
                        />
                        <button
                            v-else
                            @click="$emit('agent-update', row, agentList[0].id)"
                            class="btn"
                        >
                            Assign to me
                        </button>
                    </div>

                    <div class="status-section">
                        <p><b>Status:</b> {{ statusList[row.Status].name }}</p>
                        <AtomSelectInput
                            :list="statusList"
                            size="is-small"
                            v-model="row.Status"
                            @change="$emit('status-update', row, $event)"
                        />
                        <p>
                            <b>Next Call: </b>
                            <span
                                :class="{
                                    'is-danger': isCallDelayed(row.NextCall),
                                }"
                            >
                                {{
                                    new Date(row.NextCall).toLocaleDateString(
                                        'en-GB',
                                    )
                                }}
                            </span>
                        </p>
                        <AtomDatePicker
                            :assignedDate="row.NextCall"
                            size="is-small"
                            @changed="(date) => $emit('date-update', row, date)"
                        />
                    </div>

                    <div class="latlng-section">
                        <a
                            target="_blank"
                            @click="toSrp(row.Latitude, row.Longitude)"
                        >
                            {{ row.Latitude.toFixed(6) }},
                            {{ row.Longitude.toFixed(6) }}
                        </a>
                        <AtomInput
                            size="is-small"
                            :modelValue="`${row.Latitude.toFixed(6)}, ${row.Longitude.toFixed(6)}`"
                            @change="
                                $emit('latlng-update', row, $event.target.value)
                            "
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="has-text-centered">No records</div>
    </div>
</template>

<script>
import AtomDatePicker from '../atoms/AtomDatePicker.vue';
import AtomInput from '../atoms/AtomInput.vue';
import AtomSelectInput from '../atoms/AtomSelectInput.vue';
import AtomTextarea from '../atoms/AtomTextarea.vue';

export default {
    name: 'MobileVue',
    components: {
        AtomDatePicker,
        AtomInput,
        AtomSelectInput,
        AtomTextarea,
    },
    props: {
        parkingRequests: { type: Array, required: true },
        isEmpty: { type: Boolean, required: true },
        isAdmin: { type: Boolean, default: false },
        newCommentMap: { type: Object, required: true },
        statusList: { type: Object, required: true },
        agentList: { type: Array, default: () => [] },

        // functions/values from parent
        getFormattedDate: { type: Function, required: true },
        getPriority: { type: Function, required: true },
        isCallDelayed: { type: Function, required: true },
        toSrp: { type: Function, required: true },
        storeOldComment: { type: Function, required: true },
        oldComments: { type: null },
    },
};
</script>
<style>
.mobile-card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
}

.material-symbols-outlined {
    color: red;
}

.mobile-card {
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    font-size: 0.9rem;
}

.mobile-card .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: #333;
}

.mobile-card .card-body p {
    display: flex; 
    justify-content: space-between;
    line-height: 1.4;
    margin: 8px 0;
}

.comment-section {
    margin-top: 0.8rem;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
}

.comment-section textarea {
    width: 100%;
    margin-top: 0.4rem;
}

.status-section {
    margin-top: 0.8rem;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
}

.status-section p {
    margin-bottom: 0.3rem;
}

.status-section .has-text-danger {
    color: #e53935;
    font-weight: bold;
}

.latlng-section {
    margin-top: 0.8rem;
    padding-top: 0.5rem;
    border-top: 1px solid #eee;
}

.latlng-section a {
    display: inline-block;
    margin-bottom: 0.4rem;
    color: #1976d2;
    text-decoration: underline;
    font-weight: 500;
}
</style>
