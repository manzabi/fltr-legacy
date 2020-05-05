import React from 'react';

const Awards = props => (
  <div className='component'>
    <h2 className='section-title fluttr-header-md'>Who backs us</h2>
    <div className='row vertical-align'>
        {props.awards.map((award, item) => (
          <img src={award} alt='award' key={item} className='col-xs-5 col-sm-4 col-md-3' />
        ))}
    </div>
  </div>
);

export default Awards;
