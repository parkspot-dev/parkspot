import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import MobileView from '@/components/search-portal/MobileView.vue';

describe('MobileView.vue', () => {
    let wrapper;

    const parkingRequests = [
        {
            ID: 1,
            Name: 'dev',
            Mobile: '9999999999',
            EmailID: 'dev@test.com',
            Landmark: 'Near Metro',
            Distance: 2.5,
            City: 'Delhi',
            Duration: '1 Month',
            CarModel: 'Sedan',
            Agent: 'dev',
            Priority: 2,
            Status: 1,
            IsExpiring: true,
            CreatedAt: '2024-01-01T10:00:00Z',
            UpdatedAt: '2024-01-01T12:00:00Z',
            NextCall: '2024-01-02T10:00:00Z',
            Latitude: 28.6139,
            Longitude: 77.209,
            Comments: 'First comment',
        },
    ];

    const statusList = [
        { id: 0, name: 'StatusNotSet' },
        { id: 1, name: 'Registered' },
        { id: 2, name: 'Processing' },
    ];

    const agentList = [{ id: 1, name: 'dev' }];

    const getFormattedDate = vi.fn((d) => `Formatted: ${d}`);
    const getPriority = vi.fn((p) =>
        p === 1 ? 'Low' : p === 2 ? 'Medium' : 'High',
    );
    const isCallDelayed = vi.fn(() => false);
    const toSrp = vi.fn();
    const storeOldComment = vi.fn();

    const stubs = {
        AtomDatePicker: {
            props: ['assignedDate', 'size'],
            template:
                '<div class="atom-date-picker" @click="$emit(\'changed\', \'2024-02-01\')"></div>',
        },
        AtomInput: {
            props: ['modelValue', 'size'],
            template:
                '<input class="atom-input" :value="modelValue" @change="$emit(\'change\', $event)" />',
        },
        AtomSelectInput: {
            props: ['modelValue', 'list', 'size'],
            template:
                '<select class="atom-select-input" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value); $emit(\'change\', $event.target.value)"></select>',
        },
        AtomTextarea: {
            props: ['modelValue', 'maxlength', 'rowNo', 'size', 'placeholder'],
            template:
                '<textarea class="atom-textarea" :value="modelValue" @mousedown="$emit(\'mousedown\')" @change="$emit(\'changed\', $event.target.value)"></textarea>',
        },
        AtomTooltip: {
            props: ['label'],
            template: '<div class="atom-tooltip"><slot /></div>',
        },
    };

    const mountComponent = (props = {}) =>
        mount(MobileView, {
            props: {
                parkingRequests,
                isEmpty: false,
                newCommentMap: { 1: 'Draft comment' },
                statusList,
                agentList,
                getFormattedDate,
                getPriority,
                isCallDelayed,
                toSrp,
                storeOldComment,
                oldComments: 'Old comment text',
                ...props,
            },
            global: { stubs },
        });

    afterEach(() => wrapper?.unmount());

    it('renders empty state or request details correctly', () => {
        const emptyWrapper = mountComponent({
            isEmpty: true,
            parkingRequests: [],
        });
        expect(emptyWrapper.text()).toContain('No records');

        wrapper = mountComponent();
        expect(wrapper.text()).toContain('ID: 1');
        expect(wrapper.text()).toContain('dev');
        expect(wrapper.text()).toContain('dev@test.com');
        expect(wrapper.find('.material-symbols-outlined').exists()).toBe(true);
    });

    it('handles admin vs non-admin contact view and connect action', async () => {
        const adminWrapper = mountComponent({ isAdmin: true });
        expect(adminWrapper.text()).toContain('9999999999');

        wrapper = mountComponent({ isAdmin: false });
        await wrapper.find('button.button.is-small').trigger('click');
        expect(wrapper.emitted('connect')[0]).toEqual([parkingRequests[0]]);
    });

    it('handles comment update and old comment storage', async () => {
        wrapper = mountComponent();
        const textarea = wrapper.findComponent(stubs.AtomTextarea);
        await textarea.find('textarea').trigger('mousedown');
        expect(storeOldComment).toHaveBeenCalledWith(parkingRequests[0]);

        await textarea.vm.$emit('changed', 'New typed comment');
        expect(wrapper.emitted('comment-update')[0]).toEqual([
            parkingRequests[0],
            'Old comment text',
            'New typed comment',
            'Draft comment',
        ]);
    });

    it('handles agent assignment for admin and non-admin states', async () => {
        const adminWrapper = mountComponent({ isAdmin: true });
        await adminWrapper
            .findComponent(stubs.AtomSelectInput)
            .vm.$emit('change', 1);
        expect(adminWrapper.emitted('agent-update')[0]).toEqual([
            parkingRequests[0],
            1,
        ]);

        const disabledWrapper = mountComponent({
            isAdmin: false,
            isAssignDisabled: true,
        });
        expect(disabledWrapper.find('button.btn[disabled]').exists()).toBe(
            true,
        );

        wrapper = mountComponent({ isAdmin: false, isAssignDisabled: false });
        await wrapper.find('button.btn').trigger('click');
        expect(wrapper.emitted('agent-update')[0]).toEqual([
            parkingRequests[0],
            1,
        ]);
    });

    it('handles status, date, latlng updates and toSrp click', async () => {
        wrapper = mountComponent();
        await wrapper
            .findAllComponents(stubs.AtomSelectInput)[0]
            .vm.$emit('change', 2);
        expect(wrapper.emitted('status-update')[0]).toEqual([
            parkingRequests[0],
            2,
        ]);

        await wrapper.findComponent(stubs.AtomDatePicker).trigger('click');
        expect(wrapper.emitted('date-update')[0]).toEqual([
            parkingRequests[0],
            '2024-02-01',
        ]);

        await wrapper.find('.latlng-section a').trigger('click');
        expect(toSrp).toHaveBeenCalledWith(28.6139, 77.209);

        await wrapper
            .findComponent(stubs.AtomInput)
            .vm.$emit('change', { target: { value: '28.7, 77.3' } });
        expect(wrapper.emitted('latlng-update')[0]).toEqual([
            parkingRequests[0],
            '28.7, 77.3',
        ]);
    });

    it('handles priority tag styling and call delayed state', () => {
        [1, 2, 3].forEach((p) => {
            const w = mountComponent({
                parkingRequests: [{ ...parkingRequests[0], Priority: p }],
            });
            expect(w.find('.tag').exists()).toBe(true);
        });

        const delayedWrapper = mountComponent({ isCallDelayed: () => true });
        expect(delayedWrapper.find('.is-danger').exists()).toBe(true);
    });

    it('handles newCommentMap watcher and default props fallback', async () => {
        wrapper = mountComponent({ newCommentMap: { 1: 'Initial' } });
        await wrapper.setProps({ newCommentMap: { 1: 'Updated map' } });
        expect(wrapper.vm.localMap).toEqual({ 1: 'Updated map' });

        const defaultComp = mount(MobileView, {
            props: {
                parkingRequests,
                isEmpty: false,
                newCommentMap: {},
                statusList,
                getFormattedDate,
                getPriority,
                isCallDelayed,
                toSrp,
                storeOldComment,
            },
            global: { stubs },
        });
        expect(defaultComp.vm.agentList).toEqual([]);
        defaultComp.unmount();
    });
});
