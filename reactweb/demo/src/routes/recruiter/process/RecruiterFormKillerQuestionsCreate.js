import React, { Component } from 'react';

import RecruiterFormKillerQuestions from './RecruiterFormKillerQuestions.js';

export default class RecruiterFormKillerQuestionsCreate extends Component {

    render() {
        return (
            <RecruiterFormKillerQuestions params={this.props.params}/>
        );
    }
}