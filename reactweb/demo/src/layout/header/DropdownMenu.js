import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DropdownMenu extends Component {

    state = {
        open: false
    };

    handleOpenMenu = () => {
        this.setState({
            open: true
        });
    };

    handleCloseMenu = () => {
        this.setState({
            open: false
        });
    };

    render() {
        const { className, children, content, ...rest } = this.props;
        const { open } = this.state;
        return (
            <section
                {...rest}
                onMouseEnter={this.handleOpenMenu}
                onMouseLeave={this.handleCloseMenu}
                className={`crazy-dropdown-menu ${className !== undefined && className || ''}`}
            >
                {children}
                {open &&
                    <section className='dropdown-menu-content'>
                        {content()}
                    </section>
                }
            </section>
        );
    }
    static propTypes = {
        children: PropTypes.node.isRequired,
        content: PropTypes.func.isRequired
    };
}
