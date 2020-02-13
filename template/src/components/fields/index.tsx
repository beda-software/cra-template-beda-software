import {
    Checkbox as ACheckbox,
    Radio as ARadio,
    Form,
    Input as AInput,
    Icon,
    DatePicker,
    Select,
    InputNumber,
    Tooltip,
} from 'antd';
import { FormItemProps } from 'antd/lib/form';
import moment from 'moment';
import * as _ from 'lodash';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { Field } from 'react-final-form';
import {
    formatFHIRDate,
    formatFHIRDateTime,
    formatHumanDate,
    formatHumanDateTime,
    humanDate,
    humanDateTime,
    parseFHIRDate,
    parseFHIRDateTime,
} from 'src/utils/date';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
// @ts-ignore;
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Money } from 'src/contrib/aidbox';
import './styles.css';

export { SelectField } from './SelectField';

export function getFormItemProps(meta: any): Pick<FormItemProps, 'validateStatus' | 'help'> {
    const hasOwnError = meta.touched && !meta.valid && _.isString(meta.error);
    const hasSubmitError = meta.touched && !meta.valid && !meta.dirtySinceLastSubmit && _.isString(meta.submitError);
    const help = (_.isString(meta.error) && meta.error) || (_.isString(meta.submitError) && meta.submitError);
    const validateStatus = hasOwnError || hasSubmitError ? 'error' : 'validating';

    return { help, validateStatus };
}

interface FieldProps {
    fieldProps?: any;
    formItemProps?: any;
    name: string;
    label?: string | React.ReactNode;
    className?: string;
    [x: string]: any;
}

interface InputFieldProps {
    helpText?: string;
    placeholder?: string;
    append?: string;
    allowClear?: boolean;
}

export function InputField({
    name,
    fieldProps,
    formItemProps,
    label,
    helpText,
    type,
    ...props
}: FieldProps & InputFieldProps) {
    return (
        <Field name={name} {...fieldProps} type={type}>
            {({ input, meta }) => {
                const Component = type === 'textarea' ? AInput.TextArea : AInput;

                return (
                    <Form.Item {...formItemProps} label={label} {...getFormItemProps(meta)} extra={helpText}>
                        <Component {...input} {...props} />
                    </Form.Item>
                );
            }}
        </Field>
    );
}

interface FileUploadInputProps {
    disabled?: boolean;
    placeholder?: string | React.ReactNode;
    accept?: string;
    className?: string;
    onUpload: (files: File[]) => void;
}

export function FileUploadInput({
    disabled,
    className,
    placeholder = `Drag 'n' drop some files here, or click to select files`,
    accept = 'image/*, application/pdf',
    onUpload,
}: FileUploadInputProps) {
    return (
        <Dropzone disabled={disabled} accept={accept} onDropAccepted={(files: any[]) => onUpload(files)}>
            {({ getRootProps, getInputProps }) => (
                <section {...getRootProps()} className="ant-upload ant-upload-drag">
                    <span className="ant-upload ant-upload-btn">
                        <div className="ant-upload-drag-container">
                            <p className="ant-upload-drag-icon">
                                <input {...getInputProps()} />

                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text"> {placeholder}</p>
                        </div>
                    </span>
                </section>
            )}
        </Dropzone>
    );
}

interface ChooseFieldOption<T> {
    value: T;
    label: string;
    icon?: { type?: string; component?: React.FC };
}

interface ChooseFieldProps<T> {
    helpText?: string;
    multiple?: boolean;
    options: Array<ChooseFieldOption<T>>;
    isEqual?: (first: T, second: T) => boolean;
    renderOptionContent?: (option: ChooseFieldOption<T>, index: number, value: T | T[]) => React.ReactNode;
    radioButton?: boolean;
    onChange?: (v: any) => void;
    className?: string;
}

export function ChooseField<T = any>({
    fieldProps,
    formItemProps,
    label,
    helpText,
    name,
    multiple,
    options,
    renderOptionContent,
    isEqual: comparator,
    radioButton,
    onChange,
    className,
}: FieldProps & ChooseFieldProps<T>) {
    const isEqual = comparator ? comparator : _.isEqual;

    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                if (multiple) {
                    return (
                        <Form.Item
                            {...formItemProps}
                            label={label}
                            {...getFormItemProps(meta)}
                            extra={helpText}
                            className={className}
                        >
                            {_.map(options, (option, index) => {
                                const isSelected = _.findIndex(input.value, (x: T) => isEqual(x, option.value)) !== -1;

                                return (
                                    <React.Fragment key={`${option.value}-${index}`}>
                                        <ACheckbox
                                            checked={isSelected}
                                            onChange={(event: any) => {
                                                let value;
                                                if (event.target.checked) {
                                                    value = [...input.value, option.value];
                                                } else {
                                                    value = _.reject(input.value, (x) => isEqual(x, option.value));
                                                }
                                                input.onChange(value);
                                                if (onChange) {
                                                    onChange(value);
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </ACheckbox>
                                        {renderOptionContent && renderOptionContent(option, index, input.value)}
                                    </React.Fragment>
                                );
                            })}
                        </Form.Item>
                    );
                } else {
                    const RadioElement = radioButton ? ARadio.Button : ARadio;
                    return (
                        <Form.Item {...formItemProps} label={label} {...getFormItemProps(meta)}>
                            {_.map(options, (option, index) => {
                                const isSelected = isEqual(input.value, option.value);
                                return (
                                    <React.Fragment key={`${option.value}-${index}`}>
                                        <RadioElement
                                            checked={isSelected}
                                            onChange={(event) => {
                                                const value = event.target.checked ? option.value : undefined;
                                                input.onChange(value);
                                                if (onChange) {
                                                    onChange(value);
                                                }
                                            }}
                                        >
                                            {option.icon && (
                                                <Icon {...option.icon} className="radio-element-button-icon" />
                                            )}
                                            {option.label}
                                        </RadioElement>
                                        {renderOptionContent && renderOptionContent(option, index, input.value)}
                                    </React.Fragment>
                                );
                            })}
                        </Form.Item>
                    );
                }
            }}
        </Field>
    );
}

export interface SimpleSelectFieldOption {
    label: string;
    value: string;
}

export function SimpleSelectField({
    fieldProps,
    formItemProps,
    name,
    label,
    helpText,
    options,
    ...props
}: FieldProps & { allowClear?: boolean; options: SimpleSelectFieldOption[] }) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <Form.Item {...formItemProps} extra={helpText} label={label} {...getFormItemProps(meta)}>
                        <Select {...input} {...props} value={input.value ? input.value : undefined}>
                            {_.map(options, ({ label, value }, index) => (
                                <Select.Option key={index} value={value}>
                                    {label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            }}
        </Field>
    );
}

export function CheckBoxField({ fieldProps, formItemProps, name, label, helpText, ...props }: FieldProps) {
    return (
        <Field name={name} type="checkbox" {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <Form.Item {...formItemProps} extra={helpText} {...getFormItemProps(meta)}>
                        <ACheckbox {...input} {...props}>
                            {label}
                        </ACheckbox>
                    </Form.Item>
                );
            }}
        </Field>
    );
}

interface DateTimePickerFieldProps extends DatePickerProps {}

export function DateTimePickerField({
    fieldProps,
    formItemProps,
    name,
    label,
    helpText,
    showTime,
    ...props
}: DateTimePickerFieldProps & FieldProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [textInputValue, setTextInputValue] = React.useState<string | undefined>(undefined);

    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                const getRawFieldValue = () => {
                    if (!input.value) {
                        return undefined;
                    }
                    if (showTime) {
                        return parseFHIRDateTime(input.value);
                    } else {
                        return parseFHIRDate(input.value);
                    }
                };

                const getDisplayFieldValue = () => {
                    if (!input.value) {
                        return undefined;
                    }

                    if (showTime) {
                        return formatHumanDateTime(input.value);
                    } else {
                        return formatHumanDate(input.value);
                    }
                };
                const onFieldChange = (newValue: moment.Moment | null) => {
                    if (newValue && newValue.isValid()) {
                        input.onChange(showTime ? formatFHIRDateTime(newValue) : formatFHIRDate(newValue));
                    } else {
                        input.onChange(undefined);
                    }
                };

                return (
                    <Form.Item {...formItemProps} label={label} extra={helpText} {...getFormItemProps(meta)}>
                        {isOpen ? (
                            <DatePicker
                                placeholder=""
                                suffixIcon={<span />}
                                showTime={showTime}
                                open={isOpen}
                                onOpenChange={(status) => setIsOpen(status)}
                                {...props}
                                format={showTime ? humanDateTime : humanDate}
                                value={getRawFieldValue()}
                                onChange={(date) => {
                                    onFieldChange(date);
                                    setIsOpen(false);
                                }}
                            />
                        ) : (
                            <AInput
                                className={props.className}
                                allowClear={props.allowClear}
                                placeholder={props.placeholder || 'Input date'}
                                name={input.name}
                                value={!_.isUndefined(textInputValue) ? textInputValue : getDisplayFieldValue()}
                                onChange={(event) => setTextInputValue(event.target.value)}
                                onBlur={(event) => {
                                    onFieldChange(moment(event.target.value, 'MM.DD.YYYY'));

                                    setTextInputValue(undefined);
                                    input.onBlur(event);
                                }}
                                onFocus={input.onFocus}
                                suffix={
                                    <Tooltip title="Select date">
                                        <Icon
                                            type="calendar"
                                            style={{ color: 'rgba(0,0,0,.45)' }}
                                            onClick={() => setIsOpen(true)}
                                        />
                                    </Tooltip>
                                }
                            />
                        )}
                    </Form.Item>
                );
            }}
        </Field>
    );
}

interface PhoneInputFieldProps {
    onlyCountries?: string[];
    allowClear?: boolean;
}

export function PhoneInputField({
    fieldProps,
    formItemProps,
    name,
    label,
    helpText,
    onlyCountries,
    ...props
}: PhoneInputFieldProps & FieldProps) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <Form.Item {...formItemProps} label={label} extra={helpText} {...getFormItemProps(meta)}>
                        <ReactPhoneInput
                            {...props}
                            defaultCountry="us"
                            {...input}
                            onlyCountries={onlyCountries}
                            style={{ width: '10px' }}
                        />
                    </Form.Item>
                );
            }}
        </Field>
    );
}

export function MoneyField({
    name,
    fieldProps,
    label,
    formItemProps,
    ...props
}: FieldProps & { allowClear?: boolean }) {
    return (
        <Field
            name={name}
            {...fieldProps}
            parse={(value: any): Money => ({
                value: value ? Math.round(parseFloat(value) * 100) / 100 : 0,
                currency: 'USD',
            })}
            format={(value: Money): string => (value ? String(Math.round((value.value || 0) * 100) / 100) : '')}
        >
            {({ input, meta }) => {
                return (
                    <Form.Item label={label} {...formItemProps} {...getFormItemProps(meta)}>
                        <InputNumber
                            {...input}
                            {...props}
                            style={{ width: '150px' }}
                            formatter={(input) => `$ ${input}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(input) => input!.replace(/\$\s?|(,*)/g, '')}
                            precision={2}
                            step={0.01}
                        />
                    </Form.Item>
                );
            }}
        </Field>
    );
}
