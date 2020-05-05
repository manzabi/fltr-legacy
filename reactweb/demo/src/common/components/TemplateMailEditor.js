import React, { Component } from 'react';

import EmailEditor from 'react-email-editor';
import { Grid, Col } from '../../layout/FluttrGrid';
const sampleJson = [
    '{"counters":{"u_column":3,"u_row":2,"u_content_button":1,"u_content_divider":1,"u_content_image":1,"u_content_html":1},"body":{"rows":[{"cells":[1],"columns":[{"contents":[{"type":"button","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_button_1","htmlClassNames":"u_content_button"},"selectable":true,"draggable":true,"deletable":true,"href":"","buttonColors":{"color":"#FFFFFF","backgroundColor":"#3AAEE0","hoverColor":"#2A92BF"},"textAlign":"center","lineHeight":"120%","border":{},"borderRadius":"4px","padding":"10px 20px","text":"Button Text"}},{"type":"divider","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_divider_1","htmlClassNames":"u_content_divider"},"selectable":true,"draggable":true,"deletable":true,"width":"100%","border":{"borderTopWidth":"1px","borderTopStyle":"solid","borderTopColor":"#BBBBBB"},"textAlign":"center"}}],"values":{"_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}},{"cells":[1,1],"columns":[{"contents":[{"type":"image","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_image_1","htmlClassNames":"u_content_image"},"selectable":true,"draggable":true,"deletable":true,"src":{"url":"https://via.placeholder.com/500x100?text=IMAGE","width":500,"height":100},"fullWidth":false,"textAlign":"center","maxWidth":"100%","altText":"Image","action":{"url":"","target":""}}}],"values":{"_meta":{"htmlID":"u_column_2","htmlClassNames":"u_column"}}},{"contents":[{"type":"html","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_html_1","htmlClassNames":"u_content_html"},"selectable":true,"draggable":true,"deletable":true,"html":"<strong>Hello, world!</strong>"}}],"values":{"_meta":{"htmlID":"u_column_3","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_2","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}}],"values":{"backgroundColor":"#e7e7e7","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"contentWidth":"500px","fontFamily":{"label":"Arial","value":"arial,helvetica,sans-serif"},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}}}',
    '{"counters":{"u_column":12,"u_row":6,"u_content_button":1,"u_content_divider":3,"u_content_image":6,"u_content_html":2,"u_content_text":3},"body":{"rows":[{"cells":[1],"columns":[{"contents":[{"type":"button","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_button_1","htmlClassNames":"u_content_button"},"selectable":true,"draggable":true,"deletable":true,"href":"","buttonColors":{"color":"#FFFFFF","backgroundColor":"#3AAEE0","hoverColor":"#2A92BF"},"textAlign":"center","lineHeight":"120%","border":{},"borderRadius":"4px","padding":"10px 20px","text":"Button Text","calculatedWidth":110,"calculatedHeight":36}},{"type":"divider","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_divider_1","htmlClassNames":"u_content_divider"},"selectable":true,"draggable":true,"deletable":true,"width":"100%","border":{"borderTopWidth":"1px","borderTopStyle":"solid","borderTopColor":"#BBBBBB"},"textAlign":"center"}}],"values":{"_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}},{"cells":[1,1],"columns":[{"contents":[{"type":"image","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_image_1","htmlClassNames":"u_content_image"},"selectable":true,"draggable":true,"deletable":true,"src":{"url":"https://via.placeholder.com/500x100?text=IMAGE","width":500,"height":100},"fullWidth":false,"textAlign":"center","maxWidth":"100%","altText":"Image","action":{"url":"","target":""}}}],"values":{"_meta":{"htmlID":"u_column_2","htmlClassNames":"u_column"}}},{"contents":[{"type":"html","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_html_1","htmlClassNames":"u_content_html"},"selectable":true,"draggable":true,"deletable":true,"html":"<strong>Hello, world!</strong>"}}],"values":{"_meta":{"htmlID":"u_column_3","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_2","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}},{"cells":[1],"columns":[{"contents":[{"type":"divider","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_divider_3","htmlClassNames":"u_content_divider"},"selectable":true,"draggable":true,"deletable":true,"width":"100%","border":{"borderTopWidth":"1px","borderTopStyle":"solid","borderTopColor":"#BBBBBB"},"textAlign":"center"}}],"values":{"_meta":{"htmlID":"u_column_4","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_3","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}},{"cells":[1,2],"columns":[{"contents":[{"type":"image","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_image_5","htmlClassNames":"u_content_image"},"selectable":true,"draggable":true,"deletable":true,"src":{"url":"https://via.placeholder.com/500x100?text=IMAGE","width":500,"height":100},"fullWidth":false,"textAlign":"center","maxWidth":"100%","altText":"Image","action":{"url":"","target":""}}}],"values":{"_meta":{"htmlID":"u_column_9","htmlClassNames":"u_column"}}},{"contents":[{"type":"text","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_text_3","htmlClassNames":"u_content_text"},"selectable":true,"draggable":true,"deletable":true,"color":"#000","textAlign":"left","lineHeight":"140%","text":"This is a new Text block. Change the text."}}],"values":{"_meta":{"htmlID":"u_column_10","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_5","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}},{"cells":[2,1],"columns":[{"contents":[{"type":"text","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_text_2","htmlClassNames":"u_content_text"},"selectable":true,"draggable":true,"deletable":true,"color":"#000","textAlign":"left","lineHeight":"140%","text":"This is a new Text block. Change the text."}}],"values":{"_meta":{"htmlID":"u_column_11","htmlClassNames":"u_column"}}},{"contents":[{"type":"image","values":{"containerPadding":"10px","_meta":{"htmlID":"u_content_image_6","htmlClassNames":"u_content_image"},"selectable":true,"draggable":true,"deletable":true,"src":{"url":"https://via.placeholder.com/500x100?text=IMAGE","width":500,"height":100},"fullWidth":false,"textAlign":"center","maxWidth":"100%","altText":"Image","action":{"url":"","target":""}}}],"values":{"_meta":{"htmlID":"u_column_12","htmlClassNames":"u_column"}}}],"values":{"backgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"10px","columnsBackgroundColor":"","_meta":{"htmlID":"u_row_6","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"deletable":true}}],"values":{"backgroundColor":"#e7e7e7","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"contentWidth":"500px","fontFamily":{"label":"Arial","value":"arial,helvetica,sans-serif"},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}}}'
];
function getSampleJSON () {
    return JSON.parse(sampleJson[Math.floor(Math.random() * sampleJson.length)]);
}
export default class TemplateMailEditor extends Component {
    render() {
        return (
            <Grid>
                <Col xs='12' sm='11'>
                    <div style={{gridColumn: 'span 11'}}>
                        <h1>react-email-editor Demo</h1>

                        <div>
                            <button onClick={this.exportHtml}>Export HTML</button>
                            <button onClick={this.saveTemplate}>Save template</button>
                            <button onClick={this.loadTemplate}>Load template</button>
                        </div>

                        <EmailEditor
                            ref={editor => this.editor = editor}
                            projectId={1618}
                            // options={{
                            //     customJS: 
                            // }}
                        />
                    </div>
                </Col>
                <Col xs='12' sm='1'>
                    <h1 style={{gridColumn: 'span 1'}}>
                        Hola que ase
                    </h1>
                </Col>
            </Grid>
        );   
    }

  exportHtml = () => {
      this.editor.exportHtml(data => {
          const { design, html } = data;
          console.log('exportHtml', html);
      });
  }

  saveTemplate = () => {
      this.editor.saveDesign(data => {
          console.log('save json', JSON.stringify(data));
      });
  }

  loadTemplate = () => {
      this.editor.loadDesign(getSampleJSON());
  }
}