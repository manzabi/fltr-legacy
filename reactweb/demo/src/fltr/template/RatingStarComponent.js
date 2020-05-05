import React from 'react';

import StarRatingComponent from 'react-star-rating-component';

const RatingStarComponent = (props) => (
    <StarRatingComponent
        {...props}
        renderStarIcon={(index, value) => {
            return (
                <span>
                    <i className={index <= value ? 'fas fa-star' : 'far fa-star'} />
                </span>
            );
        }}
        renderStarIconHalf={() => {
            return (
                <span>
                    <span style={{ position: 'absolute' }}><i className='far fa-star' style={{ color: 'rgb(255, 180, 0)' }} /></span>
                    <span><i className='fas fa-star-half' style={{ color: 'rgb(255, 180, 0)' }} /></span>
                </span>
            );
        }}
    />
);

export default RatingStarComponent;