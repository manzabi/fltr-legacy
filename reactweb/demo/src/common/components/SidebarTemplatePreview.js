import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsynchContainer from '../../fltr/template/AsynchContainer';
import { unlockTemplate, resetTemplateData, getTemplateForOpportunity, opportunityApplyTemplate } from '../../redux/actions/templateActions';
import { getChallengeAvailableSlots } from '../../fltr/utils/planUtils';
import { checkUserUpdate } from '../../redux/actions/userActions';
import { goToUpgrade, goToRecruiterConfigure } from '../../fltr/navigation/NavigationManager';
import Col from '../../layout/layout/Col';
import { Text } from '../../layout/FluttrFonts';
import CrazyIcon from '../../layout/icons/CrazyIcon';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import { useChallenge, resetChallengeById, getChallengeById } from '../../redux/actions/recruiterOpportunityActions';
import { getQueryParam } from '../../fltr/utils/urlUtils';
import {checkAllObjectParams, manageError} from '../utils';

@connect(({recruiterChallengeById, templateData, user}) => ({recruiterChallengeById, templateData, user}))
export default class SidebarTemplatePreview extends Component {
    state = {
        loading: false
    };
    componentDidMount() {
        const { challengeId } = this.props;
        if (challengeId) {
            this.props.dispatch(resetChallengeById(this.onResetOk));
        } else {
            this.props.dispatch(resetTemplateData(this.reloadTemplate()));
        }
    }

    onResetOk = () => {
        const { challengeId } = this.props;
        if (challengeId) {
            this.props.dispatch(getChallengeById(challengeId));
        }
    };

    reloadTemplate = (onSuccess) => {
        const { opportunityId, templateId } = this.props;
        this.props.dispatch(getTemplateForOpportunity(opportunityId, templateId, onSuccess));
    };

    handleApplyTemplate = (onSuccess) => {
        this.setState({
            loading: true
        });
        const { opportunityId, templateId } = this.props;
        this.props.dispatch(opportunityApplyTemplate(opportunityId, templateId, onSuccess));

    };

    handleUnlockTemplate = () => {
        this.setState({
            loading: true
        });
        const { opportunityId, templateId } = this.props;
        if (getChallengeAvailableSlots(this.props.user.item).slotTemplates > 0) {
            this.props.dispatch(unlockTemplate(opportunityId, templateId, () => {
                this.props.dispatch(checkUserUpdate(this.props.userStatus, true));
                this.reloadTemplate(this.onUnlockSuccess);
            }));
        } else {
            if (window.Intercom) {
                window.Intercom('showNewMessage', 'Hello, I would like to upgrade my plan please!');
            }
        }
    };

    onUnlockSuccess = () => {
        this.setState({
            loading: false
        });
    };

    onEditClick = () => {
        this.props.changeTab('edit');
    };

    onUseChallengeClick = (challengeId) => {
        const { opportunityId } = this.props;
        let id = challengeId;
        if (!challengeId) {
            id = this.props.challengeId;
        }
        this.props.dispatch(useChallenge(opportunityId, { challengeId: id }, () => {
            goToRecruiterConfigure(opportunityId,'my_test');
        }, this.onUserError));
    };

    onUseTemplateClick = () => {
        this.handleApplyTemplate(({ id: challengeId }) => {
            this.onUseChallengeClick(challengeId);
        });
    };

    onEditTemplate = () => {
        this.handleApplyTemplate(({ id: challengeId }) => {
            this.props.changeTab('edit', {challengeId});
        });
    };

    onUserError = (err) => {
        manageError(err, 'prev-use-error', 'Impossible to use this challenge');
    };

    render() {
        const { recruiterChallengeById, recruiterDetail, challengeId, templateData: selectedTemplate, templateId } = this.props;
        let data;
        if (challengeId) {
            data = recruiterChallengeById;
        } else {
            data = selectedTemplate;
        }

        return (
            <AsynchContainer data={data} manageError={false}>
                <SidebarItem
                    template={selectedTemplate.item}
                    opportunityId={this.state.opportunityId}
                    user={this.props.user}
                    handleUnlockTemplate={this.handleUnlockTemplate}
                    loading={this.state.loading}
                    onUseTemplateClick={this.onUseTemplateClick}
                    onUseChallengeClick={this.onUseChallengeClick}
                    onEditClick={this.onEditClick}
                    challenge={recruiterChallengeById.item}
                    recruiterDetail={recruiterDetail}
                    onEditTemplate={this.onEditTemplate}
                    challengeId={challengeId}
                    templateId={templateId}
                />
            </AsynchContainer>
        );
    }
}

const SidebarItem = ({user: {item: user}, challenge, template, challengeId, recruiterDetail, onUseChallengeClick, onUseTemplateClick, loading, onEditClick, onEditTemplate, handleUnlockTemplate }) => {
    const { locked=false, title } = template || challenge;
    const availableSlots = getChallengeAvailableSlots(user).slotTemplates;
    const selectedChallenge = checkAllObjectParams(recruiterDetail, 'challengeTest', 'challenge', 'id');
    let renderUse = false;
    if ((!selectedChallenge && challengeId) || (selectedChallenge && selectedChallenge !== parseInt(challengeId))) {renderUse = true;}
    let box;
    if (!locked) {
        box = (
            <Col sm='3' className='preview-company-details-sidebar'>
                {!challengeId && <CrazyIcon icon='icon-unlock-alt' />}
                {!challengeId && <Text style={{ textAlign: 'center' }} size='sm'> Template unlocked</Text>}
                {(challengeId && renderUse) && <CrazyButton color='primary' action={() => { onUseChallengeClick(challengeId); }} text='Use this challenge' size='ceci' loading={loading} />}
                {!challengeId && <CrazyButton color='primary' action={onUseTemplateClick} text='Use this template' size='ceci' loading={loading} />}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
                    {challengeId && <Text bold className='edit-link' onClick={onEditClick}>Edit challenge</Text>}
                    {!challengeId && <Text bold className='edit-link' onClick={onEditTemplate}>Edit template</Text>}
                </div>
            </Col>
        );
    } else {
        if (availableSlots !== 0) {
            box = (<Col sm='3' className='preview-company-details-sidebar'>
                <CrazyIcon icon='icon-lock-alt' />
                <Text style={{ textAlign: 'center' }} size='sm'> Unlock this template to see the full challenge</Text>
                <CrazyButton color='orange' action={handleUnlockTemplate} text='Unlock template' size='ceci' loading={loading} />
                <Text size='sm' className='counter-placeholder'>You have {availableSlots === -1 ? 'infinite' : availableSlots} available template{availableSlots === 1 ? '' : 's'} to unlock</Text>
            </Col>);
        } else {
            box = (<Col sm='3' className='preview-company-details-sidebar'>
                <CrazyIcon icon='icon-lock-alt' />
                <Text style={{ textAlign: 'center' }} size='sm'> Unlock this template to see the full challenge</Text>
                <CrazyButton color='orange' action={handleUnlockTemplate} text='Unlock template' size='ceci' disabled loading={loading} />
                <Text size='sm' className='counter-placeholder upgrade'>You’ve hit your 3 free template limit. <span onClick={goToUpgrade}>Upgrade now</span></Text>
            </Col>);
        }
    }
    return (<div>
        <Text size='sm' style={{ marginBottom: 30, marginLeft: 31, marginRight: 31, overflow: 'hidden' }}>{title}</Text>
        {box}
    </div>
    );
};