import React from "react";
import _ from 'lodash'
import { Layout, Form, Row, Col, Alert, Button, Card } from 'antd';
import {Link} from "react-router-dom";
import {signin, SigninBody} from "src/services/auth";
import { CustomForm } from 'src/components/CustomForm';
import {InputField} from "src/components/fields";
import validate from './validation';
import {isSuccess} from "src/embed/aidbox-react/libs/remoteData";
import {FORM_ERROR} from "final-form";
import {Token} from "src/embed/aidbox-react/services/token";

const { Content } = Layout;


interface Props {
    setToken: (token: Token) => void
}

export function Signin({ setToken }: Props) {

    async function onSubmit(values: SigninBody) {
        const response = await signin(values);
        if (isSuccess(response)) {
            setToken(response.data);
        } else {
            let error = 'Wrong credentials';
            if (_.isString(response.error)) {
                error = response.error;
            } else if (_.get(response.error, 'error_description')) {
                error = response.error.error_description;
            }
            return { [FORM_ERROR]: error };
        }
        return
    }

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

    return(
        <Layout className="layout">
            <Content>
                <Row style={{ height: '100vh' }}>
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
                        <Card style={{ marginTop: '10%', paddingTop: '15px' }}>
                            <CustomForm<SigninBody>
                                onSubmit={onSubmit}
                                validate={validate}
                                {...formItemLayout}
                            >
                                {({ submitError, submitting }) => (
                                    <>
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Login</h1>
                                        </Form.Item>
                                        <InputField name="email" placeholder="Email" label="Email" />
                                        <InputField
                                            name="password"
                                            placeholder="Password"
                                            label="Password"
                                            type="password"
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
                                                Login
                                            </Button>
                                            {'  '}
                                            <Link to="/signup">Sign Up</Link>
                                            <br />
                                            <Link to="/reset-password">Forgot password?</Link>
                                        </Form.Item>
                                    </>
                                )}
                            </CustomForm>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}