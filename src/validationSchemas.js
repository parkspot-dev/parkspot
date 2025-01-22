import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

// field validation rules
const rules = {
    fullname: z
        .string()
        .min(1, 'Full name is required.')
        .min(3, 'Must be at least 3 characters.'),
    email: z
        .string()
        .min(1, 'Email is required.')
        .email('Invalid email address.'),
    password: z
        .string()
        .min(1, 'Password is required.')
        .min(6, 'Must be at least 6 characters.'),
    cno: z
        .string()
        .min(1, 'Contact number is required.')
        .regex(/^\+?\d+$/, 'Must be a valid contact number.'),
    addr: z.string().optional(),
    msg: z.string().optional(),
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
