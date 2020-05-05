import React from 'react';
import PropTypes from 'prop-types';

const CrazySlider = ({ min = 0, max = 1, step = 0.1, onChange = () => { return; }, className = '', value = 0.5, ...rest }) => {
    const newClassName = `crazy-slider${className ? ` ${className}` : ''}`;
    return (
        <input
            {...rest}
            type='range'
            className={newClassName}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={value}
        />
    );
};

CrazySlider.propTypes = {
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default CrazySlider;