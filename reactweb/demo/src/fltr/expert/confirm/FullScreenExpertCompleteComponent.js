import React from 'react';

import { connect } from 'react-redux';
import {
    Button
} from '@sketchpixy/rubix';


import * as pendingTypes from '../../../constants/opportunityJudgePendingType';
import {
    goToExpertDashboard, goToPendingInvitations, goToExpertCreateChallenge,
    goToReviewForExpert
} from '../../navigation/NavigationManager';
import { hideUserSidebar, showUserSidebar } from '../../../redux/actions/sidebarActions';

@connect((state) => state)
export default class FullScreenExpertCompleteComponent extends React.Component {
    render(){
        let expertPendingOpportunities = this.props.expertPendingOpportunities;

        return (
            <FullScreen>
                <FullScreenExpertCompleteContent onClose={this.props.onClose} data={expertPendingOpportunities}/>
            </FullScreen>);
    }
}

class FullScreen extends React.Component {
    render(){
        return (
            <div className="overlay">{this.props.children}</div>
        );
    }
}

@connect((state) => state)
class FullScreenExpertCompleteContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,

            image: this.getRandomImage(),
            quote : this.getRandomQuote()
        };
    }

    componentWillMount(){
        if (!this.state.open){
            this.onOpen();
        }
    }

    getRandomImage(){
        let numberofpictures = 12;
        let randomNum = Math.floor(Math.random() * numberofpictures) + 1;
        return '/imgs/app/fullscreen/bg_' + randomNum + '.jpg';
    }

    getRandomQuote(){
        let arrayStrings = [];
        arrayStrings.push('Every time you leave a feedback to a candidate, you help her to increase her professional know how');
        arrayStrings.push('Treat candidates with empathy and see their gaps as opportunities for growth');
        arrayStrings.push('Help job applicants learn more about their own skills, thanks to your structured feedback');
        arrayStrings.push('We not are here to help only the hiring company, but also the candidates by giving them a more empowering job selection process');
        arrayStrings.push('Every time you give an insightful feedback to a job applicant, you are creating an #awesome experience');
        arrayStrings.push('Remember that every candidate that has answered the challenge, had a motivation stronger than many others that did not do it');
        arrayStrings.push('Be honest in your feedback, but kind at the same time. It\'s the best way to empower others');
        arrayStrings.push('Help the person recruiting to understand what things they should further explore in the candidates you recommended');
        arrayStrings.push('Your feedback to the recruiter will serve as the key for a more purposeful interview process');
        arrayStrings.push('Let the recruiters understand the key strengths and gaps of the candidates you recommended');
        arrayStrings.push('Your expertise is the cornerstone of Fluttr. Thank you for being such a critical part of what we do');
        arrayStrings.push('Every time you give an insightful feedback to a job applicant, you are creating an #awesome experience');
        arrayStrings.push('Leadership is not a title. It\'s a behaviour. Live it. [Robin Sharma]');
        arrayStrings.push('Be the change you want to see in the world [Mahatma Gandhi]');
        arrayStrings.push('As we look ahead into the next century, leaders will be the ones who empower others [Bill Gates]');
        arrayStrings.push('Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. [Albert Einstein]');
        arrayStrings.push('Everybody is a genius. But if you judge a fish by its ability to climb a tree, it will live its whole life believing that it is stupid. [Albert Einstein]');
        arrayStrings.push('My job is not to be easy on people. My job is to take these great people we have and to push them and make them even better. [Steve Jobs]');
        arrayStrings.push('I think it\'s very important to have a feedback loop, where you\'re constantly thinking about what you\'ve done and how you could be doing it better. [Elon Musk]');
        
        let item = arrayStrings[Math.floor(Math.random()*arrayStrings.length)];

        return item;
    }

    onClose = () => {
        $('#rubix-nav-header').css('z-index', 3100);
        $('.overlay-inner').css('background', '');
        this.props.dispatch(showUserSidebar());
        if(this.props.onClose !== undefined) this.props.onClose();
        this.setState({
            open: false
        });
    }

    onOpen(){
        $('#rubix-nav-header').css('z-index', 1);
        this.props.dispatch(hideUserSidebar());
        this.setState({
            open: true
        });
    }

    goToNextTask(){
        let data = this.props.data.item[0];
        // console.log('data.type ' + data.type);
        this.onClose();
        switch(data.type){
        case pendingTypes.EXPERT:
            goToPendingInvitations();
            break;
        case pendingTypes.CHALLENGE:
            goToExpertCreateChallenge(data.opportunity.id);
            break;
        case pendingTypes.REVIEW:
            goToReviewForExpert(data.opportunity.id);
            break;
        default:
            break;
        }
    }

    goBack = () => {
        this.onClose();
        goToExpertDashboard();
    }

    getTextFromOpportunity(){
        let expertPendingOpportunities = this.props.data;
        let currentPendingTask = expertPendingOpportunities.item[0];
        let data = currentPendingTask;
        // console.log("current pending task " + JSON.stringify(currentPendingTask));

        switch (currentPendingTask.type){
        case pendingTypes.REVIEW:
            return (
                <span><strong>Review {data.opportunity.expertDetail.reviewLeft}</strong> new response{data.opportunity.expertDetail.reviewLeft > 1 ? 's' : ''} to the challenge for <strong>{data.opportunity.roleTitle}</strong> at <strong>{data.opportunity.company.name}</strong></span>
            );
        case pendingTypes.CHALLENGE:
            return(
                <span><strong>Create</strong> <strong>1</strong> challenge for the position of <strong>{data.opportunity.roleTitle}</strong> at <strong>{data.opportunity.company.name}</strong></span>
            );
        case pendingTypes.EXPERT:
            return(
                <span><strong>Accept</strong> <strong>1</strong> invitation to be expert in a new challenge for <strong>{data.opportunity.roleTitle}</strong> at <strong>{data.opportunity.company.name}</strong></span>
            );
        default:
            return (<div></div>);

        }
    }

    renderNextTask(){

        return (
            <div>
                <div className="overlay-message">
                    Congratulations!
                </div>

                <div className="overlay-sub-message">
                    You successfully completed this task.
                </div>

                <div className="overlay-button">
                    <Button style={{width:'30%'}} onClick={() => this.goToNextTask()} className="btn-flt-xl">
                        Take me to my next task!
                    </Button>
                    <div style={{paddingLeft:'30%',paddingRight:'30%'}}>
                        <span className="overlay-under-button">{this.getTextFromOpportunity()}</span>
                    </div>
                </div>
            </div>
        );
    }

    renderNoTasks(){
        return (
            <div>
                <div className="overlay-message">
                    #Awesome
                </div>

                <div className="overlay-sub-message">
                    You completed all your pending tasks.
                    <br/>
                    Thank you!
                </div>

                <div className="overlay-button">
                    <Button style={{width:'30%'}} onClick={this.goBack} className="btn-flt-xl">
                        Back <i className="icon-entypo-home"/>
                    </Button>
                </div>
            </div>
        );
    }

    render(){

        let expertPendingOpportunities = this.props.data;

        // console.log("expertPendingOpportunities " + JSON.stringify(expertPendingOpportunities));
        // console.log("expertPendingOpportunities.item.length " + Object.keys(expertPendingOpportunities.item).length);

        let thereIsAnotherTask = false;
        if (expertPendingOpportunities != null && expertPendingOpportunities.item != null){
            if (Object.keys(expertPendingOpportunities.item).length > 0) {
                thereIsAnotherTask = true;
            }
        }

        // console.log('render image : ' + this.state.image);

        return (
            <div className="overlay-inner" style={{background:'url(' + this.state.image + ') no-repeat center center fixed'}}>
                <div className="overlay-container">
                    <div style={{width:'100%', textAlign:'right'}}>
                        <button className="hidden-print backButton" onClick={this.onClose}>
                            <i className="icon-entypo-cross" ></i>
                        </button>
                    </div>

                    <div className="overlay-quote">
                        <div style={{paddingLeft:'20%',paddingRight:'20%'}}>"{this.state.quote}"</div>
                    </div>

                    {thereIsAnotherTask &&
                        this.renderNextTask()
                    }

                    {!thereIsAnotherTask &&
                        this.renderNoTasks()
                    }

                </div>
            </div>
        );
    }
}