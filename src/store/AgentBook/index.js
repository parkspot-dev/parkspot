import { mayaClient } from '@/services/api';

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
  errors: {
    Mobile: '',
    Latitude: '',
    Longitude: '',
    Remark: '',
    Duration: ''
  },
  hasError: false,
  errorMessage: '',
  isLoading: false,
};

const getters = {
  getFormData: (state) => state.formData,
  getErrors: (state) => state.errors,
  hasError: (state) => state.hasError,
  errorMessage: (state) => state.errorMessage,
  isLoading: (state) => state.isLoading,
};

const mutations = {
  'update-form-data'(state, formData) {
    state.formData = { ...state.formData, ...formData };
    state.hasError = false;
  },

  'set-error'(state, { field, message }) {
    state.errors[field] = message;
    state.hasError = true;
  },

  'reset-errors'(state) {
    state.errors = {
      Mobile: '',
      Latitude: '',
      Longitude: '',
      Remark: '',
      Duration: ''
    };
    state.hasError = false;
    state.errorMessage = '';
  },

  'set-loading'(state, isLoading) {
    state.isLoading = isLoading;
  },

  'set-global-error'(state, errorMessage) {
    state.errorMessage = errorMessage;
    state.hasError = true;
  }
};

const actions = {
  validateMobile({ commit, state }) {
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(state.formData.Mobile)) {
      commit('set-error', { field: 'Mobile', message: 'Mobile number must be exactly 10 digits.' });
    } else {
      commit('set-error', { field: 'Mobile', message: '' });
    }
  },

  validateLatitude({ commit, state }) {
    const latitudeValue = parseFloat(state.formData.Latitude);
    if (isNaN(latitudeValue)) {
      commit('set-error', { field: 'Latitude', message: 'Latitude must be a valid float.' });
    } else {
      commit('set-error', { field: 'Latitude', message: '' });
    }
  },

  validateLongitude({ commit, state }) {
    const longitudeValue = parseFloat(state.formData.Longitude);
    if (isNaN(longitudeValue)) {
      commit('set-error', { field: 'Longitude', message: 'Longitude must be a valid float.' });
    } else {
      commit('set-error', { field: 'Longitude', message: '' });
    }
  },

  validateDuration({ commit, state }) {
    const duration = state.formData.Duration;
    if (duration.length > 50) {
      commit('set-error', { field: 'Duration', message: 'Duration should be less than 50 characters.' });
    } else {
      commit('set-error', { field: 'Duration', message: '' });
    }
  },

  validateRemark({ commit, state }) {
    const remark = state.formData.Remark;
    if (remark.length > 200) {
      commit('set-error', { field: 'Remark', message: 'Remark cannot exceed 200 characters.' });
    } else {
      commit('set-error', { field: 'Remark', message: '' });
    }
  },

  async submitForm({ dispatch, commit, state }) {
    commit('set-loading', true);
    commit('reset-errors');

    // Validate all fields
    await Promise.all([
      dispatch('validateMobile'),
      dispatch('validateLatitude'),
      dispatch('validateLongitude'),
      dispatch('validateDuration'),
      dispatch('validateRemark')
    ]);

    // Check if any error exists after validation
    if (state.hasError) {
      commit('set-loading', false);
      return;
    }

    try {
      const response = await mayaClient.get(`/internal/parking-requests?mobile=${state.formData.Mobile}`);
      const data = response.data;
      const assignedRequest = data.find(req => req.Agent !== 'NA' && [1, 2, 3].includes(req.status));
      
      if (assignedRequest) {
        const agentName = assignedRequest.Agent;
        commit('set-global-error', `An agent (${agentName}) has already been assigned to this mobile number.`);
        alert(`This mobile ID has already been assigned to ${agentName}`);
      } else {
        const originalRemark = state.formData.Remark;
        state.formData.Remark = `[Ad] ${originalRemark}`;
        const resp = await mayaClient.post('/owner/parking-request', state.formData);
        console.log('Form submitted successfully:', resp.data);
        return resp.data;
      }
    } catch (error) {
      commit('set-global-error', 'An error occurred while submitting the form.');
    } finally {
      commit('set-loading', false);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};