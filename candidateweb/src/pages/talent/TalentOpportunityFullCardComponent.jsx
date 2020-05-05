import React, { Component } from 'react';
import OpportunityCard from '../../components/OpportunityCard';
import TalentOpportunityProcessComponent from './TalentOpportunityProcessComponent';
import { withRouter } from 'react-router-dom';

@withRouter
export default class TalentOpportunityFullCardComponent extends Component {

    render() {
        const { opportunity } = this.props;

        return (
            <div className='opportunity-full-card-component'>
                <OpportunityCard opportunity={opportunity} />
                <TalentOpportunityProcessComponent opportunity={opportunity} />
            </div>
        );
    }
}
