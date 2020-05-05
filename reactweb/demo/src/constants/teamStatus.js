export const DISABLED = 0;
export const PENDING = 1;
export const CONFIRMED = 2;
export const DECLINED = 3;

export function getLabelTeamStatus(id){
    switch (id){
    case DISABLED:
        return 'Not enabled';
    case PENDING:
        return 'Invitation Pending';
    case CONFIRMED:
        return 'Invitation Accepted';
    case DECLINED:
        return 'Invitation Declined';
    default:
        return '';
    }
}

export function enableColor(id){
    switch (id){
    case DISABLED:
        return false;
    case PENDING:
        return false;
    case CONFIRMED:
        return true;
    case DECLINED:
        return true;
    default:
        return '';
    }
}