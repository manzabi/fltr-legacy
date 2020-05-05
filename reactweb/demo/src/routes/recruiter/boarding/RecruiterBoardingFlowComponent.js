import React, {Component} from 'react';
import { connect } from 'react-redux';

import boardingInfo from './boardingInformation';
import BoardingFlowSkipModal from './boardingFlowSkipModal';

import {recruiterCompleteBoardingFlow} from '../../../redux/actions/userActions';

import {goToRecruiterLandingPage} from '../../../fltr/navigation/NavigationManager';

@connect((state) => state)
class RecruiterBoardingFlowComponent extends Component {
    constructor () {
        super();
        this.state = {
            steps: boardingInfo.steps,
            modalState: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.onSaveOk = this.onSaveOk.bind(this);
    }
    componentDidMount () {
        boardingInfo.steps.forEach((step) => {
            let img = new Image();
            img.src = step.image;
            if (step.chilldren) {
                step.chilldren.forEach((subStep) => {
                    let img = new Image();
                    img.src = subStep.image;
                });
            }
        });
        const images = [
            'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/dancing_gift_no_background.gif',
            'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/unlock_no_background.gif'
        ];
        images.forEach(image => {
            let img = new Image();
            img.src = image;
        });
    }
    handleClick () {
        this.props.dispatch(recruiterCompleteBoardingFlow(this.onSaveOk));
    }
    onSaveOk () {
        goToRecruiterLandingPage();
    }

  calculateNewStep = () => {
      const {steps} = boardingInfo;
      const {step, subStep} = this.props;
      const newStep = {
          step: step,
          subStep: subStep
      };
      if (steps[step -1].chilldren) {
          if (steps[step - 1].chilldren[subStep]) {
              newStep.subStep += 1;
          } else {
              newStep.step +=1;
              newStep.subStep = 0;
          }
      } else {
          newStep.step +=1;
          newStep.subStep = 0;
      }
      this.props.handleChangeStep(newStep.step, newStep.subStep, null);
  }

  onShowModal = e => {
      e.preventDefault();
      this.setState({
          modalState : true
      });
  }
  onHideModal = () => {
      this.setState({
          modalState : false
      });
  }

  calculatPreviousStep = () => {
      const {steps} = boardingInfo;
      const {step, subStep} = this.props;
      const newStep = {
          stem: step,
          subStep: subStep
      };
      if (subStep > 0) {
          newStep.subStep = subStep -1;
      } else if (subStep === 0 && step > 2 && step < 5) {
          newStep.step = step - 1;
          const chilldren = steps[newStep.step].chilldren;
          newStep.subStep = chilldren ? chilldren.length : 0;
      } else {
          newStep.step = 1;
          newStep.subStep = 0;
      }
      this.props.handleChangeStep(newStep.step, newStep.subStep, null);
  }
  render () {
      let activeItem = {};
      let step = boardingInfo.steps.filter(step => step.number === this.props.step)[0];
      if (this.props.subStep === 0) {
          activeItem = step;
      } else {
          const activeSubStep = step.chilldren.filter((subStep) => subStep.number === this.props.subStep)[0];
          activeItem = activeSubStep;
      }
      return (
          <div className='boarding-flow-content-container'>
              <div className={`boarding-body ${(this.props.step === 2 && this.props.subStep === 0) ? ' custom-bg' : '' }`}>
                  <i className='fas fa-times skipBoarding' onClick={this.onShowModal} />
                  {activeItem.description &&
              <div className='step-description'>
                  <div>
                      {activeItem.description.title.split('\n').map((item, index) => (<h3 className='boarding-title fluttr-header-small' key={index}>{item}</h3>))}
                  </div>
                  {activeItem.description.body.map((paragraph, i) => (<p key={i} className='fluttr-text-md'>{paragraph}</p>))}
              </div>
                  }
                  { activeItem.custom &&
              <div dangerouslySetInnerHTML={{__html: activeItem.image}} style={{width: '100%'}}/> ||
              <img style={activeItem.description && {width: '80%', alignSelf: 'center', display: 'block', justifySelf: 'center', margin: 'auto', paddingBottom: '30px', maxHeight: '700px', maxWidth: '1080px', position: 'relative', top: '20px'} || {width: '100%'}} src={activeItem.image} alt="boardig image" />
                  }
              </div>
              <div className='boarding-controls'>
                  <button type='button' className={`btn-fluttr btl-link btn-small${this.props.step === 1 ? ' fluttr-hidden' : ''}`} style={{backgroundColor: 'transparent'}} onClick={this.calculatPreviousStep}><i className='fal fa-angle-double-left' /> Back to the previous screen</button>
                  <button type='button' className='btn-fluttr btn-green' onClick={this.calculateNewStep}>{(this.props.step === 4 && this.props.subStep === 3) ? 'Finish' : 'Next'}</button>
              </div>
              <BoardingFlowSkipModal open={this.state.modalState} onClose={this.onHideModal} step={`${this.props.step}.${this.props.subStep}`}/>
          </div>
      );
  }
}

export default RecruiterBoardingFlowComponent;
