import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import * as ga from '../../Utils/analytics';
import * as formUtils from '../../Utils/FormUtils';

import {loginLinkedin, getUrlParam, goToSignupComplete, getPrivacyPolicy, getCookies, getTermsAndConditions} from '../../Utils/NavigationManager';
import {userLogin} from '../../Utils/apiUtils';
import {getError} from '../../Utils/errors';

class LoginRecruiter extends Component {
    constructor () {
        super();
        this.state = {
            modalState: false,
            form: {
                email: {
                    value: '',
                    status: 'empty'
                },
                error: null
            },
            formValidation: {
                email: {
                    type: formUtils.REQUIRED_EMAIL
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.onEmailError = this.onEmailError.bind(this);
    }
    handleChange (e) {
        e.preventDefault();
        const {id, value} = e.target;
        const formCheck = this.state.form;
        formCheck[id].value = value;
        const valid = formUtils.checkSingleFormValue(this.state.formValidation, formCheck, id, false);
        let newState = '';
        if (value === '' || value.trim() === '') {
            newState = 'empty';
        } else if (valid === true) {
            newState = 'validated';
        } else {
            newState = 'error';
        }
        this.setState((prevState) => {
            prevState.form[id] = {value, status: newState};
            prevState.error = '';
            return prevState;
        });
    }

    handleOpenModal (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState(prevState => (prevState.modalState = true));
    }
    handleCloseModal (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState(prevState => (prevState.modalState = false));
    }

    handleSubmit (e) {
        e.preventDefault();
        this.setState((prevState) => {
            prevState.form.loading = true;
            return prevState;
        });
        const form = {email: this.state.form.email.value};
        const valid = formUtils.checkForm(this.state.formValidation, this.state.form);
        const allValid = valid.filter((item) => (item.valid));
        if (allValid.length === valid.length && this.state.form.email.status === 'validated') {
            userLogin(form, this.onSuccess, this.onError);
        } else {
            this.onEmailError('err');
        }
    }

    handleLoginLinkedin (e) {
        e.preventDefault();
        window.location.href = loginLinkedin();
    }
    onSuccess () {
        ga.track(ga.LOGIN_SUCCESS);
        goToSignupComplete(this.props.history);
    }
    onError (err) {
        if (err && err.response.data.message) {
            const response = err.response.data;
            const error = getError(response.code);
            this.setState({
                error: {
                    code: response.code,
                    description: error
                }
            });
        } else {
            const error = getError();
            this.setState({
                error: {
                    code: null,
                    description: error
                }
            });
        }
    }

    onEmailError (err) {
        this.setState((prevState) => {
            prevState.form.email.status = 'error';
            prevState.error = err.response && err.response.data && err.response.data.message || 'Please enter a valid email address';
            prevState.form.loading = false;
            return prevState;
        });
    }

    componentDidMount () {
        ga.track(ga.LOGIN_LANDING);
    }

    render () {
        let errorMessage = '';
        let showErrorMessage = false;
        let error = getUrlParam(this.props.location.search, 'error');
        if (error != null) {
            showErrorMessage = true;
            errorMessage = getError(error);
        }

        return (
            <div className='signup-login-form form-container container'>
                <i className='modal-close fas fa-times' onClick={() => window.history.back()} />
                <div className='row vertical-align '>
                    <div className='col-xs-12 col-md-5 component'>
                        <h1 className='fluttr-header-small'>
                            Get started for free.
                        </h1>
                        <div className='row'>
                            <div className='col-xs-12'>
                                <div className='sign-up-features row  component'>
                                    <img style={{width: '80px'}} src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/login/welcome-back.png' alt='welcome back' />
                                </div>
                                <h2 className='fluttr-header-small'>
                                    Welcome back!
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className='col-xs-12 col-md-5 component'>
                        <h1 className='fluttr-header-md'>Sign up with Fluttr</h1>
                        <p>New to Fluttr?<a href='#' onClick={this.handleOpenModal}> Sign Up</a></p>
                        <div className='social-button-container'>
                            <button type='button' className='fluttr-text-md btn btn-center' onClick={this.handleLoginLinkedin}><i className='fab fa-linkedin-in' /><span>Login with Linkedin</span></button>
                        </div>
                        <hr className='hr-text' data-content='OR' />
                        <form id='signup-form' onChange={this.handleChange} onSubmit={this.handleSubmit}>
                            <div className={`input-validation-field field-${this.state.form.email.status} fluttr-text-small`}><input type='email' name='email' id='email' placeholder='Email address' value={this.state.form.email.value} /></div>
                            {showErrorMessage &&
                            <p style={{color: 'red'}}>{errorMessage}</p>
                            }
                            { this.state.error &&
                            <p className='email-form-error'>{this.state.error.description}</p>
                            }
                            <button type='submit' className='btn btn-green' style={{borderRadius: '0'}}>LOGIN</button>
                        </form>
                        <div>
                            <p>Creating an account means you're ok with Fluttr's <a href={getPrivacyPolicy()}>Terms of Service</a>, <a href={getCookies()}>Privacy Policy</a> and <a href={getTermsAndConditions()}>Cookie use</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginRecruiter);
