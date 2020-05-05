import React from 'react';
import { connect } from 'react-redux';


import Progressbar from './progressbar';
import Questions from './questions';
import TimerExample from './timer';

import FluttrButton from '../../../common/components/FluttrButton';

import * as questions from '../attitude/questions';
import attitudeLogic from './businesslogic/attitude.js';
import { calculateScore, findDomain } from '../attitude/evaluator';
import { submitAttitudeTest } from '../../../redux/actions/processActions';
import { goToProcessWithReplace } from '../../../utils/navigationManager';
import { manageErrorApi } from '../../../utils/uiUtils';
import { withRouter } from 'react-router-dom';
import { DEVELOPMENT, QA } from '../../../common/constants/environments';

/**
 * 120 questions from
 *
 * http://ipip.ori.org/
 *
 */
@withRouter
@connect((state) => state)
export default class TestManagerForOpportunity extends React.Component {
    constructor(props) {
        super(props);
        let i = 1;
        let questionsInstance = questions.es.map(q => Object.assign({}, q, { id: i++ }));

        let radios = [];

        this.state = {
            loading: true,
            questions: questionsInstance,
            totalQuestions: i - 1,
            radios: radios,
            submitDisabled: true,
            now: Date.now(),
            buttonSubmitDisabled: true,
            hideMain: true,
            percent: 0,
            language: 'es'
        };
    }
    componentDidMount() {
        let answers = localStorage.getItem('attitude-answers');
        if (answers) {
            try {
                answers = JSON.parse(answers);
                let radioStore = answers.length;
                let percent = Math.round(radioStore / parseInt(this.state.totalQuestions) * 100);
                if (percent > 100) percent = 100;
                this.setState({
                    radios: answers,
                    percent
                });
            } catch (e) {
                localStorage.removeItem('attitude-answers');
                goToProcessWithReplace( this.getId());
            }
        }
    }

    getId = () => {
        return attitudeLogic.getId(this.props);
    }

    __fillAllQuestions = () => {
        //fake init on DEV and QA

        if (!this.checkAll()) {

            let i = 1;
            let questionsInstance = questions.es.map(q => Object.assign({}, q, { id: i++ }));

            let radios = [];
            questionsInstance.map(q => {
                radios[q.id] = { score: Math.floor(Math.random() * 5) + 1, domain: q.domain, facet: q.facet };
                // radios[q.id] = { score: 5, domain: q.domain, facet: q.facet };
            });

            this.setState({
                loading: true,
                questions: questionsInstance,
                totalQuestions: i - 1,
                radios: radios,
                submitDisabled: true,
                now: Date.now(),
                buttonSubmitDisabled: true,
                hideMain: true,
                percent: 100,
                language: 'es'
            });
        } else {
            let i = 1;
            let questionsInstance = questions.es.map(q => Object.assign({}, q, { id: i++ }));

            let radios = [];
            this.setState({
                loading: true,
                questions: questionsInstance,
                totalQuestions: i - 1,
                radios: radios,
                submitDisabled: true,
                now: Date.now(),
                buttonSubmitDisabled: true,
                hideMain: true,
                percent: 0,
                language: 'es'
            });
        }
    }

    handleChangeLanguage = ({ target: { value: language } }) => {
        let i = 1;
        const newQuestions = questions[language].map(q => Object.assign({}, q, { id: i++ }));
        this.setState({
            language,
            questions: newQuestions
        });
    }

    checkAll = () => {
        return attitudeLogic.checkAll(this.state);
    }

    howManyChecked = (radioStore) => {
        return Object.keys(radioStore).length;
    }

    handleRadioChange = ({ currentTarget }) => {
        const {radios, questions, totalQuestions} = this.state;

        const selectedName = parseInt(currentTarget.getAttribute('name'));
        const selectedValue = parseInt(currentTarget.getAttribute('value'));
        const { domain, facet } = questions.find(c => c.id === selectedName);
        radios[selectedName] = { score: selectedValue, domain: domain, facet: facet };
        
        const checkedCounter = this.howManyChecked(radios);
        const allChecked = this.checkAll();

        let percent = Math.round(checkedCounter / parseInt(totalQuestions) * 100);
        if (percent > 100) percent = 100;

        this.setState({ radios, submitDisabled: !allChecked, percent, error: null });
    }

    proceed = () => {
        this.setState({ submitDisabled: true, loading: true, hideMain: true },
            attitudeLogic.proceedCallback(this, calculateScore, findDomain, submitAttitudeTest)
        );
    }
    onSuccess = () => {
        if (localStorage.getItem('attitude-answers')) {
            localStorage.removeItem('attitude-answers');
        }

        goToProcessWithReplace(this.getId());

    }

    onError = (err) => {
        manageErrorApi(err, 'Impossible to submit the test');

        goToProcessWithReplace(this.getId());
    }

    render() {
        const dev = (process.env.env === DEVELOPMENT);
        const qa = (process.env.env === QA);
        const allChecked = this.checkAll();
        return (
            <div className='attitude-test-page'>
                <section className='attitude-test-container'>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <form>
                            <select onChange={this.handleChangeLanguage}>
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </form>
                        <div>Language:&nbsp;</div>
                        {(dev || qa) && <button onClick={this.__fillAllQuestions} >FILL/EMPTY ALL CHECKBOXES</button>
                        }
                    </div>
                    {dev &&
                        <strong style={{ color: 'red' }}>(Development prefilled mode on)</strong>
                    }
                    <h1>Attitude Test</h1>
                    {!this.state.result &&
                        <div>
                            <div>
                                <div>
                                    <form>
                                        {
                                            this.state.questions.map(q =>
                                                <div>
                                                    <Questions key={'Q' + q.id} {...q} radioSelected={this.state.radios} handleRadioChange={this.handleRadioChange} />
                                                </div>
                                            )
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                    {!this.state.result &&
                        <div className="bottom-review-container">
                            <div className="bottom-review-container-content">
                                <div className="progress-container">
                                    <div style={{ width: '100%' }}>
                                        <Progressbar progress={this.state.percent} />
                                    </div>
                                    <div className="vertical-flex">
                                        <TimerExample start={this.state.now} />
                                    </div>
                                    <div>
                                        <FluttrButton size={'medium'} type='orange' disabled={!allChecked} action={this.proceed} >Submit</FluttrButton>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-right">
                                        {this.state.error &&
                                            <div>
                                                <span className="fluttrRed">{this.state.error}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </section>
            </div>
        );
    }
}