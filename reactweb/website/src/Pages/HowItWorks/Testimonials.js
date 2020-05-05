import React, {Component} from 'react';

class Testimonials extends Component {
  constructor () {
    super();
    this.state = {
      testimonials: [
        {
          image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/how-it-works/testimonials/Luciana+profile+image_250x250px-min.png',
          name: 'Luisana Cartay',
          position: 'CMO',
          company: 'PhotoSlurp',
          title: '“Choose the right candidate“',
          body: '"Fluttr is a great channel to communicate with the recruiting team and the candidates."'
        },
        {
          image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/how-it-works/testimonials/lorenzo+profile+image_250x250px-min.png',
          name: 'Lorenzo Ritella',
          position: 'CEO',
          company: 'Propertista',
          title: '“Great job!”',
          body: '"A really engaging and fantastic experience. You guys really have done a great job with Fluttr”'
        }
      ]
    };
  }
  render () {
    return (
      <div className='hiw-testimonials-component'>
        <div className='row feature-container component'>
          {this.state.testimonials.map((testimonial, index) => {
            return (
              <div key={index} className={index % 2 !== 0 ? 'feature-list flex-reverse col-xs-12 row  vertical-align component' : 'feature-list col-xs-12 row  vertical-align'}>
                <div className='col-xs-8 col-md-6'>
                  <img src={testimonial.image} alt={`testimonial image for ${testimonial.name}`} className='hiw-feature-image img-round' />
                </div>
                <div className='col-xs-12 col-md-6'>
                  <h3 className='fluttr-header-md'>{testimonial.title}</h3>
                  <p className='body fluttr-text-md'>{testimonial.body}</p>
                  <p className='testimonial fluttr-text-big'>{`${testimonial.name}, ${testimonial.position} at ${testimonial.company}`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Testimonials;
