import React, {Component} from 'react';

import {
    Modal
} from '@sketchpixy/rubix';

import DOMPurify from 'dompurify';

import {openModalFix, closeModalFix} from '../../../common/uiUtils';
import StarsViewComponent from '../../../common/components/StarsViewComponent';
import Grid from '../../../layout/layout/Grid';
import Row from '../../../layout/layout/Row';
import Col from '../../../layout/layout/Col';
import Container from '../../../layout/layout/Container';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import {Text} from '../../../layout/FluttrFonts';
import CrazyButton from '../../../layout/buttons/CrazyButtons';

export default class RecruiterReviewTalentModal extends Component {

    componentWillReceiveProps(nextProps){
        let open = false;
        if (this.props.open !== undefined) {open = this.props.open;}

        if (!open && nextProps.open){
            // is opening, disable scrollbar main content
            openModalFix();
        }
    }

    closeModal = () => {
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
        closeModalFix();
    }

    render(){
        let open = false;
        if (this.props.open !== undefined) {open = this.props.open;}

        let user = this.props.data.user;

        // array review, retrieve and sort
        let arrayReview = [];
        this.props.data.review.reviewTalent.judgeReviews.map(function(judgeReview){
            arrayReview.push(judgeReview);
        });
        arrayReview.sort(function(a,b){
            // console.log('a.review.starNumber : ' + a.review.starNumber + ' b.review.starNumber : ' + b.review.starNumber);
            return parseInt(b.feedback.length) - parseInt(a.feedback.length);
        });

        return(
            <div>
                <Modal bsSize='large' show={open} onHide={this.closeModal}>
                    <Modal.Body>
                        <Container>
                            <Grid className='recruiterReviewTalentModal'>
                                <Row>
                                    <Col xs='12' style={{textAlign:'right'}}>
                                        <a style={{cursor:'pointer',fontSize:'1.5em'}} onClick={this.closeModal} >
                                            <i className='icon-entypo-cross fluttrDarkGrey'  />
                                        </a>
                                    </Col>
                                </Row>
                                <Row style={{marginBottom:40}}>
                                    <Col xs={12} className='text-center' style={{padding: '20px 40px 20px 40px'}}>
                                        <span className='modalTitle'>The experts' feedbacks about <br />
                                            <strong>{user.completeName}</strong>
                                        </span>
                                    </Col>
                                </Row>
                                {arrayReview.map((judgeReview) =>
                                    <JudgeReview data={judgeReview} key={judgeReview.id}/>
                                )}
                                <Row style={{textAlign: 'center'}}>
                                    <Col xs='12'>
                                        <CrazyButton text='CLOSE' action={this.closeModal} />
                                    </Col>
                                </Row>
                            </Grid>
                        </Container>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

class JudgeReview extends Component {

    render(){

        let judge = this.props.data.judge;


        return(
            <div className='modal-reviewtalent-judge-review'>
                <Grid>
                    <Row className='vertical-align'>
                        <Col xs='12' sm='5'>
                            <Row revertMargin>
                                <Col xs='3' className='profile-image-container'>
                                    <ProfilePic url={judge.imageUrl} length='60%' shape='circle' />
                                </Col>
                                <Col xs='9'>
                                    <Text bold className='modal-generic-expert-name'>{judge.completeName}</Text>
                                    <Text className='modal-generic-expert-position'>{judge.completePosition}</Text>
                                    {judge.social.linkedin &&
                                        <a className='black' href={judge.social.linkedin}
                                            target='_blank'>
                                            <i className='icon-fontello-linkedin-squared icon-right-padding'
                                                style={{
                                                    fontSize: 2 + 'em',
                                                    verticalAlign: 'middle',
                                                    marginRight: 5,
                                                    color: '#007bb6'
                                                }}/>
                                            Profile
                                        </a>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='12' sm='7' className='modal-generic-container-feedback'>
                            <StarsViewComponent starsValue={this.props.data.stars} starsWidth={30} align='center' />
                            <p className='modal-generic-feedback' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.data.feedbackHtml)}} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


