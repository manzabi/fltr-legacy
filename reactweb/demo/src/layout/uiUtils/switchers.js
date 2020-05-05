'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CrazyCheckBox } from './inputControls';
import CrazyIcon from '../icons/CrazyIcon';
import CrazyTooltip from './tooltip';

export class CrazySwitcher extends Component {

    state = {
        active: this.props.active || 0,
        all: false,
        id: this.props.id || `switch_${Math.floor(Math.random() * 9999)}`
    };

    renderOption = (text, value, index) => {
        const isFirst = index === 0 ? ' first' : '';
        const isLast = index === this.props.options.length - 1 ? ' last' : '';
        const isSelected = (this.state.active === index || this.state.all) ? ' selected' : '';

        let className = 'option';
        className += isFirst;
        className += isLast;
        className += isSelected;

        return (
            <div key={`${this.state.id}_${index}`} className={className} onClick={() => this.onClick(index, value)}>
                {text}
            </div>
        );
    };

    onClick = (index, value) => {
        this.setState({ active: index }, () => this.props.onChange(value));
    };

    onCheckChange = (value) => {
        this.setState({ all: value });
    };

    render() {
        const { options } = this.props;

        return (
            <div className='crazy-switcher' style={{ width: 157 * options.length }}>
                <div className='check-container'>
                    <CrazyCheckBox onChange={this.onCheckChange} checked={this.state.all} id={this.state.id} /> <p>ALL</p>
                </div>
                <div className='crazy-switcher-content' style={{ width: 157 * options.length }}>
                    {options.map(({ text, value }, index) => this.renderOption(text, value, index))}
                </div>
            </div>
        );
    }
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func,
        active: PropTypes.number,
        id: PropTypes.string
    };

    static defaultProps = {
        options: [
            { text: 'Option 1', value: 1 },
            { text: 'Option 2', value: 2 },
            { text: 'Option 3', value: 3 },
            { text: 'Option 4', value: 4 }
        ],
        onChange: () => { return; }
    };
}



export class CrazySwitcherTransparent extends Component {
    state = {
        active: this.props.active
    };

    renderOption = (element) => {
        if (element.hidden) {
            return null;
        } else {
            let className = 'option';

            const isSelected = this.state.active === element.value;
            const isDisabled = element.disabled || this.props.disabled;
            className += isSelected ? ' selected' : '';
            className += isDisabled ? ' disabled' : '';
            if (element.disabledTooltip && isDisabled) {
                return (
                    <CrazyTooltip {...element.disabledTooltip}>
                        <div key={`switcher_${element.text}`} className={className} onClick={() => this.onClick(element)}>
                            {element.disabled && <CrazyIcon icon={'icon-lock-alt'} />}&nbsp;{element.text}
                        </div>
                    </CrazyTooltip>
                );
            } else if (element.enabledTooltip && !isDisabled) {
                return (
                    <CrazyTooltip key={`switcher_${element.text}`} {...element.enabledTooltip}>
                        <div className={className} onClick={() => this.onClick(element)}>
                            {element.disabled && <CrazyIcon icon={'icon-lock-alt'} />}&nbsp;{element.text}
                        </div>
                    </CrazyTooltip>
                );
            }
            return (
                <div key={`switcher_${element.text}`} className={className} onClick={() => this.onClick(element)}>
                    {element.disabled && <CrazyIcon icon={'icon-lock-alt'} />}&nbsp;{element.text}
                </div>
            );
        }

    };

    onClick = (element) => {
        if (!this.props.disabled && !element.disabled) {
            this.setState({ active: element.value }, () => {
                const { action } = element,
                    { onChange } = this.props;
                if (onChange) onChange(element.value);
                if (action) action();
            });
        }
    };

    render() {
        const { options, disabled } = this.props;
        let className = 'crazy-switcher-transparent';
        const isDisabled = disabled ? ' disabled' : '';
        className += isDisabled;

        return (<div className={className} style={{ width: 70 * options.length }}>
            {options.map((element, index) => this.renderOption(element, index))}
        </div>);
    }

    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    static defaultProps = {
        options: [
            { text: 'LOGIN', value: 1 },
            { text: 'SIGN UP', value: 2 }
        ],
        onChange: () => { return; },
        disabled: false,
        active: 0
    };
}




export class CrazyLayoutSelector extends Component {
    state = {
        active: parseInt(this.props.active)
    };

    renderItem = (element, index) => {
        const isActive = this.state.active === index ? ' active' : '';

        return (<div className='item' onClick={() => this.onClick(index)}>
            <CrazyIcon className={isActive} icon={element} />
        </div>);
    };

    onClick = (index) => {
        this.setState({ active: index }, this.props.onChange(index));
    };

    render() {
        const { disabled } = this.props;

        let className = 'crazy-layout-selector';
        const isDisabled = disabled ? ' disabled' : '';
        className += isDisabled;

        return (<div className={className}>
            {['icon-grid', 'icon-hamburger'].map((element, index) => this.renderItem(element, index))}
        </div>);
    }
    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        active: PropTypes.oneOfType[PropTypes.number, PropTypes.string]
    };

    static defaultProps = {
        disabled: false,
        onChange: () => { return; }
    };
}
