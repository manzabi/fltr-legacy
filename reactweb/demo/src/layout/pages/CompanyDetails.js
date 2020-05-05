'use strict';

import React, { Component } from 'react';
import { Header, Text } from '../FluttrFonts';
import CrazyField from '../fields/CrazyFields';
import Grid from '../layout/Grid';
import Col from '../layout/Col';
import Container from '../layout/Container';
import CrazyIcon from '../icons/CrazyIcon';
import CrazyButton from '../buttons/CrazyButtons';
import { checkUserUpdate } from '../../redux/actions/userActions';
import { goToRecruiterLandingPage } from '../../fltr/navigation/NavigationManager';
import { createCompany } from '../../redux/actions/recruiterOpportunityActions';
import { connect } from 'react-redux';
import * as ga from '../../constants/analytics';
import * as companyConstants from '../../constants/companyDetails';
import ReactGA from 'react-ga';
import Offset from '../layout/Offset';

@connect((state) => state)
export default class CompanyDetails extends Component {

    componentDidMount() {
        ga.track(ga.COMPANY_DETAILS_LANDING);
    }

    sendInfo = (form) => {
        this.props.dispatch(createCompany(form, this.onCreateOk, this.onError));
    }

    onCreateOk = () => {
        // ga.track(ga.BOARDING_COMPANY_CREATION_END);
        const trackingRoute = '/recruiter/company/create/success';
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        this.props.dispatch(checkUserUpdate(this.props.userStatus, true, goToRecruiterLandingPage));
    }

    onError = () => {
        // ga.track(ga.BOARDING_COMPANY_CREATION_ERROR);
        const trackingRoute = '/recruiter/company/create/error';
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        goToRecruiterLandingPage();
    }

    render() {
        return (<Container className='crazy-company-details'>
            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' />
            <Grid>
                <Offset mdOffset='3' smOffset='2'/>
                <Col md='6' sm='8'>
                    <Header size='lg'>Let's personalize your experience</Header>
                    <Text size='small'>We’ll use this to recommend test templates and best practices to you</Text>
                    <CompanyDetailsForm sendInfo={this.sendInfo} />
                </Col>
            </Grid>
        </Container>);
    }
}

class CompanyDetailsForm extends Component {
    state = {
        CompanyName: '',
        question1: null,
        question2: null,
        loading: false
    }

    onFieldChange = (fieldId, value) => {
        const id = fieldId.replace(/\s/g, '');
        this.setState({ [id]: value });
    }

    onSelectBox = (question, answer) => {
        this.setState({ ['question' + question]: companyConstants[answer] });
    }

    submitForm = () => {
        const { CompanyName, question1, question2 } = this.state;

        this.setState({ loading: true }, () => {
            const form = {
                name: CompanyName,
                positionsQuestion: question1,
                candidatesQuestion: question2
            };
            this.props.sendInfo(form);
        });
    }

    render() {
        const { CompanyName, question1, question2, loading } = this.state;

        const disabled = !(CompanyName.length && question1 && question2);

        return (<div className='crazy-company-details-form'>
            <div className='crazy-company-details-item'>
                {!CompanyName.length ? <Text size='small' className='question-number'>1</Text> : <CrazyIcon icon='icon-check-small' />}
                <Text size='small' className='company-question'>What is the company name?</Text>
                <CrazyField onFieldChange={this.onFieldChange} text={CompanyName} label='Company Name' placeholder='Company name' focus />
            </div>
            <div className='crazy-company-details-item' style={{ marginTop: 20 }}>
                {!question1 ? <Text size='small' className='question-number'>2</Text> : <CrazyIcon icon='icon-check-small' />}
                <Text size='small' className='company-question'>How many hiring positions does the company have in a year?</Text>
                <div className='options-wrapper'>
                    <div className={`option-box${question1 === companyConstants['FROM_0_TO_10'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(1, 'FROM_0_TO_10'); }} ><Text size='small' >1-10</Text></div>
                    <div className={`option-box${question1 === companyConstants['FROM_10_TO_30'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(1, 'FROM_10_TO_30'); }}><Text size='small'>11-30</Text></div>
                    <div className={`option-box${question1 === companyConstants['MORE_30'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(1, 'MORE_30'); }}><Text size='small'>More than 30</Text></div>
                </div>
            </div>
            <div className='crazy-company-details-item'>
                {!question2 ? <Text size='small' className='question-number'>3</Text> : <CrazyIcon icon='icon-check-small' />}
                <Text size='small' className='company-question'>How many candidates per job offer do you have on average?</Text>
                <div className='options-wrapper'>
                    <div className={`option-box${question2 === companyConstants['FROM_0_TO_20'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(2, 'FROM_0_TO_20'); }}><Text size='small'>0-20</Text></div>
                    <div className={`option-box${question2 === companyConstants['FROM_20_TO_50'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(2, 'FROM_20_TO_50'); }}><Text size='small'>21-50</Text></div>
                    <div className={`option-box${question2 === companyConstants['MORE_50'] ? ' selected' : ''}`} onClick={() => { this.onSelectBox(2, 'MORE_50'); }}><Text size='small'>More than 50</Text></div>
                </div>
            </div>
            <CrazyButton size='large' text='Finish' loading={loading} action={this.submitForm} disabled={disabled}/>
        </div>);
    }
}