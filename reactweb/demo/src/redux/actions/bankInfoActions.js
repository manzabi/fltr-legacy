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

    FORM_VALIDATION_ERROR,
    FORM_SUBMISSION_STARTED,
    FORM_SUBMISSION_FINISHED

} from '../actions/actionTypes';

import axios from 'axios';


var Config = require('Config');
var querystring = require('querystring');


var API_ENDPOINTS = require('../../common/api_endpoints');

var Global = require('../../common/global_constants');


export function fetchBankInfo(){
    return function (dispatch) {
        dispatch({type: FETCH_BANK_INFO_REQUEST});
        setTimeout(function()
        {

            axios.get(Config.serverUrl + API_ENDPOINTS.bank_info, {
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: FETCH_BANK_INFO_FULFILLED,
                        payload: response.data

                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_BANK_INFO_REJECTED,
                        payload: err
                    });
                });

        }, 0);

    };
}

export function fetchSepaCountryList(){
    return function (dispatch) {
        dispatch({type: FETCH_SEPA_COUNTRY_LIST_REQUEST});
        setTimeout(function()
        {

            axios.get(Config.serverUrl + API_ENDPOINTS.bank_info_sepa_countries, {
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: FETCH_SEPA_COUNTRY_LIST_FULFILLED,
                        payload: response.data

                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_SEPA_COUNTRY_LIST_REJECTED,
                        payload: err
                    });
                });

        }, 0);

    };
}

export function validateBankInfo(bankInfoData) {

    return function (dispatch) {
        dispatch({type: VALIDATE_BANK_INFO_REQUEST});
        dispatch({type: FORM_SUBMISSION_STARTED});


        var trimmedIBAN = bankInfoData['iban'].replace(/\s+/g, '');
        axios.post(Config.serverUrl + API_ENDPOINTS.bank_info_validate,
            {
                country: bankInfoData['country'],
                iban: bankInfoData['iban'],
                swift: bankInfoData['swift'],
                holder: bankInfoData['holder'],

            }, {

                withCredentials: true
            })
            .then(function (response) {

                dispatch({
                    type: VALIDATE_BANK_INFO_FULFILLED,
                    payload: response.data

                });

                if(response.data.length == 0){
                    dispatch(saveBankInfo(bankInfoData));
                }else{

                    dispatch({
                        type: FORM_VALIDATION_ERROR,
                        payload: response.data

                    });


                    Messenger().post({
                        id: 'save-bank-info-error',
                        type: 'error',
                        singleton: false,
                        message: 'Validation error!',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_ERROR_DURATION
                    });
                }

            })
            .catch(function (err) {
                dispatch({
                    type: VALIDATE_BANK_INFO_REJECTED,
                    payload: err
                });

                dispatch({
                    type: FORM_SUBMISSION_FINISHED,
                    payload: false
                });


            });


    };

}

export function saveBankInfo(bankInfoData) {

    // console.log("SAVE_BANK_INFO_REQUEST");

    return function (dispatch) {
        dispatch({type: SAVE_BANK_INFO_REQUEST});
        setTimeout(function()
        {
            var trimmedIBAN = bankInfoData['iban'].replace(/\s+/g, '');
            axios.post(Config.serverUrl + API_ENDPOINTS.bank_info,
                {

                    country: bankInfoData['country'],
                    iban: bankInfoData['iban'],
                    swift: bankInfoData['swift'],
                    holder: bankInfoData['holder'],

                }, {

                    withCredentials: true
                })
                .then(function (response) {

                    dispatch({
                        type: SAVE_BANK_INFO_FULFILLED,
                        payload: response.data

                    });

                    dispatch({
                        type: FETCH_BANK_INFO_FULFILLED,
                        payload: response.data

                    });

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });

                    Messenger().post({
                        id: 'save-bank-info-ok',
                        type: 'info',
                        singleton: false,
                        message: 'Bank info saved successfully',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_INFO_DURATION
                    });

                })
                .catch(function (err) {

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });

                    dispatch({
                        type: SAVE_BANK_INFO_REJECTED,
                        payload: err
                    });

                    Messenger().post({
                        id: 'save-bank-info-error',
                        type: 'error',
                        singleton: false,
                        message: 'Error in saving bank information',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_ERROR_DURATION
                    });
                });

        }, 0);

    };

}

export function deleteBankInfo(){
    return function (dispatch) {
        dispatch({type: DELETE_BANK_INFO_REQUEST});
        dispatch({type: FORM_SUBMISSION_STARTED});

        setTimeout(function()
        {

            axios.delete(Config.serverUrl + API_ENDPOINTS.bank_info, {
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: DELETE_BANK_INFO_FULFILLED,
                        payload: response.data

                    });

                    dispatch({
                        type: FETCH_BANK_INFO_FULFILLED,
                        payload: response.data

                    });

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });

                    Messenger().post({
                        id: 'delete-bank-info-ok',
                        type: 'info',
                        singleton: false,
                        message: 'Bank info deleted successfully',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_INFO_DURATION
                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: DELETE_BANK_INFO_REJECTED,
                        payload: err
                    });

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });

                    Messenger().post({
                        id: 'delete-bank-info-error',
                        type: 'error',
                        singleton: false,
                        message: 'Error in deleting bank information',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_ERROR_DURATION
                    });
                });

        }, 3000);

    };
}