import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import NavbarBody from '@/components/extras/NavbarBody.vue';

describe('NavbarBody.vue', () => {
    let wrapper;
    let store;
    let routerPushMock;
    let userActions;
    let userMutations;

    const mountComponent = () =>
        mount(NavbarBody, {
            global: {
                plugins: [store],
                stubs: {
                    'AtomButton': {
                        template:
                            '<button data-testid="atom-button" @click="$emit(\'click\'); $emit(\'btn-click\')"><slot /></button>',
                    },
                    'AtomImage': {
                        props: ['alt', 'src'],
                        template:
                            '<img data-testid="atom-image" :alt="alt" :src="src" />',
                    },
                    'router-link': {
                        props: ['to'],
                        template:
                            '<a data-testid="router-link" :data-route-name="typeof to === \'object\' ? to.name : \'\'"><slot /></a>',
                    },
                    'b-icon': {
                        template: '<span data-testid="b-icon"><slot /></span>',
                    },
                },
                mocks: {
                    $router: {
                        push: routerPushMock,
                    },
                },
            },
        });

    beforeEach(() => {
        vi.clearAllMocks();

        routerPushMock = vi.fn();
        userActions = {
            getUserProfile: vi.fn().mockResolvedValue(),
            logOut: vi.fn().mockResolvedValue(),
        };
        userMutations = {
            'update-login-modal': vi.fn((state, value) => {
                state.loginModal = value;
            }),
        };

        store = createStore({
            modules: {
                user: {
                    namespaced: true,
                    state: () => ({
                        isAdmin: true,
                        isAgent: true,
                        isAuthReady: true,
                        loginModal: false,
                        user: null,
                    }),
                    mutations: userMutations,
                    actions: userActions,
                },
                config: {
                    namespaced: true,
                    state: () => ({
                        helplineNumber: '855788258',
                        helplineRef: 'tel:855788258',
                    }),
                },
            },
        });
    });

    afterEach(() => {
        wrapper?.unmount();
    });

    describe('Structure tests', () => {
        it('loads the user profile on mount', async () => {
            wrapper = mountComponent();

            await flushPromises();

            expect(userActions.getUserProfile).toHaveBeenCalledTimes(1);
        });

        it('renders the CRM pending payments link for admin agents', () => {
            wrapper = mountComponent();

            const pendingPaymentsLink = wrapper.find(
                '[data-testid="router-link"][data-route-name="pending-payments"]',
            );

            expect(pendingPaymentsLink.exists()).toBe(true);
        });

        it('hides the CRM pending payments link for non-admin agents', async () => {
            store.state.user.isAdmin = false;
            wrapper = mountComponent();

            await wrapper.vm.$nextTick();

            const pendingPaymentsLink = wrapper.find(
                '[data-testid="router-link"][data-route-name="pending-payments"]',
            );

            expect(pendingPaymentsLink.exists()).toBe(false);
        });
    });

    describe('Behavior tests', () => {
        it('opens the login modal when logInBtn is called', () => {
            wrapper = mountComponent();

            wrapper.vm.logInBtn();

            expect(userMutations['update-login-modal']).toHaveBeenCalledWith(
                expect.any(Object),
                true,
            );
            expect(store.state.user.loginModal).toBe(true);
        });

        it('signout dispatches the logout action and redirects to Home', async () => {
            wrapper = mountComponent();

            wrapper.vm.signout();

            await flushPromises();

            expect(userActions.logOut).toHaveBeenCalled();
            expect(routerPushMock).toHaveBeenCalledWith({ name: 'Home' });
        });

        it('navigates to the profile page when gotoProfile is called', () => {
            wrapper = mountComponent();

            wrapper.vm.gotoProfile();

            expect(routerPushMock).toHaveBeenCalledWith({
                name: 'editProfile',
            });
        });

        it('navigates to the my bookings page when gotoMybookings is called', () => {
            wrapper = mountComponent();

            wrapper.vm.gotoMybookings();

            expect(routerPushMock).toHaveBeenCalledWith({
                name: 'my-bookings',
            });
        });

        it('toggles the mobile navigation visibility state', () => {
            wrapper = mountComponent();

            wrapper.vm.toggleMobileNav();

            expect(wrapper.vm.showMobileNav).toBe(true);

            wrapper.vm.toggleMobileNav();

            expect(wrapper.vm.showMobileNav).toBe(false);
        });

        it('moves between slides and returns to the main slide', () => {
            wrapper = mountComponent();

            wrapper.vm.toggleSlide(3);

            expect(wrapper.vm.activeSlide).toBe(3);

            wrapper.vm.backToMainScroll();

            expect(wrapper.vm.activeSlide).toBe(0);
        });
    });

    describe('Accessibility tests', () => {
        it('renders logo images with exact alt text', () => {
            wrapper = mountComponent();

            const imageAlts = wrapper
                .findAll('[data-testid="atom-image"]')
                .map((imageWrapper) => imageWrapper.attributes('alt'));

            expect(imageAlts).toEqual(
                expect.arrayContaining(['parkspot icon', 'parkspot text']),
            );
        });
    });

    describe('Focused snapshot tests', () => {
        it('matches the guest navigation route snapshot', () => {
            wrapper = mountComponent();

            const routeNames = wrapper
                .findAll('[data-testid="router-link"]')
                .map((linkWrapper) => linkWrapper.attributes('data-route-name'))
                .filter(Boolean);

            expect(routeNames).toMatchInlineSnapshot(`
              [
                "Home",
                "t-about",
                "features",
                "blog",
                "Faq",
                "SearchPortal",
                "booking-portal",
                "pending-payments",
                "spotRequest",
                "spot-search",
                "kyc-status",
                "VOPortal",
                "SOPortal",
                "Home",
                "VOPortal",
                "SOPortal",
                "editProfile",
                "t-about",
                "features",
                "blog",
                "Faq",
                "SearchPortal",
                "booking-portal",
                "pending-payments",
                "spotRequest",
                "spot-search",
                "kyc-status",
              ]
            `);
        });
    });
});
