import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as questions from '../attitude/questions';
import * as texts from '../attitude/attitudeTexts';
import attitudeLogic from '../components/businesslogic/attitude';

import { manageErrorApi } from '../../../utils/uiUtils';
import { setStorage } from '../../../utils/otherUtils';
import { goToProcess, goToProcessWithReplace, goToRecruiterDashboard } from '../../../utils/navigationManager';
import { calculateScore, findDomain } from '../attitude/evaluator';
import { submitAttitudeTest, submitAttitudeTestNoProcess } from '../../../redux/actions/processActions';
import { DEVELOPMENT, QA } from '../../../common/constants/environments';

import CommonConfirmModal from '../../../common/components/CommonConfirmModal';
import QuestionCard from './QuestionCard';
import FluttrButton from '../../../common/components/FluttrButton';
import ProgressBar from './ProgressBar';
import Timer from './timer';

@withRouter
@connect((state) => state)
export default class TestManagerForOpportunity2 extends Component {
    state = {
        pageNow: 1,
        questions: questions[navigator.language.substring(0, 2)] || questions['en'],
        questionsPerPage: 15,
        radios: [],
        now: Date.now(),
        MissingAnswers: true,
        showAlerts: false,
        language: (navigator.language.substring(0, 2) && texts.languages.includes(navigator.language.substring(0, 2))) ? navigator.language.substring(0, 2) : 'en',
        showLocalErrorModal: false,
        showNoProcessConfirmModal: false
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let answers = localStorage.getItem('attitude-answers');
        const { questions, questionsPerPage } = this.state;
        if (answers) {
            try {
                answers = JSON.parse(answers);
                let pageNow = Math.ceil(answers.length / questionsPerPage) + 1;
                let MissingAnswers = true;
                if (pageNow > Math.ceil(questions.length / questionsPerPage)) {
                    pageNow = Math.ceil(questions.length / questionsPerPage);
                    MissingAnswers = false;
                }
                this.setState({ pageNow, radios: answers, MissingAnswers });
            } catch (e) {
                localStorage.removeItem('attitude-answers');
                goToProcessWithReplace(this.getId());
            }
        }
    }

    getId = () => {
        return attitudeLogic.getId(this.props);
    }

    numberOfPages = () => {
        const { questions, questionsPerPage } = this.state;
        const pages = Math.ceil(questions.length / questionsPerPage) || 1;

        return pages;
    }

    languageSelector = ({ target: { value: language } }) => {
        this.setState({
            questions: questions[language],
            language
        });
    }

    returnSelectedIndexes = (page) => {
        const { questions, questionsPerPage } = this.state;

        const pages = this.numberOfPages();
        let firstIndex = questionsPerPage * (page - 1);
        let lastIndex;

        if (pages !== page) {
            lastIndex = questionsPerPage * page;
        } else {
            lastIndex = questions.length;
        }

        return { firstIndex, lastIndex };
    }

    returnSelectedQuestions = (page) => {
        const { questions } = this.state;

        const { firstIndex, lastIndex } = this.returnSelectedIndexes(page);

        const selectedQuestions = questions.slice(firstIndex, lastIndex);
        return selectedQuestions;
    }

    handleRadioChange = ({ currentTarget }) => {

        const { pageNow, questions, radios, questionsPerPage } = this.state;

        const { firstIndex } = this.returnSelectedIndexes(pageNow);

        const position = firstIndex + parseInt(currentTarget.getAttribute('name'));
        const score = parseInt(currentTarget.getAttribute('value'));
        const key = parseInt(currentTarget.getAttribute('pos'));
        const { domain, facet } = questions[position];
        let newRadios = [...radios];
        newRadios[position] = { score, domain, facet, key };

        const MissingAnswers = !this.allAnswered(newRadios);

        const isIE = false || !!document.documentMode;
        const isEdge = !isIE && !!window.StyleMedia;

        if ((navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) || isEdge || isIE) {
            this.setState({ radios: newRadios, error: null, MissingAnswers });
        } else if (MissingAnswers) {
            this.setState({ radios: newRadios, error: null, MissingAnswers }, this.scrollToNextQuestion(parseInt(currentTarget.getAttribute('name')) - 1));
        } else {
            this.setState({ radios: newRadios, error: null, MissingAnswers }, this.scrollToNextQuestion(questionsPerPage - 2));
        }
    }

    scrollToNextQuestion = (key) => {
        const element = document.getElementById(`question-${key + 1}`);
        if (element) {
            const top = element.offsetTop - 60;
            try {
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            } catch (e) {
                window.scrollTo(0, top);
            }
        }
    }

    backToProcess = () => {
        goToProcess(this.getId());
    }

    allAnswered = (radios) => {
        const { pageNow, questionsPerPage } = this.state;

        if (radios.length < pageNow * questionsPerPage) {
            return false;
        }

        return Object.values(radios).length === radios.length && radios.every(radio => radio);
    }

    goNextPage = () => {
        const { radios, MissingAnswers, questionsPerPage } = this.state;
        if (MissingAnswers) {
            let key = (radios.findIndex(answer => !answer) % (questionsPerPage)) - 1;
            if (key === -2 && (radios.length % questionsPerPage !== 0)) {
                key = (radios.length % questionsPerPage) - 2;
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(key));
            } else if (key === -1 || (key === -2 && (radios.length % questionsPerPage === 0))) {
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(-1));
            } else {
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(key - 1));
            }
        } else {
            window.scrollTo(0, 0);
            const pageNow = this.state.pageNow + 1;
            setStorage('attitude-answers', JSON.stringify(this.state.radios), () => this.setState({ showLocalErrorModal: true }));
            this.setState({ pageNow, MissingAnswers: true, showAlerts: false });
        }
    }

    proceed = () => {
        const { radios, MissingAnswers, questionsPerPage } = this.state;
        if (MissingAnswers) {
            let key = (radios.findIndex(answer => !answer) % (questionsPerPage)) - 1;
            if (key === -2 && (radios.length % questionsPerPage !== 0)) {
                key = (radios.length % questionsPerPage) - 2;
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(key));
            } else if (key === -1 || (key === -2 && (radios.length % questionsPerPage === 0))) {
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(-1));
            } else {
                this.setState({ showAlerts: true }, this.scrollToNextQuestion(key - 1));
            }
        } else {
            this.setState({ MissingAnswers: false }, this.proceedCallback());
        }
    }

    proceedCallback = () => {
        window.scrollTo(0, 0);
        setStorage('attitude-answers', JSON.stringify(this.state.radios), () => this.setState({ showLocalErrorModal: true }));
        const { radios } = this.state;
        const answers = {
            timeElapsed: Math.round((Date.now() - this.state.now) / 1000),
            dateStamp: Date.now(),
            totalQuestions: radios.length,
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

        const { processId } = this.props.match.params;
        if (processId) {
            this.props.dispatch(submitAttitudeTest(processId, request, this.onSuccess, this.onError));
        } else {
            this.props.dispatch(submitAttitudeTestNoProcess(request, this.onNoProcessSuccess, this.onNoProcessError));
        }
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

    onNoProcessSuccess = () => {
        this.setState({ showNoProcessConfirmModal: true });
    }

    onNoProcessError = (err) => {
        manageErrorApi(err, 'Impossible to submit the test');
    }

    __fillAllQuestions = () => {
        if (!this.state.radios.length) {
            const questionsArr = [...questions.es];

            const radios = questionsArr.map(({ domain, facet, choises }) => {
                const score = Math.floor(Math.random() * 5) + 1;
                const key = choises.find(ele => ele.score === score).color;
                return { score, domain, facet, key };
            });

            const pageNow = this.numberOfPages();
            window.scrollTo(0, document.body.scrollHeight);
            this.setState({ pageNow, radios, MissingAnswers: false });
        } else {
            this.setState({ pageNow: 1, radios: [], MissingAnswers: true });
        }
    }

    render() {
        const dev = (process.env.env === DEVELOPMENT);
        const qa = (process.env.env === QA);

        const selectedQuestions = this.returnSelectedQuestions(this.state.pageNow);
        const pages = this.numberOfPages();
        const { pageNow, MissingAnswers, radios, questionsPerPage, now, questions, showAlerts, language } = this.state;

        return (<div className='test-manager'>
            <div className='first-row-buttons-container'>
                <button className='btn btn-link fluttr-text-small' onClick={this.backToProcess} ><i className='fal fa-angle-double-left' /> go back</button>
                <select className='language-select' onChange={this.languageSelector} value={language}>
                    <option value='en'>english</option>
                    <option value='es'>español</option>
                </select>
            </div>
            <div className='attitude-test-container'>
                <CommonConfirmModal
                    open={this.state.showLocalErrorModal}
                    onConfirm={() => this.setState({ showLocalErrorModal: false })}
                    backdrop={true}
                    acceptText='OKAY'
                    showReject={false}
                >
                    <div>
                        <h2>Please, disable private mode</h2>
                        <p style={{ textAlign: 'center' }}>The application doesn't work in private mode on Safari.</p>
                    </div>
                </CommonConfirmModal>
                <CommonConfirmModal
                    open={this.state.showNoProcessConfirmModal}
                    onConfirm={goToRecruiterDashboard}
                    backdrop={false}
                    acceptText='OKAY'
                    showReject={false}
                >
                    <div>
                        <h2>Attitude test submitted correctly</h2>
                    </div>
                </CommonConfirmModal>
                <div className='attitude-questions-container'>
                    {(dev || qa) && <button onClick={this.__fillAllQuestions} >FILL/EMPTY ALL CHECKBOXES</button>}
                    {pageNow === 1 && <div>
                        <h2>{texts.title[language]}</h2>
                        <p>{texts.description[language][0]} <br />{texts.description[language][1]}</p>
                    </div>}
                    <div className='attitude-questions-array'>
                        {selectedQuestions.map((question, index) => <QuestionCard index={index} key={`Q${index + 1}`} language={language} question={question} radioSelected={radios[(pageNow - 1) * questionsPerPage + index]} handleRadioChange={this.handleRadioChange} showAlerts={showAlerts} />)}
                    </div>
                    {pageNow === pages ?
                        <FluttrButton size={'small'} type='orange' action={this.proceed}>FINISH</FluttrButton> :
                        <FluttrButton size={'small'} type='orange' action={this.goNextPage}>NEXT</FluttrButton>
                    }
                </div>
                <div className='progress-container'>
                    <div className='progress-container-firstrow'>
                        <div style={{ color: '#ffa602' }}>{MissingAnswers ? pageNow - 1 : pageNow} of {pages}</div>
                        <Timer start={now} />
                    </div>
                    <div>
                        <ProgressBar progress={!MissingAnswers && pageNow === Math.ceil(questions.length / questionsPerPage) ? 100 : MissingAnswers ? 100 * (pageNow - 1) / pages : 100 * pageNow / pages} />
                    </div>
                </div>
            </div >
        </div >);
    }
}