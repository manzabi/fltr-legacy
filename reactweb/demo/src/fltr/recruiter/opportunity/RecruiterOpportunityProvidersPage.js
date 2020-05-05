import React, {Component} from 'react';
import {connect} from 'react-redux';
import { fetchOpportunityProviders, saveOpportunityProviders, resetOpportunityProviders, getOpportunityById, resetOpportunityGetById, opportunityChangeVisibility } from '../../../redux/actions/recruiterOpportunityActions';
import AsynchContainer from '../../template/AsynchContainer';

import RecruiterOpportunityProvidersComponent from './RecruiterOpportunityProvidersComponent';
import { goToOpportunityDetail, goToRecruiterCeateLivePage } from '../../navigation/NavigationManager';
import CommonConfirmModal from '../../../common/components/CommonConfirmModal';
import Spinner from '../../Spinner';
import { PUBLIC, PRIVATE } from '../../../constants/opportunityType';
import { manageError } from '../../../common/utils';

@connect((state) => state)
export default class RecruiterOpportunityProvidersPage extends Component {
    constructor () {
        super();
        this.state = {
            modalStatus: false
        };
    }
    componentDidMount () {
        this.props.dispatch(resetOpportunityProviders(this.onProvidersReset));
        this.props.dispatch(resetOpportunityGetById(this.onOpportunityReset));
    }
    
    onProvidersReset = () => {
        const {id} = this.props.params;
        this.props.dispatch(fetchOpportunityProviders(id));
    }

    onOpportunityReset = () => {
        const {id} = this.props.params;
        this.props.dispatch(getOpportunityById(id));
    }

    handleSaveProviders = (data) => {
        const {id} = this.props.params;
        this.setState({
            loading: true
        });
        this.props.dispatch(saveOpportunityProviders(id, data, this.onSaveOk, this.onSaveError));
    }

    onPrivateNext = () => {
        this.onSaveOk(undefined, true);
    }

    onSaveError = (error) => {
        manageError(error, 'saveProvidersError', 'Error saving your providers settings');
        this.setState({
            loading: true
        });
    }

    onSaveOk = (data, privateOpportunity) => {
        const {id} = this.props.params;
        const isCreate = this.props.location.query.create === 'true';
        this.setState({
            loading: false
        });
        if (privateOpportunity) {
            if (isCreate) {
                // goToRecruiterOpportunityCreate(id);
                //goToRecruiterCeateLivePage(id);
            } else {
                goToOpportunityDetail(id);
            }
        } else {
            if (isCreate) {
                // goToRecruiterOpportunityCreate(id);
                this.handleOpenModal(goToRecruiterCeateLivePage, id);
            } else {
                this.handleOpenModal(goToOpportunityDetail, id);
            }

        }
    }
    handleOpenModal = (callbackAction, callbackData = undefined) => {
        this.setState({
            modalStatus: true,
            callbackAction,
            callbackData  
        });
    }
    
    onGoBack = () => {
        goToOpportunityDetail(this.props.params.id);
    }

    handleConfirmModal = () => {
        const {callbackAction, callbackData} = this.state;
        callbackAction(callbackData);
    }

    renderModalChildren = () => {
        return (
            <div style={{textAlign: 'center'}}>
                <div className="swal-icon swal-icon--success">
                    <span className="swal-icon--success__line swal-icon--success__line--long"></span>
                    <span className="swal-icon--success__line swal-icon--success__line--tip"></span>
                    <div className="swal-icon--success__ring"></div>
                    <div className="swal-icon--success__hide-corners"></div>
                </div>
                <h2 className='fluttr-header-big'>
                    Your job post is live!
                </h2>
                <p className='fluttr-text-md'>
                    The job boards you selected will publish your job post in a few hours. 
                </p>
            </div>
        );
    }

    changeOpportunityVisibility = (newValue, callBack) => {
        const {id} = this.props.params;
        const data = {
            type: newValue ? PUBLIC : PRIVATE
        };
        this.props.dispatch(opportunityChangeVisibility(id, data, callBack));
    }
 
    render () {
        const {opportunityProviders, recruiterOpportunityGet} = this.props;
        const isCreate = this.props.location.query.create === 'true';
        return (
            <div>
                <AsynchContainer data={opportunityProviders}>
                    { recruiterOpportunityGet.item && 
                        <RecruiterOpportunityProvidersComponent
                            opportunity={recruiterOpportunityGet.item}
                            providers={opportunityProviders.item}
                            isCreate={isCreate}
                            handleSaveProviders={this.handleSaveProviders}
                            onGoBack={this.onGoBack}
                            changeOpportunityVisibility={this.changeOpportunityVisibility}
                            onNext={this.onPrivateNext}
                        /> ||
                        <Spinner />
                        
                    }
                </AsynchContainer>
                <CommonConfirmModal
                    open={this.state.modalStatus}
                    onConfirm={this.handleConfirmModal}
                    backdrop={false}
                    showReject={false}
                    acceptText='Next'
                >
                    {this.renderModalChildren()}
                </CommonConfirmModal>
            </div>
        );
    }
}