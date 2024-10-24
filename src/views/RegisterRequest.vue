<template>
  <div class="form-container">
    <h2>Registration Form</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="form-group left-align">
        <label for="Name">Name:</label>
        <input v-model="formData.Name" type="text" id="Name" placeholder="Enter your name" />
      </div>

      <!-- Mobile (Compulsory) -->
      <div class="form-group left-align">
        <label for="Mobile">Mobile: <span>*</span></label>
        <input
          type="text"
          v-model="formData.Mobile"
          id="Mobile"
          placeholder="Enter your mobile number"
          maxlength="10"
          @input="validateMobile"
          required
        />
        <span v-if="MobileError" class="error">{{ MobileError }}</span>
      </div>

      <!-- Latitude (Compulsory) -->
      <div class="form-group left-align">
        <label for="Latitude">Latitude: <span>*</span></label>
        <input
          v-model="formData.Latitude"
          type="number"
          step="any"
          id="Latitude"
          placeholder="Enter latitude"
          @input="validateLatitude"
          required
        />
        <span v-if="LatitudeError" class="error">{{ LatitudeError }}</span>
      </div>

      <!-- Longitude (Compulsory) -->
      <div class="form-group left-align">
        <label for="Longitude">Longitude: <span>*</span></label>
        <input
          v-model="formData.Longitude"
          type="number"
          step="any"
          id="Longitude"
          placeholder="Enter longitude"
          @input="validateLongitude"
          required
        />
        <span v-if="LongitudeError" class="error">{{ LongitudeError }}</span>
      </div>

      <!-- City -->
      <div class="form-group left-align">
        <label for="City">City:</label>
        <input v-model="formData.City" type="text" id="City" placeholder="Enter city" />
      </div>

      <!-- Email -->
      <div class="form-group left-align">
        <label for="Email">Email:</label>
        <input v-model="formData.Email" type="email" id="Email" placeholder="Enter your email" />
      </div>

      <!-- Car -->
      <div class="form-group left-align">
        <label for="Car">Car:</label>
        <input v-model="formData.Car" type="text" id="Car" placeholder="Enter car details" />
      </div>

      <!-- Address -->
      <div class="form-group left-align">
        <label for="Address">Address:</label>
        <input v-model="formData.Address" type="text" id="Address" placeholder="Enter your address" />
      </div>

      <!-- Duration -->
      <div class="form-group left-align">
        <label for="Duration">Duration:</label>
        <input
          v-model="formData.Duration"
          type="text"
          id="Duration"
          placeholder="Enter duration (e.g., '2 hours')"
          @input="validateDuration"
        />
        <span v-if="DurationError" class="error">{{ DurationError }}</span>
      </div>

      <!-- Remark -->
      <div class="form-group left-align">
        <label for="Remark">Remark:</label>
        <textarea v-model="formData.Remark" id="Remark" placeholder="Enter remark" @input="validateRemark"></textarea>
        <span v-if="RemarkError" class="error">{{ RemarkError }}</span>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn">Submit</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'RegisterRequest',
  computed: {
    ...mapState('agentBook', [
      'formData',
      'MobileError',
      'LatitudeError',
      'LongitudeError',
      'RemarkError',
      'DurationError',
      'hasError',
      'errorMessage'
    ])
  },
  methods: {
    ...mapActions('agentBook', [
      'validateMobile',
      'validateLatitude',
      'validateLongitude',
      'validateDuration',
      'validateRemark',
      'submitForm'
    ]),
    handleSubmit() {
      this.submitForm();
    },
    alertError(msg) {
            this.$buefy.dialog.alert({
                title: 'Error',
                message: msg,
                type: 'is-danger',
                hasIcon: true,
                icon: 'alert-circle',
                ariaRole: 'alertdialog',
                ariaModal: true,
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

<style scoped>
.form-container {
  background-color: #f9f9f9;
  padding: 2.5rem;
  color: #333; 
  border-radius: 15px;
  max-width: 500px;
  margin: 50px auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #0085ad; 
  font-size: 2rem; 
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group.left-align {
  align-items: flex-start; 
}

.form-group label {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #0085ad; 
}

.form-group input,
.form-group textarea {
  padding: 0.9rem 1rem;
  border: 2px solid #ddd; 
  border-radius: 8px;
  background-color: #fff; 
  color: #333; 
  font-size: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  width: 100%; 
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #0085ad; 
  background-color: #eaf8fb; 
  outline: none; 
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group span {
  color: #ff4d4d; 
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background-color: #0085ad; 
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #007099; 
  transform: translateY(-2px); 
}

.submit-btn:active {
  transform: translateY(0); 
}

.submit-btn:disabled {
  background-color: gray; 
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .form-container {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  .form-group label {
    font-size: 1rem;
  }

  .submit-btn {
    font-size: 1.1rem;
  }
}
</style>