import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    manageBookmark,
    manageDiscard,
    manageExtendTimeline,
    manageInviteChallenge
} from '../../../redux/actions/recruiterOpportunityActions';
import * as ga from '../../../constants/analytics';
import { manageErrorMessage, manageSuccess } from '../../../common/utils';

import { TYPE_STATUS_DISCARD, TYPE_STATUS_DISQUALIFIED } from '../../../constants/candidateOpportunityStatus';
import Col from '../../../layout/layout/Col';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import { candidateModelList } from '../../utils/modelUtils';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import { Header, Text } from '../../../layout/FluttrFonts';
import CrazySeparator from '../../../layout/layout/CrazySeparator';
import RecruiterCandidateModal from './RecruiterCandidateModal';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import { PROCESS_TYPE_CHALLENGE, PROCESS_TYPE_ATTITUDE } from '../../../constants/opportunityProcessType';
import { DATE, REVIEW, SUBMISSION } from '../../../constants/candidateSorts';

@connect(({ dispatch }) => ({ dispatch }))
export default class RecruiterCandidateCard extends Component {

    constructor(props) {
        super(props);
        // const candidate = new candidateModel(props.data);
        const candidate = this.props.candidate || new candidateModelList(props.data);
        this.state = {
            bookmarkLoading: false,
            candidate,
            modalStatus: false,
            activeScreen: null,
            discardLoading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.candidate && nextProps.candidate && this.props.time !== nextProps.candidate.time) {
            this.setState({ candidate: nextProps.candidate });
        } else if (this.shouldModelUpdate(nextProps)) {
            this.setState({ candidate: new candidateModelList(nextProps.data) });
        }
    }

    shouldModelUpdate = (nextProps) => {
        if (nextProps.data && this.props.data) {
            if (nextProps.data.process.discarted !== this.props.data.process.discarted) {
                return true;
            }
            const reviewHasChanges = Object.keys(nextProps.data.review).some((element) => {
                return nextProps.data.review[element] !== this.props.data.review[element];
            });
            if (reviewHasChanges) {
                return true;
            }
        } else {
            return false;
        }
    };

    switchBookmark = (event) => {
        event.stopPropagation();
        const newCandidate = { ...this.state.candidate };
        newCandidate.bookmark = !newCandidate.bookmark;
        this.setState({
            bookmarkLoading: true,
            candidate: newCandidate
        }, () => {
            const { opportunity: { id: opportunityId }, matchId, id, bookmark } = this.state.candidate;
            const data = {
                bookmark
            };
            this.props.dispatch(manageBookmark(matchId, opportunityId, id, data, this.onSwitchBookmarkOk, this.onSwitchBookmarkOk));
        });
    };

    onSwitchBookmarkOk = () => {
        this.setState({
            bookmarkLoading: false
        }, () => {
            if (this.props.onRefresh !== undefined) {
                this.props.onRefresh('bookmark');
            }
        });
    };

    onSaveReview = () => {
        ga.track(ga.ASSESS_CV_END);
        if (this.props.onRefresh !== undefined) {
            this.props.onRefresh('evaluate');
        }
    };

    onInviteToTheChallenge = () => {
        let opportunityId = this.state.candidate.opportunity.id;
        let user = this.props.data.user;
        let data = {};
        this.props.dispatch(manageInviteChallenge(this.props.data.id, opportunityId, user.id, data, this.onInviteChallengeOk));
    };

    onExtendTimeline = (date) => {
        let userId = this.props.data.user.id;
        let opportunityId = this.state.candidate.opportunity.id;

        let data = {
            expireDate: date,
        };

        this.props.dispatch(manageExtendTimeline(this.props.data.id, opportunityId, userId, data, this.onExtendTimelineOk, this.onExtendTimelineKo));
    };

    discardCallback = (event) => {
        event.stopPropagation();
        if (this.state.discardLoading) {
            return;
        }
        this.setState({ discardLoading: true });
        const { opportunity: { id: opportunityId }, id: playerId, matchId, status: { statusCandidate } } = this.state.candidate;
        const data = {
            value: statusCandidate !== TYPE_STATUS_DISCARD
        };
        if (data.value === true) {
            this.props.dispatch(manageDiscard(matchId, opportunityId, playerId, data, this.onSuccess, this.onError));
        } else {
            this.props.dispatch(manageDiscard(matchId, opportunityId, playerId, data, this.onSuccessRollback, this.onError));
        }
    };

    refreshCandidates = (section, callback) => {
        this.props.onRefresh(section, () => {
            this.setState({ discardLoading: false });
            if (callback) {
                callback();
            }
        });
    };

    onSuccess = () => {
        this.refreshCandidates('discard', () => {
            manageSuccess(undefined, 'Candidate moved to discarded section');
        });
    };

    onSuccessRollback = () => {
        this.refreshCandidates('discard', () => {
            manageSuccess(undefined, 'Candidate moved from discarded to the general view');
        });
    };

    onError = () => {
        manageErrorMessage(undefined, 'Something went wrong');
    };

    renderScore = (type, value, maxValue, done) => {
        const modalType = type === 'Engagement' ? 'Motivation' : type;
        return (
            <div className={`score-section${done && value > 0 ? ' with-score' : ''}`} key={type} onClick={(event) => { event.stopPropagation(); this.handleOpenModal(modalType); }}>
                {this.props.cardType !== 'list' &&
                    <div style={{ width: 80 }}>
                        <Text size='sm' className='score-title'>{type}</Text>
                    </div>
                }
                {done && +value !== 0 && this.renderBar(value, maxValue)}
                {done && +value !== 0 && <div style={{ width: 40, textAlign: 'center' }}><Text className='score'>{value}</Text></div>}
                {done && +value === 0 && <Text className='submitted-text'>Submitted</Text>}
                {!done && <Text className='pending-text'>Pending</Text>}
            </div>
        );
    };

    renderStepScore = ({ enabled, accepted, done, expired, score, typeString }) => {
        let label;
        if (!enabled.status || (typeString === 'Attitude' || typeString === 'Questions') && enabled.status && !done.status) {
            label = <Text className='pending-text'>Pending</Text>;
        } else {
            label = <Text className='pending-text'>Pending</Text>;
            if (accepted.status) {
                if (done.status && score > 0) {
                    label = <div style={{ width: 40, textAlign: 'center' }}><Text className='score'>{score}</Text></div>;
                } else if (done.status && !score) {
                    label = <Text className='submitted-text'>Submitted</Text>;
                } else {
                    label = <Text className='submitted-text'>Accepted</Text>;
                }
            }
            if (expired.status) {
                label = <Text className='expired-text'>Expired</Text>;
            }
        }

        return (
            <div className={`score-section${done.status && score > 0 ? ' with-score' : ''}`} key={typeString} onClick={(event) => { event.stopPropagation(); this.handleOpenModal(typeString); }}>
                {this.props.cardType !== 'list' &&
                    <div style={{ width: 80 }}>
                        <Text size='sm' className='score-title'>{typeString}</Text>
                    </div>
                }
                {done.status && score > 0 && this.renderBar(score, 100)}
                {label}
            </div>
        );

    };

    handleOpenModal = (type) => {
        this.setState({
            modalStatus: true,
            activeScreen: type.toLowerCase()
        });
    };

    renderBar = (value, maxValue) => {
        return (
            <div className='bar-container'>
                <div className='bar'>
                    <div className='bar-content orange' style={{ width: `calc(${value / maxValue * 100}%)` }} />
                </div>
            </div>
        );
    };

    handleCloseModal = () => {
        this.setState({ modalStatus: false });
    };

    renderCandidateStatus = () => {
        const { status: { completed, declined, discarted: discarded, disqualified }, process } = this.state.candidate;
        if (declined) {
            return <Text className='challenge-status error'>rejected</Text>;
        } else if (disqualified) {
            return <Text className='challenge-status error'>disqualified</Text>;
        } else if (discarded) {
            return <Text className='challenge-status error'>discarded</Text>;
        } else if (completed) {
            if (this.props.cardType !== 'list') {
                const lastStep = process.steps[process.steps.length - 1];
                return <Text className='challenge-status'>{`submitted ${lastStep.done.time}`}</Text>;
            } else {
                return <Text className='challenge-status'>submitted</Text>;
            }
        } else {
            return <Text className='challenge-status pending'>pending</Text>;
        }
    };

    renderDate = () => {
        const { dates } = this.state.candidate;
        switch (this.props.selectedSort) {
            case SUBMISSION: {
                return <Text size='sm' className='date-container' bold={!dates.submission}>{dates.submission || '-'}</Text>;
            }
            case REVIEW: {
                return <Text size='sm' className='date-container' bold={!dates.lastReview}>{dates.lastReview || '-'}</Text>;
            }
            default: {
                return <Text size='sm' className='date-container' bold={!dates.apply}>{dates.apply || '-'}</Text>;
            }
        }
    };

    render() {
        const {
            score: {
                rank,
                motivation,
                experience,
                numDoneReviews,
                numTotalReviews
            },
            nickname,
            bookmark,
            image,
            name,
            email,
            phone,
            cv,
            status,
            process: {
                steps
            },
            challengeStatus,
            opportunity: { commonDetail: { enablecv = true, enablephone = true } }
        } = this.state.candidate;
        const hasChallenge = !!this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        const hasAttitude = !!this.state.candidate.getStepData(PROCESS_TYPE_ATTITUDE);
        const { cardType } = this.props;
        const starCondition = rank >= 80;
        let discardClass = '';
        if (this.state.discardLoading) {
            discardClass = 'loading';
        } else if (status.discarted) {
            discardClass += ' active';
        }
        if (cardType === 'long') {
            return (
                <Col
                    className='recruiter-candidate-card'
                    xs='12'
                    sm='6'
                    md='4'
                    lg='3'
                    onClick={() => this.handleOpenModal('overview')}
                >
                    <section className='candidate-card-control-panel'>
                        <div className='card-buttons'>
                            <CrazyTooltip
                                color='darkside'
                                messageChildren={<Text bold style={{ fontSize: 11 }}>Favorite</Text>}
                                className='tooltip-icon-candidate-card'
                                width='85px'
                            >
                                <CrazyIcon
                                    icon={bookmark ? 'icon-bookmark-plain' : 'icon-bookmark'}
                                    onClick={this.switchBookmark}
                                />
                            </CrazyTooltip>
                            {status.statusCandidate !== TYPE_STATUS_DISQUALIFIED &&
                                <CrazyTooltip
                                    color='darkside'
                                    className='tooltip-icon-candidate-card'
                                    width='85px'
                                    messageChildren={<Text bold style={{ fontSize: 11 }}>Discard</Text>}
                                >
                                    <CrazyIcon
                                        icon='icon-discard'
                                        className={discardClass}
                                        onClick={this.discardCallback}
                                    />
                                </CrazyTooltip>
                            }
                        </div>
                        <div className='card-numbers'>
                            <Header size='lg' className='card-score'>
                                {starCondition && <CrazyIcon icon='icon-star' style={{ color: '#F36289' }} />}
                                <CrazyTooltip
                                    messageChildren={<Text bold style={{ fontSize: 11 }}>Total candidate score. With a range of 0 to 100, being 100 the most positive value.</Text>}
                                    color='darkside'
                                    className='card-score-tooltip'
                                >
                                    {hasChallenge || hasAttitude ?
                                        <span className='crazy-darkside'>{rank}</span> :
                                        <span style={{ marginRight: 6 }}>-</span>}
                                </CrazyTooltip>
                                {hasChallenge &&
                                    <CrazyTooltip
                                        messageChildren={<Text bold style={{ fontSize: 11 }}>Number of experts to assess the candidate</Text>}
                                        color='darkside'
                                        className='experts-reviewed-tooltip'
                                    >
                                        {challengeStatus.done && <span className='experts-reviewed dark'>{numDoneReviews}/{numTotalReviews}</span>}
                                    </CrazyTooltip>
                                }
                            </Header>
                        </div>
                    </section>
                    <section className='candidate-info'>
                        <ProfilePic url={image} length={100} shape='circle' />
                        <Header size='sm' style={{ textAlign: 'center' }}>{name}</Header>
                        {this.renderCandidateStatus()}
                    </section>
                    <CrazySeparator />
                    <section className='candidate-scores'>
                        {steps.map((step) => this.renderStepScore(step))}
                        {(hasAttitude || hasChallenge) && this.renderScore('Engagement', motivation, 100, true)}
                        {enablecv && this.renderScore('Experience', experience, 100, true)}
                    </section>
                    {this.state.modalStatus &&
                        <RecruiterCandidateModal
                            show={this.state.modalStatus}
                            screen={this.state.activeScreen}
                            onClose={this.handleCloseModal}
                            candidate={this.state.candidate}
                            onRefresh={this.props.onRefresh}
                        />
                    }
                </Col>
            );
        } else if (cardType === 'small') {
            return (
                <Col className='recruiter-candidate-card card-small' xs='12' sm='6' md='4' lg='3'>
                    <section className='candidate-card-control-panel'>
                        <div className='card-buttons'>
                            <CrazyTooltip
                                color='darkside'
                                messageChildren={<Text bold style={{ fontSize: 11 }}>Favorite</Text>}
                                className='tooltip-icon-candidate-card'
                                width='85px'
                                position='bottom'
                            >
                                <CrazyIcon
                                    icon={bookmark ? 'icon-bookmark-plain' : 'icon-bookmark'}
                                    onClick={this.switchBookmark}
                                />
                            </CrazyTooltip>
                            {status.statusCandidate !== TYPE_STATUS_DISQUALIFIED &&
                                <CrazyTooltip
                                    color='darkside'
                                    className='tooltip-icon-candidate-card'
                                    position='bottom'
                                    width='85px'
                                    messageChildren={<Text bold style={{ fontSize: 11 }}>Discard</Text>}
                                >
                                    <CrazyIcon
                                        icon='icon-discard'
                                        className={discardClass}
                                        onClick={this.discardCallback}
                                    />
                                </CrazyTooltip>
                            }
                        </div>
                        <div className='card-numbers'>
                            <Header size='lg' className='card-score'>
                                {starCondition && <CrazyIcon icon='icon-star' style={{ color: '#F36289' }} />}
                                <CrazyTooltip
                                    messageChildren={<Text bold style={{ fontSize: 11 }}>Total candidate score. With a range of 0 to 100, being 100 the most positive value.</Text>}
                                    color='darkside'
                                    position='bottom'
                                >{hasChallenge || hasAttitude ? <span className='crazy-darkside'>{rank}</span> : <span style={{ marginRight: 6 }}>-</span>}
                                </CrazyTooltip>
                                {hasChallenge &&
                                    <span className='experts-reviewed dark'>{numDoneReviews}/{numTotalReviews}</span>
                                }
                            </Header>
                        </div>
                    </section>
                    <section className='candidate-info'>
                        <ProfilePic url={image} length={100} shape='circle' />
                        <Header size='lg' style={{ marginTop: 15, textAlign: 'center' }}>{name}</Header>
                        {this.renderCandidateStatus()}
                        <Text size='xs' className='challenge-status crazy-mediumgrey' style={{ marginBottom: 20 }}>{nickname}</Text>
                        <Text className='challenge-status crazy-primary' style={{ marginBottom: 6 }}>{email}</Text>
                        {(enablephone || enablecv) &&
                            <Text className='challenge-status crazy-primary' style={{ marginBottom: 5 }}>
                                {enablephone && <span>{phone}</span>}
                                {enablecv && enablephone && <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>}
                                {enablecv && !!cv && this.props.handleOpenFullscreen && <span onClick={this.props.handleOpenFullscreen}>See CV</span>}
                            </Text>}
                    </section>
                </Col>
            );
        } else if (cardType === 'list') {
            return (
                <Col
                    className='recruiter-candidate-card card-list'
                    onClick={() => this.handleOpenModal('overview')}
                >
                    <section className='actions-container'>
                        <CrazyIcon
                            icon={bookmark ? 'icon-bookmark-plain' : 'icon-bookmark'}
                            id='favourite'
                            className={bookmark ? 'active' : ''}
                            onClick={this.switchBookmark}
                        />
                        {status.statusCandidate !== TYPE_STATUS_DISQUALIFIED &&
                            <CrazyIcon
                                icon='icon-discard'
                                id='discarded'
                                className={discardClass}
                                onClick={this.discardCallback}
                            />
                        }
                    </section>
                    <ProfilePic url={image} length={40} shape='circle' />
                    <Text size='sm' bold className='candidate-name'>{name}</Text>
                    <Text size='lg' className='card-score' bold>
                        {starCondition && <CrazyIcon icon='icon-star' className='stared-candidate' style={{ color: '#F36289' }} />}
                        {hasChallenge || hasAttitude ? <span className='crazy-darkside score-value'>{rank}</span> : <span className='score-value'>-</span>}
                    </Text>
                    <section className='candidate-scores'>
                        {this.renderCandidateStatus()}
                        {steps.map((step) => this.renderStepScore(step))}
                        {(hasChallenge || hasAttitude) && this.renderScore('Engagement', motivation, 100, true)}
                        {enablecv && this.renderScore('Experience', experience, 100, true)}
                        {this.renderDate()}
                        {this.state.modalStatus &&
                            <RecruiterCandidateModal
                                show={this.state.modalStatus}
                                screen={this.state.activeScreen}
                                onClose={this.handleCloseModal}
                                candidate={this.state.candidate}
                                onRefresh={this.props.onRefresh}
                            />
                        }
                    </section>
                </Col>
            );
        } else {
            return null;
        }
    }
    static propTypes = {
        cardType: PropTypes.oneOf(['long', 'small', 'list'])
    }
    static defaultProps = {
        cardType: 'long'
    }
}