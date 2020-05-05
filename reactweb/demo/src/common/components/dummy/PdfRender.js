import React, { Component } from 'react';
// import { Document, Page } from 'react-pdf';
import FullheightIframe from '../FullheightIframe';

export default class PdfRender extends Component {
    state = {
        iFrameHeight: '0px',
        loading: true,
        numPages: null
    };

    // onDocumentLoad = ({ numPages }) => {
    //     this.setState({ numPages });
    // }

    render() {
        // const { numPages } = this.state;
        return (
            <div>
                <FullheightIframe url='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/challenge/e1ccb29a0f598fe193cd75e56404ea2c.pdf'/>
                {/* <Document
                    file='https://skylabcoders.herokuapp.com/proxy?url=https://s3.eu-west-3.amazonaws.com/fluttr-files/all/challenge/e1ccb29a0f598fe193cd75e56404ea2c.pdf'
                    onLoadSuccess={this.onDocumentLoad}
                >
                    {Array(numPages).fill('foo').map((foo, i) => {
                        return <Page renderAnnotations={false} key={i} pageNumber={i + 1} />;
                    })

                    }
                </Document> */}

            </div>
        );
    }
}