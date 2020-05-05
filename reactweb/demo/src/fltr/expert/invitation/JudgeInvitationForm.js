import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Form,
    FormGroup,
    FormControl
} from '@sketchpixy/rubix';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import {putJudgeInvitation} from '../../../redux/actions/judgeInvitationActions';

import Button from 'react-bootstrap-button-loader';


@connect((state) => state)
export default class JudgeInvitationForm extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount(){
        $('#judge-invitation-form').validate({
            errorClass: 'validation-error-class',
            // 1. validation rules.
            rules: {
                mail: {
                    email: true,
                    required: true,
                },
                name:{
                    required: true,
                    maxlength: 120
                },
                surname:{
                    required: true,
                    maxlength: 120
                }
            },
            submitHandler: function (form) {
                return false;
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.judgeInvitationSummary.item.invitation < this.props.invitationLeft) {
            $('#judge-invitation-form')[0].reset();
        }
    }


    submitJudgeInvitation(event) {
        event.preventDefault();
        // code you want to do

        if ($('#judge-invitation-form').valid()) {

            var formObj = {};
            var inputs = $('#judge-invitation-form').serializeArray();

            // console.log("inputs: " + JSON.stringify(inputs, null, 4));


            $.each(inputs, function (i, input) {
                formObj[input.name] = input.value;
            });

            // console.log(JSON.stringify(formObj, null, 4));

            this.props.dispatch(putJudgeInvitation(formObj));

        }
    }


    render(){
        return (
            <Form id='judge-invitation-form' onSubmit={this.submitJudgeInvitation.bind(this)} >
                <Row className="sectionInternal">
                    <Col xs={12}>
                        <span className="summarySubTitle"><Entity entity='judgeInvitationHeader' /></span>
                    </Col>
                </Row>
                <Row className="sectionInternal" style={{paddingTop:40}}>
                    <Col xs={12} md={6}>
                        <FormGroup>
                            <FormControl type='text' name="name" placeholder="First Name" disabled={this.props.formDisabled} defaultValue=""/>
                        </FormGroup>
                    </Col>
                    <Col xs={12} md={6}>
                        <FormGroup>
                            <FormControl type='text' name="surname" placeholder="Surname" disabled={this.props.formDisabled}/>
                        </FormGroup>
                    </Col>
                    <Col xs={12} md={12}>
                        <FormGroup>
                            <FormControl type='text' name="mail" placeholder="Email" disabled={this.props.formDisabled}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row style={{textAlign: 'center',paddingTop:50}} className="sectionInternal">
                    <Button lg={true} bsStyle="fluttrGreen" type="submit" disabled={this.props.formDisabled} loading={this.props.formSubmissionHandler.showLoader}>
                        <Entity entity='judgeInvitationInviteButtonText'/>
                    </Button>
                </Row>
            </Form>

        );

    }

}
