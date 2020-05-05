import React from 'react';

const Features = props => (
  <div className='row feature-container component'>
    {
      props.features.map((feature, i) => (
        <div className={i % 2 === 0 ? 'feature-list flex-reverse col-xs-12 row ' : 'feature-list col-xs-12 row '} key={i}>
          <div className='feature-section col-xs-8 col-md-6'>
            <img src={feature.image} width='100%' alt='' />
          </div>
          <div className='feature-section col-xs-12 col-md-6'>
            <h2 className='feature-title fluttr-header-md'>{feature.title}</h2>
            {feature.body.map((sentence) => <p className='feature-body fluttr-text-md'>{sentence}</p>)}
          </div>
        </div>
      ))
    }
  </div>
);

export default Features;
