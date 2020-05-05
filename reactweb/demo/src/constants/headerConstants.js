import {
    getExpertActiveChallenges,
    getExpertDashboard,
    getRecruiterDashboard,
    getExpertManageTemplates
} from '../fltr/navigation/NavigationManager';

export const RECRUITER_DASHBOARD = 'RECRUITER_DASHBOARD';
export const EXPERT_DASHBOARD = 'EXPERT_DASHBOARD';
export const EXPERT_ACTIVE_TESTS = 'EXPERT_ACTIVE_TESTS';
export const EXPERT_MANAGE_TEMPLATES = 'EXPERT_MANAGE_TEMPLATES';
export const NOTIFICATIONS = 'NOTIFICATIONS';

const categories = [
    {
        id: 'RECRUITER_DASHBOARD',
        text: 'My tests',
        path: getRecruiterDashboard(),
        icon: 'icon-tests'
    },
    {
        id: 'EXPERT_DASHBOARD',
        text: 'Pending tasks',
        path: getExpertDashboard(),
        icon: 'icon-mail'
    },
    {
        id: 'EXPERT_ACTIVE_TESTS',
        text: 'Tests to assess',
        path: getExpertActiveChallenges(),
        icon: 'icon-tests'
    },
    {
        id: 'EXPERT_MANAGE_TEMPLATES',
        text: 'Manage templates',
        path: getExpertManageTemplates(),
        icon: 'icon-tests'
    },{
        id: 'NOTIFICATIONS',
        text: 'Notifications',
        path: '/notifications',
        icon: 'icon-bell'
    },

];

export function getCategory (type) {
    const selectedCategory = categories.find((element) => element.id === type);
    if (selectedCategory) {
        return selectedCategory;
    } else {
        const error = new Error(`The category "${type}" does't exist`);
        window.Raven.captureException(error, {extra: {
            searchingCategory: type,
            availableCategories:  categories.map((category) => category.id),
            emptyQuery: type === undefined
        }});
    }
}