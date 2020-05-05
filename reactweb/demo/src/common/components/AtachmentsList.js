import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { getFileIcon } from '../../common/utils';

/**
 * @param files: PropTypes.array.isRequired,
 * @param   handleRemove: PropTypes.func
 */
export default class AttachmentList extends Component {

    printFilename = (filename) => {
        const extension = filename.split('.').pop();
        const rawFilename = filename.split('.')[0];
        let finalName;
        if (rawFilename.length > 20) {
            const nameStart = rawFilename.slice(0, 15);
            const nameEnd = rawFilename.slice(rawFilename.length - 5);
            finalName = `${nameStart}...${nameEnd}.${extension}`;
        } else {
            finalName = `${rawFilename}.${extension}`;
        }
        return finalName;
    };

    render () {
        const {files} = this.props;
        return (
            <div>
                <div className="sectionInternal" id="attachmentPreview" style={{fontSize: '1.5em'}}>
                    <h3 className='section-title'>
                        <i className="icon-entypo-attachment" />
                         &nbsp;Attachment{files.length > 1 ? 's' : ''}
                    </h3>
                </div>
                <div className='attachment-list'>
                    <ul>
                        {files.map((file) => (
                            <li className='attachment-detail' key={file.id}>
                                <i className={`${getFileIcon(file.originalFileName)} attachment-icon`} />
                                <a href={file.url} target='_BLANK'><h4>{this.printFilename(file.originalFileName)}</h4></a>
                                <a href={file.url} download target='_BLANK'><i className='icon-entypo-download' /></a>
                                { this.props.handleRemove &&
                                    <a onClick={this.props.handleRemove} id={file.id} ><i id={file.id} className='fas fa-trash-alt'/></a>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

AttachmentList.PropTypes = {
    files: PropTypes.array.isRequired,
    handleRemove: PropTypes.func
};

AttachmentList.defaultProps = {
    handleRemove: null 
};