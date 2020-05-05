import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getFileType } from '../../fltr/utils/fileUtils';
import { openModalFix, closeModalFix } from '../../common/uiUtils';
import FullheightIframe from '../../common/components/FullheightIframe';
import CrazyIcon from '../icons/CrazyIcon';
import { scrollTo } from '../../fltr/navigation/NavigationManager';
import { Portal } from 'react-portal';
const maxZoom = 200;
const minZoom = 20;
const zoomAmount = 10;

export default class FullscreenFile extends Component {
    state = {
        zoom: 100,
        layoutMounted: false,
        curDown: false
    };

    componentWillReceiveProps(nextProps) {
        const { open, manageUiFix } = this.props;
        if (nextProps.open && !open) {
            if (manageUiFix) {
                openModalFix();
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.manageKeyDown);
        window.removeEventListener('keyup', this.manageKeyUp);
        if (this.props.manageUiFix) {
            closeModalFix();
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.manageKeyDown);
        window.addEventListener('keyup', this.manageKeyUp);
    }

    zoomIn = () => {
        const scrollableElement = document.getElementById('file-section');
        const { zoom } = this.state;
        const oldScroll = {
            scrollTop: scrollableElement.scrollHeight,
            scrollLeft: scrollableElement.scrollWidth
        };
        if (zoom + zoomAmount <= maxZoom) {
            this.setState({
                zoom: zoom + zoomAmount
            }, () => {
                const newScroll = {
                    scrollTop: scrollableElement.scrollHeight,
                    scrollLeft: scrollableElement.scrollWidth
                };
                scrollableElement.scrollTop = scrollableElement.scrollTop + ((newScroll.scrollTop - oldScroll.scrollTop) / 2);
                scrollableElement.scrollLeft = scrollableElement.scrollLeft + ((newScroll.scrollLeft - oldScroll.scrollLeft) / 2);
            });
        } else if (zoom + zoomAmount > maxZoom && zoom < maxZoom) {
            this.setState({
                zoom: maxZoom
            });
        }
    };

    zoomOut = () => {
        const scrollableElement = document.getElementById('file-section');
        const { zoom } = this.state;
        const oldScroll = {
            scrollTop: scrollableElement.scrollHeight,
            scrollLeft: scrollableElement.scrollWidth
        };

        if (zoom - zoomAmount >= minZoom) {
            this.setState({
                zoom: zoom - zoomAmount
            }, () => {
                const newScroll = {
                    scrollTop: scrollableElement.scrollHeight,
                    scrollLeft: scrollableElement.scrollWidth
                };
                scrollableElement.scrollTop = scrollableElement.scrollTop - ((oldScroll.scrollTop - newScroll.scrollTop) / 2);
                scrollableElement.scrollLeft = scrollableElement.scrollLeft - ((oldScroll.scrollLeft - newScroll.scrollLeft) / 2);
            });
        } else if (zoom - zoomAmount < minZoom && zoom > minZoom) {
            this.setState({
                zoom: minZoom
            });
        }
    };

    manageMouseDown = () => {
        this.setState({ curDown: true });
    };

    manageMouseUp = () => {
        this.setState({ curDown: false });
    };

    manageMouseMove = (event) => {
        if (this.state.curDown) {
            const scrollableItem = event.target;
            scrollableItem.scrollTop -= event.nativeEvent.movementY;
            scrollableItem.scrollLeft -= event.nativeEvent.movementX;
        }
    };

    manageWheel = ({ target: scrollableItem, deltaY }) => {
        const { ctrl } = this.state;
        if (deltaY > 0) {
            if (ctrl) {
                this.zoomOut();
            } else {
                scrollTo(scrollableItem.scrollTop.valueOf() + (scrollableItem.offsetHeight.valueOf() / 2), scrollableItem.scrollLeft.valueOf(), scrollableItem.id);
            }
        } else {
            if (ctrl) {
                this.zoomIn();
            } else {
                scrollTo(scrollableItem.scrollTop.valueOf() - (scrollableItem.offsetHeight.valueOf() / 2), scrollableItem.scrollLeft.valueOf(), scrollableItem.id);
            }
        }
    };

    manageKeyDown = (event) => {
        if (event.keyCode === 16) {
            this.setState({ ctrl: true });
        }
    };

    manageKeyUp = (event) => {
        if (event.keyCode === 16) {
            this.setState({ ctrl: false });
        }
    };

    renderFile = () => {
        const { file } = this.props;
        const { zoom } = this.state;
        const fileType = getFileType(file);
        switch (fileType) {
            case 'image':
                return (
                    <img
                        className='scrollable-file'
                        id='scrollable-file'
                        src={file}
                        style={{ width: `${zoom}%`, marginLeft: zoom < 100 ? (100 - zoom) / 2 + '%' : 0 }}
                    />
                );

            case 'pdf':
                return (
                    <FullheightIframe
                        className='scrollable-file'
                        id='scrollable-file'
                        url={file}
                        style={{ width: `${zoom}%`, marginLeft: zoom < 100 ? (100 - zoom) / 2 + '%' : 0 }}
                    />
                );
            default:
                return <p>File not present or invalid file type</p>;

        }
    }

    render() {
        const { open, onClose } = this.props;
        const { zoom } = this.state;
        if (open) {
            return (
                <Portal>
                    <div className='crazy-fullscreen-file'>
                        <CrazyIcon icon='icon-cancel' className='close-file' onClick={onClose} />
                        <section
                            id='file-section'
                            className='file-section'
                            onMouseDown={this.manageMouseDown}
                            onMouseUp={this.manageMouseUp}
                            onMouseOut={this.manageMouseUp}
                            onMouseMove={this.manageMouseMove}
                            onWheel={this.manageWheel}
                        >
                            {this.renderFile()}
                        </section>
                        <section className='file-controls'>
                            <span className='zoom-button' onClick={this.zoomOut}>-</span>
                            <CrazyIcon icon='icon-search' />
                            <span className='zoom-button' onClick={this.zoomIn}>+</span>
                            <div className='zoom-view'>
                                {zoom}%
                            </div>
                        </section>
                    </div>
                </Portal>
            );
        } else {
            return null;
        }
    }
    static propTypes = {
        file: PropTypes.string.isRequired,
        open: PropTypes.bool.isRequired,
        manageUiFix: PropTypes.bool
    };

    static defaultProps = {
        file: 'file.foo',
        open: false,
        manageUiFix: false
    };
}

