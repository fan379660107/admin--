import React, {Component, Fragment} from 'react';
import {Modal,} from 'antd';

export default class SldPreviewImgMore extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  //slodon_预览关闭modal
  handleModalVisible = () => {
    this.props.closePreviewModal();
  }

  render(){
    const {img, modal_width, preview_alt_con, show_preview_modal} = this.props;
    return <Modal style={{textAlign: 'center', width: modal_width}} visible={show_preview_modal} footer={null}
                  onCancel={this.handleModalVisible}>
      {img.map((item,index)=>{
        return <img key={index} alt={preview_alt_con} style={{maxWidth: '100%', maxHeight: '100%'}} src={item}/>
      })}
    </Modal>;
  }
}


