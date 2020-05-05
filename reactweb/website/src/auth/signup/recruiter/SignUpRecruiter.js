import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as formUtils from '../../../Utils/FormUtils';
import * as ga from '../../../Utils/analytics';

import { signUpLinkedin, getUrl, userLogin, userSignup, getPrivacyPolicy, getCookies, getTermsAndConditions } from '../../../Utils/NavigationManager';
import { recruiterSignup, checkRecruiterEmail } from '../../../Utils/apiUtils';

import { CHALLENGE_SLOTS, TALENTS_SLOTS, TEMPLATES_SLOTS } from '../../../constants/global';

class SignUpRecruiter extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                name: {
                    value: '',
                    status: 'empty'
                },
                surname: {
                    value: '',
                    status: 'empty'
                },
                company: {
                    value: '',
                    status: 'empty'
                },
                email: {
                    value: '',
                    status: 'empty'
                },
                loading: false
            },
            formValidation: {
                name: {
                    type: formUtils.REQUIRED_INPUT
                },
                surname: {
                    type: formUtils.REQUIRED_INPUT
                },
                company: {
                    type: formUtils.REQUIRED_INPUT
                }
            },
            error: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEmailError = this.onEmailError.bind(this);
        this.onEmailOk = this.onEmailOk.bind(this);
    }

    componentDidMount() {
        ga.track(ga.SIGNUP_RECRUITER_LANDING);
    }

    handleChange(event) {
        event.preventDefault();
        const { id, value } = event.target;
        if (id === 'email') {
            const root = this;
            if (window.deferedCheck) window.clearTimeout(window.deferedCheck);
            window.deferedCheck = setTimeout(function () { checkRecruiterEmail(value, root.onEmailOk, root.onEmailError); }, 1500);
            this.setState((prevState) => {
                prevState.error = '';
                prevState.form.email.value = value;
                prevState.form.email.status = 'loading';
                return prevState;
            });
        } else {
            const valid = formUtils.checkSingleFormValue(this.state.formValidation, this.state.form, id, false);
            let newState = '';
            if (value === '' || value.trim() === '') {
                newState = 'empty';
            } else if (valid === true) {
                newState = 'validated';
            } else {
                newState = 'error';
            }
            this.setState((prevState) => {
                prevState.form[id] = { value, status: newState };
                return prevState;
            });
        }
    }

    onEmailOk(response) {
        this.setState((prevState) => {
            prevState.form.email.status = 'validated';
            return prevState;
        });
    }

    onEmailError(err) {
        this.setState((prevState) => {
            prevState.form.email.status = 'error';
            prevState.error = err.response && err.response.data && err.response.data.message || 'Please enter a valid email address';
            return prevState;
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.setState((prevState) => {
            prevState.form.loading = true;
            return prevState;
        });

        const email = this.state.form.email.value;
        await checkRecruiterEmail(email, this.onEmailOk, this.onEmailError);
        const valid = formUtils.checkForm(this.state.formValidation, this.state.form);
        const allValid = valid.filter((item) => (item.valid));
        if (allValid.length === valid.length && this.state.form.email.status === 'validated') {
            const form = {
                name: this.state.form.name.value,
                surname: this.state.form.surname.value,
                company: this.state.form.company.value,
                email: this.state.form.email.value
            };
            ga.track(ga.SIGNUP_RECRUITER_SUCCESS_BUTTON);
            recruiterSignup(form, this.props.history);
        } else {
            this.setState((prevState) => {
                valid.forEach((item) => {
                    const { key } = item;
                    const status = item.valid ? 'validated' : 'error';
                    prevState.form[key].status = status;
                });
                prevState.form.loading = false;
                return prevState;
            });
        }
    }
    handleLoginLinkedin(e) {
        e.preventDefault();
        ga.track(ga.SIGNUP_RECRUITER_SUCCESS_LINKEDIN);
        window.location.href = signUpLinkedin('recruiter');
    }
    render() {
        return (
            <div className='signup-login-form form-container container'>
                <i className='modal-close fas fa-times' onClick={() => window.history.back()} />
                <div className='row row-reverse vertical-align '>
                    <div className='col-xs-11 col-sm-8 col-md-5 component'>
                        <h1 className='fluttr-header-big'>
                            Sign up with Fluttr
                        </h1>
                        <p>Already have an account? <a href={getUrl(userLogin('recruiter'))}>Log In</a></p>
                        <div className='social-button-container'>
                            <button type='button' className='btn btn-center' onClick={this.handleLoginLinkedin}><i className='fab fa-linkedin-in' /><span className='fluttr-text-small'>Sign up with Linkedin</span></button>
                        </div>
                        <hr className='hr-text' data-content='OR' />
                        <form id='signup-form' className='' onChange={this.handleChange} onSubmit={this.handleSubmit}>
                            <div className={`input-validation-field field-${this.state.form.name.status} fluttr-text-small`}><input type='name' autoCapitalize='words' name='name' id='name' placeholder='First Name' value={this.state.form.name.value} /></div>
                            <div className={`input-validation-field field-${this.state.form.surname.status} fluttr-text-small`}><input type='surname' autoCapitalize='words' name='surname' id='surname' placeholder='Last Name' value={this.state.form.surname.value} /></div>
                            <div className={`input-validation-field field-${this.state.form.company.status} fluttr-text-small`}><input type='company' name='company' id='company' placeholder='Company Name' value={this.state.form.company.value} /></div>
                            <div className={`input-validation-field field-${this.state.form.email.status} fluttr-text-small`}><input type='email' name='email' id='email' placeholder='Email address' value={this.state.form.email.value} /></div>
                            <p className='email-form-error'>{this.state.error}</p>
                            <button type='submit' disabled={this.state.form.loading} className={`btn btn-green ${this.state.form.loading ? 'loading' : ''}`} style={{ borderRadius: '0' }}>SIGN UP</button>
                        </form>
                        <div className='fluttr-text-small'>
                            <p>Creating an account means you're ok with Fluttr's <a href={getPrivacyPolicy()}>Terms of Service</a>, <a href={getCookies()}>Privacy Policy</a> and <a href={getTermsAndConditions()}>Cookie use</a>.</p>
                        </div>
                    </div>
                    <div className='col-xs-11 col-sm-8 col-md-5'>
                        <p className='fluttr-text-md'>
                            Are you a job applicant? <a onClick={() => ga.track(ga.SIGNUP_SWITCH_RECRUITER)} href={getUrl(userSignup('talent'))}>Click here</a>
                        </p>
                        <h1 className='fluttr-header-small signup-features-title component'>
                            Get started for free. <br />
                            Our Freemium version includes
                        </h1>
                        <div>
                            <div className='sign-up-features'>
                                <div className='fluttr-text-small sign-up-features row vertical-align' style={{ color: '#3498db' }}>
                                    <div className='col-xs-2 col-md-4'>
                                        <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/signup/feature1.png' alt='feature1' />
                                    </div>
                                    <p className='col-xs-10 col-md-8'>
                                        Invite up to {TALENTS_SLOTS} candidates, free
                                    </p>
                                </div>
                            </div>
                            <div className='sign-up-features'>
                                <div className='fluttr-text-small sign-up-features row vertical-align' style={{ color: '#e67333' }}>
                                    <div className='col-xs-2 col-md-4'>
                                        <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/signup/feature3.png' alt='feature3' />
                                    </div>
                                    <p className='col-xs-10 col-md-8'>
                                        {TEMPLATES_SLOTS} free challenge templates to view
                                    </p>
                                </div>
                            </div>
                            <div className='sign-up-features'>
                                <div className='fluttr-text-small sign-up-features row vertical-align' style={{ color: '#8A81E1' }}>
                                    <div className='col-xs-2 col-md-4'>
                                        <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/signup/feature2.png' alt='feature2' />
                                    </div>
                                    <p className='col-xs-10 col-md-8'>
                                        {CHALLENGE_SLOTS} live challenge at the time only
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SignUpRecruiter);
