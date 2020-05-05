import {
    FORM_VALIDATION_ERROR,
    FORM_SUBMISSION_FINISHED,
    FORM_SUBMISSION_STARTED
} from '../actions/actionTypes';




export function triggerValidationError(errorMap){
    return function (dispatch) {
        dispatch({type: FORM_VALIDATION_ERROR, payload: errorMap});
    };
}

export function formSubmissionHandler(showLoader){
    return function (dispatch) {

        if(showLoader){

            dispatch({type: FORM_SUBMISSION_FINISHED, payload: showLoader});

        }else{

            dispatch({type: FORM_SUBMISSION_STARTED, payload: showLoader});


        }
    };
}
