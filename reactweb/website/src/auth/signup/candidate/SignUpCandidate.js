import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { signUpLinkedin, userLogin, getUrl, userSignup, getPrivacyPolicy, getCookies, getTermsAndConditions } from '../../../Utils/NavigationManager';
import { candidateSignup } from '../../../Utils/apiUtils';
import * as formUtils from '../../../Utils/FormUtils';
import * as ga from '../../../Utils/analytics';

import { FREEMIUM_SLOTS } from '../../../constants/global';

class SignUpRecruiter extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      form: {
        email: {
          value: '',
          status: 'empty'
        },
        loading: false
      },
      formValidation: {
        email: {
          type: formUtils.REQUIRED_EMAIL
        }
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onEmailError = this.onEmailError.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    ga.track(ga.SIGNUP_TALENT_LANDING);
  }

  handleChange(e) {
    e.preventDefault();
    const { id, value } = e.target;
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
      prevState.form[id] = { value, status: newState };
      prevState.error = '';
      return prevState;
    });
  }

  onError() {
    this.setState((prevState) => {
      prevState.form.loading = false;
      return prevState;
    });
  }

  onEmailError(err) {
    this.setState((prevState) => {
      prevState.form.email.status = 'error';
      prevState.error = err.response && err.response.data && err.response.data.message || 'Please enter a valid email address';
      prevState.form.loading = false;
      return prevState;
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState((prevState) => {
      prevState.form.loading = true;
      return prevState;
    });
    const valid = formUtils.checkForm(this.state.formValidation, this.state.form);
    const allValid = valid.filter((item) => (item.valid));
    if (allValid.length === valid.length && this.state.form.email.status === 'validated') {
      ga.track(ga.SIGNUP_TALENT_SUCCESS_BUTTON);
      candidateSignup({ email: this.state.form.email.value }, this.props.history, this.onEmailError);
    } else {
      this.onEmailError('err');
    }
  }
  handleLoginLinkedin(e) {
    e.preventDefault();
    ga.track(ga.SIGNUP_TALENT_SUCCESS_LINKEDIN);
    window.location.href = signUpLinkedin('talent');
  }
  render() {
    return (
      <div className='signup-login-form form-container container'>
        <i className='modal-close fas fa-times' onClick={() => window.history.back()} />
        <div className='row row-reverse vertical-align '>
          <div className='col-xs-11 col-sm-8 col-md-5 component'>
            <h1 className='fluttr-header-md'>Sign up with Fluttr</h1>
            <p>Already have an account? <a href={getUrl(userLogin())}> Log In</a></p>
            <div className='social-button-container'>
              <button type='button' className='fluttr-text-md btn btn-center' onClick={this.handleLoginLinkedin}><i className='fab fa-linkedin-in' /><span>Sign up with Linkedin</span></button>
            </div>
            <hr className='hr-text' data-content='OR' />
            <form id='signup-form' onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className={`input-validation-field field-${this.state.form.email.status} fluttr-text-small`}><input type='email' name='email' id='email' placeholder='Email address' value={this.state.form.email.value} /></div>
              <p className='email-form-error'>{this.state.error}</p>
              <button type='submit' disabled={this.state.form.loading} className={`btn btn-green ${this.state.form.loading ? 'loading' : ''}`} style={{ borderRadius: '0' }}>SIGN UP</button>
            </form>
            <p>Creating an account means you're ok with Fluttr's <a href={getPrivacyPolicy()}>Terms of Service</a>, <a href={getCookies()}>Privacy Policy</a> and <a href={getTermsAndConditions()}>Cookie use</a>.</p>
          </div>
          <div className='col-xs-11 col-sm-8 col-md-5'>
            <p className='fluttr-text-md'>
              Are you a recruiter? <a onClick={() => ga.track(ga.SIGNUP_SWITCH_TALENT)} href={getUrl(userSignup('recruiter'))}>Click here</a>
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
                    Unlimited job posts. All your applicants in one place
                  </p>
                </div>
              </div>
              <div>
                <div className='sign-up-features'>
                  <div className='fluttr-text-small sign-up-features row vertical-align' style={{ color: '#8A81E1' }}>
                    <div className='col-xs-2 col-md-4'>
                      <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/signup/feature2.png' alt='feature2' />
                    </div>
                    <p className='col-xs-10 col-md-8'>
                      {FREEMIUM_SLOTS} free challenges / year. Unlimited applicants.
                    </p>
                  </div>
                </div>
              </div>
              <div className='sign-up-features'>
                <div className='fluttr-text-small sign-up-features row vertical-align' style={{ color: '#e67333' }}>
                  <div className='col-xs-2 col-md-4'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/signup/feature3.png' alt='feature3' />
                  </div>
                  <p className='col-xs-10 col-md-8'>
                    Our Machine-Learning-powered Assessment System
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
