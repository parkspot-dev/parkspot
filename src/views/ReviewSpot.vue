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
                            <option value="PerSqftMonth">Per Sqft</option>
                            <option value="PerHour">Per Hour</option>
                            <option value="PerDay">Per Day</option>
                            <option value="PerSqftMonth">Per Sqft Month</option>
                        </select>
                    </div>
                    <!-- Parking Size -->
                    <div class="form-field">
                        <label for="parkingSize">Parking Size:</label>
                        <select v-model="Rent.parkingSize">
                            <option value="Bike">Bike</option>
                            <option value="Compact">Compact(Medium)</option>
                            <option value="FullSize">Full Size(Large)</option>
                            <option value="Hatchback">Hatchback(Small)</option>
                            <option value="Unspecified">Unspecified</option>
                        </select>
                    </div>
                    <!-- Site Type -->
                    <div class="form-field">
                        <label for="siteType">Site Type:</label>
                        <select v-model="Rent.siteType">
                            <option value="ParkingYard">Parking Yard</option>
                            <option value="SearchOnly">Search Only</option>
                            <option value="Register">Register</option>
                            <option value="Book">Book</option>
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
                            class="calendar"
                            :size="'is-small'"
                            v-if="Booking.startDate"
                        >
                        </AtomDatePicker>
                    </div>
                    <!-- End Date -->
                    <div class="form-field">
                        <label for="endDate">End Date:</label>
                        <AtomDatePicker
                            :assignedDate="Booking.endDate"
                            class="calendar"
                            required
                            :size="'is-small'"
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
                            <option value="Cancelled">Cancelled</option>
                            <option value="Denied">Denied</option>
                            <option value="Duplicate">Duplicate</option>
                            <option value="NotSet">Not Set</option>
                            <option value="Processing">Processing</option>
                            <option value="Promoted">Promoted</option>
                            <option value="Registered">Registered</option>
                            <option value="RequestedModification">
                                Requested Modification
                            </option>
                            <option value="Verified">Verified</option>
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
                <AtomButton @click.native="openModal('Save')" class="btn">
                    Save
                </AtomButton>
                <AtomButton @click.native="openModal('Publish')" class="btn">
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
        };
    },
    computed: {
        ...mapState('reviewSpot', [
            'Booking',
            'errorMessage',
            'hasError',
            'isLoading',
            'latlongError',
            'mobileError',
            'Rent',
            'SO',
        ]),
    },
    methods: {
        ...mapActions('reviewSpot', [
            'validateLatLong',
            'validateMobile',
            'initState',
            'submitForm',
            'saveForm',
            'fetchSpotDetails',
        ]),
        setSpotId() {
            this.SO.spotId = this.$route.query.spotid;
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

        // Modal operations
        openModal(action) {
            console.log('Inside openmodal', action);
            this.clickedButton = action;
            this.isModalOpen = true;

            if (action === 'Save') {
                this.modalContent = {
                    action: 'Save',
                    message: 'Are you sure you want to save the changes?',
                    title: 'Confirm Save',
                };
            } else if (action === 'Publish') {
                this.modalContent = {
                    action: 'Publish',
                    message: 'Are you sure you want to publish this content?',
                    title: 'Confirm Publish',
                };
            }
        },
        closeModal() {
            this.isModalOpen = false;
        },
        confirmAction() {
            console.log(`${this.clickedButton} action confirmed.`);
            this.clickedButton === 'Save' ? this.saveForm() : this.submitForm();
            this.closeModal();
        },
    },
    watch: {
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
        },
    },
    mounted() {
        this.setSpotId();
        this.fetchSpotDetails();
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

.modal-overlay {
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
}

.modal-content {
    background: var(--parkspot-white);
    border-radius: var(--border-default);
    padding: 20px;
    text-align: center;
}

.modal-actions {
    margin-top: 15px;
}

@media (max-width: 400px) {
    .form-field{
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
</style>
