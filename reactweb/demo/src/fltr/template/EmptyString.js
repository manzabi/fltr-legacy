import React from 'react';

import {
    Row,
    Col,
    Grid,
} from '@sketchpixy/rubix';

export default class EmptyString extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Grid style={{paddingTop:20, paddingBottom:20}} className={this.props.className}>
                <Row>
                    <Col xs={12} style={{textAlign:'center'}}>
                        {this.props.children}
                    </Col>
                </Row>
            </Grid>
        );
    }
}

