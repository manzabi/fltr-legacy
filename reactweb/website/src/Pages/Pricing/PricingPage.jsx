import React, { Component } from 'react';

import {
    Container,
    Grid,
    Col,
    Text,
    Header as Title,
    CrazyButton
} from '@billingfluttr/crazy-ui';

import WebsiteCrazyModal from '../../Components/WebsiteCrazyModal';
import ReactGA from 'react-ga';

import { getPricing } from '../../constants/plans';

import { withRouter } from 'react-router-dom';

import * as ga from '../../Utils/analytics';

import Intercom from '../../Components/Intercom';
import { GRO } from '../../constants/planType';
import { goToContacSales, redirectTo, userSignup } from '../../Utils/NavigationManager';
import Header from '../../Components/Header';
import PricingFAQComponent from './PricingFAQComponent';
import { validateQueryValue } from '../../Utils/urlUtils';

class PricingPage extends Component {
    constructor(props) {
        super(props);
        let campaign = 'a';
        const { abId } = props.match.params;
        const isContactSuccess = validateQueryValue('contact', 'success');
        if (isContactSuccess) {
            const trackingRoute = '/pricing/contact/success';
            ReactGA.set({ page: trackingRoute });
            ReactGA.pageview(trackingRoute);
        }
        if (abId !== 'a') {
            switch (abId) {
                case 'al': {
                    campaign = 'A';
                    break;
                }
                case 'be': {
                    campaign = 'b';
                    break;
                }
                default:
                    break;
            }
            localStorage.setItem('abId', `TARGET_${campaign.toUpperCase()}`);
        }
        this.state = {
            ...getPricing(campaign),
            showingPricing: 'yearly',
            contactModalStatus: isContactSuccess,
            feturedPlan: abId ? GRO : null
        };
    }

    handleGetStarted = () => {
        const id = 'recruiter';
        const trackingId = ga.SPLIT_SIGNUP_SELECT(id);
        ga.track(trackingId);
        redirectTo(userSignup(id));
    }

    handleSelectPlan = (plan) => {
        const trackingRoute = `/plan/${plan.name.toLowerCase()}/${plan.externalId}`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        switch (plan.actionType) {
            case 'getStarted': {
                this.handleGetStarted();
                break;
            }
            case 'recurly': {
                break;
            }
            case 'hubspot': {
                goToContacSales(plan.name.toLowerCase());
                break;
            }
            case 'intercom':
                window.Intercom('showNewMessage', '');
                break;
            default:
                break;
        }
    }

    handleSelectPricing = (type) => {
        this.setState({
            showingPricing: type
        });
    }

    handleCloseContactModal = () => {
        this.setState({
            contactModalStatus: false
        });
    }

    render() {
        return (
            <div className='upgrade-page-container'>
                <Header />
                <Container>
                    <Grid className='plans-container'>
                        <Title>Find a plan</Title>
                        <Text>Start testing your candidates for free, and pay as you grow</Text>
                        <section className='billing-switch-container'>
                            <p className='fluttr-blue'>Pay yearly and get discounts!</p>
                            <img
                                src="https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/arrow-small-blue.svg"
                            />
                            <div className='switch-container'>
                                <span className={this.state.showingPricing === 'yearly' ? 'active' : ''} onClick={() => this.handleSelectPricing('yearly')}>YEARLY</span>
                                <span className={this.state.showingPricing === 'monthly' ? 'active' : ''} onClick={() => this.handleSelectPricing('monthly')}>MONTHLY</span>
                            </div>
                        </section>
                        {this.state[this.state.showingPricing].map((plan) => (
                            <Col
                                xs='12'
                                sm='6'
                                md='3'
                                className={`pricing-card ${plan.id === this.state.feturedPlan ? 'featured-plan' : ''} plan-${plan.planStyle}`}
                            >
                                {plan.badge !== undefined &&
                                    <div className='badge-container'>
                                        <span>{plan.badge.message}</span>
                                    </div>
                                }
                                {plan.showPricing && plan.prize !== '0' && this.state.showingPricing === 'yearly' &&
                                    <p className='billing-save fluttrBlue'>{`Save € ${plan.save}`}</p>
                                }
                                <Title size='sm'>{plan.name}</Title>
                                <Text className='plan-description' size='sm'>{plan.description}</Text>
                                <ul>
                                    <li>{plan.features.candidates} candidates</li>
                                    <li>{plan.features.concurrentChallenges} active test{plan.features.concurrentChallenges > 1 && 's'} at a time</li>
                                    <li>{plan.features.users} members</li>
                                    <li>{plan.features.templates === 'Infinity' ? 'Unlimited' : plan.features.templates} {plan.features.templateType} templates</li>
                                    {plan.features.ATSIntegration && <li>Integration with your ATS*</li>}
                                </ul>
                                <div className='bottom-container'>
                                    <div className='pricing-container'>
                                        {plan.showPricing &&
                                            <Title className='plan-prize' size='md'>
                                                <span className='price-currency'>€</span>
                                                {plan.prize.toLocaleString()}
                                                <span className='price-period'> / mo</span>
                                            </Title>
                                        }
                                        {plan.showPricing && plan.prize !== 0 && this.state.showingPricing === 'yearly' &&
                                            <p className='billing-period'>{`Billed ${this.state.showingPricing}`}</p>
                                        }
                                    </div>
                                    <CrazyButton
                                        inverse={plan.styleInverse}
                                        color={plan.planStyle}
                                        action={() => this.handleSelectPlan(plan)}
                                        text={plan.buttonLabel}
                                        size='large'
                                    />
                                </div>
                            </Col>
                        ))}
                    </Grid>
                    <section className='upsell-enterprise-section'>
                        <p>For organizations that need additional features, control and support we offer <strong>Enterprise plan</strong>.</p>
                        <CrazyButton size='large' inverse text='Contact sales' action={() => goToContacSales('enterprise')} />
                    </section>
                    <PricingFAQComponent />
                    <section className='pricing-bottom-upsell'>
                        <Title size='md'>Start testing your candidates for free</Title>
                        <CrazyButton action={this.handleGetStarted} size='large' text="Get started free" />
                    </section>
                </Container>
                <WebsiteCrazyModal
                    show={this.state.contactModalStatus}
                    onCloseButton={this.handleCloseContactModal}
                    backdrop
                    size='md'
                >
                    <ContactModalContent />
                </WebsiteCrazyModal>
                <Intercom />
            </div>
        );
    }
}

export default withRouter(PricingPage);

const ContactModalContent = () => (
    <div style={{ textAlign: 'center' }}>
        <div className="swal-icon swal-icon--success">
            <span className="swal-icon--success__line swal-icon--success__line--long"></span>
            <span className="swal-icon--success__line swal-icon--success__line--tip"></span>
            <div className="swal-icon--success__ring"></div>
            <div className="swal-icon--success__hide-corners"></div>
        </div>
        <Title size='big'>
            Your contact info was sent!
        </Title>
        <Text size='md'>
            Thanks for contacting us! We will be in touch with you shortly.
        </Text>
    </div>
);