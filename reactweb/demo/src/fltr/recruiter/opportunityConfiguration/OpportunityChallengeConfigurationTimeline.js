import React, {Component} from 'react';
import {connect} from 'react-redux';
import { setOpportunityTimeline } from '../../../redux/actions/opportunityActions';
import { goToRecruiterOpportunityConfigurationDetail } from '../../navigation/NavigationManager';
import DropDown from '../../../common/components/DropDown';
import timelineChoises from '../../../constants/timelineChoises';
import ButtonBarComponent from '../../../common/components/ButtonBarComponent';

@connect((state) => state)
export default class OpportunityChallengeConfigurationTimeline extends Component {
    constructor (props) {
        super(props);
        this.state = {
            automatically: false,
            selectedTime: 24,
            disableAutomatic: false
        };
    }
    
    componentDidMount () {
        if (this.state.disableAutomatic) {
            this.handleSelect(-1);
        }
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

    handleSelect = (value) => {
        this.props.dispatch(setOpportunityTimeline(this.getId(), {hoursDuration: value}, this.onSucess));
    }

    onSucess = () => {
        goToRecruiterOpportunityConfigurationDetail(this.getId());
        
    }

    selectAuto = () => {
        this.setState({
            automatically: true
        });
    }
    onGoBack = () => {
        this.setState({
            automatically: false
        });
    }

    handleChangeTime = (time) => {
        this.setState({
            selectedTime: time
        });
    }

    render () {
        return (
            <section className='fluttr-split-page opportunity-timeline-page containerMaxSize'>
                <div style={{textAlign: 'center'}}>
                    <h1 className='fluttr-header-big'>How would you like to invite your candidates to this challenge?</h1>
                </div>
                { !this.state.automatically &&
                    <section className='fluttr-split-page-actions-container'>
                        <div className='fluttr-split-page-action' onClick={() => this.handleSelect(-1)}>
                            <div className='action-body'>
                                <h3 className='fluttr-header-sm'>Manually</h3>
                                <p>
                                    Invite only the candidates that you select. You can do it directly through Fluttr for each candidate, or send them an invitation link that we'll share with you shortly.
                                </p>
                            </div>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/invite.png' width='100%'/>
                        </div>
                        { !this.state.disableAutomatic &&
                            <div className='fluttr-split-page-action' onClick={() => this.selectAuto()}>
                                <div className='action-body'>
                                    <h3 className='fluttr-header-sm'>Automatically</h3>
                                    <p>
                                        All candidates, after applying, are automatically invited by Fluttr. You can decide the exact time when the invitations are sent out.
                                    </p>
                                </div>
                                <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/automatically.png' width='100%'/>
                            </div>
                        }
                    </section> ||
                    [
                        <section className='timeline-select-time' key='selectTimeline'>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/automatically-uncut.png' width='150px'/>
                            <form>
                                <p>
                                    Invite candidates automatically
                                    <DropDown 
                                        list={timelineChoises}
                                        value={this.state.selectedTime}
                                        changeTrigger={this.handleChangeTime}
                                    />
                                    after they applied to the job opening.
                                </p>
                            </form>
                        </section>,
                        <ButtonBarComponent
                            fowardButtonText={this.state.isCreation ? 'Next' : 'Save'}
                            onFoward={() => this.handleSelect(this.state.selectedTime)}
                            onBack={this.onGoBack}
                            key='actions'
                            backButtonText='Go back'
                        />
                    ]
                }
            </section>
        );
    }
}