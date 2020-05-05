import React from 'react';
import { connect } from 'react-redux';

import {uploadImage, resetUploadImage} from '../../../redux/actions/uploadActions';
import {checkUserUpdate} from '../../../redux/actions/userActions';
import {goToRecruiterDashboard, goToOpportunityDetail} from '../../navigation/NavigationManager';
import {createOpportunity, resetOpportunity, getOpportunityById, updateOpportunity} from '../../../redux/actions/recruiterOpportunityActions';
import * as formUtils from '../../utils/FormUtils';
import * as imageType from '../../../constants/imageUploadType';
import * as opportunityType from '../../../constants/opportunityType';
import {manageSuccess} from '../../../common/utils';

import Intercom from '../../utils/Intercom';
import * as ga from '../.././../constants/analytics';

import LocationSearchInput from '../../../common/components/LocationSearchInput';
import { getAllSeniorityLevels } from '../../../constants/senioritylevel';
import DropDown from '../../../common/components/DropDown';
import Spinner from '../../Spinner';

@connect((state) => state)
export default class RecruiterOpportunityCreateComponent extends React.Component {
    constructor(props) {
        super(props);
        let isUpdate = false;
        if (this.props.id !== undefined){
            isUpdate = true;
        }
        const isFirstJob = !this.props.user.item.recruiterDetails.talenQuest ? true : false;
        this.state = {
            isUpdate: isUpdate,
            loadingData: isUpdate,
            enableButton: true,
            isFirstJob: isFirstJob,
            form: {
                updateEditors: false,
                role: '',
                isFreelance: false,
                isContract: true,
                isCofounder: false,
                isStage: false,
                jobDescription: '<p></p>',
                location : '',
                locationItem: null,
                compensationType : 0,
                seniorityLevel: 0,
                isRemote : false,
                salaryFrom : '',
                salaryTo: '',
                type: opportunityType.PRIVATE
            },
            formValidation: {
                role: {
                    type: formUtils.REQUIRED_INPUT
                },
                collaboration: {
                    type: formUtils.REQUIRED_CHECKBOX,
                    selector: '.collaboration-check',
                    selectorLabel:'#collaborationError',
                    checkbox:['isFreelance','isContract','isCofounder','isStage']
                },
                jobDescription: {
                    type: formUtils.REQUIRED_INPUT_HTML,
                    selector: '#jobDescription .demo-editor',
                    selectorLabel : '#jobDescriptionError'
                },
                // location:{
                //     type: formUtils.REQUIRED_INPUT
                // },
                salary:{
                    type: formUtils.CUSTOM,
                    method: this.checkSalary,
                    selector :'.input-salary',
                    selectorLabel : '#salaryError'
                }
            },
            validationStatus: {},
            loading: false

        };
        if (isUpdate){
            // console.log('isUpdate');
            this.props.dispatch(getOpportunityById(this.props.id, this.prefillOpportunityOnUpdate));
        }

    }
    componentWillMount() {
        if (!this.state.isUpdate) {
            if (this.state.isFirstJob) ga.track(ga.BOARDING_JOB_CREATION_START);
            else ga.track(ga.OPPORTUNITY_JOB_CREATION_START);
        }
    }
    componentDidMount() {
        resetUploadImage();
        resetOpportunity();
        // if (!this.state.isUpdate && this.state.form.type === null) {
        //     goToRecruiterOpportunityCreate();
        //     // console.log('redirect');
        // }
    }

    prefillOpportunityOnUpdate = (data) => {
        // console.log('update with obj : ' + JSON.stringify(data));
        const {locationItem} = data;
        let newForm = {
            location: data.location,
            locationItem: {
                city: locationItem.city,
                country: locationItem.country,
                countryShort: locationItem.countryShort,
                latitude: locationItem.latitude,
                longitude: locationItem.longitude,
                region: locationItem.region,
                stateProvince: locationItem.stateProvince,
                zipCode: locationItem.zipCode
            },
            role: data.roleTitle,
            jobDescription: data.roleDescription,
            isRemote: data.remote,
            isFreelance: data.freelance,
            isContract: data.contract,
            isCofounder: data.cofounder,
            isStage: data.stage,
            compensationType: data.compensationType,
            seniorityLevel: data.seniorityLevel,
            salaryFrom: data.salaryFrom || '',
            salaryTo: data.salaryTo || '',
            type: data.type
        };
         

        // console.log('converted obj : ' + JSON.stringify(newForm));

        this.setState({
            form: newForm,
            updateEditors: true,
            loadingData: false
        }, () => {
            this.setState({
                updateEditors: false
            });
        });

    }

    handleChangeLocation = (locationItem) => {
        const {form} = this.state;
        this.setState({
            form: {
                ...form,
                locationItem
            }
        });
    }

    handleChangeLocationQuery = (location) => {
        const {form} = this.state;
        this.setState({
            form: {
                ...form,
                location,
                locationItem: {}     
            },
            validationStatus: {
                ...this.state.validationStatus,
                locationItem: null
            }
        });
    }

    showFilePicker = (filePickerID) => {
        let elementID = '#'.concat(filePickerID);
        $(elementID).click();
    }

    uploadImage = (file) => {
        if(this.props.uploadImage.item){
            this.deleteImage();
        }

        this.props.dispatch(uploadImage(imageType.COMPANY, file, 'logo.png', this.onUploadOk));
    }

    openCrop = (e) => {
        // console.log(e);
        let file = document.getElementById('addImage').files[0];
        this.imageCrop.putFile(file);
        this.cropFullScreen.open();
    }

    closeCrop = () => {
        this.cropFullScreen.close();
    }

    deleteImage = () => {
        this.props.dispatch(resetUploadImage());
    }

    /* form features */
    checkAll = () => {
        // console.log('check all opportunity create/update');
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }

    checkValue = (what, scroll=false) => {
        return formUtils.checkSingleFormValue(this.state.formValidation, this.state.form, what, scroll);
    }

    handleChange = (event) => {
        formUtils.handleInputChange(event, this, this.state.formValidation);
    }

    handleCheck = (event)  => {
        formUtils.handleCheckboxChange(event, this, this.state.formValidation);
    }

    handleCheckNumber = (event) => {
        formUtils.handleCheckNumberChange(event, this, this.state.formValidation, 'salary');
    }

    handleCheckSelect = (event) => {
        formUtils.handleSelectChange(event, this, this.state.formValidation);
    }
    /* end form features */

    /* Custom form features and validation */
    handleJobDescription = (val) => {
        formUtils.handleValueChange(val, 'jobDescription', this, this.state.formValidation);
    }

    checkSalary = () => {
        let salaryFrom = this.state.form.salaryFrom;
        let salaryTo = this.state.form.salaryTo;
        // console.log('check salary ' + salaryFrom + " - " + salaryTo);

        if ((salaryFrom == '' && salaryTo != '') || (salaryTo == '' && salaryFrom != '')){
            return false;
        }

        if (salaryFrom == ''){
            salaryFrom = 0;
        } else {
            salaryFrom = parseInt(salaryFrom);
        }

        if (salaryTo == ''){
            salaryTo = 0;
        } else {
            salaryTo = parseInt(salaryTo);
        }

        if (salaryTo < salaryFrom){
            return false;
        } else {
            return true;
        }

    }

    /* End Custom form */

    saveOpportunity = (event) => {
        // console.log('save opportunity. Update : ' + this.state.isUpdate);
        event.preventDefault();
        // let valid = this.checkAll();
        const valid = this.selfValidation();
        // console.log('form is valid : ' + valid);

        if (valid){
            // console.log('Call Api -> form is valid');

            let form = this.state.form;

            let salaryFrom = form.salaryFrom;
            if (!salaryFrom){
                salaryFrom = 0;
            }

            let salaryTo = form.salaryTo;
            if (!salaryTo){
                salaryTo = 0;
            }

            const param = {
                achievement: ' ',
                location: form.locationItem,
                roleTitle: form.role,
                roleDescription: form.jobDescription,
                isRemote: form.isRemote,
                isFreelance: form.isFreelance,
                isContract: form.isContract,
                isCofounder: form.isCofounder,
                isStage: form.isStage,
                compensationType: form.compensationType,
                seniorityLevel: form.seniorityLevel,
                salaryFrom: salaryFrom,
                salaryTo: salaryTo,
                type: form.type
            };

            // console.log('save obj : ' +JSON.stringify(param));
            this.setState({
                loading: true
            });
            if (this.state.isUpdate){
                this.props.dispatch(updateOpportunity(this.props.id, param, this.onUpdateOk, null));
            } else {
                this.props.dispatch(createOpportunity(param, this.onCreateOk, this.onCreateError));
            }
        }
    }

    onCreateOk = (data) => {
        this.setState({
            loading: false
        });
        if (this.state.isFirstJob) ga.track(ga.BOARDING_JOB_CREATION_END);
        else ga.track(ga.OPPORTUNITY_JOB_CREATION_END);
        let id = data.id;
        this.props.dispatch(checkUserUpdate(this.props.userStatus , true));
        // goToRecruiterConfigureTags(id, true);
        //goToRecruiterOpportunityCreate(id);
    }

    onCreateError = () => {
        this.setState({
            loading: false
        });
        if (!this.state.isUpdate) {
            if (this.state.isFirstJob) ga.track(ga.BOARDING_JOB_CREATION_ERROR);
            else ga.track(ga.OPPORTUNITY_JOB_CREATION_ERROR);
        }
    }

    onUpdateOk = (data) => {
        this.setState({
            loading: false
        });
        let id = data.id;
        const message = 'Job details correctly updated';
        manageSuccess(id, message);
        goToRecruiterDashboard();
    }

    // new methods fluttr form
    handleFocusElement = (event) => {
        const { id } = event.target;
        this.setState({
            activeElement: id
        });
    }
    //TODO: generalize react validation
    selfValidation = () => {
        const {locationItem, role, jobDescription, salaryFrom, salaryTo, type, isFreelance, isContract, isCofounder, isStage} = this.state.form;
        function salaryCheck (salaryFrom, salaryTo) {
            const from = parseInt(salaryFrom, 10), to = parseInt(salaryTo, 10);
            const bothEmpty = isNaN(from) && isNaN(to);
            const valuesOk = !from && !to || from <= to;
            let valid = false;
            if (bothEmpty) {
                valid = true;
            } else if (valuesOk) {
                valid = true;
            } else {
                valid = false;
            }
            return valid;
        }
        const validationStatus = {
            role: !!role.trim(),
            // jobDescription: formUtils.checkRichEditor(jobDescription),
            locationItem: locationItem && !!(locationItem.city !== 'not-defined' && locationItem.country !== 'not-defined' && locationItem.countryShort !== 'not-defined' && locationItem.latitude !== 'not-defined' && locationItem.longitude !== 'not-defined' && locationItem.region !== 'not-defined' && locationItem.stateProvince !== 'not-defined' && locationItem.zipCode) || false,
            collaborationType: isFreelance || isContract || isCofounder || isStage,
            salary: type === opportunityType.PRIVATE || salaryCheck(salaryFrom, salaryTo)

        };
        console.log(validationStatus);
        this.setState({
            validationStatus
        });
        const valid = validationStatus.role && validationStatus.locationItem && validationStatus.collaborationType && validationStatus.salary;
        if (!valid) {
            if (!validationStatus.role) {
                document.getElementById('role').scrollIntoView(false);
            } else if (!validationStatus.locationItem) {
                document.getElementById('locationInput').scrollIntoView(false);
            }
        }
        return valid;
    }

    handleChangeField = (event) => {
        const { id, value } = event.target;
        const { form, validationStatus } = this.state;
        validationStatus[id] = null;
        this.setState({
            form: {
                ...form,
                [id]: value
            },
            validationStatus
        }, this.populateParentState);
    }

    handleChangeSalaryInput = (event) => {
        const {id, value} = event.target;
        if (!isNaN(parseInt(value[value.length - 1], 10)) || value === '') {
            const {form} = this.state;
            form[id] = value;
            this.setState({
                ...form
            });
        }
    }

    handleChangeInput = (data) => {
        const { id, content } = data;
        const { form, validationStatus } = this.state;
        form[id] = content;
        validationStatus[id] = null;
        this.setState({
            form,
            validationStatus
        }, this.populateParentState);
    }

    handleChangeSelect = (newValues, fieldId) => {
        const {form, validationStatus} = this.state;

        form[fieldId] = newValues;
        validationStatus[fieldId] = null;
        validationStatus[fieldId] = null;
        this.setState({
            form: {...form}
        });
    }

    handleChangeRole = ({target}) => {
        const {id, value, checked} = target;
        const {form, validationStatus} = this.state;
        if (['employee', 'stage', 'cofounder', 'freelance'].indexOf(id) !== -1) {
            validationStatus.collaborationType = null;
        }
        form[value] = checked;
        this.setState({
            form: {
                ...form
            }
        });
    }

    handleBackButton = () => {
        if (this.state.isUpdate) {
            goToOpportunityDetail(this.props.id);
        } else {
            goToRecruiterDashboard();
        }
    }

    render(){

        let enabledAsync = false;
        let opportunity = this.props.recruiterOpportunityGet;
        let labelButton = 'Submit';
        let jobDescription = '';

        if(this.state.isUpdate){
            enabledAsync = true;
            labelButton = 'Save';
            // console.log('obj render : ' + JSON.stringify(opportunity));
            if (opportunity.item != null){
                // console.log('role : ' + opportunity.item.roleDescription);
                jobDescription = opportunity.item.roleDescription;
            }
        }
        const {form} = this.state;
        let allSeniorityLevels = getAllSeniorityLevels();
        allSeniorityLevels = allSeniorityLevels.map((item) => {
            return {
                value: item.id,
                placeholder: item.description
            };
        });
        return(
            <div className='containerMaxSize'>
                { this.state.loadingData &&
                    <Spinner /> ||
                    <div className='fluttr-form' style={{ padding: 20 }}>
                        <h1 className='fluttr-header-md'>Job position overview</h1>
                        <div
                            className={`fluttr-input-frame ${this.state.activeElement === 'role' ? 'active' : ''}`}
                            data-hint='Define the role of your desired candidate'
                        >
                            <h3 className='required-input'>Job position</h3>
                            <div className={`input-wraper ${this.state.validationStatus.role === false ? 'input-error' : ''}`}>
                                <input
                                    type='text'
                                    maxLength='50'
                                    id='role'
                                    onFocus={this.handleFocusElement}
                                    onChange={this.handleChangeField}
                                    value={form.role}
                                    placeholder='e.g. Designing user card'
                                />
                                <span className='input-length-counter'>
                                    {`${form.role.length}/50`}
                                </span>
                            </div>
                        </div>
                        <div
                            className={`fluttr-input-frame ${this.state.activeElement === 'seniorityLevel' ? 'active' : ''}`}
                            data-hint='Choose the level of your desired candidate.'
                        >
                            <h3 className='required-input challenge-form-label label-padding'>Seniority level</h3>
                            <DropDown
                                list={allSeniorityLevels}
                                reference='seniorityLevel'
                                defaultValue={form.seniorityLevel}
                                changeTrigger={this.handleChangeSelect}
                                value={`${form.seniorityLevel}`}
                                onFocus={this.handleFocusElement}
                            />
                        </div>
                        <div
                            className={`fluttr-input-frame ${this.state.activeElement === 'locationInput' ? 'active' : ''}`}
                            data-hint='Where will the activity of the candidate be developed? Is it a remote opportunity?'
                        >
                            <h3 className='required-input'>Location</h3>
                            <div className={`input-wraper ${this.state.validationStatus.locationItem === false ? 'input-error' : ''}`}>
                                <LocationSearchInput
                                    address={this.state.form.location}
                                    handleChangeLocationQuery={this.handleChangeLocationQuery}
                                    handleChangeLocation={this.handleChangeLocation}
                                    focusElement={this.handleFocusElement}
                                />
                            </div>
                            <div className="input-wraper">
                                <div className='checkbox-container'>
                                    <input
                                        type='checkbox'
                                        value='isRemote'
                                        id='remote'
                                        focusElement={this.handleFocusElement}
                                        onChange={this.handleChangeRole}
                                        defaultChecked={form.isRemote}
                                    /> <label htmlFor='remote'>Remote opportunity</label>
                                </div>
                            </div>
                        </div>
                        <div className='fluttr-button-bar'>
                            <button className='btn-fluttr btn-link' onClick={this.handleBackButton} >
                                <i className='fal fa-angle-double-left' /> Go back
                            </button>
                            <button className={`btn-fluttr btn-green ${this.state.loading ? 'loading' : ''}`} disabled={this.state.loading}  onClick={this.saveOpportunity} >
                                {labelButton}
                            </button>
                        </div>
                        <Intercom />
                    </div>
                }
            </div>
        );
    }

}