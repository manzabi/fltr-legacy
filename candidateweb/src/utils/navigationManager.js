import history from './history';

export const goToUrl = (url) => {
    history.push(url);
};

export const navigateToUrl = (url) => {
    window.location = url;
};

export const redirectToLoginPage = () => {
    const url = process.env.serverUrl + '/login';
    navigateToUrl(url);
};

export const goHome = () => {
    const URL = process.env.serverUrl;
    redirectToLoginPage(URL);
};

export const handleGoDashboard = () => {
    const URL = '/dashboard';
    history.push(URL);
};

export const goToEditProfile = () => {
    const url = process.env.serverUrl + '/bizAroundSite/fluttr/editProfile';
    navigateToUrl(url);
};

export const goToLogout = () => {
    window.localStorage.removeItem('auth');
    const url = process.env.serverUrl + '/bizAroundSite/logout';
    navigateToUrl(url);
};

export const goToDashboard = () => {
    const URL = '/dashboard';
    history.push(URL);
};

export const goToRecruiterDashboard = () => {
    const URL = process.env.serverUrl.replace('http://', 'http://web.').replace('https://', 'https://web.') + '/recruiter/dashboard';
    navigateToUrl(URL);
};

export const getToDashboard = () => {
    return '/dashboard';
};

export const goToKillerQuestionTest = (opportunityId, processId) => {
    const URL = `/opportunity/${opportunityId}/process/${processId}/questions`;
    history.push(URL);
};

export const goToAttitudeTest = (opportunityId, processId) => {
    const URL = `/opportunity/${opportunityId}/process/${processId}/attitude`;
    history.push(URL);
};

export const goToProcess = (opportunityId) => {
    const URL = `/opportunity/${opportunityId}/process`;
    history.push(URL);
};

export const goToProcessWithReplace = (opportunityId) => {
    const URL = `/opportunity/${opportunityId}/process`;
    history.replace(URL);
};

export const goToProcessStepAccept = (opportunityId, processId) => {
    const URL = `/opportunity/${opportunityId}/process/${processId}/accept`;
    history.push(URL);
};

export const getAttitudeOverview = (opportunityId) => {
    const URL = `/opportunity/${opportunityId}/attitude/leaderboard`;
    return URL;
};

// Route urls
export const getHome = () => {
    const URL = process.env.serverUrl;
    return URL;
};

export const getAbout = () => {
    const URL = `${process.env.serverUrl}/about`;
    return URL;
};
export const getForApplicants = () => {
    const URL = `${process.env.serverUrl}/opportunities/list`;
    return URL;
};
export const userLogin = () => {
    const URL = `${process.env.serverUrl}/login`;
    return URL;
};
export const getHowItWoks = () => {
    const URL = `${process.env.serverUrl}/how-it-works`;
    return URL;
};

export const getChallengeOverview = (opportunityId) => {
    const URL = `${process.env.serverUrl}/opportunities/${opportunityId}/play/overview`;
    return URL;
};

export const getForAcceptChallenge = (opportunityId) => {
    const URL = `${process.env.serverUrl}/o/${opportunityId}/ainvite`;
    return URL;
};

export const getForFormChallenge = (opportunityId) => {
    const URL = `${process.env.serverUrl}/opportunities/${opportunityId}/play/comp`;
    return URL;
};

export const getApplyInvitation = (opportunityId) => {
    const URL = `${process.env.serverUrl}/opportunities/${opportunityId}/match?accept=true`;
    return URL;
};
