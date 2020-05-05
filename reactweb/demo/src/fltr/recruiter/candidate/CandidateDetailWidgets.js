import React, { Component } from 'react';
import { PROCESS_TYPE_CHALLENGE } from '../../../constants/opportunityProcessType';
import { Header, Text } from '../../../layout/FluttrFonts';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { CircleChart } from '../../../layout/graphs/CrazyGraph';
import { connect } from 'react-redux';
import StarsViewComponent from '../../../common/components/StarsViewComponent';
import { getTimeStringFrom } from '../../../common/timerUtils';
import CrazyCard from '../../../layout/uiUtils/crazyCard';
import { ReviewCandidateCvModal } from './CandidateDetailWidgetModals';
import {
    fetchRecruiterCandidateChallenge,
    manageInviteChallenge
} from '../../../redux/actions/recruiterOpportunityActions';
import { manageError, manageSuccess } from '../../../common/utils';
import RecruiterReviewExtendTimelineModal from './RecruiterReviewExtendTimelineModal';

import { goToReviewUserForExpert } from '../../navigation/NavigationManager';
import Spinner from '../../Spinner';
@connect(({ dispatch }) => ({ dispatch }))
export class ChallengeStatusWidget extends Component {

    state = {
        loading: false,
        extendModalStatus: false,
        loadingData: true,
        data: this.props.data || null
    };

    componentDidMount() {
        const { id: userId, opportunity: { id } } = this.props.candidate;
        const data = this.props.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        if (!this.state.data && data && data.done.status) {
            this.props.dispatch(fetchRecruiterCandidateChallenge(id, userId, (data) => {
                this.setState({ data, loadingData: false }, () => { if (this.props.updateParent) this.props.updateParent(data); });
            }));
        } else {
            this.setState({ loadingData: false });
        }
    }

    static getHead(text = 'CHALLENGE STATUS', extraText, starScore) {
        return (
            <div className='widget-head'>
                <Text bold size='xs'>{text}</Text>
                {starScore && <StarsViewComponent align='right' activeColor='#fdc185' starsWidth={13} starsValue={starScore} />}
                {extraText && <Text size='sm'>{extraText}</Text>}
            </div>
        );
    }

    handleOpenModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ extendModalStatus: true });
    };

    handleCloseModal = () => {
        this.setState({ extendModalStatus: false });
    };

    manageInvite = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ loading: true });
        const { candidate: { id: candidateId, matchId, opportunity: { id: opportunityId } } } = this.props;
        this.props.dispatch(manageInviteChallenge(matchId, opportunityId, candidateId, {}, this.onInviteSuccess, this.onInviteError));
    };

    onInviteSuccess = () => {
        this.setState({ loading: false });
        manageSuccess('inviteSuccess', 'Candidate successfully invited to the challenge.');
    };
    onInviteError = (error) => {
        this.setState({ loading: false });
        manageError(error);
        if (window.Raven) {
            window.Raven.captureException(error.stack);
        }
    };
    onClick = () => {
        const { onClick } = this.props;
        if (onClick) { onClick(); }
    };
    render() {
        const {
            candidate,
            candidate: {
                challengeStatus: {
                    accepted,
                    done,
                    enabled,
                    expired,
                    declined
                },
                score: {
                    challenge: challengeScore,
                    challengeStars
                },
                id: playerId,
                opportunity: { id: opportunityId }
            },
            columns = '1',
            total = '3',
            color = 'green',
            style = {}
        } = this.props;
        const processStep = candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        let head;
        let children = null;
        let hasReview = false;
        let canReview = false;
        if (this.state.data) {
            hasReview = this.state.data.hasReview;
            canReview = this.state.data.canReview;
        }
        if (declined) {
            children = (
                <div className='widget-content'>
                    <CrazyButton
                        size='small'
                        text='Invite again'
                        inverse
                        action={this.manageInvite}
                        loading={this.state.loading}
                    />
                    <div className='widget-footer'>
                        <Header size='sm'>Challenge not accepted</Header>
                        <Text size='xs' className='crazy-red'>Rejected</Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead(undefined, 'The challenge has been rejected by the candidate.');
        } else if (expired) {
            children = (
                <div className='widget-content'>
                    <CrazyButton
                        size='small'
                        text='Extend time'
                        inverse
                        action={this.handleOpenModal}
                    />
                    <div className='widget-footer'>
                        <Header size='sm'>Submission time over</Header>
                    </div>
                    <RecruiterReviewExtendTimelineModal
                        onRefresh={this.props.onRefresh}
                        show={this.state.extendModalStatus}
                        candidate={this.props.candidate}
                        onClose={this.handleCloseModal}
                    />
                </div>
            );
        } else if (done && candidate.score.numDoneReviews !== 0) {
            children = (
                <div className='widget-content'>
                    <CircleChart color={color} value={challengeScore} valueString={challengeScore + '%'} zindex={1} />
                    <div className='widget-footer'>
                        <Header size='sm' style={{ textAlign: 'center', marginBottom: 5 }}>{candidate.getScoreText(challengeScore)}</Header>
                        <Text size='sm' className='graph-card-subtitle' style={{ textAlign: 'center' }}>{candidate.getScoreText(challengeScore)} overall challenge score</Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead('CHALLENGE SCORE', undefined, challengeStars);
        } else if (candidate.score.numDoneReviews !== 0) {
            children = (
                <div className='widget-content'>
                    <CircleChart color={color} value={0} valueString='-' zindex={1} />
                    <div className='widget-footer'>
                        <Header size='sm'>Pending to assess</Header>
                        <Text size='sm' className='crazy-correct'>Answer submitted</Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead('CHALLENGE SCORE');
        } else if (done && !hasReview && canReview) {
            children = (
                <div className='widget-content'>
                    <CrazyButton text='See and assess' size='ceci' color='orange' action={() => goToReviewUserForExpert(opportunityId, playerId)} />
                    <div className='widget-footer'>
                        <Header size='sm' className='crazy-correct' style={{ textAlign: 'center' }}>Pending to assess</Header>
                        <Text
                            size='sm'
                            className='graph-card-subtitle crazy-correct'
                            style={{ textAlign: 'center' }}
                        >
                            Answer submitted
                        </Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead('CHALLENGE SCORE', 'Assess the candidate answer.');
        } else if (accepted) {
            children = (
                <div className='widget-content'>
                    <CrazyButton
                        size='small'
                        text='Extend time'
                        inverse
                        action={this.handleOpenModal}
                    />
                    <RecruiterReviewExtendTimelineModal
                        onRefresh={this.props.onRefresh}
                        show={this.state.extendModalStatus}
                        candidate={this.props.candidate}
                        onClose={this.handleCloseModal}
                    />
                    <div className='widget-footer'>
                        <Header size='sm'>Expires {processStep.expired.expireTime}</Header>
                        <Text size='sm' className='graph-card-subtitle crazy-mediumgrey'>Pending submission</Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead(undefined, 'The time to complete the challenge has been expired.');
        } else if (enabled) {
            children = (
                <div className='widget-content'>
                    <CrazyButton
                        size='small'
                        text='Invite again'
                        inverse
                        action={this.manageInvite}
                        loading={this.state.loading}
                    />
                    <div className='widget-footer'>
                        <Header size='sm'>Challenge not accepted</Header>
                        <Text size='sm' className='graph-card-subtitle'>Pending to accept</Text>
                    </div>
                </div>
            );
            head = ChallengeStatusWidget.getHead(undefined, 'The challenge has not been accepted yet.');
        } else {
            return null;
        }
        if (this.state.loadingData) {
            return <Spinner />;
        } else {
            return (
                <CrazyCard className='challenge-status-widget' columns={columns} total={total} onClick={this.onClick} style={style}>
                    {head}
                    {children}
                </CrazyCard>
            );
        }
    }

}

@connect(({ user, recruiterOpportunityGet }) => ({ user, recruiterOpportunityGet }))
export class RecruiterReviewWidget extends Component {
    constructor(props) {
        super(props);
        const opportunity = props.recruiterOpportunityGet.item;
        const { recruiter: canReview } = opportunity;
        this.state = {
            reviewModalStatus: false,
            canReview
        };
    }

    handleOpenModal = () => {
        this.setState({
            reviewModalStatus: true
        });
    };

    handleCloseModal = () => {
        this.setState({
            reviewModalStatus: false
        });
    };

    renderMyReview = () => {
        if (this.state.canReview) {
            const { style, user: { item: currentUser }, candidate: { reviewData: { reviews: reviewsList } } } = this.props;
            const myReview = reviewsList.find((review) => review.user.id === currentUser.id);
            if (myReview) {
                return (
                    <CrazyCard className='challenge-status-widget' total='3' columns='2' style={style}>
                        <div className='review-header'>
                            <Text size='xs' bold>YOUR REVIEW</Text>
                            <StarsViewComponent align='right' starsValue={myReview.stars} />
                            <CrazyButton
                                action={this.handleOpenModal}
                                style={{ margin: 'auto' }}
                                size='link'
                                color='primary'
                                text='edit'
                            />
                            <Text size='xs'>Reviewed {getTimeStringFrom(myReview.creation)}</Text>
                        </div>
                        <Text className='review-content' size='sm' dangerouslySetInnerHTML={{ __html: myReview.contentHtml }} style={style} />
                        <ReviewCandidateCvModal
                            onClose={this.handleCloseModal}
                            open={this.state.reviewModalStatus}
                            candidate={this.props.candidate}
                            isEdit
                            review={myReview}
                            onRefresh={this.props.onRefresh}
                        />
                    </CrazyCard>
                );
            } else {
                return (
                    <CrazyCard className='challenge-status-widget' total='3' columns='2' style={style}>
                        <Text size='xs' bold>YOUR REVIEW</Text>
                        <Text size='sm'>Evaluate the experience of the candidate for this role.</Text>
                        <Text size='xs' style={{ marginTop: 8 }}>Your evaluation and notes are only visible to you and the rest of the hiring team</Text>
                        <StarsViewComponent align='center' starsValue='0' inactiveColor='#D8D8D8' starsWidth={25} />
                        <CrazyButton
                            action={this.handleOpenModal}
                            style={{ margin: 'auto' }}
                            text='Assess now'
                            color='orange'
                            size='ceci'
                            inverse
                        />
                        <ReviewCandidateCvModal
                            onClose={this.handleCloseModal}
                            open={this.state.reviewModalStatus}
                            candidate={this.props.candidate}
                            onRefresh={this.props.onRefresh}
                        />
                    </CrazyCard>
                );
            }

        } else {
            return null;
        }
    };

    render() {
        return this.renderMyReview();
    }
}

export const RecruiterExperienceWidget = ({ candidate, onClick = () => { return; }, total = '3', style = {} }) => {
    if (candidate.score.experience) {
        return (
            <CrazyCard className='challenge-status-widget' total={total} onClick={onClick} style={style}>
                <Text size='xs' bold>EXPERIENCE SCORE</Text>
                <CircleChart value={candidate.score.experience} valueString={candidate.score.experience + '%'} zindex={1} />
                <Header size='sm' style={{ textAlign: 'center' }}>{candidate.getScoreText(candidate.score.experience)}</Header>
                <Text size='sm' className='graph-card-subtitle crazy-mediumgrey' style={{ textAlign: 'center' }}>
                    {candidate.getExperienceSentence(candidate.score.experience)}
                </Text>
            </CrazyCard>
        );
    } else {
        return (
            <CrazyCard className='challenge-status-widget' total={total} onClick={onClick} style={style}>
                <Text size='xs' bold>EXPERIENCE SCORE</Text>
                <CircleChart value={0} valueString='-' zindex={1} />
                <Header size='sm' style={{ textAlign: 'center' }}>Pending to assess</Header>
                {candidate.cv &&
                    <Text size='sm' className='graph-card-subtitle crazy-correct' style={{ textAlign: 'center' }}>
                        CV attached
                    </Text> ||
                    <Text size='sm' className='graph-card-subtitle crazy-error' style={{ textAlign: 'center' }}>
                        No CV attached
                    </Text>
                }
            </CrazyCard>
        );
    }
};