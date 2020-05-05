import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';

/**
 * @param list: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        placeholder: PropTypes.string.isRequired,
        action: PropTypes.func
    })).isRequired,
 * @param   changeTrigger: PropTypes.func.isRequired,
 * @param   reference: PropTypes.string.isRequired,
 * @param   value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
 */
export default class DropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropDownList: props.list,
            selectedValue: props.value ? true : null
        };
    }
    handleChange = event => {
        const selectedValue = event.target.value;
        const list = { ...this.state.dropDownList.filter((item) => item.value == selectedValue)[0] };
        if (!this.state.selectedValue) {
            this.setState({
                selectedValue: true
            });
        }
        if (list.action) {
            list.action();
        } else this.props.changeTrigger(list.value, this.props.reference);
    }

    handleFocus = (event) => {
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    render() {
        let defaultValue = this.props.value || 0;
        if (typeof this.props.value === 'string') {
            this.props.list.forEach((item, index) => {
                const { value } = item;
                if (value === this.props.value) {
                    defaultValue = this.props.list[index].value;
                } else if (index === parseInt(defaultValue)) {
                    defaultValue = this.props.list[index].value;
                }
            });
        }
        return (
            <select className='fluttr-dropdown'
                onChange={this.handleChange}
                defaultValue={defaultValue}
                ref={this.props.reference}
                id={this.props.reference}
                onFocus={this.handleFocus}
            >
                {(!this.state.selectedValue && !this.props.value) &&
                    <option value='' disabled>Select an option</option>
                }
                {this.props.list.map((option, index) => (
                    <option value={option.value} key={index}>{option.placeholder}</option>
                ))}
            </select>
        );
    }
}

DropDown.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        placeholder: PropTypes.string.isRequired,
        action: PropTypes.func
    })).isRequired,
    changeTrigger: PropTypes.func.isRequired,
    reference: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};