import React from "react";
import ReactRouter from 'react-router';
import { History } from 'history';
import {InputField} from "src/components/fields";
import {SetPasswordBody} from "src/services/auth";
import {Button, Card, Col, Form, Layout, notification, Row, Alert} from "antd";
import {isSuccess, RemoteData} from "src/embed/aidbox-react/libs/remoteData";
import { Form as FinalForm } from 'react-final-form';
import validate from './validation';

const { Content } = Layout;

const formItemLayout = {
    labelCol: {
        xs: { span: 3 },
        sm: { span: 6 },
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

interface Props {
    history: History;
    match: ReactRouter.match<{ code: string }>;
    service: (body: SetPasswordBody) => Promise<RemoteData<any>>;
}

export function SetPassword({ service, match, history }: Props) {

    const onSubmit = async (values: SetPasswordBody) => {
        const { code } = match.params;
        const response = await service({ code, password: values.password });

        if (isSuccess(response)) {
            notification.success({ message: 'Your password successfully set' });
            history.push('/signin');
        } else {
            notification.error({ message: 'Invalid or expired token' });
        }
    };



    return (
        <Layout className="layout">
            <Content>
                <Row style={{ height: '100vh' }}>
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
                        <Card style={{ marginTop: '10%', paddingTop: '15px' }}>
                            <FinalForm<SetPasswordBody>
                                onSubmit={onSubmit}
                                validate={validate}
                                render={({ handleSubmit, submitError, pristine, submitting }) => (
                                    <Form
                                        {...formItemLayout}
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            handleSubmit();
                                        }}
                                    >
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Set password</h1>
                                        </Form.Item>
                                        <InputField
                                            name="password"
                                            placeholder="Password"
                                            type="password"
                                            label="Password"
                                        />
                                        <InputField
                                            name="passwordConfirm"
                                            placeholder="Confirm password"
                                            type="password"
                                            label="Confirm password"
                                        />

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
                                                Set password
                                            </Button>
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