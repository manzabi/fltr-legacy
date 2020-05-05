import React from 'react';
import {Link} from 'react-router-dom'

import {getCookies, getPrivacyPolicy, getTermsAndConditions, getAbout, getBlog} from '../Utils/NavigationManager';

const Footer = () => (
  <footer className='fluttr-footer component'>
    <div className='footer-container row'>
      <div className='col-xs-12 col-md-3 fluttr-info'>
        <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/Logo_black-min.png' alt='fluttr logo' height='50' />
        <p>Copyright &copy; Fluttr 2018</p>
      </div>
      <div className='col-xs-12 col-md-9 footer-menu'>
        <ul className='list list-unstyled footer-list featured-list col-xs-12 col-md-3'>
          <li>Company</li>
          <li><a href={getAbout()} target='_top'>About us</a></li>
          <li><Link to='/how-it-works'>How it works</Link></li>
          <li><a href={getBlog()} target='_blank'>Blog</a></li>
          <li><a href='mailto:info@fluttr.in'>Contact Us</a></li>
        </ul>
        <ul className='list list-unstyled footer-list featured-list col-xs-12 col-md-3'>
          <li>Social</li>
          <li><a href='https://www.facebook.com/Fluttr-200076627017930' target='_blank'>Facebook</a></li>
          <li><a href='https://twitter.com/fluttrsocial' target='_blank'>Twitter</a></li>
          <li><a href='https://www.linkedin.com/company/15162484' target='_blank'>LinkedIn</a></li>
        </ul>
        <ul className='list list-unstyled footer-list featured-list col-xs-12 col-md-3'>
          <li>Support</li>
          <li><a href={getTermsAndConditions()} target='_top'>Terms of service</a></li>
          <li><a href={getPrivacyPolicy()} target='_top'>Privacy policy</a></li>
          <li><a href={getCookies()} target='_top'>Cookie policy</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
