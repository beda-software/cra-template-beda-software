import * as _ from 'lodash';
import * as React from 'react';
import { Spin } from 'antd';

import {
    isFailure,
    isLoading,
    isSuccess,
    loading,
    notAsked,
    RemoteData,
    success,
} from 'src/embed/aidbox-react/libs/remoteData';

interface SuccessRenderProps<T> {
    data: T;
    setData: (newData: T) => void;
}
type SuccessRender<T> = (props: SuccessRenderProps<T>) => React.ReactNode;
type FailureRender<E> = (error: E) => React.ReactNode;
type LoadingRender = () => React.ReactNode;
interface RenderMap<T, E> {
    success: SuccessRender<T>;
    failure?: FailureRender<E>;
    loading?: LoadingRender;
}

type Children<T, E> = RenderMap<T, E> | SuccessRender<T>;

interface Props<T, E> {
    resolve: () => Promise<RemoteData<T>>;
    deps?: Readonly<Array<any>>;
    children: Children<T, E>;
}

function isRenderMap<T, E>(children: Children<T, E>): children is RenderMap<T, E> {
    return _.isPlainObject(children);
}

export class Resolver<T, E = any> extends React.Component<
    Props<T, E>,
    { response: RemoteData<T>; isPending: boolean }
> {
    constructor(props: Props<T, E>) {
        super(props);

        this.state = {
            response: notAsked,
            isPending: false,
        };
    }

    public async doResolve() {
        const { resolve } = this.props;

        // TODO: isPending is experimental
        this.setState({ isPending: true, response: loading });
        const response = await resolve();
        this.setState({ response, isPending: false });
    }

    public async componentDidMount() {
        this.doResolve();
    }

    public async componentDidUpdate(prevProps: Props<T, E>) {
        if (!_.isEqual(prevProps.deps, this.props.deps)) {
            this.doResolve();
        }
    }

    public renderLoading() {
        const { children } = this.props;

        if (isRenderMap(children) && children.loading) {
            return children.loading();
        }

        return <Spin />;
    }

    public renderFailure(error: E) {
        const { children } = this.props;

        if (isRenderMap(children) && children.failure) {
            return children.failure(error);
        }

        return <div>Unable to load resource {JSON.stringify(error)}</div>;
    }

    public renderSuccess(props: SuccessRenderProps<T>) {
        const { children } = this.props;

        if (isRenderMap(children)) {
            return children.success(props);
        }

        return children(props);
    }

    public renderContent(response: RemoteData<T>) {
        if (isFailure(response)) {
            return this.renderFailure(response.error);
        }

        if (isSuccess(response)) {
            return this.renderSuccess({
                data: response.data,
                setData: (newData) => this.setState({ response: success(newData) }),
            });
        }

        return null;
    }

    public render() {
        const { isPending, response } = this.state;

        return (
            <div style={{ position: 'relative' }}>
                {this.renderContent(response)}
                {isPending || isLoading(response) ? (
                    <div style={{ position: 'absolute', top: '50%', left: '50%' }}>{this.renderLoading()}</div>
                ) : null}
            </div>
        );
    }
}
