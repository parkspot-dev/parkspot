import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import PageVOPortal from '@/views/PageVOPortal.vue';

describe('PageVOPortal.vue', () => {
    let wrapper;
    let store;
    let actions;
    let routerPush;
    let toastOpen;

    beforeEach(() => {
        actions = {
            requestSpot: vi.fn(),
        };

        store = createStore({
            modules: {
                user: {
                    namespaced: true,
                    actions,
                },
            },
        });

        routerPush = vi.fn();
        toastOpen = vi.fn();

        wrapper = mount(PageVOPortal, {
            global: {
                plugins: [store],
                mocks: {
                    $router: { push: routerPush },
                    $buefy: {
                        toast: { open: toastOpen },
                    },
                },
                stubs: {
                    TemplateVOPortal: {
                        name: 'TemplateVOPortal',
                        template: '<div data-testid="vo-portal" />',
                    },
                    LoaderModal: {
                        template: '<div data-testid="loader-modal" />',
                    },
                },
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.clearAllMocks();
    });

    it('renders TemplateVOPortal', () => {
        expect(wrapper.find('[data-testid="vo-portal"]').exists()).toBe(true);
    });

    it('does not render loader initially', () => {
        expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(false);
    });

    it('shows loader while request is pending', async () => {
        actions.requestSpot.mockReturnValue(new Promise(() => {}));

        wrapper.findComponent({ name: 'TemplateVOPortal' }).vm.$emit('submit');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(true);
    });

    it('handles successful submit flow', async () => {
        actions.requestSpot.mockResolvedValueOnce();

        wrapper.findComponent({ name: 'TemplateVOPortal' }).vm.$emit('submit');
        await flushPromises();

        expect(actions.requestSpot).toHaveBeenCalled();
        expect(toastOpen).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'is-success',
            })
        );
        expect(routerPush).toHaveBeenCalledWith({ name: 'thankYou' });
        expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(false);
    });

    it('handles failed submit flow', async () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        actions.requestSpot.mockRejectedValueOnce({
            DisplayMsg: 'Error',
        });

        wrapper.findComponent({ name: 'TemplateVOPortal' }).vm.$emit('submit');
        await flushPromises();

        expect(consoleSpy).toHaveBeenCalled();
        expect(toastOpen).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'is-danger',
            })
        );
        expect(routerPush).toHaveBeenCalledWith({
            name: 'error',
            params: { msg: 'Error' },
        });

        consoleSpy.mockRestore();
    });
});
