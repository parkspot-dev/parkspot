import { mayaClient } from '@/services/api';
import { getParkingRequestStatusLabel } from '@/constant/enums';
const state = {
    formData: {
        Name: '',
        Mobile: '',
        Latitude: '',
        Longitude: '',
        City: '',
        Email: '',
        Car: '',
        Address: '',
        Remark: '',
        Duration: ''
    },
    // Example data structure:
    // {
    //     "Name":      "test2",
    //     "Mobile":    "8092996057",
    //     "Latitude":  11.1234567,
    //     "Longitude": 22.123456789,  
    //     "City":      "Varansai",
    //     "Email": "sds@gmgail.com",
    //     "Car":  "string", 
    //     "Address":  "house 5",
    //     "Remark": "Ish", // Remark should return with a [AD]+Remark
    //     "Duration":  "string"
    // }
    MobileError: '',
    LatitudeError: '',
    LongitudeError: '',
    RemarkError: '',
    DurationError: '',
    hasError: false,
    errorMessage: '',
};

const mutations = {
    'update-form-data'(state, formData) {
        state.formData = { ...state.formData, ...formData };
        state.hasError = false;
    },
    'set-error'(state, { field, message }) {
        state[field] = message;
    },
    'set-global-error'(state, errorMessage) {
        state.errorMessage = errorMessage;
        state.hasError = true;
    },
    'reset-hasError'(state){
      state.hasError=false;
    }
};

const actions = {
    validateMobile({ commit, state }) {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(state.formData.Mobile)) {
            commit('set-error', { field: 'MobileError', message: 'Mobile number must be exactly 10 digits.' });
        } else {
            commit('set-error', { field: 'MobileError', message: '' });
        }
    },
    validateLatitude({ commit, state }) {
        const latitudeValue = parseFloat(state.formData.Latitude);
        if (isNaN(latitudeValue)) {
            commit('set-error', { field: 'LatitudeError', message: 'Latitude must be a valid float.' });
        } else {
            commit('set-error', { field: 'LatitudeError', message: '' });
        }
    },
    validateLongitude({ commit, state }) {
        const longitudeValue = parseFloat(state.formData.Longitude);
        if (isNaN(longitudeValue)) {
            commit('set-error', { field: 'LongitudeError', message: 'Longitude must be a valid float.' });
        } else {
            commit('set-error', { field: 'LongitudeError', message: '' });
        }
    },
    validateDuration({ commit, state }) {
        if (state.formData.Duration.length > 50) {
            commit('set-error', { field: 'DurationError', message: 'Duration should be less than 50 characters.' });
        } else {
            commit('set-error', { field: 'DurationError', message: '' });
        }
    },
    validateRemark({ commit, state }) {
        if (state.formData.Remark.length > 200) {
            commit('set-error', { field: 'RemarkError', message: 'Remark cannot exceed 200 characters.' });
        } else {
            commit('set-error', { field: 'RemarkError', message: '' });
        }
    },
    async submitForm({ dispatch, commit, state }) {
      commit('reset-hasError');
      
      dispatch('validateMobile');
      dispatch('validateLatitude');
      dispatch('validateLongitude');
      dispatch('validateDuration');
      dispatch('validateRemark');

      // Check if there are any errors
      if (state.MobileError || state.LatitudeError || state.LongitudeError || state.DurationError || state.RemarkError) {
          commit('set-global-error', 'Please fix the errors in the form before submitting.');
          return;
         }
      
        try {
            const data= await mayaClient.get(`/internal/parking-requests?mobile=${state.formData.Mobile}`);

            let assignedRequest = false;
            let agentName = "NA";

            for (let i = 0; i < data.length; i++) {
              if (data[i].Agent !== 'NA' && [getParkingRequestStatusLabel.RequestRegistered, getParkingRequestStatusLabel.RequestProcessing, getParkingRequestStatusLabel.RequestSpotSuggested].includes(data[i].status)) {
                  assignedRequest = true;
                  agentName = data[i].Agent;
                  break;  // Exit the loop if condition is met
              }
          }

            if (assignedRequest === true ) {
                commit('set-global-error', `This mobile ID has already been assigned to ${agentName}`);
            } else {
                const formDataWithAdRemark = {
                ...state.formData,
                Remark: `[AD] ${state.formData.Remark}` // Prepend [AD] in Remark
                };
                const resp = await mayaClient.post('/owner/parking-request', formDataWithAdRemark);
                commit('set-global-error', 'Your request has been registered successfully');
                return resp.data;
            }
        } 
        catch (error) {
            commit('set-global-error', 'An error occurred while submitting the form.');
        }
        
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
