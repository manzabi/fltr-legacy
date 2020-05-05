import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { manageErrorMessage, getFileExtension } from '../../common/utils';

const fileTypes = {
    image: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*'
};

export default class File extends Component {
    state = {
        fileName: null
    }
    handleChange = (event) => {
        event.persist();
        const { files } = event.target;
        if (files && files[0]) {
            this.setState({
                fileName: files[0].name
            }, () => {
                if (files[files.length - 1].size > this.props.maxSize) {
                    manageErrorMessage('ImageUpload', 'The file size is too big.');
                } else if (fileTypes[this.props.type] && !fileTypes[this.props.type].includes(getFileExtension(files[files.length - 1].name).toLowerCase())) {
                    manageErrorMessage('ImageUpload', `The file type must be: ${this.props.type}.`);
                } else {
                    this.props.onChange(event);
                }
            });
        } else {
            if (files && files[files.length - 1].size > this.props.maxSize) {
                manageErrorMessage('ImageUpload', 'The file size is too big.');
            } else {
                this.props.onChange(event);
            }
        }

    };
    render() {
        const { id, type, label } = this.props;
        const inputParams = {
            onChange: this.handleChange,
            id,
            type: 'file',
            accept: fileTypes[type] || undefined
        };


        return (
            <div className='crazy-input-group'>
                <input
                    {...inputParams}
                />
                <label htmlFor={id} className='input-overlay'>
                    <span className='file-input-label' htmlFor={id}>{this.state.fileName || label}</span>
                </label>
            </div>
        );
    }
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        id: PropTypes.string,
        type: PropTypes.string,
        label: PropTypes.string,
        maxSize: PropTypes.number
    };

    static defaultProps = {
        label: 'sample label',
        maxSize: 200000000
    };
}