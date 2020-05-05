export const UNDEFINED = -1;
export const INTERNAL = 1;
export const EXTERNAL = 2;

export const MAX_INTERNAL_JUDGES = 3;

export function getClassForJudgeType(id) {
    if (id == UNDEFINED){
        return 'fluttrYellow';
    } else if (id == INTERNAL){
        return 'fluttrGreen';
    } else if (id == EXTERNAL){
        return 'fluttrBlue';
    } else {
        return '';
    }
}