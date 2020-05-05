import {LIVE, TO_INIT} from './opportunityStatus';

export const CHALLENGE_CLOSED = 99;
export const CHALLENGE = 5;
export const WAITING_CONFIRM = 4;
export const WAITING_CONFIRM_TEST = 3;
export const WAITING_TEST = 2;
export const DISABLED = 0;

export function checkTimer(id) {
    switch (id) {
        case CHALLENGE:
            return true;
        default:
            return false;
    }
}

export function isActivatedChallenge(id) {
    switch (id) {
        case CHALLENGE:
            return true;
        case CHALLENGE_CLOSED:
            return true;
        default:
            return false;
    }
}

export function checkForChallengeShow(id) {
    switch (id) {
        case WAITING_CONFIRM_TEST:
            return true;
        case WAITING_CONFIRM:
            return true;
        case CHALLENGE:
            return true;
        case CHALLENGE_CLOSED:
            return true;
        default:
            return false;
    }
}

export function getStatusSubtitle(id) {
    switch (id) {
        case DISABLED:
            return 'Enable the challenge to test your candidates';
        case WAITING_CONFIRM_TEST:
            return 'Confirm the test to enable the challenge';
        case WAITING_CONFIRM:
            return 'Confirm the configurations to enable the challenge';
        default:
            return '';
    }
}

export function getClassForChallengeProcessStatus(id) {
    switch (id) {
        case DISABLED:
            return 'fluttrDarkOrange';
        case WAITING_TEST:
            return 'fluttrDarkOrange';
        case WAITING_CONFIRM_TEST:
            return 'fluttrDarkOrange';
        case WAITING_CONFIRM:
            return 'fluttrDarkOrange';
        case CHALLENGE:
            return 'fluttrGreen';
        case CHALLENGE_CLOSED:
            return 'fluttrViolet';
        default:
            return 'fluttrBlack';
    }
}

export function getSubtitle(id) {
    switch (id) {
        case DISABLED:
            return '';
        case WAITING_TEST:
            return 'Waiting for the test';
        case WAITING_CONFIRM_TEST:
            return 'Waiting for the test';
        case WAITING_CONFIRM:
            return 'Waiting for confirmation';
        case CHALLENGE:
            return 'Active';
        case CHALLENGE_CLOSED:
            return 'Challenge is closed';
        default:
            return '';
    }
}

export function canInviteTalents(id) {
    switch (id) {
        case DISABLED:
            return false;
        case WAITING_TEST:
            return false;
        case WAITING_CONFIRM_TEST:
            return false;
        case WAITING_CONFIRM:
            return false;
        case CHALLENGE:
            return true;
        case CHALLENGE_CLOSED:
            return false;
        default:
            return false;
    }
}

export function canPlaySummary(id) {
    switch (id) {
        case CHALLENGE:
            return true;
        default:
            return false;
    }
}

export function canReviewSummary(id) {
    switch (id) {
        case DISABLED:
            return false;
        case WAITING_TEST:
            return false;
        case WAITING_CONFIRM_TEST:
            return false;
        case WAITING_CONFIRM:
            return false;
        case CHALLENGE:
            return false;
        default:
            return true;
    }
}

export function getChallengeRouterStatus(opportunity, challengeStatus, Context) {
    let context = Context || 'my_test';

    if (opportunity && opportunity.statusId !== TO_INIT) {
        context = Context || 'candidates';
        return {
            activeScreen: context,
            testDisabled: false,
            teamDisabled: false,
            settingsDisabled: false,
            candidatesDisabled: false,
            renderContext: 'candidates'
        };
    } else {
        switch (challengeStatus) {
            case DISABLED: {
                return {
                    activeScreen: 'test',
                    testDisabled: false,
                    teamDisabled: true,
                    settingsDisabled: true,
                    candidatesDisabled: true,
                    renderContext: 'template-list'
                };
            }
            case WAITING_TEST: {
                return {
                    activeScreen: 'test',
                    testDisabled: false,
                    teamDisabled: true,
                    settingsDisabled: true,
                    candidatesDisabled: true,
                    renderContext: 'template-list'

                };
            }
            case WAITING_CONFIRM && ['team', 'settings', 'my_test', 'activity'].includes(context): {
                return {
                    activeScreen: context,
                    testDisabled: false,
                    teamDisabled: false,
                    settingsDisabled: false,
                    candidatesDisabled: false,
                    renderContext: 'summary'
                };
            }
            default: {
                if (['challenges', 'templates', 'job_details', 'questions', 'attitude', 'preview'].includes(context)) {
                    return {
                        activeScreen: 'test',
                        testDisabled: false,
                        teamDisabled: [DISABLED, WAITING_TEST].includes(challengeStatus),
                        settingsDisabled: [WAITING_TEST, DISABLED].includes(challengeStatus),
                        candidatesDisabled: [DISABLED, WAITING_TEST, WAITING_CONFIRM].includes(challengeStatus),
                        renderContext: 'template-list'
                    };
                } else if (['team', 'settings', 'candidates', 'my_test', 'activity'].includes(context)) {
                    return {
                        activeScreen: context,
                        testDisabled: false,
                        teamDisabled: false,
                        settingsDisabled: false,
                        candidatesDisabled: false,
                        renderContext: 'summary'
                    };
                } else {
                    return {
                        activeScreen: context,
                        testDisabled: false,
                        teamDisabled: true,
                        settingsDisabled: true,
                        candidatesDisabled: true,
                        renderContext: 'template-list'
                    };
                }
            }
        }
    }
}

export const getOpportunityChallengeSelected = (opportunity) => {
    if (opportunity) {
        if (opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge) {
            return opportunity.recruiterDetail.challengeTest.challenge;
        } else {
            return false;
        }
    } else {
        return null;
    }
};