export const UNDEFINED = -1;
export const TO_INVITE = 0;
export const INVITED = 1;
export const ACCEPTED = 2;
export const DECLINED = 3;
export const EXPIRED = 4;
export const SUSPENDED = 5;

export function getClassForJudgeStatus(id) {
    if (id == INVITED){
        return 'fluttrYellow';
    } else if (id == ACCEPTED){
        return 'fluttrGreen';
    } else if (id == DECLINED){
        return 'fluttrRed';
    } else if (id == EXPIRED){
        return 'fluttrRed';
    } else if (id == SUSPENDED){
        return 'fluttrRed';
    } else {
        return 'fluttrDarkGrey';
    }
}

export function checkApproved(id){
    if (id == ACCEPTED) {
        return true;
    }
    return false;
}