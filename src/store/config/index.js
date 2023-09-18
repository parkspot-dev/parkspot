import { getValueFromFirebase } from '../../firebase';

const state = {
    helplineNumber: '+91 74882 39471',
    helplineRef: 'tel:' + helplineNumber,
};

const mutations = {
    'update-helpline-number'(state, helplineNumber) {
        state.helplineNumber = helplineNumber;
        state.helplineRef = 'tel:' + helplineNumber;
    },
};

const actions = {
    async getHelplineNumber({ commit }) {
        commit(
            'update-helpline-number',
            await getValueFromFirebase('helpline-number'),
        );
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
