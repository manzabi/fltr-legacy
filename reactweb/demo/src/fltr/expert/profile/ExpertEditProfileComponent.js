import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Grid,
    Button,
    Form,
    FormGroup,
    FormControl,
} from '@sketchpixy/rubix';

var Global = require('../../../common/global_constants');

import {uploadImage, resetUploadImage} from '../../../redux/actions/uploadActions';
import { goToExpertLandingPage } from '../../navigation/NavigationManager';
import {putExpertUserInfo} from '../../../redux/actions/userActions';
import * as formUtils from '../../utils/FormUtils';
import * as imageType from '../../../constants/imageUploadType';

import FullScreen from '../../template/FullScreen';
import CrazyCropper from '../../template/CrazyCropper';
import PanelContainer, {PanelContainerContent, PanelContainerHeader} from '../../template/PanelContainer';
import {manageError, manageSuccess} from '../../../common/utils';
// import Intercom from '../../utils/Intercom';

@connect((state) => state)
export default class ExpertEditProfileComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isUpdate: false,
            enableButton: true,
            cropStatus: false,
            form: {
                name: '',
                surname: '',
                imageId: -1,
                pictureUrl: '',
                company: '',
                role: ''
            },

            formValidation: {
                name: {
                    type: formUtils.REQUIRED_INPUT
                },
                surname: {
                    type: formUtils.REQUIRED_INPUT
                },
                company: {
                    type: formUtils.REQUIRED_INPUT
                },
                role : {
                    type: formUtils.REQUIRED_INPUT
                }
            }

        };

    }

    componentWillMount() {
    }

    componentDidMount() {
        resetUploadImage();
        this.prefillUserData(this.props.user.item);
    }

    prefillUserData(user){
        // console.log('update with obj : ' + JSON.stringify(user));
        // console.log(user);

        let newForm = {
            imageId: null,
            pictureUrl: user.imageUrl,
            company: user.company,
            name: user.name.trim(),
            surname: user.surname.trim(),
            role: user.position
        };

        // console.log('converted obj : ' + JSON.stringify(newForm));

        this.setState({
            form: newForm
        });
    }

    uploadImage(file) {
        if(this.props.uploadImage.item){
            this.deleteImage();
        }

        this.props.dispatch(uploadImage(imageType.USERS, file, 'profile_picture.png', this.onUploadOk.bind(this)));
    }

    openCrop = (e) => {
        // console.log(e);
        let file = document.getElementById('addImage').files[0];
        this.setState({cropStatus: true, tempImage: file});
    };

    closeCrop(){
        this.setState({
            cropStatus: false
        });
    }

    deleteImage(){
        this.props.dispatch(resetUploadImage());
    }

    /* form features */
    checkAll(){
        // console.log('check all');
        return formUtils.checkForm(this.state.formValidation, this.state.form);
    }

    checkValue(what, scroll=false) {
        return formUtils.checkSingleFormValue(this.state.formValidation, this.state.form, what, scroll);
    }

    handleChange = (event) =>{
        formUtils.handleInputChange(event, this, this.state.formValidation);
    };
    /* end form features */

    onCancelCrop = () => {
        this.closeCrop();
    };

    onCrop = (file) => {
        // closeModal
        this.closeCrop();
        // upload
        this.uploadImage(file);
    };

    onUploadOk = (data) =>{
        // console.log('upload ok : ' +JSON.stringify(data));
        let url = data.url;
        let id = data.id;

        this.setState({form: {...this.state.form, imageId: id, pictureUrl: url}});

        this.checkValue('imageId');
    };

    save = (event) => {
        // console.log('save opportunity. Update : ' + this.state.isUpdate);
        event.preventDefault();
        let valid = this.checkAll();
        // console.log('form is valid : ' + valid);

        if (valid){
            // console.log('Call Api -> form is valid');

            let form = this.state.form;

            const param = {
                imageId: form.imageId,
                name: form.name,
                surname: form.surname,
                company: form.company,
                role: form.role,
                cellphone: form.phone,
                countryCellphone: form.countryPhone,
            };

            this.props.dispatch(putExpertUserInfo(param, this.onSaveOk.bind(this), this.onError.bind(this)));
        }
    }

    onSaveOk(data){
        // refresh user infos
        manageSuccess('edit-profile', 'Profile info correctly saved!');
        goToExpertLandingPage();
    }

    onError(err){
        // console.log('onError');
        manageError(err, 'user', 'Impossible to save your profile. ' );
    }

    render(){
        let showBackButton = this.props.back;
        const errorMsg = 'This field can’t be empty';

        return(
            <PanelContainer className="companyInputContent" padding={false} back={showBackButton} size="medium">
                <PanelContainerHeader>
                    <span className="sectionTitle">Personal information</span>
                </PanelContainerHeader>
                <PanelContainerContent padding={false} style={{marginTop: 10}}>
                    <Form>
                        <Grid>
                            <Row className="sectionBorderedPaddingBottom">
                                <Col xs={12} className="nopaddingMobile user-info">
                                    <Grid>

                                        <Row className="sectionInternal">
                                            <Col  xs={12} sm={4} style={{boxSizing: 'border-box', padding: 20}}>
                                                <img id="imageLogoUI" className="img-rounded" src={this.state.form.pictureUrl} style={{width:'70%', textAlign:'center', margin: 'auto', display: 'block'}} />
                                                <FormControl id="addImage"
                                                    type="file"
                                                    onChange={this.openCrop}
                                                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*"
                                                />
                                                <input id="imageId" name="imageId" type="hidden" defaultValue={this.state.imageId} />
                                            </Col>
                                            <Col  xs={12} sm={7} smOffset={1} style={{boxSizing: 'border-box', padding: 20}}>
                                                <span className="form-label">First Name<span className='mandatory-field'>*</span></span>
                                                <FormGroup controlId="name">
                                                    <FormControl componentClass="input" placeholder="Your First Name" onChange={this.handleChange.bind(this)} value={this.state.form.name}/>
                                                    <span id="nameError" className="form-field-error" style={{display:'none'}}>{errorMsg}</span>
                                                </FormGroup>

                                                <span className="form-label">Surname<span className='mandatory-field'>*</span></span>
                                                <FormGroup controlId="surname">
                                                    <FormControl componentClass="input" placeholder="Your Surname" onChange={this.handleChange.bind(this)} value={this.state.form.surname}/>
                                                    <span id="surnameError" className="form-field-error" style={{display:'none'}}>{errorMsg}</span>
                                                </FormGroup>

                                                <span className="form-label">Your Company<span className='mandatory-field'>*</span></span>
                                                <FormGroup controlId="company">
                                                    <FormControl componentClass="input" placeholder="Your Company" onChange={this.handleChange.bind(this)} value={this.state.form.company}/>
                                                    <span id="companyError" className="form-field-error" style={{display:'none'}}>{errorMsg}</span>
                                                </FormGroup>

                                                <span className="form-label">Your Role<span className='mandatory-field'>*</span></span>
                                                <FormGroup controlId="role">
                                                    <FormControl componentClass="input" placeholder="Ex. CEO, Tech Lead" onChange={this.handleChange.bind(this)} value={this.state.form.role}/>
                                                    <span id="roleError" className="form-field-error" style={{display:'none'}}>{errorMsg}</span>
                                                </FormGroup>

                                            </Col>
                                        </Row>

                                        <Row style={{marginTop: 80}}>
                                            <Col xs={12} className="text-right">
                                                {/* <Button style={{marginTop:10}} lg={true} bsStyle="fluttrGreen" disabled={!this.state.enableButton}  onClick={() => this.save()} >
                                                        Save
                                                </Button> */}
                                                <button className='btn-fluttr btn-green' disabled={!this.state.enableButton}  onClick={this.save}>
                                                    Save
                                                </button>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12}>
                                                <span className="form-label"><span className='mandatory-field'>*</span> mandatory fields</span>
                                            </Col>
                                        </Row>
                                        {this.state.cropStatus &&
                                            <CrazyCropper
                                                onCrop={this.onCrop}
                                                onCancelCrop={this.onCancelCrop}
                                                file={this.state.tempImage}
                                                status={this.state.cropStatus}
                                                type='profile'
                                            />
                                        }

                                    </Grid>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                </PanelContainerContent>
                {/* <Intercom /> */}
            </PanelContainer>
        );
    }

}
