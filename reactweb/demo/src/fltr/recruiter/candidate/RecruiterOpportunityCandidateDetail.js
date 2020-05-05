import React, {Component} from 'react';
import { connect } from 'react-redux';
import {fetchRecruiterCandidates, getOpportunityById} from '../../../redux/actions/recruiterOpportunityActions';
import {withRouter} from 'react-router';
import {candidateModelList} from '../../utils/modelUtils';
import Spinner from '../../Spinner';
import RecruiterCandidateModal from './RecruiterCandidateModal';
import {goToOpportunityDetail} from '../../navigation/NavigationManager';
import {getQueryParam} from '../../utils/urlUtils';

@withRouter
@connect(({
    recruiterCandidates,
    recruiterOpportunityGet
}) => ({
    recruiterCandidates,
    recruiterOpportunityGet
}))
export default class RecruiterOpportunityCandidateDetail extends Component {
    state = {
        candidate: null,
        loaded: false
    };

    componentDidMount = () => {
        const {id} = this.props.params;
        this.props.dispatch(getOpportunityById(id, this.onOpportunityFetchSuccess));
    };

    onOpportunityFetchSuccess = () => {
        const {id, candidateId} = this.props.params;
        this.props.dispatch(fetchRecruiterCandidates(id, 0, undefined, candidateId, this.onSuccess));
    };

    handleCloseModal = () => {
        const {id} = this.props.params;
        goToOpportunityDetail(id);
    }

    onSuccess = ({content: [candidateData, ...rest]}) => {
        const opportunity = this.props.recruiterOpportunityGet.item;
        const data = {...candidateData, opportunity};
        const candidate = new candidateModelList(data);
        const screen = getQueryParam('context');
        this.setState({
            candidate,
            loaded: true,
            screen
        });
    };

    onRefresh = () => {
        const {id, candidateId} = this.props.params;
        this.props.dispatch(fetchRecruiterCandidates(id, 0, undefined, candidateId, ({content: [candidateData]}) => {
            const opportunity = this.props.recruiterOpportunityGet.item;
            const data = {...candidateData, opportunity};
            const candidate = new candidateModelList(data);
            this.setState({
                candidate
            });
        }));
    }

    getDetailModalData = () => {
        const { id, name, image, email, phone, challenge, score } = this.state.candidate;
        return {
            userDetails: {
                id,
                name,
                image,
                email,
                phone,
                challenge
            },
            score
        };
    };

    render () {
        if (this.state.loaded) {
            const detailModalData = this.getDetailModalData();
            return <RecruiterCandidateModal
                show
                screen={this.state.screen}
                user={detailModalData}
                onClose={this.handleCloseModal}
                candidate={this.state.candidate}
                onRefresh={this.onRefresh}
            />;
        }
        return <Spinner />;
    }
}