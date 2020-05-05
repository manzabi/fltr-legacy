export const TEST_TYPE_KILLERQUESTION = 2;
export const TEST_TYPE_ATTITUDE = 1;
export const TEST_TYPE_CHALLENGE = 3;

const processTypes = [
    {
        type: TEST_TYPE_KILLERQUESTION,
        typeString: ['Few questions'],
        text: [
            '{:company} requires you to answer a few questions to proceed.',
            'Easy-pease, It will take less than a minute :)'
        ],
        textOk: ['Answers submitted'],
        textNotEnabled : ['Questions are not available now.'],
        textDeclined : ['You rejected to answer to the questions'],
        textExpired: ['Questions expired'],
        textWaitingResponse: [
            '{:company} requires you to answer a few questions to proceed.',
            'Easy-pease, It will take less than a minute :)'
        ]

    },
    {
        type: TEST_TYPE_ATTITUDE,
        typeString: ['Attitude test'],
        text: [
            '{:company} is looking for somebody with the right attitude.',
            'Here\'s a quick test to see if you match with what they are looking for. It will take less than 10 minutes to complete.'
        ],
        textOk: ['Attitude test completed'],
        textNotEnabled : ['Attitude test is not available now.'],
        textDeclined : ['You rejected to answer to the attitude test'],
        textExpired: ['Attitude test expired'],
        textWaitingResponse: [
            '{:company} is looking for somebody with the right attitude.',
            'Here\'s a quick test to see if you match with what they are looking for. It will take less than 10 minutes to complete.'
        ]
    },
    {
        type: TEST_TYPE_CHALLENGE,
        typeString: ['Challenge'],
        text: [
            '{:company} is asking you to show your talent by completing a challenge.',
            'You got this :)'
        ],
        textOk: ['Challenge submitted'],
        textNotEnabled : ['The challenge it\'s not active yet.', 'We\'ll send you an email when it starts.'],
        textDeclined : ['You rejected the challenge'],
        textExpired: ['Challenge expired'],
        textWaitingResponse: ['Challenge pending to submit, finish it before it expires!']
    }
];

export function getProcessById (processId, opportunity) {
    const processById = processTypes.filter((process) => process.type === processId)[0];
    if (processById !== undefined && processById.text !== undefined) {
        if (opportunity) {
            const companyName = opportunity.company.name;
            processById.text = processById.text.map((string) => {
                string = string.replace('{:company}' , companyName);
                return string;   
            });
            processById.textWaitingResponse = processById.textWaitingResponse.map((string) => {
                string = string.replace('{:company}' , companyName);
                return string;   
            });
        }
        return processById;
    } else {
        return {
            typeString : ['undefined'],
            text: ['undefined'],
            textOk: ['undefined'],
            textNotEnabled : ['undefined'],
            textDeclined : ['undefined'],
            textExpired: ['undefined']
        };
    }
}

export function getProcessText (processId, opportunity) {
    let process = getProcessById(processId, opportunity);
    return process.text;
}

export function getProcessTestOkString(processId){
    let process = getProcessById(processId);
    return process.textOk;
}

export function getProcessTypeString (processId) {
    let process = getProcessById(processId);
    return process.typeString;
}

export function getProcessTextNotEnabled (processId) {
    let process = getProcessById(processId);
    return process.textNotEnabled;
}

export function getProcessTextDeclined (processId) {
    let process = getProcessById(processId);
    return process.textDeclined;
}

export function getProcessTextExpired (processId) {
    let process = getProcessById(processId);
    return process.textExpired;
}

export function getPendingText (processId, opportunity) {
    let process = getProcessById(processId, opportunity);
    return process.textWaitingResponse;
}
