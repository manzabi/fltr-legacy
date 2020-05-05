'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fragments from 'react-dot-fragment';


/**
 * @property {bool} disabled This prop disable the input.
 * @property {function} onChange Function executed when the status of the input changes.
 * @property {string} id Id of the input.
 * @property {string} label Label to be rendered with the input.
 */
class CrazyCheckBox extends Component {

    state = {
        checked: this.props.checked || false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked) {
            this.setState({ checked: nextProps.checked });
        }
    }

    onChange = () => {
        const { disabled, onChange, id, manually } = this.props;
        if (!disabled) {
            const checked = !this.state.checked;
            if (!manually) {
                if (onChange) {
                    this.setState({ checked }, onChange({ id, value: checked }));
                } else {
                    this.setState({ checked });
                }
            } else {
                if (onChange) {
                    onChange({ id, value: checked });
                }
            }
        }
    }

    render() {
        const { disabled, id, label, checked } = this.props;
        // const { checked } = this.state;
        let className = 'crazy-checkbox';
        if (disabled) className += ' disabled';
        if (checked) className += ' checked';

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    className={className}
                    type='checkbox'
                    defaultChecked={checked}
                    onChange={this.onChange}
                    id={id}
                    style={{ margin: 0 }}
                    disabled={disabled}
                    checked={checked}
                    value={checked}
                />
                {id && label &&
                    <label className='crazy-checkbox-label' style={{ margin: 0, marginLeft: '18px', cursor: 'pointer' }} htmlFor={id}>{label}</label>
                }
            </div>
        );
    }
    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        manually: PropTypes.bool
    };

    static defaultProps = {
        disabled: false,
        manually: false
    };
}



class CrazyRadioButton extends Component {

    state = {
        checked: this.props.checked || false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.checked !== nextProps.checked) this.setState({ checked: nextProps.checked });
    }

    onChange = () => {
        const { disabled, onChange, id } = this.props;
        if (!disabled) {
            const checked = !this.state.checked;
            if (onChange) {
                this.setState({ checked }, onChange({ id, value: checked }));
            } else {
                this.setState({ checked });
            }
        }
    }

    render() {
        const { disabled, label, id } = this.props;
        const { checked } = this.state;
        let className = 'crazy-radio';
        if (disabled) className += ' disabled';
        if (checked) className += ' checked';

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    className={className}
                    type='radio'
                    checked={checked}
                    onChange={this.onChange}
                    style={{ margin: 0 }}
                    id={id}
                />
                {label && id &&
                    <label className='crazy-radio-label' style={{ margin: 0, marginLeft: '10px', cursor: 'pointer' }} htmlFor={id}>{label}</label>
                }
            </div>
        );
    }
}

class Switcher extends Component {

    render() {
        return (<div></div>);
    }
}

export {
    CrazyCheckBox,
    CrazyRadioButton,
    Switcher
};