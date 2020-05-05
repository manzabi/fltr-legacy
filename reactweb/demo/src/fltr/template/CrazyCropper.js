import React, { Component } from 'react';

import Cropper from 'react-cropper';
import RecruiterCrazyModal from '../../layout/modal/RecruiterCrazyModal';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import CrazySlider from '../../layout/uiUtils/crazySlider';
import CrazyIcon from '../../layout/icons/CrazyIcon';

export default class CrazyCropper extends Component {
    state = {
        src: '',
        cropResult: null,
        zoom: 0
        // previewStyles: {}
    };

    types = {
        default: 'image-crop',
        profile: 'profile-picture-crop',
        cover: 'cover-picture-crop'
    };

    zoomData = {
        maxZoom: 4,
        minZoom: 0.1,
        defaultZoom: 3,
        zoomStep: 1,
        inputStep: 1
    };

    manageZoom = (type, event) => {
        if (event) {
            const {target: {value}} = event;
            const newZoom = this.zoomData.zoomStep * Math.round(value);
            this.setState({ zoom: newZoom }, () => {
                this.cropper.zoomTo(this.state.zoom);
            });
        } else {
            if (type === 'in') {
                const isValidZoom = this.state.zoom + this.zoomData.zoomStep <= this.zoomData.maxZoom;
                this.setState({
                    zoom: isValidZoom ? this.state.zoom + this.zoomData.zoomStep : this.zoomData.maxZoom
                }, () => {
                    this.cropper.zoomTo(this.state.zoom);
                });
            } else if (type === 'out') {
                const isValidZoom = this.state.zoom - this.zoomData.zoomStep >= this.zoomData.minZoom;
                this.setState({
                    zoom: isValidZoom ? this.state.zoom - this.zoomData.zoomStep : this.zoomData.minZoom
                }, () => {
                    this.cropper.zoomTo(this.state.zoom);
                });
            }
        }
    };

    manageRotate = () => {
        const {cropper} = this;
        cropper.rotate(90);
    };

    onCropMount = (event) => {
        const { cropper: { canvasData: image, cropBoxData: tempData, image: previewData } } = this.cropper;
        const defaultZoom = image.width / image.naturalWidth;
        const max = defaultZoom / 0.5;
        this.zoomData = {
            defaultZoom,
            maxZoom: max,
            minZoom: max / 100,
            zoomStep: max / 100,
            inputStep: 1
        };

        const {height, width} = this.cropper.getContainerData();
        const cropperHeight = height - (height * 0.08);
        this.cropper.setCropBoxData({
            height: cropperHeight,
            top: (height * 0.08) / 2,
            left: (width / 2) - (cropperHeight / 2)
        });
        this.setState({ zoom: defaultZoom });
    };

    componentDidMount() {
        const { file } = this.props;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.setState({ src: reader.result });
        };
    }

    cropImage = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        this.setState({
            cropResult: this.cropper.getCroppedCanvas().toDataURL(),
        }, () => {
            this.handleCropImage();
        });
    };

    dataURLtoBlob = (dataUrl) => {
        let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    blobToFile = (blob) => {
        return new File([blob], 'image');
    };

    handleCropImage = () => {
        const img = this.state.cropResult;
        const blob = this.dataURLtoBlob(img);
        const croppedImage = this.blobToFile(blob);
        this.props.onCrop(croppedImage);
    };

    render() {
        let className = 'crazy-cropper ';
        className += this.types[this.props.type] || this.types.default;
        // let previewStyles= {
        //     display: 'none'
        // };

        return (
            <RecruiterCrazyModal
                size='md'
                show={this.props.status}
                className={className}
                manageUiFix={this.props.manageUiFix}
            >
                <div style={{ width: '100%', position: 'relative' }}>
                    <Cropper
                        style={{ height: 400, width: '100%' }}
                        aspectRatio={this.props.ratio}
                        guides={false}
                        src={this.state.src}
                        ref={cropper => { this.cropper = cropper; }}
                        dragMode='move'
                        cropBoxResizable={false}
                        className='crazy-cropper-container'
                        zoomOnWheel={false}
                        ready={this.onCropMount}
                        cropmove={this.onMove}
                        zoom={this.onZoom}
                        highlight
                        preview='#fake-preview'
                    />
                    {/*<div className='preview-image' style={this.state.previewStyles} />*/}
                </div>
                <div>
                    <div className='cropper-bottom-box'>
                        <section className='actions-container'>
                            <section className='zoom-container'>
                                <CrazyIcon
                                    onClick={() => this.manageZoom('out')}
                                    className='zoom-button zoom-out'
                                    icon='icon-minus'
                                />
                                <CrazySlider
                                    value={(this.state.zoom * 100) / this.zoomData.maxZoom}
                                    min={1}
                                    max={100}
                                    step='1'
                                    onChange={(event) => {this.manageZoom(null, event);}}
                                />
                                <CrazyIcon
                                    onClick={() => this.manageZoom('in')}
                                    className='zoom-button zoom-in'
                                    icon='icon-plus-thin'
                                />
                            </section>
                            <section className='other-actions-container'>
                                <CrazyIcon className='action-icon' onClick={this.manageRotate} icon='icon-rotate' />
                            </section>
                        </section>
                        <section className='button-container'>
                            <CrazyButton inverse action={this.props.onCancelCrop} text='Cancel' size='ceci' />
                            <CrazyButton action={this.cropImage} text='Use' size='ceci' />
                        </section>
                    </div>
                </div>
                {/*<div id='fake-preview' />*/}
            </RecruiterCrazyModal>
        );
    }
    static defaultProps = {
        ratio: 1,
        type: 'default'
    }
}