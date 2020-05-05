import axios from 'axios';
import { checkOnlineStatusAndProceed } from '../../fltr/utils/errorUtils';

export function getAction (type, url, params, dispatch, onSuccess, onError) {
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';
    dispatch({type: requestAction});
    const proceed = () => {
        axios.get(url, {
            withCredentials: true,
            params: params
        })
            .then((response) => {
                dispatch({
                    type: fullfilledAction,
                    payload: response.data
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError();
                }
            });

    }; 
    checkOnlineStatusAndProceed(proceed);
}

export function controlAction (type, controlledItem, action, dispatch, force = false, onSuccess) {
    function proceed () {
        const currentDate = new Date(Date.now()).valueOf();
        const standardTimeout = 5 * 60 * 1000;
        const nextUpdate = controlledItem && controlledItem.nextUpdate || new Date(Date.now() + (standardTimeout)).valueOf();
        const shouldUpdate = controlledItem && !controlledItem.nextUpdate || (controlledItem && (controlledItem.nextUpdate - currentDate) <= 0) || true;
        if (shouldUpdate || force) {
            const nextUpdate = new Date(Date.now() + (standardTimeout)).valueOf();
            if (onSuccess) {
                onSuccess(nextUpdate - currentDate);
            }
            dispatch({
                type,
                payload : {
                    nextUpdate
                }
            });
            action();
        } else if (!shouldUpdate){
            if (onSuccess) {
                onSuccess(nextUpdate - currentDate);
            }
        }
    }
    checkOnlineStatusAndProceed(proceed);
}

export function listingAction (type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});
    function proceed () {
        axios.get(url, {
            withCredentials: true,
            params: params
        })
            .then((response) => {
                dispatch({
                    type: fullfilledAction,
                    payload: response.data
                });
        
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
        
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError();
                }
            });
    
    }
    checkOnlineStatusAndProceed(proceed);
}

export function postAction (type, url, params, dispatch, onSuccess, onError, timer = 0) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    function proceed () {
        dispatch({type: requestAction});
        const TIME_START = Date.now();
        axios.post(url, params, {withCredentials: true})
            .then((response) => {
                const TIME_END = Date.now();
                const timeLapse = TIME_END - TIME_START;
                const delay = timer - timeLapse > 0 ? timer - timeLapse : 0;
                setTimeout(() => {
                    dispatch({
                        type: fullfilledAction,
                        payload: response.data
                    });
                    if (onSuccess) {
                        onSuccess(response.data);
                    }
                }, delay);
            })
            .catch((err) => {
                const TIME_END = Date.now();
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (onError) {
                    onError(err);
                }
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function postActionForId (id, type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});

    function proceed () {
        axios.post(url, params, {withCredentials: true})
            .then((response) => {
                let payload = {
                    id: id,
                    value: response.data
                };
                // console.log('dispatching : ' + JSON.stringify(payload));
    
                dispatch({
                    type: fullfilledAction,
                    payload: payload
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError(err);
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function putAction (type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    function proceed () {
        dispatch({type: requestAction});
    
        axios.put(url, params, {withCredentials: true})
            .then((response) => {
                dispatch({
                    type: fullfilledAction,
                    payload: response.data
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError(err);
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function getActionForId (id, type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});

    function proceed () {
        axios.get(url, {
            withCredentials: true,
            params: params
        })
            .then((response) => {
                let payload = {
                    id: id,
                    value: response.data
                };
                // console.log('dispatching : ' + JSON.stringify(payload));
    
                dispatch({
                    type: fullfilledAction,
                    payload: payload
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError(err);
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function putActionForId (id, type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});

    function proceed () {
        axios.put(url, params, {withCredentials: true})
            .then((response) => {
                let payload = {
                    id: id,
                    value: response.data
                };
                // console.log('dispatching : ' + JSON.stringify(payload));
    
                dispatch({
                    type: fullfilledAction,
                    payload: payload
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError(err);
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function deleteActionForId (id, type, url, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});

    function proceed () {
        axios.delete(url, {withCredentials: true})
            .then((response) => {
                let payload = {
                    id: id,
                    value: response.data
                };
                // console.log('dispatching : ' + JSON.stringify(payload));
    
                dispatch({
                    type: fullfilledAction,
                    payload: payload
                });
    
                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: rejectedAction,
                    payload: err
                });
    
                if (window && window.Raven) {
                    const response = err.response || {};
                    window.Raven.captureException(err.stack, {extra: {...response}});
                }
                if (onError) {
                    onError(err);
                }
            });
    }
    checkOnlineStatusAndProceed(proceed);
}

export function resetListingAction (type, dispatch, onSuccess) {
    // console.log('resetListingAction type : ' + type);
    let resetAction = type + '_RESET';
    dispatch({type: resetAction});

    if (onSuccess) {
        onSuccess();
    }
}

export function resetGetAction (type, dispatch, onSuccess) {
    let resetAction = type + '_RESET';
    dispatch({type: resetAction});

    if (onSuccess) {
        onSuccess();
    }
}
