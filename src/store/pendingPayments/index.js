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
    const rawPaymentAppValue = account.PaymentApp ?? payment.PaymentApp ?? 0;
    const paymentAppValue = Number(rawPaymentAppValue);
    const upiId = String(
        account.UpiId || account.UpiID || account.UPIId || '',
    ).trim();
    const normalizedUpiId = upiId.toLowerCase();
    const resolvedPaymentAppValue =
        paymentAppValue === 1 || paymentAppValue === 2
            ? paymentAppValue
            : normalizedUpiId.includes('@ybl')
                ? 1
                : normalizedUpiId.includes('@ok')
                    ? 2
                    : 0;
    const paymentAppLabel =
        resolvedPaymentAppValue === 1
            ? 'PhonePe'
            : resolvedPaymentAppValue === 2
                ? 'GPay'
                : '';
    const accountNumber = String(
        account.account_number ||
            account.BankAccountNumber ||
            account.AccountNumber ||
            '',
    ).trim();
    const ifscCode = String(
        account.ifsc_code ||
            account.IfscCode ||
            account.IFSCCode ||
            account.Ifsc ||
            account.IFSC ||
            '',
    ).trim();
    const mobile = String(account.Mobile || '').trim();

    let paymentDetails = '';
    if (accountNumber !== '' && ifscCode !== '') {
        paymentDetails = `${accountNumber} / ${ifscCode}`;
    } else if (upiId !== '') {
        paymentDetails =
            paymentAppLabel !== '' ? `${upiId} / ${paymentAppLabel}` : upiId;
    } else if (mobile !== '') {
        paymentDetails =
            paymentAppLabel !== ''
                ? `${mobile} / ${paymentAppLabel}`
                : mobile;
    }

    return {
        ...payment,
        PaymentId: Number(payment.PaymentId || payment.PaymentID || 0),
        BookingId: payment.BookingId || payment.BookingID || '',
        Amount: Number(payment.Amount || 0),
        BaseAmount: Number(payment.BaseAmount || 0),
        PaymentApp: resolvedPaymentAppValue,
        PaymentDetails: paymentDetails,
        VoName: payment.VoName || '',
        VoMobile: payment.VoMobile || '',
        SoName: payment.SoName || '',
        SoMobile: payment.SoMobile || '',
        Account: {
            ...account,
            AccountId: Number(account.AccountId || 0),
            FullName: account.FullName || '',
            UpiId: account.UpiId || account.UPIId || '',
            PaymentApp: resolvedPaymentAppValue,
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

const resolvePaymentAppCode = (rawValue) => {
    const normalizedValue = String(rawValue ?? '')
        .trim()
        .toLowerCase();

    if (
        normalizedValue === '1' ||
        normalizedValue === 'phonepe' ||
        normalizedValue === 'phone pe'
    ) {
        return 1;
    }

    if (
        normalizedValue === '2' ||
        normalizedValue === 'gpay' ||
        normalizedValue === 'g pay' ||
        normalizedValue === 'googlepay' ||
        normalizedValue === 'google pay'
    ) {
        return 2;
    }

    return 0;
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
