/*
* 表格编辑-两列结构
* */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form, Select, Icon, Button, Input, Table, Upload, InputNumber, Switch, Radio, Checkbox, Popconfirm,
} from 'antd';
import global from '../../global.less';
import {
  sldTsvgBotText,
  getSldEmptyH,
  sldBeforeUpload,
  sldComLanguage,
  getLocalStorageStingVal,
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import styles from '@/pages/decorate/pc/pcdecorate.less';
import SldPreviewImg from '../SldPreviewImg/SldPreviewImg';
import { Scrollbars } from 'react-custom-scrollbars';
import index from './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

let sthis = '';
@connect(({ product, global }) => ({
  product, global,
}))
@Form.create()
export default class SldTableEdit extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    this.state = {
      source: '',//来源，主要处理特殊数据用
      selectedRowKeys: [],
      cur_data: {},//当前
      data: props.data,//表格数据
      preview_img: '',//预览的图片
      preview_alt_con: '', //预览图片的title，鼠标悬浮展示的内容
      show_preview_modal: false,//预览图片modal 是否展示
      rule_data: [],
      columns: [{
        align: 'right',
        width: 200,
        dataIndex: 'label',
        render: (text, record) => {
          return <div>
            <span className={styles.table_left_con}>{text}</span>
            {record.rules != undefined && record.rules[0] != undefined && record.rules[0].required &&
            <span className={styles.table_left_require}>*</span>
            }
          </div>;
        },
      }, {
        align: 'left',
        width: 700,
        dataIndex: 'name',
        render: (text, record) => {
          let content = '';
          if (record.type == 'img') {
            content = <div className={styles.modal_img}>
              <div className={styles.adv_01_img_thumb} style={{
                width: this.state.img_width * 0.5 > 800 ? 800 : this.state.img_width * 0.5,
                height: this.state.img_height == 0 ? 'auto' : (this.state.img_width * 0.5 > 800 ? (800 * this.state.img_height / this.state.img_width) : this.state.img_height * 0.5),
              }}>
                {record.value != ''
                  ? <img className={styles.adv_01_img} src={record.value}/>
                  : sldTsvgBotText('kehubiaoqian', '', 0, '', '', '#999', 30, 30, '#999')
                }
              </div>
              <span
								className={styles.modal_tip_color}>{sldComLanguage('此处对应上传上方选中标签项内容，要求宽度为')}{this.state.img_width}{sldComLanguage('像素、高度')}{this.state.img_height == 0 ? `${sldComLanguage('不限制')}` : this.state.img_height + `${sldComLanguage('像素')}`}{sldComLanguage('的图片；支持格式gif，jpg，png。')}</span>
              <Upload
                withCredentials={true}
                beforeUpload={sldBeforeUpload}
                accept={'.gif, .jpeg, .png,.jpg,'}
                showUploadList={false}
                name={'file'}
                action={`${apiUrl}v3/oss/common/upload?source=setting`}
                onChange={(info) => this.setImg(info)}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                }}
              >
                <Button>
                  <Icon type="upload"/> {sldComLanguage('上传图片')}
                </Button>
              </Upload>
            </div>;
          }
          if (record.type == 'upload_img_upload') {
            //单独的上传组件，带预览功能
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
              disabled={record.disabled != undefined ? record.disabled : false}
            >
              <Upload
                withCredentials={true}
                beforeUpload={sldBeforeUpload}
                accept={'.gif, .jpeg, .png,.jpg,'}
                name={record.upload_name}
                action={record.upload_url}
                listType="picture-card"
                fileList={record.fileList}
                onPreview={this.viewImg}
                onChange={(info) => this.uploadChange(info, record.name)}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                }}
              >
                {record.fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </FormItem>;
          } else if (record.type == 'input') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, { initialValue: record.initialValue, rules: record.rules })(
                <Input
                  maxLength={record.maxLength!=undefined?record.maxLength:255}
                  disabled={record.disabled != undefined ? record.disabled : false}
                  style={{ width: 300 }}
                  placeholder={record.placeholder}/>,
              )}
            </FormItem>;
          } else if (record.type == 'show_content') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              <span style={{ fontSize: 13, color: '#333' }}>{record.name}</span>
            </FormItem>;
          } else if (record.type == 'switch') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, {
                valuePropName: 'checked',
                initialValue: record.initialValue == 1?true:false,
              })(
                <Switch onChange={record.onChange!=undefined?record.onChange:null}/>,
              )}
            </FormItem>;
          } else if (record.type == 'textarea') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, { initialValue: record.initialValue, rules: record.rules })(
                <TextArea disabled={record.disabled != undefined ? record.disabled : false}
                          disabled={record.is_disable != undefined && record.is_disable ? true : false}
                          maxLength={record.maxLength!=undefined?record.maxLength:255}
                          style={{ minHeight: 32, width: 300 }} rows={4}
                          placeholder={record.placeholder}/>,
              )}
            </FormItem>;
          } else if (record.type == 'inputnum') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, { initialValue: record.initialValue, rules: record.rules })(
                <InputNumber
                  disabled={record.disabled != undefined ? record.disabled : false}
                  style={{ width: 300 }}
                  min={record.min != undefined ? record.min : 0}
                  max={record.max != undefined ? record.max : 99999999}
                  precision={record.precision != undefined ? record.precision : 0}
                  placeholder={record.placeholder}
                  onChange={record.onChange!=undefined?record.onChange:null}
                />,
              )}
            </FormItem>;
          } else if (record.type == 'single_checkbox') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, {
                valuePropName: 'checked',
                initialValue: record.initialValue,
                rules: record.rules,
              })(
                <Checkbox
                >
                  {record.check_con}
                </Checkbox>,
              )}
            </FormItem>;
          } else if (record.type == 'select') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, {
                initialValue: record.initialValue ? record.initialValue : (record.sel_data.length > 0 ? record.sel_data[0].key : undefined),
                rules: record.rules,
              })(
                <Select placeholder={record.placeholder}
                        style={{ width: '100%' }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {record.sel_data.map((itemss, indexss) => {
                    return <Option key={indexss}
                                   value={record.diy != undefined && record.diy ? itemss[record.sele_key] : itemss.key}>{record.diy != undefined && record.diy ? itemss[record.sele_name] : itemss.name}</Option>;
                  })}
                </Select>,
              )}
            </FormItem>;
          } else if (record.type == 'radio_select') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, {
                initialValue: record.initialValue ? record.initialValue : (record.sel_data.length > 0 ? record.sel_data[0].key : ''),
                rules: record.rules,
              })(
                <Radio.Group size={'small'} buttonStyle="solid"
                             onChange={(e) => this.radio_select(e, record)}>
                  {record.sel_data.map((val, key) => {
                    return <Radio.Button key={key} value={val.key}>{val.value}</Radio.Button>;
                  })}

                </Radio.Group>,
              )}
            </FormItem>;
          } else if (record.type == 'radio_single') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 300 }}
            >
              {getFieldDecorator(text, {
                initialValue: record.initialValue!=undefined&&record.initialValue!=null ? record.initialValue : '',
                rules: record.rules,
              })(
                <Radio.Group onChange={record.onChange}>
                  <div className={`${global.flex_row_start_center}`} style={{marginTop:7}}>
                  {record.sel_data.map((val, key) => {
                    return <Radio key={key} value={val.key}>{val.value}</Radio>;
                  })}
                  </div>
                </Radio.Group>
              )}
            </FormItem>;
          } else if (record.type == 'more_checkbox') {
            content = <FormItem
              extra={record.extra}
              style={{ width: 700,paddingLeft:10 }}
            >
              {getFieldDecorator(text, { initialValue: record.initialValue, rules: record.rules })(
                <Checkbox.Group size={'small'} buttonStyle="solid"
                                onChange={(e) => this.more_checkbox_select(e, record)}>
                  {record.data.map((val) => {
                    return <div style={{ width: 150,paddingTop:3,paddingBottom:3, display: 'inline-block' }}><Checkbox key={val.key} style={{}}
                                                                                          value={val.key}>{val.val}</Checkbox>
                    </div>;
                  })}
                </Checkbox.Group>,
              )}
            </FormItem>;
          } else if (record.type == 'button') {
            content = this.props.btn_fixed_bottom == undefined ? <Fragment>
                {this.props.needTipFlag!=undefined&&this.props.needTipFlag
                  ?<Popconfirm
                    placement={'leftBottom'}
                    title={this.props.tip.title}
                    onConfirm={()=>this.handleConfirm()}
                    onCancel={this.props.tip!=undefined&&this.props.tip.cancle!=undefined?this.props.tip.cancle:null}
                    okText={'确定'}
                    cancelText={'取消'}>
                    <a className={index.save_btn} href="javascript:void(0)">保&nbsp;存</a>
                  </Popconfirm>
                  :<a className={index.save_btn} href="javascript:void(0)" onClick={this.sldConfirm}>保&nbsp;存</a>
                }
                {this.props.showOtherBtn != undefined &&
                <Button style={{ marginLeft: 8,}} loading={this.props.submiting_sec}
                        onClick={this.otherBtnClick}>
                  {this.props.showOtherBtn.text}
                </Button>
                }
              </Fragment>
              : null;
          } else if (record.type == 'input_more') {
            content = <div>
              <div className={styles.more_row_wrap}>
                <div style={{ width: '70%' }}>
                  {record.initialValue && record.initialValue.map((el, index) => {
                    return <div className={styles.more_row}>
                      <Input maxLength={250} defaultValue={el.amount} className={styles.more_input} data-index={index}
                             onChange={(e) => this.changeMoreInput(e, index, el.employeeId, el.employeeName)}/>
                      <Select className={styles.more_select} placeholder={sldComLanguage('请选择')} defaultValue={el.employeeId}
                              onChange={(e) => this.changeMoreSelect(e, el.amount)}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {record.sel_data.map((itemss, indexs) => {
                          return <Option
                            value={record.diy != undefined && record.diy ? itemss[record.sele_key] : itemss.key}
                            data-index={index}
                            data-name={record.diy != undefined && record.diy ? itemss[record.sele_name] : itemss.name}
                            key={indexs}>{record.diy != undefined && record.diy ? itemss[record.sele_name] : itemss.name}</Option>;
                        })}
                      </Select>
                    </div>;
                  })}
                </div>

                <Button type='primary' onClick={() => this.addRule(record)} style={{ marginBottom: '10px' }}>{sldComLanguage('添加')}</Button>
              </div>
              <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{sldComLanguage('请设置')}</p>

            </div>;


          }

          return content;
        },
      }],
    };
  }

  first_flag = false;

  componentDidMount() {
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.resetFlag!=undefined&&nextProps.resetFlag!=this.props.resetFlag){
      this.props.form.resetFields();
    }
    this.setState({ data: nextProps.data });
  }

  addRule = (record) => {
    if (record.callback) {
      record.callback();
    }
    let { columns } = this.state;
    this.setState({
      columns,
    });
  };

  changeMoreInput = (e, id, defaultEmployeeId, defaultEmployeeName) => {
    let data_index = event.target.getAttribute('data-index');
    let value = e.target.value;
    let { rule_data } = this.state;

    let index = -1;
    for (let i = 0; i < rule_data.length; i++) {
      let el = rule_data[i];
      if (el.data_index == id) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      rule_data[index].amount = value;
    } else {
      rule_data.push({
        amount: value,
        employeeId: defaultEmployeeId,
        employeeName: defaultEmployeeName,
        data_index: id,
      });
    }
    this.setState({
      rule_data: rule_data,
    });
  };

  changeMoreSelect = (e, defaultAmount) => {
    let data_index = event.target.getAttribute('data-index');
    let data_name = event.target.getAttribute('data-name');

    let { rule_data } = this.state;

    let index = -1;
    for (let i = 0; i < rule_data.length; i++) {
      let el = rule_data[i];
      if (el.data_index == data_index) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      rule_data[index].employeeId = e;
      rule_data[index].employeeName = data_name;
    } else {
      rule_data.push({
        amount: defaultAmount,
        employeeId: e,
        employeeName: data_name,
        data_index: data_index,
      });
    }
    this.setState({
      rule_data: rule_data,
    });
  };

  //预览图片
  viewImg = (file) => {
    this.setState({
      preview_img: file.url || file.thumbUrl,
      show_preview_modal: true,
    });
  };

  //关闭预览图片
  closeViewModal = () => {
    this.setState({
      show_preview_modal: false,
    });
  };

  uploadChange = (info, name) => {
    let { data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in data) {
        if (data[i].name == name) {
          data[i].fileList = info.fileList;
          data[i].img_succ_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
        }
      }
    }
    this.setState({ data });
  };

  radio_select = (e, item) => {
    if (item.callback) {
      item.callback(e);
    }
  };
  more_checkbox_select = (e, item) => {
    if (item.callback) {
      item.callback(e);
    }
  };

  handleConfirm = () => {
    if(this.props.tip!=undefined&&this.props.tip.confirm!=undefined){
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.tip.confirm(values);
        }
      });
    }
  }

  //确定事件
  sldConfirm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.need_data != undefined && this.props.need_data) {
          this.props.handleSubmit(values, this.state.data);
        } else {
          this.props.handleSubmit(values);
        }
      }
    });
  };

  otherBtnClick = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.showOtherBtn.callback(values);
    });
  };

  //上传图片
  setImg = (info) => {
    let { data } = this.state;
    let img_data = info.file.response;
    if (info.file.status != undefined && info.file.status != 'error') {
      if (img_data.state == 200) {
        data.map(item => {
          if (item.key == 'img') {
            item.value = img_data.data.url;
            item.imgPath = img_data.data.path;
          }
        });
      }
    }

    this.setState({ data });
  };

  render() {
    const { columns, data, preview_img, show_preview_modal, modal_width, preview_alt_con } = this.state;
    const { scroll_h } = this.props;
    return <Fragment>
      <Scrollbars
        autoHeight
        autoHeightMin={50}
        autoHeightMax={scroll_h != undefined ? document.body.clientHeight - scroll_h : document.body.clientHeight - 170}>
        <Form
          layout="horizontal"
        >
          <Table
            showHeader={false}
            columns={columns}
            dataSource={data}
            rowKey={record => record.name}
            bordered
            pagination={false}
          />
        </Form>
        {getSldEmptyH(this.props.bottom_empty!=undefined&&this.props.bottom_empty?this.props.bottom_empty:0)}
      </Scrollbars>
      {this.props.btn_fixed_bottom != undefined && this.props.btn_fixed_bottom &&
      <Fragment>
        {getSldEmptyH(50)}
        <div className={global.m_diy_bottom_wrap}
             style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
          <Button className={global.btn_fixed_bottom} key="submit" style={{
            width: 80, height: 32, borderRadius: 3,
          }}
                  type="primary" loading={this.props.submiting}
                  onClick={this.sldConfirm}>
            {sldComLanguage('保存')}
          </Button>
        </div>

      </Fragment>
      }
      {/*图片预览-start*/}
      <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={modal_width}
                     preview_alt_con={preview_alt_con} closePreviewModal={() => this.closeViewModal()}/>
      {/*图片预览-end*/}
    </Fragment>;
  }
}


