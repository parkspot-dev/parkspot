<template>
    <div class="body">
        <LoaderModal v-if="isLoading"></LoaderModal>
        <div class="root">
            <!-- SO Details Section -->
            <div class="form-section">
                <div class="heading">
                    <h3 class="sub-heading">SO Details</h3>
                </div>
                <!-- SO Details -->
                <div class="form-group">
                    <!-- Spot Id(This field is Not allowed to edit) -->
                    <div class="readonly-field">
                        <label for="spotId">SpotId:</label>
                        <input
                            class="noborder"
                            :disabled="true"
                            type="text"
                            v-model="SO.spotId"
                        />
                    </div>
                    <!-- user Name(This field is Not allowed to edit) -->
                    <div class="readonly-field">
                        <label for="userName">UserName:</label>
                        <input
                            class="noborder"
                            :disabled="true"
                            type="text"
                            v-model="SO.userName"
                        />
                    </div>
                    <!-- Full name -->
                    <div class="form-field">
                        <label for="fullName">Full Name:</label>
                        <input
                            placeholder="Enter Full Name"
                            type="text"
                            v-model="SO.fullName"
                        />
                    </div>
                    <!-- Mobile -->
                    <div class="form-field">
                        <label for="mobile"
                            >Mobile:<span style="color: red">*</span></label
                        >
                        <input
                            @input="validateMobile"
                            id="mobile"
                            maxlength="10"
                            placeholder="Enter SO Mobile number"
                            required
                            type="text"
                            v-model="SO.mobile"
                        />
                        <div class="error" v-if="mobileError">
                            {{ mobileError }}
                        </div>
                    </div>

                    <!-- EmailId -->
                    <div class="form-field">
                        <label for="email">Email:</label>
                        <input
                            placeholder="Enter Email"
                            type="email"
                            v-model="SO.email"
                        />
                    </div>
                    <!-- City -->
                    <div class="form-field">
                        <label for="city">City:</label>
                        <select v-model="SO.city">
                            <option value="Bengaluru">Bengaluru</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Kolkata">Kolkata</option>
                        </select>
                    </div>
                    <!-- Area -->
                    <div class="form-field">
                        <label for="area">Area:</label>
                        <input type="text" v-model="SO.area" />
                    </div>
                    <!-- Latitude, Longitude-->
                    <div class="form-field">
                        <label for="latlong"
                            >Latitude,Longitude:<span style="color: red"
                                >*</span
                            ></label
                        >
                        <input
                            @input="validateLatLong"
                            id="latlong"
                            placeholder="Enter SO latitude, longitude"
                            required
                            type="text"
                            v-model="SO.latlong"
                        />
                        <span class="error" v-if="latlongError">{{
                            latlongError
                        }}</span>
                    </div>

                    <!-- Adddress -->
                    <div class="form-field">
                        <label for="address">Address:</label>
                        <textarea
                            id="address"
                            placeholder="Enter SO address"
                            rows="2"
                            style="margin-bottom: 36px"
                            v-model="SO.address"
                        ></textarea>
                    </div>

                    <!-- Thumbnail image -->
                    <div class="form-field thumbnail-image">
                        <label for="thumbnailImage">Thumbnail Image:</label>
                        <input
                            placeholder="Enter image url"
                            type="text"
                            v-model="SO.thumbnailImage"
                        />
                    </div>
                </div>
            </div>

            <!-- Rent Details Section -->
            <div class="form-section">
                <div class="heading">
                    <h3 class="sub-heading">Rent Details</h3>
                </div>
                <!-- Rent Details -->
                <div class="form-group">
                    <!-- Total Slots -->
                    <div class="form-field">
                        <label for="totalSlots">Slots:</label>
                        <input
                            placeholder="Enter the total Slots"
                            type="number"
                            v-model="Rent.totalSlots"
                        />
                    </div>
                    <!-- Base Amount -->
                    <div class="form-field">
                        <label for="baseAmount"
                            >Charges(<span>&#8377;</span>):<span
                                style="color: red"
                                >*</span
                            ></label
                        >
                        <input
                            placeholder="Enter the SO charges"
                            required
                            type="number"
                            v-model="Rent.baseAmount"
                        />
                    </div>
                    <!-- Rent Unit -->
                    <div class="form-field">
                        <label for="rentUnit">Rent Unit:</label>
                        <select v-model="Rent.rentUnit">
                            <option
                                v-for="(value, label) in rentUnitOptions"
                                :key="value"
                                :value="value"
                            >
                                {{ label }}
                            </option>
                        </select>
                    </div>
                    <!-- Parking Size -->
                    <div class="form-field">
                        <label for="parkingSize">Parking Size:</label>
                        <select v-model="Rent.parkingSize">
                            <option
                                v-for="(value, label) in parkingSizeOptions"
                                :key="value"
                                :value="value"
                            >
                                {{ label }}
                            </option>
                        </select>
                    </div>
                    <!-- Site Type -->
                    <div class="form-field">
                        <label for="siteType">Site Type:</label>
                        <select v-model="Rent.siteType">
                            <option
                                v-for="(value, label) in siteTypeOptions"
                                :key="value"
                                :value="value"
                            >
                                {{ label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Booking Details Section -->
            <div class="form-section">
                <div class="heading">
                    <h3 class="sub-heading">Booking Details</h3>
                </div>
                <!-- Booking Details -->
                <div class="form-group">
                    <!-- Start Date -->
                    <div class="form-field">
                        <label for="startDate"
                            >Start Date:<span style="color: red">*</span></label
                        >
                        <AtomDatePicker
                            :assignedDate="Booking.startDate"
                            :size="'is-small'"
                            @changed="onStartDateUpdate"
                            class="calendar"
                            v-if="Booking.startDate"
                        >
                        </AtomDatePicker>
                    </div>
                    <!-- End Date -->
                    <div class="form-field">
                        <label for="endDate">End Date:</label>
                        <AtomDatePicker
                            :assignedDate="Booking.endDate"
                            :size="'is-small'"
                            @changed="onEndDateUpdate"
                            class="calendar"
                            required
                            v-if="Booking.endDate"
                        >
                        </AtomDatePicker>
                    </div>
                    <!-- Last Call Date -->
                    <div class="form-field">
                        <label for="lastCallDate">Last Call Date:</label>
                        <AtomDatePicker
                            :assignedDate="Booking.lastCallDate"
                            :size="'is-small'"
                            @changed="onLastCallDateUpdate"
                            class="calendar"
                            required
                            v-if="Booking.lastCallDate"
                        >
                        </AtomDatePicker>
                    </div>
                    <!-- Spot Request Status -->
                    <div class="form-field">
                        <label for="spotrequestStatus">Status:</label>
                        <select v-model="Booking.spotrequestStatus">
                            <option
                                v-for="(
                                    value, label
                                ) in spotRequestStatusOptions"
                                :key="value"
                                :value="value"
                            >
                                {{ label }}
                            </option>
                        </select>
                    </div>
                    <!-- Duration -->
                    <div class="form-field">
                        <label for="duration">Duration:</label>
                        <input
                            placeholder="Enter Duration(max 50 characters)"
                            type="text"
                            v-model="Booking.duration"
                        />
                    </div>
                    <!-- Remark -->
                    <div class="form-field">
                        <label for="remark">Remark:</label>
                        <textarea
                            id="remark"
                            maxlength="200"
                            placeholder="Enter Remark(max 200 characters)"
                            rows="2"
                            v-model="Booking.remark"
                        ></textarea>
                    </div>
                </div>
            </div>
            <!-- END OF Details -->

            <!-- Update -->
            <div class="button-container">
                <AtomButton
                    @click.native="openModal('Save')"
                    class="btn"
                    :disabled="!isFormModified"
                >
                    Save
                </AtomButton>
                <AtomButton
                    @click.native="openModal('Publish')"
                    class="btn"
                    :disabled="
                        Booking.spotrequestStatus !==
                        spotRequestStatusOptions.Verified
                    "
                >
                    Publish
                </AtomButton>
            </div>
        </div>
        <!-- End of root -->

        <!-- Modal -->
        <div v-if="isModalOpen" class="modal-overlay">
            <div class="modal-content">
                <AtomHeading :level="'h5'" class="sub-heading">{{
                    modalContent.title
                }}</AtomHeading>
                <p>{{ modalContent.message }}</p>
                <div class="modal-actions">
                    <AtomButton @click.native="confirmAction" class="btn">
                        {{ modalContent.action }}
                    </AtomButton>
                    <AtomButton @click.native="closeModal" class="btn">
                        Cancel
                    </AtomButton>
                </div>
            </div>
        </div>
        <!-- End of Modal -->
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AtomButton from '../components/atoms/AtomButton.vue';
import AtomDatePicker from '@/components/atoms/AtomDatePicker.vue';
import AtomHeading from '@/components/atoms/AtomHeading.vue';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import { ParkingSize } from '../constant/enums';
import { SiteType } from '../constant/enums';
import { SpotRequestStatus } from '../constant/enums';
import { RentUnit } from '../constant/enums';

export default {
    name: 'ReviewSpot',
    components: {
        AtomButton,
        AtomDatePicker,
        AtomHeading,
        LoaderModal,
    },
    data() {
        return {
            clickedButton: null, // Tracks which button is clicked
            isModalOpen: false, // Tracks modal visibility
            modalContent: {
                action: '',
                message: '',
                title: '',
            },
            initialFormData: {},
        };
    },
    computed: {
        ...mapState('reviewSpot', [
            'Booking',
            'isLoading',
            'latlongError',
            'mobileError',
            'Rent',
            'SO',
            'status',
            'statusMessage',
        ]),
        parkingSizeOptions() {
            return ParkingSize;
        },
        rentUnitOptions() {
            return RentUnit;
        },
        spotRequestStatusOptions() {
            return SpotRequestStatus;
        },
        siteTypeOptions() {
            return SiteType;
        },
        isFormModified() {
            return (
                JSON.stringify(this.initialFormData) !==
                JSON.stringify({
                    SO: this.SO,
                    Rent: this.Rent,
                    Booking: this.Booking,
                })
            );
        },
    },
    methods: {
        ...mapActions('reviewSpot', [
            'validateLatLong',
            'validateMobile',
            'initState',
            'setUpdatedFields',
            'submitForm',
            'saveForm',
            'fetchSpotDetails',
        ]),
        setSpotId() {
            this.SO.spotId = this.$route.query.requestId;
        },
        alertError(msg) {
            this.$buefy.dialog.alert({
                ariaModal: true,
                ariaRole: 'alertdialog',
                hasIcon: true,
                icon: 'alert-circle',
                message: msg,
                title: 'Error',
                type: 'is-danger',
            });
        },
        alertSuccess(msg) {
            this.$buefy.dialog.alert({
                ariaModal: true,
                ariaRole: 'alertdialog',
                hasIcon: true,
                icon: 'check-circle',
                message: msg,
                title: 'Success',
                type: 'is-success',
            });
        },
        // Modal operations
        openModal(action) {
            this.clickedButton = action;
            this.isModalOpen = true;

            if (action === 'Save') {
                this.modalContent = {
                    action: 'Save',
                    message:
                        'This will only save the details. Spot will NOT is shown to customers.',
                    title: 'Confirm Save',
                };
            } else if (action === 'Publish') {
                this.modalContent = {
                    action: 'Publish',
                    message:
                        'This saves the details and start showing it to customers.',
                    title: 'Confirm Publish',
                };
            }
        },
        closeModal() {
            this.isModalOpen = false;
        },
        confirmAction() {
            if (this.clickedButton === 'Save') {
                this.confirmSave();
            } else {
                if (this.isFormModified) this.confirmSave();
                this.submitForm();
            }
            this.closeModal();
        },
        confirmSave() {
            const updatedArray = []
            for (const key in this.SO) {
                if (this.SO[key] !== this.initialFormData.SO[key]) {
                    updatedArray.push(key);
                }
            }
            for (const key in this.Rent) {
                if (this.Rent[key] !== this.initialFormData.Rent[key]) {
                    updatedArray.push(key);
                }
            }
            for (const key in this.Booking) {
                if (this.Booking[key] !== this.initialFormData.Booking[key]) {
                    updatedArray.push(key);
                }
            }
            this.setUpdatedFields(updatedArray);
            this.saveForm().then(() => {
                this.updateInitialFormState();
            });
        },
        onLastCallDateUpdate(updatedDate) {
            this.Booking.lastCallDate = updatedDate.toISOString();
        },
        onStartDateUpdate(updatedDate) {
            this.Booking.startDate = updatedDate.toISOString();
        },
        onEndDateUpdate(updatedDate) {
            this.Booking.endDate = updatedDate.toISOString();
        },
        updateInitialFormState() {
            this.initialFormData = JSON.parse(
                JSON.stringify({
                    SO: this.SO,
                    Rent: this.Rent,
                    Booking: this.Booking,
                }),
            );
        },
    },
    watch: {
        status(newStatus) {
            if (newStatus === 'error') {
                this.alertError(this.statusMessage);
            } else if (newStatus === 'success') {
                this.alertSuccess(this.statusMessage);
            }
        },
    },
    mounted() {
        this.setSpotId();
        this.fetchSpotDetails().then(() => {
            this.updateInitialFormState();
        });
    },
};
</script>

<style>
.body {
    background: #f5f5fb;
    padding: 16px;
    text-align: center;
}
.button-container {
    display: flex;
    justify-content: center;
    margin: 20px 0px;
}
.button-group {
    display: flex;
    justify-content: end;
    margin-top: 15px;
}
.calendar {
    width: 100%;
}
.error {
    color: red;
    font-size: 0.8rem;
}
.error-field {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.form-field {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0% 9%;
}

.readonly-field {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding: 0 9%;

    label {
        font-weight: 700;
    }

    input {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        padding: 4px 0;
        text-align: start;
    }
}
.form-field label {
    font-weight: 700;
    vertical-align: middle;
}
.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
    background-color: var(--primary-color);
    border-color: var(--parkspot-black);
    border: none;
    outline: none;
}
.form-field > input,
.form-field > select,
.form-section textarea {
    box-sizing: border-box;
    margin-top: 5px;
    padding: 8px;
    width: 100%;
}
.form-group {
    display: grid;
    gap: 3%;
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
    padding-bottom: 2%;
}
.form-section {
    background-color: var(--parkspot-white);
    border-radius: 5px;
    border: 1px solid #cccccc;
    margin: 1% auto;
    padding: 1%;
}
.heading {
    align-items: center;
    display: flex;
    justify-content: center;
}
.noborder {
    background-color: var(--parkspot-white);
    border: none;
    font-weight: 600;
}
.root {
    margin: 1% 8%;
    max-width: 100%;
}
.scrollable-sections {
    max-height: 600px;
    overflow-y: auto;
}

.btn {
    border-radius: var(--border-default);
    font-weight: 700;
    margin: 4px;
    width: 15%;
}
.sub-heading {
    color: var(--secondary-color);
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: normal;
    margin-bottom: 10px;
}

/* Modal Styling */
.modal-content {
    background: var(--parkspot-white);
    border-radius: var(--border-default);
    padding: 20px;
    text-align: center;
    z-index: 999;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
}

.modal-actions {
    margin-top: 15px;
}

@media (max-width: 400px) {
    .form-field {
        padding: 0 10px;
    }
    .form-group {
        padding-bottom: 15%;
    }
}
@media (max-width: 768px) {
    .form-field {
        font-size: 1rem;
        margin: 0% 0%;
    }

    .readonly-field {
        padding: 0% 0%;
    }

    .form-group {
        gap: 1%;
        grid-template-columns: 1fr;
        padding-bottom: 8%;
    }
    .form-section {
        margin-bottom: 2%;
        margin: 1% 1%;
    }
    .root {
        margin: 1% 1%;
    }
    .scrollable-sections {
        max-height: 100%;
        overflow-y: auto;
    }
    .sub-heading {
        font-size: 1.4rem;
    }
    .btn {
        width: 25%;
    }
}

.thumbnail-image {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: start !important;
    margin: 0% 9%;
}
</style>
