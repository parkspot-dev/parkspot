import { getValueFromFirebase } from '../../firebase';

const state = {
    helplineNumber: '+91 74882 39471',
    helplineRef: 'tel:+91 74882 39471',
};

const mutations = {
    'update-helpline-number'(state, helplineNumber) {
        state.helplineNumber = helplineNumber;
        state.helplineRef = 'tel:' + helplineNumber;
    },
};

const actions = {
    async getHelplineNumber({ commit }) {
        // SSR safeguard: `getValueFromFirebase` is a no-op on the server (the
        // Firebase Web SDK requires `window`/`indexedDB`). Skipping the
        // commit there keeps the seeded default visible in the prerendered
        // HTML — the client will refresh it on hydration.
        const value = await getValueFromFirebase('helpline-number');
        if (value != null) {
            commit('update-helpline-number', value);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
