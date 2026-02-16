import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

// field validation rules
const rules = {
    fullname: z
        .string()
        .min(1, 'Full name is required.')
        .regex(/^[A-Za-z\s]+$/, `Full name cannot contain numbers.`)
        .min(3, 'Must be at least 3 characters.'),
    email: z
        .string()
        .email('Invalid email address.')
        .optional()
        .or(z.literal('')),
    password: z
        .string()
        .min(1, 'Password is required.')
        .min(6, 'Must be at least 6 characters.'),
    cno: z
        .string()
        .min(1, 'Contact number is required.')
        .regex(/^[6-9]\d{9}$/, 'Invalid mobile number')
        .length(10, 'Contact number must be 10 digits.'),
    address: z.string().optional(),
    msg: z.string().optional(),
    carModel: z.string().min(1, 'Car model is required'),
    expectedRent: z.number().min(1, 'Expected rent must be greater than zero.'),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions.',
    }),
    accountHolderName: z
        .string()
        .min(1, 'Account holder name is required')
        .min(3, 'Must be at least 3 characters')
        .regex(/^[A-Za-z\s]+$/, 'Name can contain only letters and spaces'),
    upi: z
        .string()
        .min(1, 'UPI ID is required')
        .regex(/^[\w.-]{2,256}@[a-zA-Z]{2,64}$/, 'Invalid UPI ID format'),
    accountNumber: z
        .string()
        .min(9, 'Account number is too short')
        .max(18, 'Account number is too long')
        .regex(/^\d+$/, 'Account number must contain only digits'),

    ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
};

// Contact Form Schema
export const contactFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
        address: rules.address,
        msg: rules.msg,
    }),
);

// Parking Request Form Schema
export const parkingRequestFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
        terms: rules.terms,
    }),
);

// Edit Profile Form Schema
export const editProfileFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
    }),
);

export const registerSpotRequestFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
        address: rules.address,
        apartment: rules.address,
        expectedRent: rules.expectedRent,
        terms: rules.terms,
    }),
);

// Booking modal form schema

export const bookingModalFormSchema = toTypedSchema(
    z.object({
        fullName: rules.fullname,
        email: rules.email,
        mobile: rules.cno,
        vehicleNo: z.string().optional(),
    }),
);

// Account details form schema

export const accountInformationSchema = toTypedSchema(
    z
        .object({
            fullName: rules.accountHolderName,

            mode: z.enum(['upi', 'mobile', 'bank']),

            // UPI
            UpiID: rules.upi.optional(),
            PaymentApp: z.number().optional(),

            // Mobile
            Mobile: rules.cno.optional(),

            // Bank
            account_number: rules.accountNumber.optional(),
            ifsc_code: rules.ifsc.optional(),
        })
        .refine(
            (data) => {
                if (data.mode === 'upi') {
                    return (
                        !!data.UpiID &&
                        data.PaymentApp !== null &&
                        data.PaymentApp !== undefined
                    );
                }

                if (data.mode === 'mobile') {
                    return (
                        !!data.Mobile &&
                        data.PaymentApp !== null &&
                        data.PaymentApp !== undefined
                    );
                }

                if (data.mode === 'bank') {
                    return !!data.account_number && !!data.ifsc_code;
                }

                return false;
            },
            {
                message: 'Please fill all required account details',
                path: ['mode'],
            },
        ),
);
