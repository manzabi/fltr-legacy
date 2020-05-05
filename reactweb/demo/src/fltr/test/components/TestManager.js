import React from 'react';

import {
    Row,
    Col,
    Grid,
    Badge,
    Button,
    Modal,
    OverlayTrigger,
    Tooltip,
    isBrowser
} from '@sketchpixy/rubix';

import Progressbar from './progressbar';
import Questions from './questions';
import TimerExample from './timer';

const config = {
    defaultLanguage: 'en',
    defaultLimit: 5,
    error : null,
    result : false
};

import * as questions from '../attitude/questions';
import {calculateScore, findDomain} from '../attitude/evaluator';
import TestResults from './results/TestResults';
import {scrollFix} from '../../navigation/NavigationManager';

/**
 * 120 questions from
 *
 * http://ipip.ori.org/
 *
 * to enable all the fields : $('.choiseBox[value=3]').each(function(){ $(this).click()});
 *
 */
export default class TestManager extends React.Component {
    constructor (props) {
        super(props);
        let i = 1;
        let questionsInstance = questions.es.map(q => Object.assign({}, q, {id: i++}));

        // fake init
        let radios = [];
        questionsInstance.map(q => {
            //radios[q.id] = {score: Math.floor(Math.random() * 5) + 1 , domain : q.domain, facet: q.facet};
            // radios[q.id] = {score: 5 , domain : q.domain, facet: q.facet};
        });

        // console.log('questions : ' + questionsInstance.length);

        this.state = {
            loading: true,
            choises: [],
            questions: questionsInstance,
            totalQuestions : i - 1,
            radios: radios,
            submitDisabled: true,
            now: Date.now(),
            buttonSubmitDisabled: true,
            hideMain: true,
            percent: 0,
            language: 'es'
        };

        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount () {
    //const ipCountry = "ip"//await getData(`${config.ipCountryUrl}${this.props.ip}`)
    //const country = ipCountry.countryCode || 'NO'
    //const data = await getData(`${config.dataUrl}?lang=${this.state.lang}&testType=${this.state.choosenTest}&limit=${config.defaultLimit}`)
    //this.setState({ ...data, loading: false, country: country })
    }

    async handleChange (e) {
        const name = e.target.name || e.target.getAttribute('name');
        const value = e.target.value || e.target.getAttribute('value');
        await this.setState({ [name]: value });
        if (this.state.country && this.state.age) {
            this.setState({ buttonSubmitDisabled: false });
        }

    }

    isAllChecked (radios, from, to) {
        const currentQuestions = radios.slice(from, to);
        return Object.keys(currentQuestions).length === config.defaultLimit;
    }

    isAllCheckedNew(checked){
        // console.log('checked : ' + checked + " total questions " + this.state.totalQuestions);
        return checked === this.state.totalQuestions;
    }

    checkAll(){
        let selected = Object.keys(this.state.radios).length;
        return selected == this.state.totalQuestions;
    }

    howManyChecked(radioStore){
        return Object.keys(radioStore).length;
    }

    handleRadioChange (e) {
        console.time('concatenation');

        let radioStore = this.state.radios;
        const selectedName = parseInt(e.currentTarget.getAttribute('name'));

        const selectedValue = parseInt(e.currentTarget.getAttribute('value'));
        const {domain, facet} = this.state.questions.find(c => c.id === selectedName);
        // console.log('facet : ' + facet);
        radioStore[selectedName] = {score: selectedValue, domain: domain, facet: facet};
        this.setState({radios: radioStore});

        let checkedCounter = this.howManyChecked(radioStore);
        const allChecked = this.isAllCheckedNew(checkedCounter);
        const percent = Math.round(checkedCounter / parseInt(this.state.totalQuestions) * 100);
        this.setState({submitDisabled: !allChecked, percent: percent, error: null});

        console.timeEnd('concatenation');
    }

    proceed(){
        let allChecked = this.checkAll();

        if (!allChecked){
            this.setState({
                error: 'You have to complete all the answers before'
            });
        } else {
            this.setState({ submitDisabled: true, loading: true, hideMain: true });
            scrollFix();
            this.state.radios.shift();
            const answers = {
                timeElapsed: Math.round((Date.now() - this.state.now) / 1000),
                dateStamp: Date.now(),
                totalQuestions: this.state.totalQuestions,
                answers: this.state.radios
            };
            // console.log(JSON.stringify(answers.answers));

            const scores = calculateScore(answers.answers);
            //const postRes = await postData(config.generatorUrl, answers)
            let data = {};
            data.data = scores;
            data.answers = this.state.radios;
            // console.log("data :" + JSON.stringify(data));

            // findDomain
            let dataMerged = findDomain(data.data);

            this.setState({
                result : true,
                scores : dataMerged,
                timeElapsed: answers.timeElapsed
            });
        }
    }

    print() {
        if (isBrowser()) {
            window.print();
            //$(".testManager").printElement();
            //this.printElem("testManager");
        }
    }



    render () {
        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={10} xsOffset={1} className="testManagerMainContainer">
                            <Grid className="testManager" id="testManager">
                                <Row>
                                    <Col xs={12}>
                                        <h1>Attitude Test</h1>
                                    </Col>
                                </Row>
                                {!this.state.result &&
                    <Row>
                        <Col xs={12}>
                            <form>
                                {
                                    this.state.questions.map(q =>
                                        <div>
                                            <Questions key={'Q' + q.id} {...q} radioSelected={this.state.radios} handleRadioChange={this.handleRadioChange} />
                                        </div>
                                    )
                                }
                            </form>
                        </Col>
                    </Row>
                                }
                                {this.state.result &&
                      <div>
                          <Row className='hidden-print'>
                              <Col xs={12} className="text-right">
                                  <Button outlined bsStyle='fluttrOrange' onClick={::this.print}>print results</Button>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                  <TestResults data={this.state.scores} choices={this.state.radios} timeElapsed={this.state.timeElapsed}/>
                              </Col>
                          </Row>
                          <Row className='hidden-print'>
                              <Col xs={12} className="text-right">
                                  <Button outlined bsStyle='fluttrOrange' onClick={::this.print}>print results</Button>
                              </Col>
                          </Row>
                      </div>
                                }
                            </Grid>
                        </Col>
                    </Row>
                </Grid>

                {!this.state.result &&
          <div className="bottomReviewContainer"
              style={{position: 'fixed', padding: '10px 10px 0px 10px', left: 0, right: 0, bottom: 0}}>
              <Grid>
                  <Row>
                      <Col xs={10} xsOffset={1}>
                          <Grid fluid={false} className="bottomReviewContainerContent">
                              <Row className="vertical-align">
                                  <Col xs={6} className="vertical-flex">
                                      <div style={{width: '100%'}}>
                                          <Progressbar progress={this.state.percent}/>
                                      </div>
                                  </Col>
                                  <Col xs={4} className="vertical-flex">
                                      <TimerExample start={this.state.now}/>
                                  </Col>
                                  <Col xs={2} className="vertical-flex">
                                      <div>
                                          <Button bsStyle="fluttrOrange" onClick={() => this.proceed()}>Submit</Button>
                                      </div>
                                  </Col>
                              </Row>
                              <Row>
                                  <Col xs={12} className="text-right">
                                      {this.state.error &&
                                      <div>
                                          <span className="fluttrRed">{this.state.error}</span>
                                      </div>
                                      }
                                  </Col>
                              </Row>
                          </Grid>
                      </Col>
                  </Row>
              </Grid>
          </div>
                }

            </div>
        );
    }
}
