'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {node} children
 * @param {string} position Top, Bottom, Right, Left
 * @param {node} messageChildren Children inside the tooltip bubble, usually a text.
 * @param {boolean} activateWithHover True if opens and hides onMouseEnter/Leave. False if should stay opened.
 * @param {boolean} show
 * @param {string} color
 * @param {function} stayHiddenIf Function that returns a boolean. True if should stay hidden even though it's hovered. False otherwise.
 * @param {boolean} hideOnChildrenClick True if should hide when you click on the children, false otherwise. Useful to hide the tooltip in dropdowns.
 * @param {string} width
 */

export default class CrazyTooltip extends Component {
    state = {
        show: this.props.show
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.show !== nextProps.show) {
            this.setState({ show: nextProps.show });
        }
    }

    hideTooltip = () => {
        if (this.props.activateWithHover) {
            this.setState({ show: false });
        }
    }
    showTooltip = () => {
        if (this.props.activateWithHover) {
            if (!this.props.stayHiddenIf || (this.props.stayHiddenIf && !this.props.stayHiddenIf())) {
                this.setState({ show: true });
            }
        }
    }

    hideTooltipFromButton = () => {
        this.setState({ show: false });
    }

    returnPosition = () => {
        const { position } = this.props;
        const allPositions = ['top', 'bottom', 'right', 'left'];
        const lowerCasePosition = position.toLowerCase();
        if (allPositions.includes(lowerCasePosition)) return lowerCasePosition;
        return 'top';
    }

    returnColor = () => {
        const { color } = this.props;
        const allColors = ['orange', 'primary', 'darkside'];
        const lowerCaseColor = color.toLowerCase();
        if (allColors.includes(lowerCaseColor)) return lowerCaseColor;
        return 'primary';
    }

    render() {
        const { show } = this.state;
        const { children, messageChildren, hideOnChildrenClick, block, width } = this.props;
        const position = this.returnPosition();
        const color = this.returnColor();
        let className = 'crazy-tooltip';
        if (this.props.className) className += ` ${this.props.className}`;
        return (
            <div className={className} onMouseLeave={this.hideTooltip} style={{ display: block ? 'block' : 'inline-block' }}>
                {show &&
                    <div className={`tooltip-bubble tooltip-${position} crazy-${color}`} style={{ width }}>
                        {React.cloneElement(messageChildren, { onClose: this.hideTooltipFromButton })}
                    </div>}
                <div className='tooltip-trigger' onMouseEnter={this.showTooltip} onClick={() => { if (hideOnChildrenClick) this.hideTooltip(); }}>
                    {children}
                </div>
            </div>
        );
    }

    static propTypes = {
        children: PropTypes.node,
        position: PropTypes.string,
        messageChildren: PropTypes.node,
        activateWithHover: PropTypes.bool,
        show: PropTypes.bool,
        color: PropTypes.string,
        stayHiddenIf: PropTypes.func,
        hideOnChildrenClick: PropTypes.bool,
        displayInlineBlock: PropTypes.bool,
        width: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        children: <h2>This should wrap another component.</h2>,
        position: 'top',
        messageChildren: <h2>Please, pass a children to the tooltip</h2>,
        activateWithHover: true,
        show: false,
        color: 'primary',
        hideOnChildrenClick: false,
        block: false,
        width: '200px'
    };
}
