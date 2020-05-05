import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from '../FluttrFonts';

export default class CrazyTextarea extends Component {
    constructor(props) {
        super(props);
        const { value } = props;
        this.state = {
            value
        };
    }

    onChange = ({ target: { value } }) => {
        const { onChange, id } = this.props;
        this.setState({ value }, () => { 
            if (onChange) { onChange({ value, id }); } 
        });
    };

    render() {
        const { className, onChange, label, maxLength, ...rest } = this.props;
        const { value } = this.state;
        return (
            <section className='crazy-textarea-container'>
                {!!label && <Text size='xs' style={{ marginBottom: 6 }}>{label}</Text>}
                <textarea
                    {...rest}
                    maxLength={maxLength}
                    className={`crazy-textarea${className ? ` ${className}` : ''}`}
                    onChange={this.onChange}
                    value={value}
                />
            </section>);
    }

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        id: PropTypes.string,
        label: PropTypes.string,
        maxLength: PropTypes.number
    };

    static defaultProps = {
        value: '',
        onChange: () => { return; },
        id: `random-id${Math.floor(Math.random() * 9999)}`,
        label: '',
        maxLength: 4000
    };
}