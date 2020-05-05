'use strict';

const attitudeLogic = {

    /**
     * This function returns the opportunity id of that Component/route.
     * 
     * @param {object} props - The props of a React Component.
     * 
     * @returns {string} - The opportunity id.
     */
    getId(props) {

        if (props.id && typeof props.id !== 'string' && parseInt(props.id) !== parseInt(props.id)) throw new Error('props.id must be a string of a number');

        if (!props.id && props.match && props.match.params && (!props.match.params.opportunityId || typeof props.match.params.opportunityId !== 'string' && parseInt(props.match.params.opportunityId) !== parseInt(props.match.params.opportunityId))) throw new Error('props.params.match.opportunityId must be a string of a number');

        let id;

        if (props.id) {
            id = props.id;
        } else {
            id = props.match.params.opportunityId;
        }
        return id;
    },

    /**
     * Returns true if all questions have been answered and false otherwise.
     * 
     * @param {object} state 
     * 
     * @returns true if all boxes checked and false otherwise.
     */
    checkAll(state) {
        let selected = Object.keys(state.radios).length;
        if (state.radios[0] === null) selected--;
        return selected === state.totalQuestions;
    },

    /**
     * Super custom callback for the proceed function. It's the callback passed after setState.
     * 
     * @param {object} self - this
     * @param {function} calculateScore - imported function
     * @param {function} findDomain - imported function
     * @param {function} submitAttitudeTest - imported function
     */
    proceedCallback(self, calculateScore, findDomain, submitAttitudeTest) {
        window.scrollTo(0, 0);
        localStorage.setItem('attitude-answers', JSON.stringify(self.state.radios));
        let radios = [...self.state.radios];
        radios.shift();
        const answers = {
            timeElapsed: Math.round((Date.now() - self.state.now) / 1000),
            dateStamp: Date.now(),
            totalQuestions: self.state.totalQuestions,
            answers: radios
        };

        const scores = calculateScore(answers.answers);

        let data = {};
        data.data = scores;
        data.answers = radios;

        let dataMerged = findDomain(data.data);

        let request = {};
        request.answers = JSON.stringify(data.answers);
        request.results = JSON.stringify(dataMerged);

        const { processId } = self.props.match.params;
        self.props.dispatch(submitAttitudeTest(processId, request, self.onSuccess, self.onError));
    }
};

module.exports = attitudeLogic;