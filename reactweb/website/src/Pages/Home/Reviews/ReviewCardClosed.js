import React from 'react';

const ReviewCardClosed = props => {
  if (props.open === false) {
    return (
      <div className='review-card-small col-xs-10 col-sm-5 col-md-4' id={props.i} onClick={props.toggleStatus}>
        <img src={props.review.image} alt={props.review.company} className='review-image-small' id={props.i} />
        <div className='review-card-body' id={props.i}>
          <div className='review-body-small fluttr-text-md' id={props.i}>
            <p id={props.i}>{props.review.title}</p>
            <button type='button' className='card-link' id={props.i} onClick={props.toggleStatus}>Read more</button>
          </div>
          <div className='fluttr-text-big review-footer-small'>
            <p id={props.i}>{props.review.name}</p>
            <p id={props.i}>{props.review.position} at <span className='strong'>{props.review.company}</span></p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='review-card-detail col-xs-10 col-sm-5 col-md-4' id={props.i} onClick={props.toggleStatus} style={{backgroundImage: `url(${props.review.image})`}} >
        <div className='white-strong-opacity review-body-detail' id={props.i}>
          <div className='user-review' id={props.i}>
            {props.review.body.map((paragraph, i) => (<p key={i} className='fluttr-text-md' id={props.i}>{paragraph}</p>))}
          </div>
          <div className='review-footer-detail fluttr-text-big' id={props.i}>
            <p id={props.i}>{props.review.name}</p>
            <p id={props.i}>{`${props.review.position} at ${props.review.company}`}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default ReviewCardClosed;
