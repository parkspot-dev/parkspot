
<template>
  <div class="root">
    <!-- Image Upload Section -->

    <!-- Scrollable Form Sections -->
    <div class="scrollable-sections">
       <!-- SO Details Section -->
      <div class="form-section">
        <div class="heading">
            <h3 class="sub-heading">SO Details</h3>
        </div>
        <!-- SO Details -->
        <div class="form-group">
          <!-- Spot Id(This field is disabled to edit as it cannot be changed during runtime) -->
          <div class="form-field">
            <label for="spotId">SpotId: </label>
            <input 
             class="noborder" 
             :disabled="true" 
             type="text" 
             v-model="formdataSO.spotId"/>
          </div>
          <!-- user Name(This field is disabled to edit as it cannot be changed during runtime) -->
          <div class="form-field">
            <label for="userName">UserName: </label>
            <input 
             class="noborder" 
             :disabled="true" 
             type="text" 
             v-model="formdataSO.userName"/>
          </div>
          <!-- Full name -->
          <div class="form-field">
            <label for="fullName">FullName: </label>
            <input 
             placeholder="Enter Full Name" 
             type="text" 
             v-model="formdataSO.fullName"/>
          </div>
          <!-- Mobile -->
          <div class="form-field">
            <label for="mobile">Mobile: <span style="color: red;">*</span> </label>
                <input
                :class="{
                  error: mobileError, // checks for Mobile Error
                }"
                @input="validateMobile"
                id="mobile"
                maxlength="10"
                placeholder="Enter Mobile number"
                required
                type="text"
                v-model="formdataSO.mobile"
            />
          </div>
          <!-- EmailId -->
          <div class="form-field">
            <label for="email">Email:</label>
            <input 
             placeholder="Enter Email" 
             type="email" 
             v-model="formdataSO.email"
            />
          </div>
          <!-- City -->
          <div class="form-field">
            <label for="city">City:</label>
            <select v-model="formdataSO.city">
              <option value="Bengaluru">Bengaluru</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
          <!-- Area -->
          <div class="form-field">
            <label for="area">Area:</label>
            <input type="text" v-model="formdataSO.area"/>
          </div>
          <!-- Adddress -->
          <div class="form-field">
             <label for="address">Address:</label>
                <textarea
                id="address"
                placeholder="Enter address"
                rows="2"
                v-model="formdataSO.address"
            ></textarea>
          </div>
          <!-- Latitude -->
          <div class="form-field">
            <label for="latitude">Latitude: <span style="color: red;">*</span></label>
            <input 
              type="number"
              :class="{ error: latitudeError}" 
              @input="validateLatitude"
              placeholder="Enter latitude"
              required 
              step="any"
              v-model="formdataSO.latitude" 
              />
          </div>
          <!-- Longitude -->
          <div class="form-field">
            <label for="longitude">Longitude: <span style="color: red;">*</span></label>
            <input
             :class="{ error: longitudeError}"
             @input="validateLongitude" 
             placeholder="Enter longitude" 
             required 
             step="any" 
             type="number"
             v-model="formdataSO.longitude" 
             />
          </div>
        </div>
      </div>

      <!-- Rent Details Section -->
      <div class="form-section">
        <div class="heading">
          <h3 class="sub-heading">Rent Details </h3>
        </div>
        <!-- Rent Details -->
        <div class="form-group">
          <!-- Total Slots -->
          <div class="form-field">
            <label for="totalSlots">Slots:</label>
            <input 
             placeholder="Enter the total Slots"
             type="number" 
             v-model="formdataRent.totalSlots" 
             />
          </div>
          <!-- Base Amount -->
          <div class="form-field">
            <label for="baseAmount">Charges(<span>&#8377;</span>):<span style="color: red;">*</span></label>
            <input 
             placeholder="Enter the SO charges"
             required
             type="number" 
             v-model="formdataRent.baseAmount" 
            />
          </div>
          <!-- Rent Unit -->
          <div class="form-field">
            <label for="rentUnit">Rent Unit:</label>
            <select v-model="formdataRent.rentUnit">
              <option value="PerHour">Per Hour</option>
              <option value="PerDay">Per Day</option>
              <option value="PerSqftMonth">Per Sqft Month</option>
            </select>
          </div>
          <!-- Parking Size -->
          <div class="form-field">
            <label for="parkingSize">Parking Size:</label>
            <select v-model="formdataRent.parkingSize">
              <option value="Bike">Bike</option>
              <option value="Compact">Compact</option>
              <option value="FullSize">Full Size</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Unspecified">Unspecified</option>
            </select>
          </div>
          <!-- Site Type -->
          <div class="form-field">
            <label for="siteType">Site Type:</label>
            <select v-model="formdataRent.siteType">
              <option value="Book">Book</option>
              <option value="ParkingYard">Parking Yard</option>
              <option value="Register">Register</option>
              <option value="SearchOnly">Search Only</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Booking Details Section -->
      <div class="form-section">
        <div class="heading">
          <h3 class="sub-heading">Booking Details </h3>
        </div>
        <!-- Booking Details -->
        <div class="form-group">
          <!-- Start Date -->
          <div class="form-field">
            <label for="startDate">Start Date:<span style="color: red;">*</span></label>
            <AtomDatePicker 
              :size="'is-small'"
              v-model="formdataBooking.startDate"
              required
              class="calendar"
              >
             </AtomDatePicker>
          </div>
          <!-- End Date -->
          <div class="form-field">
            <label for="endDate">End Date:<span style="color: red;">*</span></label>
            <AtomDatePicker
              v-model="formdataBooking.endDate" 
              required   
              :size="'is-small'"
              class="calendar"
            >
            </AtomDatePicker>
          </div>
          <!-- Last Call Date -->
          <div class="form-field">
            <label for="lastCallDate">Last Call Date:</label>
            <AtomDatePicker 
              class="calendar"
              :size="'is-small'"
              v-model="formdataBooking.lastCallDate"
              required
              >
              </AtomDatePicker>
          </div>
          <!-- Duration -->
          <div class="form-field">
             <label for="duration">Duration:</label>
                <textarea
                id="duration"
                maxlength="50"
                placeholder="Enter Duration(max 50 characters)"
                rows="1"
                v-model="formdataSO.duration"
                ></textarea>
          </div>
          <!-- Spot Request Status -->
          <div class="form-field">
            <label for="spotrequestStatus">Status:</label>
            <select v-model="formdataBooking.spotrequestStatus">
              <option value="Cancelled">Cancelled</option>
              <option value="Denied">Denied</option>
              <option value="Duplicate">Duplicate</option>
              <option value="NotSet">Not Set</option>
              <option value="Processing">Processing</option>
              <option value="Promoted">Promoted</option>
              <option value="Registered">Registered</option>
              <option value="RequestedModification">Requested Modification</option>
              <option value="Verified">Verified</option>
            </select>
          </div>
          <!-- Remark -->
          <div class="form-field">
            <label for="remark">Remark:</label>
              <textarea
               id="remark"
               maxlength="200"
               placeholder="Enter Remark(max 200 characters)"
               rows="2"
               v-model="formdataSO.remark"
              ></textarea>
          </div>
        </div>
      </div>
        <!-- END OF Details -->
      <!-- Update -->
      <div class="button-container">
        <button @click="handleSubmit" class="submit-btn">Update</button>
      </div>

    </div>
    <!-- END OF SCROLLABLE SECTION -->
  </div>
  <!-- End of root -->
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AtomDatePicker from '@/components/atoms/AtomDatePicker.vue';

export default {
  name: 'ReviewSpot',
    components: {
      AtomDatePicker,
    },
    computed: {
        ...mapState('reviewSpot', [
            'errorMessage',
            'formdataBooking',
            'formdataRent',
            'formdataSO',
            'hasError',
            'latitudeError',
            'longitudeError',
            'mobileError',
        ])
    },
    methods: {
        ...mapActions('reviewSpot', [
            'validateLatitude',
            'validateLongitude',
            'validateMobile'
        ]),
        handleSubmit() {
            this.submitForm();
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
    },
    watch: {
        hasError(error) {
            if (error) {
                this.alertError(this.errorMessage);
            }
        },
    },
};
</script>

<style>

.root {
  margin: 2% 8%;
  max-width: 100%;
}
.scrollable-sections {
  max-height: 600px;
  overflow-y: auto;
}
.sub-heading {
    color: var(--secondary-color);
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: normal;
    margin-bottom: 10px;
}
.form-section {
  border: 1px solid var(--parkspot-black);
  margin: 1% auto;
  padding: 1%;
}
.form-group {
  display: grid;
  gap: 3%;
  grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  padding-bottom: 2%;
}
.form-field {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0% 9%;
}
.form-field label {
  font-weight: 600;
  padding: 1%;
}
.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  background-color: var(--primary-color);
  border-color: var(--parkspot-black);
  border: none;
  outline: none;
}
.form-field input,
.form-field select,
.form-section textarea {
  margin-left: auto;
  padding: 5px;
  transition: border-color 0.1s ease, background-color 0.1s ease;
  width: 77%;
}
.noborder {
  background-color: var(--parkspot-white);
  border: none;
  font-weight: 600;
}
.button-group {
  display: flex;
  justify-content: end;
  margin-top: 15px;
}
.heading{
  align-items: center;
  display: flex;
  justify-content: center;
}
@keyframes shake {
  0% { transform: translate(30px, 0); }
  25% { transform: translate(-30px, 0); }
  50% { transform: translate(30px, 0); }
  75% { transform: translate(-30px, 0); }
  100% { transform: translate(0,0); }    
}
.error {
  animation: shake 0.5s;
}
.calendar{
  margin-left: auto;
  width: 70%;
}
.button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0px; 
}
@media (max-width: 768px) {
  .form-group {
    grid-template-columns: 1fr;
    gap: 1%;
    padding-bottom: 5%;
  }
  .scrollable-sections {
    overflow-y: auto;
    max-height: 100%;
  }
  .root {
    margin: 1% 1%;
  }
  .form-section {
    margin-bottom: 2%;
    margin: 1% 1%;
  }
  .form-field {
    font-size: 1rem;
    margin: 0% 0%;
  }
  .form-field input,
  .form-field select,
  .form-section textarea {
    margin-left: auto;
    transition: border-color 0.1s ease, background-color 0.1s ease;
    width: 80%;
  }
  .sub-heading {
    font-size: 1.4rem;
  }
}
@media (max-width: 450px) {
  .form-group {
    padding-bottom: 10%;
  }
  .form-field input,
  .form-field select,
  .form-section textarea {
    width: 70%;
  }
}
.submit-btn {
  background-color: var(--secondary-color);
  border-radius: 8px;
  border: none;
  color: var(--parkspot-white);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.9rem;
  transition: background-color 0.1s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: var(--primary-color);
  color: var(--parkspot-black);
  transform: translateY(-3px);
}

</style>
