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
export default class BoardingGiftModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            giftText: props.giftText
        };
    }
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
        // console.log(nextProps)
        // console.log(nextProps.giftText)
    }

    closeModal = () => {
        // console.log('closing modal')
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }
    handleEndBoarding = () => {
        this.props.dispatch(recruiterCompleteBoardingFlow(this.onSaveOk));
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

          return (
              <div>
                  <Modal bsSize="medium" lg show={open} onHide={::this.closeModal} backdrop='static' dialogClassName='fluttr-modal-center'>
                      <Modal.Body style={{padding: '0px', borderRadius: '4px'}} className='boarding-gift-modal'>
                          <Grid>
                              <Row>
                                  <Col xs={12} className='modal-body button-container'>
                                      <div className='gift-container'>
                                          <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/boarding/unlock_no_background.gif' alt='gift4you' />
                                          <h2 id='animated-reward' className='animated fadeInUp'>{this.state.giftText}</h2>
                                          <button id='animated-reward' type='button' className='btn-fluttr btn-green animated fadeInUp' onClick={this.handleEndBoarding}>Got it!</button>
                                      </div>
                                  </Col>
                              </Row>
                          </Grid>
                      </Modal.Body>
                  </Modal>
              </div>
          );
      }


}
