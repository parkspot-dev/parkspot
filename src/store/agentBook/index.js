import { mayaClient } from '@/services/api';
import { getParkingRequestStatus as parkingStatus} from '@/constant/enums';
const state = {
    formData: {
        Name: '',
        Mobile: '',
        Latitude: null,
        Longitude: null,
        City: '',
        Email: '',
        Car: '',
        Address: '',
        Remark: '',
        Duration: ''
    },
    durationError: '',
    mobileError: '',
    latitudeError: '',
    longitudeError: '',
    remarkError: '',
    hasError: false,
    errorMessage: '',
    //     Example:
    //     "Name":     "test2",
    //     "Mobile":   "8092996057",
    //     "Latitude":  11.1234567,
    //     "Longitude": 22.123456789,  
    //     "City":      "Varansai",
    //     "Email":     "sds@gmgail.com",
    //     "Car":       "string", 
    //     "Address":   "house 5",
    //     "Remark":    "Ish", 
    //     "Duration":  "2 hours"
    // 
};

const mutations = {
    'set-error'(state, { field, message }) {
        state[field] = message;
    },
    'set-global-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'reset-global-Error'(state){
        state.hasError = false;
        state.errorMessage = '';
    }
};

const actions = {
    validateDuration({ commit, state }) {
        if (state.formData.Duration.length > 50) {
            commit('set-error', { field: 'durationError', message: 'Duration should be less than 50 characters.' });
        } else {
            commit('set-error', { field: 'durationError', message: '' });
        }
    },
    validateLatitude({ commit, state }) {
        const latitudeValue = parseFloat(state.formData.Latitude);
        if (isNaN(latitudeValue)) {
            commit('set-error', { field: 'latitudeError', message: 'Latitude must be a valid float.' });
        } else {
            commit('set-error', { field: 'latitudeError', message: '' });
            state.formData.Latitude = latitudeValue;
        }
    },
    validateLongitude({ commit, state }) {
        const longitudeValue = parseFloat(state.formData.Longitude);
        if (isNaN(longitudeValue)) {
            commit('set-error', { field: 'longitudeError', message: 'Longitude must be a valid float.' });
        } else {
            commit('set-error', { field: 'longitudeError', message: '' });
            state.formData.Longitude = longitudeValue;
        }
    },
    validateMobile({ commit, state }) {
        const mobilePattern = /^\d{10}$/;
        if (!mobilePattern.test(state.formData.Mobile)) {
            commit('set-error', { field: 'mobileError', message: 'Mobile number must be exactly 10 digits.' });
        } else {
            commit('set-error', { field: 'mobileError', message: '' });
        }
    },
    validateRemark({ commit, state }) {
        if (state.formData.Remark.length > 200) {
            commit('set-error', { field: 'remarkError', message: 'Remark cannot exceed 200 characters.' });
        } else {
            commit('set-error', { field: 'remarkError', message: '' });
        }
    },
    async submitForm({ dispatch, commit, state }) {
      commit('reset-global-Error');

      await Promise.all([
        dispatch('validateDuration'),
        dispatch('validateLatitude'),
        dispatch('validateLongitude'),
        dispatch('validateMobile'),
        dispatch('validateRemark')
      ]);

      // Check if there are any errors
      if (state.mobileError    || 
          state.latitudeError  || 
          state.longitudeError || 
          state.durationError  || 
          state.remarkError) {
          commit('set-global-error', 'Please fix the errors in the form before submitting.');
          return;
        }

        const data= await mayaClient.get(`/internal/parking-requests?mobile=${state.formData.Mobile}`);
        let assignedRequest = false;
        let agentName = 'NA';

        for (let i = 0; i < data.length; i++) {
          if (data[i].Agent !== 'NA' && 
            [parkingStatus.RequestRegistered, 
             parkingStatus.RequestProcessing, 
             parkingStatus.RequestSpotSuggested].includes(data[i].status)) {
                assignedRequest = true;
                agentName = data[i].Agent;
                break;  // Exit the loop if condition is met
            }
        }
        if (assignedRequest === true ) {
            commit('set-global-error', `This mobile ID has already been assigned to ${agentName}`);
            return;
        } 
        else {
            const formDataWithAdRemark = {
            ...state.formData,
            Remark: `[AD] ${state.formData.Remark}` // Prepend [AD] in Remark
            };
            const resp = await mayaClient.post('/owner/parking-request', formDataWithAdRemark);
            commit('set-global-error', 'Your request was registered successfully');
            return resp.data;
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};