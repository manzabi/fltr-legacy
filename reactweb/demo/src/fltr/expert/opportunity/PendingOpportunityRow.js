import React, {Component} from 'react';

import {

    Grid,
} from '@sketchpixy/rubix';

import * as pendingTypes from '../../../constants/opportunityJudgePendingType';
import {
    goToExpertCreateChallenge,
    goToPendingInvitations,
    goToReviewUserForExpert
} from '../../navigation/NavigationManager';
import FluttrButton from '../../../common/components/FluttrButton';
import { isMobile } from 'react-device-detect';
import { acceptExpertPendingOpporunity, declineExpertPendingOpporunity, fetchExpertPendingOpportunities } from '../../../redux/actions/opportunityActions';
import { connect } from 'react-redux';
import CommonConfirmModal from '../../../common/components/CommonConfirmModal';
import OpportunityTags from '../../opportunity/tag/OpportunityTags';
import { fetchReviewUserList } from '../../../redux/actions/reviewActions';

export default class PendingOpportunityRow extends Component {

    constructor(props) {
        super(props);
    }

    renderItem(){
        let data = this.props.data;

        // console.log(JSON.stringify(data));

        switch(data.type){
            case pendingTypes.REVIEW:
                return (<PendingReviewItem data={data} />);
            case pendingTypes.EXPERT:
                return (<PendingExpertItem data={data} />);
            // case pendingTypes.CHALLENGE:
            //     return (<PendingChallengeItem data={data} />);
            default:
                // console.log("not found type : " + data.type);
                return null;
        }
    }

    render() {

        return (
            <Grid className="pendingOpportunityRow">
                {this.renderItem()}
            </Grid>
        );
    }

}

@connect((state) => state)
class PendingReviewItem extends Component{
    state = {
        loading: false
    }

    onClick = () => {
        let data = this.props.data;
        const {id} = data.opportunity;
        this.setState({
            loading: true
        });
        this.props.dispatch(fetchReviewUserList(id, this.onFetchUsersSucess));
        // goToReviewForExpert(data.opportunity.id);
    }

    onFetchUsersSucess = (response) => {
        this.setState({
            loading: false
        });
        const {id} = this.props.data.opportunity;

        const reviews = response.data.filter((review) => {
            const {completed} = review.review; 
            return completed === false;
        });
        if (reviews.length) {
            const firstId = reviews[0].user.id;
            goToReviewUserForExpert(id, firstId);
        }
    }
    

    render(){
        let data = this.props.data;

        return (
            <div className='task-item' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className='task-body'>
                    <div className='task-icon' >
                        <i className="icon-entypo-new pendingIcon fluttrDarkOrange" />
                    </div>
                    <div className='task-description'>
                        <p className='fluttr-text-md'>
                            <strong>{`${data.opportunity.expertDetail.reviewLeft} new pending review${data.opportunity.expertDetail.reviewLeft > 1 ? 's' : ''} `}</strong> to the challenge for {data.opportunity.roleTitle} at {data.opportunity.company.name}
                        </p>
                        <p>
                            Challenge expires in {data.opportunity.challengeDetail.expire.expireDays}
                        </p>
                    </div>
                </div>
                {/* <div xs={11} className="vertical-flex vertical-flex-align-left">
                    <div className="pendingItemText">
                        <strong>Review</strong> <strong className="fluttrDarkOrange">{data.opportunity.expertDetail.reviewLeft}</strong> new response{data.opportunity.expertDetail.reviewLeft > 1 ? 's' : ''} to the challenge for <strong className="fluttrBlue">{data.opportunity.roleTitle}</strong> at <strong className="fluttrEsmeraldGreen">{data.opportunity.company.name}</strong>
                    </div>
                </div> */}
                <div className='task-actions'>
                    <FluttrButton action={this.onClick} size='xSmall' loading={this.state.loading}>
                        Review
                    </FluttrButton>
                </div>
            </div>
        );
    }
}

@connect((state) => state)
class PendingExpertItem extends Component {

    state = {
        modalStatus: false
    }

    onClick = () => {
        goToPendingInvitations();
    }

    onUpdateOpportunities = () => {
        this.props.dispatch(fetchExpertPendingOpportunities());
    }

    accept = () => {
        this.props.dispatch(acceptExpertPendingOpporunity(this.props.data.opportunity.id, this.onUpdateOpportunities));
    }

    decline = () => {
        this.openModal();
    }

    openModal = () => {
        this.setState({
            modalStatus: true
        });
    }
    
    closeModal = () => {
        this.setState({
            modalStatus: false
        });
    }

    confirmReject = () => {
        this.props.dispatch(declineExpertPendingOpporunity(this.props.data.opportunity.id, this.onUpdateOpportunities));
        this.closeModal();
    }

    render () {
        let data = this.props.data;

        return (
            // <Row className="pendingItemContainer vertical-align" onClick={() => this.onClick()}>
            //     <Col xs={1} className="vertical-flex noPadding">
            //         <i className="icon-entypo-paper-plane pendingIcon fluttrViolet" />
            //     </Col>
            //     <Col xs={11} className="vertical-flex vertical-flex-align-left">
            //         <div className="pendingItemText">
            //             <strong>Accept</strong> <strong className="fluttrViolet">1</strong> invitation to be expert in a new challenge for <strong className="fluttrBlue">{data.opportunity.roleTitle}</strong> at <strong className="fluttrEsmeraldGreen">{data.opportunity.company.name}</strong>
            //         </div>
            //     </Col>
            // </Row>
            <div className='task-item' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className='task-body'>
                    <div className='task-icon' >
                        <i className="icon-entypo-paper-plane pendingIcon fluttrViolet" />                    </div>
                    <div className='task-description'>
                        <p className='fluttr-text-md'>
                            Invitation as an expert for <strong>{data.opportunity.roleTitle}</strong> at <strong>{data.opportunity.company.name}</strong> is pending, do you want to participate?
                        </p>
                        <OpportunityTags taglist={data.opportunity.tagList} showIcon={false} hideEdit />
                    </div>
                </div>
                <CommonConfirmModal
                    open={this.state.modalStatus}
                    onConfirm={this.confirmReject}
                    onReject={this.closeModal}
                >
                    <h3>Decline opportunity</h3>
                    <h4>
                        Are you really sure to decline the invitation?
                    </h4>
                </CommonConfirmModal>
                <div className='task-actions'>
                    <FluttrButton action={this.accept} size='xSmall'>
                        Accept
                    </FluttrButton>
                    <FluttrButton inverse type='link' action={this.decline} size='xSmall'>
                        Reject
                    </FluttrButton>
                </div>
                
            </div>
        );
    }
}

class PendingChallengeItem extends Component{
    onClick = () => {
        if (!isMobile) {
            let data = this.props.data;
            goToExpertCreateChallenge(data.opportunity.id);
        }
    }

    render(){
        let data = this.props.data;

        return (
            // <Row className="pendingItemContainer vertical-align" >
            //     <Col xs={1} className="vertical-flex noPadding">
            //         <i className="icon-entypo-clipboard pendingIcon fluttrBlue" />
            //     </Col>
            //     <Col xs={11} className="vertical-flex vertical-flex-align-left">
            //         <div className="pendingItemText">
            //             <strong>Create</strong> <strong className="fluttrBlue">1</strong> challenge for the position of <strong className="fluttrBlue">{data.opportunity.roleTitle}</strong> at <strong className="fluttrEsmeraldGreen">{data.opportunity.company.name}</strong>
            //         </div>
            //     </Col>
            // </Row>
            <div className='task-item'>
                <div className='task-body'>
                    <div className='task-icon' >
                        <i className="icon-entypo-clipboard pendingIcon fluttrBlue" />
                    </div>
                    <div className='task-description'>
                        <p className='fluttr-text-md'>
                            <strong>Create challenge for </strong> {data.opportunity.roleTitle} at {data.opportunity.company.name}
                        </p>
                        { isMobile &&
                            <p>
                                Option available on desktop
                            </p>
                        }
                    </div>
                </div>
                { !isMobile &&
                    <FluttrButton action={this.onClick} size='xSmall'>
                        Create
                    </FluttrButton>
                }
            </div>
        );
    }
}