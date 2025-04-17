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
        .regex(/^\+?\d+$/, 'Must be a valid contact number.')
        .length(10, 'Contact number must be 10 digits.'),
    addr: z.string().optional(),
    msg: z.string().optional(),
    carModel: z.string().min(1, 'Car model is required'),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions.',
    }),
};

// Contact Form Schema
export const contactFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
        addr: rules.addr,
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
        addr: rules.addr,
        aprt: rules.addr,
        terms: rules.terms,
    }),
);
