import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param starsNumber PropTypes.number,
 * @param starsValue PropTypes.number.isRequired,
 * @param starsWidth PropTypes.number,
 * @param activeColor PropTypes.string,
 * @param inactiveColor PropTypes.string,
 */

const alignments = {
    right: { marginLeft: 'auto' },
    center: { margin: 'auto' },
    left: { marginRight: 'auto' }
};

const StarsViewComponent = ({ starsNumber, starsValue, starsWidth, activeColor, inactiveColor, align }) => {
    const parsedStarsValue = starsValue > starsNumber ? starsNumber : starsValue;
    const evaluation = (parsedStarsValue * 100) / starsNumber;
    const alignmentValue = alignments[align] !== undefined ? alignments[align] : alignments.left;
    return (
        <div className='fluttr-star-container' style={{ fontSize: starsWidth, ...alignmentValue, height: starsWidth + 15 }}>
            <div className='stars-background' style={{ color: inactiveColor, width: `${(starsWidth + (1.7 + (Math.floor(starsWidth / 10) + 1))) * 5}px`, height: starsWidth }}>
                {
                    Array(starsNumber).fill('☆').map(() => <span><i className='fal fa-star' /></span>)
                }
            </div>
            <div className='stars-layout' style={{ width: `${evaluation}%`, color: activeColor, height: starsWidth + 10 }}>
                {
                    Array(Math.ceil(parsedStarsValue)).fill('★').map(() => <span><i className='fas fa-star' /></span>)
                }
            </div>
        </div>
    );
};
StarsViewComponent.propTypes = {
    starsNumber: PropTypes.number,
    starsValue: PropTypes.number,
    starsWidth: PropTypes.number,
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    align: PropTypes.string
};

StarsViewComponent.defaultProps = {
    starsNumber: 5,
    starsValue: 0,
    starsWidth: 20,
    activeColor: '#ffb400',
    inactiveColor: '#ffb400',
    align: 'left'
};

export default StarsViewComponent;