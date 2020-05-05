import React from 'react';

import {Link} from 'react-router-dom';

const fluttrLogo = 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/logo_white-min.png';

export default class NotFoundPage extends React.Component {
  render () {
    return (
      <Link to={'/'} style={{display: 'block', height: '100vh', width: '100vw'}}>
        <div className='notFoundPage'>
          <div style={{textAlign: 'center'}}>
            <div className='error'>404</div>
            <br /><br />
            <span className='info'>oooops, Something went wrong!</span>
            <img src={fluttrLogo} alt='Fluttr' width='400' className='image' />
          </div>
        </div>
      </Link>
    );
  }
}
