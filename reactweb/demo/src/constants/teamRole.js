export const HIRING = 1;
export const EXPERT = 2;

export function getLabel(role){
    switch (role){
    case HIRING:
        return 'hiring team';
    case EXPERT:
        return 'expert team';
    default:
        return '';
    }
}