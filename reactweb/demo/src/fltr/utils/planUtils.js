export function getChallengeAvailableSlots(user) {

    const slotsDetail = getSlotsDetail(user);
    if (slotsDetail == null) {
        return 0;
    }
    return slotsDetail.available;
}

export function getChallengeUsedSlots(user) {

    const slotsDetail = getSlotsDetail(user);
    if (slotsDetail == null) {
        return 0;
    }
    return slotsDetail.used;
}

export function getSlotsDetail(user) {

    //console.log("User : " + JSON.stringify(user));
    const company = user.recruiterDetails.company;
    if (company == null) {
        return null;
    }
    const plan = company.plan;
    return plan.slotsDetail;
}
