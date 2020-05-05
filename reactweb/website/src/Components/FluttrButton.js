import React, {Component} from 'react';
import PropTypes from 'prop-types';


const buttonTypes = {
    primary: 'btn-green',
    link: 'btn-link',
    loading: 'loading',
    red: 'btn-red',
    blue: 'btn-blue',
    orange: 'btn-orange',
    white: 'btn-white'
};

const sizeTypes = {
    xSmall: 'btn-xsmall',
    small: 'btn-small',
    medium: 'btn-md'
};
/**
 * @param action: PropTypes.func.isRequired,
 * @param children: PropTypes.node.isRequired,
 * @param type: PropTypes.string,
 * @param loading: PropTypes.bool,
 * @param className: PropTypes.string,
 * @param inverse: PropTypes.bool,
 * @param small: PropTypes.bool,
 * @param disabled: PropTypes.bool
 */
export default class FluttrButton extends Component {
    render () {
        const buttonProps = {
            className: `btn-fluttr ${this.props.className}`,
            onClick: this.props.action,
            disabled: this.props.disabled || this.props.loading,
            id: this.props.id,
            style: this.props.style
        };
        if (!this.props.className) {
            // Adding styles to the button
            buttonProps.className = `${buttonProps.className} ${buttonTypes[this.props.type]}`;
    
            // Managin loading button
            if (this.props.loading) {
                buttonProps.className = `${buttonProps.className} ${buttonTypes.loading}`;
            }
    
            // Managing inverse button style
            buttonProps.className = `${buttonProps.className} ${this.props.inverse ? 'btn-inverse' : ''}`;
    
            // Managing button size
            buttonProps.className = `${buttonProps.className} ${this.props.size === 'default' ? '' : sizeTypes[this.props.size] || ''}`;
        } else {
            buttonProps.className= this.props.className;
        }



        return(
            <button {...buttonProps}>
                {this.props.children}
            </button>
        );
    }
}

FluttrButton.PropTypes = {
    action: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    loading: PropTypes.bool,
    className: PropTypes.string,
    inverse: PropTypes.bool,
    small: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string
};

FluttrButton.defaultProps = {
    type: 'primary',
    loading: false,
    className: '',
    inverse: false,
    size: 'default',
    disabled: false,
};