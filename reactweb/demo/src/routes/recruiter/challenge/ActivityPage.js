import React, {Component} from 'react';
import {
    deleteSlackBinding,
    getSlackBindings,
    getSlackConnectButton, resetSlackBindings,
    resetSlackConnectButton
} from '../../../redux/actions/opportunityActions';
import {connect} from 'react-redux';
import AsynchContainer from '../../../fltr/template/AsynchContainer';

import Container from '../../../layout/layout/Container';
import Grid from "../../../layout/layout/Grid";
import Col from "../../../layout/layout/Col";
import {Text, Header} from "../../../layout/FluttrFonts";
import Offset from "../../../layout/layout/Offset";
import {manageError, manageErrorMessage, manageSuccess} from '../../../common/utils';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import ContextMenu from '../../../common/components/ContextMenu';
import {removeQueryParam, serializeQuery} from '../../../fltr/utils/urlUtils';
import Row from '../../../layout/layout/Row';
import SectionContainer from '../../../common/components/dummy/SectionContainer';


@connect((state) => state)
export default class ActivityPage extends Component {

    componentDidMount() {
        const {status} = serializeQuery();
        if (status) {
            this.manageNotify(status);
        }
        this.props.dispatch(resetSlackConnectButton(this.onResetSlackButtonSuccess));
        this.props.dispatch(resetSlackBindings(this.onResetSlackBindingsSuccess));
    }

    manageNotify = (status) => {
        if (status === 'ok') {
            manageSuccess('integrationSuccess', 'Test successfully linked to Slack.');
        } else if (status === 'ko') {
            manageErrorMessage('integrationFailure', 'Test received an error when trying to link to Slack');
            if (window.Raven) {
                window.Raven.captureException(new Error('Test received an error when trying to link to Slack').stack);
            }
        }
        removeQueryParam('status');
    };

    onResetSlackButtonSuccess = () => {
        const {id} = this.props.opportunity;
        this.props.dispatch(getSlackConnectButton(id));
    };

    onResetSlackBindingsSuccess = () => {
        const {id} = this.props.opportunity;
        this.props.dispatch(getSlackBindings(id));
    };

    handleRemoveBinding = (currBinding) => {
        //console.log(JSON.stringify(currBinding));

        const {id} = this.props.opportunity;
        // dispatch
        this.props.dispatch(deleteSlackBinding(id, currBinding.id, this.onRemoveBindingSuccess, this.onRemoveBindingError));

    };

    onRemoveBindingSuccess = () => {
        manageSuccess('bnd-remove-success','Slack notifications has been removed from the selected slack channel');
        this.props.dispatch(resetSlackBindings(this.onResetSlackBindingsSuccess))
    };

    onRemoveBindingError = (err) => {
        manageError(err, 'bnd-remove-error', 'Impossible to remove Slack notifications');
    };

    render () {
        return (
            <SectionContainer className='activity-configuration'>
                <Header className='title' style={{marginTop: 0}}>Test Activity</Header>
                <AsynchContainer data={this.props.slackBindings}>
                    <SlackBindingList data={this.props.slackBindings} onRemove={this.handleRemoveBinding} />
                </AsynchContainer>
                <Col xs='12'>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <AsynchContainer data={this.props.slackButton}>
                            <SlackButtonContent />
                        </AsynchContainer>
                    </div>
                </Col>
            </SectionContainer>
        );
    }
}

const SlackButtonContent = ({data: {item: {html: buttonCode}}}) => {
    return (
        <div dangerouslySetInnerHTML={{__html: buttonCode}} />
    );
};

class SlackBindingList extends Component {

    handleRemoveBinding = (currBinding) => {
        this.props.onRemove(currBinding);
    }

    handleOpenOnSlack = ({channelId, teamId}) => {
        window.open(`slack://channel/?id=${channelId}&team=${teamId}`, 'framename');
    }

    render(){
        const {item: channels} = this.props.data;
        return (
            <section className="slack-channel-list">
                {channels && channels.length &&
                    this.props.data.item.map((currBinding) => {
                        return (
                            <Row revertMargin key={'slack_bnd_'+currBinding.id} className='slack-link-item'>
                                <Text>This test is connected to Slack.</Text>
                                <div className='item-detail'>
                                    <ProfilePic length='30' url='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/slack.svg' />
                                    <Text size='sm' className='crazy-mediumgrey'>Connected channel <span className='crazy-darkside'>{currBinding.channel}</span></Text>
                                </div>
                                <ContextMenu
                                    items={[
                                        {text: 'Remove integration', onclick: () => { this.handleRemoveBinding(currBinding);}},
                                        {text: 'View on Slack', onclick: () => this.handleOpenOnSlack(currBinding)}
                                    ]}
                                />
                            </Row>
                        );
                    }) ||
                    <div>
                        <Text bold>Add to Slack</Text>
                        <Text size='sm'>Connect the test to a selected Slack channel to receive and see activity related to this test, as new candidates onboard, answer submitions, etc.</Text>
                    </div>
                }
            </section>
        );
    }

}

