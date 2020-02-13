import * as React from 'react';
import * as _ from 'lodash';

import { Form } from 'antd';
import { Form as FinalForm, FormRenderProps, FormProps } from 'react-final-form';
import { trimWhitespaces, removeEmptyValues } from 'src/utils/form';
import { FormApi, SubmissionErrors } from 'final-form';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface Props<R, UI> extends Omit<FormProps<R & { _ui?: UI }>, 'onSubmit'> {
    onSubmit: (
        values: R,
        _ui: UI | undefined,
        form: FormApi<R & { _ui?: UI }>
    ) => SubmissionErrors | Promise<SubmissionErrors | undefined> | undefined | void;
    children: (formRenderProps: FormRenderProps<R & { _ui?: UI }>) => React.ReactNode;
}

export function CustomForm<R = any, UI = any>(props: Props<R, UI>) {
    const { onSubmit, children, ...rest } = props;

    return (
        <FinalForm<R & { _ui?: UI }>
            onSubmit={(values, form) =>
                onSubmit(trimWhitespaces(removeEmptyValues(_.omit(values, ['_ui']))), values._ui, form)
            }
            initialValuesEqual={_.isEqual}
            {...rest}
            render={(formRenderProps) => (
                <Form
                    onSubmit={(event) => {
                        event.preventDefault();
                        formRenderProps.handleSubmit();
                    }}
                >
                    {children(formRenderProps)}
                </Form>
            )}
        />
    );
}
