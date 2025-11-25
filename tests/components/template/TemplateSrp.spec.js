import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TemplateSrp from '@/components/templates/TemplateSrp.vue';

describe('TemplateSrp.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(TemplateSrp, {
      props: { spots: [], reRender: 1 }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('toggles filter container on filter dropdown click', async () => {
    const wrapper = mount(TemplateSrp, {
      props: { spots: [], reRender: 1 }
    });
    expect(wrapper.vm.isFilterContainerOpen).toBe(false);
    await wrapper.find('.filter-dropdown').trigger('click');
    expect(wrapper.vm.isFilterContainerOpen).toBe(true);
    await wrapper.find('.filter-dropdown').trigger('click');
    expect(wrapper.vm.isFilterContainerOpen).toBe(false);
  });

  it('emits flyToSrp event when search input changes', async () => {
    const wrapper = mount(TemplateSrp, {
      props: { spots: [], reRender: 1 }
    });
    await wrapper.vm.$nextTick();
    wrapper.vm.onChange();
    expect(wrapper.emitted()).toHaveProperty('flyToSrp');
  });

  it('emits details event when details method called', () => {
    const wrapper = mount(TemplateSrp, {
      props: { spots: [], reRender: 1 }
    });
    wrapper.vm.details(123);
    expect(wrapper.emitted().details[0]).toEqual([123]);
  });
});
