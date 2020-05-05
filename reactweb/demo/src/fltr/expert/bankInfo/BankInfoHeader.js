import React from 'react';

import {
    Button,
    Modal,
    Row,
    Col,
    Grid} from '@sketchpixy/rubix';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

export default class BankInfoHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    render(){
        return (
            <Row className="sectionInternal">
                <Col xs={12}>
                    <span className="summarySubTitle"><Entity entity='bankInfoViewHeadlineFirst'/></span>
                    <br/><br/>
                    <span className="summarySubTitle"><Entity entity='bankInfoViewHeadlineSecond'/></span>

                    <a className="fluttr" href="#" onClick={::this.open} >{' '}
                        <Entity entity='bankInfoViewMoreInfo'/>
                    </a>

                    <Modal show={this.state.showModal} onHide={::this.close}>
                        <Modal.Header closeButton>
                            <Modal.Title><Entity entity='bankInfoAboutSepa'/></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4><Entity entity='bankInfoSepaMoreInfoFirst'/></h4>
                            <h4><Entity entity='bankInfoSepaMoreInfoSecond'/></h4>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={::this.close}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        );
    }
}