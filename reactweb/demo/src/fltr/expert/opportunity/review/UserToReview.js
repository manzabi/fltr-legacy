import React from 'react';

import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
} from '@sketchpixy/rubix';

import StarRatingComponent from 'react-star-rating-component';
import AsynchContainer from '../../../template/AsynchContainer';

import {fetchReviewUserList} from '../../../../redux/actions/reviewActions';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import PanelContainer, {PanelContainerContent} from '../../../template/PanelContainer';
import PlayerHidden from '../../../user/PlayerHidden';
import {goToReviewUserForExpert, goToReviewUserEditForExpert} from '../../../navigation/NavigationManager';

import OpportunityTimer from '../../../opportunity/OpportunityTimer';

import * as opportunityStatus from '../../../../constants/opportunityStatus';
import ReviewCompletedBanner from './ReviewCompletedBanner';
import ReviewTalentWaitBanner from './ReviewTalentWaitBanner';
import {getTimeString} from '../../../../common/timerUtils';

@connect((state) => state)
export default class UserToReview extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;

        this.props.dispatch(fetchReviewUserList(id));
    }

    render() {

        let id = this.props.id;
        let opportunity = this.props.opportunity;
        let objectStored = this.props.reviewUserList;

        return (
            <AsynchContainer data={objectStored} manageError={false}>
                <UserToReviewContent id={id} data={objectStored} opportunity={opportunity}/>
            </AsynchContainer>
        );
    }

}

class UserToReviewContent extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){

        let id = this.props.id;
        let item = this.props.data;
        let opportunity = this.props.opportunity;

        // console.log('opportunity : ' + JSON.stringify(opportunity));

        if (item.isError){
            return(
                <div style={{marginTop:50,textAlign:'center'}}>
                    <span className="summaryTitle">
                        List is not available
                    </span>
                </div>
            );

        }

        let userList = item.item;

        let countToReview = 0;
        let first = null;
        let toReviewList = userList.map(function(content){
            if (!content.review.completed){
                if (first == null){
                    first = content.user.id;
                }
                countToReview++;
                return (
                    <PanelContainerContent key={content.user.id}>
                        <UserToReviewItem id={id} user={content.user} review={content.review} challenge={content.challenge}/>
                    </PanelContainerContent>);
            }
        });

        let countAlreadyReview = 0;
        let arrayAlreadyReview = [];
        let alreadyReviewFirstCycle = userList.map(function(content){
            if (content.review.completed){
                countAlreadyReview++;
                arrayAlreadyReview.push(content);
            }
        });

        arrayAlreadyReview.sort(function(a,b){
            // console.log('a.review.starNumber : ' + a.review.starNumber + " b.review.starNumber : " + b.review.starNumber);
            return parseInt(b.review.starNumber) - parseInt(a.review.starNumber);
        });

        let alreadyReview = arrayAlreadyReview.map(function(content){
            return (
                <PanelContainerContent key={content.user.id}>
                    <UserAlreadyReviewedItem id={id} user={content.user} review={content.review}/>
                </PanelContainerContent>);
        });

        // console.log('opportunity.judgeCompleted : ' + opportunity.judgeCompleted);
        // console.log('opportunityStatus.getEndsInForStatus(opportunity.statusId) : ' + opportunityStatus.getEndsInForStatus(opportunity.statusId));

        return (
            <Grid>
                <Col xs={12} className="noPadding">
                    {this.renderBanner(countToReview, first)}

                    { countToReview == 0 && countAlreadyReview == 0&&
                    <div style={{paddingBottom:20, textAlign:'center', paddingTop:20}}>
                        <span className="summaryTitle">
                            No information available about this review.
                        </span><br/><br/>
                    </div>
                    }

                    { countToReview > 0 &&
                        <div style={{paddingBottom:20}}>
                            <span className="summaryTitle">
                                {countToReview} Candidate{(countToReview > 1) ? 's' : ''} to be reviewed
                            </span><br/><br/>
                            <Grid>
                                {toReviewList}
                            </Grid>
                        </div>
                    }

                    { countAlreadyReview > 0 &&
                        <div style={{paddingBottom:20}}>
                            <span className="summaryTitle">
                                {countAlreadyReview} Candidate{(countAlreadyReview > 1) ? 's' : ''} reviewed
                            </span><br/><br/>
                            <Grid>
                                {alreadyReview}
                            </Grid>
                        </div>
                    }
                </Col>
            </Grid>
        );
    }

    renderBanner(countToReview, first){
        let id = this.props.id;
        let opportunity = this.props.opportunity;

        if (opportunity.judgeCompleted) {
            return (
                <ReviewCompletedBanner style={{paddingBottom:20}}/>
            );
        } else {

            if (!opportunity.judgeCompleted) {

                if (countToReview > 0) {

                    return (
                        <Grid style={{paddingBottom: 20, marginBottom: 20}} className="sectionBordered">
                            <Row>
                                <Col xs={6} style={{textAlign: 'left'}}>
                                    <span className="textStrong fluttrOrange" style={{marginLeft:20}}>
                                        <i className="icon-entypo-new-message" /> {countToReview} Candidate{(countToReview > 1) ? 's' : ''} to review
                                    </span>
                                </Col>
                                <Col xs={6} style={{textAlign: 'right'}} className="textStrong">
                                    {!opportunity.judgeCompleted && opportunityStatus.checkTimer(opportunity.statusId) &&
                                        <div style={{marginRight:20}}>
                                            <OpportunityTimer key={opportunity.id} data={opportunity} role="expert" ends={true} colorNormal="#333333" dayLimit={3}/>
                                        </div>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} style={{textAlign: 'center'}}>
                                    <Button className="btn-lg" onClick={() => goToReviewUserForExpert(id, first)}
                                        bsStyle="fluttrEsmeraldGreen" target="_blank">
                                        Start!
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{paddingTop:20}}>
                                <Col xs={12} style={{textAlign: 'center'}}>
                                    <span className="textStrong">
                                        <span className="fluttrRed"><i style={{marginRight:15}} className="icon-entypo-heart feedbackIcon" ></i></span> Thanks for making recruitment <span className="fluttrRed">#awesome!</span>
                                    </span>
                                </Col>
                            </Row>
                        </Grid>
                    );
                } else {
                    let text = 'As soon as a new response comes in we will notify you!';
                    return (
                        <ReviewTalentWaitBanner text={text} style={{paddingBottom:20}}/>
                    );
                }
            }
        }

        return(
            <div></div>
        );
    }
}

class UserAlreadyReviewedItem extends React.Component{
    render() {
        let id = this.props.id;
        let userReview = this.props.user;
        let review = this.props.review;

        return (
            <Grid>
                <Row className="vertical-align noPadding">
                    <Col xs={6} className="vertical-flex vertical-flex-align-left noPadding">
                        <PlayerHidden user={userReview} fluid={false}/>
                    </Col>
                    <Col xs={2} className="vertical-flex">
                        <Grid>
                            <Row className="vertical-align">
                                <Col xs={12} style={{padding: 0}}>
                                    <StarRatingComponent
                                        name="rate1"
                                        starCount={5}
                                        value={review.starNumber}
                                        editing={false}
                                    />
                                </Col>
                            </Row>
                            <Row className="vertical-align">
                                <Col xs={12}>
                                    <span className="header-values-label"><Entity entity='userChallengeScore'/></span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                    <Col xs={2} className="vertical-flex">
                        {review.reply > 0 &&
                        <Grid>
                            <Row className="vertical-align">
                                <Col xs={12} style={{padding: 0}} className="header-values">
                                    {review.reply}
                                </Col>
                            </Row>
                            <Row className="vertical-align">
                                <Col xs={12}>
                                    <span className="header-values-label">Comments</span>
                                </Col>
                            </Row>
                        </Grid>
                        }
                    </Col>
                    <Col xs={1} className="vertical-flex">
                        <Button onClick={() => goToReviewUserEditForExpert(id, userReview.id)} bsStyle="link" target="_blank">
                        Edit
                        </Button>
                    </Col>
                    <Col xs={1} className="vertical-flex">
                        <Button onClick={() => goToReviewUserForExpert(id, userReview.id)} bsStyle="link" target="_blank">
                            Show
                        </Button>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class UserToReviewItem extends React.Component{
    render() {
        let id = this.props.id;
        let userReview = this.props.user;
        let review = this.props.review;
        let submissionDate = getTimeString(this.props.challenge.creation);
        return (
            <Grid>
                <Row className="vertical-align noPadding">
                    <Col sm={8} className="vertical-flex vertical-flex-align-left noPadding">
                        <PlayerHidden user={userReview} fluid={false} submissionDate={submissionDate}/>
                    </Col>
                    <Col sm={2} className="vertical-flex">
                        {review.reply > 0 &&
                        <Grid>
                            <Row className="vertical-align">
                                <Col xs={12} style={{padding: 0}} className="header-values">
                                    {review.reply}
                                </Col>
                            </Row>
                            <Row className="vertical-align">
                                <Col xs={12}>
                                    <span className="header-values-label">Comments</span>
                                </Col>
                            </Row>
                        </Grid>
                        }
                    </Col>
                    <Col sm={2} className="vertical-flex">
                        <Button onClick={() => goToReviewUserForExpert(id, userReview.id)} bsStyle="link" target="_blank">
                            Review
                        </Button>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
