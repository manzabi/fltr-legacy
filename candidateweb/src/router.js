import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { doHandleAuth, doLogout } from './utils/authUtils';

import WithAuthorization from './components/AuthHOC/WithAuthorization';

import PlayerKillerProcess from './pages/killerQuestionTest/KillerQuestionProcess';

import TestManagerForOpportunity2 from './pages/attitudeTest/newComponents/AttitudeTestManager';


import talentLanding from './pages/talent/TalentLanding';

import OpportunityListPage from './pages/talent/TalentOpportunityListPage';
import TalentOpportunityDetailPage from './pages/talent/TalentOpportunityDetailPage';
import TalentOpportunityChallengeAcceptPage from './pages/talent/TalentOpportunityChallengeAcceptPage';
import TalentOpportunityProcessInvitationPage from './pages/talent/TalentOpportunityProcessInvitationPage';
import Header from './components/Header';
import ErrorBoundary from './common/components/ErrorBoundary';
import TalentOpportunityAttitudeLeaderboard from './pages/talent/TalentOpportunityAttitudeLeaderboard';
class Router extends Component {
    componentDidMount() {
        // just for testing logout uncomment this line
        // doLogout();
        doHandleAuth(this.props.history);
    }



    render() {
        const NoMatch = () => (
            <div className="notfoundContainer">
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>Oops!</h1>
                    </div>
                    <h2>404 - Page not found</h2>
                    <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                </div>
            </div>
        );

        return (
            <div>
                <ErrorBoundary>
                    <div id='app-root'>
                        <Switch>
                            <RouterWrapper exact path='/' component={WithAuthorization(talentLanding)} />
                            <RouterWrapper exact path='/landing' component={WithAuthorization(talentLanding)} />
                            <RouterWrapper exact path='/dashboard' component={WithAuthorization(OpportunityListPage)} />

                            <RouterWrapper exact path='/opportunity/:opportunityId/process' component={WithAuthorization(TalentOpportunityDetailPage)} />
                            <RouterWrapper exact path='/opportunity/:opportunityId/process/:processId/accept' component={WithAuthorization(TalentOpportunityChallengeAcceptPage)} />
                            <RouterWrapper exact path='/opportunity/:opportunityId/process/:id/questions' component={WithAuthorization(PlayerKillerProcess)} />
                            <RouterWrapper exact path='/opportunity/:opportunityId/process/:processId/attitude' component={WithAuthorization(TestManagerForOpportunity2)} />

                            <RouterWrapper exact path='/opportunity/:opportunityId/attitude/leaderboard' component={WithAuthorization(TalentOpportunityAttitudeLeaderboard)} />

                            {/*Dummy route*/}
                            {/* GUEST ROUTES */}
                            <RouterWrapper header={false} exact path='/opportunity/:opportunityId/process/invitation/:code' component={TalentOpportunityProcessInvitationPage} />

                            {/* 404 */}
                            <RouterWrapper component={NoMatch} />
                        </Switch>
                    </div>
                </ErrorBoundary>
            </div>
        );
    }
}

export default withRouter(Router);

const RouterWrapper = ({ header = true, component: Children, ...rest }) => {

    return (
        <Route {...rest} component={(props) => (
            <Fragment>
                {header && <Header />}
                {<Children {...props} />}
            </Fragment>
        )} />
    );
};