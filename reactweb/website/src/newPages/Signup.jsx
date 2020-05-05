'use strict';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Col, Container, CrazySwitcherTransparent, CrazyButton, CrazyField, Header, Text } from '@billingfluttr/crazy-ui';
import * as ga from '../Utils/analytics';
import { recruiterSignup, isWorkEmail } from '../Utils/apiUtils';
import { getTermsAndConditions, userLogin, getCookies, getPrivacyPolicy } from '../Utils/NavigationManager';
import { getError } from '../Utils/errors';
import WebsiteCrazyModal from '../Components/WebsiteCrazyModal';

class SignUp extends Component {
    state = {
        showNotCompanyModal: false,
        showExistingCompanyModal: false,
        loading: false,
        YourName: '',
        YourLastName: '',
        Workemailaddress: '',
        proceedWithPersonal: false,
        showMessages: false,
        emailError: ''
    }

    signUpCallback = () => {
        const { YourName, YourLastName, Workemailaddress, proceedWithPersonal } = this.state;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const proceed = !(!YourName.trim().length || !YourLastName.trim().length || (!emailRegex.test(Workemailaddress) || !Workemailaddress.trim().length));
        this.setState({ loading: true, showMessages: true }, async () => {
            if (proceed) {
                const isItWorkEmail = await isWorkEmail(Workemailaddress, this.onError);
                //still wont be implemented v
                if (!isItWorkEmail && this.state.emailError) return;
                const existingCompany = false;
                if (!isItWorkEmail && !proceedWithPersonal) {
                    ga.trackRoute('/recruiter/signup/personal');
                    this.setState({ showNotCompanyModal: true, loading: false });
                } else if (existingCompany && !proceedWithPersonal) {
                    this.setState({ showExistingCompanyModal: true, loading: false });
                } else {
                    const form = {
                        name: YourName,
                        surname: YourLastName,
                        email: Workemailaddress
                    };
                    const target = localStorage.getItem('abId');
                    if (target) { form.target = target; }
                    recruiterSignup(form, this.props.history, this.onError);
                }
            } else {
                this.setState({ loading: false });
            }
        });
    }

    onError = (error) => {
        const { code } = error.response.data;
        ga.trackRoute('/recruiter/signup/error');
        const emailError = getError(code);
        this.setState({ loading: false, showNotCompanyModal: false, emailError, proceedWithPersonal: false });
    }

    closeCallback = () => {
        this.props.history.push('/');
    }

    componentDidMount() {
        ga.track(ga.SIGNUP_RECRUITER_LANDING);
    }

    fieldsOnChange = (fieldId, value) => {
        const id = fieldId.replace(/\s/g, '');
        this.setState({ [id]: value });
    }

    render() {
        const firstNameConfig = {
            error: {
                condition: (text) => {
                    return !text.trim().length;
                },
                message: 'First name is required'
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };
        const lastNameConfig = {
            error: {
                condition: (text) => {
                    return !text.trim().length;
                },
                message: 'Last name is required'
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };

        const emailConfig = {
            error: {
                condition: (text) => {
                    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    return !emailRegex.test(text) || !text.trim().length || this.state.emailError.length;
                },
                message: this.state.emailError || 'Oops, that email address is invalid'
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };

        const { showNotCompanyModal, showExistingCompanyModal, loading, Workemailaddress, YourName, YourLastName, showMessages } = this.state;

        return (<Container fluid className='crazy-signup'>
            <CrazyButton text='Close' color='white' action={this.closeCallback} className='signup-close-button' />
            <Grid>
                <Col sm='4' xs='0' >
                    <CrazyCarousel />
                </Col>
                <Col className='crazy-signup-form' lg='4' smOffset='1' md='5' sm='6' >
                    <CrazySwitcherTransparent
                        options={[
                            { text: 'SIGN UP', value: 1 },
                            { text: 'LOGIN', value: 2 }
                        ]}
                        active={1}
                        onChange={(index) => { if (index === 2) { this.props.history.push(userLogin()); } }}
                    />
                    <Header size='lg' className='signup-header'><span>Want to start testing your candidates?</span> <span>Sign up for free</span></Header>
                    <CrazyField showMessages={showMessages} text={YourName} onFieldChange={this.fieldsOnChange} placeholder='First name' label='Your Name' config={firstNameConfig} enterAction={this.signUpCallback} focus />
                    <CrazyField showMessages={showMessages} text={YourLastName} onFieldChange={this.fieldsOnChange} placeholder='Last name' label='Your Last Name' config={lastNameConfig} enterAction={this.signUpCallback} />
                    <CrazyField showMessages={showMessages} text={Workemailaddress} onFieldChange={this.fieldsOnChange} placeholder='name@work.com' label='Work email address' config={emailConfig} enterAction={this.signUpCallback} />
                    <p className='crazy-signup-conditions'>
                        By clicking "Sign Up" I agree to Fluttr's <u><a href={getTermsAndConditions()}>Terms of Service</a></u>, <u><a href={getPrivacyPolicy()}>Privacy Policy</a></u> and <u><a href={getCookies()}>Cookie use.</a></u>
                    </p>
                    <CrazyButton text='Sign Up' action={this.signUpCallback} color='primary' loading={loading} size='large' />
                </Col>
                <WebsiteCrazyModal backdrop size='md' show={showNotCompanyModal} onCloseButton={() => { this.setState({ showNotCompanyModal: false }); }}>
                    <div className='not-your-company-modal'>
                        <Header size='small'>This is not your company email</Header>
                        <Text size='sm'>{Workemailaddress} looks like a personal address. Fluttr works better with teammates. If you want to be connected with your team, please use your work email address.</Text>
                        <CrazyButton size='large-long' text='Enter a work email address' color='primary' action={() => { this.setState({ showNotCompanyModal: false, Workemailaddress: '' }); }} />
                        <Text size='sm' className='crazy-or' >–– or ––</Text>
                        <CrazyButton size='large-long' text='Continue with my email' color='primary' inverse action={() => { this.setState({ proceedWithPersonal: true }, this.signUpCallback); }} loading={loading} />
                    </div>
                </WebsiteCrazyModal>
                {/* <WebsiteCrazyModal size='md' show={showExistingCompanyModal} onCloseButton={() => { this.setState({ showExistingCompanyModal: false }); }}>
                    <div className='existing-company-modal'>
                        <Header size='sm'>You are joining {'spoty.com'} at Fluttr</Header>
                        <Text size='sm'>This company has already signed up. If you are a member of this <br /> company join them and start using Fluttr!</Text>
                        <div style={{ width: 120, height: 62, backgroundColor: 'red' }} />
                        <CrazyButton size='large' text='Join company' color='primary' />
                    </div>
                </WebsiteCrazyModal> */}
            </Grid >
        </Container>);
    }
}

export default withRouter(SignUp);

const imageUrls = [
    { url: `${process.env.FluttrFilesBaseUrl}all/website/images/signup/badi-image.jpg`, text: '“Fluttr makes the recruitment processes way easier thanks to the automatized challenges you can use to shortlist the applications, a real time saver!”', company: 'Leticia Castro, VP of HR', logo: `${process.env.FluttrFilesBaseUrl}cdn/img/badi-logo.png` },
    { url: `${process.env.FluttrFilesBaseUrl}all/website/images/signup/meller-image.jpg`, text: '“Fluttr helps understanding how candidates react when faced with a real challenge on the job, rather then simply evaluating their CVs. This allows us to see candidates\' true interest and skills required for your business”', company: 'Sergi Benet, CEO', logo: `${process.env.FluttrFilesBaseUrl}cdn/img/meller-logo.png` },
    { url: `${process.env.FluttrFilesBaseUrl}all/website/images/signup/yugo-photo.jpg`, text: '“Fluttr helps select and discard candidates for their skills, not their CVs. It makes the hiring process a lot simpler, if looking for a profile with practical skills it makes no sense to read a amount of CVs.”', company: 'Barbara Malet, Brand Manager', logo: `${process.env.FluttrFilesBaseUrl}cdn/img/yugo-logo.png` }
];

const ImageSlide = ({ image: { url, text, company, logo }, index }) => {
    const styles = {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        transition: 'background-image 0.5s linear'
    };

    return (
        <div className='image-slide' style={styles}>
            <div className='dot-bar'>
                <div className={`dot${index === 0 ? ' selected' : ''}`} />
                <div className={`dot${index === 1 ? ' selected' : ''}`} />
                <div className={`dot${index === 2 ? ' selected' : ''}`} />
            </div>
            <div height='40px' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo} />
            </div>
            <Text className='company'>{company}</Text>
            <Text className='quote'>{text}</Text>
        </div>
    );
};

class CrazyCarousel extends Component {

    state = {
        timer: null,
        currentImageIndex: 0
    }

    componentDidMount() {
        let timer = setInterval(this.nextSlide, 8000);
        this.setState({ timer });

        imageUrls.forEach(({ url, logo }) => {
            const img = new Image();
            img.src = url;
            const logoImg = new Image();
            logoImg.src = logo;
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    nextSlide = () => {
        const lastIndex = imageUrls.length - 1;
        const { currentImageIndex } = this.state;
        const shouldResetIndex = currentImageIndex === lastIndex;
        const index = shouldResetIndex ? 0 : currentImageIndex + 1;

        this.setState({
            currentImageIndex: index
        });
    }

    render() {
        const { currentImageIndex } = this.state;
        return (<div className='crazy-carousel' style={{ margin: 0, height: '100%', position: 'fixed', top: 0, width: '33%' }}>
            <ImageSlide image={imageUrls[currentImageIndex]} index={currentImageIndex} />
        </div>);
    }
}