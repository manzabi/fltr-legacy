'use strict';

import React, { Component } from 'react';
import Header from '../Components/Header';
import { Container, Grid, Col, Header as Title, Text } from '@billingfluttr/crazy-ui';
import * as ga from '../Utils/analytics';

export default class EmailSent extends Component {

    componentDidMount() {
        ga.track(ga.SIGNUP_RECRUITER_SUCCESS);
    }

    render() {
        const imageUrl = `${process.env.FluttrFilesBaseUrl}cdn/img/common/comunication/img-verifyemail.svg`;
        return (
            <Container fluid className='crazy-email-success'>
                <Grid>
                    <Col sm='6' smOffset='3' xs='12'>
                        <img className='email-sent-pic' src={imageUrl}/>
                        <Title size='lg'>Please verify your email</Title>
                        <Text size='lg'>Once you verify your email address, you can get started with Fluttr!</Text>
                    </Col>
                </Grid>
            </Container>
        );
    }
}