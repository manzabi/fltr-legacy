import React, {Component} from 'react';
import {connect} from 'react-redux';
import { getChallengeAvailableSlots } from '../../../utils/planUtils';
import { goToUpgrade } from '../../../navigation/NavigationManager';


@connect((state) => state)
export default class OpportunityTemplatePreviewUnlockBar extends Component {

    constructor (props) {
        super(props);
        // TODO: IT'S THERE ANY PROBLEM WITH THE EXPERTS?
        const {user} = this.props;
        const availablePlans = getChallengeAvailableSlots(user.item);
        const templateSlots = availablePlans.slotTemplates;
        this.state = {
            templateSlots
        };
    }

    upgrade = (event) => {
        event.preventDefault();
        goToUpgrade();
    }

    render () {
        const freemium = this.state.templateSlots >= 0;
        if (this.state.templateSlots !== 0 || !this.props.locked) {
            if (freemium) {
                return (
                    <section className={`bottom-unlock-bar ${this.props.locked ? 'locked' : ''}`}>
                        { freemium && this.props.locked &&
                            <section className='upsell-section'>
                                <div className='slot-counter'>
                                    <span className={this.state.templateSlots <= 2 ? 'used' : ''}>1</span>
                                    <span className={this.state.templateSlots <= 1 ? 'used' : ''}>2</span>
                                    <span className={this.state.templateSlots <= 0 ? 'used' : ''}>3</span>
                                </div>
                                <p>
                                    {`You can still unlock ${this.state.templateSlots} free template${this.state.templateSlots > 1 ? 's' : ''}.`}
                                </p>
                                <p>
                                    <a onClick={this.upgrade} >Upgrade</a> to get unlimited access.
                                </p>
                            </section>
                        }
                        <section className='template-actions-section'>
                            { this.props.locked &&
                                [
                                    <p style={{fontSize: 18}}>
                                        Click “Unlock” to read the whole template.
                                    </p>,
                                    <button loading={this.props.loading} onClick={this.props.handleUnlockTemplate} className='btn-fluttr btn-green'>Unlock</button>
                                ] ||
                                [
                                    <button loading={this.props.loading} onClick={this.props.applyTemplate} className='btn-fluttr btn-green'>Use this template</button>,
                                    <p>
                                        You can customize this template before it goes live.
                                    </p>
                                ]
                            }
                        </section>
                    </section>
                );
            } else {
                return (
                    <section className='bottom-unlock-bar'>
                        <section className='upsell-section'>
                            <button onClick={this.props.handleReinicialize} className='btn-fluttr btn-link'><i className='fal fa-angle-double-left' />&nbsp;Go back</button>
                        </section>
                        <section className='template-actions-section'>
                            <button onClick={this.props.applyTemplate} className='btn-fluttr btn-green'>Use this template</button>
                            <p>
                                You can customize this template before it goes live.
                            </p>
                        </section>
                    </section>
                );
            }
        } else {
            return (
                <section className='bottom-unlock-bar locked upgrade'>
                    <i className='fas fa-lock-alt' />
                    <p>
                        You’ve reached the end of your free templates.<br />
                        Upgrade now for unlimited access.
                    </p>
                    <div className='upgrade-actions'>
                        <button onClick={this.props.handleReinicialize} className='btn-fluttr btn-link'><i className='fal fa-angle-double-left' />&nbsp;Go back</button>
                        <button onClick={this.upgrade} className='btn-fluttr btn-green'>
                            Upgrade
                        </button>
                    </div>
                </section>
            );
        }
    }
}