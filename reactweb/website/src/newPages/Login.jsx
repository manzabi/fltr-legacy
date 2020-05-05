'use strict';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Col, Container, CrazySwitcherTransparent, CrazyButton, CrazyField, Text, Header } from '@billingfluttr/crazy-ui';
import * as ga from '../Utils/analytics';
import { goToSignupComplete, loginLinkedin, userSignup } from '../Utils/NavigationManager';
import { userLogin } from '../Utils/apiUtils';
import { getErrorFromApi } from '../Utils/errors';


class LogIn extends Component {
    state = {
        Youremail: '',
        loading: false,
        showMessages: false,
        emailError: ''
    }

    logInCallback = () => {
        const { Youremail } = this.state;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const proceed = !((!emailRegex.test(Youremail) || !Youremail.trim().length));
        this.setState({ loading: true, showMessages: true }, () => {
            if (proceed) {
                const form = {
                    email: Youremail
                };
                userLogin(form, this.onSuccess, this.onError);
            } else {
                //mostrar error?
                this.setState({ loading: false });
            }
        });
    }

    linkedinLogin = () => {
        window.location.href = loginLinkedin();
    }

    onError = (error) => {
        const emailError = getErrorFromApi(error);
        this.setState({ loading: false, emailError, showMessages: true });
    }

    onSuccess = () => {
        ga.track(ga.LOGIN_SUCCESS);
        goToSignupComplete(this.props.history);
    }

    closeCallback = () => {
        this.props.history.push('/');
    }

    componentDidMount() {
        ga.track(ga.LOGIN_LANDING);
    }

    fieldsOnChange = (fieldId, value) => {
        const id = fieldId.replace(/\s/g, '');
        this.setState({ [id]: value, showMessages: false, emailError: '' });
    }

    render() {
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

        return (
            <Container fluid className='crazy-login'>
                <CrazyButton text='Close' color='white' action={this.closeCallback} className='login-close-button' />
                <Grid>
                    <Col sm='4' xs='0' >
                        <CrazyCarousel />
                    </Col>
                    <Col className='crazy-login-form' smOffset='1' sm='4' >
                        <CrazySwitcherTransparent
                            options={[
                                { text: 'SIGN UP', value: 1 },
                                { text: 'LOGIN', value: 2 }
                            ]} active={2}
                            onChange={(index) => { if (index === 1) { this.props.history.push(userSignup('recruiter')); } }}
                        />
                        <Header size='lg'>Welcome back</Header>
                        <Text className='crazy-login-subtitle'>Login to Fluttr entering your email or connecting with Linkedin.</Text>
                        <CrazyField showMessages={this.state.showMessages} onFieldChange={this.fieldsOnChange} text={this.state.Youremail} placeholder='name@work.com' label='Your email' config={emailConfig} enterAction={this.logInCallback} />
                        <CrazyButton text='Login' action={this.logInCallback} loading={this.state.loading} size='large' />
                        <div className='linkedin-wrapper' >
                            <Text size='sm' className='linkedin-question'>Are you registered by LinkedIn? </Text>
                            <Text size='sm' className='linkedin-link' onClick={this.linkedinLogin}> LOGIN WITH LINKEDIN</Text>
                        </div>
                    </Col>
                </Grid>
            </Container>);
    }
}

export default withRouter(LogIn);

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