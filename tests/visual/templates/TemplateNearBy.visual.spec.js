// Hand-crafted visual regression spec for the area-page template.
// This is one of the two SEO-critical landing pages, so we exercise
// every meaningful render state instead of relying on the generic
// auto-discovery smoke test.

import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import TemplateNearBy from '@/components/templates/TemplateNearBy.vue';
import { renderOptions, tick } from '../test-helpers.js';

function mockSpot(i) {
    return {
        ID: `BLR#REQ#${100 + i}`,
        Name: `Parking #${100 + i}`,
        Address: `${i} MG Road, Bengaluru`,
        Area: 'Marathahalli',
        City: 'Bengaluru',
        Rate: 2500 + i * 100,
        Images: [`/assets/sample-spot-${(i % 3) + 1}.jpg`],
        Available: true,
    };
}

describe('visual / TemplateNearBy', () => {
    test('loading state — skeleton cards', async () => {
        const screen = render(TemplateNearBy, {
            ...renderOptions(),
            props: { nearByLocation: 'Marathahalli', spots: [], isLoading: true },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateNearBy__loading');
    });

    test('empty state — no spots returned', async () => {
        const screen = render(TemplateNearBy, {
            ...renderOptions(),
            props: { nearByLocation: 'Marathahalli', spots: [], isLoading: false },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateNearBy__empty');
    });

    test('list state — 3 spots', async () => {
        const screen = render(TemplateNearBy, {
            ...renderOptions(),
            props: {
                nearByLocation: 'Marathahalli',
                spots: [mockSpot(1), mockSpot(2), mockSpot(3)],
                isLoading: false,
            },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateNearBy__three-spots');
    });

    test('list state — Hyderabad area, single spot', async () => {
        const screen = render(TemplateNearBy, {
            ...renderOptions({ path: '/hyderabad/parking-near-gachibowli/' }),
            props: {
                nearByLocation: 'Gachibowli',
                spots: [mockSpot(7)],
                isLoading: false,
            },
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateNearBy__hyd-one-spot');
    });
});
