export function getAction (axios, type, url, params, dispatch, onSuccess, onError) {
    let requestAction = type + '_request';
    let fullfilledAction = type + '_fulfilled';
    let rejectedAction = type + '_rejected';

    dispatch({type: requestAction});
    axios().get(url, {
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

            if (onError) {
                onError(err);
            }
        });
}

export function customGetAction (axios, type, url, params, dispatch, onSuccess, onError) {
    let requestAction = type + '_request';
    let fullfilledAction = type + '_fulfilled';
    let rejectedAction = type + '_rejected';

    dispatch({type: requestAction});
    axios.get(url, {
        params: params
    })
        .then((response) => {
            dispatch({
                type: fullfilledAction,
                payload: response
            });

            if (onSuccess) {
                onSuccess(response);
            }
        })
        .catch((err) => {
            dispatch({
                type: rejectedAction,
                payload: err
            });

            if (onError) {
                onError();
            }
        });
}

export function postAction (axios, type, url, data, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_request';
    let fullfilledAction = type + '_fulfilled';
    let rejectedAction = type + '_rejected';

    dispatch({type: requestAction});

    axios().post(url, data)
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

            if (onError) {
                onError(err);
            }
        });
}


export function putAction (axios, type, url, data, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_request';
    let fullfilledAction = type + '_fulfilled';
    let rejectedAction = type + '_rejected';

    dispatch({type: requestAction});

    axios().put(url, data)
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

            if (onError) {
                onError(err);
            }
        });
}

export function listingAction (axios, type, url, params, dispatch, onSuccess, onError) {
    // console.log('listingAction type : ' + type);
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';

    dispatch({type: requestAction});

    axios().get(url, {
        withCredentials: true,
        params: params
    })
        .then((response) => {
            dispatch({
                type: fullfilledAction,
                payload: response.data
            });

            if (onSuccess) {
                onSuccess();
            }
        })
        .catch((err) => {
            dispatch({
                type: rejectedAction,
                payload: err
            });

            if (onError) {
                onError();
            }
        });
}