import React, {Component} from 'react';
import {connect} from 'react-redux';

import { goToRecruiterOpportunityCreateConfiguration, goToRecruiterCompanyCreate } from '../../../fltr/navigation/NavigationManager';

@connect((state) => state)
export default class RecruiterOpportunityVisibilityPage extends Component {
    constructor () {
        super();
        this.state = {
            selectedChoise: null,
            hoverElement: null
        };
    }

    componentWillMount () {
        const user = this.props.user.item;
        const hasCompany = !!user.recruiterDetails && user.recruiterDetails.company !== null;
        if (!hasCompany) {
            goToRecruiterCompanyCreate();
        }
    }

    handleSelectChoise = (choise) => {
        this.setState({
            selectedChoise: choise
        },this.handleApplyChoise);
    }

    handleClearChoise = () => {
        this.setState({
            selectedChoise: null
        });
    }
    
    componentWillReceiveProps (nextProps) {
        if (nextProps.opportunityVisibility !== null) {
            goToRecruiterOpportunityCreateConfiguration();
        }
    }
    
    handleOnMouseEnter = (id) => {
        this.setState({
            hoverElement: id
        });
    }

    handleOnMouseLeave = () => {
        this.setState({
            hoverElement: null
        });
    }

    render () {
        return (
            <section className='fluttr-split-page opportunity-visibility-page containerMaxSize'>
                <h2>What would you like to do?</h2>
                { this.state.selectedChoise === null &&
                    <section className='fluttr-split-page-actions-container'>
                        <div className='fluttr-split-page-action' onMouseEnter={() => this.handleOnMouseEnter('public')} onMouseLeave={this.handleOnMouseLeave} onClick={() => this.handleSelectChoise('public')}>
                            <div className='action-body'>
                                <h3 className='fluttr-header-sm'>Create a job</h3>
                                <p>
                                    Share your job post on job boards to collect your applicants on Fluttr. Add a challenge once you are done!
                                </p>
                            </div>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/job.png' width='100%'/>
                        </div>
                        <div className='fluttr-split-page-action' onMouseEnter={() => this.handleOnMouseEnter('private')} onMouseLeave={this.handleOnMouseLeave} onClick={() => this.handleSelectChoise('private')}>
                            <div className='action-body'>
                                <h3 className='fluttr-header-sm'>Create a challenge</h3>
                                <p>
                                    After you create the challenge we will give you a special link. Send it to your candidates to have them participating.
                                </p>
                            </div>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/challenge.png' width='100%'/>
                        </div>
                        <div className='details-section'>
                            <div className='card-detail'>
                                <h3 className='fluttr-text-md'>
                                            Use this option if you need help finding candidates and assessing them.
                                </h3>
                                <ul>
                                    <li>
                                                What you can do:
                                    </li>
                                    <li>
                                                Create a job description
                                    </li>
                                    <li>
                                                Add skills
                                    </li>
                                    <li>
                                                Publish your job post on job boards*
                                    </li>
                                    <li>
                                                Share your job post on social media
                                    </li>
                                    <li>
                                                Add a challenge (optional)
                                    </li>
                                    <li>
                                                Set automated or manual invitations
                                    </li>
                                    <li>
                                                Find all candidates’ data  in Fluttr
                                    </li>
                                    <li className='explanation-field'>
                                                * Glassdoor, Indeed, Google Jobs, Fluttr
                                    </li>
                                </ul>
                            </div>
                            <div className='card-detail'>
                                <h3 className='fluttr-text-md'>
                                            Use this option if you already have candidates which you want to assess.
                                </h3>
                                <ul>
                                    <li>
                                                What you can do:
                                    </li>
                                    <li>
                                                Share with us the job details
                                    </li>
                                    <li>
                                                Add the required skills
                                    </li>
                                    <li>
                                                Add your own challenge...
                                    </li>
                                    <li>
                                                ...or select one of our templates
                                    </li>
                                    <li>
                                                Get our special invitation link
                                    </li>
                                    <li>
                                                Share it with  it your candidates
                                    </li>
                                    <li>
                                                Find all candidates’ data in Fluttr
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                }
                { this.state.selectedChoise !== null &&
                    <section className='detail-choise-information'>
                        <p>{`Some detailed information about ${this.state.selectedChoise} choise`}</p>
                        <div className='fluttr-button-bar'>
                            <button className='btn-fluttr btn-link' onClick={this.handleClearChoise}>
                                I want to change my mind
                            </button>
                            <button className='btn-fluttr btn-green' onClick={this.handleApplyChoise}>
                                I want this
                            </button>
                        </div>
                    </section>
                }
            </section>
        );
    }
}