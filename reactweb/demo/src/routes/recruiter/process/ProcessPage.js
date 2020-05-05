import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Entity } from '@sketchpixy/rubix/lib/L20n';
import RecruiterOpportunityTrello from '../../../fltr/recruiter/recruiterello/RecruiterOpportunityTrello';

@withRouter
@connect((state) => state)
export default class ProcessPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }
        // console.log("id : " + id);

        return (
            <RecruiterOpportunityTrello id={id}/>
        );
    }
}