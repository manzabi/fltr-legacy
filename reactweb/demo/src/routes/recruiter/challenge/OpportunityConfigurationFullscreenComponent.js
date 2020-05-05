import React, { Component } from 'react';
import FullScreenComponent from '../../../fltr/template/FullscreenComponent';
import { serializeQuery } from '../../../fltr/utils/urlUtils';
import Row from '../../../layout/layout/Row';
import Col from '../../../layout/layout/Col';
import OpportunityTemplatePreviewPage from '../../../fltr/recruiter/opportunityConfiguration/OpportunityTemplateList/OpportunityTemplatePreviewPage';
import { getOpportunityChallengeSelected } from '../../../constants/opportunityChallengeProcessStatus';
import OpportunityChallengeShowPage from '../../../fltr/recruiter/opportunityConfiguration/opportunityChallengeConfiguration/ChallengeConfigurationPreview';
import OpportunityChallengeConfigurationTemplateEditorPage from '../../../fltr/recruiter/opportunityConfiguration/opportunityChallengeConfiguration/OpportunityChallengeConfigurationTemplateEditorPage';
import RecruiterTemplatePage from '../../../fltr/recruiter/opportunity/RecruiterTemplatePage';
import { getAttitudeProcessTest } from '../../../constants/opportunityProcessType';
import ChallengeRequestTemplatePage from './ChallengeRequestTemplatePage';
import { TO_INIT } from '../../../constants/opportunityStatus';
import { Text } from '../../../layout/FluttrFonts';
import CrazyContentSidebar from '../../../layout/sidebar/CrazyContentSidebar';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import SidebarTemplatePreview from '../../../common/components/SidebarTemplatePreview';
import Container from '../../../layout/layout/Container';
import Grid from '../../../layout/layout/Grid';

export default class OpportunityConfigurationFullscreenComponent extends Component {
    constructor(props) {
        super(props);
        const { context, ...extraParams } = serializeQuery();
        this.state = {
            context,
            extraParams: {
                ...extraParams
            }
        };
    }

    renderNotActiveBanner = () => {
        const { opportunity } = this.props;
        const { context } = this.state;
        const hasAttitude = getAttitudeProcessTest(opportunity);
        const myTestWithoutAttitude = context === 'my_test' && opportunity && (!getOpportunityChallengeSelected(opportunity) && !hasAttitude);
        const hasChallenge = !!getOpportunityChallengeSelected(opportunity);
        if (opportunity && opportunity.statusId === TO_INIT && !hasChallenge) {
            if (myTestWithoutAttitude || !['edit', 'preview', 'request_template'].includes(context)) {
                return (
                    <Text
                        size='sm'
                        bold
                        className='not-active-banner'
                    >
                        Select a template or create one from scratch . After the selection, the test won’t be active yet and you will be able to configure all details and settings.
                    </Text>
                );
            }
        } else {
            return null;
        }
    };

    renderSidebar = () => {
        const { context } = this.state;
        if (context || this.props.isCreate) {
            const elements = [
                {
                    name: 'CHALLENGE TEMPLATES',
                    id: 'templates',
                    action: () => this.changeTab('templates')
                },
                {
                    name: 'MY CHALLENGES',
                    id: 'challenges',
                    action: () => this.changeTab('challenges')
                },
                {
                    name: 'QUESTIONNAIRES',
                    id: 'questions',
                    action: () => this.changeTab('questions'),
                    disabled: true
                },
                {
                    name: 'PERSONALITY TEST',
                    id: 'attitude',
                    action: () => this.changeTab('attitude'),
                    disabled: true
                }
            ];
            const renderSidebarElements = this.props.isCreate || !['edit', 'preview', 'my_test', 'request_template'].includes(context);
            const children = this.renderSidebarChildren(context);
            if (children || renderSidebarElements) {
                return (
                    <Col xs='2' md='3' lg='2'>
                        <CrazyContentSidebar
                            elements={renderSidebarElements ? elements : []}
                            active={context}
                            children={children}
                        />
                    </Col>
                );
            } else {
                return null;
            }

        } else {
            return null;
        }
    };

    renderSidebarChildren = (context) => {
        switch (context) {
            case 'templates': {
                return (
                    <section>
                        <Text bold size='sm' style={{ marginLeft: 31, marginRight: 31 }}>Template gallery</Text>
                        <Text size='sm' style={{ marginLeft: 31, marginRight: 31 }}>Pick one of our customizable templates or build one from scratch.</Text>
                    </section>
                );
            }
            case 'challenges': {
                return (
                    <section>
                        <Text bold size='sm' style={{ marginLeft: 31, marginRight: 31 }}>Template gallery</Text>
                        <Text size='sm' style={{ marginLeft: 31, marginRight: 31 }}>Pick one of our customizable templates or build one from scratch.</Text>
                    </section>
                );
            }
            case 'preview': {
                const { id: opportunityId, recruiterDetail } = this.props.opportunity;
                const { challengeId, templateId } = this.state.extraParams;
                if (templateId) {
                    return (
                        <section>
                            <div>
                                <div className='back-to-challenges' onClick={() => this.changeTab('templates')}>
                                    <CrazyIcon icon='icon-arrow-drop-up' /><Text size='sm' bold>Back to library</Text>
                                </div>
                                <Text bold style={{ fontSize: 15, marginLeft: 31, marginRight: 31 }}>Challenge template</Text>
                            </div>
                            <SidebarTemplatePreview
                                changeTab={this.changeTab}
                                opportunityId={opportunityId}
                                templateId={templateId}
                                challengeId={challengeId}
                                recruiterDetail={recruiterDetail}
                            />
                        </section>
                    );
                } else if (challengeId) {
                    const currentChallenge = getOpportunityChallengeSelected(this.props.opportunity);
                    return (
                        <section>
                            <div>
                                {currentChallenge && challengeId !== currentChallenge.id &&
                                    <div className='back-to-challenges' onClick={() => this.changeTab('templates')}>
                                        <CrazyIcon icon='icon-arrow-drop-up' /><Text size='sm' bold>Back to library</Text>
                                    </div>
                                }
                            </div>
                            <Text bold style={{ fontSize: 15, marginLeft: 31, marginRight: 31 }}>Challenge template</Text>
                            <SidebarTemplatePreview
                                changeTab={this.changeTab}
                                opportunityId={opportunityId}
                                challengeId={challengeId}
                                recruiterDetail={recruiterDetail}
                            />
                        </section>
                    );
                } else {
                    return null;
                }
            }
            default: {
                return null;
            }
        }
    };

    renderContent = () => {
        const { context } = this.state;
        const { templateId, challengeId } = this.state.extraParams;
        const { opportunity, isCreate } = this.props;
        const opportunityId = opportunity && opportunity.id || null;
        switch (context) {
            case 'preview': {
                if (templateId) {
                    return (
                        <Col xs='10' md='9' lg='10' id='content-view'>
                            <OpportunityTemplatePreviewPage changeTab={this.changeTab} templateId={templateId} opportunity={opportunity} />
                        </Col>
                    );
                } else {
                    return (
                        <Col xs='10' md='9' lg='10' id='content-view'>
                            <OpportunityChallengeShowPage opportunity={opportunity} challengeId={challengeId} changeTab={this.changeTab} />
                        </Col>
                    );
                }
            }
            case 'edit': {
                return (
                    <Col xs='12' id='content-view'>
                        <OpportunityChallengeConfigurationTemplateEditorPage
                            changeTab={this.changeTab}
                            opportunityId={opportunityId}
                            opportunity={opportunity}
                            challengeId={challengeId}
                        />
                    </Col>
                );
            }

            case 'challenges': {
                return (
                    <Col xs='10' md='9' lg='10' id='content-view'>
                        <RecruiterTemplatePage
                            changeTab={this.changeTab}
                            opportunity={opportunity}
                            isCreate={isCreate}
                            context={context}
                        />
                    </Col>
                );
            }
            case 'my_test': {
                const hasAttitude = getAttitudeProcessTest(opportunity);
                if (opportunity && (!getOpportunityChallengeSelected(opportunity) && !hasAttitude)) {
                    return (
                        <Col xs='10' md='9' lg='10' id='content-view'>
                            <RecruiterTemplatePage
                                changeTab={this.changeTab}
                                opportunity={opportunity}
                                isCreate={isCreate}
                                context='templates'
                            />
                        </Col>

                    );
                } else {
                    return (
                        <Col xs='12'>
                            <RecruiterTemplatePage
                                changeTab={this.changeTab}
                                opportunity={opportunity}
                                context={context}
                                isCreate={isCreate}
                            />
                        </Col>

                    );
                }
            }
            case 'request_template': {
                return (
                    <Col xs='12' id='content-view'>
                        <ChallengeRequestTemplatePage
                            opportunity={opportunity}
                            changeTab={this.changeTab}
                        />
                    </Col>
                );
            }
            default: {
                return (
                    <Col xs='10' md='9' lg='10' id='content-view'>
                        <RecruiterTemplatePage
                            changeTab={this.changeTab}
                            opportunity={opportunity}
                            isCreate={isCreate}
                        />
                    </Col>
                );
            }
        }
    };

    changeTab = (context, extra) => {
        const getExtra = () => {
            const isObject = extra && typeof extra === 'object' && !Array.isArray(extra);
            if (isObject) {
                return extra;
            } else {
                return this.state.extraParams;
            }
        };
        this.setState({ context, extraParams: { ...getExtra() } });
    };

    render() {
        const showFullscreen = this.state.context !== 'my_test';
        const children = (
            <Container fluid>
                <Grid revertMargin style={{ gridGap: 0 }} className='opportunity-configuration-fullscreen'>
                    {this.renderNotActiveBanner()}
                    {this.renderSidebar()}
                    {this.renderContent()}
                </Grid>
            </Container>
        );
        if (showFullscreen) {
            return (
                <FullScreenComponent style={{ backgroundColor: 'white' }} children={children} />
            );
        } else {
            return children;
        }
    }
}