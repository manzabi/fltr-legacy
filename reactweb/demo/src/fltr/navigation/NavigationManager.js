import React from 'react';
import { browserHistory } from 'react-router';
import { parseExtraParams } from '../utils/urlUtils';

var Config = require('Config');

export default class NavigationManager extends React.Component {

    render() {
        return null;
    }
}

export function getUrl(path) {
    return Config.serverUrl + path;
}

export function goBack() {
    browserHistory.goBack();
}

export function redirectToUrl(path) {
    window.location.replace(getUrl(path));
}

export const WEB_BASEPATH = '/bizAroundSite';
export const WEB_SEARCH_A_JOB = WEB_BASEPATH + '/opportunities/list';
export const WEB_SEARCH_A_TALENT = WEB_BASEPATH + '/employers';

export function moveTo(url) {
    browserHistory.push(url);
    scrollFix();
}

export function replaceTo(url) {
    browserHistory.replace(url);
    scrollFix();
}

/* Recruiters */
export function goToRecruiterDashboard(confirm = 'none', id = 0) {
    let url = '/recruiter/dashboard';
    if (confirm != 'none') {
        url += '?confirm=' + confirm;
        if (id != 0) {
            url += '&id=' + id;
        }
    }
    moveTo(url);
}

export function goToRecruiterLandingPage() {
    let url = '/recruiter/landing';
    moveTo(url);
}

export const goToUpgrade = () => {
    const url = '/recruiter/company/upgrade';
    moveTo(url);
};

export const goToContacSales = (type) => {
    const url = `/recruiter/company/upgrade/contact/${type}`;
    moveTo(url);
};

export const goToContactSuccess = () => {
    const url = '/recruiter/dashboard?contact=success';
    moveTo(url);
};

export const goToUpgradeSuccess = () => {
    const url = '/recruiter/dashboard?upgrade=success';
    moveTo(url);
};

export function goToRecruiterCompleteProfile() {
    let url = '/recruiter/profile/complete';
    moveTo(url);
}

export function goToTemplatesList() {
    const url = '/judge/templates';
    moveTo(url);
}

export function goToCreateNewTemplate() {
    const url = '/judge/template/create';
    moveTo(url);
}
export function goToEditTemplate(id) {
    let url = `/judge/template/${id}/edit`;
    moveTo(url);
}

export function goToPreviewTemplate(templateId, opportunityId = null) {
    switch (opportunityId) {
        case null: {
            const url = `/recruiter/opportunity/template/${templateId}`;
            moveTo(url);
            break;
        }
        default: {
            const url = `/recruiter/opportunity/${opportunityId}/template/${templateId}`;
            moveTo(url);
            break;
        }
    }
}

// goToNotifications


export function goToRecruiterEditProfile() {
    let url = '/recruiter/profile/edit';
    moveTo(url);
}

export function goToBoarding() {
    let url = '/recruiter/boarding';
    moveTo(url);
}

export function goToOpportunityDetail(id) {
    let url = '/recruiter/opportunity/{:id}'.replace('{:id}', id);
    moveTo(url);
}

export function goToApplicants(id) {
    let url = '/recruiter/opportunity/{:id}/applicants'.replace('{:id}', id);
    moveTo(url);
}
// company create
export function goToRecruiterCompanyCreate() {
    let url = '/recruiter/company/create';
    moveTo(url);
}
export function goToRecruiterCompanyModify(id) {
    let url = '/recruiter/company/{:id}'.replace('{:id}', id);
    moveTo(url);
}

// Opportunity Create
export function goToRecruiterCeateLivePage(id) {
    const url = `/recruiter/opportunity/${id}/create/live`;
    moveTo(url);
}
export function goToRecruiterChallengeLivePage(id) {
    const url = `/recruiter/opportunity/${id}/challenge/live`;
    moveTo(url);
}

export function goToRecruiterOpportunityCreateConfiguration() {
    const url = '/recruiter/opportunity/create/configuration';
    moveTo(url);
}

export function goToCreateTest() {
    const url = '/recruiter/opportunity/create';
    moveTo(url);
}

export function goToOpportunityConfigureProviders(id, isCreate) {
    const url = `/recruiter/opportunity/${id}/providers${isCreate ? '?create=true' : ''}`;
    moveTo(url);
}

export function goToRecruiterEditTags(id) {
    let url = '/recruiter/opportunity/{:id}/tag'.replace('{:id}', id);
    moveTo(url);
}

// Opportunity configure
export function goToRecruiterConfigure(id, context = null, extraParams) {
    let url = '/recruiter/opportunity/{:id}/configuration'.replace('{:id}', id);
    if (context) url += `&context=${context}`;
    if (extraParams) url += `&${parseExtraParams(extraParams)}`;
    url = url.replace('&', '?');
    moveTo(url);
}

export function replaceToRecruiterConfigure(id, context = null, extraParams) {
    let url = '/recruiter/opportunity/{:id}/configuration'.replace('{:id}', id);
    if (context) url += `&context=${context}`;
    if (extraParams) url += `&${parseExtraParams(extraParams)}`;
    url = url.replace('&', '?');
    replaceTo(url);
}

// Opportunity update
export function goToRecruiterOpportunityUpdate(id) {
    let url = '/recruiter/opportunity/{:id}/update'.replace('{:id}', id);
    moveTo(url);
}

// Challenge Test
export function goToRecruiterEditChallenge(id, context) {
    let params = '';
    if (context) {
        params = `?context=${context}`;
    }
    let url = '/recruiter/opportunity/{:id}/challenge/update'.replace('{:id}', id) + params;
    moveTo(url);
}
// Others

export function goToRecruiterAnswerUserToChallenge(id, userId) {
    let url = '/recruiter/opportunity/{:id}/user/{:userId}/answer'.replace('{:id}', id).replace('{:userId}', userId);
    moveTo(url);
}

// Preview Challenge

// Edit

export function goToChallengeTemplate(id, context = 'use') {
    let url = `/recruiter/opportunity/template/${id}`;
    switch (context) {
        case 'edit':
            url += '?context=edit';
            break;
        default:
            break;
    }
    moveTo(url);
}

/* Experts */

export function goToExpertDashboard(completed = false) {
    let url = '/judge/dashboard';
    if (completed) {
        url = url + '?completed=true';
    }
    moveTo(url);
}

export function goToExpertLandingPage() {
    let url = '/judge/landing';
    moveTo(url);
}

export function goToExpertCompleteProfile() {
    let url = '/judge/profile/complete';
    moveTo(url);
}

export function goToExpertEditProfile() {
    let url = '/judge/profile/edit';
    moveTo(url);
}

export function goToPendingInvitations() {
    let url = '/judge/opportunity/pending';
    moveTo(url);
}

export function goToReviewForExpert(id) {
    let url = '/judge/opportunity/{:id}/review'.replace('{:id}', id);
    moveTo(url);
}

export function goToReviewUserForExpert(id, userId, source = 'normal') {
    let url = '/judge/opportunity/{:id}/user/{:userId}/review?source={:source}'.replace('{:id}', id).replace('{:userId}', userId).replace('{:source}', source);
    moveTo(url);
}

export function goToReviewUserEditForExpert(id, userId, source = 'normal') {
    let url = '/judge/opportunity/{:id}/user/{:userId}/review/edit?source={:source}'.replace('{:id}', id).replace('{:userId}', userId).replace('{:source}', source);
    moveTo(url);
}

export function getReviewUserForExpert(id, userId, source = 'normal') {
    let url = '/judge/opportunity/{:id}/user/{:userId}/review?source={:source}'.replace('{:id}', id).replace('{:userId}', userId).replace('{:source}', source);
    return url;
}

export function goToExpertCreateChallenge(id) {
    let url = '/judge/opportunity/{:id}/challenge/create'.replace('{:id}', id);
    moveTo(url);
}

export function goToExpertCreateChallengeTyped(id, type) {
    let url = '/judge/opportunity/{:id}/challenge/create/{:type}'.replace('{:id}', id).replace('{:type}', type);
    moveTo(url);
}

// Template routes

export function goToRecruiterOpportunityConfigurationDetail(opportunity, context) {
    let url = `/recruiter/opportunity/${opportunity}/configuration${context !== undefined ? `/editor/${context}` : ''}`;
    moveTo(url);
}

export function goToRecruiterOpportunityConfigurationTemplateList(opportunity) {
    let url = `/recruiter/opportunity/${opportunity}/configuration/templates`;
    moveTo(url);
}

export function goToRecruiterOpportunityConfigurationTemplatePreview(opportunity, template) {
    let url = `/recruiter/opportunity/${opportunity}/configuration/preview/${template}`;
    browserHistory.push(url);
}

export function goToRecruiterOpportunityChallengeConfigurationTemplate(opportunity, template) {
    let url = `/recruiter/opportunity/${opportunity}/challenge/configuration/template/${template}`;
    moveTo(url);
}

export function gotoServiceUnavailable() {
    const url = '/service-unavailable';
    browserHistory.push(url);
}

/**
 * @description This function scrolls to the top of the screen when executed
 */
export function scrollFix(element = 'main-body') {
    const body = document.getElementById(element);
    try {
        body.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    } catch (e) {
        body.scrollTo(0, 0);
    }
}

export function scrollTo(top = undefined, left = undefined, element = 'main-body') {
    const body = document.getElementById(element);
    try {
        body.scrollTo({
            top,
            left,
            behavior: 'smooth'
        });
    } catch (e) {
        body.scrollTo(top, left);
    }
}

// GET FUNCTIONS TO USE REACT LINKS
export function getRecruiterDashboard() {
    return '/recruiter/dashboard';
}
export function getExpertDashboard() {
    return '/judge/dashboard';
}

export function getExpertActiveChallenges() {
    return '/judge/opportunity/active';
}

export function getExpertManageTemplates() {
    return '/judge/templates';
}

export function goToLoginPage () {
    window.location.href = Config.webLoginPage;
}