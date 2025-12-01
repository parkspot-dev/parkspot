import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TemplateFaq from '@/components/templates/TemplateFaq.vue';

const stubComponents = {
    'AtomHeading': { template: "<div class='atom-heading'><slot /></div>" },
    'AtomParagraph': { template: "<p class='atom-paragraph'><slot /></p>" },
    'BodyWrapper': {
        template: "<section class='body-wrapper'><slot /></section>",
    },
    'b-collapse': {
        props: ['modelValue', 'ariaId'],
        emits: ['update:modelValue', 'open', 'close'],
        template: `
      <div class="b-collapse-root card">
        <div class="card-header" 
             role="button" 
             :aria-controls="ariaId"
             :aria-expanded="modelValue"
             @click="$emit(modelValue ? 'close' : 'open')"
             :class="{ 'custom-header': modelValue }">
          <slot name="trigger" :open="modelValue"></slot>
        </div>
        <div v-if="modelValue" class="card-content">
          <div class="content"><slot></slot></div>
        </div>
      </div>
    `,
    },
    'b-icon': { template: "<span class='icon'></span>" },
};

describe('TemplateFaq.vue - Complete Test Suite', () => {
    const mountComponent = () =>
        mount(TemplateFaq, {
            global: {
                stubs: stubComponents,
            },
        });

    it('renders main components', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('.body-wrapper').exists()).toBe(true);
        expect(wrapper.find('.atom-heading').exists()).toBe(true);
        expect(wrapper.find('.atom-paragraph').exists()).toBe(true);
        expect(wrapper.findAll('.b-collapse-root').length).toBe(17);
        expect(wrapper.find('a[href="/contact"]').exists()).toBe(true);
    });

    it('renders heading text and contact link', () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('Frequently Asked Questions!');
        const contactLink = wrapper.find('a[href="/contact"]');
        expect(contactLink.text().toLowerCase()).toContain('contact us');
    });

    it('opens first FAQ by default on mount', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        const firstFaq = wrapper.findAll('.b-collapse-root')[0];
        expect(wrapper.vm.openStates[0]).toBe(true);
        expect(firstFaq.find('.content').exists()).toBe(true);
        expect(wrapper.vm.openStates.slice(1).every((v) => !v)).toBe(true);
    });

    it('toggles FAQ visibility on trigger click', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        await wrapper.vm.handleOpen(1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.openStates[1]).toBe(true);
        expect(wrapper.vm.openStates[0]).toBe(false);
        expect(
            wrapper.findAll('.b-collapse-root')[1].find('.content').exists(),
        ).toBe(true);
    });

    it('handleOpen maintains only one FAQ open', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        await wrapper.vm.handleOpen(3);
        expect(wrapper.vm.openStates[3]).toBe(true);
        expect(wrapper.vm.openStates.filter(Boolean).length).toBe(1);
    });

    it('handleClose closes specific FAQ', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        await wrapper.vm.handleOpen(4);
        expect(wrapper.vm.openStates[4]).toBe(true);
        await wrapper.vm.handleClose(4);
        expect(wrapper.vm.openStates[4]).toBe(false);
    });

    it('renders heading section correctly', () => {
        const wrapper = mountComponent();
        const heading = wrapper.find('.atom-heading');
        expect(heading.html()).toMatchSnapshot();
    });

    it('renders first FAQ item structure', () => {
        const wrapper = mountComponent();
        const firstFaq = wrapper.findAll('.b-collapse-root')[0];
        expect(firstFaq.html()).toMatchSnapshot();
    });

    it('renders contact section correctly', () => {
        const wrapper = mountComponent();
        const contactSection = wrapper.find('.mt-5');
        expect(contactSection.html()).toMatchSnapshot();
    });

    it('has accessible FAQ controls', () => {
        const wrapper = mountComponent();
        const controls = wrapper.findAll('[role="button"]');

        controls.forEach((control) => {
            expect(control.attributes('aria-controls')).toBeDefined();
            expect(control.attributes('aria-expanded')).toBeDefined();
        });
    });

    it('applies correct CSS classes when FAQ is open', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        const firstTrigger = wrapper.findAll('.card-header')[0];
        expect(firstTrigger.classes()).toContain('custom-header');
        const firstTitle = wrapper.findAll('.card-header-title')[0];
        expect(firstTitle.classes()).toContain('custom-header-title');
    });

    it('renders all 17 FAQ items with correct questions', () => {
        const wrapper = mountComponent();
        const faqRoots = wrapper.findAll('.b-collapse-root');
        expect(faqRoots.length).toBe(17);
        expect(wrapper.text()).toContain('What is ParkSpot ?');
        expect(wrapper.text()).toContain(
            'Why do I need to add my vehicle number',
        );
        expect(wrapper.text()).toContain('How can your platform help me');
    });

    it('expands FAQ item when clicked', async () => {
        const wrapper = mountComponent();
        const firstHeader = wrapper.find('.card-header');

        if (wrapper.vm.openStates[0]) {
            await wrapper.vm.handleClose(0);
            await wrapper.vm.$nextTick();
        }

        await firstHeader.trigger('click');
        await wrapper.vm.$nextTick();

        const firstContent = wrapper.find('.card-content');
        expect(firstContent.exists()).toBe(true);
        expect(firstContent.isVisible()).toBe(true);
    });
});
