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

export default class ReviewCompletedBanner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            string: this.getRandomString()
        };
    }

    getRandomString(){
        let arrayStrings = [];
        arrayStrings.push('You successfully completed your review. Time to relax now: you deserve it!');
        arrayStrings.push('You did it! Now take a moment to appreciate how #awesome you are ;)');
        arrayStrings.push('It wasn’t that hard was it? Thanks for making recruitment more social!');
        arrayStrings.push('You are done with it. It was not that difficult was it? You are a super star!');
        arrayStrings.push('All done! Will you be hiring somebody soon? Then remember to use Fluttr!');
        arrayStrings.push('You made it! But we already knew you would make it on time. You rock!');

        var item = arrayStrings[Math.floor(Math.random()*arrayStrings.length)];

        return item;
    }

    render() {
        return (
            <ImageBanner style={this.props.style} src="/imgs/app/review/banner_green.jpg">
                <div>
                    <h2 className="reviewCompletetBannerTitle">
                        <span>Congratulations!</span>
                    </h2>
                    <h3 className="reviewCompletetBannerSubTitle">
                        <span>{this.state.string}</span>
                    </h3>
                </div>
            </ImageBanner>
        );
    }

}
