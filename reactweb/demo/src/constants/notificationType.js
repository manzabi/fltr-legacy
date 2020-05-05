import {
    goToExpertDashboard,
    goToOpportunityDetail, goToRecruiterAnswerUserToChallenge, goToReviewForExpert,
    goToReviewUserForExpert
} from "../fltr/navigation/NavigationManager";

export const OPPORTUNITY_CHALLENGE_REPLY_EXPERT = 1;
export const OPPORTUNITY_REVIEW_STATUS_EXPERT = 2;
export const OPPORTUNITY_REVIEW_REPLY = 3;
export const OPPORTUNITY_INVITATION_ACCEPTED = 4;
export const OPPORTUNITY_INVITATION_DECLINED = 5;
export const OPPORTUNITY_CHANGE_STATUS = 6;
export const OPPORTUNITY_CHALLENGE_REPLY_RECRUITER = 7;
export const OPPORTUNITY_INVITATION_RECEIVED = 8;
export const OPPORTUNITY_APPLIED_CANDIDATE = 9;

export function manageClickOnNotification(notification){
    //console.log('Click on : ' + JSON.stringify(notification));

    let id = notification.idExternal;
    let id2 = notification.idExternalSecondary;

    switch (notification.typeId){
        case OPPORTUNITY_CHALLENGE_REPLY_EXPERT:
            goToReviewUserForExpert(id, id2);
            break;
        case OPPORTUNITY_REVIEW_STATUS_EXPERT:
            goToReviewForExpert(id);
            break;
        case OPPORTUNITY_REVIEW_REPLY:
            goToReviewUserForExpert(id, id2);
            break;
        case OPPORTUNITY_INVITATION_ACCEPTED:
            goToOpportunityDetail(id);
            break;
        case OPPORTUNITY_INVITATION_DECLINED:
            goToOpportunityDetail(id);
            break;
        case OPPORTUNITY_CHANGE_STATUS:
            goToOpportunityDetail(id);
            break;
        case OPPORTUNITY_CHALLENGE_REPLY_RECRUITER:
            goToRecruiterAnswerUserToChallenge(id, id2);
            break;
        case OPPORTUNITY_INVITATION_RECEIVED:
            goToExpertDashboard();
            break;
        case OPPORTUNITY_APPLIED_CANDIDATE:
            goToOpportunityDetail(id);
            break;
        default:
            console.log('not managed : ' + notification.typeId);
    }
}