import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RecruiterCandidatesComponent from '../../../fltr/recruiter/candidate/RecruiterCandidatesComponent';

@withRouter
export default class RecruiterCandidatesPage extends React.Component {

    render() {
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        return (
            <div className="containerSection recruiterCandidatesPage">
                <RecruiterCandidatesComponent id={id} key={id} {...this.props}/>
            </div>
        );
    }
}