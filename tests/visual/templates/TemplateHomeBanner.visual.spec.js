import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-vue';
import TemplateHomeBanner from '@/components/templates/TemplateHomeBanner.vue';
import { renderOptions, tick } from '../test-helpers.js';

describe('visual / TemplateHomeBanner', () => {
    test('default tab — vehicle owner (VO)', async () => {
        const screen = render(TemplateHomeBanner, {
            ...renderOptions({
                stubs: {
                    OrganismHomeCard: {
                        template: '<div class="stub-home-card" style="height:280px;background:#fafafa;border:1px solid #ddd;display:flex;align-items:center;justify-content:center">VO/SO selector</div>',
                    },
                },
            }),
        });
        await tick();
        await expect.element(screen.baseElement)
            .toMatchScreenshot('TemplateHomeBanner__default-vo');
    });
});
