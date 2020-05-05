import React from 'react';

import {
    Row,
    Col,
    Grid,
    Modal,
    Button,
    Form,
    FormGroup,
    Radio,
    FormControl
} from '@sketchpixy/rubix';

import * as formUtils from '../../utils/FormUtils';

var Global = require('../../../common/global_constants');

import {openModalFix, closeModalFix} from '../../../common/uiUtils';

export default class RecruiterTeamAddModal extends React.Component {

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

    onAdd = (data) => {
        if (this.props.onAdd !== undefined){
            this.props.onAdd(data);
        }
    }

    render(){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        return(
            <div>
                <Modal bsSize="large" show={open} onHide={::this.closeModal}>
                    <Modal.Body>
                        <Grid className="recruiterReviewTalentModal">
                            <Row>
                                <Col xs={12} style={{textAlign:'right'}}>
                                    <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={() => this.closeModal()} >
                                        <i className="icon-entypo-cross fluttrDarkGrey"  />
                                    </a>
                                </Col>
                            </Row>
                            <Row style={{marginBottom:40}}>
                                <Col xs={10} xsOffset={1} className="text-center" style={{padding: '20px 40px 20px 40px'}}>
                                    <InviteNewForm onAdd={this.onAdd}/>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export class InviteNewForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                name: '',
                surname: '',
                email: ''
            },
            formValidation: {
                name: {
                    type: formUtils.REQUIRED_INPUT
                },
                surname: {
                    type: formUtils.REQUIRED_INPUT
                },
                email: {
                    type: formUtils.REQUIRED_EMAIL
                },
            },
            lastInvited: null
        };
    }

    add(){

        let valid = this.checkAll();

        if (valid){
            // console.log('update call api val : ' + this.state.form.description);
            let data = {
                name : this.state.form.name,
                surname : this.state.form.surname,
                email : this.state.form.email
            };

            if (this.props.onAdd !== undefined){
                this.props.onAdd(data);
            }

            this.setState({
                lastInvited : data.name + ' ' + data.surname,
                form : {
                    name: '',
                    surname: '',
                    email: ''
                }
            });
        }
    }

    handleChange(event){
        // console.log('handleChange');
        formUtils.handleInputChange(event, this, this.state.formValidation);
    }

    checkAll(){
        // console.log('check all note create/update');
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }

    render() {
        let styleInput = {
            height: '45px',
            fontSize: '1.2em',
        };

        let showLastInvited = false;
        if (this.state.lastInvited != null){
            showLastInvited = true;
        }

        return (
            <Form>
                <Grid className="text-left">
                    {showLastInvited &&
                    <Row style={{paddingBottom:'1.5em'}}>
                        <Col xs={12}>
                            <i className="icon-entypo-check fluttrGreen" style={{fontSize:'2em', marginRight:'1em'}}/> <span className="sectionTitleMedium">{this.state.lastInvited} was added to the Invitation list!</span>
                        </Col>
                    </Row>
                    }
                    <Row style={{paddingBottom:'2em'}}>
                        <Col xs={12}>
                            <span className="sectionTitle sectionTitlePopup">Add new team members</span>
                        </Col>
                    </Row>
                    <Row style={{paddingBottom:'1.5em'}}>
                        <Col xs={12}>
                            <FormGroup controlId="fluttr-name">
                                <FormControl style={styleInput} placeholder="First Name*" type='text' name="fluttr-name" onChange={this.handleChange.bind(this)} value={this.state.form.name}/>
                                <span id="nameError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row style={{paddingBottom:'1.5em'}}>
                        <Col xs={12}>
                            <FormGroup controlId="fluttr-surname">
                                <FormControl style={styleInput} placeholder="Last Name*" type='text' name="fluttr-surname" onChange={this.handleChange.bind(this)} value={this.state.form.surname}/>
                                <span id="surnameError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row style={{paddingBottom:'1.5em'}}>
                        <Col xs={12}>
                            <FormGroup controlId="fluttr-email">
                                <FormControl style={styleInput} placeholder="Email Address*" type='email' name="fluttr-email" onChange={this.handleChange.bind(this)} value={this.state.form.email}/>
                                <span id="emailError" className="form-field-error" style={{display:'none'}}>This email address is invalid</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <FormGroup className="text-right" style={{paddingTop:20}}>
                                <Button style={{minWidth:'4em'}} lg={true} bsStyle='fluttrOrange' onClick={() => this.add()}>Add to the list</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Grid>
            </Form>
        );
    }
}
