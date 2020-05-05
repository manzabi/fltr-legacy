import React, {Component} from 'react';
import {connect} from 'react-redux';
import Container from '../layout/Container';
import Grid from '../layout/Grid';
import Col from '../layout/Col';
import CrazyButton from '../buttons/CrazyButtons';
import {Header, Text} from '../FluttrFonts';
import {JUNIOR, MID_LEVEL, SENIOR} from '../../constants/senioritylevel';
import ProfilePic from '../uiUtils/ProfilePic';
import {getSkillsByTeamId} from '../../redux/actions/recruiterOpportunityActions';
import EnrichedEditor from '../../common/components/EnrichedEditor';
import {scrollTo} from '../../fltr/navigation/NavigationManager';
import CrazyIcon from '../icons/CrazyIcon';
import {checkRichEditor} from '../../fltr/utils/FormUtils';
import File from '../input/File';
import {getFileIcon, manageErrorMessage} from '../../common/utils';
import {uploadFile, uploadImage} from '../../fltr/utils/uploadUtils';
import {CHALLENGE, COMPANY} from '../../constants/imageUploadType';
import * as fileUploadTypes from '../../constants/fileUploadType';
import CrazySearchBar from '../searchbar/Searchbar';
import RecruiterCrazyModal from '../modal/RecruiterCrazyModal';
import {DISABLED, isActivatedChallenge} from '../../constants/opportunityChallengeProcessStatus';
import Cropper from '../../fltr/template/CrazyCropper';

@connect(({recruiterTagSkillsById, user}) => ({recruiterTagSkillsById, user}))
export default class OpportunityChallengeConfigurationTemplateEditor extends Component {
    constructor(props) {
        super(props);
        const { tagCategories, template } = props;
        const selectedTeamKey = Object.keys(tagCategories).find(number => tagCategories[number].defaultValue);
        const selectedTeam = selectedTeamKey ? tagCategories[selectedTeamKey] : null;
        const cover = template.cover || {url: ''};
        const logo = props.user.item.recruiterDetails.company.logo.url ? {url: props.user.item.recruiterDetails.company.logo.url } : { url: ''};
        let taskList = template.requirementList;
        if (!taskList.length) taskList = [{ content: '', required: false }];
        taskList.forEach(task => {task.temporalContent = '';});
        const title = template.title.trim().length ? template.title : '';
        const selectedSkills = template.tagList.filter(({category}) => !category) || [];
        this.state = {
            cropStatus: false,
            title,
            aboutTheChallenge: template.contentHtml || '',
            seniorityLevel: typeof template.seniorityLevel === 'number' ? template.seniorityLevel : null,
            selectedSkills,
            selectedTeam,
            taskList,
            activeTask: null,
            update: false,
            logo,
            cover,
            uploadType: null,
            attachment: template.fileList || [],
            showMissing: false,
            loading: false,
            showQuitEditingModal: false,
            showEditActiveModal: false,
            textareaHeight: 40
        };
    }

    componentDidMount() {
        const { selectedTeam } = this.state;
        if (selectedTeam) {
            this.props.dispatch(getSkillsByTeamId(selectedTeam.id));
        }
        this.setState({textareaHeight: this.setTextareaHeight()});
    }

    renderStepsExceptAssignment = stepsArray => {
        if (Array.isArray(stepsArray)) {
            return (<div className='steps-container' > {stepsArray.map((step, index) => this.renderStep(step, index))} </div>);
        } else {
            return null;
        }
    };

    renderStep = (step, index) => {
        const { title, subtitle, children, fulfilledCondition } = step;
        const { showMissing } = this.state;
        return (<div className='step' key={title} id={`step-${index+1}`}>
            {
                fulfilledCondition ?
                    <CrazyIcon className='tick' icon='icon-check-small' /> :
                    showMissing ? <CrazyIcon className='missing' icon='icon-missing' /> :
                        <Text bold className='step-number' > {index + 1} </Text>                        
            }
            <Text bold > {title} </Text>
            <Text size='sm'> {subtitle} </Text>
            {children}
        </div>
        );
    };

    renderAssignment = () => {
        const { taskList, showMissing, attachment } = this.state;
        const fulfilledCondition = taskList.every(task => task.content.length) && (taskList.length > 0 || attachment.length > 0);

        return (<div className='step' key='Tasks' style={{ position: 'relative' }} id='step-5'>
            {
                fulfilledCondition ?
                    <CrazyIcon
                        className='tick'
                        icon='icon-check-small'
                    /> :
                    showMissing ?
                        <CrazyIcon
                            className='missing'
                            icon='icon-missing'
                        /> :
                        <Text
                            bold
                            className='step-number'
                            style={{ position: 'absolute', left: '-20px' }}
                        > 5 </Text>
            }
            <Text bold> Tasks </Text>
            <Text > Add as many tasks as you wish to prove your candidates. </Text>
            {taskList.map((task, index) => this.renderTask(task, index))}
            {!!attachment.length && this.renderAttachMentList(attachment)}
            <div className='add-new-task' onClick={this.onAddTask}>
                <Text bold size='sm'>Add new task</Text>
            </div>
            <form id='addAttachmentsForm'>
                <File
                    label='Add general attachment'
                    id='addAttachments'
                    onChange={(event) => {this.handleUpload(event, fileUploadTypes.CHALLENGE);}}
                />
            </form>
        </div>
        );
    };

    renderAttachMentList = (list) => {
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

    renderFile = ({originalFileName, id}) => {
        const icon = getFileIcon(originalFileName);
        return (
            <div className='attachment-file' onClick={() => {this.onDeleteFile(id);}}>
                <div style={{width: 25}}>
                    <i className={icon} />
                </div>
                <Text size='sm'>{originalFileName} <span>delete</span></Text>
            </div>
        );
    };

    onDeleteFile = (id) => {
        const attachmentCopy = [...this.state.attachment];
        const index = attachmentCopy.findIndex(file => file.id === id);

        if (index !== -1) {
            attachmentCopy.splice(index,1);
            this.setState({attachment:attachmentCopy});
        }
    };

    onAddTask = () => {
        const { taskList } = this.state;
        const newTaskList = [...taskList];
        newTaskList.push({ content: '', required: false });
        this.setState({ taskList: newTaskList });
    };

    returnStepsArray = () => {
        const {title, logo, aboutTheChallenge, seniorityLevel, selectedSkills} = this.state;

        const firstChildren = this.firstChildren();
        const secondChildren = this.secondChildren();
        const thirdChildren = this.thirdChildren();
        const fourthChildren = this.fourthChildren();

        const stepsArray = [{
            title: 'Title and brand images',
            subtitle: 'Personalize the theme with a cool title, a cover image and your brand logo.',
            children: firstChildren,
            fulfilledCondition: !!(title.length && logo.url)
        },
        {
            title: 'About the challenge',
            subtitle: 'Amaze your candidates with an introduction.',
            children: secondChildren,
            fulfilledCondition: !!(checkRichEditor(aboutTheChallenge))
        },
        {
            title: 'Seniority level',
            subtitle: 'What is the seniority level that your are looking for?',
            children: thirdChildren,
            fulfilledCondition: !!(seniorityLevel !== -1)
        },
        {
            title: 'Skills',
            subtitle: 'Select between 1 to 5 skills you want to prove the most.',
            children: fourthChildren,
            fulfilledCondition: !!(selectedSkills.length > 0 && selectedSkills.length < 6)
        }];

        return stepsArray;
    };

    openCrop = (file) => {
        this.setState({cropStatus: true, tempImage: file});
    };

    onCrop = (file) => {
        this.closeCrop();
        const event = {
            target: {id: 'addImage'}
        };
        this.handleUpload(event, this.state.uploadType, file);
    };

    closeCrop = () => {
        this.setState({
            cropStatus: false
        });
    };

    onCancelCrop = () => {
        this.closeCrop();
    };

    handleSelectLogo = ({target: {files}}) => {
        const image = files[0];
        this.setState({uploadType: COMPANY}, () => {this.openCrop(image);});
    };

    handleSelectCover = ({target: {files}}) => {
        const image = files[0];
        this.setState({uploadType: CHALLENGE}, () => {this.openCrop(image);});
    };

    handleUpload = async (event, uploadType, image) => {
        let file; 
        if (image) file = image; 
        else { 
            file = document.getElementById('addAttachments').files[0]; 
        } 
        if (uploadType === COMPANY || uploadType === CHALLENGE) {
            const response = await uploadImage(uploadType, file);
            if (response.status === 200) {
                const key = uploadType === COMPANY ? 'logo' : 'cover';
                this.setState({
                    [key]: response.data
                });
            } else {
                manageErrorMessage('ImageUpload', 'There was an error uploading your image.');
            }

            document.getElementById('cover-image-form-1').reset();
            document.getElementById('company-logo-form-1').reset();
        } else if (uploadType === fileUploadTypes.CHALLENGE) {
            const response = await uploadFile(uploadType, file);
            if (response.status === 200) {
                const fileList = [...this.state.attachment, { ...response.data }];
                this.setState({attachment: fileList});
            } else {
                manageErrorMessage('FileUpload', 'There was an error uploading your file.');
            }
            document.getElementById('addAttachmentsForm').reset();
        }
    };

    setTextareaHeight = () => {
        const element = document.getElementById('editor-textarea');
        return element.scrollHeight > element.clientHeight ? element.scrollHeight : 40;
    };

    firstChildren = () => {
        return (<Grid className='first-step' >
            <Col sm='9'
                className='cover-image'
                style={
                    {
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.state.cover.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }
                } >
                <div style={
                    {
                        position: 'relative',
                        marginTop: 133
                    }
                } >
                    <textarea
                        placeholder='Write a title here'
                        onChange={this.onTitleInputChange}
                        value={this.state.title}
                        maxLength={70}
                        key='title input'
                        id='editor-textarea'
                        className={this.state.showMissing && !this.state.title.length ? 'missing-title' : ''}
                        height={this.state.textareaHeight}
                        style={{height: this.state.textareaHeight, marginTop: 40 - this.state.textareaHeight }}
                    />
                    <Text size='sm' className='title-length-counter' > {`${this.state.title.length}/70`} </Text>
                    <Text size='sm' >ex. Landing page redesign. What would you do?</Text>
                    <Text 
                        size='sm' 
                        style={{visibility: this.state.showMissing && !this.state.title.length ? 'visible' : 'hidden'}}
                        className='required-field'
                    >Required field</Text>
                </div >
                <div className='upload-button' >
                    <form id='cover-image-form-1'>
                        <File
                            label='UPLOAD COVER IMAGE'
                            id='cover-image-form'
                            onChange={this.handleSelectCover}
                            type='image'
                        />
                    </form>
                </div >
            </Col>
            <Col sm='3' className={`company-logo${this.state.showMissing && !this.state.logo.url ? ' missing-logo' : ''}`} >
                <div className='picture' >
                    <ProfilePic length='' url={this.state.logo.url} />
                </div>
                <div className='upload-button' >
                    <form id='company-logo-form-1' style={{maxWidth: '100%'}}>
                        <File
                            label='UPLOAD YOUR LOGO'
                            id='company-logo-form'
                            onChange={this.handleSelectLogo}
                            type='image'
                        />
                    </form>
                </div >
                <Text 
                    size='sm' 
                    style={{visibility: this.state.showMissing && !this.state.logo.url ? 'visible' : 'hidden'}}
                    className='required-field'
                >Required field</Text>
            </Col>
        </Grid >);
    };

    secondChildren = () => {
        return (<Grid className='second-step' >
            <Col sm='9' >
                <EnrichedEditor
                    placeholder='What is the challenge about? What do you expect to receive to see their skills in action? Write here the general introduction to the challenge.'
                    textareaId='aboutChallengeTextarea'
                    value={this.state.aboutTheChallenge}
                    onChange={this.onAboutChallengeChange}
                    maxLength={2000}
                    update={this.state.update}
                    className={this.state.showMissing && !checkRichEditor(this.state.aboutTheChallenge) ? 'missing-about' : ''}
                />
                <Text 
                    size='sm' 
                    style={{visibility: this.state.showMissing && !checkRichEditor(this.state.aboutTheChallenge) ? 'visible' : 'hidden'}}
                    className='required-field'
                >Required field</Text>
            </Col>
        </Grid>);
    };

    thirdChildren = () => {
        const {seniorityLevel, showMissing} = this.state;

        return (<Grid className='third-step' >
            <Col sm='9' className={`options-wrapper${showMissing && seniorityLevel === -1 ? ' missing-seniority' : ''}`} >
                <div className={`option${seniorityLevel === JUNIOR.id ? ' selected' : ''}`} onClick={() => { this.onSeniorityClick(JUNIOR.id); }} >
                    <Text > Junior </Text>
                </div >
                <div className={`option${seniorityLevel === MID_LEVEL.id ? ' selected' : ''}`} onClick={() => { this.onSeniorityClick(MID_LEVEL.id); }} >
                    <Text > Medium </Text>
                </div >
                <div className={`option${seniorityLevel === SENIOR.id ? ' selected' : ''}`} onClick={() => { this.onSeniorityClick(SENIOR.id); }} >
                    <Text > Senior </Text>
                </div >
                <Text 
                    size='sm' 
                    style={{visibility: showMissing && seniorityLevel === -1 ? 'visible' : 'hidden'}}
                    className='required-field'
                >Required field</Text>
            </Col>
        </Grid >);
    };

    fourthChildren = () => {
        const teamOptions = this.teamOptions();
        let skills = this.props.recruiterTagSkillsById.item;
        if (!skills) skills = [];
        const arrayofSkills = Object.values(skills);
        arrayofSkills.forEach(skill => {
            skill.text = skill.value;
        });
        return (<Grid className='fourth-step' >
            <Col sm='9' className='skills-search-container'>
                <CrazySearchBar 
                    placeholder='SEARCH BY SKILLS'
                    options={arrayofSkills}
                    renderChildren={this.renderSearchbarChildren}
                    onChange={() => { return; }}
                    childrenHeight={!this.state.selectedTeam ? (teamOptions.length < 5 ? teamOptions.length * 42 : 4 * 42) : '200px'}
                    openIfText
                    backdropClasses={['skill', 'skills-wrapper', 'searchbar-children-wrapper', 'create-tag-text', 'team-option', 'searchbar-close', '']}
                    stayOpenOnChange
                    openOnFocus
                    className={this.state.showMissing && !this.state.selectedSkills.length ? 'error-searchbar' : ''}
                />
                <SkillsContainer 
                    skills={this.state.selectedSkills}
                    renderSkill={this.renderSkill} 
                />
                <Text 
                    size='sm' 
                    style={{visibility: this.state.showMissing && !this.state.selectedSkills.length ? 'visible' : 'hidden'}}
                    className='required-field'
                >Required field</Text>
            </Col>
        </Grid >);
    };

    resetFilters = () => {
        this.setState({
            selectedTeam: null,
            selectedSeniority: null
        });
    };

    renderSearchbarChildren = (options, text, emptyField) => {
        const { selectedTeam } = this.state;
        if (!selectedTeam) {
            const teamOptions = this.teamOptions();
            return (<div className='searchbar-children-wrapper no-team'>
                <div className='team-title'>CATEGORIES</div>
                {teamOptions.map(option => <div className='team-option' key={option.id} onClick={() => { this.onTeamDropdownChange(option); }}>{option.text}</div>)}
            </div>);
        }
        return (<div className='searchbar-children-wrapper'>
            <div className='selected-team-searchbar'>
                {selectedTeam.text && selectedTeam.text.toUpperCase() || selectedTeam.value && selectedTeam.value.toUpperCase()} 
                <CrazyIcon icon='icon-cancel'
                    onClick={this.resetFilters}
                    className='searchbar-close'
                />
            </div>
            <SkillsContainer
                renderSkill={this.renderSkill}
                skills={options}
                emptyField={emptyField}
            />
            {text.length > 0 && <div className='create-tag-text' onClick={() => { this.onRequestTag(text, emptyField); }}>
                <CrazyIcon icon='icon-plus-thin'/><Text bold size='sm'>Create tag for “{text}”</Text>
            </div>}
        </div>);
    };

    onRequestTag = (text, emptyField) => {
        const { selectedSkills } = this.state;
        if (!text.length || selectedSkills.find(skill => skill.value === text)) return;
        const newSkills = [...selectedSkills];
        newSkills.push({ value: text, key: text, text });
        this.setState({ selectedSkills: newSkills }, emptyField);
    };

    renderTask = (task, index) => {
        const {activeTask, taskList} = this.state;
        const isActive = `aboutTaskTextarea${index}` === activeTask;
        return (<div className={`task last${isActive ? ' shadow' : ''}`}>
            <div className='task-field'>
                <div className='title-and-controls'>
                    <Text>Task {index + 1}</Text>
                    <div className='control-panel'>
                        {!isActive && 
                            <div className='buttons-wrapper'>
                                <CrazyIcon icon='icon-arrow-drop-up' onClick={() => {this.onMoveTask('up', index);}} disabled={index <= 0}/>
                                <CrazyIcon icon='icon-arrow-drop-down' onClick={() => {this.onMoveTask('down', index);}} disabled={index >= taskList.length - 1} />
                                <CrazyIcon icon='icon-mandatory' onClick={() => {this.onToggleRequired(index);}} style={{color: task.required ? '#FF5656' : ''}} />
                                <CrazyIcon icon='icon-duplicate' onClick={() => {this.onDuplicateTask(index);}} />
                                <CrazyIcon icon='icon-delete' onClick={() => {this.onDeleteTask(index);}} disabled={taskList.length < 1} />
                            </div> 
                        }
                        {isActive && 
                        <div className='buttons-wrapper' style={{justifyContent: 'flex-end'}}>
                            <CrazyIcon icon='icon-mandatory' onClick={() => {this.onToggleRequired(index);}} style={{color: task.required ? '#FF5656' : ''}} />
                        </div> }
                    </div>
                </div>
                <EnrichedEditor
                    placeholder='Write the title and the description of the task with all the necessary details.
                    You can attach images or bullet points to make it more easier to understand.'
                    textareaId={`aboutTaskTextarea${index}`}
                    value={task.temporalContent || task.content || ''}
                    onChange={(event) => { this.onTaskChange(event, index); }}
                    maxLength={2000}
                    className='task-editor'
                    focusElement={({ target: { id } }) => {this.setState({ activeTask: id });}}
                    update={this.state.update}
                />
            </div>
            {isActive && <div className='buttons-wrapper'>
                <CrazyButton text='Cancel' size='ceci' color='white' action={() => { this.onTaskEditCancel(index); }} />
                <CrazyButton text='Save' size='ceci' action={() => { this.onTaskEditSave(index); }} disabled={!checkRichEditor(taskList[index].temporalContent)} />
            </div>}
        </div>);
    };

    
    onTaskEditCancel = (index) => {
        const taskListCopy = [...this.state.taskList];
        taskListCopy[index].temporalContent = '';
        this.setState({taskList: taskListCopy, update: true, activeTask: null}, () => {this.setState({update: false});});
    };
    
    onTaskEditSave = (index) => {
        const taskListCopy = [...this.state.taskList];
        taskListCopy[index].content = taskListCopy[index].temporalContent;
        taskListCopy[index].temporalContent = '';
        this.setState({activeTask: null, taskList: taskListCopy, update: true}, () => {this.setState({update: false});});
    };

    onMoveTask = (direction, index) => {
        const taskListCopy = [...this.state.taskList];
        const taskToMove = taskListCopy[index];
        taskListCopy.splice(index,1);

        if (direction === 'up' && index > 0) {
            taskListCopy.splice(index - 1, 0, taskToMove);
        } else if (direction === 'down' && index < this.state.taskList.length - 1) {
            taskListCopy.splice(index + 1, 0, taskToMove);
        } else {
            return;
        }
        this.setState({taskList: taskListCopy, update: true},() => { this.setState({update: false});});
    };

    onDeleteTask = (index) => {
        const taskListCopy = [...this.state.taskList];
        taskListCopy.splice(index,1);

        this.setState({taskList: taskListCopy, update: true},() => { this.setState({update: false});});
    };
    
    onDuplicateTask = (index) => {
        const taskListCopy = [...this.state.taskList];
        taskListCopy.splice(index + 1, 0, taskListCopy[index]);

        this.setState({taskList: taskListCopy, update: true},() => { this.setState({update: false});});
    };

    onToggleRequired = (index) => {
        const taskListCopy = [...this.state.taskList];
        const currentState = taskListCopy[index].required;
        taskListCopy[index].required = !currentState;
        this.setState({taskList: taskListCopy});
    };
    
    onTaskChange = ({ content, id }, index) => {
        const { taskList } = this.state;
        const newTaskList = [...taskList];
        const currentTask = newTaskList[index];
        currentTask.temporalContent = content;
        this.setState({ taskList: newTaskList });
    };

    teamOptions = () => {
        const { tagCategories } = this.props;
        return Object.keys(tagCategories).map((element) => {
            const {id, value} = tagCategories[element];
            let text = value.charAt(0).toUpperCase() + value.slice(1);
            if (text === 'It') text = text.toUpperCase();
            return ({
                text,
                value,
                id
            });
        });
    };

    renderSkill = (skill, emptyField) => {
        if (skill) {
            const { selectedSkills } = this.state;
            const isSelected = selectedSkills.find(element => element.id === skill.id);
            let className = 'skill';
            if (isSelected || skill.id === undefined) className += ' selected';
            return (
                <div className={className} onClick={(isSelected || skill.id === undefined) ? () => { return; } : () => { this.onSelectSkill(skill, emptyField); }}>
                    <span>{skill.value}</span>
                    <div className='cross-in-circle' onClick={() => { this.onSelectSkill(skill); }}><CrazyIcon icon='icon-cancel' /></div>
                </div>
            );
        }
    };

    onSelectSkill = (skill) => {
        const { selectedSkills } = this.state;
        const selectedSkillsCopy = [...selectedSkills];
        const isSelected = selectedSkills.map(element => element.id).indexOf(skill.id);
        if (isSelected > -1) {
            selectedSkillsCopy.splice(isSelected, 1);
        } else if (selectedSkillsCopy.length < 5) {
            selectedSkillsCopy.push(skill);
        }

        this.setState({ selectedSkills: selectedSkillsCopy });
    };

    onTeamDropdownChange = (team) => {
        if (team.id) this.props.dispatch(getSkillsByTeamId(team.id));

        this.setState({ selectedTeam: team });
    };

    onBeforePreviewClick = () => {
        const {opportunity, template} = this.props;

        if (opportunity && opportunity.recruiterDetail && opportunity.recruiterDetail.challengeTest && opportunity.recruiterDetail.challengeTest.challenge && opportunity.recruiterDetail.challengeTest.challenge.id === template.id) {
            this.onPreviewClick('my_test');
        } else {
            this.onPreviewClick();
        }
    };

    shouldOpenSaveModal = () => {
        const {opportunity} = this.props;
        const { status } = opportunity && opportunity.challengeDetail || { status: DISABLED };
        const isActive = isActivatedChallenge(status);
        if (opportunity && !!opportunity.applied && isActive) {
            this.setState({showEditActiveModal: true});
        } else {
            this.onBeforePreviewClick();
        }
    };

    onPreviewClick = (where = 'preview') => {
        const {attachment, aboutTheChallenge: introduction, title, cover, taskList, logo, seniorityLevel, selectedSkills} = this.state;
        const {templateId} = this.props.template;
        const skills = selectedSkills.map(skill => skill.value);
        const data = {
            attachmentList: attachment.map((file) => file.id),
            coverImageId: cover.id,
            draft: false,
            introduction,
            requirementList: taskList.filter(({ content }) => checkRichEditor(content)),
            templateId: templateId || null,
            title,
            companyLogoId: logo.id,
            seniorityLevel,
            skills
        };
        this.setState({loading: true}, () => {
            this.props.onSave(data, where);
        });
    };

    onMissingClick = () => {
        const {taskList, attachment} = this.state;

        const fulfilledList = this.returnStepsArray().map(step => step.fulfilledCondition);
        fulfilledList.push(taskList.every(task => task.content.length) && (taskList.length > 0 || attachment.length > 0)); //fifth step

        const firstMissing = fulfilledList.findIndex(element => element === false);
        if (firstMissing === -1) return;
        let missingClassName = `step-${firstMissing + 1}`;

        this.setState({showMissing: true},() => {
            const element = document.getElementById(missingClassName);
            if (element) {
                const top = element.offsetTop;

                scrollTo(top, undefined, 'content-view' );
            }
        });
    };

    onTitleInputChange = ({ target: { value: title } }) => {
        this.setState({
            title, textareaHeight: this.setTextareaHeight()
        });
    };

    onAboutChallengeChange = ({ content }) => {

        this.setState({
            aboutTheChallenge: content
        });
    };

    onSeniorityClick = index => {
        this.setState({
            seniorityLevel: index
        });
    };

    onCloseConfirm = () => {
        this.props.changeTab('preview');
    };

    onCloseCancel = () => {
        this.setState({showQuitEditingModal: false});
    };
    onCloseCancelSecondModal = () => {
        this.setState({showEditActiveModal: false});
    };

    onClose = () => {
        this.setState({showQuitEditingModal: true});
    };

    previewDisabled = () => {
        return !this.checkAllFulfilled();
    };

    checkAllFulfilled = () => {
        const {taskList} = this.state;

        const fulfilledList = this.returnStepsArray().map(step => step.fulfilledCondition);
        fulfilledList.push(taskList.every(task => task.content.length)); //fifth step

        const firstMissing = fulfilledList.findIndex(element => element === false);

        if (firstMissing === -1) return true;
        return false;
    };

    render() {
        const stepsArray = this.returnStepsArray();
        const isDisabled= this.previewDisabled();
        return (
            <Container className='challenge-configuration-template-edit' >
                <Grid>
                    <div className='close-button-wrapper'>
                        <Text size='sm' onClick={this.onClose} className='close-button' >Close</Text>
                    </div>
                    <Col sm='12'>
                        <Header className='page-title' size='lg' > Challenge </Header>
                        <Text className='page-subtitle' size='sm'>Customize the challenge introductory page and build your challenge to see the talent of your candidates. </Text>
                        <Header size='sm' className='introduction-page'> Introduction page </Header>
                        {this.renderStepsExceptAssignment(stepsArray)}
                        <Header > Assignment </Header>
                        {this.renderAssignment()}
                        <Footer onPreviewClick={this.shouldOpenSaveModal} onMissingClick={this.onMissingClick} previewDisabled={isDisabled} loading={this.state.loading}/>
                    </Col>
                </Grid >
                <RecruiterCrazyModal
                    show={this.state.showQuitEditingModal}
                    onCloseButton={this.onCloseCancel}
                    title='Quit editing?'
                    className='close-editor-modal'
                    backdrop
                    size='md'
                    manageUiFix={false}
                >
                    <div className='close-editor-modal-children'>
                        <Text size='sm' style={{marginRight: 17}}>Leaving this page without saving you will lose all modifications or information added.</Text>
                        <div className='buttons-wrapper'>
                            <CrazyButton color='white' size='ceci' text='Cancel' action={this.onCloseCancel}/>
                            <CrazyButton size='ceci' text='Leave page' action={this.onCloseConfirm} style={{marginLeft: 9}} />
                        </div>
                    </div>
                </RecruiterCrazyModal>
                <RecruiterCrazyModal
                    show={this.state.showEditActiveModal}
                    onCloseButton={this.onCloseCancelSecondModal}
                    title='Warning'
                    className='close-editor-modal'
                    backdrop
                    size='md'
                    manageUiFix={false}
                >
                    <div className='close-editor-modal-children'>
                        <Text size='sm' style={{marginRight: 17}}>This test is already activated. All candidates and team members will see the changes once they have been saved.</Text>
                        <div className='buttons-wrapper'>
                            <CrazyButton color='white' size='ceci' text='Cancel' action={this.onCloseCancelSecondModal}/>
                            <CrazyButton size='ceci' text='Save' action={this.onBeforePreviewClick} style={{marginLeft: 9}} />
                        </div>
                    </div>
                </RecruiterCrazyModal>
                {this.state.cropStatus &&
                    <Cropper
                        onCrop={this.onCrop}
                        onCancelCrop={this.onCancelCrop}
                        file={this.state.tempImage}
                        status={this.state.cropStatus}
                        ratio={this.state.uploadType === COMPANY ? 1 : 2}
                    />
                }
            </Container>
        );
    }
}

const Footer = ({onPreviewClick, onMissingClick, previewDisabled, loading}) => {
    return (<div className='template-edit-footer' >
        {previewDisabled ?
            <Text size='sm'>It seems like something is missing to continue. Let’s <span onClick={onMissingClick}>see what is missing!</span></Text> :
            <Text size='sm'>The challenge is ready to preview. Well done!</Text>
        }
        <CrazyButton text='Save' action={onPreviewClick} disabled={previewDisabled} loading={loading} size='ceci' />
    </div>);
};

const SkillsContainer = ({ skills, emptyField, renderSkill }) => {
    if (skills) {
        return (<div className='skills-wrapper' > {Object.keys(skills).map(number => renderSkill(skills[number], emptyField))}
        </div>);
    } else {
        return (<div className='skills-wrapper' />);
    }
};