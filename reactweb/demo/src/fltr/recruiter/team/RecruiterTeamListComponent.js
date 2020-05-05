import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

import * as teamRole from '../../../constants/teamRole';
import {manageError, manageSuccess} from '../../../common/utils';

import AsynchContainer from '../../template/AsynchContainer';
import AsyncList from '../../template/AsyncList';

import {fetchRecruiterOpportunityTeam, resetRecruiterOpportunityTeam, deleteTeamMember} from '../../../redux/actions/recruiterTeamActions';
import RecruiterTeamCard from './RecruiterTeamCard';
import RecruiterTeamAddComponent from './RecruiterTeamAddComponent';

@connect((state) => state)
export default class RecruiterTeamListComponent extends Component {

    state = {
        showAdd : true,
        nameDelete : ''
    };

    componentDidMount() {
        this.init();
    }

    getId = () => {
        return this.props.id;
    }

    getContext = () => {
        return this.props.context;
    }

    getLimit = () => {
        return this.props.limit;
    }


    onAddedMember = () => {
        this.onCancelAddMember();
        this.init();
    }

    onRemoveMember = (id, teamUserId, name) => {
        // console.log('id : ' + id + " team user id : " + teamUserId + " name : " + name);
        this.setState({
            nameDelete: name
        });

        this.props.dispatch(deleteTeamMember(id, teamUserId, this.getContext(), this.onRemoveMemberOk, this.onRemoveMemberError));
    }

    onRemoveMemberOk = () => {
        manageSuccess('remove-member','You correctly removed ' + this.state.nameDelete + ' from the ' + teamRole.getLabel(this.getContext()));
        this.init();
    }

    onRemoveMemberError = (err) => {
        manageError(err, 'remove-member', 'Impossible to remove a member from your hiring team');
    }

    onAddMemberOk = () => {
        this.init();
    }

    onAddTeamMember = () => {
        this.setState({
            showAdd : false
        });

    }

    onCancelAddMember = () => {
        this.setState({
            showAdd : true
        });
    }

    onError = (err) => {
        manageError(err, 'add-member', 'Impossible to add a member to your hiring team');
    }

    renderTitle = () => {
        let context = this.getContext();
        if (teamRole.HIRING == context) {
            return (
                <span>
                    <i className="icon-entypo-users fluttrBlue sectionTitleIcon" />
                    <span className="sectionTitle">Hiring Team</span>
                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>The hiring team can score CVs, review applications, challenges and read feedbacks and comments.</Tooltip>}>
                        <i className="icon-entypo-info-with-circle sectionTitleIconHelp" />
                    </OverlayTrigger>
                </span>
            );
        } else if (teamRole.EXPERT == context) {
            return (
                <span>
                    <i className="icon-entypo-graduation-cap fluttrBlack sectionTitleIcon" />
                    <span className="sectionTitle">Experts</span>
                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Experts can only review the responses to the challenge.
                        They can't see the candidate's application.
                        If you want to share applications with the experts, add them to the hiring team.</Tooltip>}>
                        <i className="icon-entypo-info-with-circle sectionTitleIconHelp" />
                    </OverlayTrigger>
                </span>
            );
        }
    }

    init = () =>  {
        this.props.dispatch(resetRecruiterOpportunityTeam(this.getContext()));
        this.callApi(0);
    }

    getList = () => {
        let context = this.getContext();
        if (teamRole.HIRING == context) {
            return this.props.recruiterOpportunityTeamHiring;
        } else if (teamRole.EXPERT == context) {
            return this.props.recruiterOpportunityTeamExpert;
        } else {
            return [];
        }

    }

    callApi(page){
        let id = this.getId();
        // console.log('reloading data ');
        this.props.dispatch(fetchRecruiterOpportunityTeam(id, this.getContext(), page, ''));
    }

    loadItems = () =>  {
        let page = 0;
        let list = this.getList();

        if (!list.isFetching) {
            if (list.item) {
                page = list.item.number + 1;
            }
            this.callApi(page);
        }
    }

    createItem = (data) => {
        return (
            <RecruiterTeamCard
                id={this.getId()}
                context={this.getContext()}
                key={data.id}
                data={data}
                onRefresh={this.init}
                onRemove={this.onRemoveMember}
            />
        );
    }
    render() {

        let list = this.getList();

        let showAdd = this.state.showAdd;
        let limited = false;
        let available = null;
        if (this.getLimit() !== undefined){
            if (list != null && list.item != null){
                if (list.item.totalElements >= this.getLimit()){
                    showAdd = false;
                    limited = true;
                    available = 0;
                } else {
                    available = this.getLimit() - list.item.totalElements;
                }
            }
        }

        let emptyContent = <div style={{marginTop:'50vh'}}></div>;

        return (
            <div className="recruiterHiringListComponent">
                <AsynchContainer data={list} manageError={false} native={false}>
                    <div>
                        <Grid>
                            <Row className="vertical-align">
                                <Col xs={10} className="noPadding vertical-flex-align-left">
                                    {this.renderTitle()}
                                </Col>
                                <Col xs={2} className="noPadding vertical-flex">
                                    {showAdd &&
                                    <Button bsStyle="fluttrOrange" onClick={() => this.onAddTeamMember()}>
                                        Invite Team Members
                                    </Button>
                                    }
                                    {limited &&
                                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>You can add a maximum of {this.getLimit()} members.</Tooltip>}>
                                        <span>
                                            <Button disabled bsstyle="fluttrBlue">
                                                Invite Team Members
                                            </Button>
                                        </span>
                                    </OverlayTrigger>
                                    }
                                </Col>
                            </Row>
                            {!this.state.showAdd &&
                            <Row style={{marginTop:'2em'}}>
                                <Col xs={12} className="noPadding">
                                    <RecruiterTeamAddComponent
                                        id={this.getId()}
                                        context={this.getContext()}
                                        onCancel={() => this.onCancelAddMember()}
                                        onAdded={this.onAddedMember}
                                        available={available}
                                    />
                                </Col>
                            </Row>
                            }
                        </Grid>
                        <AsyncList
                            container={true}
                            showHeader={false}
                            emptyContent={emptyContent}
                            title='toDelete'
                            data={list}
                            onInit={this.init}
                            onLoad={this.loadItems}
                            onCreateItem={this.createItem}
                        />
                    </div>
                </AsynchContainer>
            </div>
        );
    }
}