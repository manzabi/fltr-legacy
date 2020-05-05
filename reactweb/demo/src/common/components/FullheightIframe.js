import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Spinner from '../../fltr/Spinner';

/**
 * @param url: PropTypes.string.isRequired
 */
export default class FullheightIframe extends Component {

    constructor() {
        super();
        this.state = {
            iFrameHeight: '0px',
            loading: true,
            numPages: null,
            pages: 0,
            nextPage: 0,
            canvasId: Math.floor(Math.random() * 99999)
        };
    }

    componentDidMount () {
        const url = this.props.url;
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        const pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/window.pdf.worker.js';

        // Asynchronous download of PDF
        const loadingTask = pdfjsLib.getDocument(url);
        const root = this;
        this.setState({
            nextPage: 1
        });
        loadingTask.promise.then(function(pdf) {
            // debugger;
            // console.log('PDF loaded');
  
            // Fetch the first page
            const totalPages = pdf.numPages;
            root.setState({
                pages: totalPages
            }, () => {
                if (totalPages >= 1) {
                    root.renderPage(1, pdf);
                }
            });
        }, function (reason) {
            // PDF loading error
            console.error(reason);
        });
        
    }

    renderPage = (pageNum, pdf) => {
        const root = this;
        pdf.getPage(pageNum).then(function(page) {
            // console.log('Page loaded');

            const scale = 1.5;
            const viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            const canvas = document.getElementById(`frame-canvas-${root.state.canvasId}-${pageNum - 1}`);
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);

            renderTask.then(function () {

                if (pageNum === root.state.pages) {
                    // console.log('Page rendered');
                    root.setState({
                        loading: false
                    });
                } else {
                    root.setState({
                        nextPage: root.state.nextPage + 1
                    }, () => root.renderPage(pageNum + 1 , pdf));
                    
                }
            });
        });
    }
    
    render() {
        const { nextPage } = this.state;
        const style = (index) => ({
            display: this.state.loading && index === this.state.nextPage - 1 ? 'none' : 'block',
            width: '100%',
            maxWidth: this.props.maxWidth,
            margin: '0 auto 15px auto',
            border: '1px solid #cacaca88'
        });
        const parentProps = {
            onClick: this.props.onClick,
            className: this.props.className,
            id: this.props.id,
            style: this.props.style
        };
        const {canvasId: id} = this.state;
        return (
            <div {...parentProps}>
                { Array(nextPage).fill('*').map((page, index) => {
                    return (
                        <canvas
                            id={`frame-canvas-${id}-${index}`}
                            style={style(index)}
                        />
                    );
                })     
                }
                { this.state.loading && <Spinner />}
            </div>
        );
    }
    static PropTypes = {
        url: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        className: PropTypes.string,
        id: PropTypes.string,
        style: PropTypes.object
    };
}