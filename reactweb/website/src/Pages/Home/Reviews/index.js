import React, {Component} from 'react';

import ReviewCardClosed from './ReviewCardClosed';

class ReviewsContainer extends Component {
  constructor () {
    super();
    this.state = {
      reviews: [
        {
          image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/testimonials/leticia-min.png',
          name: 'Leticia Castro Carrión',
          position: 'HR Manager',
          company: 'Badi',
          body: `“Fluttr has made our recruitment processes way easier thanks to the automatized challenges we can use to shortlist the applications, a real time saver!`.split('/n'),
          title: '“Fluttr made our recruitment processes way easier.”',
          open: false
        },
        {
          image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/testimonials/Profile_Barbara_YUGO-min.jpg',
          name: 'Barbara Malet',
          position: 'Brand Manager',
          company: 'YUGO',
          body: `“I discovered Fluttr through some people I knew that had already used it. I decided to give it a shot, and I saw that it made the hiring process a lot simpler, above all because I was looking for a profile with practical skills for which it made no sense to read a bunch amount of CVs.”`.split('/n'),
          title: '“Fluttr helped me select and discard candidates for their skills, not their CVs.“',
          open: false
        },
        {
          image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/testimonials/Profile_Sergi_Benet_Meller-min.jpg',
          name: 'Sergi Benet',
          position: 'CEO',
          company: 'Meller',
          body: `“Fluttr helps understanding how candidates react when faced with a real challenge on the job, rather then simply evaluating their CVs. This allows us to see candidates' true interest and skills required for your business”`.split('/n'),
          title: '“Since we began using Fluttr, no hiring has been conducted without it.”',
          open: false
        }
      ]
    };
    this.toggleStatus = this.toggleStatus.bind(this);
  }
  toggleStatus (e) {
    e.preventDefault();
    const id = parseInt(e.target.id, 10);
    const newStatus = !this.state.reviews[id].open;
    this.setState(prevstate => {
      prevstate.reviews.map(review => {
        review.open = false;
        return review;
      });
      prevstate.reviews[id].open = newStatus;
      return prevstate;
    });
  }
  render () {
    return (
      <div className='reviews-container component'>
        <div className='reviews-component'>
          <div>
            <h2 className='section-title fluttr-header-md'>What our clients say about us</h2>
          </div>
          <div className='review-content col-xs-12'>
            <div className='row nopading'>
              {
                this.state.reviews.map((review, i) => (
                  <ReviewCardClosed i={i} review={review} toggleStatus={this.toggleStatus} open={review.open} key={i} />
                ))
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewsContainer;
