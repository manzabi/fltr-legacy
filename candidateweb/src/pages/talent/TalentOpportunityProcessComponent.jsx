import React, { Component } from 'react';
import {
    getProcessTestOkString, getProcessText, getProcessTextDeclined, getProcessTextNotEnabled, getProcessTypeString,
    TEST_TYPE_ATTITUDE, TEST_TYPE_CHALLENGE,
    TEST_TYPE_KILLERQUESTION,
    getProcessTextExpired,
    getPendingText
} from '../../common/constants/procesTypes';
import {
    getChallengeOverview, getForApplicants, getForFormChallenge, goToAttitudeTest,
    goToKillerQuestionTest, goToProcessStepAccept,
    navigateToUrl,
    getAttitudeOverview,
    goToUrl
} from '../../utils/navigationManager';
import {
    hasProcessATestType, canTalentPlayThisStep, canPlayThisOnlyInFuture, isTalentCompletedPlayThisStep,
    isTalentAcceptedPlayThisStep,
    candidateDeclinedStep, isTalentEnabledPlayThisStep, isTalentDeclinedPlayThisStep, isTalentExpiredThisStep,
    isTalentCanSeeThisStep,
    isTalentAceptedPlayThisStep, getProcessStep
} from '../../common/functions/process/processFunctions';
import { withRouter } from 'react-router-dom';
import { isLiveOpportunity } from '../../common/constants/opportunityStatus';

import FluttrButton from '../../common/components/FluttrButton';
import { getStatusTitle } from '../../common/constants/processHeaders';

const TalentOpportunityProcessComponent = ({ opportunity }) => {

    const renderContent = () => {
        const isLive = isLiveOpportunity(opportunity);

        // for guests
        if (opportunity.playerDetail == null) {
            if (isLive) {
                return (<TalentProcessPlayGuestStepsComponent opportunity={opportunity} />);
            } else {
                return (<TalentProcessPlayExpiredComponent opportunity={opportunity} />);
            }
        }

        const candidateProcess = opportunity.playerDetail.process;

        let componentToShow = 0;

        if (isLive) {
            if (candidateProcess.completed) {
                componentToShow = 2;
            } else {
                if (candidateProcess.discarted) {
                    componentToShow = 3;
                } else if (candidateProcess.declined) {
                    // in progress
                    componentToShow = 1;
                } else {
                    // in progress
                    componentToShow = 1;
                }
            }
        } else {
            // not live (closes, hired, ..)
            componentToShow = 4;
        }

        //console.log('Show component : ' + componentToShow);

        switch (componentToShow) {
            case 1:
                // IN PROCESS
                return (<TalentProcessPlayStepsComponent opportunity={opportunity} />);
            case 2:
                // COMPLETE
                return (<TalentProcessPlayCompleteComponent opportunity={opportunity} />);
            case 3:
                // DISCARTED
                return (<TalentProcessPlayDiscartedComponent opportunity={opportunity} />);
            case 4:
                // EXPIRED
                return (<TalentProcessPlayExpiredComponent opportunity={opportunity} />);
            default:
            // render nothing
        }
    };

    return (
        <section className='talent-opportunity-process-component'>
            {renderContent()}
        </section>
    );

};

export default TalentOpportunityProcessComponent;

const TalentProcessPlayStepsComponent = ({ opportunity }) => {
    const { processSteps } = opportunity;
    const candidateProcess = opportunity.playerDetail.process;
    const header = getStatusTitle(candidateProcess, opportunity);

    return (
        <div className='process-steps-container'>
            {header.map((line, index) => {
                return (
                    <h3 key={index}>{line}</h3>
                );
            })}
            {!!processSteps.length &&
                <div>
                    {
                        processSteps.map((step, index) => {
                            return (<TalentProcessPlayStepsItemComponent opportunity={opportunity} candidateProcess={candidateProcess} guest={false} step={step} index={index} />);
                        })
                    }
                </div>
            }
        </div>);
};

const TalentProcessPlayGuestStepsComponent = ({ opportunity }) => {
    const { processSteps } = opportunity;
    return (
        <div>
            <h3>Assesment process by {opportunity.company.name}</h3>

            {!!processSteps.length &&
                <div>
                    {
                        processSteps.map((step, index) => {
                            return (<TalentProcessPlayStepsItemComponent opportunity={opportunity} step={step} index={index} guest={true} />);
                        })
                    }
                </div>
            }
        </div>);
};

@withRouter
class TalentProcessPlayStepsItemComponent extends Component {

    onGo = () => {
        const candidateProcess = this.props.candidateProcess;
        const step = this.props.step;
        const opportunity = this.props.opportunity;

        const isAccepted = isTalentAcceptedPlayThisStep(candidateProcess, step);

        //console.log('ITEM - Accepted : ' + isAccepted + ' STEP TO GO : ' + JSON.stringify(step));

        if (isAccepted) {
            switch (step.type) {
                case TEST_TYPE_KILLERQUESTION:
                    //console.log('going to killer questions');
                    goToKillerQuestionTest(opportunity.id, step.id);
                    break;
                case TEST_TYPE_ATTITUDE:
                    //console.log('going to killer questions');
                    goToAttitudeTest(opportunity.id, step.id);
                    break;
                case TEST_TYPE_CHALLENGE:
                    //console.log('going to challenge');
                    navigateToUrl(getForFormChallenge(opportunity.id));
                    break;
                default:
                //console.log('not managed TEST');
                // not managed
            }
        } else {
            if (step.type === TEST_TYPE_CHALLENGE) {
                goToProcessStepAccept(opportunity.id, step.id);
            }
        }
    };

    renderButton = () => {
        if (!this.props.guest) {
            // USER
            const candidateProcess = this.props.candidateProcess;
            const step = this.props.step;

            const isCompleted = isTalentCompletedPlayThisStep(candidateProcess, step);
            const canPlayThisStep = canTalentPlayThisStep(candidateProcess, step);
            const canPlayThisInFuture = canPlayThisOnlyInFuture(candidateProcess, step);

            if (isCompleted) {
                // hide the button when completed
                return (<div />);
            } else if (canPlayThisStep) {
                return (
                    <button className='btn btn-orange btn-xsmall' onClick={this.onGo}>Go</button>
                );
            } else {
                if (canPlayThisInFuture) {
                    return (<button className='btn btn-orange btn-xsmall' disabled>Go</button>);
                }
            }

            return (<div />);
        } else {
            // GUEST
            return (<button className='btn btn-orange btn-xsmall' disabled>Go</button>);
        }


    };

    renderNumberStep = () => {
        const candidateProcess = this.props.candidateProcess;
        const step = this.props.step;
        const canPlayThisStep = canTalentPlayThisStep(candidateProcess, step);
        const declinedStep = candidateDeclinedStep(candidateProcess, step);
        const isExpired = isTalentExpiredThisStep(candidateProcess, step);
        const index = this.props.index;

        const isCompleted = isTalentCompletedPlayThisStep(candidateProcess, step);

        if (isCompleted) {
            // hide the button when completed
            return (<div className='process-step completed-step'><i className='far fa-check' /></div>);
        } else if (declinedStep) {
            return (<div className='process-step declined-step'><i className='far fa-times' /></div>);
        } else if (isExpired) {
            return (<div className='process-step declined-step'><i className='far fa-times' /></div>);
        } else {
            return (<div className={`process-step ${canPlayThisStep ? 'active-step' : ''}`}><span>{index + 1}</span></div>);
        }
    };

    renderExpireTime = () => {
        const candidateProcess = this.props.candidateProcess;
        const step = this.props.step;
        const canPlayThisStep = canTalentPlayThisStep(candidateProcess, step);
        const isExpired = isTalentExpiredThisStep(candidateProcess, step);
        const isAccepted = isTalentAcceptedPlayThisStep(candidateProcess, step);
        const isCompleted = isTalentCompletedPlayThisStep(candidateProcess, step);
        const currStep = getProcessStep(candidateProcess, step);

        if (canPlayThisStep && !isExpired && step.type === TEST_TYPE_CHALLENGE && isAccepted && !isCompleted) {
            const expireTime = currStep.expireDateString;
            return <p className='challenge-expire-time'>{`${expireTime} left`}</p>;
        } else {
            return null;
        }
    };

    render() {

        if (!this.props.guest) {
            // USER
            const candidateProcess = this.props.candidateProcess;
            const step = this.props.step;

            const isCanSeeThisStep = isTalentCanSeeThisStep(candidateProcess, step);
            const isCompleted = isTalentCompletedPlayThisStep(candidateProcess, step);
            const isEnabled = isTalentEnabledPlayThisStep(candidateProcess, step);
            const isDeclined = isTalentDeclinedPlayThisStep(candidateProcess, step);
            const isExpired = isTalentExpiredThisStep(candidateProcess, step);
            // const isAccepted = !isDeclined && !isExpired && isCanSeeThisStep;
            const isAccepted = isTalentAceptedPlayThisStep(candidateProcess, step);
            let message = getProcessTypeString(step.type, this.props.opportunity);
            if (!isEnabled) {
                if (isCanSeeThisStep) {
                    message = getProcessTextNotEnabled(step.type);
                }
            } else {
                if (isCompleted) {
                    message = getProcessTestOkString(step.type);
                } else if (isDeclined) {
                    message = getProcessTextDeclined(step.type);
                } else if (isExpired) {
                    message = getProcessTextExpired(step.type);
                } else if (!isAccepted) {
                    message = getProcessText(step.type, this.props.opportunity);
                } else if (isAccepted) {
                    message = getPendingText(step.type, this.props.opportunity);
                } else {
                    message = getProcessTypeString(step.type);
                }
            }
            return (
                <div className='opportunity-step'>
                    <div className='opportunity-description'>
                        {
                            this.renderNumberStep()
                        }
                        <div className='step-description'>
                            {(message && message.length > 0) &&
                                message.map((text) => (
                                    <p className={!isCanSeeThisStep && 'fluttr-caca'}>
                                        {text}
                                    </p>
                                ))
                            }
                            {this.renderExpireTime()}
                        </div>
                    </div>

                    <div className='step-button-container' style={{ textAlign: 'right' }}>
                        {this.renderButton()}
                    </div>
                </div>
            );
        } else {
            // GUEST
            //console.log('guest management for item');
            const step = this.props.step;
            let message = getProcessTypeString(step.type);

            return (
                <div className='opportunity-step'>
                    <div className='opportunity-description'>
                        {
                            this.renderNumberStep()
                        }
                        <div className='step-description'>
                            {(message && message.length > 0) &&

                                message.map((text) => (
                                    <p>
                                        {text}
                                    </p>
                                ))
                            }
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        {this.renderButton()}
                    </div>
                </div>
            );
        }
    }
}

const TalentProcessPlayCompleteComponent = ({ opportunity, opportunity: { company: { name: companyName }, id: opportunityId } }) => {

    const { processSteps } = opportunity;

    const hasKiller = hasProcessATestType(processSteps, TEST_TYPE_KILLERQUESTION);
    const hasAttitude = hasProcessATestType(processSteps, TEST_TYPE_ATTITUDE);
    const hasChallenge = hasProcessATestType(processSteps, TEST_TYPE_CHALLENGE);
    return (
        <div className='opportunity-process-complete'>
            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/candidateWeb/images/process/icon-check.svg' />
            {!hasChallenge && !hasAttitude && hasKiller &&
                <p>Woohoo! Your answers matched the job requirements</p>
            }
            {!hasChallenge && hasAttitude &&
                [<p key='1'>
                    Congratulations! You submitted your answer!
                </p>,
                <p key='2'>
                    {companyName} will be in touch as soon as their review is completed.
                </p>,
                <FluttrButton action={() => goToUrl(getAttitudeOverview(opportunityId))}>See leaderboard and details</FluttrButton>
                ]
            }
            {hasChallenge &&
                [<p key='1'>
                    Congratulations! You submitted your answer!
                </p>,
                <p key='2'>
                    {companyName} will be in touch as soon as their review is completed.
                </p>]
            }
            {!hasChallenge && !hasAttitude && !hasKiller &&
                <p>Congratulations! You applied for this job position. <br /> {companyName} will contact you soon!</p>
            }

            {hasChallenge &&
                [
                    <p className='leaderboard' key='1'><i className='fal fa-trophy orange' />{` You are on the ${opportunity.playerDetail.positionStr} position`}</p>,
                    <FluttrButton action={() => navigateToUrl(getChallengeOverview(opportunityId))}>See leaderboard and details</FluttrButton>
                ]
            }
        </div>
    );
};

const TalentProcessPlayDiscartedComponent = () => (
    <div className='opportunity-process-message'>
        <p className='fluttr-text-sm'>Thank you for submiting the answer.</p>
        <p className='fluttr-text-sm'> We are sorry but you did not meet some of the requirements for this job position Don’t give up!</p>
        <p className='fluttr-text-sm'>Explore other opportunities <a href={getForApplicants()}>here</a>.</p>
    </div>
);

const TalentProcessPlayExpiredComponent = () => (
    <div className='opportunity-process-message'>
        <p className='fluttr-text-sm'>This job offer has been expired.</p>
        <p className='fluttr-text-sm'>If you want you can look for other opportunities <a href={getForApplicants()}>here</a>.</p>
    </div>
);