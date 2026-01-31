import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import spot from '@/store/sdp/index.js';
import { mayaClient } from '@/services/api';
import { getPaymentAppTypeLabel } from '@/constant/enums';
import ImageUploadService from '@/services/ImageUploadService';

vi.mock('@/services/api', () => ({
    mayaClient: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock('@/constant/enums', () => ({
    getPaymentAppTypeLabel: vi.fn(),
}));

vi.mock('@/services/ImageUploadService', () => ({
    default: {
        uploadImages: vi.fn(),
    },
}));

describe('Vuex - spot module', () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();

        store = createStore({
            modules: {
                spot: {
                    ...spot,
                    state: { ...spot.state },
                },
            },
        });
    });

    afterEach(() => {
        store = null;
    });

    describe('mutations', () => {
        it('update-spot-details', () => {
            const data = { SiteID: 'S1' };
            store.commit('spot/update-spot-details', data);
            expect(store.state.spot.spotDetails).toEqual(data);
        });

        it('update-is-available sets boolean based on number', () => {
            store.commit('spot/update-is-available', 2);
            expect(store.state.spot.isAvailable).toBe(true);
            store.commit('spot/update-is-available', 0);
            expect(store.state.spot.isAvailable).toBe(false);
        });

        it('update-image maps ImageURL correctly', () => {
            store.commit('spot/update-image', [
                { ImageURL: 'img1.jpg' },
                { ImageURL: 'img2.jpg' },
            ]);
            expect(store.state.spot.images).toEqual(['img1.jpg', 'img2.jpg']);
        });
    });

    describe('actions', () => {
        it('getSpotDetails commits correct data and maps SlotsAvailable to boolean', async () => {
            const apiResponse = {
                Site: {
                    SiteID: 'SITE_1',
                    Name: 'Test Spot',
                    Address: 'Bangalore',
                    Lat: 12,
                    Long: 77,
                    Rate: 50,
                    SlotsAvailable: 0,
                    SiteImages: [{ ImageURL: 'a.jpg' }],
                    SiteImageURI: 'thumb.jpg',
                },
                User: { Name: 'Owner' },
                Bookings: [{ id: 1 }],
                Account: {
                    UpiID: 'test@upi',
                    PaymentApp: 'GPAY',
                },
            };

            mayaClient.get.mockResolvedValue(apiResponse);
            getPaymentAppTypeLabel.mockReturnValue('Google Pay');

            await store.dispatch('spot/getSpotDetails', { spotId: 'SITE_1' });

            expect(store.state.spot.spotDetails.SiteID).toBe('SITE_1');
            expect(store.state.spot.ownerInfoDetails).toEqual(apiResponse.User);
            expect(store.state.spot.spotInProgressBookings).toEqual(
                apiResponse.Bookings,
            );
            expect(store.state.spot.paymentDetails).toBe('test@upi/Google Pay');
            expect(store.state.spot.isAvailable).toBe(false);
            expect(store.state.spot.images).toEqual(['a.jpg']);
            expect(store.state.spot.thumbnail).toEqual(['thumb.jpg']);
            expect(store.state.spot.title).toBe('Test Spot');
            expect(store.state.spot.loading).toBe(false);
            expect(store.state.spot.selectedSpot[0].SlotsAvailable).toBe(false);
        });

        it('setPaymentDetails with bank account', async () => {
            await store.dispatch('spot/setPaymentDetails', {
                account_number: '123',
                ifsc_code: 'IFSC001',
            });
            expect(store.state.spot.paymentDetails).toBe('123/IFSC001');
        });

        it('updateAvailability posts updated site with correct payload', async () => {
            store.state.spot.spotDetails = { SlotsAvailable: 0 };

            await store.dispatch('spot/updateAvailability', 5);

            expect(store.state.spot.spotDetails.SlotsAvailable).toBe(5);
            expect(store.state.spot.spotDetails.LastCallDate).toEqual(
                expect.any(String),
            );
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/update-site',
                store.state.spot.spotDetails,
            );
        });

        it('updateImages uploads images and posts updated site', async () => {
            store.state.spot.spotDetails = {
                SiteID: 'SITE_1',
                SiteImages: [],
            };

            const uploadedImages = [
                { ImageURL: 'img1.jpg' },
                { ImageURL: 'img2.jpg' },
            ];

            ImageUploadService.uploadImages.mockResolvedValue(uploadedImages);

            const newImages = [{ file: {} }, { file: {} }];

            await store.dispatch('spot/updateImages', newImages);

            expect(ImageUploadService.uploadImages).toHaveBeenCalledWith(
                newImages,
                'SITE_1',
            );

            expect(store.state.spot.spotDetails.SiteImages).toEqual(
                uploadedImages,
            );
            expect(store.state.spot.spotDetails.LastCallDate).toEqual(
                expect.any(String),
            );

            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/update-site',
                store.state.spot.spotDetails,
            );
        });

        it('updateLastCallDate posts updated site with correct payload', async () => {
            store.state.spot.spotDetails = {};

            await store.dispatch('spot/updateLastCallDate', '2024-01-01');

            expect(store.state.spot.spotDetails.LastCallDate).toBe(
                '2024-01-01',
            );
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/update-site',
                store.state.spot.spotDetails,
            );
        });

        it('updateRemark posts updated site with remark and date', async () => {
            store.state.spot.spotDetails = {};

            await store.dispatch('spot/updateRemark', 'Called owner');

            expect(store.state.spot.spotDetails.Remark).toBe('Called owner');
            expect(store.state.spot.spotDetails.LastCallDate).toEqual(
                expect.any(String),
            );
            expect(mayaClient.post).toHaveBeenCalledWith(
                '/owner/update-site',
                store.state.spot.spotDetails,
            );
        });
    });
});
