import React from 'react';

import Header from '../Components/Header';

const SignupComplete = () => (
  <div className='signup-complete-page'>
    <Header />
    <h1>Thank you for signing up with Fluttr!</h1>
    <h2>Email correctly sent</h2>
    <p>
      <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/email.png' width='30%' alt='mail logo' /><br />
      Please check your email in order to access your new account!
    </p>
  </div>
);
export default SignupComplete;
