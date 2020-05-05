import React from 'react';
import { connect } from 'react-redux';

import {
    Button,
    OverlayTrigger,
    Tooltip,
    Popover,
    MenuItem
} from '@sketchpixy/rubix';

import CopyToClipboard from 'react-copy-to-clipboard';

import * as teamStatus from '../../../constants/teamStatus';
import * as teamRole from '../../../constants/teamRole';
import {manageSuccess} from '../../../common/utils';
import Col from '../../../layout/layout/Col';
import Grid from '../../../layout/layout/Grid';
import Row from '../../../layout/layout/Row';

var Global = require('../../../common/global_constants');

@connect((state) => state)
export default class RecruiterTeamCard extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    getId(){
        return this.props.id;
    }

    getContext(){
        return this.props.context;
    }

    getTeamUserId(){
        return this.props.data.id;
    }

    clickOnEmail(){
        // console.log('click mail button');
        this.mailButton.click();
    }

    onCopyClipboardOk(title){
        let message = title + ' copied to clipboard.';
        manageSuccess('clipboard-ok', message);
    }

    onRemoveOverlay(){
        this.refs.removeOverlay.show();
        let root = this;
        let containerId = 'popover' + this.getId();
        let id = this.getId();
        let teamUserId = this.getTeamUserId();
        let onRemove = this.props.onRemove;

        $('html').click(function(e) {
            if (e.target.id == containerId || $(e.target).parents('#' + containerId).length){
                // click on popover, ignore
                // console.log('click, ignore');
            } else {
                root.closePopover();
            }
        });
    }

    onRemoveConfirm(){
        let id = this.getId();
        let teamUserId = this.getTeamUserId();
        let onRemove = this.props.onRemove;

        // call onRemove passed by parent
        if (onRemove !== undefined){
            let user = this.props.data.user;
            let completeName = user.name + ' ' + user.surname;
            onRemove(id, teamUserId, completeName);
        }
    }

    closePopover(){
        $('html').unbind('click');
        this.refs.removeOverlay.hide();
    }

    render(){
        // console.log('data : ' + JSON.stringify(this.props.data));
        let object = this.props.data;
        let user = this.props.data.user;

        let phone = '-';
        if (user.phone){
            phone = user.phone;
        }

        let position = '-';
        if (user.position){
            position = user.position;
        }

        let colorHiring = 'fluttrGrey';
        if (teamStatus.enableColor(object.hiringStatus)){
            colorHiring = 'fluttrBlue';
        }
        let colorExpert = 'fluttrGrey';
        let textHiring = teamStatus.getLabelTeamStatus(object.hiringStatus);
        let textExpert = teamStatus.getLabelTeamStatus(object.expertStatus);

        let popoverText = 'Are you sure you want to delete ' + user.completeName + ' from the ' + teamRole.getLabel(this.getContext()) + ' ?';

        let canDelete = object.canDelete;
        if (this.getContext() == teamRole.EXPERT){
            canDelete = true;
        }

        let additionalCardClass = '';
        if (canDelete){
            additionalCardClass = 'recruiterCandidateCardNoTopPadding';
        }

        return (
            <Col className="recruiterCandidateCardContainer" xs={3}>
                <div className="recruiterCandidateCardBack">
                    <div className={'recruiterCandidateCard ' + additionalCardClass}>
                        <Grid>
                            {canDelete &&
                            <Row revertMargin>
                                <Col xs={12} className="noPadding" style={{margin:'0px 0px 10px 0px'}}>
                                    <OverlayTrigger
                                        ref="removeOverlay"
                                        placement="top"
                                        overlay={<Popover id={'popover-bottom-2'}
                                            title={popoverText}>
                                            <Row id={'popover' + object.id}>
                                                <Col xs={6}>
                                                    <Button bsStyle="default" onClick={() => this.closePopover()}>
                                                        Cancel
                                                    </Button>
                                                </Col>
                                                <Col xs={6}>
                                                    <Button bsStyle="fluttrRed" onClick={() => this.onRemoveConfirm()}>
                                                            Continue
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Popover>}>
                                        <span></span>
                                    </OverlayTrigger>
                                    <i onClick={() => this.onRemoveOverlay()} className="icon-entypo-cross delete-icon-candidate cursorLink" />
                                </Col>
                            </Row>
                            }
                            <Row revertMargin>
                                <Col xs={12} className="text-center" style={{padding:'0px 15px', position: 'relative', width: '90%', marginLeft: '5%'}}>
                                    <img src={user.imageUrl} style={{width:'100%', padding:'0px'}} className="img-rounded candidateProfile" />
                                </Col>
                            </Row>
                            <Row className="recruiter-section-vertical">
                                <Col xs={12} className="text-center noPadding">
                                    <span className="candidateNam.recruiterCandidatesComponent .opportunity-filterse">{user.completeName}</span>
                                </Col>
                            </Row>
                            <Row className="recruiter-section-vertical">
                                <Col xs={12} style={{padding:'0px'}}>
                                    {user.phone &&
                                    <CopyToClipboard text={user.phone} onCopy={() => this.onCopyClipboardOk('Phone number')}>
                                        <span className="phoneContact">{phone}</span>
                                    </CopyToClipboard>
                                    }
                                    {!user.phone &&
                                        <span className="phoneContact">{phone}</span>
                                    }
                                </Col>
                            </Row>
                            <Row style={{marginTop:10}}>
                                <Col xs={12} style={{padding:'0px'}}>
                                    <CopyToClipboard text={user.email} onCopy={() => this.onCopyClipboardOk('Email address')}>
                                        <span className="candidateContact" onClick={() => this.clickOnEmail()}>{user.email}</span>
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                            <Row className="vertical-align recruiter-section-vertical">
                                <Col xs={2} className="noPadding text-center vertical-flex">
                                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Hiring Team status</Tooltip>}>
                                        <i className={'icon-entypo-users candidate-icon-review ' + colorHiring} />
                                    </OverlayTrigger>
                                </Col>
                                <Col xs={10} className="vertical-flex-align-left" style={{padding:'0px 5px 0px 10px'}}>
                                    <span className="candidate-ranking-alternative cursorLink">
                                        {textHiring}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="vertical-align">
                                <Col xs={2} className="noPadding vertical-flex">
                                    <OverlayTrigger placement="top" overlay={<Tooltip id='tooltip'>Expert status</Tooltip>}>
                                        <i className={'icon-entypo-graduation-cap candidate-icon-review ' + colorExpert} />
                                    </OverlayTrigger>
                                </Col>
                                <Col xs={10} className="vertical-flex-align-left" style={{padding:'0px 5px 0px 10px', minHeight:47}}>
                                    <span className="candidate-ranking-alternative cursorLink">
                                        {textExpert}
                                    </span>
                                </Col>
                            </Row>
                            <Row style={{marginTop:10}}>
                                <Col xs={12} className="text-center noPadding" style={{minHeight:'3.6em'}}>
                                    <span className="candidateRole">{position}</span>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
                <div style={{display:'none'}}>
                    <a ref={(mailButton) => { this.mailButton = mailButton; }} href={'mailto:' + user.email}>cv</a>
                </div>
            </Col>
        );
    }
}
