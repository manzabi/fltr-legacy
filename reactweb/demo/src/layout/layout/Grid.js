import React from 'react';
import PropTypes from 'prop-types';


export default function Grid ({ className = '', revertMargin, ...rest }) {
    const params = {
        ...rest,
        className: 'crazy-grid'
    };

    if (className) {
        params.className += ` ${className}-grid`;
    }
    return (
        <section className={`crazy-grid-parent ${revertMargin ? 'grid-no-padding' : ''} ${className}`}>
            <section {...params} />
        </section>
    );

}

Grid.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    revertMargin: PropTypes.bool
};

Grid.defaultProps = {
    className: ''
};
