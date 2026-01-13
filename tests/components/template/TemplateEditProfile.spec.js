import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';
import TemplateUserProfile from '@/components/templates/TemplateEditProfile.vue';

describe('TemplateUserProfile.vue', () => {
    let wrapper;
    let store;

    const createVuexStore = (userState) =>
        createStore({
            modules: {
                user: {
                    namespaced: true,
                    state: () => ({
                        user: userState,
                    }),
                },
            },
        });

    const mountComponent = () =>
        mount(TemplateUserProfile, {
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
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    describe('when user is not available', () => {
        it('shows loader modal', () => {
            store = createVuexStore(null);

            wrapper = mountComponent();

            expect(wrapper.find('[data-testid="loader-modal"]').exists()).toBe(true);
            expect(wrapper.find('.edit-profile-main').exists()).toBe(false);
        });
    });

    describe('when user is available', () => {
        const userMock = {
            displayName: 'Dev Shrivastav',
            photoURL: 'https://example.com/avatar.png',
        };

        beforeEach(() => {
            store = createVuexStore(userMock);
            wrapper = mountComponent();
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
            expect(
                wrapper.find('[data-testid="user-general-info"]').exists()
            ).toBe(true);
        });
    });
});
