import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    FormControl,
    FormGroup,
    Modal,
    DropdownButton,
    MenuItem
} from '@sketchpixy/rubix';

import * as formUtils from '../../utils/FormUtils';

import Button from 'react-bootstrap-button-loader';
import StarRatingComponent from 'react-star-rating-component';

import {reviewCv, updateCv} from '../../../redux/actions/recruiterOpportunityActions';

import {openModalFix, closeModalFix} from '../../../common/uiUtils';
import * as ga from '../.././../constants/analytics';
import {manageSuccess, getFileExtension} from '../../../common/utils';
import FullheightIframe from '../../../common/components/FullheightIframe';
import { clearInterval } from 'timers';
import Container from '../../../layout/layout/Container';
import Grid from '../../../layout/layout/Grid';
import Row from '../../../layout/layout/Row';
import Col from '../../../layout/layout/Col';
import Offset from '../../../layout/layout/Offset';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import CrazyButton from '../../../layout/buttons/CrazyButtons';

@connect((state) => state)
export default class RecruiterReviewCvModal extends Component {

    constructor(props) {
        super(props);

        let review = this.props.data.review;
        let reviewCv = review.reviewCv;
        let alreadyReviewCv = false;
        let stars = reviewCv.stars;

        let editStars = true;
        let editDescription = true;
        let create = false;
        if (reviewCv.stars > 0){
            editStars = false;
            editDescription = false;
        } else {
            create = true;
        }

        // console.log('review cv : ' + reviewCv.notes.length);
        let content = '';
        if (reviewCv.notes.length > 0){
            content = reviewCv.notes[0].content;
        }

        // console.log('build component modal with stars : ' + stars + ' and create : ' + create);

        this.state = {
            loading : false,
            isOnTop: true,
            listenerStatus: false,
            editStars : editStars,
            editDescription: editDescription,
            create : create,
            save : create,
            starsHovered: 0,
            evalueMessages: ['Score this candidate’s CV', 'I would not recommend', 'I have seen better', 'I would recommend', 'I would definitely recommend', 'Super candidate!'],
            form: {
                stars: stars,
                description : content
            },

            formValidation: {
                stars:{
                    type: formUtils.CUSTOM,
                    method: this.checkStars,
                    selector :'.not-specified',
                    selectorLabel : '#reviewCrError'
                }
            }

        };
        this.updateStars = this.updateStars;
    }
    
    componentWillReceiveProps (nextProps) {
        let open = false;
        if (this.props.open !== undefined) {open = this.props.open;}
        
        if (!open && nextProps.open) {            
            // is opening, disable scrollbar main content
            openModalFix();
        }
    }
    
    scrollListener = (event) => {
        const element = document.getElementsByClassName('fade in modal')[0];
        const scrollStatus = element !== undefined ? element.scrollTop : 0;
        if (scrollStatus > 0 && this.state.isOnTop) {
            this.setState({
                isOnTop: false
            });
        } else if (scrollStatus === 0 && !this.state.isOnTop) {
            this.setState({
                isOnTop: true
            });
        }
    }

    initListener = () => {
        const element = document.getElementsByClassName('fade in modal')[0];
        if (element) {
            element.addEventListener('scroll', this.scrollListener);
            this.setState({
                listenerStatus: true
            });
        } else {
            this.setState({
                forcingRefresh: Math.random()
            });
        }
    }

    closeModal = () => {
        const element = document.getElementsByClassName('fade in modal')[0];
        if (element) {
            element.removeEventListener('scroll', this.scrollListener);
            this.setState({
                listenerStatus: false
            });
        }
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }

    onStarClick = (nextValue, prevValue, name) => {
        // console.log('next star is : ' + nextValue);
        formUtils.handleValueChange(nextValue, 'stars', this, this.state.formValidation);
        this.checkValue('stars');
    }

    saveReview = () => {
        // console.log('save review');
        let valid = this.checkAll();
        if (valid){

            this.setState({
                loading : true
            });

            // update or create
            let create = this.state.create;

            let opportunityId = this.props.data.opportunity.id;
            let user = this.props.data.user;

            if (create){
                // console.log('call create API');
                let data = {
                    stars: this.state.form.stars,
                    content: this.state.form.description
                };
                this.props.dispatch(reviewCv(this.props.data.id, opportunityId, user.id, data, this.onSaveReview));
            } else {
                // console.log('call update API');
                let data = {
                    stars: this.state.form.stars,
                    content: this.state.form.description
                };
                this.props.dispatch(updateCv(this.props.data.id, opportunityId, user.id, data, this.onSaveReview));
            }

        }
    }

    onSaveReview = () => {
        // update or create
        if (this.state.create) {ga.track(ga.ASSESS_CV_END);}
        else {ga.track(ga.UPDATE_CV_END);}
        let create = this.state.create;
        let user = this.props.data.user;

        this.setState({
            loading : false,
            create: false,
            save: false,
            editStars: false,
            editDescription: false
        });
        if (this.props.onRefresh){
            this.props.onRefresh();
        }

        let message = 'Experience correctly evaluated for the candidate ' + user.completeName;
        if (!create){
            message = 'Experience correctly updated for the candidate ' + user.completeName;
        }
        manageSuccess('review-cv-ok', message);
    }

    checkStars = () => {
        let stars = this.state.form.stars;
        // console.log('check stars : ' + stars);
        if (stars > 0){
            return true;
        } else {
            return false;
        }
    }

    onEditStars = () => {
        ga.track(ga.UPDATE_CV_STARS_START);
        this.setState({
            editStars : true,
            save: true
        });
    }

    onEditDescription = () => {
        ga.track(ga.UPDATE_CV_NOTE_START);
        this.setState({
            editDescription : true,
            save: true
        });
    }

    onDeleteNotes = () => {
        let formWithNewValues = {...this.state.form, description: ''};
        this.setState({form: formWithNewValues}, this.saveReview);
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
    updateStars = (number) => {
        this.setState({
            starsHovered: number
        });
    }

    scrollToTop = () => {
        this.setState({isOnTop: true});
        const element = document.getElementsByClassName('fade in modal')[0];
        element.scrollTo(0,0);
    }

    render(){
        let open = false;
        if (this.props.open !== undefined) {open = this.props.open;}

        let user = this.props.data.user;

        let textAreaStyle = {
            padding: 15,
            overflow:'hidden',
            borderColor: 'transparent'
        };
        if (open && !this.state.listenerStatus) {
            this.initListener();
        }

        return(
            <div>
                <Modal bsSize='large' show={open} onHide={this.closeModal}>
                    <Modal.Body>
                        <Container>
                            <Grid className='recruiterReviewCvModal'>
                                <Col xs={12} style={{textAlign:'right'}}>
                                    <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={() => this.closeModal()} >
                                        <i className='icon-entypo-cross fluttrDarkGrey'  />
                                    </a>
                                </Col>
                                <Col xs={12} className='text-center' style={{padding: '20px 40px 20px 40px'}}>
                                    <span className='modalTitle'>Evaluate the <strong className='fluttrViolet'>experience</strong> of the candidate for this role.</span>
                                </Col>

                                <Row revertMargin>
                                    <Col xs={12} sm={6}>
                                        <Row>
                                            <Offset xsOffset='1' smOffset='0' />
                                            <Col xs={3} className='candidate-card-cv-modal' style={{display: 'flex', alignItems: 'center'}}>
                                                <ProfilePic url={user.imageUrl} shape='circle' length='100%' />
                                            </Col>
                                            <Col xs={7}>
                                                <h3 className='recruiter-message'>
                                                    {user.completeName}
                                                </h3>
                                                <p className='modal-reviewcv-candidate-name'>{user.nickname}</p>
                                                <Row revertMargin>
                                                    <Col xs={12} className='user-social-cv'>
                                                        {user.social.linkedin &&
                                                            <div>
                                                                <a className='black' href={user.social.linkedin} target='_blank'>
                                                                    <i
                                                                        className='icon-fontello-linkedin-squared icon-right-padding'
                                                                        style={{
                                                                            fontSize: 2 + 'em',
                                                                            verticalAlign: 'middle',
                                                                            marginRight: 20,
                                                                            color: '#007bb6',
                                                                            marginLeft:8
                                                                        }}
                                                                    />
                                                                </a>
                                                            </div>
                                                        }
                                                        {user.cv &&
                                                            <div>
                                                                <a href={user.cv} target='_blank' className='black'>
                                                                    <i className='icon-entypo-download icon-right-padding' style={{fontSize: 2 + 'em', verticalAlign: 'middle'}}> </i>
                                                                    Show CV
                                                                </a>
                                                            </div>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={6} className='recruiter-evaluation'>
                                        <h3 className='recruiter-message'>
                                            {this.state.starsHovered && this.state.evalueMessages[this.state.starsHovered] || this.state.evalueMessages[this.state.form.stars]}
                                        </h3>
                                        <p>
                                            Your evaluation and notes are only visible to you and the rest of the hiring team
                                        </p>
                                        {!this.state.create &&
                                            <div className='modal-generic-container-feedback-menu'>
                                                <DropdownButton bsStyle='link' title={<i className='icon-entypo-dots-three-vertical three-points-icon' />} className='dropDownMenuThreeDots' id='dropDownCv' pullRight>
                                                    <MenuItem eventKey='1' onClick={() => this.onEditStars()}>Edit stars</MenuItem>
                                                    <MenuItem eventKey='2' onClick={() => this.onEditDescription()}>Edit note</MenuItem>
                                                    <MenuItem eventKey='3' onClick={() => this.onDeleteNotes()}>Delete note</MenuItem>
                                                </DropdownButton>
                                            </div>
                                        }
                                        <Row>
                                            <Col id={'rateCv' + this.props.data.id} xs={12} className='text-center'>
                                                <RecruiterReviewCvStar updateStars={this.updateStars} stars={this.state.form.stars} id={this.props.data.id} onSelected={this.onStarClick} edit={this.state.editStars}/>
                                                <span id='reviewCrError' className='form-field-error' style={{display:'none', marginTop:'-2em', marginBottom:'1em'}}>You must select one ore more stars</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Col xs={12} className='modal-generic-container-feedback'>
                                    {!this.state.editDescription &&
                                        <div style={{minHeight:'3em'}}>
                                            <span className='modal-generic-feedback'>
                                                {this.state.form.description || 'There isn\'t a comment available for this user'}
                                            </span>
                                        </div>
                                    }
                                    {this.state.editDescription &&
                                        <FormGroup>
                                            <FormControl rows='5'
                                                componentClass='textarea'
                                                id='description'
                                                name='description'
                                                placeholder="Write here to the hiring team what do you think of this candidate's CV."
                                                value={this.state.form.description}
                                                style={textAreaStyle}
                                                onChange={this.handleChange}
                                                autoFocus
                                            />
                                        </FormGroup>
                                    }
                                </Col>
                                {this.state.save &&
                                    <Col xs={12} className='cv-submission-buttons' style={{display: 'flex', justifyContent: 'space-around'}}>
                                        <CrazyButton size='ceci' text='Cancel' action={this.closeModal} inverse />
                                        <CrazyButton size='ceci' text='Save' action={this.saveReview} loading={this.state.loading} />
                                    </Col>
                                }
                                {getFileExtension(user.cv) === 'pdf' ?
                                    <FullheightIframe url={user.cv} /> :
                                    null
                                }
                                {!this.state.isOnTop &&
                                    <div className='scroll-top-container' onClick={this.scrollToTop}>
                                        <i className='fal fa-angle-up' />
                                    </div>
                                }
                            </Grid>
                        </Container>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

class RecruiterReviewCvStar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stars : 0
        };
    }

    componentDidMount() {
        this.resetStarsNumber();
        // console.log('mounting star : ' + $('#rateCv' + this.props.id + ' .dv-star-rating-star').length);
        let root = this;
        $('#rateCv' + this.props.id + ' .dv-star-rating-star')
            .mouseenter( function(){
                if (root.props.edit){
                    let hiddenField = $(this).attr('for');
                    let numberOfStars = parseInt($('#'+hiddenField).val(), 10);
                    root.hoverStarsNumber(numberOfStars);
                }
            } )
            .mouseleave( function(){
                if (root.props.edit) {
                    root.props.updateStars(0);
                    root.hoverStarsNumber(0);
                    root.resetStarsNumber();
                }
            } );
    }

    hoverStarsNumber = (stars) => {
        // console.log('upadted star in state : ' + stars);
        this.props.updateStars(stars);
        this.setState({
            stars: parseInt(stars)
        });
    }

    resetStarsNumber = () => {
        this.setState({
            stars : this.props.stars
        });
    }

    render(){

        let edit = this.props.edit;

        return (
            <StarRatingComponent
                name={'starSystem' + this.props.id}
                starCount={5}
                value={this.state.stars || this.props.stars || '0'}
                editing={edit}
                onStarClick={this.props.onSelected} />
        );
    }
}
