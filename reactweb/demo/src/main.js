
require('es6-promise').polyfill();

import React from 'react';

import routes from './routes';
import render, {
    setupReducers,
    applyMiddleware,
    replaceReducers
} from '@sketchpixy/rubix/lib/node/redux-router';

import l20n from '@sketchpixy/rubix/lib/L20n';

import createLogger from 'redux-logger';

import reducers from './redux/reducers';
import { getCookie } from './common/utils';

setupReducers(reducers);

if (process.env.NODE_ENV !== 'production') {
    const logger = createLogger();
    applyMiddleware(logger);
}
if (window.Raven) {
    window.Raven.config('https://44505a0a9c81403ea22efbbec39cf5a4@sentry.io/1212720', {
    // All extra configuration for sentry
        environment: process.env.ENV,
        release: process.env.VERSION || 'DEVELOPMENT_VERSION',
        dataCallback: function(data) {
            // do something to data
            const sentryUserId = getCookie('uuid_sentry');
            data.extra = {...data.extra, sentryUserId};
            const userContext = {
                id: `${sentryUserId}_SUID`
            };
            if (sentryUserId) {window.Raven.setUserContext(userContext);}
            return data;
        }
    }).install();
}
const mapsAPI = document.createElement('script');
if (process.env.ENV !== 'development') {
    mapsAPI.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCPpGfG8tgjTodA9TpNY9EK-qbda00TK78&libraries=places&language=en';
} else {
    mapsAPI.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDhZ59btpwexEJc1x2xqXtuZgZCRTL498U&libraries=places&language=en';
}
document.head.appendChild(mapsAPI);
if (window.Messenger) {
    window.Messenger.options = {
        theme: 'flat'
    };
}
l20n.initializeLocales({
    'locales': ['en-US', 'fr', 'it', 'ge', 'ar', 'ch'],
    'default': 'en-US'
});

render(routes, () => {
    l20n.ready();
});

if (module.hot) {
    module.hot.accept('./routes', () => {
        // reload routes again
        require('./routes').default;
        render(routes);
    });

    module.hot.accept('./redux/reducers', () => {
        // reload reducers again
        let newReducers = require('./redux/reducers');
        replaceReducers(newReducers);
    });
}
