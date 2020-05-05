// User endpoints
export const USER_DATA = '/user';

//Process endpoints
export const PROCESS_DATA = '/process/{id}/killerquestion';

// Opportunity endpopints
export const OPPORTUNITY_DATA = '/opportunity/{id}';
export const OPPORTUNITY_PROCESS_DATA = '/opportunity/{id}/process';
export const OPPORTUNITY_CHALLENGE = '/opportunity/{id}/challenge';
export const OPPORTUNITY_CHALLENGE_ACCEPT = '/process/{id}/accept';
export const OPPORTUNITY_INVITATION = '/opportunity/{id}/process/invitation/check/{code}';

export const OPPORTUNITY_SEARCH = '/opportunity/search';
// Process endpoints
export const PROCESS_ATTITUDE = '/process/{id}/attitude';
export const PROCESS_ATTITUDE_NO_PROCESS = '/process/attitude';
export const OPPORTUNITY_ATTITUDE_LEADERBOARD = '/opportunity/{id}/process/leaderboard';
