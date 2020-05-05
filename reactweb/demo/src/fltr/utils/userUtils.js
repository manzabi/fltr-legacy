export function getExpertsForOpportunity (opportunity) {
    if (opportunity) {
        try {
            return opportunity.recruiterDetail.configuration.configurationExpert.experts;
        }
        catch (e) {
            return [];
        }
    } else {
        throw new Error(`Wrong input, opportunity value it's ${opportunity} but expected an object`);
    }
}

export function getRecruitersForOpportunity (opportunity) {
    if (opportunity) {
        try {
            return opportunity.recruiterDetail.configuration.configurationMember.members;
        }
        catch (e) {
            return [];
        }
    } else {
        throw new Error(`Wrong input, opportunity value it's ${opportunity} but expected an object`);
    }
}

export function getUserEmailOrName (user) {
    return user.user && user.user.completeName.trim() && user.user.completeName || user.user && user.user.email || user.email;
}