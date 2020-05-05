import React from 'react';
import PropTypes from 'prop-types';

const buttonTypes = {
    primary: 'btn-green',
    link: 'btn-link',
    loading: 'loading',
    red: 'btn-red',
    blue: 'btn-blue',
    orange: 'btn-orange'
};

const sizeTypes = {
    xSmall: 'btn-xsmall',
    small: 'btn-small',
    medium: 'btn-md',
    big: 'btn-big'
};
const FluttrButton = ({ className, action, disabled, loading, inverse, size, children, type }) => {
    const buttonProps = {
        className: `btn ${className}`,
        onClick: action,
        disabled: disabled || loading
    };

    // Adding styles to the button
    buttonProps.className = `${buttonProps.className} ${buttonTypes[type]}`;

    // Managin loading button
    if (loading) {
        buttonProps.className = `${buttonProps.className} ${buttonTypes.loading}`;
    }

    // Managing inverse button style
    buttonProps.className = `${buttonProps.className} ${inverse ? 'btn-inverse' : ''}`;

    // Managing button size
    buttonProps.className = `${buttonProps.className} ${size === 'default' ? '' : sizeTypes[size] || ''}`;


    return (
        <button {...buttonProps}>
            {children}
        </button>
    );
};

FluttrButton.propTypes = {
    action: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    loading: PropTypes.bool,
    className: PropTypes.string,
    inverse: PropTypes.bool,
    small: PropTypes.bool,
    disabled: PropTypes.bool
};

FluttrButton.defaultProps = {
    type: 'primary',
    loading: false,
    className: '',
    inverse: false,
    size: 'default',
    disabled: false,
};

export default FluttrButton;