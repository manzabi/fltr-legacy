'use strict';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param shape: PropTypes.string,
 * @param url: PropTypes.string.isRequired,
 * @param length: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired
    ]),
    @param className: PropTypes.string
 */

const ProfilePic = (props) => {
    const { shape, url } = props;
    const possibleShapes = ['square', 'circle'];
    const selectedShape = possibleShapes.includes(shape) ? shape : 'square';
    let className = 'profile-pic';
    if (props.className) className += ` ${props.className}`;
    className += ` profile-pic-${selectedShape}`;
    let length = `${props.length}`;
    const isLengthPercentage = length.includes('%');
    const isLengthPixels = length.includes('px');
    if (!isLengthPercentage && !isLengthPixels) {
        length += 'px';
    }

    return <img
        style={{ width: length, height: length.includes('%') ? 'inherit' : length }}
        className={className}
        src={url}
    />;
};

ProfilePic.propTypes = {
    shape: PropTypes.oneOf(['circle', 'square']),
    url: PropTypes.string.isRequired,
    length: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired
    ]),
    className: PropTypes.string
};

export default ProfilePic;