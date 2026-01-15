import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createStore } from "vuex";
import MapContainer from "@/components/extras/MapContainer.vue";
import mapboxgl from 'mapbox-gl';
import { flushPromises } from "@vue/test-utils";


vi.mock('mapbox-gl', () => {
    const mapMock = {
        on: vi.fn(),
        flyTo: vi.fn(),
    };

    const markerMock = {
        setLngLat: vi.fn().mockReturnThis(),
        setPopup: vi.fn().mockReturnThis(),
        addTo: vi.fn().mockReturnThis(),
        on: vi.fn(),
        remove: vi.fn(),
    };

    const popupMock = {
        setText: vi.fn().mockReturnThis(),
        setHTML: vi.fn().mockReturnThis(),
    };

    return {
        default: {
            Map: vi.fn(() => mapMock),
            Marker: vi.fn(() => markerMock),
            Popup: vi.fn(() => popupMock),
        },
    };
});


vi.mock('@/firebase', () => ({
    getValueFromFirebase: vi.fn(() => 
        Promise.resolve([{ token: 'fake-mapbox-token' }])
    ),
}));



describe('MapContainer.vue', () => {
    let wrapper;
    let store;


    beforeEach(async () => {
        store = createStore({
            modules: {
                map: {
                    namespaced: true,
                    state: () => ({
                        userCurrentLocation: [77.6, 12.9],
                        filteredSpots: [],
                    }),
                    getters: {
                        getMapConfig: () => ({
                            container: 'map',
                            style: 'mapbox://styles/mapbox/streets-v11',
                            center: [77.6, 12.9],
                            zoom: 11,
                        }),
                        getNewMapCenter: () => [77.6, 12.9],
                        getUserLocation: () => [77.9, 12.9],
                    },
                    mutations: {
                        'update-map-config': vi.fn(),
                        setFilteredSpots(state, spots){
                            state.filteredSpots = spots;
                        },
                    },
                    actions: {
                        updateUsersCurrentLocation: vi.fn(),
                        updateZoomValue: vi.fn(),
                    },
                },
            },
        });

        wrapper = mount(MapContainer, {
            global: {
                plugins: [store],
            },
            props: {
                drag: false,
                zoom: 11,
            },
        });

        await flushPromises();
        await wrapper.vm.$nextTick();
    });

    afterEach(() => {
        wrapper?.unmount();
        vi.clearAllMocks();
    });


    it('renders map container', () => {
        expect(wrapper.find('#map').exists()).toBe(true);
    });

    it('sets map access token from firebase', () => {
        expect(wrapper.vm.accessToken).toBe('fake-mapbox-token');
    });

    it('initializes mapbox map', () => {
        expect(mapboxgl.Map).toHaveBeenCalled();
    });

    it('calls updateMarkers when filteredSpots changes', async () => {
        const spy = vi.spyOn(wrapper.vm, 'updateMarkers');

        store.commit('map/setFilteredSpots', [
            {
                ID: '1',
                Name: 'Test Spot',
                Address: 'Test Address',
                Lat: 12.9,
                Long: 77.6,
                Rate: 100,
                Distance: 1,
            },
        ]);

        await wrapper.vm.$nextTick();

        expect(spy).toHaveBeenCalled();
    });


    it('recenterMap flies map and moves marker', () => {
        wrapper.vm.map = {flyTo: vi.fn()};
        wrapper.vm.marker = {setLngLat: vi.fn()};

        const center = [77.6, 12.9];
        wrapper.vm.recenterMap(center);

        expect(wrapper.vm.map.flyTo).toHaveBeenCalledWith({center});
        expect(wrapper.vm.marker.setLngLat).toHaveBeenCalledWith(center);
    });

    it('getPsPopup returns popup instance', () => {
        const popup = wrapper.vm.getPsPopup({
            ID: 'spot1',
            Name: 'Test',
            Address: 'Test Address',
            Lat: 12.9,
            Long: 77.6,
            SlotsAvailable: true,
            Distance: 1,
            Rate: 200,
        });

        expect(popup).toBeDefined();
    });
});
