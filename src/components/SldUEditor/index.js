import React, { PureComponent, Fragment } from 'react';
import {apiUrl} from '@/utils/sldconfig.js';

export default class SldUEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.initEditor();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.getContentFlag&&!this.props.getContentFlag){
      let con = UE.getEditor(nextProps.id).getContent();
      this.props.getEditorContent(con);
    }
  }

  componentWillUnmount() {
    UE.delEditor(this.props.id)
  }

  initEditor = () => {
    const {id,initEditorContent} = this.props;
    console.info();
    const ueEditor = UE.getEditor(id,{
      serverUrl: `${apiUrl}v3/oss/ueditor/upload?configPath=config.json`,
    });
    ueEditor.ready((editor)=>{
      if(!editor){
        UE.delEditor(id);
        this.initEditor();
      }else{
        if (initEditorContent) {
          UE.getEditor(id).setContent(initEditorContent);
        }
      }
    })
  }

  render() {
    const {id} = this.props
    return(
      <div id={id} name="content" type="text/plain"></div>
    )
  }
}
