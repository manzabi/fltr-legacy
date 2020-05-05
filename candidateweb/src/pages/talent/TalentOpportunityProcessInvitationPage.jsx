import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncContainer from '../../components/asyncComponents/AsyncContainer';
import { fetchInvitationLinkOpen } from '../../redux/actions/opportunityActions';
import FluttrButton from '../../common/components/FluttrButton';
import { manageSucess, manageErrorApi } from '../../utils/uiUtils';
import { getApplyInvitation, goToProcess, navigateToUrl } from '../../utils/navigationManager';
import TalentOpportunityFullCardComponent from './TalentOpportunityFullCardComponent';
import OpsComponent from '../../components/OpsComponent';
import { canApplyToInvitationLink } from '../../common/constants/opportunityStatus';

class TalentOpportunityProcessInvitationPage extends Component {
    state = {
        error: null
    }

    componentDidMount() {
        const { opportunityId, code } = this.props.match.params;
        this.props.dispatch(fetchInvitationLinkOpen(opportunityId, code, this.onLinkSuccess, this.onLinkError));
    }

    onLinkSuccess = () => {
        this.setState({
            error: null
        });
    }

    onLinkError = (err) => {
        this.setState({
            error: err
        });
    }

    onAccept = () => {
        const { opportunityId } = this.props.match.params;
        navigateToUrl(getApplyInvitation(opportunityId));
    }

    onSuccess = () => {
        const { opportunityId } = this.props.match.params;
        manageSucess('Choise saved correctly');
        goToProcess(opportunityId);
    }

    onError = (error) => {
        const { opportunityId } = this.props.match.params;
        manageErrorApi(error);
        goToProcess(opportunityId);
    };

    renderLink = () => {
        const { opportunityInvitation } = this.props;

        return (
            <AsyncContainer data={opportunityInvitation}>
                <TalentOpportunityInvitationCardComponnent opportunity={opportunityInvitation.item} onAccept={this.onAccept} />
            </AsyncContainer>
        );
    };

    renderError = () => {

        const { error } = this.state;

        let code = null;
        if (error && error.response && error.response.data.code) {
            code = error.response.data.code;
        }

        let message = '';
        if (error && error.response && error.response.data.message) {
            message = error.response.data.message;
        }

        switch (code) {
            case 'TLOG004':
                return (
                    <OpsComponent title="Invitation link is broken " content="Click on the invitation link that you received again." />
                );
            default:
                return (
                    <OpsComponent title={'Error : ' + code} content={message} />
                );
        }

    };

    render() {

        if (this.state.error !== null) {
            return this.renderError();
        } else {
            return this.renderLink();
        }

    }
}

function mapStateToProps({ opportunityInvitation }) {
    return {
        opportunityInvitation
    };
}

export default connect(mapStateToProps)(TalentOpportunityProcessInvitationPage);

const TalentOpportunityInvitationCardComponnent = ({ opportunity, onAccept }) => {

    const canApply = canApplyToInvitationLink(opportunity);

    return (
        <section className='talent-process-invitation-component'>
            <div style={{ textAlign: 'center', width: '60%', margin: 'auto', padding: 20, maxWidth: 760 }}>
                <h3>Congratulations! {opportunity.company.name} is inviting you to progress to the next step of their job application process.</h3>
                {canApply &&
                    <div style={{ marginTop: 20 }}>
                        <FluttrButton action={onAccept} size='big'>
                            SIGN UP
                        </FluttrButton>
                    </div>
                }
            </div>

            <div style={{ paddingBottom: 80 }}>
                <TalentOpportunityFullCardComponent opportunity={opportunity} />
            </div>

        </section>
    );
};