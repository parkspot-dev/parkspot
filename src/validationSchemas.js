import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
<<<<<<< HEAD
import { PARKING_FACILITY } from '@/constant/constant';
=======
>>>>>>> select-input/enhancement

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
<<<<<<< HEAD
    parkingType: z.enum(
        PARKING_FACILITY.VO.PARKING_TYPE_LIST.map((item) => item.name),
        {
            errorMap: () => ({ message: 'Parking type is required.' }),
        },
    ),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms',
    }),
    minDur: z.enum(
        PARKING_FACILITY.VO.MINIMUM_DURATION_DATA.map((item) => item.name),
        {
            errorMap: () => ({ message: 'Duration is required.' }),
        },
    ),
=======
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms',
    }),
>>>>>>> select-input/enhancement
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
<<<<<<< HEAD
        carModel: rules.carModel,
        parkingType: rules.parkingType,
        terms: rules.terms,
        minDur: rules.minDur,
=======
        terms: rules.terms,
>>>>>>> select-input/enhancement
    }),
);

// Edit Profile Form Schema
<<<<<<< HEAD

=======
>>>>>>> select-input/enhancement
export const editProfileFormSchema = toTypedSchema(
    z.object({
        fullname: rules.fullname,
        email: rules.email,
        cno: rules.cno,
    }),
);
