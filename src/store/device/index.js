// state
const state = () => ({
      details: navigator.userAgent,
      regexp: /android|iphone|kindle|ipad/i,
});

// getters
const getters = {};

export default {
      namespaced: true,
      state,
      getters,
};
