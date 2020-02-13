import * as React from 'react';
import { Layout, Form, Row, Col, Button, Card, notification } from 'antd';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { InputField } from 'src/components/fields';
import validate from './validation';
import { service } from 'src/embed/aidbox-react/services/service';
import { CustomForm } from 'src/components/CustomForm';
import { isFailure, isSuccess } from 'src/embed/aidbox-react/libs/remoteData';
import { formatError } from 'src/utils/error';

const { Content } = Layout;

interface PasswordRecoveryForm {
    email: string;
}

interface Props {
    history: History;
}

export function ResetPassword(props: Props) {
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
                offset: 5,
            },
        },
    };

    async function onSubmit(values: PasswordRecoveryForm) {
        const response = await service<any>({
            method: 'POST',
            url: '/auth/reset-password',
            data: {
                email: values.email,
            },
        });
        if (isFailure(response)) {
            notification.error({
                message: formatError(response.error),
            });
        }
        if (isSuccess(response)) {
            notification.success({
                message: `Password reset link was emailed to ${values.email}. Please check your email.`,
            });
            props.history.push('/signin');
        }
    }

    return (
        <Layout className="layout">
            <Content>
                <Row style={{ height: '100vh' }}>
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
                        <Card style={{ marginTop: '10%', paddingTop: '15px' }}>
                            <CustomForm<PasswordRecoveryForm> onSubmit={onSubmit} validate={validate}>
                                {({ submitting }) => (
                                    <>
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Reset Password</h1>
                                        </Form.Item>
                                        <InputField name="email" label="Email" formItemProps={formItemLayout} />
                                        <Form.Item {...tailFormItemLayout}>
                                            <Button
                                                htmlType="submit"
                                                disabled={submitting}
                                                loading={submitting}
                                                type="primary"
                                            >
                                                Send reset link
                                            </Button>
                                            <br />
                                            <Link to="/signin">Login</Link>
                                        </Form.Item>
                                    </>
                                )}
                            </CustomForm>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
