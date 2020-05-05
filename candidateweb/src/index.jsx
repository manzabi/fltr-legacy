import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

import * as Sentry from '@sentry/browser';
 

import ErrorBoundary from './common/components/ErrorBoundary';

import configureStore from './redux/store';
import {Router} from 'react-router';

import history from './utils/history';
const store = configureStore();

const UriError = () => (
    <div className="notfoundContainer">
        <div className="notfound">
            <div className="notfound-404">
                <h1>Oops!</h1>
            </div>
            <h2>400 - Request error</h2>
            <p>The url requested is malformed, please check the url.</p>
        </div>
    </div>
);

//console.log(Sentry);
Sentry.init({
    dsn: 'https://05a6a378f4bb45baa4bd0fc2373e76c5@sentry.io/1294337',
    maxBreadcrumbs: 50,
    environment: process.env.env
});

const container = document.getElementById('root');

const app = (
    <Provider store={store}>
        <Router history={history}>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </Router>
    </Provider>
);

try {
    decodeURIComponent(window.location.href);
    render(app, container);
} catch (error) {
    if (error instanceof URIError) {
        Sentry.configureScope((scope) => {
            scope.setExtra('extra', {errorDescription: 'Malformed url requested caused an error', requestedUrl: window.location.href});
        });
        Sentry.captureException(error.stack);
        render(<UriError />, container);
    } else {
        render(app, container);
    }
}
