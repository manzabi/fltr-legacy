import React from 'react';
import Container from '../../../layout/layout/Container';
import Grid from '../../../layout/layout/Grid';

const SectionContainer = ({children, fluid=false, className=''}) => {
    let componentClass = 'section-container-content';
    if (className) {
        componentClass += ` ${className}`;
    }
    return (
        <Container className='section-container' fluid={fluid}>
            <Grid className={componentClass}>
                {children}
            </Grid>
        </Container>
    );
};

export default SectionContainer;