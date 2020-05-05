import React, {Component} from 'react';

import {connect} from 'react-redux';
import {hideMainScroll, showMainScroll} from '../../redux/actions/uiActions';

/**
 *  @param children content to be rendered inside the main body
 *  @param {function} header to be tendered in top of the main content (always use header instead of passing the header as a children its user to calculate the heights)
 *  @param {string} scrollableElement, by default the scrollable element is main content, but if you need to make scrollable other element pass the id of the element
 */

@connect(({limitBannerStatus}) => ({limitBannerStatus}))
export default class MainContainer extends Component {
    componentDidMount () {
        this.manageScrollLogic();
    }

    manageScrollLogic = () => {
        this.props.dispatch(hideMainScroll());
        const {scrollableElement} = this.props;
        if (scrollableElement) {
            const styles = this.getContentStyles();
            if (styles) {
                Object.keys(styles).forEach((key) => {
                    const currentElement =document.getElementById('content-view')
                    if (currentElement) {
                        currentElement.style[key] = styles[key];
                    }
                });
            }
        }
    };

    getContentStyles = () => {
        const {header, limitBannerStatus} = this.props;
        return {
            height: `calc(100vh${header ? ' - 60px': ''} - 60px${limitBannerStatus ? ' - 30px' : ''})`,
            overflowY: 'auto',
            overflowX: 'auto'
        };
    };

    componentWillUnmount () {
        this.props.dispatch(showMainScroll());
    }

    render () {
        const {header, scrollableElement, className = '', dispatch, limitBannerStatus, ...rest} = this.props;
        return (
            <section className={`main-container${header ? ' with-header' : ''} ${className}`}>
                {header && header() }
                <section id='main-content' className='main-content' style={!scrollableElement ? this.getContentStyles(): {}} {...rest} />
            </section>
        );
    }
}