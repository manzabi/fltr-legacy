import React from 'react';
import { connect } from 'react-redux';

import {
    Grid,
    Row,
    Col,
    Image
} from '@sketchpixy/rubix';

import DOMPurify from 'dompurify';
import Lightbox from 'react-image-lightbox';

import {getFileExtension} from '../utils/fileUtils';
import FullheightIframe from '../../common/components/FullheightIframe';

@connect((state) => state)
export default class FeedComponent extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            iFrameHeight: '0px'
        };
    }

    componentDidMount(){
        $('#feed-content').find('a').attr('target','_blank');
    }

    render(){
        let feed = this.props.data;
        // console.log('review user item/feed : ' + JSON.stringify(feed));
        const customStyles = {
            overlay: {
                zIndex:1099
            }
        };

        return(
            <Grid>
                <Row className='sectionInternal'>
                    <Col xs={12} style={{paddingTop:20}}>
                        <span id='feed-content' className='summarySubTitle' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(feed.contentHtml)}} />
                    </Col>
                </Row>
                {feed.file &&
                <div>
                    <Row className='sectionInternal fluttr-text-small' id='attachmentPreview'>
                        <Col xs={12}>
                            <i className='fal fa-paperclip' />&nbsp;Attachment&nbsp;
                            <a href={feed.file.url} target='_blank'>Download</a>
                        </Col>
                    </Row>
                    <Row className='sectionInternal fluttr-text-small'>
                        <Col xs={12}>
                            {getFileExtension(feed.file.url) === 'pdf' ?
                                <div>
                                    <p>
                                        
                                    </p>
                                    {/* <canvas id='pdf-viewer' /> */}
                                    <FullheightIframe url={feed.file.url} maxWidth='700'/>
                                </div>
                                :
                                <a href={feed.file.url} download>
                                    <span className='textStrong'>{feed.file.originalFileName}</span>
                                </a>
                            }
                        </Col>
                    </Row>
                </div>
                }
                {!feed.imagePlaceholder &&
                <div>
                    <Row className='sectionInternal' id='imagePreview' style={{fontSize: '1.5em'}}>
                        <Col xs={12}>
                            <i className='icon-entypo-image' /> Image&nbsp;
                            <a href={feed.imageUrl} target='_blank' download>Download</a>
                        </Col>
                    </Row>
                    <Row className='sectionInternal'>
                        <Col xs={12}>
                            <Image className='zoomable'
                                onClick={() => this.setState({ isOpen: true })}
                                src={feed.imageUrl} thumbnail
                            />
                        </Col>
                    </Row>
                </div>
                }
                {this.state.isOpen &&
                <Lightbox
                    reactModalStyle={customStyles}
                    mainSrc={feed.imageUrl}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
                }
            </Grid>
        );
    }
}