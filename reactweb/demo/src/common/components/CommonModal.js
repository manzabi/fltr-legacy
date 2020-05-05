import React, {Component} from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import {
    Row,
    Col,
    Grid,
    Modal
} from '@sketchpixy/rubix';

import {openModalFix, closeModalFix} from '../uiUtils';

/**
 * @param open: PropTypes.bool.isRequired,
 * @param children: PropTypes.node.isRequired,
 * @param backdrop: PropTypes.bool,
 * @param onClose: PropTypes.func.isRequired,
 * @param showClose: PropTypes.bool.isRequired
 */

@connect((state) => state)
export default class CommonModal extends Component {
    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open){
            // is opening, disable scrollbar main content
            // console.log('opening modal')
            openModalFix();
        }
    }

    closeModal = () => {
        closeModalFix();
        if(this.props.onClose) {
            this.props.onClose();
        }
    }

    render(){

        const {backdrop, open, showClose} = this.props;
        return (
            <div className='fluttr-common-modal'>
                <Modal bsSize="medium" lg show={open} onHide={this.closeModal} backdrop={backdrop ? true : 'static'}>
                    <Modal.Body style={{padding: '0px', borderRadius: '4px'}}>
                        <Grid>
                            <Row>
                                {showClose && 
                                <Col xs={12} style={{textAlign:'right', marginTop: '10px'}}>
                                    <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={this.closeModal} >
                                        <i className="icon-entypo-cross fluttrDarkGrey"  />
                                    </a>
                                </Col>
                                }
                                <Col xs={12} className='modal-body fluttr-generic-modal button-container'>
                                    { this.props.children &&
                                        this.props.children ||
                                        <h1>You need to add a children node to render, otherwise this it's useless</h1>
                                    }    
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

CommonModal.PropTypes = {
    open: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    backdrop: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    showClose: PropTypes.bool.isRequired
};

CommonModal.defaultProps = {
    backdrop: true,
    open: false,
    showClose: false
};