import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Form,
    FormControl,
    FormGroup,
    Modal,
    Button,
    DropdownButton,
    MenuItem
} from '@sketchpixy/rubix';

import {openModalFix, closeModalFix} from '../../../../common/uiUtils';

import * as formUtils from '../../../utils/FormUtils';
import FeedReplyWriteComponent from '../../../feed/FeedReplyWriteComponent';

var Global = require('../../../../common/global_constants');

@connect((state) => state)
export default class ExpertPublicFeedbackModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            form: {
                description: ''
            },
            formValidation: {
                description: {
                    type: formUtils.REQUIRED_INPUT
                },
            }
        };
    }

    handleChange(event){
        formUtils.handleInputChange(event, this, this.state.formValidation);
    }

    checkAll(){
        // console.log('check all note create/update');
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open){
            // is opening, disable scrollbar main content
            openModalFix();
        }
    }

    closeModal = () => {
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }

    render(){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        let textAreaStyle = {
            padding: '5px 10px'
        };

        return(
            <div>
                <Modal bsSize="medium" show={open} onHide={this.closeModal}>
                    <Modal.Body style={{padding: '0px', border: '4px solid #42bffe', borderRadius: '4px'}}>
                        <Grid className="expert-public-feedback-modal">
                            <Row>
                                <Col xs={12} className='modal-header'>
                                    <a className='modal-close' style={{cursor:'pointer',fontSize:'1.5em'}} onClick={() => this.closeModal()} >
                                        <i className="icon-entypo-cross fluttrDarkGrey"  />
                                    </a>
                                    <h3 className='fluttr-header-small'>
                                        {`Write to ${this.props.reviewUser.item.user.nickname}`}
                                    </h3>
                                    <p className='fluttr-text-small'>
                                        Ask more info, leave a feedback or congratulate.
                                    </p>
                                </Col>
                                <Col xs={12} className='modal-body'>
                                    <FeedReplyWriteComponent hideFeedback={this.props.hideFeedback} onClose={this.closeModal} id={this.props.feed.id} placeholder='Write here...'/>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }


}
