import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TemplateVOPortal from '@/components/templates/TemplateVOPortal.vue';

describe('TemplateVOPortal.vue', () => {
    let wrapper;

    const mountComponent = () =>
        mount(TemplateVOPortal, {
            global: {
                stubs: {
                    SearchComponent: {
                        template: '<div data-testid="search-component" />',
                    },
                    BodyWrapper: {
                        template:
                            '<div data-testid="body-wrapper"><slot /></div>',
                    },
                    AtomHeading: {
                        props: ['level'],
                        template: '<h2><slot /></h2>',
                    },
                    AtomIcon: {
                        props: ['icon'],
                        template: '<span data-testid="atom-icon" />',
                    },
                    ParkingRequestForm: {
                        name: 'ParkingRequestForm',
                        template: '<div data-testid="parking-form" />',
                    },
                    WhatsNext: {
                        props: ['steps'],
                        template: '<div data-testid="whats-next" />',
                    },
                    TestimonialSection: {
                        template:
                            '<section data-testid="testimonial-section" />',
                    },
                },
            },
        });

    beforeEach(() => {
        wrapper = mountComponent();
    });

    afterEach(() => {
        wrapper.unmount();
        vi.clearAllMocks();
    });

    it('renders search component and body wrapper', () => {
        expect(wrapper.find('[data-testid="search-component"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="body-wrapper"]').exists()).toBe(true);
    });

    it('renders main heading and sub heading text', () => {
        expect(wrapper.text()).toContain('We Would love to serve you!');
        expect(wrapper.text()).toContain(
            'Get your safe and secure hassle free parking space near you'
        );
    });

    it('renders joining benefits list', () => {
        const benefits = wrapper.findAll('.benefits li');
        expect(benefits.length).toBeGreaterThan(0);
    });

    it('renders parking request form', () => {
        expect(wrapper.find('[data-testid="parking-form"]').exists()).toBe(true);
    });

    it('renders WhatsNext and Testimonial sections', () => {
        expect(wrapper.find('[data-testid="whats-next"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="testimonial-section"]').exists()).toBe(true);
    });

    it('emits submit event when ParkingRequestForm emits on-submit', () => {
        wrapper.findComponent({ name: 'ParkingRequestForm' }).vm.$emit('on-submit');

        expect(wrapper.emitted()).toHaveProperty('submit');
        expect(wrapper.emitted('submit')).toHaveLength(1);
    });
});
