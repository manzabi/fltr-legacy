import React from 'react';
import { connect } from 'react-redux';
import {CSVLink, CSVDownload} from 'react-csv';

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
import {getAttitude, submitAttitudeTest} from '../../../redux/actions/attitudeActions';
import {redirectToUrl} from '../../navigation/NavigationManager';
import Spinner from '../../Spinner';

/**
 * 120 questions from
 *
 * http://ipip.ori.org/
 *
 */
@connect((state) => state)
export default class TestManagerResult extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            result: false
        };

    }

    getId(){
        let id;
        if(this.props.id){
            id = this.props.id;
        }else{
            id = this.props.params.id;
        }
        return id;
    }

    componentDidMount () {
        // console.log('user : ' + this.getId());

        this.props.dispatch(getAttitude(this.getId(), this.onLoadOk.bind(this)));
    }

    onLoadOk(data){
        // console.log('result is : ' + JSON.stringify(data));
        let answers = JSON.parse(data.answers);
        let results = JSON.parse(data.results);

        // console.log('result is : ' + JSON.stringify(results));

        let csv = [];
        csv.push(['group','facet','descr','value']);
        results.forEach((element) => {
            csv.push([element.title, 'root', element.scoreText, element.score]);
            element.facets.forEach((elementInner) => {
                csv.push([element.title, elementInner.title, elementInner.scoreText, elementInner.score]);
            });
        });

        this.setState({
            result : true,
            scores : results,
            timeElapsed: 0,
            radios: answers,
            csv: csv
        });

    }

    print() {
        if (isBrowser()) {
            window.print();
            //$(".testManager").printElement();
            //this.printElem("testManager");
        }
    }

    render () {

        // hidden csv button
        // <CSVLink className="btn-outlined btn btn-default btn-fluttrOrange" data={this.state.csv} >Download CSV</CSVLink>

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
                    <Spinner/>
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
            </div>
        );
    }
}
