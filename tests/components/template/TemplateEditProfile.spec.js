import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateEditProfile from '@/components/templates/TemplateEditProfile.vue';

describe('TemplateEditProfile.vue', () => {
    let wrapper;
    let store;

    const createVuexStore = () =>
        createStore({
            modules: {
                user: {
                    namespaced: true,
                    state: () => ({
                        user: null,
                    }),
                    mutations: {
                        SET_USER(state, user) {
                            state.user = user;
                        },
                    },
                },
            },
        });

    const mountComponent = () =>
        mount(TemplateEditProfile, {
            global: {
                plugins: [store],
                stubs: {
                    BodyWrapper: {
                        template: '<div data-testid="body-wrapper"><slot /></div>',
                    },
                    LoaderModal: {
                        template: '<div data-testid="loader-modal" />',
                    },
                    OrganismUserGeneralInfo: {
                        template: '<div data-testid="user-general-info" />',
                    },
                },
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();
        store = createVuexStore();
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    describe('when user is not available', () => {
        it('shows loader modal', () => {
            wrapper = mountComponent();
            expect(store.state.user.user).toBeNull();
            expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(true);
            expect(wrapper.find('.edit-profile-main').exists()).toBe(false);
        });
    });

    describe('when user is available', () => {
        const userMock = {
            displayName: 'Dev Shrivastav',
            photoURL: 'https://example.com/avatar.png',
        };

        beforeEach(async () => {
            wrapper = mountComponent();
            store.commit('user/SET_USER', userMock);
            await wrapper.vm.$nextTick();
        });

        it('renders profile container', () => {
            expect(wrapper.find('.edit-profile-main').exists()).toBe(true);
            expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(false);
        });

        it('renders user name and edit profile text', () => {
            expect(wrapper.text()).toContain('Dev Shrivastav');
            expect(wrapper.text()).toContain('Edit Profile');
        });

        it('renders user avatar image correctly', () => {
            const img = wrapper.find('img');
            expect(img.exists()).toBe(true);
            expect(img.attributes('src')).toBe(userMock.photoURL);
            expect(img.attributes('alt')).toBe('profile pic');
        });

        it('renders OrganismUserGeneralInfo component by default', () => {
            expect(wrapper.find('[data-testid="user-general-info"]').exists()).toBe(true);
        });
    });

    describe('when user data is invalid', () => {
        it('renders gracefully without crashing', async () => {
            const invalidUser = {
                displayName: null,
                photoURL: null,
            };

            wrapper = mountComponent();
            store.commit('user/SET_USER', invalidUser);
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.edit-profile-main').exists()).toBe(true);
            expect(wrapper.find('img').exists()).toBe(true);
        });
    });
});
