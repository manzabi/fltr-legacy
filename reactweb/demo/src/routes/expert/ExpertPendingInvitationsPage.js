import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {fetchExpertPendingOpportunities} from '../../redux/actions/opportunityActions';

import AsynchContainer from '../../fltr/template/AsynchContainer';
import ExpertPendingInvitationsComponent from '../../fltr/expert/opportunity/ExpertPendingInvitationComponent';

// import Intercom from '../../fltr/utils/Intercom';


@withRouter
@connect((state) => state)
export default class ExpertPendingInvitationsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title : document.title
        };
    }

    componentDidMount(){
        document.title = 'Pending Invitations';
        this.loadPendingTasks();
    }

    componentWillUnmount(){
        document.title = this.state.title;
    }

    loadPendingTasks(){
        this.props.dispatch(fetchExpertPendingOpportunities());
    }

    render() {
        let expertPendingOpportunities = this.props.expertPendingOpportunities;

        return (
            <div className="containerSection expertPendingInvitationPage containerSection container-fluid">
                <AsynchContainer data={expertPendingOpportunities} manageError={false}>
                    <ExpertPendingInvitationsComponent data={expertPendingOpportunities} onRefresh={() => this.loadPendingTasks()}/>
                </AsynchContainer>
                {/* <Intercom /> */}
            </div>
        );
    }
}
