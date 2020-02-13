import { makeValidator } from 'src/services/validation';

const schema = {
    properties: {
        password: {
            minLength: 1,
            const: {
                $data: '/passwordConfirm',
            },
        },
        passwordConfirm: {
            minLength: 1,
            const: {
                $data: '/password',
            },
        },
    },
    required: ['password', 'passwordConfirm'],
    errorMessage: {
        properties: {
            password: 'Passwords should be equal',
            passwordConfirm: 'Passwords should be equal',
        },
        required: 'Required',
    },
};

export default makeValidator(schema);
