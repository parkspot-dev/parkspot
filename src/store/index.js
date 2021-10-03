import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // !this is just for testing purpose
    state: {
        count: 10
    }
})

export default store