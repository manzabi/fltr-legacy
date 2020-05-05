import React, {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// const Home = React.lazy(() => import  /* webpackChunkName: "Home" */('./Pages/Home/'));
// const AboutUs = React.lazy(() => import( /* webpackChunkName: "AboutUs" */'./Pages/AboutUs'));
// const HowItWorks = React.lazy(() => import( /* webpackChunkName: "HowItWorks" */'./Pages/HowItWorks'));
// const PricingPage = React.lazy(() => import( /* webpackChunkName: "PricingPage" */'./Pages/Pricing/PricingPage'));
//
// // Auth routes
//
// const Footer = React.lazy(() => import( /* webpackChunkName: "Footer" */'./Components/Footer'));
// const PricingContactPage = React.lazy(() => import( /* webpackChunkName: "PricingContactPage" */'./Pages/Pricing/PricingContactPage'));
// const TermsAndConditions = React.lazy(() => import( /* webpackChunkName: "TermsAndConditions" */'./Pages/TermsAndConditions'));
// const TermsAndConditionsBef2019 = React.lazy(() => import( /* webpackChunkName: "TermsAndConditionsBef2019" */'./Pages/TermsAndConditionsBef2019'));
//
// //new compos
//
// const SignUp = React.lazy(() => import( /* webpackChunkName: "SignUp" */'./newPages/Signup'));
// const LogIn = React.lazy(() => import( /* webpackChunkName: "LogIn" */'./newPages/Login'));
// const EmailSent = React.lazy(() => import( /* webpackChunkName: "EmailSent" */'./newPages/EmailSent'));

import Home from './Pages/Home/';
import AboutUs from './Pages/AboutUs';
import HowItWorks from './Pages/HowItWorks';
import PricingPage from './Pages/Pricing/PricingPage';

// Auth routes

import Footer from './Components/Footer';
import PricingContactPage from './Pages/Pricing/PricingContactPage';
import TermsAndConditions from './Pages/TermsAndConditions';
import TermsAndConditionsBef2019 from './Pages/TermsAndConditionsBef2019';

//new compos

import SignUp from './newPages/Signup';
import LogIn from './newPages/Login';
import EmailSent from './newPages/EmailSent';

const propsNoFooter = {
    footer: false
};

const propsComplete = {
    footer: true
};

const recruiterRoutes = () => (
    <Switch>
        <Route path='/recruiter/signup' component={AddPropsToRoute(SignUp, propsNoFooter)} />
        <Route path='/bizAroundSite/recruiter/signup' component={AddPropsToRoute(SignUp, propsNoFooter)} />
    </Switch>
);

const talentRoutes = () => (
    <Switch>
        <Route path='/talent/signup' component={AddPropsToRoute(SignUp, propsNoFooter)} />
        <Route path='/bizAroundSite/talent/signup' component={AddPropsToRoute(SignUp, propsNoFooter)} />
    </Switch>
);

const loginRoutes = () => (
    <Switch>
        <Route path='/login' component={AddPropsToRoute(LogIn, propsNoFooter)} />
        <Route path='/bizAroundSite/login' component={AddPropsToRoute(LogIn, propsNoFooter)} />
    </Switch>
);

const Router = () => (
    <div>
        <Switch>
            <Route exact path='/' component={AddPropsToRoute(Home, propsComplete)} />
            <Route path='/about' component={AddPropsToRoute(AboutUs, propsComplete)} />
            <Route exact path='/termsandconditions' component={AddPropsToRoute(TermsAndConditions, propsComplete)} />
            <Route exact path='/bizAroundSite/termsandconditions' component={AddPropsToRoute(TermsAndConditions, propsComplete)} />
            <Route exact path='/termsandconditions/bef2019' component={AddPropsToRoute(TermsAndConditionsBef2019, propsComplete)} />
            <Route exact path='/bizAroundSite/termsandconditions/bef2019' component={AddPropsToRoute(TermsAndConditionsBef2019, propsComplete)} />
            <Route path='/how-it-works' component={AddPropsToRoute(HowItWorks, propsComplete)} />
            <Route exact path='/pricing' component={AddPropsToRoute(PricingPage, propsComplete)} />
            <Route exact path='/pricing/:abId' component={AddPropsToRoute(PricingPage, propsComplete)} />
            <Route path='/pricing/contact/:id' component={PricingContactPage} />
            <Route path='/signup/complete' component={AddPropsToRoute(EmailSent, propsNoFooter)} />
            <Route path='/bizAroundSite/signup/complete' component={AddPropsToRoute(EmailSent, propsNoFooter)} />
            {/* routes group */}
            <Route path='/recruiter' component={recruiterRoutes} />
            <Route path='/talent' component={talentRoutes} />
            <Route path='/login' component={loginRoutes} />
            <Route path='/bizAroundSite/login' component={loginRoutes} />
            {/* redirect */}
            <Route exact path='/employers' render={() => (<Redirect to='/' />)} />
            <Route exact path='/bizAroundSite' render={() => (<Redirect to='/' />)} />
            <Route exact path='/bizAroundSite/index' render={() => (<Redirect to='/' />)} />
            <Route exact path='/bizAroundSite/employers' render={() => (<Redirect to='/' />)} />
            <Route path='*' render={() => (<h1>404</h1>)} />
        </Switch>
    </div>
);

export default Router;

const AddPropsToRoute = (WrappedComponent, passedProps) => {
    return (
        class Route extends Component {
            render() {
                let showFooter = true;
                if (passedProps.footer !== undefined) {
                    showFooter = passedProps.footer;
                }

                let props = Object.assign({}, this.props, passedProps);
                return (
                    <div>
                        <WrappedComponent {...props} />
                        {showFooter &&
              <Footer />
                        }
                    </div>
                );
            }
        }
    );
};
