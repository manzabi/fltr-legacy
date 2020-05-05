export const NEW = 0;
export const INVITED_CHALLENGE = 14;
export const SUBMITTED = 1;
export const SUBMITTED_DRAFT = 9;
export const ACCEPTED_CHALLENGE = 11;
export const DECLINED_CHALLENGE = 12;
export const CHALLENGE_EXPIRED = 13;

export function getTooltip(status, value = ''){
    // console.log('value : ' + value);

    if (status === SUBMITTED_DRAFT){
        status = ACCEPTED_CHALLENGE;
    }
    switch(status){
        case NEW:
            return 'The candidate applied for the job position and waiting for an invitation to the challenge';
        case INVITED_CHALLENGE:
            return 'The candidate has been invited to participate in the challenge';
        case ACCEPTED_CHALLENGE:
            return 'The candidate accepted the challenge and now has ' + value + ' left to submit the answer';
        case DECLINED_CHALLENGE:
            return 'The candidate declined the invitation';
        case CHALLENGE_EXPIRED:
            return 'The candidate did not complete the challenge on time';
        case SUBMITTED:
            return 'The candidate submitted the response to the challenge that it\'s waiting for the experts\' reviews';
        default:
            return '';
    }

    //Invitation expired: the invitation sent to the candidate expired.
}