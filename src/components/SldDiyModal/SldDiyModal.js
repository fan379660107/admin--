import React, { Component, Fragment } from 'react';
import { Form, Button, Modal, Table, } from 'antd';
import global from '../../global.less';
import { showMoreModalHelpTip,sldComLanguage, } from '@/utils/utils';

@Form.create()
export default class SldDiyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColorPicker: false,//是否展示颜色选择器
      rowId: '',//选中行的id
      selectedRowKeys: [],
    };
  }

  componentDidMount() {

  }


  //颜色选择器展示事件
  showColorPicker = () => {
    this.setState({
      showColorPicker: !this.state.showColorPicker,
    });
  };

  //确定事件
  sldConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.sldHandleConfirm(values);
      }
    });
  };

  //取消事件-清空表单
  sldCancle = () => {
    this.props.form.resetFields();
    this.props.sldHandleCancle();
  };



  //多选事件
  sldCheckShop = (items, value) => {
    if (items.sldCheckShop) {
      items.sldCheckShop(value);
    }
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { title, modalVisible, content, submiting, zIndex, show_foot,modal_tip ,columns} = this.props;
    return <Modal
      title={title}
      zIndex={zIndex}
      afterClose={this.closeReset}
      width={this.props.width ? this.props.width : 416}
      visible={modalVisible}
      onOk={this.sldConfirm}
      onCancel={this.sldCancle}
      footer={show_foot != undefined && !show_foot ? null : [
        <Button key="back" onClick={this.sldCancle}>{sldComLanguage('取消')}</Button>,
        <Button key="submit" type="primary" loading={submiting} onClick={this.sldConfirm}>
          {sldComLanguage('确定')}
        </Button>,
      ]}
    >
      <Form
        layout="horizontal"
      >.......
      <div>{showMoreModalHelpTip(modal_tip)}</div>
      <Table
        showHeader={false}
        columns={columns}
        dataSource={content}
        bordered
        pagination={false}
      />
      </Form>
    </Modal>;
  }
}


