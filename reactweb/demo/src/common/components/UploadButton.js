import React, { Component } from 'react';
import CrazyCropper from '../../fltr/template/CrazyCropper';

export default class UploadButton extends Component {
    state = {
        tempImage: ''
    };

    onChange = (event) => {
        const file = event.target.files[0];
        if (this.props.crop) {
            this.setState({ tempImage: file, cropStatus: true });
        } else if (this.props.onCrop) {
            this.props.onCrop(file);
        }
    };

    onCancelCrop = () => {
        this.onCloseCrop();
    };

    onCloseCrop = () => {
        this.setState({ tempFile: '', cropStatus: false });
        if (this.props) {
            this.reset();
        }
    };

    reset = () => {
        const form = document.getElementById(this.props.id);
        form.reset();
    };

    onCrop = (newImage) => {
        this.props.onCrop(newImage);
        this.onCloseCrop();
    };

    forceClick = () => {
        document.getElementById(`${this.props.id}-input`).click();
    };

    render() {
        const type = this.constructor.types[this.props.type] || this.constructor.types.default;
        const newClassname = typeof this.props.label === 'string' ? 'default-upload-button-label' : 'upload-button-label';
        return (
            <form className='upload-button-component' id={this.props.id}>
                <input id={`${this.props.id}-input`} type='file' accept={type.accept} onChange={this.onChange} />
                <label htmlFor={`${this.props.id}-input`} className={newClassname}>
                    {this.props.label}
                </label>
                {this.props.crop && this.state.cropStatus &&
                    <CrazyCropper
                        onCrop={this.onCrop}
                        onCancelCrop={this.onCancelCrop}
                        file={this.state.tempImage}
                        status={this.state.cropStatus}
                        type={this.props.type}
                        ratio={type.ratio}
                        manageUiFix={this.props.manageUiFix}
                    />
                }
            </form>
        );
    }

    static defaultProps = {
        id: `upload-button-${Math.floor(Math.random() * 9999)}`,
        type: 'default',
        label: 'UPLOAD PHOTO',
        crop: false,
        manageUiFix: true
    };

    static types = {
        default: {
            ratio: 1,
            accept: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*'
        },
        profile: {
            ratio: 1,
            accept: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*'
        },
        cover: {
            ratio: 2,
            accept: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*'
        }
    }
}