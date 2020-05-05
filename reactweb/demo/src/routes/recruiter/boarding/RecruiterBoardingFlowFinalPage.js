import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as ga from '../../../constants/analytics';
import * as global from '../../../constants/global';

import BoardingGiftModal from './BoardingGiftModal';

import {recruiterCompleteBoardingFlow} from '../../../redux/actions/userActions';

import {goToRecruiterLandingPage} from '../../../fltr/navigation/NavigationManager';

@connect((state) => state)
class RecruiterBoardingFlowFinalPage extends Component {
    constructor () {
        super();
        this.state = {
            modalState: false
        };
    }
  handleEndBoarding = () => {
      if (!this.props.user.item.recruiterDetails.boarding) {
          this.props.dispatch(recruiterCompleteBoardingFlow(this.onSaveOk));
      } else {
          goToRecruiterLandingPage();
      }
  }
  onHideModal = () => {
      this.setState({
          modalState: false
      });
  }
  onShowModal = () => {
      this.setState({
          modalState: true
      });
  }
  onSaveOk = () => {
      const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
      if (boardingCompleted) ga.track(ga.TOUR_FLOW_START);
      else ga.track(ga.BOARDING_FLOW_START);
      goToRecruiterLandingPage();
  }
  render () {
      const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
      let modalText = 'You have unlocked ' + global.TEMPLATES_FREEMIUM + ' challenges! Well done!';
      if (boardingCompleted === false) {
          return (
              <div className='boarding-flow-content-container'>
                  <div className='container-fluid boarding-flow-final'>
                      <div className='boarding-body'>
                          <h1 className='fluttr-header-big'>Congratulations!</h1>
                          <h2 className='fluttr-header-md'>Now that your understand how Fluttr can help aid you through the hiring process, we have a gift for you!</h2>
                          <img onClick={this.onShowModal} src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/dancing_gift_no_background.gif' style={{cursor: 'pointer'}}  alt='gift4you' />
                          <button type='button' className='btn-fluttr btn-green' onClick={this.onShowModal}>Let me see it!</button>
                      </div>
                  </div>
                  <BoardingGiftModal open={this.state.modalState} onClose={this.onHideModal} handleEndBoarding={this.handleEndBoarding} giftText={modalText}/>
              </div>
          );
      } else {
          return (
              <div className='boarding-flow-content-container'>
                  <div className='container-fluid boarding-flow-final'>
                      <div className='boarding-body'>
                          <h1 className='fluttr-header-md'>Thanks for taking the tour again!</h1>
                          <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/celebration_3-min.png'alt='gift4you' />
                          <button type='button' className='btn-fluttr btn-green' onClick={this.handleEndBoarding}>Go back to dashboard</button>
                      </div>
                  </div>
                  <BoardingGiftModal open={this.state.modalState} onClose={this.onHideModal} handleEndBoarding={this.handleEndBoarding} giftText={modalText}/>
              </div>
          );
      }
  }
}

export default RecruiterBoardingFlowFinalPage;
