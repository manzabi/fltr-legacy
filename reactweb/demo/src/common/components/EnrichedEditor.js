import React, { Component } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, SelectionState } from 'draft-js';
import DOMPurify from 'dompurify';

import * as richEditorConstants from '../../constants/richEditor';
import { uploadImageSync } from '../../redux/actions/uploadActions';


/**
 * @param placeholder: PropTypes.string.isRequired,
 * @param textareaId: PropTypes.string.isRequired,
 * @param onChange: PropTypes.func.isRequired, 
 * @param value: PropTypes.string,
 * @param focusElement: PropTypes.func,
 * @param onBlur Function to be executed when the editor looses the focus
 * @param update: PropTypes.bool,
 * @param className: PropTypes.string
 * @param maxLength: PropTypes.number
 */
export default class EnrichedEditor extends Component {
    constructor(props) {
        super(props);
        const contentBlock = htmlToDraft(props.value);
        let editorState = EditorState.createEmpty();
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
        }
        this.state = {
            editorState: editorState,
            paste: false
        };
    }

    // componentDidMount () {
    //     window.addEventListener("keydown", this.handleKeyDown, true);
    // }

    // handleKeyDown = (event) => {
    //     console.log(event)
    // }

    // moveSelectionToEnd = (editorState) => {
    //     const content = editorState.getCurrentContent();
    //     const blockMap = content.getBlockMap();

    //     const key = blockMap.last().getKey();
    //     const length = blockMap.last().getLength();

    //     const selection = new SelectionState({
    //       anchorKey: key,
    //       anchorOffset: length,
    //       focusKey: key,
    //       focusOffset: length,
    //     });
    //     console.log(selection)

    //     return EditorState.forceSelection(editorState, selection);       
    //   };

    componentWillReceiveProps(nextProps) {
        if (this.props.update) {
            const newContent = nextProps.value;
            const contentBlock = htmlToDraft(newContent);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorStateNew = EditorState.createWithContent(contentState);

            this.setState({
                editorState: editorStateNew,
                paste: false
            });
        }
    }
    onEditorStateChange = (editorState) => {
        let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        if (this.state.paste) {
            // during paste, clean content pasted
            content = DOMPurify.sanitize(content, { ALLOWED_TAGS: richEditorConstants.ALLOWED_TAGS, FORBID_ATTR: richEditorConstants.FORBID_ATTR });

            const contentBlock = htmlToDraft(content);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorStateNew = EditorState.createWithContent(contentState);

            this.setState({
                editorState: editorStateNew,
                paste: false
            });
        } else {
            this.setState({
                editorState: editorState
            });
        }

        if (this.props.onChange !== undefined) {
            this.props.onChange({ content, id: this.props.textareaId });
        }
    };

    uploadImageCallBack = (file) => {
        const uploadType = 3;
        return uploadImageSync(uploadType, file);
    }

    onFocus = () => {
        $(`#${this.props.textareaId}`).addClass('demo-editor-onFocus');
    }

    onBlur = () => {
        $(`#${this.props.textareaId}`).removeClass('demo-editor-onFocus');
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }

    handlePastedText(text, html) {
        this.setState({
            paste: true,
        });
    }

    // handleKeyDown = (event) => {
    //     console.log(event.keyCode)
    // }

    handleFocus = (e) => {
        e.stopPropagation();
        e.preventDefault();
        // console.log(e.keyCode)
        // const newState = this.moveSelectionToEnd(this.state.editorState);
        // this.setState({
        //     editorState: newState
        // })
        const event = {
            target: {
                id: this.props.textareaId
            }
        };
        if (this.props.focusElement) {
            this.props.focusElement(event);
        }
    }

    render() {
        const editorState = this.state.editorState;
        return (
            <div className={this.props.className || ''} onKeyDown={this.handleKeyDown} onClick={this.handleFocus} >
                <Editor
                    ref={(input) => { this.editor = input; }}
                    editorState={editorState}
                    placeholder={this.props.placeholder}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    id={this.props.textareaId}
                    onFocus={this.handleFocus}
                    onBlur={this.onBlur}
                    onEditorStateChange={this.onEditorStateChange.bind(this)}
                    handlePastedText={this.handlePastedText.bind(this)}
                    toolbar={{
                        options: ['image', 'inline', 'textAlign', 'list', 'link', 'remove', 'blockType'],
                        inline: {
                            inDropdown: false,
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                        },
                        list: {
                            inDropdown: false,
                            options: ['unordered', 'ordered'],
                        },
                        textAlign: { inDropdown: true },
                        link: {
                            inDropdown: false,
                            options: ['link'],
                            showOpenOptionOnHover: false,
                            defaultTargetOption: '_blank',
                        },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, previewImage: true, alt: { present: false, mandatory: false }, urlEnabled: false, alignmentEnabled: false },
                        blockType: {
                            inDropdown: false,
                            options: ['Code'],
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                        }
                    }}
                >
                </Editor>
                <textarea
                    style={{ display: 'none' }}
                    id={this.props.textareaId}
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div>
        );
    }

    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        textareaId: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        focusElement: PropTypes.func,
        update: PropTypes.bool,
        className: PropTypes.string,
        maxLength: PropTypes.number,
        onBlur: PropTypes.func
    };

    static defaultProps = {
        value: '',
        update: false,
        className: ''
    };

}
