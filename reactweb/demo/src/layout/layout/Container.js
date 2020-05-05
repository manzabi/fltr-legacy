import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function Container ({className='', fluid=false, ...rest}) {

    const params = {
        ...rest,
        className: `crazy-container ${className}`
    };
    delete params.fluid;

    if (fluid) params.className += ' container-fluid';

    return (
        <section {...params} />
    );
}

/*
Container.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    fluid: PropTypes.bool
};

Container.defaultProps = {
    className: '',
    fluid: false
};*/
