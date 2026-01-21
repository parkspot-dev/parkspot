import { mount, flushPromises } from '@vue/test-utils';
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
                        template:
                            '<div data-testid="template-edit-profile" />',
                    },
                },
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();

        getUserProfileMock = vi.fn(() =>
            Promise.resolve({ id: 1, name: 'Dev' }),
        );

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

    it('dispatches getUserProfile action on mount', async () => {
        wrapper = mountComponent();
        await flushPromises();

        expect(getUserProfileMock).toHaveBeenCalledTimes(1);
    });

    it('renders TemplateEditProfile on success', async () => {
        wrapper = mountComponent();
        await flushPromises();

        expect(
            wrapper.find('[data-testid="template-edit-profile"]').exists(),
        ).toBe(true);

        expect(
            wrapper.find('[data-testid="profile-error"]').exists(),
        ).toBe(false);
    });

    it('shows error state when getUserProfile fails', async () => {
        getUserProfileMock.mockRejectedValueOnce(
            new Error('Something went wrong'),
        );

        wrapper = mountComponent();
        await flushPromises();
        expect(getUserProfileMock).toHaveBeenCalledTimes(1);

        expect(
            wrapper.find('[data-testid="profile-error"]').exists(),
        ).toBe(true);

        expect(
            wrapper.find('[data-testid="template-edit-profile"]').exists(),
        ).toBe(false);

        expect(wrapper.text()).toContain('Something went wrong');
    });
});
