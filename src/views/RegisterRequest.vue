<template>
    <div class="form-container">
        <h2>Vehicle Owner Registration</h2>
        <form @submit.prevent="handleSubmit">
            <!-- Name -->
            <div class="form-group">
                <label for="Name">Name:</label>
                <input id="Name" placeholder="Enter your name" type="text" v-model="formData.Name" />
            </div>

            <!-- Mobile (Compulsory) -->
            <div class="form-group">
                <label for="Mobile">Mobile: <span>*</span></label>
                <input id="Mobile" @input="validateMobile" maxlength="10" placeholder="Enter your mobile number"
                    required type="text" v-model="formData.Mobile" />
                <span class="error" v-if="mobileError">{{ mobileError }}</span>
            </div>

            <!-- Latitude (Compulsory) -->
            <div class="form-group">
                <label for="Latitude">Latitude: <span>*</span></label>
                <input id="Latitude" @input="validateLatitude" placeholder="Enter latitude" required step="any"
                    type="number" v-model="formData.Latitude" />
                <span class="error" v-if="latitudeError">{{ latitudeError }}</span>
            </div>

            <!-- Longitude (Compulsory) -->
            <div class="form-group">
                <label for="Longitude">Longitude: <span>*</span></label>
                <input id="Longitude" @input="validateLongitude" placeholder="Enter longitude" required step="any"
                    type="number" v-model="formData.Longitude" />
                <span class="error" v-if="longitudeError">{{ longitudeError }}</span>
            </div>

            <!-- City -->
            <div class="form-group">
                <label for="City">City:</label>
                <input id="City" placeholder="Enter city" type="text" v-model="formData.City" />
            </div>

            <!-- Email -->
            <div class="form-group">
                <label for="Email">Email:</label>
                <input id="Email" placeholder="Enter your email" type="email" v-model="formData.Email" />
            </div>

            <!-- Car -->
            <div class="form-group">
                <label for="Car">Car:</label>
                <input id="Car" placeholder="Enter car details" type="text" v-model="formData.Car" />
            </div>

            <!-- Address -->
            <div class="form-group">
                <label for="Address">Address:</label>
                <input id="Address" placeholder="Enter your address" type="text" v-model="formData.Address" />
            </div>

            <!-- Duration -->
            <div class="form-group">
                <label for="Duration">Duration:</label>
                <input id="Duration" @input="validateDuration" placeholder="Enter duration (e.g., '2 hours')"
                    type="text" v-model="formData.Duration" />
                <span class="error" v-if="durationError">{{ durationError }}</span>
            </div>

            <!-- Remark -->
            <div class="form-group">
                <label for="Remark">Remark:</label>
                <textarea id="Remark" @input="validateRemark" placeholder="Enter remark"
                    v-model="formData.Remark"></textarea>
                <span v-if="remarkError" class="error">{{ remarkError }}</span>
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
        ...mapState('registerRequest', [
            'durationError',
            'errorMessage',
            'formData',
            'hasError',
            'latitudeError',
            'longitudeError',
            'mobileError',
            'remarkError'
        ])
    },
    methods: {
        ...mapActions('registerRequest', [
            'submitForm',
            'validateDuration',
            'validateLatitude',
            'validateLongitude',
            'validateMobile',
            'validateRemark'
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

<style scoped>

.form-container {
    box-shadow: 0 4px 10px var(--bg-color-tertiary);
    margin: 50px auto;
    max-width: 500px;
    padding: 2.5rem;
}

.form-group {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}

.form-group label {
    color: var(--secondary-color);
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
    background-color: var(--parkspot-white);
    border-radius: var(--border-default);
    border: 2px solid var(--grey-shade);
    color: var(--parkspot-black);
    font-size: 1rem;
    padding: 0.9rem 1rem;
    transition: border-color 0.3s ease, background-color 0.3s ease;
    width: 100%;
}

.form-group input:focus,
.form-group textarea:focus {
    background-color: var(--parkspot-white);
    border-color: var(--secondary-color);
    outline: none;
}

.form-group span {
    color: #c72828;
    font-size: var(--sp-size-sm);
}

.form-group textarea {
    min-height: 100px;
}

h2 {
    color: var(--secondary-color);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
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
    width: 100%;
}

.submit-btn:hover {
    background-color: var(--parkspot-black);
    transform: translateY(-2px);
}

</style>