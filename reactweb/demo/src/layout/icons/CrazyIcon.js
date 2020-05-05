import React from 'react';
import PropTypes from 'prop-types';

import crzIcons from './crazyIcons';

const CrazyIcon = ({ icon, className = '', onClick, disabled = false, ...rest }) => {
    const iconName = (icon && crzIcons.includes(icon)) ? icon : 'icon-plus-big';
    return (
        <i
            className={`crazy-icon crazy-${iconName} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        />
    );
};

CrazyIcon.PropTypes = {
    icon: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object
};

export default CrazyIcon;