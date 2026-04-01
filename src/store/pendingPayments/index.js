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

const resolvePaymentAppCode = (paymentApp) => {
    const code = Number(paymentApp);
    return code === 1 || code === 2 ? code : 0;
};

const resolvePaymentAppLabel = (paymentApp) => {
    const code = resolvePaymentAppCode(paymentApp);
    if (code === 1) {
        return 'Phone Pay';
    }
    if (code === 2) {
        return 'GPay';
    }
    return '';
};

const normalizePendingPayment = (payment = {}) => {
    const account = payment.Account || {};
    const paymentAppValue = resolvePaymentAppCode(account.PaymentApp ?? 0);
    const paymentAppLabel = resolvePaymentAppLabel(paymentAppValue);
    const upiId = String(account.UpiId || '').trim();
    const accountNumber = String(account.BankAccountNumber || '').trim();
    const ifscCode = String(account.IfscCode || '')
        .trim()
        .toUpperCase();

    let paymentDetails = '';
    if (accountNumber !== '' && ifscCode !== '') {
        paymentDetails = `${accountNumber} / ${ifscCode}`;
    } else if (upiId !== '') {
        paymentDetails = upiId;
    }

    return {
        ...payment,
        PaymentId: Number(payment.PaymentId || payment.PaymentID || 0),
        BookingId: payment.BookingId || payment.BookingID || '',
        Amount: Number(payment.Amount || 0),
        BaseAmount: Number(payment.BaseAmount || 0),
        PaymentApp: paymentAppValue,
        PaymentAppLabel: paymentAppLabel,
        PaymentDetails: paymentDetails,
        VoName: payment.VoName || '',
        VoMobile: payment.VoMobile || '',
        SoName: payment.SoName || '',
        SoMobile: payment.SoMobile || '',
        Account: {
            ...account,
            AccountId: Number(account.AccountId || 0),
            FullName: account.FullName || '',
            UpiId: upiId,
            PaymentApp: paymentAppValue,
            PaymentAppLabel: paymentAppLabel,
            Mobile: account.Mobile || '',
            BankAccountNumber: accountNumber,
            IfscCode: ifscCode,
        },
    };
};

const state = {
    pendingPayments: [],
    hasError: false,
    errorMessage: '',
    isLoading: false,
};

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
        const res = await mayaClient.get('/internal/pending-payments');
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
            PaymentApp: resolvePaymentAppCode(
                payload?.PaymentApp ?? payload?.paymentApp ?? 0,
            ),
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
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
