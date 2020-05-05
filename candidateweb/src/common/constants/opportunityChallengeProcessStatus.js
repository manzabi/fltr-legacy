export const CLOSED_NO_PARTECIPANTS = 98;
export const CLOSED_NO_JUDGES = 97;
export const CHALLENGE_VISIBLE = 96;
export const CHALLENGE_CLOSED = 99;
export const EXTRA_TIME_EXPERTS = 7;
export const EXTRA_TIME_PLAYERS = 6;
export const CHALLENGE = 5;
export const WAITING_CONFIRM = 4;
export const WAITING_CONFIRM_TEST = 3;
export const WAITING_TEST = 2;
export const WAITING_CONF = 1;
export const DISABLED = 0;
export const UNDEFINED = -1;

export function checkTimer(id){
    switch (id){
    case CHALLENGE:
        return true;
    case EXTRA_TIME_PLAYERS:
        return true;
    case EXTRA_TIME_EXPERTS:
        return true;
    default:
        return false;
    }
}

export function checkForChallengeShow(id){
    switch (id){
    case WAITING_CONFIRM_TEST:
        return true;
    case WAITING_CONFIRM:
        return true;
    case CHALLENGE:
        return true;
    case EXTRA_TIME_PLAYERS:
        return true;
    case EXTRA_TIME_EXPERTS:
        return true;
    case CHALLENGE_CLOSED:
        return true;
    case CHALLENGE_VISIBLE:
        return true;
    default:
        return false;
    }
}

export function getStatusSubtitle(id){
    switch (id){
    case DISABLED:
        return 'Enable the challenge to test your candidates';
    case WAITING_CONF:
        return 'Complete the configuration to enable the challenge';
    case WAITING_CONFIRM_TEST:
        return 'Confirm the test to enable the challenge';
    case WAITING_CONFIRM:
        return 'Confirm the configurations to enable the challenge';
    default:
        return '';
    }
}

export function getClassForChallengeProcessStatus(id) {
    switch (id){
    case DISABLED:
        return 'fluttrDarkOrange';
    case WAITING_CONF:
        return 'fluttrDarkOrange';
    case WAITING_TEST:
        return 'fluttrDarkOrange';
    case WAITING_CONFIRM_TEST:
        return 'fluttrDarkOrange';
    case WAITING_CONFIRM:
        return 'fluttrDarkOrange';
    case CHALLENGE:
        return 'fluttrGreen';
    case EXTRA_TIME_PLAYERS:
        return 'fluttrDarkOrange';
    case EXTRA_TIME_EXPERTS:
        return 'fluttrDarkOrange';
    case CHALLENGE_CLOSED:
        return 'fluttrViolet';
    case CHALLENGE_VISIBLE:
        return 'fluttrViolet';
    case CLOSED_NO_JUDGES:
        return 'fluttrRed';
    case CLOSED_NO_PARTECIPANTS:
        return 'fluttrRed';
    default:
        return 'fluttrBlack';
    }
}

export function getSubtitle(id){
    switch (id) {
    case DISABLED:
        return '';
    case WAITING_CONF:
        return 'Waiting for configuration';
    case WAITING_TEST:
        return 'Waiting for the test';
    case WAITING_CONFIRM_TEST:
        return 'Waiting for the test';
    case WAITING_CONFIRM:
        return 'Waiting for confirmation';
    case CHALLENGE:
        return 'Active';
    case EXTRA_TIME_PLAYERS:
        return 'Active';
    case EXTRA_TIME_EXPERTS:
        return 'Closing reviews';
    case CHALLENGE_CLOSED:
        return 'Challenge is closed';
    case CHALLENGE_VISIBLE:
        return 'Challenge is closed';
    case CLOSED_NO_JUDGES:
        return 'Challenge is closed';
    case CLOSED_NO_PARTECIPANTS:
        return 'Challenge is closed';
    default:
        return '';
    }
}

export function canInviteTalents(id){
    switch (id){
    case DISABLED:
        return false;
    case WAITING_CONF:
        return false;
    case WAITING_TEST:
        return false;
    case WAITING_CONFIRM_TEST:
        return false;
    case WAITING_CONFIRM:
        return false;
    case CHALLENGE:
        return true;
    case EXTRA_TIME_PLAYERS:
        return true;
    case EXTRA_TIME_EXPERTS:
        return false;
    case CHALLENGE_CLOSED:
        return false;
    case CHALLENGE_VISIBLE:
        return false;
    case CLOSED_NO_JUDGES:
        return false;
    case CLOSED_NO_PARTECIPANTS:
        return false;
    default:
        return false;
    }
}

export function canPlaySummary(id){
    switch (id){
    case CHALLENGE:
        return true;
    default:
        return false;
    }
}

export function canReviewSummary(id){
    switch (id){
    case DISABLED:
        return false;
    case WAITING_CONF:
        return false;
    case WAITING_TEST:
        return false;
    case WAITING_CONFIRM_TEST:
        return false;
    case WAITING_CONFIRM:
        return false;
    case CHALLENGE:
        return false;
    case EXTRA_TIME_PLAYERS:
        return false;
    default:
        return true;
    }
}