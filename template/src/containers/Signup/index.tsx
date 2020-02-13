import * as React from 'react';
import { History } from 'history';
import {FORM_ERROR} from 'final-form';
import {Layout, Form, Row, Col, Alert, Button, Card, notification} from 'antd';
import { Link } from 'react-router-dom';
import { Form as FinalForm} from 'react-final-form';



import { signup, SignupBody } from 'src/services/auth';
import {
    InputField,

} from 'src/components/fields';
import validate from './validation';
import { trimWhitespaces } from 'src/utils/form';
import {isSuccess} from "src/embed/aidbox-react/libs/remoteData";


const { Content } = Layout;


const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 0,
        },
    },
};


interface Props {
    history: History;
}

export function Signup({ history }: Props) {

    const onSubmit = async (values: SignupBody) => {
        const response = await signup(values);
        if (isSuccess(response)) {
            notification.success({ message: 'Please confirm your email address' });
            history.push('/signin');
        } else {
            return { [FORM_ERROR]: 'Already existing email' };
        }

        return;
    };

    return (
        <Layout className="layout">
            <Content>
                <Row style={{ height: '100vh' }}>
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
                        <Card
                            style={{
                                marginTop: '10%',
                                paddingTop: '15px',
                            }}
                        >
                            <FinalForm<SignupBody>
                                onSubmit={(values) => onSubmit(trimWhitespaces(values))}
                                validate={(values) => validate(trimWhitespaces(values))}
                                render={({ handleSubmit, submitError, submitting, values, form }) => (
                                    <Form
                                        {...formItemLayout}
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            handleSubmit();
                                        }}
                                    >
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Sign Up</h1>
                                        </Form.Item>
                                        <InputField name="email" placeholder="Email" label="Email"/>
                                        {submitError ? (
                                            <Form.Item {...tailFormItemLayout}>
                                                <Alert message={submitError} type="error" />
                                            </Form.Item>
                                        ) : null}

                                        <Form.Item {...tailFormItemLayout}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                disabled={submitting}
                                                loading={submitting}
                                            >
                                                Sign up
                                            </Button>{' '}
                                            <Link to="/signin">Login</Link>
                                        </Form.Item>
                                    </Form>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}