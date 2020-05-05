import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RecruiterOpportunityDetailComponent from '../../../fltr/recruiter/opportunity/RecruiterOpportunityDetailComponent';

@withRouter
@connect((state) => state)
export default class RecruiterOpportunityDetailPage extends React.Component {

    constructor(props) {
        super(props);
    }
    getContext(){
        let context;
        if(this.props.context){
            context = this.props.context;
        }else if (this.props.location){
            context = this.props.location.query.context;
        }
        return context;
    }

    render() {

        let context = this.getContext() || 'candidates';
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        return (
            <RecruiterOpportunityDetailComponent id={id} context={context}/>
        );
    }
}