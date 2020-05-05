import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Image,
    Form,
    FormGroup,
    Radio,
    FormControl
} from '@sketchpixy/rubix';

import {Typeahead} from 'react-bootstrap-typeahead';
import {default as ButtonLoader} from 'react-bootstrap-button-loader';

import * as teamRole from '../../../constants/teamRole';
import {manageError, manageErrorMessage, manageSuccess} from '../../../common/utils';

import AsynchContainer from '../../template/AsynchContainer';

import {fetchRecruiterTeamSuggestions, addTeamMember} from '../../../redux/actions/recruiterTeamActions';
import RecruiterTeamAddModal from './RecruiterTeamAddModal';

@connect((state) => state)
export default class RecruiterTeamAddComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            invited: [],
            newMember : false,
            loadingInvite : false,
        };
    }

    componentDidMount(){
        this.initSearchBar();
    }

    initSearchBar(){
        let id = this.props.id;
        let context = this.props.context;
        // console.log('init list candidates by name');
        this.props.dispatch(fetchRecruiterTeamSuggestions(id, context));
    }

    getList(){
        let context = this.props.context;
        if (context == teamRole.HIRING){
            return this.props.recruiterOpportunityTeamSuggestionHiring;
        } else if (context == teamRole.EXPERT){
            return this.props.recruiterOpportunityTeamSuggestionExpert;
        }
    }

    onCancel(){
        if (this.props.onCancel !== undefined){
            this.props.onCancel();
        }
    }

    onAddUserFromModal(data){
        const invitedList = this.state.invited;
        // check
        let emailInvited = [];
        invitedList.map((currentItem) => {
            emailInvited.push(currentItem.mail);
        });

        if (emailInvited.indexOf(data.email) < 0){
            // not invited, I can add
            invitedList.push(new InvitedTeamMemberItem(null, null, data.name, data.surname, data.email));

            this.setState({
                invited : invitedList
            });
        }

        //manageSuccess("add-member-ext", data.name + " " + data.surname + " added to the invitation list");
    }

    onSelectedUserSearch(selected){
        if (selected != null){
            // console.log("selected : " + JSON.stringify(selected));
            let user = selected;

            const invitedList = this.state.invited;
            // check
            let emailInvited = [];
            invitedList.map((currentItem) => {
                emailInvited.push(currentItem.mail);
            });

            if (emailInvited.indexOf(user.email) < 0){
                // not invited, I can add
                invitedList.push(new InvitedTeamMemberItem(user.id, user.imageUrl, user.name, user.surname, user.email));

                this.setState({
                    invited : invitedList
                });
            }

            if (this.refs.searchBar){
                this.refs.searchBar.clear();
            }
        }
    }

    removeUser(user){
        let invited = this.state.invited;
        let index = invited.indexOf(user);

        if(index>=0){
            invited.splice(index, 1);
        }

        this.setState({invited: invited});
    }

    inviteNewMember(){
        this.setState({
            newMember : true
        });
    }

    onCloseInviteNewMember(){
        this.setState({
            newMember : false
        });
    }

    onInviteMembers(){
        let invited = this.state.invited;
        if (invited.length == 0){
            manageErrorMessage('invite-member', 'You have no members to invite!');
        } else {
            // disable button
            this.setState({
                loadingInvite : true
            });

            // call apis...
            let userList = [];
            invited.map((currentItem) => {
                userList.push(
                    {name : currentItem.name,
                        surname : currentItem.surname,
                        email : currentItem.mail});
            });

            let id = this.props.id;
            let context = this.props.context;

            let data = {
                userList : userList,
                type : context
            };
            this.props.dispatch(addTeamMember(id, data, this.onInviteMembersOk.bind(this), this.onInviteMembersError.bind(this)));
        }

    }

    onInviteMembersOk(){
        // empty list
        this.setState({
            invited: []
        });

        // close the add new
        if (this.props.onAdded !== undefined){
            this.props.onAdded();
        }

        manageSuccess('invite-members', 'New members invited correctly');
    }

    onInviteMembersError(err){
        let label = teamRole.getLabel(this.props.context);
        manageError(err, 'add-member', 'Error adding members to your ' + label);
    }


    renderSearchBar(){
        const invited = this.state.invited;

        let id = this.props.id;
        let listNames = this.getList();

        return (
            <AsynchContainer data={listNames} manageError={false}>
                <RecruiterTeamAddSearchCandidatesBar ref="searchBar" data={listNames} invited={invited} id={id} onSelect={this.onSelectedUserSearch.bind(this)}/>
            </AsynchContainer>
        );
    }

    renderInvitedExperts(){
        const invitedList = this.state.invited;

        /**
         * {invitedList.length == 0 &&
                        <InvitedTeamMember placeholder={true} />
                    }
         */

        return (
            <Grid>
                <Row>
                    {
                        invitedList.map((user) =>
                            <InvitedTeamMember key={user.mail} data={user} onRemoveExpert={this.removeUser.bind(this)}/>
                        )
                    }

                </Row>
            </Grid>
        );
    }

    render(){
        const invitedList = this.state.invited;
        let showAdd = true;
        let disableInvited = true;
        if (this.props.available != null){
            if (invitedList.length >= this.props.available){
                showAdd = false;
            }
        }

        if (invitedList.length >= 1){
            disableInvited = false;
        }

        return (
            <div className="add-team-container">
                <Grid>
                    <Row>
                        <Col xs={12} className="text-right noPadding" style={{margin:'0'}}>
                            <i onClick={() => this.onCancel()} className="icon-entypo-cross close-icon-container cursorLink" />
                        </Col>
                    </Row>
                    <div className="add-team-internal-container">
                        {showAdd &&
                            <div>
                                <Row style={{marginBottom:20}}>
                                    <Col xs={12} className="noPadding">
                                        <span className="sectionTitle sectionTitleMinus">Search</span>
                                    </Col>
                                </Row>
                                <Row className="vertical-align">
                                    <Col xs={6} className="noPadding vertical-flex-align-left">
                                        <div style={{width:'100%'}}>
                                            {this.renderSearchBar()}
                                        </div>
                                    </Col>
                                    <Col xs={6} className="noPadding vertical-flex-align-right" style={{marginTop:10}}>
                                        <span className="sectionTitle sectionTitleMinusMinus sectionTitleMarginRight">Not found?</span>
                                        <Button bsstyle="fluttrBlue" onClick={() => this.inviteNewMember()}>
                                            + Add new members
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        }
                        {!showAdd &&
                        <Row>
                            <Col xs={12} className="noPadding">
                                <span className="sectionTitleMedium">A maximum of 3 Experts are allowed to participate</span>
                            </Col>
                        </Row>
                        }
                        <Row>
                            <Col xs={12} className="noPadding" style={{marginTop:'1em',minHeight:'15vh'}}>
                                <span className="sectionTitle sectionTitleMinusMinus">Invitation list</span>
                                {this.renderInvitedExperts()}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8} className="noPadding">
                                <span></span>
                            </Col>
                            <Col xs={4} className="noPadding text-right">
                                <ButtonLoader disabled={disableInvited} className="btn-lg" bsStyle="fluttrOrange" loading={this.state.loadingInvite} onClick={() => this.onInviteMembers()}>
                                    Invite now
                                </ButtonLoader>
                            </Col>
                        </Row>
                    </div>
                </Grid>
                <RecruiterTeamAddModal open={this.state.newMember} onClose={this.onCloseInviteNewMember.bind(this)} onAdd={this.onAddUserFromModal.bind(this)}/>
            </div>
        );
    }
}

class RecruiterTeamAddSearchCandidatesBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            key: Math.random()
        };
    }

    changeKey(){
        this.setState({
            key: Math.random()
        });
    }

    onSelect(selected){
        if (selected.length > 0){
            selected = selected[0];
        } else{
            selected = null;
        }
        // console.log('selected : ' + JSON.stringify(selected));
        if (this.props.onSelect !== undefined){
            this.props.onSelect(selected);
        }
    }

    clear(){
        this.changeKey();
        /*
        if (this.refs.searchBarInside){
            this.refs.searchBarInside.getInstance().clear();
            this.refs.searchBarInside.getInstance().focus();
        }*/
    }

    render(){
        let invited = this.props.invited;
        let emailInvited = [];
        invited.map((currentItem) => {
            emailInvited.push(currentItem.mail);
        });


        let namesList = this.props.data.item.userList;
        // console.log('names list : ' + JSON.stringify(namesList));

        let users = [];
        if (namesList) {
            namesList.map((currentItem) => {
                if (emailInvited.indexOf(currentItem.email) < 0){
                    // not invited, push
                    users.push(currentItem);
                } else {
                    // console.log('IGNORE : ' + JSON.stringify(currentItem));
                }
            });
        }

        return (
            <div className="searchBar">
                <Typeahead
                    key={this.state.key}
                    ref="searchBarInside"
                    clearButton
                    labelKey="completeName"
                    onChange={(selected) => { this.onSelect(selected);}}
                    options={users}
                    placeholder="Search by name"
                    renderMenuItemChildren={(option, props) => (
                        <UserItemSearchResult key={option.id} user={option} />
                    )}
                />
            </div>
        );

    }
}

class UserItemSearchResult extends React.Component {
    render(){
        let data = this.props.user;
        return (
            <div>
                <img src={data.imageUrl} className="img-rounded" style={{width:30, marginRight:'2em'}}/>
                <span>{data.completeName}</span>
            </div>
        );
    }
}

function InvitedTeamMemberItem(id, picture, name, surname, mail){
    this.id = id;
    this.picture = picture;
    this.name = name;
    this.surname= surname;
    this.mail= mail;
}

class InvitedTeamMember extends React.Component {
    removeExpert(expert){
        if (this.props.onRemoveExpert){
            this.props.onRemoveExpert(expert);
        }
    }

    renderPlaceholder(){
        return (
            <Col className="recruiterCandidateCardContainer" xs={3}>
                <div className="recruiterCandidateCard recruiterCandidateCardNoTopPadding placeholderTeam">
                    <Grid>
                        <Row>
                            <Col xs={12} className="noPadding" style={{margin:'0px 0px 10px 0px'}}>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </Col>
        );
    }

    render(){
        if (this.props.placeholder){
            return this.renderPlaceholder();
        } else {
            let expert = this.props.data;
            let isPicture = false;
            if (expert.picture != '' && expert.picture != null){
                isPicture = true;
            }

            return (
                <Col className="recruiterCandidateCardContainer" xs={3}>
                    <div className="recruiterCandidateCard recruiterCandidateCardNoPadding">
                        <Grid>
                            <Row>
                                <Col xs={12} className="noPadding" style={{margin:'0'}}>
                                    <i onClick={() => this.removeExpert(expert)} className="icon-entypo-cross delete-icon-candidate cursorLink" />
                                </Col>
                            </Row>
                            <Row key={expert.id} className="vertical-align invitation-user">
                                <Col xs={5} className="noPadding vertical-flex">
                                    <div style={{padding:'0 0 10px 10px', width:'100%'}}>
                                        {isPicture &&
                                            <img src={expert.picture} width='100%' className="img-rounded"/>
                                        }
                                        {!isPicture &&
                                            <img src="/imgs/app/user/no-profile-img.gif" width='100%' className="img-rounded" />
                                        }
                                    </div>
                                </Col>
                                <Col xs={7} className="noPadding vertical-flex vertical-flex-align-left">
                                    <div style={{margin:'0 10px'}} className="invitation-user-wrapper">
                                        <div className="invitation-user-name">{expert.name} {expert.surname}</div>
                                        <div className="invitation-user-email">{expert.mail}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </Col>
            );
        }

    }
}

