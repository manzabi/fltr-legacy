import React, { Component } from 'react';
import { connect } from 'react-redux';

import Col from '../../layout/layout/Col';
import Row from '../../layout/layout/Row';
import Grid from '../../layout/layout/Grid';

import { Text, Header } from '../../layout/FluttrFonts';


import ReactGA from 'react-ga';
import { validateQueryValue } from '../../fltr/utils/urlUtils';


import RecruiterDashboardComponent from '../../fltr/recruiter/dashboard/RecruiterDashboardComponent';
import RecruiterDashboardCreateChallenge from '../../layout/pages/RecruiterDashboardCreateChallenge';
import RecruiterCrazyModal from '../../layout/modal/RecruiterCrazyModal';
import { checkUserUpdate } from '../../redux/actions/userActions';
import {getCategory, RECRUITER_DASHBOARD} from '../../constants/headerConstants';
import {setHeaderTitle} from '../../redux/actions/uiActions';

const Config = require('Config');

@connect(({userStatus}) => ({userStatus}))
export default class RecruiterDashboard extends Component {
    constructor(props) {
        super(props);
        const isContactSuccess = validateQueryValue('contact', 'success');
        if (isContactSuccess) {
            const trackingRoute = '/recruiter/company/upgrade/contact/success';
            ReactGA.set({ page: trackingRoute });
            ReactGA.pageview(trackingRoute);
        }
        const isUpgradeSuccess = validateQueryValue('upgrade', 'success');
        if (isUpgradeSuccess) {
            const trackingRoute = '/recruiter/company/upgrade/success';
            ReactGA.set({ page: trackingRoute });
            ReactGA.pageview(trackingRoute);
        }
        this.state = {
            contactModalStatus: isContactSuccess,
            upgradeModalStatus: isUpgradeSuccess
        };
        
    }
    
    componentDidMount() {
        this.props.dispatch(checkUserUpdate(this.props.userStatus));
        const newHeader = [
            getCategory(RECRUITER_DASHBOARD)
        ];
        this.props.dispatch(setHeaderTitle(newHeader));
    }

    componentWillUnmount() {
        this.props.dispatch(setHeaderTitle());
    }

    handleCloseContactModal = () => {
        this.setState({
            contactModalStatus: false
        });
    }

    handleCloseUpgradeModal = () => {
        this.setState({
            upgradeModalStatus: false
        });
    }

    render() {
        const companyComplete = (this.props.user.item.recruiterDetails.company != null);
        const opportunities = (this.props.user.item.recruiterDetails.countOpportunitiesAsHiringTeam > 0);
        return (
            <section className='dashboard'>
                <div className='recruiterContent'>
                    {companyComplete && opportunities ?
                        <RecruiterDashboardComponent location={this.props.location} /> :
                        <RecruiterDashboardCreateChallenge />
                    }
                </div>
                <RecruiterCrazyModal
                    show={this.state.contactModalStatus}
                    backdrop
                    onCloseButton={this.handleCloseContactModal}
                    size='md'
                >
                    <ContactModalContent />
                </RecruiterCrazyModal>
                <RecruiterCrazyModal
                    show={this.state.upgradeModalStatus}
                    backdrop
                    onCloseButton={this.handleCloseUpgradeModal}
                    size='md'
                >
                    <UpgradeModalContent />
                </RecruiterCrazyModal>
            </section>
        );
    }
}


class ContactModalContent extends Component {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className='swal-icon swal-icon--success'>
                    <span className='swal-icon--success__line swal-icon--success__line--long' />
                    <span className='swal-icon--success__line swal-icon--success__line--tip' />
                    <div className='swal-icon--success__ring' />
                    <div className='swal-icon--success__hide-corners' />
                </div>
                <Header>Your contact info was sent!</Header>
                <Text>Thanks for contacting us. We will contact you as soon as possible</Text>
            </div>
        );
    }
}

class UpgradeModalContent extends Component {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className='swal-icon swal-icon--success'>
                    <span className='swal-icon--success__line swal-icon--success__line--long' />
                    <span className='swal-icon--success__line swal-icon--success__line--tip' />
                    <div className='swal-icon--success__ring' />
                    <div className='swal-icon--success__hide-corners' />
                </div>
                <Header size='lg'>Your upgrade was successful</Header>
                <Text size='md'>Thanks for upgrading your Fluttr plan.</Text>
                <Text size='md'>We already sent you a confirmation email with all details.</Text>
            </div>
        );
    }
}