import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ChallengeAnswerComponent from '../../../fltr/recruiter/challenge/ChallengeAnswerComponent';

@withRouter
@connect((state) => state)
export default class ChallengeAnswerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : document.title
        };
    }

    render() {

        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        let userId;
        if(this.props.id){
            userId = this.props.userId;
        }else{
            userId = this.props.params.userId;
        }

        // console.log('id : ' + id + " userid : " + userId);

        return (
            <ChallengeAnswerComponent key={'opp_' + id + '_usr_' + userId} id={id} userId={userId}/>
        );
    }
}