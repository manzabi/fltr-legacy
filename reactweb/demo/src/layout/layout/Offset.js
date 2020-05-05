import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fragment from 'react-dot-fragment';


/**
 *
 * @param {string} xsOffset
 * @param {string} smOffset
 * @param {string} mdOffset
 * @param {string} lgOffset
 */

export default function Offset (props) {
    const params = {
        offset: {
            className: ''
        }
    };
    const {xsOffset = '0', smOffset = xsOffset, mdOffset = smOffset || xsOffset, lgOffset = mdOffset || smOffset || xsOffset} = props;
    if (xsOffset)
        params.offset.className += (' crazy-col-xs-offset-' + xsOffset);
    if (smOffset)
        params.offset.className += (' crazy-col-sm-offset-' + smOffset);
    if (mdOffset)
        params.offset.className += (' crazy-col-md-offset-' + mdOffset);
    if (lgOffset)
        params.offset.className += (' crazy-col-lg-offset-' + lgOffset);
    return (
        <section key='offset' {...params.offset} />
    );
}

/*
Col.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xsOffset: PropTypes.string,
    smOffset: PropTypes.string,
    mdOffset: PropTypes.string,
    lgOffset: PropTypes.string
};

Col.defaultProps = {
    className: '',
    xs: '12',
    xsOffset: '0'
};*/
