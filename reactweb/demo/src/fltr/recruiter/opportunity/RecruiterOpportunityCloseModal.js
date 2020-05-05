import React, { Component } from 'react';
import CommonModal from '../../../common/components/CommonModal';
import FluttrButton from '../../../common/components/FluttrButton';
import * as opportunityClosed from '../../../constants/opportunityRecruiterClose';
import { resetRecruiterCandidates, fetchRecruiterCandidatesNames } from '../../../redux/actions/recruiterOpportunityActions';
import { connect } from 'react-redux';
import { manageErrorMessage } from '../../../common/utils';
import RecruiterOpportunityCloseModalCandidate from './RecruiterOpportunityCloseModalCandidate';
import AsynchContainer from '../../template/AsynchContainer';
import { Typeahead } from 'react-bootstrap-typeahead';



@connect(state => state)
export default class RecruiterOpportunityCloseModal extends Component {
    state = {
        page: 1,
        doneDisabled: true,
        candidateList: [],
        selectedCandidates: [],
        select: null
    }

    getAllNames = () => {
        const { candidateList } = this.state;
        const newList = { item: candidateList };
        return newList;
    }

    goHirePage = () => {
        this.props.dispatch(resetRecruiterCandidates(this.onResetSuccess));
    }

    onResetSuccess = () => {
        const { id } = this.props;
        this.props.dispatch(fetchRecruiterCandidatesNames(id, 'rank', this.onSuccess, this.onError));
    }

    onSuccess = () => {
        let candidateList = this.props.recruiterCandidatesNames.item.userList;
        if (candidateList.length) {
            candidateList.forEach(ele => { ele.checked = false; });
            this.setState({ page: 2, candidateList });
        } else {
            this.props.closeOpportunityAction(opportunityClosed.HIRED_SOMEONE_ELSE);
        }
    }

    onError = (err) => {
        manageErrorMessage(undefined, err);
    }

    onSelect = (select) => {
        this.setState({ select });
    }

    doneButtonDisabledCheck = (array) => {
        const doneDisabled = !array.length;

        return doneDisabled;
    }

    manageSelect = (index) => {
        const { candidateList } = this.state;

        let candidatesCopy = [...candidateList];
        candidatesCopy[index].checked = !candidatesCopy[index].checked;

        let selectedCandidates = candidatesCopy.filter(ele => ele.checked === true);

        const doneDisabled = this.doneButtonDisabledCheck(selectedCandidates);

        this.setState({ candidateList: candidatesCopy, selectedCandidates, doneDisabled });
    }

    onClose = () => {
        this.props.closeCloseOpportunity();
        this.setState({
            page: 1,
            doneDisabled: true,
            candidateList: [],
            selectedCandidates: [],
            select: null
        });
    }

    render() {
        const { showCloseOppModal, closeOpportunityAction, id, hireOpportunityAction } = this.props;
        const { page, doneDisabled, candidateList, select, selectedCandidates } = this.state;

        return (<CommonModal open={showCloseOppModal} onClose={this.onClose} showClose={true}>
            <div className='close-opportunity-modal'>
                {page === 1 &&
                    <div className='close-opportunity-modal-flex-container'>
                        <h1>Close Test</h1>
                        <p className='fluttr-text-md'>You are about to close a Test. If there is an active challenge, it <br />
                            will be automatically closed and all candidates notified. <br />
                            Why do you want to close it?</p>
                        <div className='close-opportunity-button-container'>
                            <FluttrButton size='small' action={this.goHirePage} inverse>We hired someone!</FluttrButton>
                            <FluttrButton size='small' action={() => closeOpportunityAction(opportunityClosed.INTERRUPT)} inverse>We don’t want to continue with the process</FluttrButton>
                            <FluttrButton size='small' action={() => closeOpportunityAction(opportunityClosed.NO_TEMPLATE)} inverse>We have not found a template for the challenge</FluttrButton>
                            <FluttrButton size='small' action={() => closeOpportunityAction(opportunityClosed.NO_CANDIDATES)} inverse>We don't have any candidates</FluttrButton>
                        </div>
                    </div>
                }
                {page === 2 &&
                    <div className='hire-opportunity-modal-flex-container'>
                        <div className='titles'>
                            <h1 className='fluttr-header-big'>Who have you hired?</h1>
                            <p className='fluttr-text-md'>Select the candidate/s you have hired</p>
                        </div>
                        <AsynchContainer data={this.getAllNames()} manageError={false}>
                            <SearchCandidatesBar ref="searchBar" data={this.getAllNames()} id={id} namesList={candidateList} onSelect={this.onSelect} />
                        </AsynchContainer>
                        <div className='candidates'>
                            {
                                candidateList.map((candidate, index) => <RecruiterOpportunityCloseModalCandidate filtered={select} index={index} manageSelect={this.manageSelect} selected={candidate.checked} candidateName={candidate.completeName} candidatePicture={candidate.imageUrl} />)
                            }
                        </div>
                        <div className='buttons'>
                            <FluttrButton size='medium' disabled={doneDisabled} action={() => hireOpportunityAction(selectedCandidates)}>DONE</FluttrButton>
                            <FluttrButton type='link' size='medium' action={() => closeOpportunityAction(opportunityClosed.HIRED_SOMEONE_ELSE)}>We hired someone else</FluttrButton>
                        </div>
                    </div>
                }
            </div>
        </CommonModal>);
    }
}

class SearchCandidatesBar extends React.Component {
    onSelect(selected) {
        if (selected.length > 0) {
            selected = selected[0];
        } else {
            selected = null;
        }
        if (this.props.onSelect !== undefined) {
            this.props.onSelect(selected);
        }
    }

    clear() {
        if (this.refs.searchBarInside) {
            this.refs.searchBarInside.getInstance().clear();
        }
    }

    render() {
        const { namesList } = this.props;

        let users = [];
        if (namesList) {
            namesList.map((currentItem) => {
                users.push(currentItem);
            });
        }

        return (
            <div className="searchBar">
                <Typeahead
                    ref="searchBarInside"
                    clearButton
                    labelKey={option => `${option.completeName} (${option.nickname})`}
                    filterBy={['completeName', 'nickname']}
                    onChange={(selected) => { this.onSelect(selected); }}
                    options={users}
                    placeholder='Type name or username'
                    renderMenuItemChildren={(option, props) => (
                        <UserItemSearchResult key={option.id} user={option} />
                    )}
                />
            </div>
        );

    }
}

class UserItemSearchResult extends React.Component {
    render() {
        let data = this.props.user;
        return (
            <div>
                <img src={data.imageUrl} className="img-rounded" style={{ width: 30, height: 30, marginRight: '2em' }} />
                <span>{data.completeName}</span>
            </div>
        );
    }
}