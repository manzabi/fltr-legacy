import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import Grid from '../../../layout/layout/Grid';
import Container from '../../../layout/layout/Container';
import Col from '../../../layout/layout/Col';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import {
    Header as Title,
    Text
} from '../../../layout/FluttrFonts';

import PricingFAQComponent from './PricingFAQComponent';

import { getPricing } from '../../../constants/plans';

import { GRO } from '../../../constants/planType';
import { goToContacSales, goToRecruiterDashboard, scrollFix } from '../../../fltr/navigation/NavigationManager';
import Intercom from '../../../fltr/utils/Intercom';


@connect((state) => state)
export default class RecruiterCompanyUpgradePage extends Component {
    constructor(props) {
        super(props);
        const billingType = this.props.user.item.recruiterDetails.company.target.id;
        const type = billingType.split('_')[1].toLowerCase();
        const pricing = getPricing(type);
        this.state = {
            ...pricing,
            showingPricing: 'yearly',
            abId: type,
            feturedPlan: GRO
        };
    }

    componentDidMount() {
        scrollFix();
        const pricingPages = {
            a: 'al',
            b: 'be'
        };
        const trackingRoute = `/recruiter/company/upgrade/${pricingPages[this.state.abId]}`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
    }

    handleSelectPlan = (plan) => {
        const trackingRoute = `/plan/${plan.name.toLowerCase()}/${plan.externalId}`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        switch (plan.actionType) {
            case 'recurly': {
                const user = this.props.user.item;
                const params = {
                    account_code: user.id,
                    email: user.email,
                    first_name: user.name,
                    last_name: user.surname
                };
                const parsedParams = Object.keys(params).map((param) => `${param}=${params[param]}`).join('&');
                const { externalId } = plan;
                let baseUrl = 'https://fluttrtest.recurly.com/subscribe';
                if (process.env.ENV === 'production') baseUrl = 'https://fluttrin.recurly.com/subscribe';
                const paymentUrl = `${baseUrl}/${externalId}?${parsedParams}`;
                window.location.href = paymentUrl;
                break;
            }
            case 'hubspot': {
                goToContacSales(plan.name.toLowerCase());
                break;
            }
            case 'intercom':
                window.Intercom('showNewMessage', 'HOLA QUE ASE');
                break;
            default:
                break;
        }
    }

    handleSelectEnterprise = () => {
        window.Intercom('showNewMessage', 'I whould like to know more about enterprise plan');
    }

    handleSelectPricing = (type) => {
        this.setState({
            showingPricing: type
        });
    }

    handleDowngradePlan = (plan) => {
        window.Intercom('showNewMessage', `Hi, i would like to downgrade my current plan to ${plan.name}`);
    }

    renderPlanButton = (plan, currentPlan) => {
        if (currentPlan.typeId === plan.id) {
            return (
                <CrazyButton
                    inverse
                    text='Current plan'
                    disabled
                    size='large'
                />
            );
        } else {
            return (
                <CrazyButton
                    inverse={plan.styleInverse}
                    color={plan.planStyle}
                    action={() => this.handleSelectPlan(plan)}
                    text={currentPlan.typeId === plan.id ? 'Current plan' : plan.buttonLabel}
                    disabled={currentPlan.typeId === plan.id}
                    size='large'
                />
            );
        }
    }

    render() {
        const currentPlan = this.props.user.item.recruiterDetails.company.plan;
        return (
            <Container className='upgrade-page-container'>
                <img height='40px' src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' className='pricing-top-logo' onClick={() => goToRecruiterDashboard()} />
                <Grid className='plans-container'>
                    <Title size='md'>Upgrade your plan</Title>
                    <Text>More challenges, more members, more results</Text>
                    <section className='billing-switch-container'>
                        <p className='fluttrBlue'>Pay yearly and get discounts!</p>
                        <img
                            src="https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/arrow-small-blue.svg"
                        />
                        <div className='switch-container'>
                            <span className={this.state.showingPricing === 'yearly' ? 'active' : ''} onClick={() => this.handleSelectPricing('yearly')}>YEARLY</span>
                            <span className={this.state.showingPricing === 'monthly' ? 'active' : ''} onClick={() => this.handleSelectPricing('monthly')}>MONTHLY</span>
                        </div>
                    </section>
                    {this.state[this.state.showingPricing].map((plan, index) => {
                        const isDowngrade = this.state[this.state.showingPricing].reduce((acc, chechingPlan, index) => {
                            if (typeof (acc) === 'boolean') return acc;
                            const currentFound = currentPlan.typeId === chechingPlan.id;
                            const renderingPlanFound = plan.id === chechingPlan.id;
                            if (currentFound) return false;
                            else if (renderingPlanFound) return true;
                        }, { currentFound: false, renderingPlanFound: false });
                        return (
                            <Col
                                xs='12'
                                sm='6'
                                md='3'
                                className={`pricing-card ${plan.id === this.state.feturedPlan ? 'featured-plan' : ''} plan-${plan.planStyle} ${currentPlan.typeId === plan.id ? 'active-plan' : ''} ${isDowngrade && 'inactive-plan'}`}
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
                                    {!isDowngrade &&
                                        this.renderPlanButton(plan, currentPlan) ||
                                        <div style={{ height: 50 }} />
                                    }
                                </div>
                            </Col>
                        );
                    })}
                </Grid>
                <section className='upsell-enterprise-section'>
                    <p>For organizations that need additional features, control and support we offer <strong>Enterprise plan</strong>.</p>
                    <CrazyButton size='large' inverse text='Contact sales' action={() => goToContacSales('enterprise')} />
                </section>
                <PricingFAQComponent />
                <div className='pricing-footer'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' height='35px' />
                </div>
                <Intercom />
            </Container>
        );
    }
}