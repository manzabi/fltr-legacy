export const PROCESS_TYPE_ATTITUDE = 1;
export const PROCESS_TYPE_QUESTIONS = 2;
export const PROCESS_TYPE_CHALLENGE = 3;

export function getAttitudeProcessTest(opportunity){
    if (opportunity) {
        const steps = opportunity.processSteps || opportunity.process.steps;
        return steps.filter((step => step.type === PROCESS_TYPE_ATTITUDE))[0];
    }
    return null;
}

export function getChallengeProcessTest(opportunity){
    if (opportunity) {
        const steps = opportunity.processSteps || opportunity.process.steps;
        return steps.filter((step => step.type === PROCESS_TYPE_CHALLENGE))[0];
    }
    return null;
}

export function getKillerQuestionProcessTest(opportunity){
    if (opportunity) {
        const steps = opportunity.processSteps || opportunity.process.steps;
        return steps.filter((step => step.type === PROCESS_TYPE_QUESTIONS))[0];
    }
    return null;
}