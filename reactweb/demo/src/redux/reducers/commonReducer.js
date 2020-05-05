import {manageErrorMessage} from '../../common/utils';

export const initial = {isFetching: true, isError: false};

export function commonReducer (state = initial, action, requestAction, fulFilledAction, rejectedAction) {
    switch (action.type) {
        case requestAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }

            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: action.payload
            });
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }

            if (action.silent === undefined || !action.silent) {
                let message = action.payload;
                manageErrorMessage('reducer-error', message);
            }

            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });

        default:
            return state;
    }
}

export function commonReducerReset (state = initial, action, requestAction, fulFilledAction, rejectedAction, resetAction) {
    switch (action.type) {
        case resetAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false,
                item: null
            });
        }
        case requestAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }

            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: action.payload
            });
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }

            let message = 'Error completing your request';
            if (action.payload.response != null &&
                action.payload.response.data != null &&
                action.payload.response.data.message != null) {
                message = action.payload.response.data.message;
            }

            manageErrorMessage('reducer-error', message);

            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });
        default:
            return state;
    }
}

export function commonListReducer (state = initial, action, requestAction, fulFilledAction, rejectedAction) {
    switch (action.type) {
        case requestAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }

            if (action.payload.first) {
            // first page, replace item with first page result
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: action.payload
                });
            } else {
                // other pages, concat elements
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: (
                        Object.assign({},
                            action.payload,
                            {content: (!state.item) ? action.payload.content : state.item.content.concat(action.payload.content)})
                    )

                });
            }
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }

            let message = action.payload;
            manageErrorMessage('reducer-error', message);

            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });
        default:
            return state;
    }
}

export function commonResetList (state = initial, action, type) {
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';
    let resetAction = type + '_RESET';

    return commonListReducerReset(state, action, requestAction, fullfilledAction, rejectedAction, resetAction);
}

export function commonListReducerReset (state = initial, action, requestAction, fulFilledAction, rejectedAction, resetAction) {
    switch (action.type) {
        case resetAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false,
                item: null
            });
        }
        case requestAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }

            if (action.payload.first) {
            // first page, replace item with first page result
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: action.payload,
                    date: new Date()
                });
            } else {
            // other pages, concat elements
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: (
                        Object.assign({},
                            action.payload,
                            {content: (!state.item) ? action.payload.content : state.item.content.concat(action.payload.content)})
                    )

                });
            }
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }

            let message = action.payload;
            manageErrorMessage('reducer-error', message);

            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });
        default:
            return state;
    }
}

// use this when API response has no 'content' wrapper object
export function commonListReducerResetNoContentWrapper (state = initial, action, requestAction, fulFilledAction, rejectedAction, resetAction) {
    switch (action.type) {
        case resetAction: {
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: null
            });
        }
        case requestAction: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }

            if (action.payload.first) {
            // first page, replace item with first page result
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: action.payload
                });
            } else {
                return Object.assign({}, state, {
                    isFetching: false,
                    isError: false,
                    item: (
                        Object.assign({},
                            action.payload)
                    )

                });
            }
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }
            if (action.silent === undefined || !action.silent) {
                let message = 'Error completing your request';
                if (action.payload.response != null &&
                    action.payload.response.data != null &&
                    action.payload.response.data.message != null) {
                    message = action.payload.response.data.message;
                }

                manageErrorMessage('reducer-error', message);
            }

            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });

        default:
            return state;
    }
}

export function commonResponseNoContentWrapperWithReset (state = initial, action, type) {
    let requestAction = type + '_REQUEST';
    let fullfilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';
    let resetAction = type + '_RESET';

    return commonListReducerResetNoContentWrapper(state, action, requestAction, fullfilledAction, rejectedAction, resetAction);
}
