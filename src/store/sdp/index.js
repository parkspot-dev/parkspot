import { mayaClient } from '@/services/api';
import { getPaymentAppTypeLabel } from '@/constant/enums';
import ImageUploadService from '@/services/ImageUploadService';

const UPDATE_SITE_ENDPOINT = '/owner/update-site';
const state = {
    center: null,
    images: [],
    isAvailable: false,
    loading: true,
    ownerInfoDetails: null,
    paymentDetails: '',
    selectedSpot: [],
    spotInProgressBookings: [],
    spotDetails: null,
    thumbnail: [],
    title: '',
};

const getters = {};

const mutations = {
    'update-spot-details'(state, spotDetails) {
        state.spotDetails = spotDetails;
    },

    'update-owner-info-details'(state, ownerInfoDetails) {
        state.ownerInfoDetails = ownerInfoDetails;
    },

    'update-selected-spot'(state, spot) {
        state.selectedSpot = [];
        state.selectedSpot = [...state.selectedSpot, spot];
    },

    'update-is-available'(state, available) {
        if (available > 0) {
            state.isAvailable = true;
        } else {
            state.isAvailable = false;
        }
    },

    'update-loading'(state, loading) {
        state.loading = loading;
    },

    'update-image'(state, images) {
        state.images = images;
    },

    'update-thumbnail-image'(state, image) {
        state.thumbnail = [];
        state.thumbnail = [image];
    },

    'update-title'(state, title) {
        state.title = title;
    },

    'update-map-center'(state, center) {
        state.center = center;
    },

    'update-payment-info'(state, paymentDetails) {
        state.paymentDetails = paymentDetails;
    },
    'set-in-progress-bookings'(state, bookings) {
        state.spotInProgressBookings = bookings;
    },
    'set-site-images-and-last-call'(state, { images, lastCallDate }) {
        const mappedImages = images.map((url, index) => ({
            SiteImageID: `${state.spotDetails.SiteID}#${index + 1}`,
            ImageURL: url,
            SiteID: state.spotDetails.SiteID,
        }));

        state.spotDetails.SiteImages = mappedImages;
        state.images = mappedImages;
        state.spotDetails.LastCallDate = lastCallDate;
    },

    'set-availability'(state, availableCount) {
        state.spotDetails.SlotsAvailable = availableCount;
        state.spotDetails.LastCallDate = new Date().toISOString();
    },
    'set-remark'(state, remark) {
        state.spotDetails.Remark = remark;
        state.spotDetails.LastCallDate = new Date().toISOString();
    },
};

const actions = {
    async getSpotDetails({ commit, dispatch }, { spotId }) {
        commit('update-loading', true);
        const res = await mayaClient.get(`/site?site-id=${spotId}`);
        if (res.Site) {
            commit('update-spot-details', res.Site);
            commit('update-owner-info-details', res.User);
            commit('set-in-progress-bookings', res.Bookings);
            await dispatch('setPaymentDetails', res.Account);

            const spot = {
                ID: res.Site.SiteID,
                Name: res.Site.Name,
                Address: res.Site.Address,
                Lat: res.Site.Lat,
                Long: res.Site.Long,
                Rate: res.Site.Rate,
                Distance: 0, // res.Site.Distance
                SlotsAvailable: res.Site.SlotsAvailable > 0 ? true : false,
            };
            commit('update-map-center', [spot.Long, spot.Lat]);
            commit('update-selected-spot', spot);
            commit('update-is-available', res.Site['SlotsAvailable']);
            commit('update-loading', false);
            commit('update-image', res.Site['SiteImages']);
            commit('update-thumbnail-image', res.Site['SiteImageURI']);
            commit('update-title', res.Site['Name']);
        } else {
            throw res.DisplayMsg;
        }
    },

    // function to handle account Details extraction and commit
    async setPaymentDetails({ commit }, accountDetails) {
        if (!accountDetails) return;
        let paymentdetails = '';
        const paymentApp = getPaymentAppTypeLabel(accountDetails.PaymentApp);
        if (accountDetails.account_number && accountDetails.ifsc_code) {
            paymentdetails = `${accountDetails.account_number}/${accountDetails.ifsc_code}`;
        } else if (accountDetails.UpiID) {
            paymentdetails = `${accountDetails.UpiID}/${paymentApp}`;
        } else if (accountDetails.Mobile) {
            paymentdetails = `${accountDetails.Mobile}/${paymentApp}`;
        }

        commit('update-payment-info', paymentdetails);
    },

    async updateAvailability({ state, commit }, availableCount) {
        commit('set-availability', availableCount);
        await mayaClient.post(UPDATE_SITE_ENDPOINT, state.spotDetails);
    },

    async updateImages({ state, commit }, newImages) {
    const existingImageUrls = Array.isArray(state.spotDetails.SiteImages)
        ? [...state.spotDetails.SiteImages]
        : [];


    const filesToUpload = newImages
        .filter(img => img.file)
        .map(img => img.file);

    let uploadedUrls = [];

    if (filesToUpload.length > 0) {
        const uploadResponse = await ImageUploadService.uploadImages(
            filesToUpload,
            state.spotDetails.SiteID
        );
           console.log("update" , uploadResponse);
        if (
            uploadResponse?.success &&
            Array.isArray(uploadResponse.urls)
        ) {
            uploadedUrls = uploadResponse.urls;
        }
    }


    const allImageUrls = [...existingImageUrls, ...uploadedUrls];
  console.log("all image" , allImageUrls);
    commit('set-site-images-and-last-call', {
        images: allImageUrls,
        lastCallDate: new Date().toISOString(),
    });

   
    await mayaClient.post(UPDATE_SITE_ENDPOINT, {
        ...state.spotDetails,
        SiteImages: allImageUrls,
    });
},


    async updateLastCallDate({ state, commit }, lastCallDate) {
        commit('set-site-images-and-last-call', {
            images: state.spotDetails.SiteImages,
            lastCallDate,
        });
        await mayaClient.post(UPDATE_SITE_ENDPOINT, state.spotDetails);
    },

    async updateRemark({ state, commit }, remark) {
        commit('set-site-images-and-last-call', {
            images: state.spotDetails.SiteImages,
            lastCallDate: new Date().toISOString(),
        });
        commit('set-remark', remark);
        await mayaClient.post(UPDATE_SITE_ENDPOINT, state.spotDetails);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
