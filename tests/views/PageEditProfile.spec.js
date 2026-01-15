import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import PageEditProfile from '@/views/PageEditProfile.vue';

describe('PageEditProfile.vue', () => {
    let wrapper;
    let store;
    let getUserProfileMock;

    const mountComponent = () =>
        mount(PageEditProfile, {
            global: {
                plugins: [store],
                stubs: {
                    TemplateEditProfile: {
                        template: '<div data-testid="template-edit-profile" />',
                    },
                },
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();
        getUserProfileMock = vi.fn(() => Promise.resolve());

        store = createStore({
            modules: {
                user: {
                    namespaced: true,
                    actions: {
                        getUserProfile: getUserProfileMock,
                    },
                },
            },
        });
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    it('renders TemplateEditProfile component', () => {
        wrapper = mountComponent();
        expect(
            wrapper.find('[data-testid="template-edit-profile"]').exists(),
        ).toBe(true);
    });

    it('dispatches getUserProfile action on mount', () => {
        wrapper = mountComponent();
        expect(getUserProfileMock).toHaveBeenCalledTimes(1);
    });

    it('handles getUserProfile failure gracefully', async () => {
        getUserProfileMock.mockRejectedValueOnce(new Error('Network error'));

        wrapper = mountComponent();

        expect(getUserProfileMock).toHaveBeenCalledTimes(1);
        expect(wrapper.exists()).toBe(true);
    });
});
