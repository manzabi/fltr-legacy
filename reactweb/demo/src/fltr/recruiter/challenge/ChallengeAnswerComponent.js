import React from 'react';

import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
} from '@sketchpixy/rubix';

import Button from 'react-bootstrap-button-loader';

import AsynchContainer from '../../template/AsynchContainer';
import FeedReplyListComponent from '../../feed/FeedReplyListComponent';

import {fetchUserAnswer, resetUserAnswer} from '../../../redux/actions/reviewActions';

import PanelContainer, {
    PanelContainerHeader, PanelContainerContent, PanelContainerCustom
} from '../../template/PanelContainer';

import FeedReplyWriteComponent from '../../feed/FeedReplyWriteComponent';
import OpportunityChallengeShow from '../../opportunity/challenge/OpportunityChallengeShow';
import {Modal} from '@sketchpixy/rubix/lib/index';
import OpportunityHeaderReviewCardDetail from '../../opportunity/OpportunityHeaderReviewCardDetail';
import FeedComponent from '../../feed/FeedComponent';
import OpportunityChallengeModal from '../../opportunity/challenge/OpportunityChallengeModal';

// import Intercom from '../../utils/Intercom';

@connect((state) => state)
export default class ChallengeAnswerComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;
        let userId = this.props.userId;
        this.props.dispatch(resetUserAnswer());
        this.props.dispatch(fetchUserAnswer(id, userId));
    }

    componentWillUnmount(){
        this.props.dispatch(resetUserAnswer());
    }

    render() {

        let id = this.props.id;
        let userId = this.props.userId;
        let objectStored = this.props.playerAnswer;

        return (
            <AsynchContainer data={objectStored} manageError={false}>
                <ChallengeAnswerContent id={id} userId={userId} data={objectStored} />
            </AsynchContainer>
        );
    }

}

class ChallengeAnswerContent extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            enabled: true,
            stars: 0,
            openFeedback: false,
            showModal: false
        };
    }

    onShowChallenge(){
        this.setState(
            {
                showModal: true
            }
        );
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    render(){

        let id = this.props.id;
        let userId = this.props.userId;
        let item = this.props.data;

        // from object stored
        let challenge = item.item.challenge;

        //console.log("-----------------------------");
        //console.log("1. item  : " + JSON.stringify(item));
        //console.log("2. Challenge : " + JSON.stringify(challenge));

        // console.log("Challenge : " + JSON.stringify(challenge));
        let feed = challenge.playerDetails.newsFeed;
        //debugger;
        let user = feed.user;
        // console.log("user : " + JSON.stringify(user));
        let opportunity = item.item.opportunity;
        // console.log("opportunity : " + JSON.stringify(opportunity));

        if (item.isError){
            return(
                <PanelContainer back={true} size="big">
                    <PanelContainerContent>
                        <Col xs={12} className="noPadding">
                            <div style={{textAlign:'center'}}>
                                <span className="summaryTitle">
                                    Information not available
                                </span>
                            </div>
                        </Col>
                    </PanelContainerContent>
                    {/* <Intercom /> */}
                </PanelContainer>
            );

        }

        let placeholder = 'If you would like to ask more details to ' + user.name +' you can do it here.';

        return (
            <div className="reviewUserComponent">
                <div style={{paddingBottom:150}}>
                    <PanelContainer back={true} size="big">
                        <PanelContainerHeader padding={false}>
                            <OpportunityHeaderReviewCardDetail onViewChallenge={() => this.onShowChallenge()} data={opportunity}/>
                        </PanelContainerHeader>
                        <PanelContainerCustom style={{paddingTop:30, paddingBottom:10}}>
                            <Col xs={12} style={{textAlign:'center'}}>
                                <span className="reviewUserName">
                                    {user.name}'s answer
                                </span>
                            </Col>
                        </PanelContainerCustom>
                        <PanelContainerContent padding={false} style={{marginTop: 10}}>
                            <Col xs={12} className="noPadding" style={{marginBottom: 100}}>
                                <FeedComponent data={feed}/>
                            </Col>
                        </PanelContainerContent>
                        <PanelContainerCustom style={{paddingTop:20}}>
                            <Grid className="noPadding">
                                <Row>
                                    <Col xs={12}>
                                        <span className="summaryTitle">
                                            Comments
                                        </span>
                                    </Col>
                                </Row>
                                <FeedReplyWriteComponent id={feed.id} placeholder={placeholder}/>
                            </Grid>
                        </PanelContainerCustom>
                        <PanelContainerCustom style={{paddingTop:20}}>
                            <Grid className="noPadding">
                                <FeedReplyListComponent id={feed.id} />
                            </Grid>
                        </PanelContainerCustom>
                    </PanelContainer>
                </div>
                <OpportunityChallengeModal open={this.state.showModal} onClose={() => this.closeModal()} id={id}/>
                {/* <Intercom /> */}
            </div>
        );
    }
}
