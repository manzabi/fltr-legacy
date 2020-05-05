import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchProcessData, submitProcessData } from '../../redux/actions/processActions';

import AsyncContainer from '../../components/asyncComponents/AsyncContainer';
import FluttrButton from '../../common/components/FluttrButton';
import CommonConfirmModal from '../../common/components/CommonConfirmModal';


import { YES_NO, RESPONSE_TYPES } from '../../common/constants/killerQuestionsTypes';
import { goToProcess } from '../../utils/navigationManager';
import { manageErrorApi } from '../../utils/uiUtils';

class KillerQuestionProcess extends Component {

    state = {
        open: false
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.dispatch(fetchProcessData(id, null, this.goBackToProcess));
    }

    handleSubmit = (data) => {
        const { id } = this.props.match.params;
        this.props.dispatch(submitProcessData(id, { answers: data }, this.onQuestionsSucess, this.onQuestionsError));
    }

    onQuestionsSucess = ({ discarted }) => {
        this.setState({ discarted }, this.openModal);
    }

    onQuestionsError = (err) => {
        const { opportunityId } = this.props.match.params;
        manageErrorApi(err, 'ERROR: ');
        goToProcess(opportunityId);
    }

    goBackToProcess = () => {
        const { opportunityId } = this.props.match.params;
        goToProcess(opportunityId);
    }

    openModal = () => {
        this.setState({ open: true });
    }

    render() {
        return (
            <section className='killer-questions-component'>
                <AsyncContainer data={[this.props.process]}>
                    {/* <button onClick={this.openModal} >SHOW MODAL DUMMY</button> */}
                    <CommonConfirmModal onConfirm={this.goBackToProcess} acceptText='OKAY' buttonSize='xSmall' backdrop={false} open={this.state.open} onClose={this.goBackToProcess} showReject={false} >
                        {this.state.discarted ? (<div className='modal-content-details'>
                            <h2>We are sorry :(</h2>
                            <p>Thank you for completing the application but unfourtantely your answers don’t match with the job requirements. Don’t give up, there are plenty of other opportunties out there waiting for you!</p>
                        </div>
                        ) : (<div className='modal-content-details'>
                            <h2>Congratulations :)</h2>
                            <p>Woohoo! Your answers matched the job requirements. You will now proceed to the next step of the assessment process.</p>
                        </div>)}
                    </CommonConfirmModal>
                    <PlayerKillerProcessComponent goBackToProcess={this.goBackToProcess} process={this.props.process.item} handleSubmitProcess={this.handleSubmit} />
                </AsyncContainer>
            </section>
        );
    }
}

function mapStateToProps({ process }) {
    return {
        process
    };
}

export default connect(mapStateToProps)(withRouter(KillerQuestionProcess));

class PlayerKillerProcessComponent extends Component {
    constructor(props) {
        super(props);
        const questions = props.process.map((question) => {
            const { content, id, type, required = true } = question;
            return {
                value: null,
                content,
                id,
                type,
                required
            };
        });
        this.state = {
            questions,
            loading: false
        };
    }

    handleYesNoResponse = (id, response) => {
        const modifiedQuestions = this.state.questions.map((question) => {
            if (question.id === id) {
                question.value = response;
                return question;
            } else return question;
        });
        this.setState({
            questions: modifiedQuestions
        });
    }

    renderQuestionByType = (question) => {
        const { content, id, type, required, value } = question;
        switch (type) {
        case YES_NO:
            return (
                <div className='fluttr-killerquestion' key={id}>
                    <p className={`question-detail${required ? ' is-required' : ''}`}>{content}</p>
                    <div className='answer-area'>
                        <button className={`btn btn-xsmall ${value === false ? 'btn-green' : 'btn-link btn-inverse'}`} onClick={() => this.handleYesNoResponse(id, false)}>NO</button>
                        <button className={`btn btn-xsmall ${value === true ? 'btn-green' : 'btn-link btn-inverse'}`} onClick={() => this.handleYesNoResponse(id, true)}>YES</button>
                    </div>
                </div>
            );
        }
    }

    handleSendAnswers = () => {
        const valid = this.state.questions.every((question) => {
            if (question.required && question.value === null) {
                return false;
            } else return true;
        });
        if (valid) {
            this.setState({
                loading: true
            });
            const response = this.state.questions.map((question) => {
                const { id, type, value } = question;
                const responseType = RESPONSE_TYPES.filter(({ id }) => id === type)[0].responseName;
                return {
                    [responseType]: value,
                    id
                };
            });
            this.props.handleSubmitProcess(response);
        }
    }

    areAllQuestionsAnswered = () => {
        const { questions } = this.state;
        const areAllAnswered = questions.every(question => question.value !== null);
        return areAllAnswered;
    }

    render() {
        const allAnswered = this.areAllQuestionsAnswered();
        return (
            <div>
                <div className='back-btn-container'>
                    <button className='btn btn-link fluttr-text-small' onClick={this.props.goBackToProcess} ><i className='fal fa-angle-double-left' /> go back</button>
                </div>
                <div className='fluttr-talent-form'>
                    <h2>Required Questions</h2>
                    <p className='fluttr-talent-form-instructions fluttr-text-small'>
                        First at all, we need you to answer some required questions.
                        This step is important so that the company your are applying for can validate your information for the job position.
                    </p>
                    {this.state.questions.map((question) => {
                        return this.renderQuestionByType(question);
                    })}
                    <div className='send-button-container'>
                        <FluttrButton className='btn btn-orange btn-xsmall' type='orange' disabled={!allAnswered} loading={this.state.loading} action={this.handleSendAnswers}>SEND</FluttrButton>
                    </div>
                </div>
            </div>
        );
    }
}