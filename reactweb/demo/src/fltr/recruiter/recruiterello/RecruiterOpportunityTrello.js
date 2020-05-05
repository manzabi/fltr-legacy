import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, browserHistory } from 'react-router';

import {
    Row,
    Col,
    Grid,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

import {Board} from 'react-trello';

import {fetchProcessUserList} from '../../../redux/actions/trelloActions';
import UserToReview from '../../expert/opportunity/review/UserToReview';
import AsynchContainer from '../../template/AsynchContainer';
import {RankComponent} from '../candidate/RecruiterCandidateCard';
import StarRatingComponent from 'react-star-rating-component';


@withRouter
@connect((state) => state)
export default class RecruiterOpportunityTrello extends React.Component{

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        $('.fullContent').addClass('noPadding');

        var id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        this.props.dispatch(fetchProcessUserList(id));


    }

    componentWillUnmount(){
        $('.fullContent').removeClass('noPadding');
    }


    render() {

        let dataRetrieved = this.props.processUserList;

        const data = {
            lanes: [
                {
                    id: 'lane1',
                    title: 'Job Board',
                    cards: [
                        {
                            id: 'Card1',
                            name: 'John Smith',
                            dueOn: 'due in a day',
                            subTitle: 'SMS received at 12:13pm today',
                            body: 'Thanks. Please schedule me for an estimate on Monday.',
                            escalationText: 'Escalated to OPS-ESCALATIONS!',
                            cardColor: '#BD3B36',
                            cardStyle: { borderRadius: 6, boxShadow: '0 0 6px 1px #BD3B36', marginBottom: 15 }
                        },
                        {
                            id: 'Card2',
                            name: 'Card Weathers',
                            dueOn: 'due now',
                            subTitle: 'Email received at 1:14pm',
                            body: 'Is the estimate free, and can someone call me soon?',
                            escalationText: 'Escalated to Admin',
                            cardColor: '#E08521',
                            cardStyle: { borderRadius: 6, boxShadow: '0 0 6px 1px #E08521', marginBottom: 15 }
                        }
                    ]
                },
                {
                    id: 'lane21',
                    title: 'Invitation',
                    cards: [
                        {
                            id: 'Card21',
                            name: 'John Smith',
                            dueOn: 'due in a day',
                            subTitle: 'SMS received at 12:13pm today',
                            body: 'Thanks. Please schedule me for an estimate on Monday.',
                            escalationText: 'Escalated to OPS-ESCALATIONS!',
                            cardColor: 'orange',
                            cardStyle: { borderRadius: 6, boxShadow: '0 0 6px 1px #BD3B36', marginBottom: 15 }
                        },
                        {
                            id: 'Card35',
                            name: 'Card Sux',
                            dueOn: 'due now',
                            subTitle: 'Email received at 1:14pm',
                            body: 'Is the estimate free, and can someone call me soon?',
                            escalationText: 'Escalated to Admin',
                            cardColor: '#E08521',
                            cardStyle: { borderRadius: 6, boxShadow: '0 0 6px 1px #E08521', marginBottom: 15 }
                        }
                    ]
                },
                {
                    id: 'lane33',
                    title: 'FKC 33',
                    cards: [
                    ]
                },
                {
                    id: 'lane34',
                    title: 'FKC 34',
                    cards: [
                    ]
                },
                {
                    id: 'lane36',
                    title: 'FKC 36',
                    cards: [
                    ]
                }
            ]
        };

        /*
<AsynchContainer data={dataRetrieved} manageError={false}>
                <UserTrelloBoard data={dataRetrieved} />
            </AsynchContainer>
         */
        return(
            <AsynchContainer data={dataRetrieved}>
                <UserTrelloBoard data={dataRetrieved} />
            </AsynchContainer>
        );


    }

}

class UserTrelloBoard extends React.Component {
    render(){
        let props = { ...this.props };
        let id = props.id;
        let data = this.props.data.item;

        // console.log(JSON.stringify(data));

        const handleDragStart = (cardId, laneId) => {
            // console.log("drag started");
            // console.log(`cardId: ${cardId}`);
            // console.log(`laneId: ${laneId}`);

        };

        const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
            // console.log("drag ended");
            // console.log(`cardId: ${cardId}`);
            // console.log(`sourceLaneId: ${sourceLaneId}`);
            // console.log(`targetLaneId: ${targetLaneId}`);
        };

        return(
            <div className="recruiterOpportunityTrello">
                <Board
                    data={data}
                    customCardLayout
                    draggable
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}>
                    <UserTrelloCard />
                </Board>
            </div>
        );
    }
}

class UserTrelloCard extends React.Component {
    onClick(){
        // console.log('click');
    }

    render(){
        let props = { ...this.props };
        let id = props.id;

        let candidateDetails = props.candidateDetails;
        let user = candidateDetails.user;

        // console.log("props : " + JSON.stringify(props));
        /*
        {props.user.completeName}
                {props.user.completePosition}
                Codename: {props.user.nickname}

                <RankComponent rank={rank} />
         */

        let rank = candidateDetails.review.rank;//Math.floor(Math.random() * 100) + 1;
        let stars = 4;

        return (
            <div id={id} onClick={() => this.onClick()} className="candidateTrelloCard">
                <Grid>
                    <Row>
                        <Col xs={3} className="noPadding">
                            <img src={user.imageUrl} width='100%'
                                style={{marginLeft: 0, marginRight: 10, marginTop: 0, borderRadius: 100}}/>
                        </Col>
                        <Col xs={9} className="rightSide">
                            <span className="userName">{user.completeName}</span>
                            <br/>
                            <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Rank is <b>{rank}</b></Tooltip>}>
                                <div className="starRatingContainer">
                                    <StarRatingComponent
                                        name={'ratesTalent' + candidateDetails.id}
                                        starCount={5}
                                        value={stars}
                                        editing={false}
                                        emptyStarColor="transparent" />
                                </div>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

