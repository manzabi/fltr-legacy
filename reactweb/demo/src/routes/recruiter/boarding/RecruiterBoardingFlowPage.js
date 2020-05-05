import React, {Component} from 'react';
import { connect } from 'react-redux';

import {isMobile} from 'react-device-detect';

import BoardingFlowMenu from './BoardingFlowMenu';
import RecruiterBoardingFlowComponent from './RecruiterBoardingFlowComponent';
import RecruiterBoardingFlowFinalPage from './RecruiterBoardingFlowFinalPage';

import * as ga from '../../../constants/analytics';

import {recruiterCompleteBoardingFlow} from '../../../redux/actions/userActions';

import {goToRecruiterLandingPage} from '../../../fltr/navigation/NavigationManager';

@connect((state) => state)
class RecruiterBoardingFlowPage extends Component {
    constructor () {
        super();
        this.state = {
            step: 1,
            subStep: 0,
            started: false
        };
    }
    componentDidMount () {
        const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
        this.setState({
            started: boardingCompleted
        });
        const event = {
            category: boardingCompleted ? 'tour' : 'boarding',
            step: `${this.state.step}.${this.state.subStep}`,
            direct: false
        };
        ga.trackBoarding(event);
        if (boardingCompleted) ga.track(ga.TOUR_FLOW_START);
        else ga.track(ga.BOARDING_FLOW_START);
    }

  handleStart = () => {
      this.setState({
          started: true
      });
  }

  handleSkipBoarding = () => {
      if (this.props.user.item.recruiterDetails.boardig !== true) this.props.dispatch(recruiterCompleteBoardingFlow(this.onSaveOk));
      else this.onSaveOk();
  }
    handleSkipBoardingMobile = () => {
        const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
        if (boardingCompleted) ga.track(ga.BOARDING_FLOW_SKIP_MOBILE);
        if (this.props.user.item.recruiterDetails.boardig !== true) this.props.dispatch(recruiterCompleteBoardingFlow(goToRecruiterLandingPage));
        else goToRecruiterLandingPage();
    }

    onSaveOk = () => {
        const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
        const event = {
            category: boardingCompleted ? 'tutorial' : 'boarding',
        };
        ga.skipBoarding(event);
        goToRecruiterLandingPage();
    }

  handleChangeStep = (step, subStep, direct) => {
      const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
      const event = {
          category: boardingCompleted ? 'tour' : 'boarding',
          step: `${this.state.step}.${this.state.subStep}`,
          direct: direct
      };
      ga.trackBoarding(event);
      this.setState(prevstate => {
          prevstate.step = parseInt(step, 10) || prevstate.step;
          prevstate.subStep = parseInt(subStep, 10) || 0;
      });
  }
  render () {
      if (isMobile) {
          return (
              <div className='boarding-flow-start-component'>
                  <h1 style={{fontSize: '28px', fontWeight: 'bolder'}}>Welcome aboard!</h1>
                  <h2 style={{fontSize: '16px', fontWeight: 'bolder'}}>Hire the best, faster and without bias</h2>
                  <div>
                      <button type='button' className='btn btn-lg btn-fluttr-esmerald-green' style={{margin: '50px 0'}} onClick={this.handleSkipBoardingMobile}>Get started</button>
                  </div>
                  <p style={{fontSize: '16px', fontWeight: 'normal'}}>
            If you want to complete the entire tour, we suggest you to go to desktop.
                  </p>
              </div>
          );
      }
      else if (this.state.started === false) {
          return (
              <div className='boarding-flow-start-component'>
                  <h1 style={{fontSize: '40px', fontWeight: 'bolder', margin: '40px 0px'}}>Welcome aboard!</h1>
                  <h2 style={{fontSize: '40px', fontWeight: 'bolder', margin: '40px 0px'}}>Hire the best candidates faster without bias</h2>
                  <p style={{fontSize: '24px', fontWeight: 'normal', margin: '40px 0px'}}>
            Post a job and create a challenge for your candidates, we’ll take care of the rest.<br />
            Want to see how it works?
                  </p>
                  <div>
                      <button type='button' className='btn btn-fluttr-esmerald-green' style={{fontSize: '24px', padding: '10px 40px', height: 'auto'}} onClick={this.handleStart}>Take a tour (3 mins)</button>
                      <button type='button' className='btn btn-link' style={{color: '#333', fontSize: '16px', height: 'auto'}} onClick={this.handleSkipBoarding}>Skip</button>
                  </div>
              </div>

          );
      } else {
          return (
              <div className='boarding-flow-page'>
                  <BoardingFlowMenu step={this.state.step} subStep={this.state.subStep} handleChangeStep={this.handleChangeStep} />
                  { this.state.step < 5 &&
            <RecruiterBoardingFlowComponent step={this.state.step} subStep={this.state.subStep} handleChangeStep={this.handleChangeStep} />
                  }
                  { this.state.step >= 5 &&
            <RecruiterBoardingFlowFinalPage handleChangeStep={this.handleChangeStep} />
                  }
              </div>
          );
      }
  }
}

export default RecruiterBoardingFlowPage;
