import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TemplateSOPortal from "@/components/templates/TemplateSOPortal.vue";

const stubs = {
    AtomHeading: {
        props: ['level'],
        template: '<h2><slot /></h2>',
    },
    AtomIcon: {
        props: ['icon'],
        template: '<i class="icon"></i>',
    },
    RegisterRequestForm: {
        template: `
            <button class="register-form" @click="$emit('submit-form')">
                Submit
            </button>
        `,
    },
    WhatsNext: {
        template: '<div class="whats-next"></div>',
    },
    TestimonialSection: {
        template: '<div class="testimonial"></div>',
    },
}

const factory = () => 
    mount(TemplateSOPortal, {
        global: {
            stubs,
        },
    })

describe('TemplateSOPortal.vue', () => {
    it('renders the components', () => {
        const wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('shows welcome heading', () => {
        const wrapper = factory();
        expect(wrapper.text()).toContain('Welcome to ParkSpot');
    });

    it('renders joining benefits list', () => {
        const wrapper= factory();
        const listItems = wrapper.findAll('.benefits-list li');
        expect(listItems.length).toBeGreaterThan(0);
    });

    it('renders WhatsApp link', () => {
        const wrapper = factory();
        const link = wrapper.find('a[href*="whatsapp.com"]');
        expect(link.exists()).toBe(true);
    });

    it('emits finalSubmit when RegistrationRequestForm emits submit-form', async () => {
        const wrapper = factory();
        await wrapper.find('.register-form').trigger('click');
        expect(wrapper.emitted('finalSubmit')).toBeTruthy();
        expect(wrapper.emitted('finalSubmit').length).toBe(1);
    });
});