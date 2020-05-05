import React, {Component} from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';


/* Functions */
import {fetchUserInfo, checkUserUpdate} from './redux/actions/userActions';
import {doHandleDashboardBoarding} from './common/utils';
import {closeFullScreenFix} from './common/uiUtils';

/* Common Pages */
import NotFoundPage from './routes/common/NotFoundPage';
import ServiceUnavailable from './routes/common/ServiceUnavailable';
import NotificationPage from './routes/common/NotificationPage';

/* Expert Pages */
import ExpertLanding from './routes/expert/ExpertLanding';
import Dashboard from './routes/expert/ExpertDashboard';
import BankInformation from './fltr/expert/bankInfo/BankInformation';
import Invite from './fltr/expert/invitation/Invite';
import ExpertReviewPage from './routes/expert/ExpertReviewPage';
import ExpertReviewUserPage from './routes/expert/ExpertReviewUserPage';
import ExpertPendingInvitationsPage from './routes/expert/ExpertPendingInvitationsPage';
import ExpertActiveChallengesPage from './routes/expert/ExpertActiveChallengesPage';
import ExpertArchivedChallengesPage from './routes/expert/ExpertArchivedChallengesPage';

/* Template pages */
import ChallengeTemplateCreationPage from './fltr/expert/templates/ChallengeTemplateCreationPage';
import ChallengeTemplateEditPage from './fltr/expert/templates/ChallengeTemplateEditPage';
import ChallengeTemplatesPage from './fltr/expert/templates/ChallengeTemplatesPage';

/* Recruiter Pages */
import recruiterLanding from './routes/recruiter/recruiterLanding';
import RecruiterDashboard from './routes/recruiter/RecruiterDashboard';
import RecruiterCompanyUpgradePage from './routes/recruiter/company/RecruiterCompanyUpgradePage';
import RecruiterCompanyUpgradeContactSuccess from './routes/recruiter/company/RecruiterCompanyUpgradeContactSuccess';
import RecruiterCompanyUpgradeContactPage from './routes/recruiter/company/RecruiterCompanyUpgradeContactPage';
import RecruiterCompanyUpgradeSuccessPage from './routes/recruiter/company/RecruiterCompanyUpgradeSuccessPage';
import RecruiterOpportunityCreatePage from './routes/recruiter/opportunity/RecruiterOpportunityCreatePage';
import RecruiterChallengeLivePage from './fltr/recruiter/opportunity/RecruiterChallengeLivePage';
import RecruiterOpportunityProvidersPage from './fltr/recruiter/opportunity/RecruiterOpportunityProvidersPage';
import ChallengeConfigurationRouter from './routes/recruiter/challenge/ChallengeConfigurationRouter';

import RecruiterOpportunityTrello from './fltr/recruiter/recruiterello/RecruiterOpportunityTrello';
import OpportunityChallengeDetail from './fltr/recruiter/challenge/OpportunityChallengeDetail';
import ChallengeAnswerPage from './routes/recruiter/challenge/ChallengeAnswerPage';
import RecruiterBoardingFlowPage from './routes/recruiter/boarding/RecruiterBoardingFlowPage';
import RecruiterFormKillerQuestionsCreate from './routes/recruiter/process/RecruiterFormKillerQuestionsCreate';
import RecruiterFormKillerQuestionsEdit from './routes/recruiter/process/RecruiterFormKillerQuestionsEdit';

import ProcessPage from './routes/recruiter/process/ProcessPage';
import TestManagerResult from './fltr/test/components/TestManagerResult';

import inspectlet from './fltr/utils/inspectlet';
import ExpertProfileEditPage from './routes/expert/profile/ExpertProfileEditPage';
import OpportunityChallengeConfigurationTimeline from './fltr/recruiter/opportunityConfiguration/OpportunityChallengeConfigurationTimeline';
import TemplateMailEditor from './common/components/TemplateMailEditor';
import LayoutTest from './layout/LayoutTest';
import ProfileCreationPage from './layout/pages/ProfileCreation';
import CompanyDetails from './layout/pages/CompanyDetails';
import ChooseTemplate from './fltr/recruiter/opportunity/RecruiterTemplatePage';

import OpportunityTemplatePreviewPage from './fltr/recruiter/opportunityConfiguration/OpportunityTemplateList/OpportunityTemplatePreviewPage';
import CrazyHeader from './layout/header/Header';
import CrazySidebar from './layout/sidebar/CrazySidebar';
import {scrollFix} from './fltr/navigation/NavigationManager';

import TestFullscreenFile from './layout/TestFullscreenFile';
import RecruiterOpportunityCandidateDetail from './fltr/recruiter/candidate/RecruiterOpportunityCandidateDetail';
import VersionControl from './common/components/VersionControl';

const isProduction = process.env.ENV === 'production';

function logPageView(pageName) {
    ReactGA.set({page: pageName});
    ReactGA.pageview(pageName);
}

// class RouteWithProps extends Component {
//     componentDidMount() {
//         debugger
//     }
//
//     render() {
//         const {exact, path, component: Component, ...rest} = this.props;
//         debugger
//         return <Route exact={exact} path={path} render={() => <Component {...rest} />}/>;
//     }
// };

const Authorization = (allowedRoles, ...rest) =>
    (WrappedComponent) =>
    @connect(({user}) => ({user}))
        class WithAuthorization extends Component {

        constructor(props) {
            super(props);
            this.state = {
                user: {
                    isJudge: this.props.user.item.isJudge,
                    isRecruiter: this.props.user.item.isRecruiter
                }
            };
        }

        render() {
            let allowed = this.state.user[allowedRoles];
            if (allowed) {
                return <WrappedComponent {...this.props} />;
            } else {
                return <h1>You are not authorized to view this content</h1>;
            }
        }

    };

const Recruiter = Authorization(['isRecruiter']);
const Judge = Authorization(['isJudge']);

@connect(({
    user,
    userStatus,limitBannerStatus,
    mainScrollStatus
}) => ({
    user,
    userStatus,
    limitBannerStatus,
    mainScrollStatus
}))
class App extends Component {

    componentWillMount () {
        let guest = this.getGuest();
        if (!guest){
            // hubspotCall();
            inspectlet();
            doHandleDashboardBoarding();
            if (this.props.user.item == null) {
                this.props.dispatch(checkUserUpdate(this.props.userStatus, this.executeAnalytics));
            } else {
                this.executeAnalytics();
            }
        }
    }

    executeAnalytics = () => {
        const {id} = this.props.user.item;
        if (window.Raven) {
            window.Raven.setUserContext({
                id
            });
        }

        if (isProduction) {
            ReactGA.initialize('UA-69793741-1', {
                debug: false,
                titleCase: false,
                gaOptions: {
                    userId: id
                }
            });
        }else{
            ReactGA.initialize('UA-69793741-2', {
                debug: true,
                titleCase: false,
                gaOptions: {
                    userId: id
                }
            });
        }
    };

    getGuest = () => {
        let guest = false;
        if (this.props.route.guest !== undefined){
            // console.log('ROUTE PARAM - fullScreen : ' + this.props.route.fullScreen);
            guest = this.props.route.guest;
        }
        return guest;
    };

    render() {
        let fullScreen = false;
        let showSidebar = true;
        const {limitBannerStatus, mainScrollStatus} = this.props;
        if (this.props.route.fullScreen !== undefined){
            fullScreen = this.props.route.fullScreen;
        }

        if (fullScreen) showSidebar = false;
        if (this.props.route.hideSidebar) {
            showSidebar = false;
        } else if (this.props.route.showSidebar !== undefined){
            showSidebar = this.props.route.showSidebar;
        }
        if (this.props.user.item) {
            return (
                <VersionControl>
                    <MainContainer {...this.props} >
                        <PageController />
                        <AnalyticsTracker />
                        {showSidebar &&
                            <CrazySidebar
                                bannerStatus={limitBannerStatus && !fullScreen}
                            />
                        }
                        {!fullScreen &&
                            <CrazyHeader
                                noSidebar={!showSidebar && !fullScreen}
                            />
                        }
                        <div
                            id='main-body'
                            className={`${fullScreen ? 'fullscreen-body' : limitBannerStatus && !fullScreen ? 'banner-active' : ''} ${mainScrollStatus ? '' : 'no-scroll'} ${!showSidebar && !fullScreen ? 'no-sidebar' : ''}`}
                        >
                            {this.props.children}
                        </div>
                    </MainContainer>
                </VersionControl>
            );

        } else {
            let guest = this.getGuest();

            if (!guest) {
                return <div>Loading...</div>;
            } else {
                return (
                    <VersionControl>
                        <MainContainer {...this.props} >
                            <div id='body'>
                                <Grid>
                                    <Row>
                                        <Col xs={12} className="fullContent noPadding">
                                            {this.props.children}
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                        </MainContainer>
                    </VersionControl>
                );
            }
        }
    }
}

@withRouter
class AnalyticsTracker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: ''
        };
    }

    componentWillReceiveProps() {
        if(this.props.location.pathname != this.state.location) {
            // console.log("AnalyticsTracker");
            this.trackPage(this.props.location.pathname);
            this.setState({location: this.props.location.pathname});
        }
    }

    trackPage (page) {
        if (!window.ga) {
            setTimeout(() => {
                this.trackPage(page);
            }, 100);
        } else {
            logPageView(page);
        }
    }

    render(){
        return null;
    }
}

@withRouter
class PageController extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            location: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname != this.state.location){
            this.setState({location: this.props.location.pathname});
            if (this.state.location !== '') {
                scrollFix();
                closeFullScreenFix();
            }
        }
    }

    render(){
        return null;
    }
}

/**showSidebar
 * Includes Sidebar, Header and Footer.
 */


const judgeRoutes = (

    <Route component={App} >
        <Route path='landing' component={Judge(ExpertLanding)} />
        <Route path='dashboard' component={Judge(Dashboard)} />
        <Route path="profile/edit" component={Judge(ExpertProfileEditPage)} back={true}/>
        <Route path='bankInfo' component={Judge(BankInformation)} />
        <Route path='invite' component={Judge(Invite)} />
        <Route path="opportunity/:id/review" component={Judge(ExpertReviewPage)}/>
        <Route path="opportunity/:id/user/:userId/review" component={Judge(ExpertReviewUserPage)}/>
        <Route path="opportunity/:id/user/:userId/review/:edit" component={Judge(ExpertReviewUserPage)}/>
        <Route path="opportunity/pending" component={Judge(ExpertPendingInvitationsPage)}/>
        <Route path="opportunity/active" component={Judge(ExpertActiveChallengesPage)}/>
        <Route path="opportunity/archived" component={Judge(ExpertArchivedChallengesPage)}/>
        <Route path="templates" component={Judge(ChallengeTemplatesPage)}/>
        <Route path="template/create" component={Judge(ChallengeTemplateCreationPage)}/>
        <Route path="template/:id/edit" component={Judge(ChallengeTemplateEditPage)} update={true}/>
    </Route>

);

const expertOnlyHeaderRoutes = (
    <Route component={App} showSidebar={false}>
        <Route path="profile/complete" component={Judge(ExpertProfileEditPage)}/>
    </Route>
);

const recruiterRoutes = (

    <Route component={App} >
        <Route path='landing' component={Recruiter(recruiterLanding)} />
        <Route exact path="opportunity/create" component={Recruiter(ChallengeConfigurationRouter)} />
        <Route exact path="opportunity/:id" component={Recruiter(ChallengeConfigurationRouter)} isCandidatePath={true} />
        <Route exact path="opportunity/:id/candidate/:candidateId" component={Recruiter(RecruiterOpportunityCandidateDetail)} />
        <Route exact path="opportunity/:id/configuration" component={Recruiter(ChallengeConfigurationRouter)} />

        <Route path='dashboard' component={Recruiter(RecruiterDashboard)} />
        <Route exact path="company/upgrade/contact/success" component={Recruiter(RecruiterCompanyUpgradeContactSuccess)} />
        <Route exact path="company/upgrade/contact/:id" component={Recruiter(RecruiterCompanyUpgradeContactPage)} />
        <Route path="company/upgrade/success" component={Recruiter(RecruiterCompanyUpgradeSuccessPage)}/>
        <Route path="opportunity/create/configuration" component={Recruiter(RecruiterOpportunityCreatePage)}/>
        <Route path="opportunity/:id/update" component={Recruiter(RecruiterOpportunityCreatePage)}/>
        {/*<Route path='opportunity/:id/providers' component={Recruiter(RecruiterOpportunityProvidersPage)} />*/}
        <Route path="opportunity/:id/invitation/update" component={Recruiter(OpportunityChallengeConfigurationTimeline)} update={true}/>
        <Route path="opportunity/:id/challenge" component={Recruiter(OpportunityChallengeDetail)} back={true}/>
        {/*<Route path="opportunity/:id/process" component={Recruiter(ProcessPage)}/>*/}
        <Route path="opportunity/:id/user/:userId/answer" component={Recruiter(ChallengeAnswerPage)}/>
        <Route path='opportunity/:id/template/:templateId' component={Recruiter(OpportunityTemplatePreviewPage)} />
        {/* DUMMY COMP FOR PDF */}
        <Route path="test/email" component={Recruiter(TemplateMailEditor)}/>
        <Route path="test/layout" component={Recruiter(LayoutTest)}/>
        <Route path='test/fullscreen' component={Recruiter(TestFullscreenFile)} />


        <Route exact path="opportunity/:id/configure/killerquestions" component={Recruiter(RecruiterFormKillerQuestionsCreate)} />
        <Route exact path="opportunity/:id/configure/killerquestions/edit" component={Recruiter(RecruiterFormKillerQuestionsEdit)} />
    </Route>

);

const commonRoutesFullScreen = (
    <Route component={App} fullScreen={true}>
        <Route path=':id/attitude' component={TestManagerResult} />
    </Route>
);

const recruiterFullScreenRoutes = (
    <Route component={App} fullScreen={true}>
        <Route path="opportunity/:id/challenge/live" component={Recruiter(RecruiterChallengeLivePage)}/>
        <Route exact path="company/upgrade" component={Recruiter(RecruiterCompanyUpgradePage)} />
        <Route path="profile/complete" component={Recruiter(ProfileCreationPage)}/>
        <Route path="company/create" component={Recruiter(CompanyDetails)}/>
        <Route path='boarding' component={Recruiter(RecruiterBoardingFlowPage)}/>
    </Route>
);

const recruiterNoSidebarRoutes = (
    <Route component={App} hideSidebar>
    </Route>
);

const recruiterOnlyHeaderRoutes = (
    <Route component={App} showSidebar={false}>
    </Route>
);

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
    <Route component={App}>
        <Route path='notifications' component={NotificationPage} />
    </Route>
);

const combinedJudgeRoutes = (
    <Route>
        <Route>
            {judgeRoutes}
        </Route>
        <Route>
            {expertOnlyHeaderRoutes}
        </Route>
    </Route>
);

const combinedRecruiterRoutes = (
    <Route>
        <Route>
            {recruiterNoSidebarRoutes}
        </Route>
        <Route>
            {recruiterFullScreenRoutes}
        </Route>
        <Route>
            {recruiterOnlyHeaderRoutes}
        </Route>
        <Route>
            {recruiterRoutes}
        </Route>
    </Route>
);

const combinedTalentRoutes = (
    <Route>
        <Route>
            {commonRoutesFullScreen}
        </Route>
    </Route>
);

export default (
    <Route>
        <div id='modal-root' />
        <Route>
            {basicRoutes}
        </Route>
        <Route path='/judge'>
            {combinedJudgeRoutes}
        </Route>
        <Route path='/recruiter'>
            {combinedRecruiterRoutes}
        </Route>
        <Route path="/talent">
            {combinedTalentRoutes}
        </Route>
        <Route path='/service-unavailable' component={ServiceUnavailable} />
        <Route path="*" component={NotFoundPage} />
    </Route>
);