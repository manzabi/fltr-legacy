import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsynchContainer from '../../../fltr/template/AsynchContainer';
import { getOpportunityById, resetOpportunityGetById } from '../../../redux/actions/recruiterOpportunityActions';
import {
    WAITING_TEST,
    WAITING_CONFIRM,
    DISABLED,
    getChallengeRouterStatus, CHALLENGE, WAITING_CONFIRM_TEST, CHALLENGE_CLOSED, getOpportunityChallengeSelected
} from '../../../constants/opportunityChallengeProcessStatus';
import { getQueryParam, serializeQuery } from '../../../fltr/utils/urlUtils';

// ROUTES IMPORTS
import OpportunityChallengeConfigurationTemplateEditorPage from '../../../fltr/recruiter/opportunityConfiguration/opportunityChallengeConfiguration/OpportunityChallengeConfigurationTemplateEditorPage';
import OpportunityChallengeConfigurationSummaryComponent from '../../../fltr/recruiter/opportunityConfiguration/OpportunityChallengeConfigurationSummaryComponent';

import RecruiterTemplatePage from '../../../fltr/recruiter/opportunity/RecruiterTemplatePage';
import { CrazySectionHeader } from '../../../layout/header/Header';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { setHeaderTitle } from '../../../redux/actions/uiActions';
import OpportunityTemplatePreviewPage from '../../../fltr/recruiter/opportunityConfiguration/OpportunityTemplateList/OpportunityTemplatePreviewPage';
import Container from '../../../layout/layout/Container';
import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';

import MainContainer from '../../../common/components/MainContainer';
import Row from '../../../layout/layout/Row';
import OpportunityChallengeShowPage
    from '../../../fltr/recruiter/opportunityConfiguration/opportunityChallengeConfiguration/ChallengeConfigurationPreview';
import {
    goToRecruiterChallengeLivePage,
    goToRecruiterConfigure
} from '../../../fltr/navigation/NavigationManager';
import CrazyContentSidebar from '../../../layout/sidebar/CrazyContentSidebar';
import { activateChallengeForOpportunity, resetAutosveStatus } from '../../../redux/actions/opportunityActions';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import { Text } from '../../../layout/FluttrFonts';
import { manageSuccess, createCookie, getCookie, manageError } from '../../../common/utils';
import { getCategory, RECRUITER_DASHBOARD } from '../../../constants/headerConstants';
import RecruiterCandidatesPage from '../candidate/RecruiterCandidatesPage';
import ChallengeRequestTemplatePage from '../challenge/ChallengeRequestTemplatePage';
import { OpportunityContextMenu } from '../../../fltr/recruiter/opportunity/OpportunityContextMenu';
import FullScreenComponent from '../../../fltr/template/FullscreenComponent';
import ActivityPage from './ActivityPage';
import { ERROR_SAVING, INITIALISING, SAVED, SAVING } from '../../../constants/saveStatus';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import {isCompletedJobPost, LIVE, TO_INIT} from '../../../constants/opportunityStatus';
import SidebarTemplatePreview from '../../../common/components/SidebarTemplatePreview';
import { getOpportunitySubString } from '../../../common/uiUtils';
import {getAttitudeProcessTest, getChallengeProcessTest} from '../../../constants/opportunityProcessType';
import FullScreen from '../../../fltr/template/FullScreen';
import RecruiterOpportunityLivePage from '../../../fltr/recruiter/opportunity/RecruiterChallengeLivePage';
import OpportunityConfigurationFullscreenComponent from './OpportunityConfigurationFullscreenComponent';

@connect(({ recruiterOpportunityGet }) => ({ recruiterOpportunityGet }))
export default class ChallengeConfigurationRouter extends Component {
    state = {};

    componentDidMount() {
        this.reloadOpportunity();
        const exactRoute = this.props.routes.find((route) => route.exact);
        const { isCandidatePath } = exactRoute;
        this.setState({
            isCandidateList: isCandidatePath
        });
    }


    reloadOpportunity = (callback) => {
        const { id } = this.props.params;
        if (id) {
            this.props.dispatch(resetOpportunityGetById(() => {
                this.props.dispatch(getOpportunityById(id, callback));
            }));
        }
    };

    updateOpportunity = (callback) => {
        this.reloadOpportunity(callback);
    };

    render() {
        const objectStored = this.props.recruiterOpportunityGet;
        const { id } = this.props.params;
        if (id) {
            return (
                <AsynchContainer data={objectStored}>
                    <RouteManagement
                        opportunity={objectStored.item}
                        updateOpportunity={this.updateOpportunity}
                        isCandidateList={this.state.isCandidateList}
                    />
                </AsynchContainer>
            );
        } else {
            return <RouteManagement />;
        }
    }
}

@connect(({ opportunityAutoUpdateStatus }) => ({ opportunityAutoUpdateStatus }))
class RouteManagement extends Component {
    constructor(props) {
        super(props);
        const { opportunity } = this.props;
        const status = opportunity && opportunity.challengeDetail && opportunity.challengeDetail.status !== undefined ? opportunity.challengeDetail.status : null;
        const context = props.isCandidateList ? 'candidates' : getQueryParam('context');
        const tooltipCookie = getCookie('closedTooltipIds');
        let closedTooltip = false;
        if (tooltipCookie && opportunity) {
            closedTooltip = JSON.parse(tooltipCookie).includes(opportunity.id);
        }
        this.state = {
            context,
            ...getChallengeRouterStatus(opportunity, status, context),
            closedTooltip,
            showInviteModal: false,
            activateLoading: false
        };
    }

    openInviteCandidate = () => {
        // this.onActivateSuccess();
        this.setState({
            showInviteModal: true
        });
    };


    closeInviteCandidate = () => {
        this.setState({
            showInviteModal: false
        });
    };

    updateContext = (context) => {
        this.props.updateOpportunity(() => { this.setState({ context }); });
    };

    componentDidMount() {
        this.props.dispatch(resetAutosveStatus());
        const { opportunity } = this.props;
        const newHeader = [
            getCategory(RECRUITER_DASHBOARD)
        ];

        if (opportunity) {
            const { context } = this.state;
            newHeader.push({ id: 'CONFIGURE_TEST', text: `${opportunity.roleTitle} ${getOpportunitySubString(opportunity)}` });
            this.props.dispatch(setHeaderTitle(newHeader));
        } else {
            newHeader.push({ id: 'CONFIGURE_TEST', text: 'Test creation' });
            this.props.dispatch(setHeaderTitle(newHeader));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.opportunity && nextProps.opportunity) {
            const newHeader = [
                getCategory(RECRUITER_DASHBOARD)
            ];
            if (nextProps.opportunity.roleTitle !== this.props.opportunity.roleTitle) {
                newHeader.push({ id: 'CONFIGURE_TEST', text: `${nextProps.opportunity.roleTitle} ${getOpportunitySubString(this.props.opportunity)}` });
                this.props.dispatch(setHeaderTitle(newHeader));
            }
            if (this.props.opportunity.challengeDetail.status === WAITING_TEST && nextProps.opportunity.challengeDetail.status === WAITING_CONFIRM) {
                manageSuccess('readyToActivate', 'You have unlocked the settings and team configuration');
                const { opportunity } = nextProps;
                const status = opportunity && opportunity.challengeDetail && opportunity.challengeDetail.status !== undefined ? opportunity.challengeDetail.status : null;
                const context = nextProps.isCandidateList ? 'candidates' : getQueryParam('context');
                this.setState({
                    ...getChallengeRouterStatus(opportunity, status, context)
                });
            }
        }
    }

    componentWillUnmount() {
        this.props.dispatch(setHeaderTitle());
    }

    renderContent = () => {
        const { opportunity } = this.props;
        let { context } = serializeQuery('context');
        if (this.props.isCandidateList) {
            context = 'candidates';
        }
        if (context !== undefined && context !== this.state.context) {
            this.updateContext(context);
            return null;
        } else if (opportunity && opportunity.statusId === LIVE && context === undefined) {
            return <RecruiterCandidatesPage />;
        } else if (opportunity && opportunity.challengeDetail) {
            switch (opportunity.challengeDetail.status) {
                case opportunity.challengeDetail.status === DISABLED && !['team', 'settings'].includes(context): {
                    return (<ChallengeCreationTestPage opportunity={opportunity} />);
                }
                case opportunity.challengeDetail.status === WAITING_TEST && !['team', 'settings'].includes(context): {
                    return <ChallengeCreationTestPage opportunity={opportunity} />;
                }
                case opportunity.challengeDetail.status === WAITING_CONFIRM && ['team', 'settings'].includes(context): {
                    return <OpportunityChallengeConfigurationSummaryComponent id={opportunity.id} opportunity={opportunity} context={context} />;
                }
                case opportunity.challengeDetail.status === WAITING_CONFIRM && ['activity'].includes(context): {
                    return <ActivityPage opportunity={opportunity} />;
                }

                default: {
                    if ((['challenges', 'templates', 'job_details', 'questions', 'attitude', 'preview', 'edit', 'job_details', 'request_template'].includes(context))) {
                        return <ChallengeCreationTestPage opportunity={opportunity} />;
                    } else if (['team', 'settings'].includes(context)) {
                        return <OpportunityChallengeConfigurationSummaryComponent id={opportunity.id} opportunity={opportunity} context={context} />;
                    } else if (['activity'].includes(context)) {
                        return <ActivityPage opportunity={opportunity} />;
                    } else if (context === 'candidates') {
                        return <RecruiterCandidatesPage handleActivate={this.handleActivate} openInviteCandidate={this.openInviteCandidate} activateLoading={this.state.activateLoading} />;
                    } else {
                        return <ChallengeCreationTestPage opportunity={opportunity} context='my_test' />;
                    }
                }
            }
        } else { return <ChallengeCreationTestPage isCreate />; }
    };

    getScrollableElement = () => {
        const { activeScreen } = this.state;
        switch (activeScreen) {
            case 'test':
                return 'content-view';
            default:
                return undefined;
        }
    };

    handleActivate = () => {
        const { id: opportunityId } = this.props.opportunity;
        this.setState({ activateLoading: true });
        this.props.dispatch(activateChallengeForOpportunity(opportunityId, this.onActivateSuccess, this.onActivateError));
    };

    onActivateSuccess = () => {
        const { id: opportunityId } = this.props.opportunity;
        goToRecruiterChallengeLivePage(opportunityId);
    };

    onActivateError = (error) => {
        this.setState({ activateLoading: false });
        manageError(error, 'activate-opp-error', 'Error activating the challenge');
    };

    onCloseTooltip = () => {
        const { id: opportunityId } = this.props.opportunity;
        //create cookie with id
        const getTooltipCookie = getCookie('closedTooltipIds');
        if (!getTooltipCookie) {
            createCookie('closedTooltipIds', JSON.stringify([opportunityId]));
        } else {
            const parsedCookie = JSON.parse(getTooltipCookie);
            if (!parsedCookie.includes(opportunityId)) {
                createCookie('closedTooltipIds', JSON.stringify([...parsedCookie, opportunityId]));
            }
        }
        this.setState({ closedTooltip: true });
    };

    renderActivateButton = (activateDisabled) => {
        return (
            <CrazyTooltip
                position='bottom'
                messageChildren={activateDisabled ? <Text bold className='activate-button-tooltip-disabled' style={{ fontSize: 11 }}>Choose a challenge from the test forms to activate the test</Text> :
                    <div>
                        <Text size='sm' className='activate-button-tooltip-enabled' bold>The test is ready! Activate it to start testing your candidates.</Text>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <CrazyButton color='white' size='small' text='Got it' action={this.onCloseTooltip} style={{ marginLeft: 10, marginBottom: 10 }} />
                        </div>
                    </div>}
                color={activateDisabled ? 'darkside' : 'primary'}
                show={!activateDisabled && !this.state.closedTooltip}
                activateWithHover={activateDisabled}
            >

                <CrazyButton action={this.handleActivate} text='Activate' disabled={activateDisabled} size='ceci' color='orange' loading={this.state.activateLoading} />
            </CrazyTooltip>
        );
    };

    renderSavingStatus = () => {
        const { opportunityAutoUpdateStatus } = this.props;
        switch (opportunityAutoUpdateStatus) {
            case INITIALISING: {
                return null;
            }
            case SAVING: {
                return <Text style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }} size='sm'><i className='fas fa-spinner-third fa-spin' style={{ marginRight: 5, color: '#1ABC9C', fontSize: 14 }} /> saving...</Text>;
            }
            case ERROR_SAVING: {
                return <Text style={{ margin: '0 10px', display: 'flex', alignItems: 'center' }} size='sm'>Error</Text>;
            }
            case SAVED: {
                return (
                    <CrazyTooltip
                        messageChildren={<Text bold style={{ color: 'white', fontSize: 11 }}>Changes are saved automatically. Your candidates and team members will see the updates.</Text>}
                        position='bottom'
                        color='darkside'
                        width='188px'
                    >
                        <Text
                            style={{
                                margin: '0 10px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            size='sm'
                            className='crazy-lightgrey'
                        >
                            <CrazyIcon
                                icon='icon-check-small'
                                style={{
                                    fontSize: 10,
                                    display: 'flex',
                                    marginRight: 5
                                }}
                            />
                            saved
                        </Text>
                    </CrazyTooltip>
                );
            }
            default: {
                return null;
            }
        }
    };

    renderStatus = (statusEnabled) => {
        if (statusEnabled) {
            const { status } = this.props.opportunity;
            return <span className={`test-status status-${status.toLowerCase()}`}>{status}</span>;
        } else {
            return null;
        }
    };

    renderInviteButton = () => {
        if (this.props.opportunity) {
            return (
                <CrazyButton
                    action={this.openInviteCandidate}
                    text='Invite candidates'
                    size='ceci'
                />
            );
        } else {
            return null;
        }
    };

    renderHeader = ({ ...props }) => {
        const { opportunity } = this.props;
        const { status } = opportunity && opportunity.challengeDetail || { status: DISABLED };
        const activateDisabled = status !== WAITING_CONFIRM;
        const statusEnabled = [CHALLENGE_CLOSED, CHALLENGE].includes(status);
        const hasChallenge = getChallengeProcessTest(opportunity);
        const opportunityLive = opportunity && opportunity.statusId === LIVE;
        const headerActive = [CHALLENGE_CLOSED, CHALLENGE, WAITING_CONFIRM].includes(status) && opportunity.statusId === TO_INIT || opportunity && opportunity.statusId !== TO_INIT;
        const activateHidden = [WAITING_CONFIRM, WAITING_CONFIRM_TEST, WAITING_TEST, DISABLED].includes(status);
        const { context } = serializeQuery();
        if (headerActive) {
            return (
                <CrazySectionHeader className='test-configuration-header' {...props}>
                    <div className='autosave-status-conteiner' style={{ marginRight: 20 }}>{this.renderSavingStatus()}</div>
                    { // TODO : check in future if this conditions is good (now it works with single challenge and single atttiude
                        hasChallenge && !opportunityLive && !statusEnabled && this.renderActivateButton(activateDisabled)
                    }
                    {opportunityLive && this.renderInviteButton()}
                    {/*{this.renderStatus(statusEnabled)}*/}
                    {opportunity &&
                        <OpportunityContextMenu opportunity={opportunity} onRefresh={this.props.updateOpportunity} />
                    }
                </CrazySectionHeader>
            );
        } else if (['preview'].includes(context)) {
            return (
                <CrazySectionHeader className='challenge-preview-header'>
                    <Text size='sm' bold>
                        Select a template or create one from scratch . After the selection, the test won’t be active yet and you will be able to configure all details and settings.
                    </Text>
                </CrazySectionHeader>
            );
        } else {
            return null;
        }
    };

    elementAction = (context, extraParams) => {
        const id = this.props.opportunity && this.props.opportunity.id || null;
        return () => goToRecruiterConfigure(id, context, extraParams);
    };

    render() {
        const { activeScreen = 'test', settingsDisabled, teamDisabled, testDisabled, candidatesDisabled } = this.state;
        const items = [
            {
                text: 'Candidates', value: 'candidates', hidden: candidatesDisabled, action: this.elementAction('candidates'),
                disabledTooltip: {
                    position: 'bottom',
                    messageChildren: <Text bold className='settings-tooltip-disabled'>Candidates tab will be available when you activate the opportunity</Text>,
                    color: 'darkside'
                }
            },
            { text: 'Test', value: 'my_test', disabled: testDisabled, action: this.elementAction('my_test') },
            {
                text: 'Team', value: 'team', disabled: teamDisabled, action: this.elementAction('team'),
                disabledTooltip: {
                    position: 'bottom',
                    messageChildren: <Text bold className='team-tooltip-disabled'>Choose a challenge from the test forms to activate the test and configure the team</Text>,
                    color: 'darkside'
                }
            },
            {
                text: 'Settings', value: 'settings', disabled: settingsDisabled, action: this.elementAction('settings'),
                disabledTooltip: {
                    position: 'bottom',
                    messageChildren: <Text bold className='settings-tooltip-disabled'>Choose a challenge from the test forms to activate the test and configure the settings</Text>,
                    color: 'darkside'
                }
            },
            {
                text: 'Activity', value: 'activity', disabled: settingsDisabled, action: this.elementAction('activity'),
                disabledTooltip: {
                    position: 'bottom',
                    messageChildren: <Text bold className='settings-tooltip-disabled'>Choose a challenge from the test forms to activate the test and configure the settings</Text>,
                    color: 'darkside'
                }
            }
        ];
        const { opportunity } = this.props;
        return (
            <MainContainer
                header={() => this.renderHeader({ items, active: activeScreen })}
                scrollableElement={this.getScrollableElement()}
                className='challenge-configuration'
            >
                {this.renderContent()}
                {opportunity &&
                <FullScreen open={this.state.showInviteModal} className='opportunity-live' manageUiFix>
                    <RecruiterOpportunityLivePage opportunity={opportunity} disableModal onClose={this.closeInviteCandidate} />
                </FullScreen>
                }
            </MainContainer>
        );
    }
}

const ChallengeCreationTestPage = ({opportunity, isCreate}) => {
    return (
        <Container className='challenge-creation-test-page' fluid>
            <Grid>
                <OpportunityConfigurationFullscreenComponent opportunity={opportunity} isCreate={isCreate}/>
            </Grid>
        </Container>
    );
};