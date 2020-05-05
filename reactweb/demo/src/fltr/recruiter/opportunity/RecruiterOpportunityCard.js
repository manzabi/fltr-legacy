import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    goToRecruiterConfigure,
    goToRecruiterOpportunityUpdate,
    goToOpportunityDetail, goToRecruiterCompanyModify, goToRecruiterEditTags
} from '../../navigation/NavigationManager';
import * as opportunityStatus from '../../../constants/opportunityStatus';
import OpportunityTags from '../../opportunity/tag/OpportunityTags';

import { resetOpportunityCurrentTagList } from '../../../redux/actions/opportunityActions';
import { getCompanyImage } from '../../utils/urlUtils';
import Col from '../../../layout/layout/Col';
import Row from '../../../layout/layout/Row';
import { Header, Text } from '../../../layout/FluttrFonts';
import { getExpertsForOpportunity, getRecruitersForOpportunity, getUserEmailOrName } from '../../utils/userUtils';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { USER_PLACEHOLDER } from '../../../constants/placeholderImages';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import { OpportunityContextMenu } from './OpportunityContextMenu';
import { getOpportunityChallengeSelected } from '../../../constants/opportunityChallengeProcessStatus';


@connect(({ dispatch }) => ({ dispatch }))
export default class RecruiterOpportunityCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            target: null,
            inviteLink: '',
            showTagHandler: false,
            showMenu: false,
            showExtendModal: false,
            showCloseOppModal: false,
            showInviteModal: false,
            showActivateModal: false,
            extendLoading: false,
            activateLoading: false
        };

    }

    close() {
        this.setState({ showTagHandler: false });
        this.props.dispatch(resetOpportunityCurrentTagList());
    }

    open() {
        this.setState({ showTagHandler: true });
    }

    handleEditCompany = e => {
        e.preventDefault();
        const id = this.props.user.item.recruiterDetails.company.id;
        goToRecruiterCompanyModify(id);
    };

    handleEditOpportunity = e => {
        e.preventDefault();
        const { id } = this.props.data;
        goToRecruiterOpportunityUpdate(id);
    };
    handleEditTags = e => {
        e.preventDefault();
        const { id } = this.props.data;
        goToRecruiterEditTags(id);
    };

    renderTeamList = (opportunity) => {
        const experts = getExpertsForOpportunity(opportunity);
        const recruiters = getRecruitersForOpportunity(opportunity);
        const memberList = [
            ...recruiters,
            ...experts.filter((expert) => !recruiters.find((recruiter) => {
                const expertName = getUserEmailOrName(expert);
                const recruiterName = getUserEmailOrName(recruiter);
                return expertName === recruiterName;
            }))
        ];
        if (memberList && memberList.length) {
            return memberList.map((expert) => {
                return (
                    <CrazyTooltip
                        width='max-content'
                        messageChildren={<Text bold className='crazy-lightgrey' style={{ fontSize: 11, textAlign: 'center', margin: 0 }}>{expert.user && expert.user.completeName.trim() && expert.user.completeName || expert.user && expert.user.email || expert.email}</Text>}
                        color='darkside'
                    >
                        <ProfilePic url={expert.user && expert.user.imageUrl || USER_PLACEHOLDER} shape='circle' length='40' />
                    </CrazyTooltip>
                );
            });
        } else {
            return null;
        }
    };

    renderOpportunityButton = (opportunity) => {
        const { id } = opportunity;
        let opportunityStatusId = this.props.data.statusId;
        if (opportunityStatusId === opportunityStatus.TO_INIT) {
            return (
                <CrazyButton
                    text='Configure'
                    size='ceci'
                    action={() => {
                        const hasChallangeSelected = getOpportunityChallengeSelected(opportunity);
                        const context = hasChallangeSelected ? 'my_test' : 'templates';
                        goToRecruiterConfigure(id, context);
                    }}
                />
            );
        } else if (opportunityStatusId !== opportunityStatus.TO_INIT) {
            return (
                <CrazyButton
                    text='View'
                    size='ceci'
                    action={() => goToOpportunityDetail(id)}
                    inverse
                />
            );
        }
    };

    renderActiveTime = () => {
        const { data: opportunity } = this.props;
        switch (opportunity.statusId) {
            case opportunityStatus.LIVE: {
                if (opportunity.activateDate) {
                    return <Text size="sm"><b className='crazy-green'>Activated</b> {opportunity.activateDate.elaspedDays === '0 hours' ? 'just now' : `${opportunity.activateDate.elaspedDays} ago`}</Text>;
                } else {
                    return null;
                }
            }
            case opportunityStatus.TO_INIT: {
                return <Text size="sm" className='crazy-mediumgrey'><b>Draft</b> test not active</Text>;

            }
            case opportunityStatus.FOUND || opportunityStatus.CLOSE: {
                return <Text size="sm" bold className='crazy-red'>Closed</Text>;
            }
            default: {
                return null;
            }
        }
    };

    renderCloseTime = () => {
        const { data: opportunity } = this.props;
        switch (opportunity.statusId) {
            case opportunityStatus.LIVE: {
                if (opportunity.expire) {
                    return <Text size="sm"><b>{opportunity.expire.expireString} left</b> to close the submissions</Text>;
                } else { return null; }
            }
            default: {
                return null;
            }
        }
    };

    render() {
        const { data: opportunity, data: { tagList } } = this.props;
        const { numberOfNewApplicants, numberOfNewSubmissions, numberOfNewAssessments } = opportunity.recruiterDetail;
        const showActivityColumn = true;
        const colSize = {
            xs: showActivityColumn ? '4' : '6'
        };
        return (
            <Row id='recruiter-opportunity-card' className={`recruiter-opportunity-card ${opportunity.status.toLowerCase()}`} revertMargin>
                <section className='opportunity-menu'>
                    <OpportunityContextMenu opportunity={opportunity} onRefresh={this.props.onRefresh} />
                </section>
                <Col xs='12' md='5' className='opportunity-details'>
                    <div className='profile-pic-wrapper'>
                        <ProfilePic url={getCompanyImage(this.props.data.company)} length='32' />
                    </div>
                    <section className='opportunity-details-content'>
                        <Header size='sm'>{this.props.data.roleTitle}</Header>
                        {this.renderActiveTime()}
                        {this.renderCloseTime()}
                    </section>
                </Col>
                <Col xs='12' md='6' className='opportunity-stats'>
                    <Row revertMargin>
                        <Col {...colSize} className='stats-block'>
                            <Text size='sm' bold>STATUS</Text>
                            <Text size='sm'>
                                <span style={{ marginRight: 20 }}>{
                                    opportunity.applied !== null && opportunity.statusId !== opportunityStatus.TO_INIT ?
                                        opportunity.applied : '-'
                                }</span> Total Candidates</Text>
                            <Text size='sm'>
                                <span style={{ marginRight: 20 }}>{
                                    opportunity.commonDetail.submissions !== null && opportunity.statusId !== opportunityStatus.TO_INIT ?
                                        opportunity.commonDetail.submissions : '-'
                                }</span> Submissions</Text>
                        </Col>
                        <Col {...colSize} className='stats-block'>
                            <Text size='sm' bold>ACTIVITY</Text>
                            <Text size='sm'>
                                <span style={{ marginRight: 20 }}>
                                    {numberOfNewApplicants || '-'}
                                </span> New candidates
                            </Text>
                            <Text size='sm'>
                                <span style={{ marginRight: 20 }}>
                                    {numberOfNewSubmissions || '-'}
                                </span> New submissions
                            </Text>
                            <Text size='sm'>
                                <span style={{ marginRight: 20 }}>
                                    {numberOfNewAssessments || '-'}
                                </span> New assessments
                            </Text>
                        </Col>
                        <Col {...colSize} className='team-block'>
                            <Text size='sm' bold>TEAM MEMBERS</Text>
                            <section className='expert-list'>
                                {this.renderTeamList(opportunity)}
                                {![opportunityStatus.CLOSE, opportunityStatus.FOUND].includes(opportunity.statusId) &&
                                    <CrazyIcon
                                        className='add-more'
                                        icon='icon-plus-thin'
                                        onClick={() => goToRecruiterConfigure(opportunity.id, 'team')}
                                    />
                                }
                            </section>

                        </Col>
                    </Row>
                </Col>
                <Row revertMargin>
                    <Col xs='12' className='opportunity-footer'>
                        <OpportunityTags showIcon={false} taglist={tagList} />
                        {this.renderOpportunityButton(opportunity)}
                    </Col>
                </Row>
            </Row>
        );
    }

}