import React, { Component } from 'react';
import { connect } from 'react-redux';

import DropDown from '../../../common/components/DropDown.js';
import ButtonBarComponent from '../../../common/components/ButtonBarComponent.js';

import { goToRecruiterDashboard } from '../../../fltr/navigation/NavigationManager.js';

import * as killerConstants from '../../../constants/killerQuestions.js';
import { manageSuccess, manageErrorMessage } from '../../../common/utils.js';

import { submitKillerQuestionsOpportunity } from '../../../redux/actions/killerActions.js';

import PropTypes from 'prop-types';

@connect((state) => state)
export default class RecruiterFormKillerQuestions extends Component {
    state = {
        questions: this.props.data.questions,
        formType: this.props.data.type
    }
    //Need to map the recieved this.props.data

    printQuestion = (question, index) => {
        return (
            <div
                className={`challenge-task ${this.state.activeElement && this.state.activeElement === `editTaskWithId_${index}` ? 'active' : ''}`}
                data-hint='Add more questions as optional, to easily discard candidates if they dont fulfill the requirements'
            >
                <h3 style={{ padding: '20px' }}>{`Question ${index + 1}`}
                    <input type='checkbox'
                        tabIndex='-1'
                        onChange={(event) => this.handleChangeRequirementCheck(event, index)}
                        id={`requirementEdit_${index}_IsRequired`}
                        defaultChecked={question.required}
                    />
                    <span>
                        &nbsp;Validate
                    </span>
                </h3>
                <RecruiterFormKillerCard handleCardDropdown={this.handleCardDropdown} handleCardText={this.handleCardText} data={this.state.questions[index]} index={index} />
                {
                    this.printControls(index)
                }
            </div>
        );
    }
    printControls = (index) => {
        const currentElement = index + 1;
        const requirementNumber = this.state.questions.length;
        const isFirst = currentElement === 1;
        const isLast = currentElement === requirementNumber;
        return (
            <div className='task-controls'>
                <i title='Move requirement up'
                    className={`icon-entypo-arrow-bold-up ${isFirst ? 'disabled' : ''}`}
                    onClick={(event) => this.handleMoveElement(event, index, 'moveUp')}
                />
                <i title='Remove this requirement'
                    id={index} className='fas fa-trash-alt' onClick={this.handleRemoveQuestion}
                />
                <i title='Move requirement down'
                    className={`icon-entypo-arrow-bold-down ${isLast ? 'disabled' : ''}`}
                    onClick={(event) => this.handleMoveElement(event, index, 'moveDown')}
                />
            </div>
        );
    }
    handleMoveElement = (event, index, action) => {
        const id = index;
        const requirementNumber = this.state.questions.length - 1;
        let target;
        const moveElementToPosition = (initial, target) => {
            const targetItem = this.state.questions[initial];
            let newList = this.state.questions.filter((requirementNumber, index) => index !== initial);
            newList.splice(target, 0, targetItem);
            let { questions } = this.state;
            questions = newList;
            this.setState({
                questions,
                requirementsUpdated: true
            }, () => {
                this.setState({
                    requirementsUpdated: false
                }, this.populateParentState);
            });
        };
        const validAction = () => {
            if (action === 'moveUp') {
                if (id === 0) {
                    return false;
                } else {
                    target = id - 1;
                    return true;
                }
            } else if (action === 'moveDown') {
                if (id === requirementNumber) {
                    return false;
                } else {
                    target = id + 1;
                    return true;
                }
            }
        };
        if (validAction()) {
            moveElementToPosition(id, target);
        }
    }

    handleRemoveQuestion = ({ target }) => {

        const { id } = target;
        const elementToRemove = parseInt(id, 10);
        let { questions } = this.state;
        const updatedList = questions.filter((requirement, index) => {
            return index !== elementToRemove;
        });
        questions = [...updatedList];
        this.setState({
            questions,
            requirementsUpdated: true,
            modalStatus: false
        }, () => {
            this.setState({
                requirementsUpdated: false
            }, this.populateParentState);
        });

    }

    handleAddQuestion = () => {
        this.setState({
            questions: [...this.state.questions, { answerBoolean: true, content: '', required: false, type: killerConstants.questionType[0].value }]
        });
    }

    handleChangeRequirementCheck = ({ target: { checked } }, index) => {
        const { questions } = this.state;
        questions[index].required = checked;
        this.forceUpdate();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { questions, formType: type } = this.state;
        if (!questions.length) {
            manageErrorMessage('KILLERQUESTIONSUBMIT', 'You cannot submit zero questions');
        }
        else if (this.allTextAreasWithText()) {
            const jsonObject = {
                questions,
                type
            };
            const { id } = this.props.params;
            //validate all text boxes have text
            this.props.dispatch(submitKillerQuestionsOpportunity(id, jsonObject, this.onSuccess, this.onError));
        } else {
            manageErrorMessage('KILLERQUESTIONSUBMIT', 'You have to fill all the fields');
        }
    }

    allTextAreasWithText = () => {
        const { questions } = this.state;

        const result = questions.every(element => element.content !== undefined && element.content.trim().length);
        return result;
    }

    onSuccess = () => {
        manageSuccess('KILLERQUESTIONSUBMIT', 'Form sent correctly');
        goToRecruiterDashboard();
    }

    onError = () => {
        manageErrorMessage('KILLERQUESTIONSUBMIT', 'Oops, something went wrong');
    }

    handleCardText = (boxText, index) => {
        const { questions } = this.state;
        questions[index].content = boxText;
        this.forceUpdate();
    }

    handleCardDropdown = (value, id, index) => {
        const { questions } = this.state;
        switch (id) {
        case 'questionType':
            questions[index].type = value;
            this.forceUpdate();
            break;
        case 'questionAnswer':
            questions[index].answerBoolean = !!value;
            this.forceUpdate();
            break;
        case 'formType':
            this.setState({ formType: value });
            break;
        default:
            break;
        }
    }

    render() {
        const { questions } = this.state;
        return (
            <div className='fluttr-killer-page containerMaxSize'>
                {/* <h3>Type: </h3> <DropDown list={killerConstants.formType} changeTrigger={this.handleCardDropdown} reference='formType' /> */}
                {
                    this.state.formType === 2 ?
                        <div className="fluttr-form">
                            <form onSubmit={this.handleSubmit}>
                                <div
                                    className={`fluttr-input-frame full-size-frame ${questions.length !== 0 ? 'avoid-tip' : ''} ${this.state.activeElement && this.state.activeElement.includes('editTaskWithId_') ? 'active' : ''}`}
                                    data-hint='Add all the tasks that you want your candidates to complete. You can add as many as you want.'
                                >
                                    <h3>Questions</h3>
                                    {questions.map((question, index) => (
                                        this.printQuestion(question, index)

                                    ))}
                                    <div onClick={this.handleAddQuestion} className='requirement-add-container'>
                                        <span className='requirement-add-icon'>+</span>
                                        <span className='requirement-add-text'>
                                            {questions.length > 0 &&
                                                'Add another question' ||
                                                'Add a question for your candidates'
                                            }
                                        </span>
                                    </div>
                                </div>
                                <ButtonBarComponent fowardButtonText={this.props.isEdit ? 'Update' : 'Next'} onFoward={this.handleSubmit} />
                            </form>
                        </div>
                        :
                        <div>
                            New types in the future. Check Discard for now.
                        </div>
                }
            </div>
        );
    }
}

//initialQuestions types could change in the future due having new types of forms

RecruiterFormKillerQuestions.PropTypes = {
    isEdit: PropTypes.bool.isRequired,
    data: PropTypes.shape({
        type: PropTypes.number.isRequired,
        questions: PropTypes.arrayOf(PropTypes.shape({
            content: PropTypes.string.isRequired,
            type: PropTypes.number.isRequired,
            required: PropTypes.bool.isRequired
        }))
    })
};

RecruiterFormKillerQuestions.defaultProps = {
    isEdit: false,
    data: { type: 2, questions: [{ answerBoolean: true, content: '', required: false, type: killerConstants.questionType[0].value }] }
};

class RecruiterFormKillerCard extends Component {

    handleText = ({ target: { value: boxText } }) => {
        this.props.handleCardText(boxText, this.props.index);
    }

    handleDropdown = (value, id) => {
        const dropDownTypes = ['questionType', 'questionAnswer'];
        const parsedValue = parseInt(value);
        if (parsedValue === parsedValue) {
            dropDownTypes.includes(id) ? this.props.handleCardDropdown(parsedValue, id, this.props.index) : null;
        }
    }

    render() {
        const { data } = this.props;
        return (
            <div className="card-container" >
                <div className="fluttr-input">
                    <h4>Input your question below:</h4>
                    <textarea onChange={this.handleText} placeholder='Input the question here' value={data.content || ''} />
                </div>
                <div className="dropdowns-container">
                    <div>
                        <h4>Type:</h4>
                        <DropDown list={killerConstants.questionType} changeTrigger={this.handleDropdown} reference='questionType' />
                    </div>
                    {data.required && <div>
                        <h4>Answer:</h4>
                        <DropDown list={killerConstants.questionType[0].possibleAnswers} changeTrigger={this.handleDropdown} reference='questionAnswer' value={1} />
                    </div>}
                </div>
            </div>

        );
    }
}