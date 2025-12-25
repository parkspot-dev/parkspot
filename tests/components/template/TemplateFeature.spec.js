import { mount } from "@vue/test-utils";
import { describe, it, expect } from 'vitest';
import TemplateFeature from "@/components/templates/TemplateFeature.vue";

const stubs = {
    BodyWrapper: {
        template: '<div class="body-wrapper"><slot /></div>',
    },
    MoleculeFeatureHeader: {
        template: '<div class="feature-header">Feature Header</div>',
    },
    MoleculeFeatureBody: {
        props: ['featuresTitle'],
        template: `
            <div class="feature-body">
                <h3 class="feature-title">{{ featuresTitle }}</h3>
                <div class="feature-slot">
                    <slot />
                </div>
            </div>
        `,
    },
}

const factory = () => 
    mount(TemplateFeature, {
        global: {
            stubs,
        },
    })

    describe('TemplateFeature.vue', () => {
        it('renders TemplateFeature component', () => {
            const wrapper = factory()
            expect(wrapper.exists()).toBe(true)
        })

        it('renders MoleculeFeatureHeader', () => {
            const wrapper = factory()
            expect(wrapper.find('.feature-header').exists()).toBe(true)
        })

        it('renders all feature cards based on featuresData', () => {
            const wrapper = factory()
            const cards = wrapper.findAll('.feature-body')
            expect(cards.length).toBe(4)
        })

        it('passes correct props to MoleculeFeatureBody', () => {
            const wrapper = factory()
            const titles = wrapper.findAll('.feature-title').map(t => t.text())

            expect(titles).toContain('Navigation')
            expect(titles).toContain('Booking')
            expect(titles).toContain('Searching');
            expect(titles).toContain('Safety & Security');
        })

        it('renders feature description text inside slots', () => {
            const wrapper = factory()
            expect(wrapper.text()).toContain('hassle-free parking experience')
            expect(wrapper.text()).toContain('reserve a spot')
            expect(wrapper.text()).toContain('safe and secure parking area')
            expect(wrapper.text()).toContain('search apartment parking areas')
        })

        it('matches snapshot', () => {
            const wrapper = factory()
            expect(wrapper.html()).toMatchSnapshot()
        })

    })