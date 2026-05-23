import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/firebase', () => ({
    getValueFromFirebase: vi.fn(),
}));

import { getValueFromFirebase } from '@/firebase';
import configModule from '@/store/config';

const { actions, mutations, state: initialState } = configModule;

describe('Config Store - SSR-guarded helpline action', () => {
    let state;
    let commit;

    beforeEach(() => {
        state = JSON.parse(JSON.stringify(initialState));
        commit = vi.fn((type, payload) => {
            mutations[type](state, payload);
        });
        vi.clearAllMocks();
    });

    it('commits a fresh helpline number when Firebase returns a value', async () => {
        getValueFromFirebase.mockResolvedValue('+91 1234567890');
        await actions.getHelplineNumber({ commit });
        expect(commit).toHaveBeenCalledWith(
            'update-helpline-number',
            '+91 1234567890',
        );
        expect(state.helplineNumber).toBe('+91 1234567890');
    });

    it('keeps the seeded default when Firebase is unavailable (SSR / null)', async () => {
        getValueFromFirebase.mockResolvedValue(null);
        await actions.getHelplineNumber({ commit });
        expect(commit).not.toHaveBeenCalled();
        expect(state.helplineNumber).toBe(initialState.helplineNumber);
    });

    it('also tolerates undefined return values', async () => {
        getValueFromFirebase.mockResolvedValue(undefined);
        await actions.getHelplineNumber({ commit });
        expect(commit).not.toHaveBeenCalled();
    });
});
