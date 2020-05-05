import React from 'react';
import PropTypes from 'prop-types';

const sizes = {
    sm: 'small',
    md: 'md',
    lg: 'big',
    xs: 'extra-small'
};

const Header = ({ size = 'md', className, onClick = () => { return; }, style = {}, children }) => {
    const newProps = {
        className: `crazy-header-${sizes[size]}`
    };
    if (className) newProps.className += ` ${className}`;
    return (
        <h2 {...newProps} onClick={onClick} style={style}>
            {children}
        </h2>
    );
};
Header.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func
};

const Text = ({ className, bold = false, children, onClick = () => { return; }, size = 'md', ...rest }) => {
    const newProps = {
        className: `crazy-text-${sizes[size]}${bold ? ' bold' : ''}`,
        ...rest
    };
    if (className) newProps.className = `${newProps.className} ${className}`;
    return (
        <p {...newProps} onClick={onClick} >
            {children}
        </p>
    );
};

Text.propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    bold: PropTypes.bool,
    dangerouslySetInnerHTML: PropTypes.object
};

export { Header, Text };