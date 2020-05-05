import { TEST_TYPE_CHALLENGE } from './procesTypes';

export const statusHeaders = {
    disabled: ['Assessment process by {:company}'],
    enabled: [
        '{:company} would like to know a little bit more about you.',
        'Complete the steps required below and demonstrate your interest and talent.'
    ],
    challengeEnabled: ['It’s time to show your skills!'],
    challengeAccepted: ['Whatch out! The timer is running…']
};
/** @description Returns the corresponding strings to show on the process header
 * @param {object} process The talent process object
 * @param {object} opportunity The object of the opportunity
 * @returns {Array}
 */

export function getStatusTitle (process, opportunity) {
    const processLive = process.live;
    const challenge = process.steps.filter((step) => step.type === TEST_TYPE_CHALLENGE)[0];
    const isChallengeEnabled = challenge && challenge.accepted === null && challenge.enabled === true;
    const isChallengeAccepted = challenge && challenge.accepted === true && challenge.done === false && challenge.expired === false;
    let message = statusHeaders.disabled;
    if (processLive) {
        message = statusHeaders.enabled;
        if (isChallengeEnabled) message = statusHeaders.challengeEnabled;
        else if (isChallengeAccepted) message = statusHeaders.challengeAccepted;
        if (opportunity) {
            const companyName = opportunity.company.name;
            message = message.map((line) => {
                line = line.replace('{:company}', companyName);
                return line;
            });
        }
    } else {
        message = statusHeaders.disabled;
    }
    return message;
}