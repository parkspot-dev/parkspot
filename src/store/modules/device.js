import flavour from '../../api/flavour'

// state
const state = () => ({
    details: navigator.userAgent,
    regexp: /android|iphone|kindle|ipad/i,
})


// getters
const getters = {
    getFlavour: (state) => {
        return flavour.getDevice(state.details, state.regexp)
    }
}


export default {
    namespaced: true,
    state,
    getters,
}