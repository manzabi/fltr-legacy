'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';
import CrazySearchBar from '../searchbar/Searchbar';
import { Text } from '../FluttrFonts';

/**
 * @param open: PropTypes.bool,
 * @param defaultText: PropTypes.string,
 * @param options: PropTypes.arrayOf(PropTypes.object),
 * @param type: PropTypes.string,
 * @param header: PropTypes.string,
 * @param onChange: PropTypes.func,
 * @param placeholder: PropTypes.string,
 * @param icon: PropTypes.oneOf([null, 'icon-arrow-drop-down']),
 * @param borderTransparent: PropTypes.bool
 * @param resetIf: PropTypes.bool
 */

export default class CrazyDropdown extends Component {
    constructor(props) {
        super(props);
        const { defaultText, value, open, placeholder, options } = props;
        let selected = '';
        if (value) { selected = options.find((option) => option.value == value) || ''; }
        else if (defaultText && defaultText.length) { selected = { text: defaultText }; }
        else if (placeholder) { selected = placeholder; }

        this.state = {
            open,
            selected
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
        if (this.props !== nextProps && nextProps.resetIf === true) {
            this.setState({ open: false, selected: nextProps.placeholder });
        } else if (this.props.value !== nextProps.value) {
            this.setState({ open: false, selected: this.props.options.find(option => option.value === nextProps.value) });
        }
    }

    closeMenu = ({ target }) => {
        if (this._ismounted) {
            const domNode = ReactDOM.findDOMNode(this);
            if (!domNode || !domNode.contains(target)) {
                if (target.className !== 'crazy-input' && target.className !== 'header') {
                    this.setState({ open: false });
                }
            }
        }
    };

    toggleOptions = ({ target }) => {
        if (target.className !== 'crazy-input' && target.className !== 'header') { this.setState({ open: !this.state.open }); }
    };

    renderSearchBar = () => {
        return (<CrazySearchBar options={this.props.options} />);
    };

    renderOption = (text, index, value, active = true, separator) => {
        const selected = this.state.selected.text === text;
        let className = 'option';
        if (selected) { className += ' selected'; }
        if (index === 0) { className += ' first'; }
        if (index === this.props.options.length - 1) { className += ' last'; }
        if (separator) {
            return <div key={`drop_${index}_${text}_${value}`} className='dropdown-separator' onClick={(event) => { event.preventDefault(); event.stopPropagation(); }} />;
        } else if (active) {
            return (
                <div key={`drop_${index}_${text}_${value}`} className={className} onClick={() => this.onSelectOption(index, value)}>
                    {selected ? <CrazyIcon icon='icon-check-small' /> : <div className='filler' />}<Text style={{ margin: 0 }}>{text}</Text>
                </div>
            );
        } else {
            return null;
        }
    };

    renderHeader = (text) => {
        return (<div className='header'>{text}</div>);
    };

    onSelectOption = (index) => {
        this.setState({ open: false, selected: this.props.options[index] }, this.props.onChange(this.props.options[index]));
    };

    render() {
        const { options, type, header, placeholder, icon, borderTransparent, className, style, fullHeight, noUpperCase } = this.props;
        const { open, selected } = this.state;
        const availableTypes = ['normal', 'search', 'header'];
        const selectedType = availableTypes.includes(type) ? type : 'normal';

        const validItemsForHeight = options.filter(({ active = true }) => active).length;
        let dropdownHeight = validItemsForHeight < 5 ? validItemsForHeight * 43 : 4 * 43;
        if (!fullHeight) dropdownHeight += 24;

        if (type === 'header' || type === 'search') { dropdownHeight -= 43; }
        const isTextDarker = placeholder && (selected && selected.text && placeholder !== selected.text || selected !== placeholder);
        let selectedText = selected;

        if (selected.selectedText) {
            selectedText = selected.selectedText;
        } else if (selected.text) {
            selectedText = selected.text;
        }
        if (!noUpperCase) {
            selectedText = selectedText.toUpperCase();
        }
        return (
            <div
                className={'crazy-dropdown' + (open ? ' open' : '') + (borderTransparent ? ' border-transparent' : '') + (className ? ` ${className}` : '')}
                onClick={this.toggleOptions}
                style={style}
            >
                <div className={`selected-container${isTextDarker ? ' darker-text' : placeholder ? ' placeholder' : ''}`}>
                    <Text style={{ margin: 0 }}>{selectedText}</Text> <CrazyIcon style={{ visibility: icon === null ? 'hidden' : 'visible' }} icon={icon} />
                </div>
                {open && <div
                    className='options-wrapper'
                    style={{
                        height: fullHeight ? 'max-content' : dropdownHeight,
                        overflowY: 'auto',
                        maxHeight: fullHeight ? 'unset' : `calc(${dropdownHeight}px)`
                    }}
                >
                    {selectedType === 'search' && this.renderSearchBar()}
                    {selectedType === 'header' && header && this.renderHeader(header)}
                    {options.map(({ text, value, separator, active }, index) => { return this.renderOption(text, index, value, active, separator); })}
                </div>}
            </div>
        );
    }
    static propTypes = {
        open: PropTypes.bool,
        defaultText: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.object),
        type: PropTypes.string,
        header: PropTypes.string,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        icon: PropTypes.oneOf([null, 'icon-arrow-drop-down']),
        borderTransparent: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        className: PropTypes.string,
        style: PropTypes.object,
        fullHeight: PropTypes.bool,
        resetIf: PropTypes.bool,
        noUpperCase: PropTypes.bool
    };

    /**
     *
     * @type {{fullHeight: boolean, onChange: CrazyDropdown.defaultProps.onChange, borderTransparent: boolean, options: *[], icon: string, style: {}, type: string, open: boolean}}
     */
    static defaultProps = {
        open: false,
        options: [{ text: 'Option 1' }, { text: 'Option 2' }, { text: 'Option 3' }, { text: 'Option 4' }, { text: 'Option 5' }, { text: 'Option 6' }],
        type: 'normal',
        onChange: () => { return; },
        icon: 'icon-arrow-drop-down',
        borderTransparent: false,
        style: {},
        fullHeight: false
    };
}