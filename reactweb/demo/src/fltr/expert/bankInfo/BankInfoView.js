import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Modal,
    Grid} from '@sketchpixy/rubix';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import BankInfoHeader from './BankInfoHeader';

import Button from 'react-bootstrap-button-loader';
import {triggerValidationError, formSubmissionHandler} from '../../../redux/actions/formActions';

@connect((state) => state)
export default class BankInfoView extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            showModal: false,
            actionTriggered: false

        };
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    onEditButtonPressed(){
        this.props.onChangeValid(true);
    }

    onDeleteBankInfo(){
        this.setState({actionTriggered : true});

        this.props.onDeleteBankInfo();
    }

    render(){

        // console.log("BANKINFOVIEW : "  + JSON.stringify(this.props.bankInfo));

        return (
            <Grid className="containerSection">
                <Row>
                    <Col lg={8} lgOffset={2} md={10} mdOffset={1} xs={12} className="nopaddingMobile">
                        <Row className="sectionBordered">
                            <Col xs={12}>
                                <span className="sectionTitle">Bank Information</span>
                            </Col>
                        </Row>

                        <Row className="sectionBorderedPaddingBottom">
                            <Col xs={12}>
                                <Grid>
                                    <BankInfoHeader />
                                    <Row className="sectionInternalSlim">
                                        <Col xs={12}>

                                            <span className="summarySubTitle"><Entity entity='bankInfoFormHolder'/></span>
                                            <br/>
                                            <span className="textStrong">{this.props.bankInfoToShow.holder}</span>

                                            <Modal show={this.state.showModal} onHide={::this.close}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title><Entity entity='bankInfoDeleteModalTitle'/></Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <h4><Entity entity='bankInfoDeleteModalBody'/></h4>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button className='button-distance' onClick={::this.close}>
                                                        Cancel
                                                    </Button>
                                                    <Button bsStyle='danger' onClick={::this.onDeleteBankInfo} loading={this.props.formSubmissionHandler.showLoader && this.state.actionTriggered}>
                                                        <Entity entity='genericDelete'/>
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                        </Col>
                                    </Row>
                                    <Row className="sectionInternalSlim">
                                        <Col xs={12}>
                                            <span className="summarySubTitle"><Entity entity='bankInfoFormIban'/></span>
                                            <br/>
                                            <span className="textStrong">{this.props.bankInfoToShow.iban}</span>
                                        </Col>
                                    </Row>
                                    <Row className="sectionInternalSlim">
                                        <Col xs={12}>
                                            <span className="summarySubTitle"><Entity entity='bankInfoFormSwift'/></span>
                                            <br/>
                                            <span className="textStrong">{this.props.bankInfoToShow.swift}</span>
                                        </Col>
                                    </Row>
                                    <Row className="sectionInternalSlim">
                                        <Col xs={12}>
                                            <span className="summarySubTitle"><Entity entity='bankInfoFormCountry'/></span>
                                            <br/>
                                            <span className="textStrong">{this.props.bankInfoToShow.country}</span>
                                        </Col>
                                    </Row>

                                    <Row style={{textAlign: 'center',paddingTop:50}} className="sectionInternal">
                                        <Button lg={true} bsStyle='fluttrLightGrey'  onClick={::this.open}>
                                            <Entity entity='genericDelete'/>
                                        </Button>


                                        <Button lg={true} bsStyle='fluttrOrange' className='button-distance' onClick={::this.onEditButtonPressed} >
                                            <Entity entity='genericEdit'/>
                                        </Button>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );

    }

}
