import * as opportunityChallengeProcessStatus from './opportunityChallengeProcessStatus';

export const TO_INIT = 0;
export const LIVE = 2;
export const CLOSE = 4;
export const FOUND = 5;

export function getClassForOpportunityStatus(id) {
    switch (id){
    case TO_INIT:
        return 'fluttrDarkOrange';
    case LIVE:
        return 'fluttrGreen';
    case CLOSE:
        return 'fluttrViolet';
    case FOUND:
        return 'fluttrViolet';
    default:
        return 'fluttrBlack';
    }
}

export function isCompletedJobPost(id){
    switch (id){
    case TO_INIT:
        return false;
    default:
        return true;
    }
}

export function checkTimer(id){
    switch (id){
    case LIVE:
        return true;
    default:
        return false;
    }
}

export function getStatusSubtitle(opportunity){
    let id = opportunity.statusId;
    switch (id){
    case TO_INIT:
        return 'Configure the skills to go live';
    case LIVE:
        return opportunityChallengeProcessStatus.getSubtitle(opportunity.challengeDetail.status);
    default:
        return '';
    }
}

export function canApplyToInvitationLink(opportunity){
    return isLiveOpportunity(opportunity);
}

export function isLiveOpportunity(opportunity){
    let id = opportunity.statusId;
    if (LIVE == id){
        return true;
    }
    return false;
}