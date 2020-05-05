import React, { Component } from 'react';
import { connect } from 'react-redux';
import FluttrButton from '../../common/components/FluttrButton';
import { TEST_TYPE_CHALLENGE } from '../../common/constants/procesTypes';
import AsyncContainer from '../../components/asyncComponents/AsyncContainer';
import { candidateAcceptChallenge, fetchOpportunityData } from '../../redux/actions/opportunityActions';
import { getForFormChallenge, goToDashboard, goToProcess, navigateToUrl } from '../../utils/navigationManager';
import { manageErrorApi } from '../../utils/uiUtils';
import CommonConfirmModal from '../../common/components/CommonConfirmModal';
import {withRouter} from 'react-router-dom';

class  TalentOpportunityChallengeAceptPage extends Component {
    componentDidMount () {
        const {opportunityId} = this.props.match.params;
        this.props.dispatch(fetchOpportunityData(opportunityId));
    }

    onAcept = () => {
        const {processId} = this.props.match.params;
        const data = {value: true};
        this.props.dispatch(candidateAcceptChallenge(processId, data, this.onAcceptSuccess, this.onAcceptError));
    }

    onDecline = () => {
        const {processId} = this.props.match.params;
        const data = {value: false};
        this.props.dispatch(candidateAcceptChallenge(processId, data, this.onDeclineOk, this.onDeclineError));
    }

    onAcceptSuccess = () => {
        const {opportunityId} = this.props.match.params;
        navigateToUrl(getForFormChallenge(opportunityId));
    }

    onAcceptError = (error) => {
        manageErrorApi(error);
        this.goBackToProcess();
    }

    onDeclineOk = () => {
        this.goBackToProcess();
    }

    onDeclineError = (error) => {
        manageErrorApi(error);
        this.goBackToProcess();
    }
    
    goBackToProcess = () => {
        const {opportunityId} = this.props.match.params;
        goToProcess(opportunityId);
    }

    render () {
        const {opportunityDetail} = this.props;
        return (
            <AsyncContainer data={opportunityDetail}>
                <TalentOpportunityChallengeAceptComponent backToProcess={this.goBackToProcess} opportunity={opportunityDetail.item} onAcept={this.onAcept} onDecline={this.onDecline} />
            </AsyncContainer>
        );
    }
}

function mapStateToProps ({opportunityDetail}) {
    return {
        opportunityDetail
    };
}

export default connect(mapStateToProps)(TalentOpportunityChallengeAceptPage);

@withRouter
class TalentOpportunityChallengeAceptComponent extends Component {
    state = {
        rejectModalStatus: false
    }
    componentDidMount () {
        const {process} = this.props.opportunity.playerDetail;
        const challenge = process.steps.filter((step) => step.type === TEST_TYPE_CHALLENGE)[0];
        if (challenge) {
            if(challenge.accepted !== null || challenge.enabled !== true) {
                this.props.backToProcess();
            }
        } else {
            this.props.backToProcess();
        }

    }

    openRejectModal = () => {
        this.setState({
            rejectModalStatus: true
        });
    }

    closeRejectModal = () => {
        this.setState({
            rejectModalStatus: false
        });
    }

    render () {
        const {challengeDetail, commonDetail} = this.props.opportunity; 
        return (
            <div style={{backgroundColor: 'white'}}>
                <FluttrButton action={() => goToDashboard()} className='my-opportunities-button' type='link'><i className='fal fa-angle-double-left' /> my opportunities</FluttrButton>
                <section className='talent-process-accept-component'>
                    <h1>Demonstrate your talent!</h1>
                    <section className='step-description'>
                        <div>
                            <i className='fal fa-rocket orange' />
                            <h3>
                            Accept this invitation and enter the challenge
                            </h3>
                            <p>
                            Entering this challenge will prove your motivation, your talent and skills for this role. Don´t miss this opportunities. Otherwise someone else could complete this before you and move up in the ranks.
                            </p>
                        </div>
                        <div>
                            <i className='fal fa-clock blue' />
                            <h3>
                            You have maximum <span className='fluttr-blue'>{commonDetail.expireApplication.expireString}</span> to complete this challenge
                            </h3>
                            <p>
                            Once you accept invitation for the challenge, time will begin to countdown. Be sure you will have enough time to complete this.
                            </p>
                        </div>
                        <div>
                            <i className='fal fa-calendar-alt purple' />
                            <h3>
                            This invitation will expire on <span className='fluttr-purple'>{challengeDetail.expire.expireDateString}</span>
                            </h3>
                            <p>
                            It´s important to accept this challenge by <span className='fluttr-purple'>{challengeDetail.expire.expireDateString}</span>. After this date you will no longer be able to accept this challenge. We recommend you to accept it as soon as possible!
                            </p>
                        </div>
                    </section>
                    <div className='process-choises'>
                        <FluttrButton action={this.props.onAcept}>
                        Sure, I accept!
                        </FluttrButton>
                        <FluttrButton type='link' action={this.openRejectModal} className='refuse-participate-button'>
                        No, I don’t want to participate
                        </FluttrButton>
                    </div>
                    <CommonConfirmModal 
                        open={this.state.rejectModalStatus}
                        onReject={this.props.onDecline}
                        onConfirm={this.closeRejectModal}
                        backdrop={false}
                        rejectText='Yes, I want to reject'
                        acceptText='Go back to the invitation'
                        verticalButtons
                    >
                        <div>
                            <h1>Are you sure?</h1>
                            <p style={{textAlign: 'center'}}>
                            Completing this challenge is required for this position. It´s a way for you to show your skills and demonstrate your talent. Don´t miss out on this important step to finish the application! 
                            </p>  
                        </div>
                    </CommonConfirmModal>
                </section>
            </div>
        );
    }
}