import device from './device'; 
import blog from './blog';
import user from './user';
import map from './map';
import sdp from './sdp';
import config from './config';
import searchPortal from './searchPortal';
import bookingPortal from './bookingPortal';
import registerRequest from './registerRequest';
import spotRequests from './spotRequests';
import reviewSpot from './reviewSpot';
import kycStatusPortal from './kycStatusPortal'
import { createStore } from 'vuex';

const store = createStore({
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
        spotRequests,
        reviewSpot,
        kycStatusPortal
    },
});


export default store;
