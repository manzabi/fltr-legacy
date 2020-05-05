import React, {Component} from 'react';
import {connect} from 'react-redux';

import {goToRecruiterLandingPage} from '../../../fltr/navigation/NavigationManager';
import * as ga from '../../../constants/analytics';

import {
    Row,
    Col,
    Grid,
    Form,
    FormControl,
    FormGroup,
    Modal,
    Button,
    DropdownButton,
    MenuItem
} from '@sketchpixy/rubix';

import {recruiterCompleteBoardingFlow} from '../../../redux/actions/userActions';
import {openModalFix, closeModalFix} from '../../../common/uiUtils';

@connect((state) => state)
export default class boardingFlowSkipModal extends Component {
    componentDidMount () {
    // console.log('Modal mounted')
    }
    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) open = this.props.open;

        if (!open && nextProps.open){
            // is opening, disable scrollbar main content
            // console.log('opening modal')
            openModalFix();
        }
    }

    closeModal = () => {
        // console.log('closing modal')
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }

    handleSkipBoarding = () => {
        if (!this.props.user.item.recruiterDetails.boarding) this.props.dispatch(recruiterCompleteBoardingFlow(this.onSaveOk));
        else goToRecruiterLandingPage();
    }
      onSaveOk = () => {
          const boardingCompleted = this.props.user.item.recruiterDetails.boarding;
          const event = {
              category: boardingCompleted ? 'tutorial' : 'boarding',
              step: this.props.step || null
          };
          ga.skipBoarding(event);
          goToRecruiterLandingPage();
      }

      render(){
          let open = false;
          if (this.props.open !== undefined) open = this.props.open;

          let textAreaStyle = {
              padding: '5px 10px'
          };

          return(
              <div>
                  <Modal bsSize="medium" show={open} onHide={::this.closeModal}>
                      <Modal.Body style={{padding: '0px', borderRadius: '4px'}} className='boarding-skip-modal'>
                          <Grid className="">
                              <Row>
                                  <Col xs={12} className='modal-header'>
                                      <h2>
                                    Are you sure that you want to quit the tour?
                                      </h2>
                                  </Col>
                                  <Col xs={12} className='modal-body button-container'>
                                      <button type='button' className='btn-fluttr btl-link' style={{backgroundColor: 'transparent'}} onClick={this.closeModal}>Cancel</button>
                                      <button type='button' className='btn-fluttr btn-green' onClick={this.handleSkipBoarding}>Quit</button>
                                  </Col>
                              </Row>
                          </Grid>
                      </Modal.Body>
                  </Modal>
              </div>
          );
      }


}
