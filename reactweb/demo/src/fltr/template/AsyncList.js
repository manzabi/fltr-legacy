import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../../fltr/Spinner';
import Warning from '../../fltr/Warning';

import CrazySeparator from '../../layout/layout/CrazySeparator';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import Container from '../../layout/layout/Container';
import CrazyTooltip from '../../layout/uiUtils/tooltip';
import Grid from '../../layout/layout/Grid';


/**
 * @param data
 * @param onLoad
 * @param onCreateItem
 * @param onInit
 * @param title
 * @param showHeader
 * @param showEmpty
 * @param emptyContent
 * @param container
 * @param containerHeight
 * @param elementIsScrollable
 * @param spy
 * @param newHeader
 * @param scrollableElement
 * @param offsetToLoad
 * @param renderOnLoading
 */
export default class AsyncList extends Component {

    state = {
        spy: this.props.spy
    };

    componentDidMount() {
        this.id = Math.random();
        this.mountListener();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.spy !== this.props.spy) {
            if (nextProps.spy) {
                this.setState({
                    spy: nextProps.spy
                }, this.mountListener);
            } else {
                this.setState({
                    spy: nextProps.spy
                }, this.unmountListener);
            }
        }
    }

    componentWillUnmount() {
        if (this.state.spy) {
            this.unmountListener();
        }
    }

    mountListener = () => {
        if (this.state.spy) {

            try {
                const scrollSpyMountPoint = document.getElementById(this.props.scrollableElement);
                scrollSpyMountPoint.addEventListener('scroll', this.handleScroll);
            } catch (e) {
                this.setState({
                    spy: false
                });
            }
        }
    };

    unmountListener = () => {
        if (this.state.spy) {
            const scrollSpyMountPoint = document.getElementById(this.props.scrollableElement);
            scrollSpyMountPoint.removeEventListener('scroll', this.handleScroll);
        }
    };

    handleScroll = () => {
        const { offsetToLoad, scrollableElement, data, onLoad } = this.props;
        const spyElement = document.getElementById('scroll-spy');
        let spyIntoView = null;
        if (spyElement) {
            const spyOffset = spyElement.offsetTop.valueOf();
            const scrollPosition = document.getElementById(scrollableElement).scrollTop.valueOf();
            spyIntoView = spyOffset - offsetToLoad - window.innerHeight <= scrollPosition;
        }
        if (spyIntoView && data && data.item && !data.item.last && !data.isFetching) {
            onLoad();
        } else if (data && data.item && data.item.last) {
            this.unmountListener();
        }
    };

    renderHeader = () => {
        const { data, showHeader, newHeader, title, onInit } = this.props;
        if (showHeader) {
            return (
                <div style={{ marginBottom: 10, textAlign: 'left' }}>
                    <span className="summaryTitle listSummaryTitle">
                        {data.item.totalElements} {title}
                    </span>

                    <CrazyTooltip
                        messageChildren={<span>Refresh</span>}
                        position='bottom'
                        color='darkside'
                    >
                        <span onClick={onInit} style={{ outline: 'none', fontSize: '1em', verticalAlign: 'top' }}>
                            <i className='icon-entypo-cw' />
                        </span>
                    </CrazyTooltip>
                </div>
            );
        } else if (newHeader !== '') {
            return <CrazySeparator text={`${data.item.totalElements} ${newHeader}`} />;
        }
    };

    renderSticky = () => {
        const {stickyContent} = this.props;
        if (stickyContent) {
            if (typeof stickyContent === 'function') {
                return stickyContent();
            } else {
                return stickyContent;
            }
        } else {
            return null;
        }
    };

    render() {
        const {
            data,
            onLoad,
            showEmpty,
            onCreateItem,
            showHeaderOnEmpty,
            showHeader,
            newHeader,
            title,
            fluid,
            className,
            renderOnLoading
        } = this.props;

        let last = true;
        if (data !== null && data.item) {
            last = data.item.last;
        }

        let emptyContent = '';
        if (showEmpty) {
            emptyContent = <span><br />No items</span>;
            if (this.props.emptyContent !== undefined) {emptyContent = this.props.emptyContent;}
        }

        const loader = <Spinner style={{ marginTop: 20 }} />;
        const isLoading = data.isFetching && !data.item;
        let items = [];
        if (!isLoading || renderOnLoading && isLoading) {
            if (isLoading && renderOnLoading) {
                return (
                    <Container fluid={fluid}>
                        {this.props.stickyContent &&
                            <div className={`${className}-sticky-content`} style={{position: 'sticky', top: 0, left: 0, zIndex: 1}}>
                                {this.renderSticky()}
                            </div>
                        }
                        {showHeaderOnEmpty && this.renderHeader()}
                        {loader}
                    </Container>
                );
            } else if (!data.item.content || data.item.content.length === 0) {
                if (((showHeader && title) || newHeader !== undefined) && showHeaderOnEmpty) {
                    return (
                        <Container fluid={fluid}>
                            {showHeaderOnEmpty && this.renderHeader()}
                            {emptyContent}
                        </Container>
                    );
                } else {
                    return null;
                }
            } else {
                data.item.content.map((currentItem) => {
                    items.push(onCreateItem(currentItem));
                });
                return (
                    <Container fluid={fluid}>
                        {this.props.stickyContent &&
                            <div className={`${className}-sticky-content`} style={{position: 'sticky', top: 0, left: 0, zIndex: 1}}>
                                {this.renderSticky()}
                            </div>
                        }
                        {this.renderHeader()}
                        {this.state.spy &&
                        <Grid className={className}>
                            {items.map((item) => item)}
                            <div id='scroll-spy'>
                                {data.isFetching &&
                                    loader
                                }
                            </div>
                        </Grid>
                        ||
                        <Grid className={className}>
                            {items.map((item) => item)}
                            {data.isFetching &&
                                loader
                            }
                        </Grid>

                        }
                        {!last && !data.isFetching && !this.state.spy &&
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <CrazyButton action={onLoad} text='Show more' inverse />
                        </div>
                        }
                    </Container>
                );

            }
        } else {
            if (data.isError) {
                return (<Warning />);
            } else {
                return (<div />);
            }
        }

    }
    static propTypes = {
        data: PropTypes.shape({
            isFetching: PropTypes.bool.isRequired,
            isError: PropTypes.bool.isRequired
        }),
        onLoad: PropTypes.func.isRequired,
        onCreateItem: PropTypes.func.isRequired,
        onInit: PropTypes.func.isRequired,
        title: PropTypes.string,
        showHeader: PropTypes.bool,
        showEmpty: PropTypes.bool,
        emptyContent: PropTypes.node,
        spy: PropTypes.bool,
        newHeader: PropTypes.string,
        scrollableElement: PropTypes.string.isRequired,
        offsetToLoad: PropTypes.number.isRequired,
        fluid: PropTypes.bool,
        showHeaderOnEmpty: PropTypes.bool,
        className: PropTypes.string,
        stickyContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        renderOnLoading: PropTypes.bool
    };
    static defaultProps = {
        showHeader: true,
        showEmpty: true,
        spy: true,
        newHeader: '',
        scrollableElement: 'main-body',
        offsetToLoad: 200,
        fluid: false,
        showHeaderOnEmpty: true,
        className: ''
    }
}