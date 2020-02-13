import { makeValidator } from 'src/services/validation';

const schema = {
    required: ['email'],
    properties: {
        email: {
            format: 'email',
        },
    },
    errorMessage: {
        properties: {
            email: 'Please provide a correct email',
        },
        required: 'Required',
    },
};

export default makeValidator(schema);
