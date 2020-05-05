import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import * as ga from '../../../../constants/analytics';


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

import {unlockTemplate, getOpportunityTemplates, getTemplateForOpportunity} from '../../../../redux/actions/templateActions';
import {openModalFix, closeModalFix} from '../../../../common/uiUtils';

const API_ENDPOINTS = require('../../../../common/api_endpoints');
const Config = require('Config');

@connect((state) => state)
export default class OpportunityUnlockTemplateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            slots: 0
        };    
    }
    componentDidMount () {
    // this should be managed with redux
    
    }
  UnlockTemplate = () => {
      this.props.dispatch(unlockTemplate(this.props.opportunityId, this.props.templateId, this.onSaveOk, null));
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
        // console.log('closing modal')
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

        return (
            <div>
                <Modal bsSize="medium" lg show={open} onHide={this.closeModal} backdrop='static' dialogClassName='fluttr-modal-center'>
                    <Modal.Body style={{padding: '0px', borderRadius: '4px'}} className=''>
                        <Grid>
                            <Row>
                                <Col xs={12} className='modal-body button-container'>
                                    <h3>You have {this.state.slots} available</h3>
                                    <p>Are you sure that you want to unlock this template, after unlocking this the number of temaining templates slots will be {this.state.slots - 1}</p>
                                    <button onClick={this.UnlockTemplate} >Unlock</button>
                                    <button onClick={this.closeModal}>Go back</button>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }


}
