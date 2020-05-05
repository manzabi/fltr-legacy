import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Form,
    FormControl,
    FormGroup,
    Modal,
    DropdownButton,
    MenuItem
} from '@sketchpixy/rubix';

import * as formUtils from '../../utils/FormUtils';

import Button from 'react-bootstrap-button-loader';
import StarRatingComponent from 'react-star-rating-component';

import {reviewCv, updateCv} from '../../../redux/actions/recruiterOpportunityActions';

var Global = require('../../../common/global_constants');

import {openModalFix, closeModalFix} from '../../../common/uiUtils';

@connect((state) => state)
export default class OpportunityConfigurationConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : false
        };
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

    closeModal(){
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }
    
    confirm(){
        this.setState({
            loading : true
        });

        if (this.props.onSave !== undefined){
            this.props.onSave();
        }

        this.closeModal();
    }

    render(){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        return(
            <div>
                <Modal bsSize="large" show={open} onHide={::this.closeModal}>
                    <Modal.Body>
                        <Grid className="opportunityConfigurationConfirmModal">
                            <Row>
                                <Col xs={12} style={{textAlign:'right'}}>
                                    <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={() => this.closeModal()} >
                                        <i className="icon-entypo-cross fluttrDarkGrey"  />
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="text-center" style={{padding: '20px 40px 20px 40px'}}>
                                    <span className="modalTitle">Ready to submit this challenge?</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} xsOffset={3} className="text-center">
                                    <div className="img-wrapper">
                                        <img src="/imgs/app/configuration/confirmation_submit.gif" />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6} xsOffset={3} className="text-center">
                                    <h2>Don’t worry! After clicking "Submit", you will still be able to make changes!</h2>
                                </Col>
                            </Row>
                            <Row className="sectionInternal text-center">
                                <Col xs={12}>
                                    <Button className="btn-lg"  bsStyle="fluttrOrange" onClick={() => this.confirm()} loading={this.state.loading}>
                                        Submit Now
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={4} xsOffset={4} className="text-center" style={{padding: '0px 40px 20px 40px'}}>
                                    <h3 className="modalTitle">This is you moment of glory.</h3>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

