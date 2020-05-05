import React, { Component } from 'react';
import AsynchContainer from '../../template/AsynchContainer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { resetOpportunityGetById, getOpportunityById } from '../../../redux/actions/recruiterOpportunityActions';
import CopyToClipboard from 'react-copy-to-clipboard';
import { goToRecruiterDashboard } from '../../navigation/NavigationManager';
import { manageSuccess } from '../../../common/utils';
import { Header, Text } from '../../../layout/FluttrFonts';
import Container from '../../../layout/layout/Container';
import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import Offset from '../../../layout/layout/Offset';
import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import * as ga from '../../../constants/analytics';

@withRouter
@connect((state) => state)
export default class RecruiterOpportunityLivePage extends Component {

    state = {
        showModal: !this.props.disableModal
    };

    componentDidMount() {
        if (!this.props.opportunity) {
            this.props.dispatch(resetOpportunityGetById(this.onResetOpportunity));
        }
        ga.track(ga.OPPORTUNITY_CHALLENGE_LIVE_PAGE);
    }

    onResetOpportunity = () => {
        if (!this.props.opportunity) {
            this.props.dispatch(getOpportunityById(this.props.params.id));
        }
    };

    onCloseModal = () => {
        this.setState({ showModal: false });
    };

    onGoBack = () => {
        if (this.props.disableModal) {
            this.props.onClose();
        } else {
            goToRecruiterDashboard();
        }
    };

    render() {
        const { recruiterOpportunityGet, opportunity } = this.props;
        const Opportunity = opportunity ? { isFetching: false, isError: false, item: opportunity } : recruiterOpportunityGet;
        return (
            <AsynchContainer data={Opportunity}>
                <OpportunityLiveComponent
                    opportunity={Opportunity.item}
                    socialClick={this.socialClick}
                    id={this.props.params.id}
                    showModal={this.state.showModal}
                    onCloseModal={this.onCloseModal}
                    onGoBack={this.onGoBack}
                    onClose={this.props.onClose}
                />
            </AsynchContainer>
        );
    }
}

const OpportunityLiveComponent = ({ opportunity, showModal, onCloseModal, onGoBack }) => {
    return (
        <Container className='opportunity-live-page-new-container'>
            <div className='close-button-wrapper'>
                <Text size='sm' className='close-button' onClick={onGoBack}>Close</Text>
            </div>
            <Grid>
                <Offset xsOffset='3' />
                <Col className='opportunity-live-page-new' xs='6'>
                    <Header size='lg'>Invite your candidates</Header>
                    <Text size='sm' bold style={{ marginBottom: 61 }}>Send the following link to invite your candidates to take the test</Text>
                    <Text size='sm' >Copy the link below to invite the candidates</Text>
                    <CopyToClipboard text={opportunity.urlMatchFast} onCopy={() => manageSuccess('urlCopy', 'The link has been successfully copied.')}>
                        <div className='opportunity-invite-link'>
                            <Text size='sm' className='invite-url'>{opportunity.urlMatchFast}</Text>
                            <Text size='sm' bold className='copy-link'>Copy link</Text>
                        </div>
                    </CopyToClipboard>
                </Col>
            </Grid>
            <RecruiterCrazyModal
                show={showModal}
                size='md'
            >
                <div className='test-activated-modal'>
                    <div>
                        <Text bold size='lg'>Your test is active now</Text>
                        <Text size='sm'>Well done {opportunity.user.name}! Now it is time to invite candidates and see how they do it.</Text>
                    </div>
                    <CrazyButton size='mamita' text='Got it' inverse action={onCloseModal} />
                </div>
            </RecruiterCrazyModal>
        </Container>
    );
};