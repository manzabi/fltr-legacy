import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';

import * as Sentry from '@sentry/browser';

import CookieConsent from './Components/CookieConsent';
import Router from './Router';

const isProduction = process.env.env === 'production';

class App extends Component {
    componentWillMount () {
        Sentry.init({
            dsn: 'https://1fa644f01ad54ddb93c8a4060319ab68@sentry.io/1212763',
            environment: process.env.env,
            release: process.env.VERSION,
            debug: !isProduction
        });
        let userId;
        if (window.localStorage) {
            if (!window.localStorage.getItem('user')) {
                userId = 'guest-' + Math.floor((Math.random() * 9999) + 1);
                window.localStorage.setItem('user', userId);
            } else {userId = window.localStorage.getItem('user');}
        } else {userId = 'guest-' + Math.floor((Math.random() * 9999) + 1);}
        if (isProduction) {
        // console.log('production');
            ReactGA.initialize('UA-69793741-1', {
                debug: false,
                titleCase: false,
                gaOptions: {
                    userId: userId
                }
            });
        } else {
            ReactGA.initialize('UA-69793741-2', {
                debug: true,
                titleCase: false,
                gaOptions: {
                    userId: userId
                }
            });
        }
    }


    render () {
        return (
            <div id='project-root' style={{opacity: 0}}>
                <Router />
                <CookieConsent />
                <AnalyticsTracker path={this.props.location.pathname} campaign={this.props.location.search} />
            </div>
        );
    }
}

export default withRouter(App);

class AnalyticsTracker extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            location: ''
        };
        AnalyticsTracker.logPageView = AnalyticsTracker.logPageView.bind(this);
    }
    componentDidMount () {
        const pathName = window.location.pathname + window.location.search;
        if (pathName !== this.state.location) {
            AnalyticsTracker.logPageView(pathName);
            this.setState({location: pathName});
        }
    }
    componentWillReceiveProps (newProps) {
        const {campaign, path} = newProps;
        // console.log(campaign, path);
        const pathName = path + campaign;
        if (pathName !== this.state.location) {
            AnalyticsTracker.logPageView(pathName);
            this.setState({location: pathName});
        }
    }
    static logPageView (pageName) {
        // console.log('Pagename is', pageName);
        ReactGA.set({page: pageName});
        ReactGA.pageview(pageName);
    }
    
    render () {
        return null;
    }
}
