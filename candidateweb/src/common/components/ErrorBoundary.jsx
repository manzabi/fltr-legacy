import React, { Component } from 'react';

import * as Sentry from '@sentry/browser';

export default class ErrorBoundary extends Component {
    state = { error: null };

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Sentry.configureScope(scope => {
            Object.keys(errorInfo).forEach(key => {
                scope.setExtra(key, errorInfo[key]);
            });
        });
        Sentry.captureException(error);
    }

    render() {
        if (this.state.error) {
            //render fallback UI
            return (
                <div className="notfoundContainer">
                    <div className="notfound">
                        <div className="notfound-404">
                            <h1>Oops!</h1>
                        </div>
                        <h2>Something went wrong</h2>
                        <p>We will investigate the problem try in in a few minutes.</p>
                    </div>
                </div>
            );
        } else {
            //when there's not an error, render children untouched
            return this.props.children;
        }
    }
}
