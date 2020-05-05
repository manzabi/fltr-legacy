import React, { Component } from 'react';
import { connect } from 'react-redux';

import RecruiterFormKillerQuestions from './RecruiterFormKillerQuestions.js';
import AsynchContainer from '../../../fltr/template/AsynchContainer.js';

import { getKillerQuestionsOpportunity } from '../../../redux/actions/killerActions.js';

import * as killerConstants from '../../../constants/killerQuestions.js';
import { manageSuccess, manageErrorMessage } from '../../../common/utils.js';

@connect((state) => state)
export default class RecruiterFormKillerQuestionsEdit extends Component {

    
    componentDidMount() {
        const { id } = this.props.params;
        this.props.dispatch(getKillerQuestionsOpportunity(id,undefined,this.onError));
    }

    
    onError = () => {
        manageErrorMessage('FETCH_KILLER_QUESTIONS','Something went wrong');
    }

    render() {
        const objectStored = this.props.killerQuestionsData;

        return (
            <AsynchContainer data={objectStored} manageError={false}>
                <RecruiterFormKillerQuestions isEdit={true} data={objectStored.item}/>
            </AsynchContainer>
        );
    }
}