import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import RecruiterOpportunityCreateComponent from '../../../fltr/recruiter/opportunity/RecruiterOpportunityCreateComponent';
import {goToRecruiterCompanyCreate} from '../../../fltr/navigation/NavigationManager';

@withRouter
@connect((state) => state)
export default class RecruiterOpportunityCreatePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let user = this.props.user.item;
        if (user.recruiterDetails.company == null || user.recruiterDetails.company == undefined){
            // create company
            goToRecruiterCompanyCreate();
        }
    }

    render() {

        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }

        return (
            <div className="containerSection recruiterOpportunityCreatePage">
                <RecruiterOpportunityCreateComponent id={id}/>
            </div>
        );
    }
}