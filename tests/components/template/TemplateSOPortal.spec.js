import { mount } from "@vue/test-utils";
import { describe, it, expect, afterEach } from "vitest";
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
};

const factory = () => {
    return mount(TemplateSOPortal, {
        global: {
            stubs,
        },
    });
};

describe('TemplateSOPortal.vue', () => {
    let wrapper;

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders the components', () => {
        wrapper = factory();
        expect(wrapper.exists()).toBe(true);
    });

    it('shows welcome heading', () => {
        wrapper = factory();
        expect(wrapper.text()).toContain('Welcome to ParkSpot');
    });

    it('renders joining benefits list', () => {
        wrapper = factory();
        const listItems = wrapper.findAll('.benefits-list li');
        expect(listItems.length).toBeGreaterThan(0);
    });

    it('renders WhatsApp link', () => {
        wrapper = factory();
        const link = wrapper.find('a[href*="whatsapp.com"]');
        expect(link.exists()).toBe(true);
    });

    it('emits finalSubmit when RegistrationRequestForm emits submit-form', async () => {
        wrapper = factory();
        await wrapper.find('.register-form').trigger('click');
        expect(wrapper.emitted('finalSubmit')).toBeTruthy();
        expect(wrapper.emitted('finalSubmit').length).toBe(1);
    });
});