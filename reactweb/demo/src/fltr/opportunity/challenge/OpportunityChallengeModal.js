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
    Button,
    DropdownButton,
    MenuItem
} from '@sketchpixy/rubix';

import {openModalFix, closeModalFix} from '../../../common/uiUtils';
import OpportunityChallengeShow from './OpportunityChallengeShow';

var Global = require('../../../common/global_constants');

@connect((state) => state)
export default class OpportunityChallengeModal extends React.Component {

    constructor(props) {
        super(props);

    }

    getId(){
        return this.props.id;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open){
            // console.log('open modal');
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

    render(){
        let id = this.getId();
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        return(
            <div>
                <Modal bsSize="large" show={open} onHide={::this.closeModal}>
                    <Modal.Body>
                        <Grid className="opportunityChallengeModal">
                            <Row>
                                <Col xs={12} style={{textAlign:'right'}}>
                                    <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={() => this.closeModal()} >
                                        <i className="icon-entypo-cross fluttrDarkGrey"  />
                                    </a>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} style={{padding: '20px 10px 20px 10px'}}>
                                    <OpportunityChallengeShow id={id} showWrapper={false}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Button bsStyle="fluttrGreen" style={{display: 'block', margin: 'auto'}} lg={true} onClick={::this.closeModal}>Close</Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>

            </div>
        );
    }


}
