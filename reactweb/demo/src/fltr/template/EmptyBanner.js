import React from 'react';

import {
    Row,
    Col,
    Grid,
} from '@sketchpixy/rubix';

import EmptyState from './EmptyState';

export default class EmptyBanner extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){
        let text = this.props.text;

        return (
            <Grid>
                <Row className="vertical-align bordered">

                    <Col md={12} className="vertical-flex" style={{textAlign: 'center'}}>
                        <EmptyState>
                            <span className="summaryTitle">
                                {text}
                            </span>
                        </EmptyState>
                        <br />
                    </Col>
                </Row>
            </Grid>
        );
    }

}