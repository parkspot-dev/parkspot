import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PagePaymentGateway from '../src/views/PagePaymentGateway.vue';

describe('PagePaymentGateway.vue', () => {
  it('renders with mocked route', async () => {
    const wrapper = mount(PagePaymentGateway, {
      global: {
        stubs: {
          'b-button': true, // stub third-party components
        },
        mocks: {
          $route: {
            params: { pathMatch: 'status' },
            query: { order_id: '12345' },
          },
        },
      },
    });

    // Wait for any mounted hooks that use getStatus()
    await wrapper.vm.$nextTick();

    expect(wrapper.exists()).toBe(true);
  });
});
