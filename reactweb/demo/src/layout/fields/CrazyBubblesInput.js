'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';
import { Text } from '../FluttrFonts';

const validationTypes = {
    email: {
        reg: /[\w\.-]+@[\w\.-]+\.\w{2,}\b/,
        multiElementFilter: (query) => {
            const list = query.replace(/[^,;]*.?</g, '')
                .replace(/>/g, '')
                .replace(/[,; ]{1,}/g, '\n')
                .replace(/[\n]{2,}/g, '\n')
                .split('\n');
            if (list.length > 1) return list;
            else return false;
        }
    }
};

/**
 * @todo Implement validation with function and default error if tha passed value is invalid (example, an undefined validation type)
 * @param id: An Id to assign to the iunput,
 * @param disabled: Disables the input to avoid user interaction,
 * @param placeholder: Placeholder text when the input it's empty,
 * @param autoFocus: pass this prop to autofocus the input when the component mounts
 * @param list: A list of strings that are shown ass bubles and the input at last position.
 * @param enterAction: Action to perform when the user hits enter key (recommended, concat the new value to the list)
 * @param validation: This prop should pass as value a verified validation type or a function that returns a boolean with the valuea as argument.
 */
export default class CrazyBubblesInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: ''
        };
    }

    componentDidMount() {
        if (this.props.autofocus) setTimeout(() => { this._input.focus(); }, 10);
    }

    handleChangeInput = ({ target: { value } }) => {
        const { list, validation, enterAction } = this.props;
        const isList = validationTypes[validation].multiElementFilter(value);
        if (isList) {
            const filteredList = isList.filter((toFilterElement) => !list.includes(toFilterElement) && validationTypes[validation].reg.test(toFilterElement.trim()));
            enterAction([...list, ...filteredList]);
        } else {
            this.setState({ fieldValue: value.toLowerCase() });
        }
    }

    onKeyUp = ({ key, target: { value } }) => {
        if (key === 'Enter') {
            this.handleAddItem(value);
        }
    }

    handleAddItem = (value) => {
        const { list, validation, enterAction } = this.props;
        const notEmpty = value && value.trim();
        const isUnique = list.every((element) => element !== value);
        if (this.props.enterAction && notEmpty && isUnique) {
            let valid = true;
            if (validation) valid = validationTypes[validation].reg.test(value.trim());
            if (valid) {
                enterAction([...list, value.trim()]);
                this.setState({ fieldValue: '' });
            }
        }
    }

    onBlur = ({ target: { value } }) => {
        this.handleAddItem(value);
    }

    handleFocus = () => {
        this._input.focus();
    }

    handleRemoveElement = (id) => {
        const { list, enterAction } = this.props;
        const elementList = [...list];
        elementList.splice(id, 1);
        enterAction(elementList);
    }

    render() {
        const { placeholder, className, disabled, autoFocus, id, list, showWindow } = this.props;
        const { fieldValue } = this.state;
        return (
            <div className='crazy-bubbles-input-container' onClick={this.handleFocus}>
                {list.map((element, index) =>
                    (
                        <span className='active-element' key={index} id={index}>
                            {element}<CrazyIcon
                                icon='icon-cancel'
                                onClick={() => this.handleRemoveElement(index)}
                            />
                        </span>
                    )
                )}
                <div className='input-container'>
                    <input
                        ref={input => (this._input = input)}
                        type='text'
                        placeholder={placeholder}
                        onChange={this.handleChangeInput}
                        className={className + ' text-input'}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        onKeyUp={this.onKeyUp}
                        value={fieldValue}
                        id={id}
                        onBlur={this.onBlur}
                    />
                    {fieldValue.length >= 1 && showWindow &&
                        <div className='current-expert-add' onClick={() => this.handleAddItem(fieldValue)}>
                            <Text className='crazy-lightgrey'>Invite</Text>
                            <Text className='crazy-lightgrey'>{fieldValue}</Text>
                        </div>
                    }
                </div>
            </div>
        );
    }

    static propTypes = {
        id: PropTypes.string,
        disabled: PropTypes.bool,
        placeholder: PropTypes.string,
        autoFocus: PropTypes.bool,
        list: PropTypes.arrayOf(PropTypes.string.isRequired),
        enterAction: PropTypes.func.isRequired,
        validation: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]),
        showWindow: PropTypes.bool
    };
    
    static defaultProps = {
        disabled: false,
        placeholder: '',
        autoFocus: false,
        list: [],
        showWindow: false
    };
}
