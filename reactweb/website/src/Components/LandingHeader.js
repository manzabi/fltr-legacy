import React from 'react';
import {getRecruiterAccess} from '../Utils/NavigationManager';

const fluttrLogo = 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/logo_white-min.png';

const Header = props => (
  <div className={!props.shouldCollapse ? 'header header-collapsed' : 'header'}>
    <div className='row header-container'>
      <div className='menu-container container'>
        <div className='brand-container col-xs-12 col-sm-6 col-md-7'>
          <img src={fluttrLogo} alt='Fluttr logo' className='brand-image' height='50' />
        </div>
        <div className='col-xs-12 col-sm-6 col-md-5'>
          <a className='unstyled-link' href={getRecruiterAccess()} target='_top'>
            <button type='button' className='btn btn-green btn-center' id='BUTTON_FREEMIUM_FLOATING' style={{marginTop: 5, marginBottom: 5}} onClick={props.goToSignup}>
              Get started free
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Header;
