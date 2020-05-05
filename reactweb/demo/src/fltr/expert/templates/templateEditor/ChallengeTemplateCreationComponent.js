import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getAllSeniorityLevels} from '../../../../constants/senioritylevel';
import {uploadImage, uploadFile} from '../../../../fltr/utils/uploadUtils';

import {manageErrorMessage, manageSuccess, manageError} from '../../../../common/utils';

import DropDown from '../../../../common/components/DropDown';

import {createChallengeTemplate, editChallengeId} from '../../../../redux/actions/templateActions';

import {goToTemplatesList} from '../../../../fltr/navigation/NavigationManager';

import * as formUtils from '../../../utils/FormUtils';
import EnrichedEditor from '../../../../common/components/EnrichedEditor';
import AttachmentList from '../../../../common/components/AtachmentsList';
import CommonConfirmModal from '../../../../common/components/CommonConfirmModal';
import SkillsInputComponent from '../../../../common/components/SkillsInputComponent';
import UploadButton from '../../../../common/components/UploadButton';

var Config = require('Config');

let allSeniorityLevels = getAllSeniorityLevels();
allSeniorityLevels = allSeniorityLevels.map((item) => {
    return {
        value: item.id,
        placeholder: item.description
    };
});
@connect((state) => state)
export default class ChallengeTemplateCreation extends Component {
    constructor (props) {
        super(props);
        let template = {
            attachmentList: [],
            title: '',
            summary: '',
            content: '',
            seniorityLevel: 0,
            introduction: '',
            submissionRequirement: '',
            requirementList: [],
            tagList: [],
            cover: {},
            durationExpert: 10,
            durationPlayer: 60,
            groupId: null
        };

        if (props.isEdit) {
            const data = {...this.props.data.item};
            template = {
                attachmentList: data.fileList,
                title: data.title,
                summary: data.summary,
                content: '',
                seniorityLevel: data.seniorityLevel,
                introduction: data.introduction,
                submissionRequirement: data.submissionRequirement,
                requirementList: data.requirementList,
                cover: data.cover,
                tagList: data.tagList,
                durationExpert: data.durationExpert,
                durationPlayer: data.durationPlayer,
                groupId: data.group
            };
        }
        this.state = {
            isEdit: props.isEdit,
            isJudgeFlow: false,
            enableButton: false,
            expertTime: [
                {
                    value: 10,
                    placeholder: '10 minutes'
                },
                {
                    value: 15,
                    placeholder: '15 minutes'
                },
                {
                    value: 20,
                    placeholder: '20 minutes'
                },
                {
                    value: 30,
                    placeholder: '30 minutes'
                }
            ],
            playerTime: [
                {
                    value: 60,
                    placeholder: '1 hour'
                },
                {
                    value: 120,
                    placeholder: '2 hours'
                },
                {
                    value: 180,
                    placeholder: '3 hours'
                },
                {
                    value: 240,
                    placeholder: '4 hours'
                }
            ],
            template: template,
            modalStatus: false,
            modalContext: undefined,
            modalCallback: undefined,
        };
    }
    
    handleChange (event) {
        // console.log('handleChange');
        formUtils.handleInputChange(event, this, this.state.formValidation);
    }
    
    handleUpload = async (event, uploadType, image) => {
        const {id} = event.target;
        let file; 
        if (image) file = image; 
        else { 
            file = document.getElementById(id).files[0]; 
        } 
        if (uploadType === 3) {
            // if(this.props.uploadImage.item){
            //     this.deleteImage();
            // }
            const response = await uploadImage(uploadType, file);
            // console.log(response)
            if (response.status === 200) {
                this.setState({
                    template: { ...this.state.template, cover: response.data },
                }, this.populateParentState);
            } else {
                manageErrorMessage('ImageUpload', 'There was an error uploading your image.');
            }
            // this.props.dispatch(uploadImage(uploadType, file));
            // this.setState({
            //     changedImage : true
            // })
            document.getElementById('addimageForm').reset();
        } else if (uploadType === 2) {
            const response = await uploadFile(uploadType, file);
            if (response.status === 200) {
                const attachmentList = [...this.state.template.attachmentList, { ...response.data }];
                this.setState({
                    template: { ...this.state.template, attachmentList }
                }, this.populateParentState);
            } else {
                manageErrorMessage('FileUpload', 'There was an error uploading your file.');
            }
            // this.props.dispatch(uploadFile(uploadType, file));
            const form = `${id}Form`;
            document.getElementById(form).reset();
        }
    };

    openCrop = (image) => {
        // console.log(e);
        this.imageCrop.putFile(image);
        this.cropFullScreen.open();
    };

    onCrop = (file) => {
        const event = {
            target: {id: 'addImage'}
        };
        this.handleUpload(event, 3, file);
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        // const validationStatus = this.checkAll();
        const requestObject = {
            ...this.state.template,
            coverImageId: this.state.template.cover.id,
            cover: undefined,
            attachmentList: this.state.template.attachmentList.map((attachment) => attachment.id),
            tagList: this.state.template.tagList.map((tag) => tag.value)
        };

        // TODO: Add validations to the form after sending to the API
        if (true) {
            if (this.state.isEdit) {
                const id = this.props.data.item.id;
                this.props.dispatch(editChallengeId(requestObject, id, this.onSaveOk, this.onSaveError));
            } else {
                this.props.dispatch(createChallengeTemplate(requestObject, this.onSaveOk, this.onSaveError));
            }
        }
    }
    onSaveOk = () => {
        let message = 'New temple created succesfuly';
        if (this.state.isEdit) message = 'Your template has been succesfuly saved';
        manageSuccess('templateSave', message);
        goToTemplatesList();
    }
    onSaveError = (err) => {
        let message = 'An error ocurred saving your template';
        if (err.response.data.message) {
            message += '. ' + err.response.data.message;
        }
        manageError(err, 'templateSave', message);
    }
    checkAll = () => {
        // console.log('check all note create/update');
        // console.log('description : ' + this.state.form.description);
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }
    
    handleSelectImage = (event) => {
        event.preventDefault();
        let file = event.target.files[0];
        this.openCrop(file);
    }
    uploadImage = async (id, uploadType, image) => {
        let file;
        if (image) file = image;
        else file = document.getElementById(id).files[0];
        if(uploadType == 3){
            const response = await uploadImage(uploadType, file);
            if (response.status === 200) {
                this.setState({
                    attachedImages: {...response.data},
                    template: {...this.state.template, coverImageId: response.data.id},
                    imageActive: true
                });
            } else {
                manageErrorMessage('ImageUpload', 'There was an error uploading your image.');
            }
            document.getElementById('addimageForm').reset();
        }else if(uploadType == 2){
            const response = await uploadFile(uploadType, file);
            // console.log(response)
            if (response.status === 200) {
                const attachedFiles = [...this.state.attachedFiles, {...response.data}];
                this.setState({
                    attachedFiles: attachedFiles,
                    template: {...this.state.template, attachmentList: attachedFiles.map((file) => file.id)}
                });
            } else {
                manageErrorMessage('FileUpload', 'There was an error uploading your file.');
            }
            const form = `${id}Form`;
            document.getElementById(form).reset();
        }
        
    };
    
    handleChangeTags = (tags) => {
        const {template} = this.state;
        this.setState({
            template: {
                ...template,
                tagList: tags
            }
        });
    };

    handleEditRequirement = (requirement) => {
        const { id, content } = requirement;
        this.handleSaveEditRequirement({
            content,
            id: parseInt(id.split('editTaskWithId_').join(''), 10)
        });
    };

    handleSaveEditRequirement = ({ id, content }) => { 
        const { template } = this.state; 
        template.requirementList[id] = { 
            ...template.requirementList[id], 
            content 
        }; 
        this.setState({ 
            template 
        }); 
    };

    handleRemoveRequirement = ({ target }) => {
        this.handleOpenModal('remove_task', () => {
            const { id } = target;
            const elementToRemove = parseInt(id, 10);
            const { template } = this.state;
            const updatedList = template.requirementList.filter((requirement, index) => {
                return index !== elementToRemove;
            });
            template.requirementList = [...updatedList];
            this.setState({
                template,
                requirementsUpdated: true,
                modalStatus: false
            }, () => {
                this.setState({
                    requirementsUpdated: false
                }, this.populateParentState);
            });
        });
    };
    
    handleMoveElement = (event, index, action) => {
        const id = index;
        const requirementNumber = this.state.template.requirementList.length - 1;
        let target;
        const moveElementToPosition = (initial, target) => {
            const targetItem = this.state.template.requirementList[initial];
            let newList = this.state.template.requirementList.filter((requirementNumber, index) => index !== initial);
            newList.splice(target, 0, targetItem);
            const {template} = this.state;
            template.requirementList = newList;
            this.setState({
                template,
                requirementsUpdated: true
            }, () => {
                this.setState({
                    requirementsUpdated: false
                }, this.populateParentState);
            });
        };
        const validAction = () => {
            if (action === 'moveUp') {
                if (id === 0) {
                    return false;
                } else {
                    target = id - 1;
                    return true;
                }
            } else if (action === 'moveDown') {
                if (id === requirementNumber) {
                    return false;
                } else {
                    target = id + 1;
                    return true;
                }
            }
        };
        if (validAction()) {
            moveElementToPosition(id, target);
        }
    };

    handleChangeRequirementCheck = (event) => {
        const id = parseInt(event.target.id.split('requirementEdit_').join('').split('_IsRequired').join(''));
        const { template } = this.state;
        template.requirementList[id].required = event.target.checked;
        this.setState({
            template
        }, this.populateParentState);
    };
    
    printRequirement = (requirement, index) => {
        return (
            <div
                className={`challenge-task ${this.state.activeElement && this.state.activeElement === `editTaskWithId_${index}` ? 'active' : ''}`}
                data-hint='Add more task as optional, to check the motivation of your candidates'
            >
                <h3>{`Task ${index + 1}`}
                    <input type='checkbox'
                        tabIndex='-1'
                        onChange={this.handleChangeRequirementCheck}
                        id={`requirementEdit_${index}_IsRequired`}
                        defaultChecked={requirement.required}
                    />
                    <span>
                        &nbsp;This is required for the applicants, otherwise it is optional
                    </span>
                </h3>
                <EnrichedEditor
                    update={this.state.requirementsUpdated}
                    value={requirement.content}
                    placeholder='Write your new task for the candidate'
                    focusElement={this.handleFocusElement}
                    textareaId={`editTaskWithId_${index}`}
                    onChange={this.handleEditRequirement}
                />
                {
                    this.printControls(index)
                }
            </div>
        );
    };

    printControls = (index) => {
        const currentElement = index + 1;
        const requirementNumber = this.state.template.requirementList.length;
        const isFirst = currentElement === 1;
        const isLast =  currentElement === requirementNumber;
        return (
            <div className='task-controls'>
                <i title='Move requirement up'
                    className={`icon-entypo-arrow-bold-up ${isFirst ? 'disabled' : ''}`}
                    onClick={(event) => this.handleMoveElement(event, index, 'moveUp')}
                />
                <i title='Remove this requirement'
                    id={index} className='fas fa-trash-alt' onClick={this.handleRemoveRequirement}
                />
                <i title='Move requirement down'
                    className={`icon-entypo-arrow-bold-down ${isLast ? 'disabled' : ''}`}
                    onClick={(event) => this.handleMoveElement(event, index, 'moveDown')}
                />
            </div>
        );
    };

    handleAddRequirement = () => {
        const { template } = this.state;
        template.requirementList = [
            ...template.requirementList,
            {
                required: true,
                content: ''
            }
        ];
        this.setState({
            template
        }, this.populateParentState);
    };

    handleFocusElement = (event) => {
        const { id } = event.target;
        this.setState({
            activeElement: id
        });
    };
    
    handleChangeField = (event) => {
        const { id, value } = event.target;
        const { template } = this.state;
        this.setState({
            template: {
                ...template,
                [id]: value
            }
        });
    };

    handleChangeInput = (data) => {
        const { id, content } = data;
        const { template } = this.state;
        template[id] = content;
        // if (id === 'title' || id === 'contentHtml') {
        //     formValidation[id] = null;
        // }
        this.setState({
            template,
        }, this.populateParentState);
    };

    handleRemoveFile = (event) => {
        event.preventDefault();
        const id = parseInt(event.target.id, 10);
        const { template } = this.state;
        this.handleOpenModal('remove_file', () => {
            template.attachmentList = template.attachmentList.filter((file) => {
                return file.id !== id;
            });
            this.setState({
                template,
                modalStatus: false
            }, this.populateParentState);
        });
    };

    handleOpenModal = (modalContext, modalCallback) => {
        this.setState({
            modalStatus: true,
            modalContext,
            modalCallback
        });
    };

    handleCloseModal = () => {
        this.setState({
            modalStatus: false,
            modalContext: undefined,
            modalCallback: undefined
        });
    };


    getModalData  = () => {
        const data ={
            modalContext: this.state.modalContext,
            modalCallback: this.state.modalCallback,
        };
        if (data.modalContext === 'remove_task') {
            data.confirmTitle = 'Are you sure that you want to remove this task?';
        }
        if (data.modalContext === 'remove_file') {
            data.confirmTitle = 'Are you sure that you want to remove this attachment?';
        }
        return data;
    };

    renderModal = () => {
        const {modalCallback, confirmTitle} = this.getModalData();
        return (
            <CommonConfirmModal
                open={this.state.modalStatus}
                onReject={this.handleCloseModal}
                onConfirm={modalCallback}
                confirmTitle={confirmTitle}
                backdrop={false}
                handleLoad={this.handleLoad}
                loading={this.state.loading}
                acceptText='Remove'
            />
        );
    };

    handleChangeSelect = (newValues, fieldId) => {
        const {template} = this.state;
        template[fieldId] = newValues;
        this.setState({
            template: {...template}
        });
    };

    render () {
        const {template} = this.state;
        return (
            <div className='fluttr-form template-creation-form'>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'addImage' ? 'active' : ''}`}
                    data-hint='Add a cover image to show the content or objective of the challenge.'
                >
                    <h3>Cover Image</h3>
                    <div className='challenge-attachment-field'>
                        <img
                            src={template.cover && template.cover.url || 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/challenge-template/challenge_no_image_placeholder.png'}
                            alt='template cover image'
                            width='150'
                            height='75'
                            style={{ display: 'block' }}
                        />
                        <UploadButton
                            type='cover'
                            crop
                            onCrop={this.onCrop}
                        />
                    </div>
                </div>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'durationExpert' ? 'active' : ''}`}
                    data-hint='How much time needs one expert to review the challenge?'
                >
                    <h1 className='challenge-form-label label-padding'>
                        Expert time
                    </h1>
                    <DropDown
                        list={this.state.expertTime}
                        reference='durationExpert'
                        changeTrigger={this.handleChangeSelect}
                        value={`${template.durationExpert}`}
                    />
                </div>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'durationPlayer' ? 'active' : ''}`}
                    data-hint='How much time needs a player to complete the challenge?'
                >
                    <h1 className='challenge-form-label label-padding'>Player time</h1>
                    <DropDown
                        list={this.state.playerTime}
                        reference='durationPlayer'
                        changeTrigger={this.handleChangeSelect}
                        value={`${template.durationPlayer}`}
                    />
                </div>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'title' ? 'active' : ''}`}
                    data-hint='Enter a title for your challenge. Example: "Fluttr Design Challenge"'
                >
                    <h3 className='required-input'>Challenge title</h3>
                    <div className={`input-wraper ${true === false ? 'input-error' : ''}`}>
                        <input
                            type='text'
                            maxLength='50'
                            id='title'
                            onFocus={this.handleFocusElement}
                            onChange={this.handleChangeField}
                            value={template.title}
                            placeholder='e.g. Designing user card'
                        />
                        <span className='input-length-counter'>
                            {`${template.title.length}/50`}
                        </span>
                    </div>
                </div>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'seniorityLevel' ? 'active' : ''}`}
                    data-hint='How much time needs a player to complete the challenge?'
                >
                    <h1 className='challenge-form-label label-padding'>Seniority level</h1>
                    <DropDown
                        list={allSeniorityLevels}
                        reference='seniorityLevel'
                        defaultValue={template.seniorityLevel}
                        changeTrigger={this.handleChangeSelect}
                        value={`${template.seniorityLevel}`}
                    />
                </div>
                <div
                    className={`fluttr-input-frame ${this.state.activeElement === 'skills' ? 'active' : ''}`}
                    data-hint='Insert the required skills for the challenge.'
                >
                    <h1 className='challenge-form-label label-padding'>Challenge skills</h1>
                    <div id='skills'>
                        <SkillsInputComponent handleChangeTags={this.handleChangeTags} handleSelectCategory={this.handleChangeTags} skills={template.tagList} />
                    </div>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className={`fluttr-input-frame ${this.state.activeElement === 'summary' ? 'active' : ''}`} data-hint='Introduce your challenge here and give the applicant an idea as to what they will be performing for you. You can also add any additional images, tables, ect. that will help explain this challenge and customize it for your company’s needs.'>
                        <h3>Challenge summary</h3>
                        {/* TODO: Error on fields not managed */}
                        <EnrichedEditor
                            className={`${true === false ? 'input-error' : ''}`}
                            value={template.summary}
                            focusElement={this.handleFocusElement}
                            placeholder='Challenge summary'
                            textareaId='summary'
                            onChange={this.handleChangeInput}
                        />
                    </div>
                </form>
                <form onSubmit={this.handleSubmit}>
                    <div
                        className={`fluttr-input-frame ${this.state.activeElement === 'introduction' ? 'active' : ''}`}
                        data-hint='Introduce your challenge here and give the applicant an idea as to what they will be performing for you. You can also add any additional images, tables, ect. that will help explain this challenge and customize it for your company’s needs.'
                    >
                        <h3>Challenge introduction</h3>
                        <EnrichedEditor
                            className={`${true === false ? 'input-error' : ''}`}
                            value={template.introduction}
                            focusElement={this.handleFocusElement}
                            placeholder='Challenge introduction'
                            textareaId='introduction'
                            onChange={this.handleChangeInput}
                        />
                    </div>
                </form>
                <div className={`fluttr-input-frame ${this.state.activeElement === 'addAttachments' ? 'active' : ''}`} data-hint=' Add any images that support the challenge. You can add your old company design, files with the required information that you would like the applicant to use, ect. '>
                    <h3>
                    Attachments
                    </h3>
                    <form id='addAttachmentsForm' onSubmit={this.handleSubmit} style={{ padding: '50px 0px' }} >
                        <input
                            id='addAttachments'
                            onFocus={this.handleFocusElement}
                            type='file'
                            onChange={(event) => this.handleUpload(event, 2)}
                            style={{ width: '0.1px', height: '0.1px', opacity: 0, overflow: 'hidden', position: 'absolute', zIndex: '-1' }}
                            accept='documents/*'
                        />
                        <label
                            htmlFor='addAttachments'
                            className='btn-fluttr btn-transparent-green btn-small'
                        >
                        Attach
                        </label>
                        <span>
                            (Max 200Mb, Image, PDF, ppt etc..)
                        </span>
                    </form>
                    { template.attachmentList.length > 0 &&
                    <AttachmentList
                        files={template.attachmentList}
                        handleRemove={this.handleRemoveFile}
                    />
                    }
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div 
                        className={`fluttr-input-frame full-size-frame ${template.requirementList.length !== 0 ? 'avoid-tip' : ''} ${this.state.activeElement && this.state.activeElement.includes('editTaskWithId_') ? 'active' : ''}`}
                        data-hint='Add all the tasks that you want your candidates to complete. You can add as many as you want.'
                    >
                        <h3>The challenge</h3>
                        {template.requirementList.map((requirement, index) => (
                            this.printRequirement(requirement, index)
                        ))}
                        <div onClick={this.handleAddRequirement} className='requirement-add-container'>
                            <span className='requirement-add-icon'>+</span>
                            <span className='requirement-add-text'>
                                { template.requirementList.length > 0 &&
                                        'Add another task' ||
                                        'Add a task for your candidates'
                                }
                            </span>
                        </div>
                    </div>
                    <div
                        textareaId='submissionRequirement'
                        className={`fluttr-input-frame ${this.state.activeElement === 'submissionRequirement' ? 'active' : ''}`}
                        data-hint='Introduce your challenge here and give the applicant an idea as to what they will be performing for you. You can also add any additional images, tables, ect. that will help explain this challenge and customize it for your company’s needs.'
                    >
                        <h3>Submission requirements</h3>
                        <EnrichedEditor
                            className={`${true === false ? 'input-error' : ''}`}
                            value={template.submissionRequirement}
                            focusElement={this.handleFocusElement}
                            placeholder='Submission requirements'
                            textareaId='submissionRequirement'
                            onChange={this.handleChangeInput}
                        />
                    </div>
                    <div>
                        <button className='btn-fluttr btn-green' onClick={this.handleSave} >
                            {this.props.isUpdate ? 'Update' : 'Next'}
                        </button>
                    </div>
                </form>

                {this.renderModal()}
            </div>
        );
    }
    
}
