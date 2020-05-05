import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { unlockTemplate } from '../../../../redux/actions/templateActions';
import { getChallengeAvailableSlots } from '../../../utils/planUtils';
import { checkUserUpdate } from '../../../../redux/actions/userActions';

import Container from '../../../../layout/layout/Container';
import Grid from '../../../../layout/layout/Grid';
import { Header, Text } from '../../../../layout/FluttrFonts';
import Col from '../../../../layout/layout/Col';
import ProfilePic from '../../../../layout/uiUtils/ProfilePic';

@withRouter
@connect((state) => state)
export default class OpportunityTemplatePreviewComponent extends Component {
    state = {
        loading: false
    }

    handleUnlockTemplate = () => {
        this.setState({
            loading: true
        });
        const { opportunityId, templateId } = this.props;
        if (getChallengeAvailableSlots(this.props.user.item).slotTemplates > 0) {
            this.props.dispatch(unlockTemplate(opportunityId, templateId, () => {
                this.props.dispatch(checkUserUpdate(this.props.userStatus, true));
                this.props.reloadTemplate(this.onUnlockSuccess);
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

    onBackClick = () => {
        this.props.changeTab('templates');
    };

    renderPreviewCompanyDetails = () => {
        const { name, logo: { url } } = this.props.opportunity.company;
        return (<Col sm='3' className='preview-company-details'>
            <div className='picture' >
                <ProfilePic length='87px' url={url} />
            </div>
            <Text size='sm'><span>{name || 'A company'}</span> invited you to participate on a challenge to see your skills on action. Get started and show your potential!</Text>
            <Text size='sm' className='counter-placeholder'>Current countdown will be visible here</Text>
        </Col>);
    };

    render() {
        const { template, template: { locked }, user: { item: user } } = this.props;
        const availableSlots = getChallengeAvailableSlots(user).slotTemplates;
        return (
            <Container className='template-preview'>
                <div className='close-button-wrapper'>
                    <Text size='sm' onClick={this.onBackClick} className='close-button' >Close</Text>
                </div>
                <Grid>
                    <Header className='template-title' >Preview the challenge</Header>
                    <Grid className='container-header-company'>
                        <Col sm='9'
                            className='header-image'
                            style={{
                                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${template.cover.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <Header style={{ overflow: 'hidden' }}>{template.title || 'Title'}</Header>
                        </Col>
                        {this.renderPreviewCompanyDetails()}
                    </Grid>
                    <Text bold style={{ marginBottom: 0, fontSize: 15 }}>About the challenge</Text>
                    <div className='about-the-challenge' dangerouslySetInnerHTML={{ __html: template.summary }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                        <div style={{ marginRight: 100 }}>
                            <Text bold>Seniority level</Text>
                            <Text>{template.seniorityLevelString}</Text>
                        </div>
                        <div>
                            <Text bold>Estimated time to review the answer</Text>
                            <Text>{template.durationExpertString}</Text>
                        </div>
                    </div>
                    <div>
                        <Text bold style={{ marginBottom: 14, fontSize: 15 }}>Skills</Text>
                        <SkillsContainer skills={template.tagList} />
                    </div>
                    <TasksContainer
                        tasks={template.requirementList}
                        locked={locked}
                        handleUnlockTemplate={this.handleUnlockTemplate}
                        hideBottomText={availableSlots === 0 && locked}
                    />
                </Grid>
            </Container>
        );
    }
}

const SkillsContainer = ({skills}) => {
    const renderSkill = (skill) => {
        if (skill) {
            return (
                <div className='skill'>
                    <span>{skill.value}</span>
                </div>
            );
        }
    };
    return (
        <div className='skills-wrapper'>
            {Object.keys(skills).map(number => renderSkill(skills[number]))}
        </div>
    );
};

const TasksContainer = ({ tasks, locked, handleUnlockTemplate, hideBottomText }) => {

    const renderTask = (task, index) => {
        return <div className={`task${task.required ? ' required' : ''}`}>
            <Text className='task-number' bold>Task {index + 1}</Text>
            <div className='task-description' dangerouslySetInnerHTML={{ __html: task.content }} />
        </div>;
    };

    let className = 'tasks-container';
    if (locked) {
        className += ' locked';
    }
    if (locked) {
        return (<div className={className}>
            <Text bold style={{ marginBottom: 12, fontSize: 15 }}>Assignment</Text>
            <Text size='sm' className='tasks-assignment-quantity'>The assignment comes with {tasks.length} task{tasks.length !== 1 ? 's' : ''}:</Text>
            {tasks.length > 0 && renderTask(tasks[0], 0)}
            <div className='continue-reading'>
                <Text size='sm' style={{ visibility: hideBottomText ? 'hidden' : 'visible' }}>To continue reading <span onClick={handleUnlockTemplate}>unlock</span> the template</Text>
            </div>
        </div>);
    }
    return (
        <div className={className}>
            <Text bold style={{ marginBottom: 12, fontSize: 15 }}>Assignment</Text>
            <Text size='sm' className='tasks-assignment-quantity'>The assignment comes with {tasks.length} task{tasks.length !== 1 ? 's' : ''}:</Text>
            {tasks.map((task, index) => renderTask(task, index))}
        </div>
    );
};