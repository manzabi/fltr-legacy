import React from 'react';
import { connect } from 'react-redux';

import {Modal,  Row, Col, Grid, Panel, PanelBody, PanelHeader, PanelFooter, Form,FormGroup,ControlLabel, FormControl, PanelContainer} from '@sketchpixy/rubix';

import {fetchSepaCountryList, validateBankInfo} from '../../../redux/actions/bankInfoActions';

import {triggerValidationError, formSubmissionHandler} from '../../../redux/actions/formActions';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import Button from 'react-bootstrap-button-loader';

import BankInfoHeader from './BankInfoHeader';


@connect((state) => state)
export default class BankInformationForm extends React.Component {

    constructor(props) {

        super(props);

        let holderValue = (props.bankInfo.item.holder) ? props.bankInfo.item.holder : '';
        let ibanValue = (props.bankInfo.item.iban) ? props.bankInfo.item.iban : '';
        let swiftCodeValue = (props.bankInfo.item.swift) ? props.bankInfo.item.swift : '';
        let countryValue = (props.bankInfo.item.country) ? props.bankInfo.item.country : 'ES';

        this.state = {
            holder : holderValue,
            swiftCode: swiftCodeValue,
            iban : ibanValue,
            country : countryValue,
            sepaCountries: [],
            userBankInfo: [],

            valid: props.bankInfo.valid,

            isLoading: false,

        };

        this.errorMap = new Map([
            ['BNKA002', 'iban'],
            ['BNKA003', 'holder'],
            ['BNKA004', 'swift'],
            ['BNKA005', 'country']]);



    }

    getValidationState() {
        const length = this.state.swiftCode.length;
        if ((length >= 8) && (length <= 11)) return 'success';
        else if (length >0 && ((length < 8) || (length > 11))) return 'error';
    }


    handleChange(e) {
        this.setState({ swiftCode: e.target.value });
    }

    handleIbanChange(e){

        //this.ibanInput.value = e.target.value.replace(/\s+/g, '');

        this.setState({ iban: e.target.value.replace(/\s+/g, '') });
    }


    componentWillReceiveProps(nextProps) {

        let root = this;

        let errors = {};


        if(nextProps.triggerValidationError.errorMap && nextProps.triggerValidationError.errorMap.length > 0){

            $.each(nextProps.validateBankInfo.item, function (i, input) {

                errors[root.errorMap.get(input.code)] = input.description;

            });

            var validator = $('#bank-info-form').validate();

            validator.showErrors(
                errors
            );
        }

        if(!nextProps.validateBankInfo.isFetching || nextProps.bankInfo.isFetching){

            root.setState({isLoading: false});

        }


    }

    componentDidMount(){

        if(this.props.sepaCountryList.item == null){
            this.props.dispatch(fetchSepaCountryList());
        }


        $('#bank-info-form').validate({
            errorClass: 'validation-error-class',
            // 1. validation rules.
            rules: {
                holder: {
                    required: true,
                    maxlength: 120
                },
                iban:{
                    required: true,
                    iban: true,
                    maxlength: 120
                },
                swift:{
                    required: true,
                    minlength: 8,
                    maxlength: 11
                },
                country:{
                    required: true
                }
            },
            messages: {
                iban: 'IBAN format invalid'
            },
            success: function(input){
                input.addClass('validation-ok-class');
            },
            submitHandler: function (form) {
                return false;
            },

        });


    }



    submitBankInfo(event) {
        event.preventDefault();
        // code you want to do

        let root = this;

        if ($('#bank-info-form').valid()) {

            root.setState({isLoading: true});

            var formObj = {};
            var inputs = $('#bank-info-form').serializeArray();
            $.each(inputs, function (i, input) {
                formObj[input.name] = input.value;
            });

            // console.log(JSON.stringify(formObj, null, 4));

            this.props.dispatch(validateBankInfo(formObj));

        }
    }


    render(){


        return (

            <Form id='bank-info-form' onSubmit={this.submitBankInfo.bind(this)}>

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
                                        <Row className="sectionInternal">
                                            <Col xs={12}>
                                                <FormGroup>
                                                    <span className="summarySubTitle"><Entity entity='bankInfoFormHolder'/></span>
                                                    <FormControl type='text' name="holder" defaultValue={this.state.holder} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <span className="summarySubTitle"><Entity entity='bankInfoFormIban'/></span>
                                                    <FormControl
                                                        type='text' name="iban"
                                                        value={this.state.iban}
                                                        onChange={::this.handleIbanChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <span className="summarySubTitle"><Entity entity='bankInfoFormSwift'/></span>

                                                    <FormControl
                                                        type="text"
                                                        name="swift"
                                                        onChange={::this.handleChange}
                                                        value={this.state.swiftCode}
                                                    />
                                                    <FormControl.Feedback />
                                                </FormGroup>


                                                <FormGroup controlId='country'>

                                                    <span className="summarySubTitle"> <Entity entity='bankInfoFormCountry'/></span>

                                                    <FormControl componentClass="select" defaultValue={this.state.country}
                                                        name="country" >

                                                        {this.props.sepaCountryList.item &&
                                                        this.props.sepaCountryList.item.map(function (sepa) {
                                                            return <option key={sepa.code}
                                                                value={sepa.code}>{sepa.value}</option>;
                                                        })
                                                        }
                                                    </FormControl>

                                                </FormGroup>


                                            </Col>
                                        </Row>
                                        <Row style={{textAlign: 'center',paddingTop:50}} className="sectionInternal">
                                            <Button lg={true} bsStyle="fluttrGreen" type="submit" loading={this.props.formSubmissionHandler.showLoader}>
                                                <Entity entity='bankInfoSave'/>
                                            </Button>
                                        </Row>
                                    </Grid>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>

            </Form>

        );

    }

}
