import React from 'react';
import { connect } from 'react-redux';

import {
    Grid,
    Row,
    Col,
    Image,
    Form,
    FormControl,
    FormGroup
} from '@sketchpixy/rubix';


import Button from 'react-bootstrap-button-loader';

import {fetchReplyList, postReply} from '../../redux/actions/feedActions';
import FluttrButton from '../../common/components/FluttrButton';

@connect((state) => state)
export default class FeedReplyWriteComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentDidMount(){
        $('#feed-reply-form').validate({
            errorClass: 'validation-error-class',
            // 1. validation rules.
            rules: {
                reply: {
                    // Removed limit to expert repply to candidates
                    // maxlength: 512,
                    required: true,
                }
            },
            submitHandler: function (form) {
                return false;
            }
        });
    }

    onSuccessReply = () => {
        this.setState({
            loading: false
        });
        this.closeModal();
        if (this.props.hideFeedback) this.props.hideFeedback();
        let id = this.props.id;
        this.props.dispatch(fetchReplyList(id));
        $('html, body').animate({ scrollTop: document.body.scrollHeight }, 'slow');
    }
    
    handleSubmit = () => {
        let id = this.props.id;

        // code you want to do
        if ($('#feed-reply-form').valid()) {
            this.setState({
                loading: true
            });
            let content = $('#reply').val();
            let formObj = {
                content: content,
            };

            // console.log(JSON.stringify(formObj));
            this.props.dispatch(postReply(id, formObj, this.onSuccessReply, this.onSubmitError));

        }
    }

    closeModal = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    onSubmitError = () => {
        this.setState({
            loading: false
        });
    }

    render(){
        let placeholder = 'Add a comment or ask a question...';
        if (this.props.placeholder !== undefined) placeholder = this.props.placeholder;

        return(
            <Grid className="noPadding">
                <Form id='feed-reply-form'>
                    <Row className="sectionInternal" >
                        <Col xs={12} md={12}>
                            <FormGroup>
                                <FormControl
                                    rows='3'
                                    componentClass='textarea'
                                    id="reply"
                                    name="reply"
                                    placeholder={placeholder}
                                    className="textareaPadding"
                                    defaultValue=""
                                    style={{borderColor: 'transparent'}}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row style={{textAlign: 'center'}}>
                        <Col xs={6}>
                            <FluttrButton size='xSmall' type='link' action={this.closeModal}>
                                Cancel
                            </FluttrButton>
                        </Col>
                        <Col xs={6}>
                            <FluttrButton size='xSmall' loading={this.state.loading} action={this.handleSubmit}>
                                Submit
                            </FluttrButton>
                        </Col>
                    </Row>
                </Form>
            </Grid>
        );
    }

}
