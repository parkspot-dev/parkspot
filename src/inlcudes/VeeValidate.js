import {
    required,
    email,
    regex,
    integer,
    image,
} from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
    ...required,
    message: '{_field_} is required.',
});

extend('email', {
    ...email,
    message: 'Email is not valid.',
});

extend('regex', {
    ...regex,
    message: '{_field_} is not valid.',
});

extend('integer', {
    ...integer,
    message: '{_field_} should contain number.',
});

extend('image', {
    ...image,
    message: '{_field_} must be an image.',
});

extend('phone', {
    validate: (value) => {
        var phoneRegex = new RegExp('^([6-9]{1})([0-9]{9})$');
        if (value == '') return true;
        return phoneRegex.test(value);
    },
    message: `The {_field_} is not valid.`,
});
