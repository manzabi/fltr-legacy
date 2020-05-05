import React from 'react';

import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Image
} from '@sketchpixy/rubix';
import ImageBanner from '../../../template/ImageBanner';

export default class ReviewTalentWaitBanner extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let text = this.props.text;

        return (
            <ImageBanner style={this.props.style} src="/imgs/app/review/banner_green.jpg">
                <div>
                    <h2 className="reviewCompletetBannerTitle">
                        <span>You have no answers to review!</span>
                    </h2>
                    <h3 className="reviewCompletetBannerSubTitle">
                        <span>{text}</span>
                    </h3>
                </div>
            </ImageBanner>
        );
    }

}
