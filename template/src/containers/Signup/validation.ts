import { makeValidator } from 'src/services/validation';

const schema = {
    properties: {
        email: {
            format: 'email',
        },
    },
    required: [
        'email',
        'phoneNumber',
    ],
    errorMessage: {
        required: 'Required',
        properties: {
            email: 'Should be a valid email',
        },
    },
};

export default makeValidator(schema);
