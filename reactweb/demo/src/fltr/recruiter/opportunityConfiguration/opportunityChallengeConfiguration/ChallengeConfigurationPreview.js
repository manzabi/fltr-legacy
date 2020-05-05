import React, { Component } from 'react';

import { connect } from 'react-redux';
import AsynchContainer from '../../../template/AsynchContainer';
import {
    getChallengeById,
    resetChallengeById,
    useChallenge
} from '../../../../redux/actions/recruiterOpportunityActions';
import Container from '../../../../layout/layout/Container';
import Grid from '../../../../layout/layout/Grid';
import { Header, Text } from '../../../../layout/FluttrFonts';
import Col from '../../../../layout/layout/Col';
import ProfilePic from '../../../../layout/uiUtils/ProfilePic';
import { getFileIcon } from '../../../../common/utils';
import { getOpportunityChallengeSelected } from '../../../../constants/opportunityChallengeProcessStatus';

@connect(({ recruiterChallengeById }) => ({ recruiterChallengeById }))
export default class OpportunityChallengeShowPage extends Component {
    componentDidMount() {
        this.props.dispatch(resetChallengeById(this.onResetOk));
    }

    onResetOk = () => {
        const {challengeId} = this.props;
        if (challengeId) {
            this.props.dispatch(getChallengeById(challengeId));
        } else {
            this.props.changeTab('templates');
        }
    }

    render() {
        const { recruiterChallengeById, opportunity, challengeId } = this.props;
        return (
            <AsynchContainer data={recruiterChallengeById} native>
                <OpportunityChallengeShow
                    changeTab={this.props.changeTab}
                    challenge={recruiterChallengeById.item}
                    opportunityId={opportunity.id}
                    opportunity={opportunity}
                    challengeId={challengeId}
                />
            </AsynchContainer>
        );
    }
}

@connect((state) => state)
class OpportunityChallengeShow extends Component {
    onUseClick = () => {
        const { opportunityId, changeTab, challengeId } = this.props;
        const data = { challengeId };

        this.props.dispatch(useChallenge(opportunityId, data, () => {
            changeTab('my_test');
        }));
    };

    onEditClick = () => {
        this.props.changeTab('edit', 'challenge');
    };

    onBackClick = () => {
        const { opportunity, changeTab } = this.props;
        const hasChallengeSelected = getOpportunityChallengeSelected(opportunity);

        if (hasChallengeSelected) {
            changeTab('my_test');
        } else {
            changeTab('challenges');
        }
    };

    renderPreviewCompanyDetails = () => {
        const { name, logo: { url } } = this.props.opportunity.company;
        return (
            <Col sm='3' className='preview-company-details'>
                <div className='picture' >
                    <ProfilePic length={87} url={url} />
                </div>
                <Text size='sm'><span>{name || 'A company'}</span> invited you to participate on a challenge to see your skills on action. Get started and show your potential!</Text>
                <Text size='sm' className='counter-placeholder'>Current countdown will be visible here</Text>
            </Col>
        );
    };

    renderAttachmentList = (list) => {
        return (
            <div className='attachment-list'>
                <div className='attachment-title'>
                    <Text bold>General attachments</Text>
                </div>
                <div className='attachment-files'>
                    {list.map(file => this.renderFile(file))}
                </div>
            </div>
        );
    };

    renderFile = ({ originalFileName }) => {
        const icon = getFileIcon(originalFileName);
        return (
            <div className='attachment-file'>
                <div style={{ width: 25 }}>
                    {/* <CrazyIcon icon='icon-attachment'/> */}
                    <i className={icon} />
                </div>
                <Text size='sm'>{originalFileName}</Text>
            </div>
        );
    };

    render() {
        const { cover, title, seniorityLevelString, tagList, requirementList, contentHtml, fileList } = this.props.challenge;
        return (<Container className='challenge-preview'>
            <div className='close-button-wrapper'>
                <Text size='sm' onClick={this.onBackClick} className='close-button' >Close</Text>
            </div>
            <Grid>
                <Header className='challenge-title'>Preview the challenge</Header>
                <Grid className='container-header-company'>
                    <Col sm='9'
                        className='header-image'
                        style={{
                            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${cover && cover.url || ''})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <Header>{title || 'Title'}</Header>
                    </Col>
                    {this.renderPreviewCompanyDetails()}
                </Grid>
                <Text bold style={{ marginBottom: 0, fontSize: 15 }}>About the challenge</Text>
                <div className='about-the-challenge' dangerouslySetInnerHTML={{ __html: contentHtml }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                    <div style={{ marginRight: 100 }}>
                        <Text bold style={{ fontSize: 15 }}>Seniority level</Text>
                        <Text size='sm'>{seniorityLevelString}</Text>
                    </div>
                </div>
                <div>
                    <Text bold style={{ marginBottom: 14, fontSize: 15 }}>Skills</Text>
                    <SkillsContainer skills={tagList} />
                </div>
                <TasksContainer tasks={requirementList} />
                {!!fileList.length && this.renderAttachmentList(fileList)}
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

const TasksContainer = ({tasks}) => {

    const renderTask = (task, index) => {
        return <div className={`task${task.required ? ' required' : ''}`}>
            <Text className='task-number' bold>Task {index + 1}</Text>
            <div className='task-description' dangerouslySetInnerHTML={{ __html: task.content }} />
        </div>;
    };
    return (
        <div className='tasks-container'>
            <Text bold style={{ marginBottom: 12, fontSize: 15 }}>Assignment</Text>
            <Text size='sm' className='tasks-assignment-quantity'>The assignment comes with {tasks.length} task{tasks.length !== 1 ? 's' : ''}:</Text>
            {tasks.map((task, index) => renderTask(task, index))}
        </div>
    );
};
