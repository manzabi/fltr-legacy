import React, {Component} from 'react';

import {COOKIE_CONSENT, createCookie, getCookie} from '../Utils/cookieUtils';
import {getCookies} from '../Utils/NavigationManager';

class CookieConsent extends Component {
  constructor () {
    super();
    const cookie = getCookie(COOKIE_CONSENT);
    console.log(cookie)
    this.state = {
      visible: cookie
    };
    this.acceptCookies = this.acceptCookies.bind(this);
  }

  acceptCookies () {
    this.setState((prevState) => {
      prevState.visible = false;
      return prevState;
    });
    createCookie(COOKIE_CONSENT, true, 1440);
  }

  render () {
    if (this.state.visible !== null) {
      return null;
    } else {
      return (
        <div className='cookie-consent-component cookieConsent'>
          <p>
            This website uses cookies to ensure you get the best experience on our website &nbsp;
            <a href={getCookies()} style={{color: 'white', textDecoration: 'none'}}>
              More info
            </a>
          </p>
          <button type='button' onClick={this.acceptCookies}>Got it!</button>
        </div>
      );
    }
  }
}

export default CookieConsent;
