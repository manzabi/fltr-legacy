import React, {Component} from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

// import * as ga from '../../../constants/analytics';

import {
    Row,
    Col,
    Grid,
    Modal
} from '@sketchpixy/rubix';

import {openModalFix, closeModalFix} from '../../common/uiUtils';

/**
 * @param confirmTitle: PropTypes.string,
 * @param onConfirm: PropTypes.func.isRequired,
 * @param onReject: PropTypes.func,
 * @param showReject: PropTypes.bool,
 * @param open: PropTypes.bool.isRequired,
 * @param children: PropTypes.element,
 * @param backdrop: PropTypes.bool,
 * @param loading: PropTypes.bool
 */
@connect((state) => state)
export default class CommonConfirmModal extends Component {
    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open){
            // is opening, disable scrollbar main content
            // console.log('opening modal')
            openModalFix();
        }
        // console.log(nextProps)
        // console.log(nextProps.giftText)
    }

    closeModal = () => {
        closeModalFix();
        if(this.props.onReject) {
            this.props.onReject();
        }
    }

    onSaveOk = () => {
        if (this.props.handleLoad) {
            this.props.handleLoad(() => {
                closeModalFix();
                this.props.onConfirm();
            });
        } else {
            closeModalFix();
            this.props.onConfirm();
        }
    }

    render(){

        const {confirmTitle, acceptText, rejectText, backdrop, open} = this.props;
        return (
            <div>
                <Modal bsSize="medium" lg show={open} onHide={this.closeModal} backdrop={backdrop ? true : 'static'}>
                    <Modal.Body style={{padding: '0px', borderRadius: '4px'}}>
                        <Grid>
                            <Row>
                                <Col xs={12} className='modal-body fluttr-generic-modal button-container'>
                                    { confirmTitle === undefined &&
                                        <div>
                                            {this.props.children}
                                        </div> ||
                                        <div>
                                            <h2 className='generic-modal-title'>{confirmTitle}</h2>
                                        </div>
                                    }
                                    <div>
                                        { this.props.showReject && 
                                            <button className='btn-fluttr btn-link' onClick={this.closeModal}>{rejectText}</button>
                                        }
                                        <button
                                            className={`btn-fluttr btn-green ${this.props.loading ? 'loading' : ''}`}
                                            disabled={this.props.loading}
                                            onClick={this.onSaveOk}
                                        >
                                            {acceptText}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

CommonConfirmModal.PropTypes = {
    confirmTitle: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func,
    showReject: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    children: PropTypes.element,
    backdrop: PropTypes.bool,
    loading: PropTypes.bool
};

CommonConfirmModal.defaultProps = {
    backdrop: false,
    confirmTitle: undefined,
    acceptText: 'Accept',
    rejectText: 'Cancel',
    showReject: true,
    loading: false
};