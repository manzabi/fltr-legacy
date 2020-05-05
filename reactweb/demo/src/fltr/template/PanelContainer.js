import React from 'react';

import {
    Grid,
    Row,
    Col,
} from '@sketchpixy/rubix';

import BackButton from '../../fltr/template/BackButton';

export default class PanelContainer extends React.Component {
    static propTypes = {
        size: React.PropTypes.string,
        marginTop: React.PropTypes.bool,
        padding: React.PropTypes.bool,
        lg: React.PropTypes.number,
        lgOffset: React.PropTypes.number,
        md: React.PropTypes.number,
        mdOffset: React.PropTypes.number,
        xs: React.PropTypes.number,
        xsOffset: React.PropTypes.number,
        back: React.PropTypes.bool,
        onBackButton: React.PropTypes.func
    };

    render() {
        let props = { ...this.props };

        let size = 'medium';
        if (props.size !==undefined) size = props.size;

        // console.log('container size : ' + size);

        let lgSize = 0;
        let lgOffset = 0;
        let mdSize = 0;
        let mdOffset = 0;
        let xsSize = 0;
        let xsOffset = 0;

        if (size === 'medium'){
            lgSize = 8;
            lgOffset = 2;
            mdSize = 10;
            mdOffset = 1;
            xsSize = 12;
            xsOffset = 0;
        } else if (size === 'little'){
            lgSize = 6;
            lgOffset = 3;
            mdSize = 8;
            mdOffset = 2;
            xsSize = 12;
            xsOffset = 0;
        } else if (size === 'big'){
            lgSize = 12;
            lgOffset = 0;
            mdSize = 12;
            mdOffset = 0;
            xsSize = 12;
            xsOffset = 0;
        }

        let back = false;
        if (props.back !== undefined) back = props.back;

        let marginTop = true;
        if (props.marginTop !== undefined) marginTop = props.marginTop;
        /*
        if (back){
            marginTop = false;
        }
        */

        let padding = true;
        if (props.padding !== undefined) padding = props.padding;

        let className = '';
        if (props.className !== undefined) className = props.className;
        if (marginTop) {
            className += ' containerSection ';
        }
        if (!padding){
            className += ' noPadding ';
        }

        return (
            <Grid className={className}>
                <Row>
                    <Col lg={lgSize} lgOffset={lgOffset}
                        md={mdSize} mdOffset={mdOffset}
                        xs={xsSize} xsOffset={xsOffset}
                        className="nopaddingMobile">

                        {back &&
                        <Grid>
                            <Row>
                                <Col xs={6} className="noPadding">
                                    {this.props.buttonSecondary}
                                    <div style={{visibility:'hidden'}}>-</div>
                                </Col>
                                <Col xs={6} style={{textAlign:'right'}} className="noPadding">
                                    {back &&
                                    <BackButton onBackButton={this.props.onBackButton}/>
                                    }
                                </Col>
                            </Row>
                        </Grid>
                        }

                        <Grid>
                            {this.props.children}
                        </Grid>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export class PanelContainerHeader extends React.Component {

    render() {
        let props = { ...this.props };

        let padding = true;
        if (props.padding !== undefined) padding = props.padding;

        let center = false;
        if (props.center !== undefined) center = props.center;

        let className = 'sectionBordered';
        if (props.className !== undefined) className = this.props.className + ' sectionBordered';

        let classNameInner = 'nopaddingMobile';
        if (props.className !== undefined) className = props.className;

        if (!padding){
            className += ' noPadding';
            classNameInner += ' noPadding';
        }

        if (center) {
            classNameInner += ' text-center';
        }

        return (
            <Row className={className} style={this.props.style}>
                <Col xs={12} className={classNameInner}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

export class PanelContainerHeaderCustom extends React.Component {

    render() {

        let classNameRow ='sectionBordered';
        if (this.props.className !== undefined) classNameRow = this.props.className;

        return (
            <Row className={classNameRow} style={this.props.style}>
                {this.props.children}
            </Row>
        );
    }
}

export class PanelContainerCustom extends React.Component {

    render() {
        let props = { ...this.props };
        let classNameRow ='';
        let verticalAlign = false;
        if (props.verticalAlign !== undefined) verticalAlign = props.verticalAlign;
        if (verticalAlign){
            classNameRow = 'vertical-align';
        }

        return (
            <Row className={classNameRow} style={this.props.style}>
                {this.props.children}
            </Row>
        );
    }
}

export class PanelContainerContent extends React.Component {

    render() {
        let props = { ...this.props };

        let className ='';
        let padding = true;
        if (props.padding !== undefined) padding = props.padding;
        if (!padding){
            className += 'noPadding ';
        }

        let bordered = true;
        let borderedClass ='sectionBordered';
        if (props.bordered !== undefined) {
            bordered = props.bordered;
        }
        if (!bordered){
            borderedClass = '';
        }

        return (
            <Row className={className + borderedClass} style={this.props.style}>
                <Col xs={12} className={className + 'nopaddingMobile'}>
                    <Grid>
                        <Row className={className + 'sectionInternal'}>
                            {this.props.children}
                        </Row>
                    </Grid>
                </Col>
            </Row>
        );
    }
}

