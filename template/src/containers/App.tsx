import React from 'react';
import {Route, Switch, Router, Redirect} from 'react-router-dom';

import {SessionContext} from './SessionContext';

import {history} from "src/services/history";
import {getUserRole, UserRole} from "src/services/role";
import {getUserInfo, setPassword, confirm} from "src/services/auth";
import {retrieveToken, removeToken, saveToken} from "src/services/token";
import {Resolver} from "src/components/ResolverNew";
import {RoleSwitch} from "src/components/RoleSwitch";
import {SuperAdminApp} from "src/containers/SuperAdminApp";
import {UnprivilegedApp} from "src/containers/UnprivilegedApp";
import {ResetPassword} from 'src/containers/ResetPassword';
import {SetPassword} from "src/containers/SetPassword";
import {Signup} from "src/containers/Signup";
import {Signin} from "src/containers/Signin";
import {Token} from "src/embed/aidbox-react/services/token";
import {
    resetInstanceToken,
    setInstanceBaseURL,
    setInstanceToken
} from "src/embed/aidbox-react/services/instance";
import {baseURL} from "src/services/constants";


export function App() {

    React.useEffect(() => {
        setInstanceBaseURL(baseURL);
        const globalToken = retrieveToken()
        if (globalToken) {
            setInstanceToken(globalToken)
        }
    }, [])

    const [appToken, setAppToken] = React.useState<Token | undefined>(retrieveToken())

    const setToken = (token: Token) => {
        setInstanceToken(token);
        saveToken(token);
        setAppToken(token);


    }

    const resetToken = () => {
        resetInstanceToken();
        removeToken();
        setAppToken(undefined);
    }

    function renderAnonymousRoutes() {
        return (
            <Switch>
                <Route
                    path="/signup" exact
                    render={(props) => <Signup {...props}/>}
                />
                <Route
                    path="/signin" exact>
                    <Signin setToken={setToken}
                    />
                </Route>
                <Route path="/reset-password" exact
                       render={(props) => <ResetPassword {...props}/>}/>
                <Route
                    path="/set-password/:code"
                    exact
                    render={(props) => (
                        <SetPassword {...props} service={setPassword}/>
                    )}
                />
                <Route
                    path="/confirm/:code"
                    exact
                    render={(props) => (
                        <SetPassword {...props} service={confirm}/>
                    )}
                />{' '}
                <Redirect
                    to={{
                        pathname: '/signin',
                        state: {referrer: history.location.pathname},
                    }}
                />
            </Switch>
        )
    }

    function renderAuthenticatedRoutes() {
        return (
            <Switch>
                <Route
                    path="/app"
                    render={() => (
                        <Switch>
                            <Resolver resolve={getUserInfo}>
                                {{
                                    success: ({data: user}) => (
                                        <SessionContext.Provider
                                            value={{user, role: getUserRole(user)}}>
                                            <RoleSwitch>
                                                {{
                                                    [UserRole.SuperAdminRole]: ({user}) => (
                                                        <SuperAdminApp logout={resetToken}/>
                                                    ),
                                                    default: () => (
                                                        <UnprivilegedApp logout={resetToken}/>
                                                    ),
                                                }}
                                            </RoleSwitch>
                                        </SessionContext.Provider>
                                    ),
                                    failure: () => (
                                        <div>
                                            Something went wrong while loading your user data.
                                            Refresh the page or{' '}
                                            <a onClick={() => resetToken()}>logout</a> and login
                                            again.
                                        </div>
                                    ),
                                }}
                            </Resolver>
                        </Switch>
                    )}
                />
                <Redirect
                    to={
                        history.location.state && history.location.state.referrer
                            ? history.location.state.referrer
                            : '/app'
                    }
                />
            </Switch>
        )
    }

    function renderRoutes() {
        if (appToken) {
            return renderAuthenticatedRoutes()
        }
        return renderAnonymousRoutes()
    }

    return (
        <Router history={history}>
            <Switch>
                {renderRoutes()}
            </Switch>
        </Router>
    );
}
