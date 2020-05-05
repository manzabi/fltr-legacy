import React from 'react';

const CompanyLogo = props => (
  <div className='col-xs-12 component'>
    <h2 className='section-title fluttr-header-md'>Some of our valued clients</h2>
    <div className='row companies vertical-align'>
      {props.companies.map((company, i) => (
        <div className='col-xs-6 col-sm-6 col-md-3' key={i}>
          <img src={company} width='80%' alt='Company logo' />
        </div>
      ))}
    </div>
  </div>
);

export default CompanyLogo;
