import React, { Component } from 'react';
import TalentOpportunityFullCardComponent from './TalentOpportunityFullCardComponent';
import { connect } from 'react-redux';
import { fetchOpportunityData } from '../../redux/actions/opportunityActions';
import AsyncContainer from '../../components/asyncComponents/AsyncContainer';

class TalentOpportunityDetailPage extends Component {

    componentDidMount() {
        if (this.props.match.params && this.props.match.params.opportunityId) {
            const opportunityId = this.props.match.params.opportunityId;

            this.props.dispatch(fetchOpportunityData(opportunityId));
        }
    }

    render() {
        const { opportunityDetail } = this.props;

        return (
            <AsyncContainer data={opportunityDetail}>
                <div style={{ marginTop: 100 }}>
                    <TalentOpportunityFullCardComponent opportunity={opportunityDetail.item} />
                </div>
            </AsyncContainer>
        );
    }
}

function mapStateToProps({ opportunityDetail }) {
    return {
        opportunityDetail
    };
}

export default connect(mapStateToProps)(TalentOpportunityDetailPage);