This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Custom components

### Custom Form Component

A syntactic sugar alternative of using ReactFinalForm + Antd Form components.
Intended to provide a tiny but powerful wrapper around react-final-form Fields components.

#### A usage example

```
<CustomForm<Partial<ReductionRequest>> // form interface or type should be provided
    onSubmit={onSave}
    validate={validate} // optional
    initialValues={resource} // optional
>
    {({ submitting, form, values }) => ( // render props are the same as Final Form Render Props
        <>
            // ... Fields
            <InputField name="email" placeholder="Contact email" label="Contact email" />
            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
                    Add new
                </Button>
            </Form.Item>
        </>
    )}
</CustomForm>

```

## Styling

### Hierarchy
1. **Default antd styles.**
2. **Custom antd less variables.** Can be set in `frontend/config-overrides.js` using `modifyVars`. There are a full list of availible variables [https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less].
3. **Project-level styles.** Should be located in a file in `frontend/src/styles` and imported in `index.scss`.
4. **Component-level styles.** Should be located in a `styles.css` file in a component folder.


### Custom icons
To add new custom icon create a React.FC in `frontend/src/components/icons/index.tsx`.
To use: `<Icon component={IconNew} />`.