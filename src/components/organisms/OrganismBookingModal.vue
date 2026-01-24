<template>
    <div class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
            <div class="modal-title">
                <h2>Book this Parking Spot</h2>
                <span class="close" @click="closeModal">×</span>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>Full Name</label>
                    <input
                        v-model="form.fullName"
                        placeholder="Enter full name"
                    />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input
                        v-model="form.email"
                        placeholder="Enter email address"
                    />
                </div>

                <div class="form-group">
                    <label>Mobile</label>
                    <input
                        v-model="form.mobile"
                        placeholder="Enter mobile number"
                    />
                </div>

                <div class="form-group">
                    <label>Vehicle Number</label>
                    <input
                        v-model="form.vehicleNo"
                        placeholder="e.g. MH12AB1234"
                    />
                </div>

                <AtomButton
                    :expanded="true"
                    class="primary-btn"
                    @click="submitBooking"
                >
                    Book
                </AtomButton>
            </div>
        </div>
    </div>
</template>

<script>
import AtomButton from '@/components/atoms/AtomButton.vue';

export default {
    name: 'OrganismBookingModal',
    components: { AtomButton },
    props: {
        initialData: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['close', 'submitted'],
    data() {
        return {
            form: {
                fullName: '',
                email: '',
                mobile: '',
                vehicleNo: '',
            },
        };
    },

    watch: {
        initialData: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (!newVal) return;

                this.form = {
                    ...this.form,
                    ...newVal,
                };
            },
        },
    },

    methods: {
        submitBooking() {
            this.$emit('submitted', { ...this.form });
            this.closeModal();
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped lang="scss">
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-card {
    background: #fff;
    width: 420px;
    max-width: 92%;
    padding: 22px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    animation: scaleIn 0.2s ease;
}

.modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;

    h2 {
        font-size: 20px;
        font-weight: 600;
        color: #111;
    }

    .close {
        font-size: 26px;
        cursor: pointer;
        color: #999;
        line-height: 1;
    }

    .close:hover {
        color: #000;
    }
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
        font-size: 13px;
        font-weight: 500;
        color: #333;
    }

    input {
        padding: 11px 12px;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 14px;
        transition: border-color 0.2s ease;
    }

    input:focus {
        outline: none;
        border-color: hsl(141, 53%, 53%);
    }
}

.primary-btn {
    margin-top: 10px;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@media (max-width: 480px) {
    .modal-card {
        width: 95%;
        padding: 18px;
    }
}
</style>
