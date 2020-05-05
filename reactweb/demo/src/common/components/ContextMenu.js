import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

/**
 * @param items: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        onclick: PropTypes.func.isRequired
    })).isRequired

    @param buttonClassname: PropTypes.string.isRequired
 */
export default class ContextMenu extends Component {

    state = {
        open: false
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.closeMenu);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.closeMenu);
    }

    closeMenu = ({ target }) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(target)) {
            if (target.className !== this.props.buttonClassname) {
                this.setState({open: false});
            }
        }
    }
    
    toggleMenu = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        const { items, buttonClassname } = this.props;

        return (
            <div onClick={this.toggleMenu} className='fluttr-context-menu-container' >
                <i className={buttonClassname || 'fas fa-ellipsis-v'} />
                {this.state.open && <div className='fluttr-context-menu'>
                    <ul className='menu-options'>
                        {items.map((item, index) => <li key={`menu-item-${index}`} className='menu-option' onClick={item.onclick}>{item.text}</li>)}
                    </ul>
                </div>}
            </div>);
    }

    static PropTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            onclick: PropTypes.func.isRequired
        })).isRequired,
        buttonClassname: PropTypes.string.isRequired
    };
}