import React from 'react';
import { connect } from 'react-redux';

import {
    Grid,
    Row,
    Col,
    Button,
    FormGroup,
    FormControl,
} from '@sketchpixy/rubix';
import {configureHoursTalent} from '../../../redux/actions/recruiterOpportunityActions';
import {manageError} from '../../../common/utils.js';

@connect((state) => state)
export default class ChallengeHoursTalentDropDown extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            selectedValue : 168,
            saved : false
        };
    }

    componentDidMount(){
        this.selectOriginalValue();
    }

    selectOriginalValue(){
        this.setState({
            selectedValue : this.getHoursSubmissionByConfiguration()
        });
    }

    getId(){
        return this.props.id;
    }

    getConfigurationData(){
        return this.props.configuration;
    }

    getHoursSubmissionByConfiguration(){
        console.log('--------------------------------------');
        console.log(this.getConfigurationData());
        let configuration = this.getConfigurationData();
        let configurationTimeline = configuration.configurationTimeline;
        let hoursSubmission = configurationTimeline.hoursSubmission;

        return hoursSubmission;
    }

    handleSelect = (evt) => {
        let currValue = evt.target.value;
        // console.log('currValue : ' + currValue);

        this.setState({
            selectedValue: currValue,
            saved : false
        }, this.save);

    }

    save = () => {
        // console.log('save : ' + this.getId() + ' - ' + this.state.selectedValue);
        this.props.dispatch(configureHoursTalent(this.getId(), this.state.selectedValue, this.onSaveOk, this.onError));
    }

    onSaveOk = () => {
        this.setState({
            saved: true
        });
    }

    onFocus = () => {
        if (this.props.handleFocus) {
            const event = {
                target: {
                    id: 'challenge-time'
                }
            };
            this.props.handleFocus(event);
        }
    }

    onError = (err) => {
        manageError(err, 'hours-dropdown', 'Impossible to updated the candidate test time limit');
    }

    cancel = () => {
        // restore value
        this.selectOriginalValue();
    }

    render(){

        return(
            <div className='challengeHoursTalentCheckbox'>
                <Grid className='noPadding'>
                    <Row>
                        <Col xs={7}>
                            <FormGroup controlId='dropdownselecthorizontal'>
                                <FormControl componentClass='select' value={this.state.selectedValue} onFocus={this.onFocus} onChange={this.handleSelect}>
                                    <option value='2'>2 hours</option>
                                    <option value='4'>4 hours</option>
                                    <option value='8'>8 hours</option>
                                    <option value='48'>2 days</option>
                                    <option value='96'>4 days</option>
                                    <option value='168'>7 days</option>
                                </FormControl>
                            </FormGroup>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}