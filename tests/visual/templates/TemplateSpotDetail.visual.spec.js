// Hand-crafted visual regression spec for the spot-detail template.
// Pre-seeds the sdp Vuex module with a deterministic spot record so
// the rendered view is stable across runs.

import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import TemplateSpotDetail from '@/components/templates/TemplateSpotDetail.vue';
import { renderOptions, tick } from '../test-helpers.js';

const SAMPLE_SPOT = {
    ID: 'BLR#REQ#806',
    Name: 'Parking #806',
    Address: '12 MG Road',
    Area: 'Marathahalli',
    City: 'Bengaluru',
    Pincode: '560037',
    Rate: 3200,
    Images: ['/assets/sample-spot-1.jpg', '/assets/sample-spot-2.jpg'],
    Facilities: [
        { FacilityID: 'cctv',  Name: 'CCTV',          IconURL: 'videocam' },
        { FacilityID: '24x7',  Name: '24/7 Access',   IconURL: 'schedule' },
        { FacilityID: 'cover', Name: 'Covered',       IconURL: 'umbrella' },
    ],
    Description: 'Secure covered parking near the metro station.',
};

function spotStoreState(overrides = {}) {
    return {
        sdp: {
            state: {
                loading: false,
                spotDetails: SAMPLE_SPOT,
                title: SAMPLE_SPOT.Name,
                isAdmin: false,
                ...overrides,
            },
        },
    };
}

describe('visual / TemplateSpotDetail', () => {
    test('default render — bengaluru spot', async () => {
        const screen = render(TemplateSpotDetail, {
            ...renderOptions({
                storeState: spotStoreState(),
                path: '/spot-details/BLR%23REQ%23806',
                stubs: {
                    ImageGallery:  { template: '<div class="stub-gallery" style="height:240px;background:#eee"/>' },
                    SpotRateCard:  { template: '<div class="stub-rate-card" style="height:180px;background:#fafafa"/>' },
                    AtomTextarea:  { template: '<textarea/>' },
                    AtomButton:    { template: '<button><slot/></button>' },
                },
            }),
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateSpotDetail__default');
    });

    test('admin mode — edit affordances visible', async () => {
        const screen = render(TemplateSpotDetail, {
            ...renderOptions({
                storeState: spotStoreState({ isAdmin: true }),
                path: '/spot-details/BLR%23REQ%23806',
                stubs: {
                    ImageGallery: { template: '<div class="stub-gallery" style="height:240px;background:#eee"/>' },
                    SpotRateCard: { template: '<div class="stub-rate-card" style="height:180px;background:#fafafa"/>' },
                    AtomTextarea: { template: '<textarea/>' },
                    AtomButton:   { template: '<button><slot/></button>' },
                },
            }),
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateSpotDetail__admin');
    });

    test('no facilities — minimal rendering', async () => {
        const screen = render(TemplateSpotDetail, {
            ...renderOptions({
                storeState: spotStoreState({
                    spotDetails: { ...SAMPLE_SPOT, Facilities: [] },
                }),
                path: '/spot-details/BLR%23REQ%23806',
                stubs: {
                    ImageGallery: { template: '<div class="stub-gallery" style="height:240px;background:#eee"/>' },
                    SpotRateCard: { template: '<div class="stub-rate-card" style="height:180px;background:#fafafa"/>' },
                    AtomTextarea: { template: '<textarea/>' },
                    AtomButton:   { template: '<button><slot/></button>' },
                },
            }),
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateSpotDetail__no-facilities');
    });
});
