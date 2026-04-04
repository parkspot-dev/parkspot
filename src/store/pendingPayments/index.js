import { mayaClient } from '@/services/api';
import { getPaymentAppTypeLabel } from '@/constant/enums';

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
    if (paymentApp === null || paymentApp === undefined) {
        return 0;
    }

    const normalizedValue = String(paymentApp).trim().toLowerCase();
    if (
        normalizedValue === '1' ||
        normalizedValue === 'phonepe' ||
        normalizedValue === 'phone pay'
    ) {
        return 1;
    }
    if (
        normalizedValue === '2' ||
        normalizedValue === 'gpay' ||
        normalizedValue === 'google pay'
    ) {
        return 2;
    }

    const code = Number(paymentApp);
    return code === 1 || code === 2 ? code : 0;
};

const resolvePaymentAppLabel = (paymentApp) => {
    const code = resolvePaymentAppCode(paymentApp);
    if (code === 0) {
        return '';
    }
    return getPaymentAppTypeLabel(code);
};

const normalizeAccountValue = (
    value,
    { stripSpaces = false, uppercase = false } = {},
) => {
    let normalizedValue = String(value ?? '').trim();
    if (normalizedValue === '') {
        return '';
    }

    if (stripSpaces) {
        normalizedValue = normalizedValue.replace(/\s+/g, '');
    }
    if (uppercase) {
        normalizedValue = normalizedValue.toUpperCase();
    }
    return normalizedValue;
};

const pickAccountValue = (account, keys, options = {}) => {
    for (const key of keys) {
        const value = normalizeAccountValue(account?.[key], options);
        if (value !== '') {
            return value;
        }
    }
    return '';
};

const normalizePendingPayment = (payment = {}) => {
    const account = payment.Account || {};
    const paymentAppValue = resolvePaymentAppCode(
        account.PaymentApp ??
            account.paymentApp ??
            payment.PaymentApp ??
            payment.paymentApp ??
            0,
    );
    const paymentAppLabel =
        pickAccountValue(account, ['PaymentAppLabel', 'paymentAppLabel']) ||
        resolvePaymentAppLabel(paymentAppValue);
    const upiId = pickAccountValue(account, ['UpiId', 'UpiID'], {
        stripSpaces: true,
    });
    const accountNumber = pickAccountValue(account, [
        'BankAccountNumber',
        'account_number',
    ]);
    const ifscCode = pickAccountValue(account, ['IfscCode', 'ifsc_code'], {
        uppercase: true,
    });
    const mobile = pickAccountValue(account, ['Mobile', 'mobile'], {
        stripSpaces: true,
    });
    const fullName = pickAccountValue(account, ['FullName', 'fullName']);

    let paymentDetails = '';
    if (accountNumber !== '' && ifscCode !== '') {
        paymentDetails = `${accountNumber}/${ifscCode}`;
    } else if (upiId !== '') {
        paymentDetails =
            paymentAppLabel !== '' ? `${upiId}/${paymentAppLabel}` : upiId;
    } else if (mobile !== '') {
        paymentDetails =
            paymentAppLabel !== '' ? `${mobile}/${paymentAppLabel}` : mobile;
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
            FullName: fullName,
            UpiId: upiId,
            UpiID: upiId,
            PaymentApp: paymentAppValue,
            PaymentAppLabel: paymentAppLabel,
            Mobile: mobile,
            BankAccountNumber: accountNumber,
            account_number: accountNumber,
            IfscCode: ifscCode,
            ifsc_code: ifscCode,
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
