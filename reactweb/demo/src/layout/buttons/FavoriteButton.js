'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';
import { Text } from '../FluttrFonts';

const FavoriteButton = ({ active = false, disabled = false, onClick = () => { return; }, text = 'FAVORITE BUTTON', style = {} }) => {
    const isActive = active ? ' active' : '';
    const isDisabled = disabled ? ' disabled' : '';

    let className = 'crazy-favorite';
    className += isActive;
    className += isDisabled;

    return (<div className={className} onClick={onClick} style={style}>
        {isActive ? <CrazyIcon icon='icon-bookmark-plain' /> : <CrazyIcon icon='icon-bookmark' />}
        <Text style={{ fontSize: 12 }}>{text}</Text>
    </div>);
};

FavoriteButton.propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.string,
    style: PropTypes.object
};

export default FavoriteButton;