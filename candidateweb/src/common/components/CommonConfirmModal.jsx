import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import ModalComponent from './ModalComponent';
import FluttrButton from './FluttrButton';

// import {openModalFix, closeModalFix} from '../../common/uiUtils';


/**
 * @param acceptText: PropTypes.string || 'Accept'
 * @param rejectText: PropTypes.string || 'Cancel'
 * @param confirmTitle: PropTypes.string || undefined
 * @param onConfirm: PropTypes.func.isRequired
 * @param onReject: PropTypes.func
 * @param showReject: PropTypes.bool || true
 * @param open: PropTypes.bool.isRequired
 * @param children: PropTypes.element
 * @param backdrop: PropTypes.bool || false
 * @param loading: PropTypes.bool || false
 * @param verticalButtons: PropTypes.bool || false
 * @param buttonSize: PropTypes.string || undefined

    acceptText: 'Accept',
    rejectText: 'Cancel',
    showReject: true,
 */
@connect((state) => state)
export default class CommonConfirmModal extends Component {
    componentWillReceiveProps(nextProps) {
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open) {
            // is opening, disable scrollbar main content
            // console.log('opening modal')
            // openModalFix();
        }
        // console.log(nextProps)
        // console.log(nextProps.giftText)
    }

    closeModal = () => {
        // closeModalFix();
        if (this.props.onReject) {
            this.props.onReject();
        }
    }

    onSaveOk = () => {
        if (this.props.handleLoad) {
            this.props.handleLoad(() => {
                // closeModalFix();
                this.props.onConfirm();
            });
        } else {
            // closeModalFix();
            this.props.onConfirm();
        }
    }

    render() {

        const { confirmTitle, acceptText, rejectText, backdrop, open, onClose, verticalButtons } = this.props;
        return (
            <div>
                <ModalComponent open={open} backdrop={backdrop} onClose={onClose} >
                    <div>
                        {confirmTitle === undefined &&
                        <div>
                            {this.props.children}
                        </div> ||
                        <div>
                            <h2 className='generic-modal-title'>{confirmTitle}</h2>
                        </div>
                        }
                        <div className={`modal-buttons-container${verticalButtons ? '-vertical' : ''}`}>
                            {this.props.showReject &&
                            <FluttrButton size={this.props.buttonSize} type='link' action={this.closeModal}>{rejectText}</FluttrButton>
                            }
                            <FluttrButton size={this.props.buttonSize}  disabled={false} action={this.onSaveOk}>{acceptText}</FluttrButton>
                        </div>
                    </div>
                </ModalComponent>
            </div>
        );
    }
    
    static propTypes = {
        acceptText: PropTypes.string,
        rejectText: PropTypes.string,
        confirmTitle: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onReject: PropTypes.func,
        showReject: PropTypes.bool,
        open: PropTypes.bool.isRequired,
        children: PropTypes.element,
        backdrop: PropTypes.bool,
        loading: PropTypes.bool,
        verticalButtons: PropTypes.bool,
        buttonSize: PropTypes.string
    };
    
    static defaultProps = {
        backdrop: false,
        confirmTitle: undefined,
        acceptText: 'Accept',
        rejectText: 'Cancel',
        showReject: true,
        loading: false,
        verticalButtons: false,
        buttonSize: undefined
    };
}
