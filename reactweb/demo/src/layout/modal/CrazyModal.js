'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CrazyIcon from '../icons/CrazyIcon';
import { Text } from '../FluttrFonts';
import { Portal } from 'react-portal';

export default class CrazyModal extends Component {
    state = {
        show: this.props.show
    };

    componentDidMount() {
        this._ismounted = true;
        if (this.props.show && this.props.manageUiFix) {
            this.openModalFix();
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
        if (this.props.manageUiFix) {
            this.closeModalFix();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.state.show) {
            this.setState({ show: nextProps.show });
        }
        if (nextProps.show && !this.props.show) {
            if (nextProps.manageUiFix) {
                this.openModalFix();
            }
        }
        if (this.props.show && !nextProps.show) {
            if (nextProps.manageUiFix) {
                this.props.closeModalFix();
            }
        }
    }

    hideModal = () => {
        if (this.props.manageUiFix) {
            if (this.props.mainScrollStatus) {
                this.closeModalFix();
            }
        }
        this.setState({ show: false });
    };

    openModalFix = () => {
        if (this.props.manageUiFix) {
            this.props.openModalFix();
            if (this.props.mainScrollStatus) {
                if (this._ismounted) {
                    this.props.dispatch(this.props.hideMainScroll());
                }
            }
        }
    };

    closeModalFix = () => {
        if (this.props.manageUiFix) {
            this.props.closeModalFix();
            if (this._ismounted) {
                this.props.dispatch(this.props.showMainScroll());
            }
        }
    };

    onCloseButton = () => {
        if (this.props.onCloseButton) { this.props.onCloseButton(); }
        this.hideModal();
    };

    manageBackdrop = (event) => {
        event.stopPropagation();
        const { target, currentTarget } = event;
        if (target === currentTarget && this.props.backdrop) { this.onCloseButton(); }
    };

    render() {
        const { children, onCloseButton, title, size, scrollable } = this.props;
        const { show } = this.state;
        let className = 'crazy-modal';
        if (scrollable) {
            className += ' scrollable-modal';
        }
        if (!show) { className += ' not-show'; }
        if (this.props.className) { className += ` ${this.props.className}`; }
        //TODO: temporal fix (!important) this should be refactored as soon the react version gets an update.
        return (
            <Portal node={document && document.getElementById('modal-root')}>
                <section className={className} onClick={this.manageBackdrop}>
                    <section className={`crazy-modal-content modal-${size}`}>
                        {(onCloseButton || title) &&
                            <div className='crazy-modal-banner'>
                                {typeof title === 'string' && <Text className='crazy-modal-title' bold>{title}</Text>}
                                {title && typeof title !== 'string' && title}
                                {onCloseButton && <CrazyIcon icon='icon-cancel' onClick={this.onCloseButton} /> || <div />}
                            </div>
                        }
                        {children}
                    </section>
                </section>
            </Portal>
        );
    }

    static propTypes = {
        show: PropTypes.bool,
        onCloseButton: PropTypes.func,
        children: PropTypes.node,
        backdrop: PropTypes.bool,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        className: PropTypes.string,
        manageUiFix: PropTypes.bool.isRequired,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        scrollable: PropTypes.bool
    };

    static defaultProps = {
        show: false,
        children: <h1>Please, pass a children between the tags</h1>,
        backdrop: false,
        manageUiFix: true,
        size: 'sm'
    };
}