import { mayaClient } from '@/services/api';

const extractPendingPayments = (response) => {
    if (Array.isArray(response)) {
        return response;
    }
    if (Array.isArray(response?.PendingPayments)) {
        return response.PendingPayments;
    }
    if (Array.isArray(response?.Data)) {
        return response.Data;
    }
    return [];
};

const normalizePendingPayment = (payment = {}) => {
    const account = payment.Account || {};
    return {
        ...payment,
        PaymentId: Number(payment.PaymentId || payment.PaymentID || 0),
        BookingId: payment.BookingId || payment.BookingID || '',
        Amount: Number(payment.Amount || 0),
        BaseAmount: Number(payment.BaseAmount || 0),
        VoName: payment.VoName || '',
        VoMobile: payment.VoMobile || '',
        SoName: payment.SoName || '',
        SoMobile: payment.SoMobile || '',
        Account: {
            ...account,
            AccountId: Number(account.AccountId || 0),
            FullName: account.FullName || '',
            UpiId: account.UpiId || account.UPIId || '',
            Mobile: account.Mobile || '',
            BankAccountNumber:
                account.BankAccountNumber ||
                account.AccountNumber ||
                '',
            IfscCode:
                account.IfscCode ||
                account.IFSCCode ||
                account.Ifsc ||
                account.IFSC ||
                '',
        },
    };
};

const state = {
    pendingPayments: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
};

const getters = {};

const mutations = {
    'set-pending-payments'(state, pendingPayments) {
        state.hasError = false;
        state.errorMessage = '';
        state.pendingPayments = pendingPayments;
    },
    'set-error'(state, errorMessage) {
        state.hasError = true;
        state.errorMessage = errorMessage;
    },
    'set-loading'(state, isLoading) {
        state.isLoading = isLoading;
    },
    'record-payment-success'(state, payload) {
        if (payload.paymentId) {
            state.pendingPayments = state.pendingPayments.filter(
                (payment) => payment.PaymentId !== payload.paymentId,
            );
            return;
        }
        state.pendingPayments = state.pendingPayments.filter(
            (payment) => payment.BookingId !== payload.bookingId,
        );
    },
};

const actions = {
    async getPendingPayments({ commit }) {
        commit('set-loading', true);
        const res = await mayaClient.get(`/internal/pending-payments`);
        console.log('pending-payments api response:', res);
        if (res?.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
        } else {
            const pendingPayments = extractPendingPayments(res).map(
                normalizePendingPayment,
            );
            commit('set-pending-payments', pendingPayments);
        }
        commit('set-loading', false);
    },
    async updateAmountToSO({ commit }, payload) {
        commit('set-loading', true);
        const reqBody = {
            PaymentID: Number(payload?.PaymentID || payload?.paymentId || 0),
            AmountToSO: Number(payload?.AmountToSO || payload?.amountPaid || 0),
        };
        if (payload?.TransferDate) {
            reqBody.TransferDate = payload.TransferDate;
        }

        const res = await mayaClient.post('/payment/amount-to-so', reqBody);
        commit('set-loading', false);

        if (res?.DisplayMsg) {
            commit('set-error', res.DisplayMsg + ' ( ' + res.ErrorMsg + ' )');
            return res;
        }

        if (res?.Success) {
            commit('record-payment-success', {
                paymentId: reqBody.PaymentID,
                bookingId: payload?.bookingId,
            });
        }

        return res;
    },
    async updatePayment({ dispatch }, payload) {
        return dispatch('updateAmountToSO', payload);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
