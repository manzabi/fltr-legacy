import React, {Component} from 'react';
import {connect} from 'react-redux';

import {goToRecruiterLandingPage} from '../../navigation/NavigationManager';
import * as ga from '../../../constants/analytics';

import {
    Modal
} from '@sketchpixy/rubix';

import {recruiterCompleteBoardingFlow} from '../../../redux/actions/userActions';
import {openModalFix, closeModalFix} from '../../../common/uiUtils';

@connect((state) => state)
export default class ChallengeUpsellModal extends Component {
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
        return (
            <div>
                <Modal bsSize="medium" lg show={open} onHide={::this.closeModal} backdrop='static' dialogClassName='fluttr-modal-center'>
                    <Modal.Body style={{padding: '0px', borderRadius: '4px'}}>
                        <section className='challenge-upsell-modal'>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/opportunity/upsell.jpg' />
                            <section className='upsell-content'>
                                <h2 className='fluttr-header-big'>Boost your screening process!</h2>
                                <ul className='fluttr-text-big'>
                                    <li>
                                        Improve screening speed.
                                    </li>
                                    <li>
                                        Learn about candidates real skills.
                                    </li>
                                    <li>
                                        Discover candidates’ motivation.
                                    </li>
                                </ul>
                                <div className='button-container'>
                                    <button className='btn-fluttr btn-green' onClick={this.props.onConfirm}>
                                        ADD A CHALLENGE
                                    </button>
                                    <button className='btn-fluttr btn-link' onClick={this.props.onCancel}>
                                        No, thank you
                                    </button>
                                </div>
                            </section>
                        </section>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
    
    
}
