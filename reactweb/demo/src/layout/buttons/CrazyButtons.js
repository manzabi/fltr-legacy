'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import CrazyIcon from '../icons/CrazyIcon';

const buttonSizes = {
    large: 'large',
    variable: 'variable',
    fix: 'fix',
    small: 'small',
    mamita: 'large-long',
    ceci: 'almost-rectangle',
    sidebar: 'button-sidebar',
    link: 'button-link'
};

const buttonColors = ['eggplant', 'white', 'darkside', 'orange', 'pink', 'green', 'primary'];

const CrazyButton = ({ action, text, size, icon, color, disabled, id, loading, circle, inverse, style, className: classname, ...rest }) => {
    //If there's a size prop and it's an existing one -> use it. Otherwise 'variable' size.
    const sizeClass = buttonSizes[size] || buttonSizes.fix;
    //Same with colors, default is eggplant.
    const colorClass = (color && buttonColors.includes(color)) ? ` crazy-${color}` : ' crazy-primary';
    // disabled if true or if loading.
    const isDisabled = disabled || loading;

    let className = `crazy-button ${classname}`;
    className += ` crazy-${sizeClass}`;
    className += colorClass;
    if (isDisabled) className += ' disabled';
    if (loading) className += ' loading';
    if (icon) className += ' icon';
    if (circle) className += ' circle';
    if (inverse) className += ' inverse';

    if (circle) {
        return (
            <button
                {...rest}
                className={className}
                disabled={isDisabled}
                id={id}
                onClick={action}
            >
                {icon && !loading ? <CrazyIcon icon={icon} /> : <span className='filler' />}
            </button>
        );
    }

    return (
        <button
            {...rest}
            className={className}
            disabled={isDisabled}
            id={id}
            onClick={action}
            style={style}
        >{icon && !loading ? <CrazyIcon icon={icon} /> : <span className='filler' />}{!loading && <span style={{ margin: 0 }}>{text}</span>}
        </button>
    );
};

CrazyButton.defaultProps = {
    action: () => { return; },
    text: 'Button',
    size: 'fix',
    icon: undefined,
    color: 'primary',
    disabled: false,
    loading: false,
    inverse: false,
    className: ''
};
CrazyButton.propTypes = {
    action: PropTypes.func.isRequired,
    text: PropTypes.string,
    size: PropTypes.oneOf(['large', 'variable', 'fix', 'small', 'mamita', 'ceci', 'sidebar', 'link']),
    icon: PropTypes.string,
    color: PropTypes.oneOf(['eggplant', 'white', 'darkside', 'orange', 'pink', 'green', 'primary']),
    disabled: PropTypes.bool,
    id: PropTypes.string,
    loading: PropTypes.bool,
    inverse: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
};

export default CrazyButton;