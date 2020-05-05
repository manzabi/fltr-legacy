'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';


/**
 * @param error: PropTypes.object,
 * @param success: PropTypes.object,
 * @param blocked: PropTypes.bool,
 * @param label: PropTypes.string,
 * @param placeholder: PropTypes.string,
 * @param focus: PropTypes.bool,
 * @param {function} onBlur function to be executed when the input loose his focus
 * @param config: PropTypes.object,
 * @param text: PropTypes.string,
 * @param onFieldChange: PropTypes.func,
 * @param enterAction: PropTypes.func,
 * @param showMessages: PropTypes.bool,
 * @param id: PropTypes.string
 */
export default class CrazyField extends Component {

    state = {
        showMessages: this.props.showMessages
    };

    componentDidMount() {
        if (this.props.focus) { setTimeout(() => { this._input.focus(); }, 10); }
    }

    onTextChange = ({ target: { value: text } }) => {
        const { label, id, onFieldChange } = this.props;
        onFieldChange(label, text, id);
    }

    onKeyUp = ({ key }) => {
        if (key === 'Enter' && this.props.enterAction) {
            this.props.enterAction();
            this.setState({ showMessages: true });
        }
    }

    onBlur = () => {
        const { onBlur } = this.props;
        if (onBlur) {
            onBlur();
        }
    };

    render() {
        const { config: { error, success }, blocked, label, placeholder, focus, text, id, maxLength, style } = this.props;
        const { showMessages } = this.state;

        const errorCondition = error.condition(text);
        const successCondition = success.condition(text);
        let status = '';
        if (errorCondition) { status = ' error'; }
        else if (successCondition) { status = ' success'; }

        const icon = errorCondition ? 'icon-cancel' : (successCondition || blocked) ? 'icon-check-small' : '';
        const renderIcon = this.props.showMessages || blocked;
        let className = 'crazy-input';
        if (showMessages || this.props.showMessages) { className += status; }

        return (<div className='crazy-field' style={style}>
            <p style={{ visibility: !!label }}>{label}</p>
            <div style={{ position: 'relative' }}>
                <input
                    ref={input => (this._input = input)}
                    type='text'
                    placeholder={placeholder}
                    onChange={this.onTextChange}
                    onBlur={this.onBlur}
                    className={className} disabled={blocked}
                    autoFocus={focus}
                    onKeyUp={this.onKeyUp}
                    value={text}
                    id={id}
                    maxLength={maxLength}
                    autoComplete='off'
                />
                {renderIcon && icon && <CrazyIcon icon={icon} />}
            </div>
            {
                (!blocked && errorCondition && (showMessages || this.props.showMessages)) ?
                    <div className='error-message'>{error.message}</div> : (!blocked && successCondition && (showMessages || this.props.showMessages)) ?
                        <div className='success-message'>{success.message}</div> :
                        <div className='filler-message' />
            }
        </div>);
    }

    static propTypes = {
        error: PropTypes.object,
        success: PropTypes.object,
        blocked: PropTypes.bool,
        label: PropTypes.string,
        placeholder: PropTypes.string,
        focus: PropTypes.bool,
        config: PropTypes.object,
        text: PropTypes.string,
        onFieldChange: PropTypes.func,
        enterAction: PropTypes.func,
        showMessages: PropTypes.bool,
        id: PropTypes.string,
        onBlur: PropTypes.func,
        maxLength: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        config: {
            error: { condition: (text) => { return text === 'error'; }, message: 'Wrong input' },
            success: { condition: (text) => { return text === 'success'; }, message: 'Correct input!' }
        },
        blocked: false,
        label: 'E-mail',
        placeholder: 'Write down your e-mail address...',
        focus: false,
        text: '',
        onFieldChange: () => { return; },
        showMessages: false,
        id: `${Math.floor(1000 * Math.random())}`,
        maxLength: 524288,
        style: {}
    };
}