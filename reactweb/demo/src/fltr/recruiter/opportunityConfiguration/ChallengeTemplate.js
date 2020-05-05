import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {getAllSeniorityLevels} from '../../../constants/senioritylevel';

var Config = require('Config');
const allSeniorityLevels = getAllSeniorityLevels();
import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Form,
    FormGroup,
    FormControl,
    Image
} from '@sketchpixy/rubix';

import * as formUtils from '../../utils/FormUtils';
import ChallengeEditor from './ChallengeEditor';

@connect((state) => state)
export default class ChallengeTemplate extends React.Component{

    constructor(props) {
        super(props);

        let title = '';
        if (props.title !== undefined){
            title = props.title;
        }

        let description = '';
        if (props.description !== undefined){
            title = props.description;
        }

        let seniorityLevel = 0;
        if (props.seniorityLevel !== undefined){
            seniorityLevel = props.seniorityLevel;
        }

        let contentChallenge = '';
        if (props.contentChallenge !== undefined){
            contentChallenge = props.contentChallenge;
        }

        // console.log('value : ' + props.value);
        this.state = {
            form: {
                title: title,
                description: description,
                content: contentChallenge,
                seniorityLevel: seniorityLevel
            },
            formValidation: {
                title: {
                    type: formUtils.REQUIRED_INPUT
                },
                description: {
                    type: formUtils.REQUIRED_INPUT
                },
                seniorityLevel: {
                    type: formUtils.REQUIRED_INPUT
                },
                content: {
                    type: formUtils.REQUIRED_INPUT,
                    selector: '#content .demo-editor',
                    selectorLabel : '#descriptionError'
                }
            }
        };

    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    getValue(field){
        // console.log('field ' + field + ' value: ' + this.state.form[field])
        return this.state.form[field];
    }

    getTitle(){
        return this.state.form.title;
    }

    handleChange(event){
        // console.log('handleChange');
        formUtils.handleInputChange(event, this, this.state.formValidation);
    }
    handleCheckSelect(event){
        formUtils.handleSelectChange(event, this, this.state.formValidation);
    }
    handleContentChange(val) {
        formUtils.handleValueChange(val, 'content',this,  this.state.formValidation);
        // console.log('handleContentChange');
    }

    checkAll(){
        // console.log('check all note create/update');
        // console.log('description : ' + this.state.form.description);
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }

    render(){

        return(
            <div className="challengeNormal">
                <div>
                    <Row className="sectionInternal">
                        <Col xs={12}>
                            <h1 className="challenge-form-label label-padding">Title
                                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Choose something simple and connected to the task to be accomplished!</Tooltip>}>
                                    <i className="icon-entypo-info-with-circle challenge-form-info-icon" />
                                </OverlayTrigger>
                            </h1>
                            <FormGroup controlId="title">
                                <FormControl componentClass="input" onChange={this.handleChange.bind(this)} value={this.state.form.title} autoFocus/>
                                <span id="titleError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="sectionInternal">
                        <Col xs={12}>
                            <h1 className="challenge-form-label label-padding">Description
                                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Short description for the template</Tooltip>}>
                                    <i className="icon-entypo-info-with-circle challenge-form-info-icon" />
                                </OverlayTrigger>
                            </h1>
                            <FormGroup controlId="description">
                                <FormControl componentClass="textarea" onChange={this.handleChange.bind(this)} value={this.state.form.description}/>
                                <span id="titleError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="sectionInternal">
                        <Col xs={12}>
                            <h1 className="challenge-form-label label-padding">Seniority lebel
                                <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Short description for the template</Tooltip>}>
                                    <i className="icon-entypo-info-with-circle challenge-form-info-icon" />
                                </OverlayTrigger>
                            </h1>
                            <FormGroup controlId="seniorityLevel">
                                <FormControl componentClass="select" placeholder="select" value={this.state.form.seniorityLevel} onChange={this.handleCheckSelect.bind(this)}>
                                    {allSeniorityLevels.map((level) => <option key={level.id} value={level.id}>{level.description}</option>)}
                                </FormControl>
                                <span id="titleError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} id="content">
                            <FormGroup controlId="content">
                                <ChallengeEditor placeholder="Enter the test here. You can also attach an image (recommended) and a file if you need." value={this.props.contentChallenge} textareaId="formControlsTextarea" onChange={this.handleContentChange.bind(this)}/>
                                <span id="descriptionError" className="form-field-error" style={{display:'none'}}>This field is required</span>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }


}
