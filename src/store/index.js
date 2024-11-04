import Vue from 'vue';
import Vuex from 'vuex';
import device from './device';
import blog from './blog';
import user from './user';
import map from './map';
import sdp from './sdp';
import config from './config';
import searchPortal from './searchPortal';
import bookingPortal from './bookingPortal';
import registerRequest from './registerRequest';
<<<<<<< HEAD
import reviewSpot from './reviewSpot';
=======
>>>>>>> b410616e1fe62115dbca1db6993dd803fdf04636

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        device,
        blog,
        user,
        map,
        sdp,
        searchPortal,
        bookingPortal,
        config,
        registerRequest,
<<<<<<< HEAD
        reviewSpot,
=======
>>>>>>> b410616e1fe62115dbca1db6993dd803fdf04636
    },
});

export default store;
