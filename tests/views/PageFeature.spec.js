import { shallowMount } from "@vue/test-utils";
import PageFeature from "@/views/PageFeature.vue";
import { PAGE_TITLE } from "@/constant/constant";
import { describe, it, expect } from "vitest";

const stubs = {
    TemplateFeature: {
        name: 'TemplateFeature',
        template: 
            `<div class="template-feature-stub">TemplateFeatures Stub</div>`,
    },
};

const factory = () => {
    return shallowMount(PageFeature, {
        global: {
            stubs,
        },
    });
};

describe('PageFeature.vue', () => {
    it('renders the page component', () => {
        const wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('renders section wrapper with correct class', () => {
        const wrapper = factory();
        expect(wrapper.find('section.section').exists()).toBe(true);
    });

    it('renders TemplateFeature component (stubbed)', () => {
        const wrapper = factory();
        expect(wrapper.findComponent({ name: 'TemplateFeature' }).exists()).toBe(true);
    });

    it('has correct component name', () => {
        expect(PageFeature.name).toBe('PageFeatures');
    });

    it('returns correct metaInfo', () => {
        const meta = PageFeature.metaInfo();
        expect(meta).toEqual({
            title: PAGE_TITLE.FEATURES,
            titleTemplate: PAGE_TITLE.TITLE_TEMPLATE + '%s',
        });
    });
});