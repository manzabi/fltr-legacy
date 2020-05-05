import {
    FORM_VALIDATION_ERROR,
    FORM_SUBMISSION_FINISHED,
    FORM_SUBMISSION_STARTED
} from '../actions/actionTypes';

const initialErrorMap = {};

const initialFormSubmissionState = false;

function triggerValidationError(state = initialErrorMap, action) {
    // console.log(state);
    // console.log("Action retrieved in reducer : " + action.type + " payload : " + action.payload);
    switch(action.type) {
    case FORM_VALIDATION_ERROR: {
        return Object.assign({}, state, {
            errorMap: action.payload
        });
    }

    default:
        return state;
    }
}

function formSubmissionHandler(state = initialFormSubmissionState, action) {
    // console.log(state);
    // console.log("Action retrieved in reducer : " + action.type + " payload : " + action.payload);
    switch(action.type) {



    case FORM_SUBMISSION_STARTED: {
        return Object.assign({}, state, {
            showLoader: true
        });
    }


    case FORM_SUBMISSION_FINISHED: {
        return Object.assign({}, state, {
            showLoader: false
        });
    }

    default:
        return state;
    }
}

module.exports = {
    triggerValidationError,
    formSubmissionHandler
};