'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';
import ProfilePic from '../uiUtils/ProfilePic';
import ReactDOM from 'react-dom';
import { Text } from '../FluttrFonts';

export default class CrazySearchBar extends Component {

    constructor(props) {
        super(props);
        const selectedOptions = props.options || [];
        const typing = props.focus;
        const selected = { text: props.placeholder };
        this.state = {
            text: '',
            open: false,
            selected,
            typing,
            selectedOptions
        };
    }

    componentDidMount() {
        this._ismounted = true;
        window.addEventListener('click', this.closeMenu);
    }

    componentWillUnmount() {
        this._ismounted = false;
        window.removeEventListener('click', this.closeMenu);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.options) !== JSON.stringify(this.props.options)) {
            if (this.state.open) {
                // stay open
                this.emptyField();
            } else {
                //stay closed
                this.setState({ open: false }, () => {
                    const fakeEvent = { target: { value: '' } };
                    this.onTextChange(fakeEvent, true);
                });
            }
        }
    }

    componentDidUpdate() {
        if (this.state.typing) {
            setTimeout(() => { this._input.focus(); }, 10);
            if (!this.state.open) { this.openMenu(); }
        }
    }

    openMenu = () => {
        if (this.props.openOnFocus) { this.setState({ open: true, typing: true }); }
    }

    closeMenu = ({ target, target: { classList } }) => {
        if (this._ismounted) {
            if (!this.state.open) {
                const domNode = ReactDOM.findDOMNode(this);
                if (domNode && domNode.contains(target)) {
                    this.openMenu();
                }
            }
            else {
                const domNode = ReactDOM.findDOMNode(this);
                if (this.props.renderChildren && classList && Array.prototype.some.call(classList, classname => this.props.backdropClasses.includes(classname))) {
                    return;
                }
                else if (domNode && !domNode.contains(target)) {
                    this.setState({ open: false });
                } else {
                    if (classList[0] === undefined || classList[0] === '') {
                        return;
                    } else {
                        this.setState({ open: false });
                    }
                }
            }
        }
    }

    onTextChange = ({ target: { value: text } }, forceClosed = false) => {
        const selectedOptions = this.props.options.filter(element => {
            const eText = element.text;
            if (typeof eText === 'string') {
                return eText.toLowerCase().includes(text.toLowerCase());
            } else if (Array.isArray(eText)) {
                return eText.join('').toLowerCase().includes(text.toLowerCase());
            } else {
                return false;
            }
        });
        this.setState({ text, selectedOptions, open: !forceClosed && (!!selectedOptions.length || this.props.openIfText && !!text.length) });
    }

    renderOption = (text, index, url) => {
        const selected = this.state.selected.text === text;
        let className = 'option';
        if (selected) { className += ' selected'; }
        if (index === 0) { className += ' first'; }
        if (index === this.props.options.length - 1) { className += ' last'; }

        return (<div className={className} key={index} onClick={() => this.onSelectOption(index)}>
            {(this.props.withPics && url) ? <ProfilePic shape='circle' length={28} url={url} /> : <div className='filler'></div>}
            {Array.isArray(text) ?
                <div>
                    {text.map((el, i) => (
                        <Text size='xs' key={`searchbar_option_${i}`} style={{ marginBottom: 0 }}>{el}</Text>
                    ))}
                </div> :
                <Text size='xs' style={{ marginBottom: 0 }}>{text}</Text>
            }
        </div>);
    }

    onSelectOption = (index) => {
        this.setState({ open: this.props.stayOpenOnChange, selected: this.state.selectedOptions[index] }, this.props.onChange(this.state.selectedOptions[index]));
    }

    emptyField = (typing = true) => {
        this.setState({ text: '', typing }, () => {
            const fakeEvent = { target: { value: '' } };
            this.onTextChange(fakeEvent);
        });
    }

    render() {
        const { focus, placeholder, icon, disabled, renderChildren, childrenHeight, className, maxLength, id } = this.props;
        const { open, typing, selectedOptions, text } = this.state;

        let dropdownHeight;
        if (childrenHeight) {
            dropdownHeight = childrenHeight;
        } else {
            dropdownHeight = selectedOptions.length < 5 ? selectedOptions.length * 42 : 4 * 42;
        }
        const isTyping = typing ? ' typing' : '';
        const isDisabled = disabled ? ' disabled' : '';
        const hasClassName = className ? ` ${className}` : '';
        const isOpen = open ? ' open' : '';
        if (isOpen && !childrenHeight) {
            if (selectedOptions.length < 5) {
                dropdownHeight += 26;
            }
        }
        return (<div id={id} className={`crazy-searchbar${isTyping}${isDisabled}${hasClassName}${isOpen}`}>
            <div className='writing-container'>
                <input
                    type='text'
                    placeholder={placeholder}
                    onChange={this.onTextChange}
                    autoFocus={focus}
                    disabled={disabled}
                    className='crazy-input'
                    onFocus={() => { this.setState({ typing: true }); }}
                    onBlur={() => { this.setState({ typing: false }); }}
                    value={text}
                    ref={input => (this._input = input)}
                    maxLength={maxLength}
                />
                <CrazyIcon icon={icon} />
            </div>
            {open && <div className='options-wrapper' >
                <div style={{ height: dropdownHeight, width: '100%', overflowY: 'auto', overflowX: 'none' }}>
                    {(renderChildren) ? renderChildren(selectedOptions, text, this.emptyField) : selectedOptions.map(({ text, url }, index) => { return this.renderOption(text, index, url); })}
                </div>
            </div>}
        </div>);
    }
    static propTypes = {
        placeholder: PropTypes.string,
        icon: PropTypes.string,
        focus: PropTypes.bool,
        disabled: PropTypes.bool,
        options: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func,
        withPics: PropTypes.bool,
        renderChildren: PropTypes.func,
        childrenHeight: PropTypes.string,
        openIfText: PropTypes.bool,
        openOnFocus: PropTypes.bool,
        backdropClasses: PropTypes.array,
        stayOpenOnChange: PropTypes.bool,
        className: PropTypes.string,
        maxLength: PropTypes.number
    };

    static defaultProps = {
        placeholder: 'SEARCH BY TYPING',
        icon: 'icon-search',
        focus: false,
        disabled: false,
        options: [
            { text: 'Option 1', value: 1, url: 'https://app.zeplin.io/img/icZeplin.svg' },
            { text: 'Option 2', value: 2, url: 'https://app.zeplin.io/img/icZeplin.svg' },
            { text: 'Option 3', value: 3, url: 'https://app.zeplin.io/img/icZeplin.svg' },
            { text: 'Option 4', value: 4, url: 'https://app.zeplin.io/img/icZeplin.svg' },
            { text: 'Option 5', value: 5, url: 'https://app.zeplin.io/img/icZeplin.svg' },
            { text: 'Option 6', value: 6, url: 'https://app.zeplin.io/img/icZeplin.svg' }
        ],
        onChange: () => { return; },
        withPics: false,
        openIfText: false,
        backdropClasses: [],
        stayOpenOnChange: false,
        openOnFocus: false,
        maxLength: 524288
    };
}