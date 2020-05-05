export const actions = {
    LIMIT_BANNER_SHOW: 'LIMIT_BANNER_SHOW',
    LIMIT_BANNER_HIDE: 'LIMIT_BANNER_HIDE',
    MAIN_SCROLL_SHOW: 'MAIN_SCROLL_SHOW',
    MAIN_SCROLL_HIDE: 'MAIN_SCROLL_HIDE',
    HEADER_SET_TITLE: 'HEADER_SET_TITLE'
};

export function showLimitBanner () {
    return function (dispatch) {
        dispatch({
            type: actions.LIMIT_BANNER_SHOW,
        });
    };
}

export function hideLimitBanner () {
    return function (dispatch) {
        dispatch({
            type: actions.LIMIT_BANNER_HIDE,
        });
    };
}

export function showMainScroll () {
    return function (dispatch) {
        dispatch({
            type: actions.MAIN_SCROLL_SHOW,
        });
    };
}

export function hideMainScroll () {
    return function (dispatch) {
        dispatch({
            type: actions.MAIN_SCROLL_HIDE,
        });
    };
}

export function getClearTitle (text) {
    return text.split(':color')[0].split(':tooltip')[0];
}

export function setHeaderTitle (title) {
    return function (dispatch) {
        if (!title) {
            document.title = `${document.title.includes('* ') ? '* ' : ''}Fluttr console`;
            dispatch({
                type: `${actions.HEADER_SET_TITLE}_RESET`
            });
        } else {
            document.title = `${document.title.includes('* ') ? '* ' : ''} ${getClearTitle(title[title.length - 1].text)}`;
            dispatch({
                type: `${actions.HEADER_SET_TITLE}_SET`,
                payload: title
            });
        }
    };
}