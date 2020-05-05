import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param columns PropTypes.number,
 * @param total PropTypes.number,
 * @param children PropTypes.node,
 * @param className: PropTypes.string
 */

const CrazyCard = ({ columns, total, children, className, style, ...rest }) => {
    return (
        <section {...rest} className={`crazy-card ${className}`} style={{ width: `calc(${columns / total} * 100% - 7px)`, ...style }}>
            {children}
        </section>
    );
};

CrazyCard.propTypes = {
    columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object
};

CrazyCard.defaultProps = {
    columns: 1,
    total: 1,
    children: <h2>Wrap a children with CrazyCard</h2>,
    className: '',
    style: {}
};

export default CrazyCard;