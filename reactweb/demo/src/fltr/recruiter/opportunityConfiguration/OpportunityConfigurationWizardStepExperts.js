import React from 'react';
import { connect } from 'react-redux';

import * as ga from '../../../constants/analytics';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Modal,
    Checkbox,
    Form,
    FormGroup,
    Radio,
    FormControl
} from '@sketchpixy/rubix';

import {
    getOpportunityConfigurationDetail,
    saveOpportunityConfigurationExpert
} from '../../../redux/actions/recruiterOpportunityActions';
import {checkUserUpdate} from '../../../redux/actions/userActions';
import AsynchContainer from '../../template/AsynchContainer';
import PanelContainer, {PanelContainerContent} from '../../template/PanelContainer';
import * as opportunityJudgeType from '../../../constants/opportunityJudgeType';
import {manageErrorMessage, manageError} from '../../../common/utils';

const MAX_INTERNAL_JUDGES = opportunityJudgeType.MAX_INTERNAL_JUDGES;

function InvitedJudge(picture, name, surname, mail){
    this.picture = picture;
    this.name = name;
    this.surname= surname;
    this.mail= mail;
}

var Global = require('../../../common/global_constants');

@connect((state) => state)
export default class OpportunityConfigurationWizardStepExperts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            invitedJudges: [],
            invitedJudgesNumber: 0,
            inviteMyselfChecked: false,
            showProceedModal: false,
            isPendingJudgeInvite: false,
            isMessageInvitation: true
        };

    }

    componentDidMount() {
        this.enableFormValidation();
        ga.track(ga.OPPORTUNITY_CHALLENGE_INVITE_EXPERTS_START);
    }

    enableFormValidation = () => {
        $.validator.addMethod('emailtld', function(val, elem){
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if(!filter.test(val)) {
                return false;
            } else {
                return true;
            }
        }, 'Please enter a valid email address.');

        $('#judge-invitation-form').validate({
            errorClass: 'validation-error-class',
            // 1. validation rules.
            rules: {
                mail: {
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
                $(form).find(':input').each(function() {
                    switch(this.type) {
                    case 'password':
                    case 'select-multiple':
                    case 'select-one':
                    case 'text':
                    case 'textarea':
                        $(this).val('');
                        break;
                    case 'checkbox':
                    case 'radio':
                    case 'email':
                        $(this).val('');
                        break;
                    }
                });
            }
        });
    }

    handleCheckBoxInternalJudge = (e) => {
        this.changeMySelf(e.target.checked);
    }

    changeMySelf = (value) => {
        this.setState({inviteMyselfChecked: value});
        this.handleJudgesNumber(value);
    }

    removeMySelf = () => {
        this.changeMySelf(false);
    }

    getMySelfExpertObject = () => {
        let user = this.props.user.item;
        return new InvitedJudge(user.imageUrl, user.name, user.surname,'You');
    }

    handleJudgesNumber = (isIncrease) => {
        let invitedJudgesNumber = this.state.invitedJudgesNumber;
        if(isIncrease){
            invitedJudgesNumber++;
        }else{
            invitedJudgesNumber--;
        }
        this.setState({invitedJudgesNumber: invitedJudgesNumber});
    }

    removeJudge = (judge) => {
        let invitedJudges = this.state.invitedJudges;
        let index = invitedJudges.indexOf(judge);

        if(index>=0){
            invitedJudges.splice(index, 1);
        }

        this.setState({invitedJudges: invitedJudges});
        this.handleJudgesNumber(false);

    }

    submitJudgeInvitation = (event) =>  {
        event.preventDefault();
        // code you want to do

        if ($('#judge-invitation-form').valid()) {

            let formObj = {};
            let inputs = $('#judge-invitation-form').serializeArray();
            $.each(inputs, function (i, input) {
                formObj[input.name] = input.value;
            });

            let invitedJudges = this.state.invitedJudges;
            let judge = new InvitedJudge('', formObj['name'], formObj['surname'], formObj['mail']);

            if (invitedJudges.filter(e => e.mail == judge.mail).length > 0) {
                manageErrorMessage('expert-add-error', 'Expert already added');
            }else{
                invitedJudges.push(judge);
                this.setState({invitedJudges: invitedJudges});
                this.handleJudgesNumber(true);
            }
        }
    }

    checkInvitations = () => {

        // check invitation number (1,3)
        if(this.state.invitedJudgesNumber > 3){
            manageErrorMessage('expert-add-error', 'You can select only 3 experts for the challenge');
            return;
        }else if(this.state.invitedJudgesNumber < 1){
            manageErrorMessage('expert-add-error', 'At least one expert is required for the challenge');
            return;
        }
        ga.track(ga.OPPORTUNITY_CHALLENGE_INVITE_EXPERTS_END);

        // get values from form
        let formObj = {};
        let inputs = $('#judge-invitation-form').serializeArray();
        $.each(inputs, function (i, input) {
            formObj[input.name] = input.value;
        });
        // console.log('form : ' + JSON.stringify(formObj));

        // if one field is not empty
        let isPendingJudgeInvite = false;
        if (formObj['name'] != '' || formObj['surname'] != '' || formObj['mail'] != ''){
            isPendingJudgeInvite = true;
        }

        // only one expert and his itself, the invitation part of the popup should be hide
        let isMessageInvitation = true;
        if (this.state.invitedJudgesNumber == 1 && this.state.inviteMyselfChecked){
            isMessageInvitation = false;
        }

        if(this.state.invitedJudgesNumber == 3){
            this.proceed();
        } else {
            if (isPendingJudgeInvite){
                this.setState({
                    isPendingJudgeInvite: isPendingJudgeInvite,
                    isMessageInvitation: isMessageInvitation
                }, function() {
                    this.setState({showProceedModal: true});
                });
            } else {
                this.proceed();
            }
        }
    }

    goToNextStep = (event) => {
        event.preventDefault();
        // check and go forward
        this.checkInvitations();
    }

    close = () => {
        this.setState({ showProceedModal: false });
    }

    getId = () =>{
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }
        return id;
    }

    proceed = () => {
        let id = this.getId();
        let requestObject = {};

        requestObject['external'] = false;
        requestObject['internal'] = true;
        requestObject['internalJudges'] = this.state.invitedJudges;
        requestObject['selfJudge'] = this.state.inviteMyselfChecked;

        this.props.dispatch(saveOpportunityConfigurationExpert(requestObject, id, this.onSaveOk, this.onSaveError));
    }

    onSaveOk = () => {
        let id = this.getId();
        this.props.dispatch(checkUserUpdate(this.props.userStatus , true));
        this.props.dispatch(getOpportunityConfigurationDetail(id));
    }

    onSaveError = (error) => {
        const message = 'You have not available slots. Upgrade your plan to unlock new slots';
        manageError(error, 'noSlots');
    }

    render(){
        let id = this.getId();
        let objectStored = this.props.recruiterOpportunityConfigurationDetail;
        let invitedJudges = this.state.invitedJudges;

        return (
            <div className="opportunityConfigurationWizardStepExperts">
                <AsynchContainer native={true} data={objectStored} manageError={false}>
                    <PanelContainer marginTop={false} className="opportunityConfigurationWizardStepExpertsContent containerMaxSize" padding={false} back={false} size="big">
                        <PanelContainerContent padding={true} style={{marginTop: 10}}>
                            <Form id='judge-invitation-form' onSubmit={this.submitJudgeInvitation}>
                                <Grid>
                                    <Row>
                                        <Col xs={12} className="text-center nopaddingMobile">
                                            <span className="sectionTitleStrong">Invite your experts to evaluate the candidates</span>
                                        </Col>
                                    </Row>
                                    <Row className="containerSection">
                                        <Col xs={12} className="text-center">
                                            <span className="summarySubTitleStrong">
                                                <i style={{marginRight:10}} className="icon-entypo-graduation-cap fluttrGreen" ></i> Invite between 1 to 3 experts on the job part of your organisation or that you know. They will evaluate the candidates' responses to this challenge.
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <FormGroup>
                                                <Grid>
                                                    <Row className="containerSection">
                                                        <Col xs={12}>
                                                            <Checkbox checked={this.state.inviteMyselfChecked}
                                                                onChange={this.handleCheckBoxInternalJudge}
                                                                disabled={((this.state.invitedJudgesNumber >= MAX_INTERNAL_JUDGES) && (!this.state.inviteMyselfChecked))}>

                                                                <span className="summarySubTitle">Add me as an expert to evaluate this challenge</span>
                                                            </Checkbox>
                                                        </Col>
                                                    </Row>

                                                    <Row style={{paddingTop:20}}>
                                                        <Col xs={7}>
                                                            <div className="invitation-container">
                                                                <FormGroup>
                                                                    <FormControl placeholder="First Name*" type='text' name="name" defaultValue="" disabled={this.state.invitedJudgesNumber >= MAX_INTERNAL_JUDGES}/>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormControl placeholder="Last Name*" type='text' name="surname" disabled={this.state.invitedJudgesNumber >= MAX_INTERNAL_JUDGES} />
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormControl placeholder="Email Address*" type='email' name="mail" required="" data-rule-emailtld="true"
                                                                        disabled={this.state.invitedJudgesNumber >= MAX_INTERNAL_JUDGES}/>
                                                                </FormGroup>

                                                                <FormGroup className="fluttrBlue" style={{paddingTop:20}}>
                                                                    <Button bsStyle='fluttrBlue' type="submit"
                                                                        disabled={this.state.invitedJudgesNumber >= MAX_INTERNAL_JUDGES}>Invite</Button>
                                                                </FormGroup>
                                                            </div>
                                                        </Col>
                                                        <Col xs={5}>
                                                            <Grid className="noPadding">
                                                                {this.state.inviteMyselfChecked &&
                                                                    <InvitedExpert data={this.getMySelfExpertObject()} onRemoveExpert={this.removeMySelf} />
                                                                }
                                                                {invitedJudges.map((judge) =>
                                                                    <InvitedExpert data={judge} onRemoveExpert={this.removeJudge} />
                                                                )}
                                                            </Grid>
                                                        </Col>
                                                    </Row>

                                                    <Row style={{paddingTop:40}} className="sectionInternal text-right">
                                                        <button className='btn-fluttr btn-green' onClick={this.goToNextStep}> Next </button>
                                                    </Row>

                                                </Grid>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Form>
                        </PanelContainerContent>
                    </PanelContainer>
                    <div>
                        <Modal show={this.state.showProceedModal} onHide={() => this.close()}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    <span>Invite the experts to your challenge</span>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div  style={{padding:'10px 20px'}}>
                                    <h4>
                                        {this.state.isPendingJudgeInvite &&
                                        <p><b>You filled the form but not invited your last expert. Are you really sure you want to proceed?</b></p>
                                        }
                                        {this.state.isMessageInvitation &&
                                        <p>
                                            We are sending an invitation to all the experts you invited. They will accept your invitation to collaborate and they will be ready to help you evaluate the talent of your candidates!
                                        </p>
                                        }
                                        {!this.state.isMessageInvitation &&
                                        <p>
                                            You will be the only expert for this challenge. <br/>
                                            If you need help later you can invite other experts to this challenge!
                                        </p>
                                        }
                                    </h4>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className='button-distance' bsStyle="link" onClick={() => this.close()}>
                                    Cancel
                                </Button>
                                <Button className='button-distance' bsStyle="fluttrOrange" onClick={() => this.proceed()}>
                                    Proceed
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </AsynchContainer>
            </div>
        );
    }
}

class InvitedExpert extends React.Component {
    removeExpert(expert){
        if (this.props.onRemoveExpert){
            this.props.onRemoveExpert(expert);
        }
    }

    render(){
        let expert = this.props.data;
        let isPicture = false;
        if (expert.picture != ''){
            isPicture = true;
        }
        return (
            <Row key={expert.id} className="vertical-align invitation-user">
                <Col xs={2} className="noPadding vertical-flex">
                    <div>
                        {isPicture &&
                            <img src={expert.picture} width='30' height='30' className="img-rounded"/>
                        }
                        {!isPicture &&
                            <div className="picture-placeholder">
                                <i className="icon-entypo-user" />
                            </div>
                        }
                    </div>
                </Col>
                <Col xs={9} className="noPadding vertical-flex vertical-flex-align-left">
                    <div style={{margin:'0 5px'}} className="invitation-user-wrapper">
                        <div className="invitation-user-name">{expert.name} {expert.surname}</div>
                        <div className="invitation-user-email">{expert.mail}</div>
                    </div>
                </Col>
                <Col xs={1} className="noPadding vertical-flex">
                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'><strong>Remove</strong> invitation</Tooltip>}>
                        <a onClick={()=> this.removeExpert(expert)} style={{cursor:'pointer', marginRight:10}}>
                            <i className="icon-entypo-cross fluttrRed" style={{fontSize:'1.5em'}}/>
                        </a>
                    </OverlayTrigger>
                </Col>
            </Row>
        );
    }
}
