import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';
import { Router } from 'react-router-dom';
import history from './Utils/history';

import ScrollToTop from './Utils/ScrollToTop';
import App from './App';
import './sass/index.scss';

render(
    <Router history={history}>
        <ScrollToTop>
            <App />
        </ScrollToTop>
    </Router>,
    document.getElementById('root')
);
