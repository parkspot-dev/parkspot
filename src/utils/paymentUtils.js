import { getPaymentAppTypeLabel } from '@/constant/enums';

export const getPaymentAppLabel = (paymentApp) => {
    const paymentAppCode = Number(paymentApp);
    if (paymentAppCode === 0) return '';
    return getPaymentAppTypeLabel(paymentAppCode);
};

export const getAccountInfo = (account = {}, paymentAppLabel = '') => {
    const accountNumber = String(account.BankAccountNumber || '').trim();
    const ifscCode = String(account.IfscCode || '')
        .trim()
        .toUpperCase();
    const upiId = String(account.UpiId || '').trim();
    const mobile = String(account.Mobile || '').trim();

    if (accountNumber && ifscCode) {
        return `${accountNumber}/${ifscCode}`;
    }

    if (upiId) {
        return paymentAppLabel ? `${upiId}/${paymentAppLabel}` : upiId;
    }

    if (mobile) {
        return paymentAppLabel ? `${mobile}/${paymentAppLabel}` : mobile;
    }

    return '';
};
