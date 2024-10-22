<template>
    <div class="form-container">
      <h2>Registration Form</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="form-group left-align">
          <label for="name">Name:</label>
          <input v-model="formData.name" type="text" id="name" placeholder="Enter your name" />
        </div>
  
        <!-- Mobile (Compulsory) -->
        <div class="form-group left-align">
          <label for="mobile">Mobile: <span>*</span></label>
          <input
            type="text"
            v-model="formData.mobile"
            id="mobile"
            placeholder="Enter your mobile number"
            maxlength="10"
            @input="validateMobile"
            required
          />
          <span v-if="mobileError" class="error">{{ mobileError }}</span>
        </div>
  
        <!-- Latitude (Compulsory) -->
        <div class="form-group left-align">
          <label for="latitude">Latitude: <span>*</span></label>
          <input
            v-model="formData.latitude"
            type="number"
            step="any"
            id="latitude"
            placeholder="Enter latitude"
            @input="validateLatitude"
            required
          />
          <span v-if="latitudeError" class="error">{{ latitudeError }}</span>
        </div>
  
        <!-- Longitude (Compulsory) -->
        <div class="form-group left-align">
          <label for="longitude">Longitude: <span>*</span></label>
          <input
            v-model="formData.longitude"
            type="number"
            step="any"
            id="longitude"
            placeholder="Enter longitude"
            @input="validateLongitude"
            required
          />
          <span v-if="longitudeError" class="error">{{ longitudeError }}</span>
        </div>
  
        <!-- City -->
        <div class="form-group left-align">
          <label for="city">City:</label>
          <input v-model="formData.city" type="text" id="city" placeholder="Enter city" />
        </div>
  
        <!-- Email -->
        <div class="form-group left-align">
          <label for="email">Email:</label>
          <input v-model="formData.email" type="email" id="email" placeholder="Enter your email" />
        </div>
  
        <!-- Car -->
        <div class="form-group left-align">
          <label for="car">Car:</label>
          <input v-model="formData.car" type="text" id="car" placeholder="Enter car details" />
        </div>
  
        <!-- Address -->
        <div class="form-group left-align">
          <label for="address">Address:</label>
          <input v-model="formData.address" type="text" id="address" placeholder="Enter your address" />
        </div>
  
        <!-- Duration -->
        <div class="form-group left-align">
          <label for="duration">Duration:</label>
          <input
            v-model="formData.duration"
            type="text"
            id="duration"
            placeholder="Enter duration (e.g., '2 hours')"
            @input="validateDuration"
            required
          />
          <span v-if="durationError" class="error">{{ durationError }}</span>
        </div>
  
        <!-- Remark -->
        <div class="form-group left-align">
          <label for="remark">Remark:</label>
          <textarea v-model="formData.remark" id="remark" placeholder="Enter remark" @input="validateRemark" required></textarea>
          <span v-if="remarkError" class="error">{{ remarkError }}</span>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          name: '',
          mobile: '',
          latitude: '',
          longitude: '',
          email: '',
          car: '',
          address: '',
          remark: '',
          duration: ''
        },
        mobileError: '', // Error message for invalid mobile input
        latitudeError: '', // Error message for invalid latitude
        longitudeError: '', // Error message for invalid longitude
        remarkError: '', // Error message for invalid remark
        durationError: '' // Error message for invalid duration
      };
    },
    methods: {
      validateMobile() {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(this.formData.mobile)) {
          this.mobileError = "Mobile number must be exactly 10 digits.";
        } else {
          this.mobileError = "";
        }
      },
      validateRemark() {
        const remark = this.formData.remark;
        if (remark.length > 200) {
          this.remarkError = 'Remark cannot exceed 200 characters.';
        } else {
          this.remarkError = '';
        }
      },
      validateDuration() {
        const duration = this.formData.duration;
        if (duration.length > 50) {
          this.durationError = "Duration should be less than 50 characters.";
        } else {
          this.durationError = "";
        }
      },
      validateLatitude() {
        const latitudeValue = parseFloat(this.formData.latitude);
        if (isNaN(latitudeValue)) {
          this.latitudeError = "Latitude must be a valid float.";
        } else {
          this.latitudeError = "";
        }
      },
      validateLongitude() {
        const longitudeValue = parseFloat(this.formData.longitude);
        if (isNaN(longitudeValue)) {
          this.longitudeError = "Longitude must be a valid float.";
        } else {
          this.longitudeError = "";
        }
      },
      handleSubmit() {
        // Perform all validation checks
        this.validateMobile();
        this.validateLatitude();
        this.validateLongitude();
        this.validateRemark();
        this.validateDuration();
        // Ensure no errors before submission
        if (this.mobileError || this.latitudeError || this.longitudeError || this.durationError || this.remarkError) {
        // console.log('Form Not Submitted:', this.formData);
          return;
        }
        // console.log('Form Submitted:', this.formData);
      }
    }
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
    align-items: flex-start; /* Align items to the left */
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
    width: 100%; /* Full width inputs for better UX */
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
  