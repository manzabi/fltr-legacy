import React, { Component } from 'react';
import Scrollspy from 'react-scrollspy';

import Slider from '../../Components/Slider';
import Features from './HowItWorks';
import WhyUs from './WhyUs';
import Testimonials from './Testimonials';
import Awards from '../../Components/Awards';
import Intercom from '../../Components/Intercom';
import hubSpot from '../../Utils/HubSpot';

import * as ga from '../../Utils/analytics';
import {redirectTo, userSignup} from '../../Utils/NavigationManager';

class HowItWorks extends Component {
    state = {
        shouldCollapse: false,
        collapseHeight: 1000
    }
    componentWillMount() {
        const root = this;
        window.onscroll = function (e) {
            const shouldCollapse = window.scrollY < root.state.collapseHeight;
            if (!shouldCollapse && !root.state.shouldCollapse) {
                root.switchInto();
            } else if (shouldCollapse && root.state.shouldCollapse) {
                root.switchStart();
            }
        };
        hubSpot();
    }
    handleScroll = (event) => {
        event.preventDefault();
        const element = document.getElementById(event.target.dataset.id);
        const offset = this.state.shouldCollapse ? 46 : 110;
        const target = (element.offsetTop - offset);
        window.scrollTo(0, target);
    }
    collapseHeightUpdate = (newHeight) => {
        this.setState(prevstate => (prevstate.collapseHeight = newHeight));
    }
    toggleNabMenu = () => {
        this.setState(prevstate => (prevstate.shouldCollapse = !prevstate.shouldCollapse));
    }
    switchInto = () => {
        this.setState(prevstate => (prevstate.shouldCollapse = true));
    }
    switchStart = () => {
        this.setState(prevstate => (prevstate.shouldCollapse = false));
    }

    goToSignup = () => {
        redirectTo(userSignup('recruiter'));
    }
    render() {
        return (
            <div className='how-it-works'>
                <Slider colapseHeightUpdate={this.collapseHeightUpdate} collapseHeight={this.state.collapseHeight} backgroundImage='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/how-it-works/features/header_image_1920x560px-min.png'>
                    <div className='container' id='header'>
                        <h3 className='col-xs-12 col-md-10 col-lg-7 fluttr-header-big' style={{ display: 'block' }}>
                            How it works
                        </h3>
                        <p className='col-xs-12 col-md-10 col-lg-7 how-it-works-quote fluttr-text-big'>
                            We believe that talent has no race, gender or age. Our product is built to reflect this idea.
                        </p>
                    </div>
                </Slider>
                <div className='component'>
                    <div className={'row vertical-align ' + (this.state.shouldCollapse ? 'section-menu-list menu-fixed' : 'section-menu-list')}>
                        <Scrollspy className='col-xs-12 col-sm-offset-2 col-sm-5 fluttr-header-small' items={['challenge-section', 'assess-section', 'rank-section']} currentClassName='is-current' offset={-150}>
                            <li><a href='#challenge-section' data-id='challenge-section' onClick={this.handleScroll}>1. Add Challenge</a></li>
                            <li><a href='#assess-section' data-id='assess-section' onClick={this.handleScroll}>2. Assess</a></li>
                            <li><a href='#rank-section' data-id='rank-section' onClick={this.handleScroll}>3. Rank</a></li>
                        </Scrollspy>
                        <div className='col-xs-12 col-sm-5'>
                            <div className='container'>
                                <a className='unstyled-link link-as-button' target='_top'>
                                    <button type='button' onClick={this.goToSignup} id='one' className={'btn btn-green btn-left' + (this.state.shouldCollapse ? ' btn-md' : '')} >
                                        Get started
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <Features />
                    </div>
                    <div className='component'>
                        <a className='unstyled-link link-as-button' target='_top'>
                            <button type='button' id='two' onClick={this.goToSignup} className='btn btn-green btn-center' >
                                {'Get started'}
                            </button>
                        </a>
                    </div>
                    <div className='section-bg-light-blue'>
                        <div className='container'>
                            <WhyUs />
                        </div>
                    </div>
                    <div className='container'>
                        <div className='container'>
                            <a className='unstyled-link link-as-button' target='_top'>
                                <button type='button' id='three' onClick={this.goToSignup} className='btn btn-green btn-center' >
                                    {'Get started'}
                                </button>
                            </a>
                        </div>
                        <Testimonials />
                    </div>
                    <div className='section-bg-light-blue'>
                        <div className='container'>
                            <div className='row vertical-align component '>
                                <div className='col-xs-11 col-md-6'>
                                    <h3 className='questions fluttr-header-md'>
                                        <i className='fas fa-question-circle' />&nbsp;&nbsp;Questions
                                    </h3>

                                    <p className='body fluttr-text-md'>
                                        Just send us an <a style={{ color: '#333' }} href='mailto:info@fluttr.in'>email</a>!
                                    </p>
                                    <p className='body fluttr-text-md'>
                                        Our support team is here to help you understand the full opportunities that Fluttr offers you.
                                    </p>
                                </div>
                                <div className='col-xs-8 col-md-6'>
                                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/how-it-works/features/question_image_350x300px-min.png' alt='questions' className='hiw-feature-image img img-responsive' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='component'>
                            <a className='unstyled-link link-as-button' target='_top'>
                                <button type='button' id='four' onClick={this.goToSignup} className='btn btn-green btn-center' >
                                    Get started
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <Awards />
                </div>
                <Intercom />
            </div>
        );
    }
}

export default HowItWorks;
