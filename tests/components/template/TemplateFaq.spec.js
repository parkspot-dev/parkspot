import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TemplateFaq from "@/components/templates/TemplateFaq.vue";

const stubComponents = {
  AtomHeading: { template: "<div class='atom-heading'><slot /></div>" },
  AtomParagraph: { template: "<p class='atom-paragraph'><slot /></p>" },
  BodyWrapper: { template: "<section class='body-wrapper'><slot /></section>" },
  "b-collapse": {
    props: ["modelValue"],
    emits: ["update:modelValue", "open", "close"],
    template: `
      <div class="b-collapse-root">
        <div class="card-header trigger" @click="$emit(modelValue ? 'close' : 'open')">
          <slot name="trigger" :open="modelValue"></slot>
        </div>
        <div v-if="modelValue" class="content">
          <slot></slot>
        </div>
      </div>
    `,
  },
  "b-icon": { template: "<span class='icon'></span>" },
};

describe("TemplateFaq.vue", () => {
  const mountComponent = () =>
    mount(TemplateFaq, {
      global: {
        stubs: stubComponents,
      },
    });

  it("renders heading text", () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("Frequently Asked Questions!");
  });

  it("renders all FAQ items", () => {
    const wrapper = mountComponent();
    const vm = wrapper.vm;

    const collapses = wrapper.findAll(".b-collapse-root");
    expect(collapses.length).toBe(vm.faqLists.length);
  });

  it("opens the first FAQ on mount", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.openStates[0]).toBe(true);
    expect(wrapper.vm.openStates.slice(1).every((v) => v === false)).toBe(true);
  });

  it("clicking the trigger toggles FAQs handleOpen and handleClose", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    const triggers = wrapper.findAll(".trigger");
    expect(wrapper.vm.openStates[0]).toBe(true);

    await triggers[1].trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.openStates[1]).toBe(true);
    expect(wrapper.vm.openStates[0]).toBe(false);

    await triggers[1].trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.openStates[1]).toBe(false);
  });

  it("handleOpen keeps only one FAQ open at a time", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleOpen(2);
    expect(wrapper.vm.openStates[2]).toBe(true);
    expect(wrapper.vm.openStates.filter((v) => v).length).toBe(1);
  });

  it("handleClose closes only selected FAQ", async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleOpen(3);
    expect(wrapper.vm.openStates[3]).toBe(true);

    await wrapper.vm.handleClose(3);
    expect(wrapper.vm.openStates[3]).toBe(false);
  });

  it("renders contact paragraph with link", () => {
    const wrapper = mountComponent();
    const contactLink = wrapper.find('a[href="/contact"]');
    expect(contactLink.exists()).toBe(true);
    expect(contactLink.text().toLowerCase()).toContain("contact us");
  });

  it("applies correct CSS classes to wrappers", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".body-wrapper").exists()).toBe(true);
    expect(wrapper.find(".atom-heading").exists()).toBe(true);
    expect(wrapper.find(".atom-paragraph").exists()).toBe(true);
  });

  it("matches snapshot", () => {
    const wrapper = mountComponent();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
