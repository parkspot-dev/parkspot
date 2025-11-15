<template>
    <div class="body">
        <LoaderModal v-if="isLoading"></LoaderModal>
        <div class="root">
            <!-- Spot Images -->
            <ImageGallery
                :images="spotImages"
                :locationName="SO.area"
                @delete-image="onDeleteImage"
            ></ImageGallery>

            <!-- Users Spots and Spots Requests -->
            <div
                v-if="
                    (UsersSpots && UsersSpots.length > 0) ||
                    (UsersSpotRequests && UsersSpotRequests.length > 0)
                "
                class="stops-requests-container"
            >
                <div
                    v-if="UsersSpots && UsersSpots.length > 0"
                    class="table-container"
                >
                    <hr style="width: 100%" />
                    <h2 class="promoted-spots">Promoted Spots</h2>
                    <div class="table-container">
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>Spot ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="spot in UsersSpots"
                                    :key="spot.SiteID"
                                >
                                    <td>
                                        <a
                                            :href="
                                                this.getSpotDetailURL(
                                                    spot.SiteID,
                                                )
                                            "
                                            target="_blank"
                                        >
                                            {{ spot.SiteID }}
                                        </a>
                                    </td>
                                    <td>
                                        {{ spot.Name }}
                                    </td>
                                    <td>{{ spot.Address }}</td>
                                    <td>{{ spot.Latitude }}</td>
                                    <td>{{ spot.Longitude }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    v-if="UsersSpotRequests && UsersSpotRequests.length > 0"
                    class="table-container"
                >
                    <hr style="width: 100%" />
                    <h2 class="pending-spot">Pending Spots</h2>
                    <div class="table-container">
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="spotRequest in UsersSpotRequests"
                                    :key="spotRequest.ID"
                                >
                                    <td>
                                        <a
                                            :href="
                                                getReviewSpotRequestURL(
                                                    spotRequest.ID,
                                                )
                                            "
                                            target="_blank"
                                        >
                                            {{ spotRequest.ID }}
                                        </a>
                                    </td>
                                    <td>{{ spotRequest.Name }}</td>
                                    <td>{{ spotRequest.Address }}</td>
                                    <td>{{ spotRequest.Latitude }}</td>
                                    <td>{{ spotRequest.Longitude }}</td>
                                    <td class="center-select">
                                        <SelectInput
                                            :key="spotRequest.$eventID"
                                            :defaultValue="
                                                getSpotRequestStatusLabel(
                                                    spotRequest.Status,
                                                )
                                            "
                                            :list="
                                                spotRequestStatusList.map(
                                                    (status) => status.name,
                                                )
                                            "
                                            @change="
                                                onStatusUpdate(
                                                    spotRequest,
                                                    $event.target.value,
                                                )
                                            "
                                            name="updateStatus"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- SO Details Section -->
            <div class="form-section so-form-section">
                <div class="heading">
                    <h3 class="sub-heading">SO Details</h3>
                </div>
                <!-- SO Details -->
                <div class="form-group">
                    <!-- Spot Id(This field is Not allowed to edit) -->
                    <div class="readonly-field form-field">
                        <label for="spotId">SpotId:</label>
                        <input
                            class="noborder"
                            :disabled="true"
                            type="text"
                            v-model="SO.spotId"
                        />
                    </div>
                    <!-- user Name(This field is Not allowed to edit) -->
                    <div class="readonly-field form-field">
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

                    <!-- Apartment Name -->
                    <div class="form-field">
                        <label for="apartmentName">Apartment Name:</label>
                        <input
                            placeholder="Enter apartment name"
                            type="text"
                            v-model="SO.apartmentName"
                        />
                    </div>

                    <!-- Facilities -->
                    <div class="form-field">
                        <label for="facilities">Facilities:</label>
                        <MultiSelectInput
                            :list="facilityOptions"
                            placeholder="Select one or more facilities"
                            name="facilities"
                            v-model="Facilities"
                            :showBorder="true"
                        />
                    </div>

                    <!-- City -->
                    <div class="form-field">
                        <label for="city">City:</label>
                        <select v-model="SO.city" @change="validateCity">
                            <option
                                v-for="city in cityOptions"
                                :key="city"
                                :value="city"
                            >
                                {{ city }}
                            </option>
                        </select>
                        <span class="error" v-if="cityError">{{
                            cityError
                        }}</span>
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

                    <!-- Area -->
                    <div class="form-field">
                        <label for="area">Area:</label>
                        <input type="text" v-model="SO.area" />
                    </div>

                    <!-- Thumbnail image -->
                    <div class="form-field">
                        <label for="thumbnailImage">Thumbnail Image:</label>
                        <input
                            type="text"
                            v-model="SO.thumbnailImage"
                            readonly
                        />
                        <div class="thumbnail-image-wrapper">
                            <input
                                @change="handleThumbnailUpload"
                                accept="image/*"
                                id="thumbnailImage"
                                type="file"
                            />
                            <img
                                v-if="SO.thumbnailImage"
                                :src="SO.thumbnailImage"
                                style="
                                    max-width: 150px;
                                    max-height: 150px;
                                    margin-top: 10px;
                                "
                                alt="preview"
                            />
                        </div>
                    </div>

                    <!-- Adddress -->
                    <div class="form-field">
                        <label for="address">Address:</label>
                        <textarea
                            id="address"
                            placeholder="Enter SO address"
                            rows="2"
                            v-model="SO.address"
                        ></textarea>
                    </div>

                    <!-- Upload Images -->
                    <div class="form-field">
                        <label for="uploadImages">Upload Images:</label>
                        <ImageUpload
                            v-model:images="SO.uploadImages"
                        ></ImageUpload>
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
                            >SO Rent(<span>&#8377;</span>):<span
                                style="color: red"
                                >*</span
                            ></label
                        >
                        <input
                            placeholder="Enter the SO charges"
                            @input="validateBaseAmount"
                            @blur="validateBaseAmount"
                            required
                            min="1"
                            type="number"
                            v-model="Rent.baseAmount"
                        />
                        <div class="error" v-if="baseAmountError">
                            {{ baseAmountError }}
                        </div>
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
                    <!-- Last Call Date -->
                    <div class="readonly-field form-field">
                        <label for="spotId">Last Call Date:</label>
                        <input
                            class="noborder"
                            :disabled="true"
                            type="text"
                            value="Today"
                        />
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
                    :class="{ 'btn-disabled': !isFormModified }"
                    :disabled="!isFormModified"
                >
                    Save
                </AtomButton>
                <AtomButton
                    @click.native="openModal('Promote')"
                    class="btn"
                    :class="{
                        'btn-disabled':
                            !isFormValid ||
                            Booking.spotrequestStatus !==
                                spotRequestStatusOptions.Verified,
                    }"
                    :disabled="
                        !isFormValid ||
                        Booking.spotrequestStatus !==
                            spotRequestStatusOptions.Verified
                    "
                >
                    Promote
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

import imageCompression from 'browser-image-compression';

import { CITY_OPTIONS, PARKING_FACILITY } from '@/constant/constant';
import {
    getIdBasedOnLabel,
    getSpotRequestStatusLabel,
    ParkingSize,
} from '../constant/enums';
import SelectInput from '@/components/global/SelectInput.vue';
import { RentUnit } from '../constant/enums';
import { SiteType } from '../constant/enums';
import { SpotRequestStatus } from '../constant/enums';
import AtomButton from '../components/atoms/AtomButton.vue';
import AtomDatePicker from '@/components/atoms/AtomDatePicker.vue';
import AtomHeading from '@/components/atoms/AtomHeading.vue';
import AtomIcon from '@/components/atoms/AtomIcon.vue';
import ImageGallery from '@/components/organisms/OrganismImageGallery.vue';
import ImageUpload from '@/components/global/ImageUpload.vue';
import ImageUploadService from '@/services/ImageUploadService';
import LoaderModal from '@/components/extras/LoaderModal.vue';
import MultiSelectInput from '@/components/global/MultiSelectInput.vue';

export default {
    name: 'ReviewSpot',
    components: {
        AtomButton,
        AtomDatePicker,
        AtomHeading,
        AtomIcon,
        ImageGallery,
        ImageUpload,
        LoaderModal,
        MultiSelectInput,
        SelectInput,
    },
    data() {
        return {
            spotRequestStatusList: [
                { id: 0, name: 'Not Set' },
                { id: 1, name: 'Registered' },
                { id: 2, name: 'Processing' },
                { id: 3, name: 'Requested Modification' },
                { id: 4, name: 'Verified' },
                { id: 6, name: 'Denied' },
                { id: 8, name: 'Duplicate' },
            ],
            clickedButton: null, // Tracks which button is clicked
            isModalOpen: false, // Tracks modal visibility
            facilityOptions: [...PARKING_FACILITY.SO.FACILITIES_DATA],
            modalContent: {
                action: '',
                message: '',
                title: '',
            },
            initialFormData: {},
            baseAmountError: '',
            Facilities: [],
            cityOptions: CITY_OPTIONS,
        };
    },
    computed: {
        ...mapState('reviewSpot', [
            'Booking',
            'cityError',
            'isLoading',
            'latlongError',
            'mobileError',
            'Rent',
            'SO',
            'spotImagesError',
            'status',
            'statusMessage',
            'UsersSpots',
            'UsersSpotRequests',
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
                this.isFacilitiesUpdated() ||
                JSON.stringify(this.initialFormData) !==
                    JSON.stringify({
                        SO: this.SO,
                        Rent: this.Rent,
                        Booking: this.Booking,
                    })
            );
        },
        isFormValid() {
            return this.validateFormFields();
        },
        spotImages() {
            let spotImages = [];
            if (this.SO?.spotImagesList && this.SO.spotImagesList.length > 0) {
                spotImages = this.SO.spotImagesList;
            } else if (this.SO?.thumbnailImage) {
                spotImages = Array.isArray(this.SO.thumbnailImage)
                    ? this.SO.thumbnailImage
                    : [this.SO.thumbnailImage];
            }
            // Filter out empty or falsy strings (empty, null, undefined, whitespace-only)
            return spotImages.filter(
                (img) => typeof img === 'string' && img.trim() !== '',
            );
        },
    },
    methods: {
        ...mapActions('reviewSpot', [
            'fetchSpotDetails',
            'initState',
            'saveForm',
            'setSpotImageError',
            'setUpdatedFields',
            'submitForm',
            'validateCity',
            'validateLatLong',
            'validateMobile',
            'validateSpotImageUrl',
            'deleteImage',
            'setUpdatedFacilities',
            'validateFormFields',
            'fetchUsersSpotsAndSpotRequests',
            'handleFormErrors',
        ]),
        ...mapActions('spotRequests', ['updateStatus']),
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
            } else if (action === 'Promote') {
                this.modalContent = {
                    action: 'Promote',
                    message:
                        'This saves the details and start showing it to customers.',
                    title: 'Confirm Promote',
                };
            }
        },
        closeModal() {
            this.isModalOpen = false;
        },
        async confirmAction() {
            if (this.clickedButton === 'Save') {
                this.confirmSave();
            } else if (this.clickedButton === 'Promote') {
                const isValid = await this.handleFormErrors();
                if (!isValid) {
                    this.closeModal();
                    return;
                }
                if (this.isFormModified) {
                    this.confirmSave();
                }
                this.submitForm();
            }
            this.closeModal();
        },
        confirmSave() {
            const updatedFields = new Set();

            // Compare Facilities
            if (this.isFacilitiesUpdated()) {
                updatedFields.add('facilities');
                this.setUpdatedFacilities(this.Facilities);
            }

            ['SO', 'Rent', 'Booking'].forEach((section) => {
                for (const key in this[section]) {
                    const currentValue = this[section][key];
                    const initialValue = this.initialFormData[section][key];
                    // Convert to JSON strings for deep comparison
                    if (
                        JSON.stringify(currentValue) !==
                        JSON.stringify(initialValue)
                    ) {
                        updatedFields.add(key);
                    }
                }
            });
            this.setUpdatedFields(Array.from(updatedFields));
            this.saveForm().then((response) => {
                if (!response.ErrorCode) this.updateInitialFormState();
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
        addNewUrlField() {
            this.SO.spotImagesList.push('');
            this.setSpotImageError({
                index: this.SO.spotImagesList.length - 1,
                message: '',
            });
        },
        removeUrlField(index) {
            this.SO.spotImagesList.splice(index, 1);
            this.spotImagesError.splice(index, 1);
        },
        validateBaseAmount() {
            if (!this.Rent.baseAmount || this.Rent.baseAmount <= 0) {
                this.baseAmountError = 'SO charges must be greater than 0';
                return false;
            }
            this.baseAmountError = '';
            return true;
        },
        async handleThumbnailUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const options = {
                maxWidthOrHeight: 128,
                maxSizeMB: 0.2,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                this.SO.thumbnailImage = URL.createObjectURL(compressedFile);
                const res = await ImageUploadService.uploadImages(
                    [compressedFile],
                    this.SO.spotId,
                );
                this.SO.thumbnailImage = res.urls[0];
            } catch (error) {
                console.error(error);
            }
        },
        onDeleteImage(index) {
            this.deleteImage(index);
        },

        // isFacilitiesUpdated is compare initial SO.Facilities with this.Facilities
        isFacilitiesUpdated() {
            if (this.SO.Facilities) {
                const FacilitiesName = this.SO.Facilities.map((facility) => {
                    return facility.Name;
                });
                return (
                    JSON.stringify(FacilitiesName) !==
                    JSON.stringify(this.Facilities)
                );
            }
        },

        getSpotDetailURL(spotId) {
            const encodedSpotId = encodeURIComponent(spotId);
            return `${window.location.origin}/spot-details/${encodedSpotId}`;
        },

        getReviewSpotRequestURL(spotRequestId) {
            return `${window.location.origin}/internal/spot-requests/?requestId=${spotRequestId}`;
        },
        async onStatusUpdate(spotData, status) {
            const statusId = getIdBasedOnLabel(
                this.spotRequestStatusList,
                status,
            );
            if (statusId != null) {
                spotData['Status'] = statusId;
                await this.updateStatus(spotData);
                this.$buefy.toast.open({
                    message: `Status updated to ${getSpotRequestStatusLabel(statusId)}`,
                    type: 'is-success',
                    duration: 3000,
                });
            } else {
                this.alertError('Invalid status selected.');
            }
        },

        getSpotRequestStatusLabel(spotRequestStatus) {
            return getSpotRequestStatusLabel(spotRequestStatus);
        },
    },
    watch: {
        SO(SODetails) {
            if (SODetails.Facilities && SODetails.Facilities.length > 0) {
                this.Facilities = SODetails.Facilities.map((facility) => {
                    return facility.Name;
                });
            }
            if (SODetails.mobile) {
                this.fetchUsersSpotsAndSpotRequests({
                    mobile: SODetails.mobile,
                    spotId: SODetails.spotId,
                });
            }
        },
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

<style lang="scss" scoped>
.add-new-url-btn {
    display: flex;
    align-items: center;
    background-color: var(--primary-color);
    color: var(--parkspot-black);
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;
}

.btn {
    border-radius: var(--border-default);
    font-weight: 700;
    margin: 4px;
    width: 15%;
}

.btn-disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
    background-color: #f5f5f5 !important;
    color: #999 !important;
}

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
    color: #ff4d4f;
    font-size: 0.8rem;
    font-weight: 500;
    margin-top: 4px;
}

.error-field {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.form-field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: 0% 9%;
}

.form-field input.error-input {
    background-color: var(--primary-color);
    border-color: #ff3860;
}

.form-field-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    background-color: red;
    height: fit-content;
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
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
    padding-bottom: 2%;
}

.form-section {
    background-color: var(--parkspot-white);
    border-radius: 5px;
    border: 1px solid #cccccc;
    height: auto;
    margin: 1% auto;
    padding: 1%;
}

.full-width-input {
    border: 1px solid #ccc;
    box-sizing: border-box;
    min-width: 260%;
    padding: 8px 12px;
}

.heading {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    background: var(--parkspot-white);
    border-radius: var(--border-default);
    padding: 20px;
    text-align: center;
    transform: translate(-50%, -50%);
}

.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 998;
    height: 100%;
}

.modal-actions {
    margin-top: 15px;
}

.noborder {
    background-color: var(--parkspot-white);
    border: none;
    font-weight: 600;
}

.readonly-field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;

    label {
        font-weight: 700;
    }

    input {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4px 0;
        text-align: start;
        height: 100%;
    }
}

.remove-url-btn {
    font-size: 24px;
    color: red;
    cursor: pointer;
    margin-top: 8px;
}

.root {
    margin: 1% 8%;
    max-width: 100%;
}

.scrollable-sections {
    max-height: 600px;
    overflow-y: auto;
}

.so-form-section {
    padding-bottom: 6%;
}

.sub-heading {
    color: var(--secondary-color);
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: normal;
    margin-bottom: 10px;
}

.url-entry {
    margin-bottom: 8px;
}

.thumbnail-image-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
}

@media (max-width: 1024px) {
    .so-form-section {
        padding-bottom: 12%;
    }

    .full-width-input {
        min-width: 160%;
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

    .full-width-input {
        min-width: 300%;
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

@media (max-width: 600px) {
    .full-width-input {
        min-width: 200%;
    }
}
@media (max-width: 450px) {
    .form-field {
        padding: 0 10px;
    }
    .form-group {
        padding-bottom: 15%;
    }
    .so-form-section {
        padding-bottom: 16%;
    }
    .full-width-input {
        min-width: 120%;
    }
}
.stops-requests-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

@media (max-width: 768px) {
    .stops-requests-container {
        flex-direction: column;
    }
}
.table-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    justify-items: start;
    max-height: 400px;
    overflow-y: scroll;
    width: 100%;

    h2 {
        color: black;
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 26px;
    }
}

.styled-table {
    border-collapse: collapse;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
}

.styled-table th,
.styled-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

.styled-table thead {
    background-color: var(--primary-color);
    color: var(--parkspot-white);
    font-weight: bold;
}

.promoted-spots {
    background-color: white;
    border-radius: 20px;
    border: 1px solid #48c78e;
    color: #48c78e !important;
    padding: 4px;
}
.pending-spot {
    background-color: white;
    color: #f3d407 !important;
    border: 1px solid #f3d407;
    border-radius: 20px;
    padding: 4px;
}
.center-select {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>
