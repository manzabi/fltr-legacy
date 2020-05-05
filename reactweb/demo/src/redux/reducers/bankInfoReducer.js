import {
    FETCH_BANK_INFO_FULFILLED,
    FETCH_BANK_INFO_REJECTED,
    FETCH_BANK_INFO_REQUEST,

    FETCH_SEPA_COUNTRY_LIST_FULFILLED,
    FETCH_SEPA_COUNTRY_LIST_REJECTED,
    FETCH_SEPA_COUNTRY_LIST_REQUEST,

    VALIDATE_BANK_INFO_FULFILLED,
    VALIDATE_BANK_INFO_REJECTED,
    VALIDATE_BANK_INFO_REQUEST,

    SAVE_BANK_INFO_FULFILLED,
    SAVE_BANK_INFO_REJECTED,
    SAVE_BANK_INFO_REQUEST,

    DELETE_BANK_INFO_FULFILLED,
    DELETE_BANK_INFO_REJECTED,
    DELETE_BANK_INFO_REQUEST,

} from '../actions/actionTypes';

import {commonReducer, initial} from './commonReducer';

function bankInfo(state = initial, action) {
    return commonReducer(state, action, FETCH_BANK_INFO_REQUEST, FETCH_BANK_INFO_FULFILLED, FETCH_BANK_INFO_REJECTED);
}

function sepaCountryList(state = initial, action) {

    return commonReducer(state, action, FETCH_SEPA_COUNTRY_LIST_REQUEST, FETCH_SEPA_COUNTRY_LIST_FULFILLED, FETCH_SEPA_COUNTRY_LIST_REJECTED);

}

function validateBankInfo(state = initial, action) {

    return commonReducer(state, action, VALIDATE_BANK_INFO_REQUEST, VALIDATE_BANK_INFO_FULFILLED, VALIDATE_BANK_INFO_REJECTED);

}

function saveBankInfo(state = initial, action) {

    return commonReducer(state, action, SAVE_BANK_INFO_REQUEST, SAVE_BANK_INFO_FULFILLED, SAVE_BANK_INFO_REJECTED);

}

function deleteBankInfo(state = initial, action) {

    return commonReducer(state, action, DELETE_BANK_INFO_REQUEST, DELETE_BANK_INFO_FULFILLED, DELETE_BANK_INFO_REJECTED);

}


module.exports = {
    bankInfo,
    sepaCountryList,
    validateBankInfo,
    saveBankInfo,
    deleteBankInfo
};