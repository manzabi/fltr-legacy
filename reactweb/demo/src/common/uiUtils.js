import {CLOSE, FOUND, LIVE, TO_INIT} from '../constants/opportunityStatus';

import {isSafari} from 'react-device-detect';

export function openFullScreenFix () {
    hideHeader();
    hideSidebar();
    hideBanner();
}

export function closeFullScreenFix () {
    showHeader();
    showSidebar();
    showBanner();
}

export function openModalFix () {
    hideHeader();
    hideSidebar();
    hideBanner();
}

export function closeModalFix () {
    showHeader();
    showSidebar();
    showBanner();
}


function hideBanner () {
    if (isSafari) {
        hideFixSafari('#upgrade-banner-container');
    } else {
        $('#upgrade-banner-container').css('z-index', 0);
    }
}

function showBanner() {
    if (isSafari) {
        showFixSafari('#upgrade-banner-container', 4);
    } else {
        $('#upgrade-banner-container').css('z-index', 4);
    }
}

function hideSidebar () {
    if (isSafari) {
        hideFixSafari('#crazy-sidebar');
    } else {
        $('#crazy-sidebar').css('z-index', 0);
    }
}

function showSidebar () {
    if (isSafari) {
        showFixSafari('#crazy-sidebar', 3);
    } else {
        $('#crazy-sidebar').css('z-index', 3);
    }
}

function hideHeader () {
    if (isSafari) {
        hideFixSafari('#crazy-header');
    } else {
        $('#crazy-header').css('z-index', 0);
    }
}

function showHeader () {
    if (isSafari) {
        showFixSafari('#crazy-header', 2);
    } else {
        $('#crazy-header').css('z-index', 2);
    }
}

function hideFixSafari (element) {
    $(element).css('z-index', -1);
    $('#main-body').css({width: '100%', height: '100%'});
}
function showFixSafari (element, value) {
    $(element).css('z-index', value);
    $('#main-body').css({width: '', height: ''});
}

export function getRandomBackground () {
    let numberofpictures = 12;
    let randomNum = Math.floor(Math.random() * numberofpictures) + 1;
    return getBackgroundById(randomNum);
}

export function getBackgroundById (id) {
    return '/imgs/app/fullscreen/bg_' + id + '.jpg';
}

export const HideIntercomTemporal = time => {
    $('#intercom-container').css('display', 'none');
    setTimeout(() => {
        $('#intercom-container').css('display', 'block');
    }, (time * 1200));
    setTimeout(() => {
        $('#intercom-container').css('display', 'none');
    }, (500));
};

export const hideIntercom = () => {
    $('#intercom-container').css('display', 'none');
};

export const showIntercom = () => {
    if (document.getElementsByClassName('toastr').length === 0) {
        $('#intercom-container').css('display', 'block');
    }
};


// NEW LAYOUT UI FUNCTIONS

export function hideMainScroll () {
    document.getElementById('main-body').classList.add('no-scroll');
}

export function showMainScroll () {
    document.getElementById('main-body').classList.remove('no-scroll');
}

export function getOpportunitySubString (opportunity) {
    if (opportunity) {
        const {statusId} = opportunity; {
            switch (statusId) {
                case LIVE: {
                    return ':color=green :tooltip=This test is activated.';
                }
                case CLOSE: {
                    return ':color=red :tooltip=This test is closed.';
                }
                case FOUND: {
                    return ':color=blue :tooltip=You hired a candidate.';
                }
                case TO_INIT: {
                    return ':color=grey :tooltip=This test is a draft.';
                }
                default: {
                    return null;
                }
            }
        }
    } else {
        return null;
    }
}