import React from 'react';
import { connect } from 'react-redux';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import DOMPurify from 'dompurify';

import {uploadImageSync} from '../../../redux/actions/uploadActions';

import * as richEditorConstants from '../../../constants/richEditor';

@connect((state) => state)
export default class ChallengeEditor extends React.Component{
    constructor(props) {
        super(props);
        // console.log('value : ' + props.value);
        // console.log('asd content : ' + JSON.stringify(contentBlock));
        // console.log(contentBlock)
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

    onEditorStateChange (editorState){
        // console.log('editoStateChange');
        let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        if (this.state.paste){
            // during paste, clean content pasted
            content = DOMPurify.sanitize(content, {ALLOWED_TAGS: richEditorConstants.ALLOWED_TAGS, FORBID_ATTR: richEditorConstants.FORBID_ATTR});

            const contentBlock = htmlToDraft(content);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorStateNew = EditorState.createWithContent(contentState);

            this.setState({
                editorState : editorStateNew,
                paste : false
            });
        } else {
            this.setState({
                editorState : editorState
            });
        }

        if (this.props.onChange !== undefined){
            // console.log('onChange with content : ' + content);
            this.props.onChange(content);
        }
        // console.log('editoStateChange end');
    }

    uploadImageCallBack(file) {
        const uploadType = 3;
        return uploadImageSync(uploadType, file);

        // return new Promise(
        //     (resolve, reject) => {
        //         const xhr = new XMLHttpRequest();
        //         xhr.open('POST', 'https://api.imgur.com/3/image');
        //         xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        //         const data = new FormData();
        //         data.append('image', file);
        //         xhr.send(data);
        //         xhr.addEventListener('load', () => {
        //             const response = JSON.parse(xhr.responseText);
        //             resolve(response);
        //         });
        //         xhr.addEventListener('error', () => {
        //             const error = JSON.parse(xhr.responseText);
        //             reject(error);
        //         });
        //     }
        // );
    }

    onFocus(){
        // console.log('onFocus');
        $('.demo-editor').addClass('demo-editor-onFocus');
    }

    onBlur(){
        // console.log('onBlur');
        $('.demo-editor').removeClass('demo-editor-onFocus');
    }

    handlePastedText(text, html){

        this.setState({
            paste : true,
        });

    }

    render(){
        const editorState = this.state.editorState;
        // console.log("editorState : " + editorState);

        return(
            <div className="challengeEditor">
                <Editor
                    editorState={editorState}
                    placeholder={this.props.placeholder}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onFocus={() => this.onFocus()}
                    onBlur={() => this.onBlur()}
                    onEditorStateChange={this.onEditorStateChange.bind(this)}
                    handlePastedText={this.handlePastedText.bind(this)}
                    toolbar={{
                        options: ['image', 'inline', 'textAlign', 'list', 'link', 'remove', 'blockType'],
                        inline: {   inDropdown: false,
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                        },
                        list: {     inDropdown: false,
                            options: ['unordered', 'ordered'],
                        },
                        textAlign: { inDropdown: true },
                        link: {     inDropdown: false,
                            options: ['link'],
                            showOpenOptionOnHover: false,
                            defaultTargetOption: '_blank',
                        },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: false, mandatory: false }, previewImage: true, urlEnabled: false, alignmentEnabled: false, defaultSize: {width: '100%'} },
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
                    style={{display:'none'}}
                    id={this.props.textareaId}
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div>
        );
    }


}
/*
        const toolbar = {
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
            inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                bold: { icon: bold, className: undefined },
                italic: { icon: italic, className: undefined },
                underline: { icon: underline, className: undefined },
                strikethrough: { icon: strikethrough, className: undefined },
                monospace: { icon: monospace, className: undefined },
                superscript: { icon: superscript, className: undefined },
                subscript: { icon: subscript, className: undefined },
            },
            blockType: {
                inDropdown: true,
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
            },
            fontSize: {
                icon: fontSize,
                options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
            },
            fontFamily: {
                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
            },
            list: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['unordered', 'ordered', 'indent', 'outdent'],
                unordered: { icon: unordered, className: undefined },
                ordered: { icon: ordered, className: undefined },
                indent: { icon: indent, className: undefined },
                outdent: { icon: outdent, className: undefined },
            },
            textAlign: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['left', 'center', 'right', 'justify'],
                left: { icon: left, className: undefined },
                center: { icon: center, className: undefined },
                right: { icon: right, className: undefined },
                justify: { icon: justify, className: undefined },
            },
            colorPicker: {
                icon: color,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                    'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                    'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                    'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                    'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                    'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
            },
            link: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                dropdownClassName: undefined,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_self',
                options: ['link', 'unlink'],
                link: { icon: link, className: undefined },
                unlink: { icon: unlink, className: undefined },
            },
            emoji: {
                icon: emoji,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                emojis: [
                    '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                    '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                    '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                    '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                    '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                    '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                    '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                    '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                    '✅', '❎', '💯',
                ],
            },
            embedded: {
                icon: embedded,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                defaultSize: {
                    height: 'auto',
                    width: 'auto',
                },
            },
            image: {
                icon: image,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
                uploadCallback: undefined,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: false, mandatory: false },
                defaultSize: {
                    height: 'auto',
                    width: 'auto',
                },
            },
            remove: { icon: eraser, className: undefined, component: undefined },
            history: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['undo', 'redo'],
                undo: { icon: undo, className: undefined },
                redo: { icon: redo, className: undefined },
            },
        };











        toolbar={{
                        options: ['inline', 'textAlign', 'list', 'link', 'remove'],
                        inline: {   inDropdown: false,
                                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                                },
                        list: {     inDropdown: false,
                                    options: ['unordered', 'ordered'],
                        },
                        textAlign: { inDropdown: true },
                        link: {     inDropdown: false,
                                    options: ['link'],
                                    showOpenOptionOnHover: false,
                                    defaultTargetOption: '_blank',
                        },
                        history: { inDropdown: true },
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
        */
