/*
* 标题+链接选择器_单选
* */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form, Select, Icon, Button, Input, Modal, Table, Upload, InputNumber, DatePicker, Switch, Radio,
} from 'antd';
import global from '../../global.less';
import {
	sldTsvgBotText,
	showMoreModalHelpTip,
	sldComLanguage,
	sldBeforeUpload,
  getLocalStorageStingVal,
  isEmptyObject
} from '@/utils/utils';
import { diy_link_type, pc_home_modaladv_sele_data } from '@/utils/util_data';
import { apiUrl } from '@/utils/sldconfig.js';
import styles from '@/pages/decorate/pc/pcdecorate.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

let sthis = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class SldDiyTitleLinkModal extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator }
    } = props;
    this.state = {
      source:'',
      link_type:'',
      img_width:150,
      img_height:150,
      sele_index:0,
      selectedRowKeys: [],
      cur_data:[],
      modal_tip:[],
      data:[{
          key:'link_type',
          name:`${sldComLanguage('操作')}`,
          value:'',
          type:'link_type',
        }
      ],//数据
      columns:[{
        align : 'right' ,
        width : 150 ,
        dataIndex : 'name' ,
        render:(text,record)=>{
          return <div>
            <span className={styles.table_left_con}>{text}</span>
            {record.required!=undefined&&record.required&&
            <span className={styles.table_left_require}>*</span>
            }
          </div>
        }
      } ,{
        align : 'left' ,
        dataIndex : 'type' ,
        render : ( text , record ) => {
          let content = '';
          if(record.type == 'input'){
            let limit = 250;
            if(this.props.extra!=undefined&&this.props.extra[record.key+'_limit']!=undefined&&this.props.extra[record.key+'_limit']){
              limit = this.props.extra[record.key+'_limit'];
            }
            content = <FormItem
              style={{ width: 300}}
            >
              {getFieldDecorator(record.key,{initialValue:record.value,rules:[{
                  required: record.required,
                  whitespace: true,
                  message: `${sldComLanguage('请输入')}`+record.name,
                }]})(
                <Input
                  maxLength={limit}
                  style={{ width: 300 }}
                  onChange={e => this.handleFieldChange(e, record.key,record.key,'input')}
                  placeholder={`${sldComLanguage('请输入')}`+record.name}/>
              )}
            </FormItem>
          }else if(record.type == 'img'){
            content = <div className={styles.modal_img}>
              <div className={styles.adv_01_img_thumb} style={{width:this.state.img_width*0.4>800?800:this.state.img_width*0.5,height:this.state.img_height==0?'auto':(this.state.img_width*0.5>800?(800*this.state.img_height/this.state.img_width):this.state.img_height*0.5)}}>
                {record.value!=''
                  ?<img className={styles.adv_01_img} src={record.value}/>
                  :sldTsvgBotText('kehubiaoqian','',0,'','','#999',30,30,'#999')
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
                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                onChange = {(info)=>this.setImg(info)}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                }}
              >
                <Button>
                  <Icon type="upload" /> {sldComLanguage('上传图片')}
                </Button>
              </Upload>
            </div>
          }else if(record.type == 'link_type'){
            content = <div>
              <Select
                value={record.value}
                style={{ width: 120 }}
                placeholder={`${sldComLanguage('请选择链接类型')}`}
                onSelect={this.sldHandSeleChange}
              >
                {diy_link_type().map((item,index)=>
                  <Option key={index} value={item.key}>{item.name}</Option>
                )}
              </Select>
            </div>
          }else if(record.type == 'url'){
            content = <FormItem
              style={{ width: 300}}
            >
              {getFieldDecorator(`link_type`,{initialValue:record.value,rules:[{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入链接地址')}`,
                }]})(
                <Input
                  maxLength={250}
                  style={{ width: 300 }}
                  onChange={e => this.handleFieldChange(e, 'url','link_value')}
                  placeholder={`${sldComLanguage('请输入链接地址')}`}/>
              )}
            </FormItem>
          }else if(record.type == 'keyword'){
            content = <FormItem
              style={{ width: 300}}
            >
              {getFieldDecorator(`keyword`,{initialValue:record.value,rules:[{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入关键字')}`,
                }]})(
                <Input
                  maxLength={250}
                  style={{ width: 300 }}
                  onChange={e => this.handleFieldChange(e, 'keyword','link_value')}
                  placeholder={`${sldComLanguage('请输入关键字')}`}/>
              )}
            </FormItem>
          }else if(record.type == 'goods'){
            content = <div>
              <span>{record.value}</span>
            </div>
          }else if(record.type == 'category'){
            content = <div>
              <span>{record.value}</span>
            </div>
          }else if(record.type == 'topic'){
            content = <div>
              <span>{record.value}</span>
            </div>
          }
          if(this.state.source!=undefined){
            //首页开屏图数据处理
            if(this.state.source == 'home_modal_adv') {
              if(record.type == 'home_modal_adv_switch'){
                //弹出广告开关
                content = <FormItem
                  style={{ width: 300}}
                >
                  {getFieldDecorator(`${record.type}`,{valuePropName: 'checked',initialValue:record.value})(
                    <Switch/>,
                  )}
                </FormItem>
              }else if(record.type == 'home_modal_adv_radio'){
                //弹出方式
                content = <FormItem
                  style={{ width: 300}}
                >
                  {getFieldDecorator(`${record.type}`,{valuePropName: 'checked',initialValue:record.value})(
                    <RadioGroup options={pc_home_modaladv_sele_data}  defaultValue={record.value}/>
                  )}
                </FormItem>
              }
            }

            //首页轮播图数据处理
            if(this.state.source == 'home_flash'){
                if(record.type == 'home_flash_title'){
                  //标题
                  content = <FormItem
                    style={{ width: 300}}
                  >
                    {getFieldDecorator(`home_flash_title`,{initialValue:record.value,rules:[{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入标题')}`,
                      }]})(
                      <Input
                        maxLength={250}
                        style={{ width: 300 }}
                        onChange={e => this.handleFieldChange(e, 'home_flash_title','home_flash_title')}
                        placeholder={`${sldComLanguage('请输入标题')}`}/>
                    )}
                  </FormItem>
                }else if(record.type == 'home_flash_sort'){
                  //排序
                  content = <FormItem
                    style={{ width: 300}}
                  >
                    {getFieldDecorator(`home_flash_sort`,{initialValue:record.value,rules:[{
                        required: true,
                        message: `${sldComLanguage('请输入排序')}`,
                      }]})(
                      <InputNumber
                        min={0}
                        style={{ width: 300 }}
                        onChange={e => this.handleFieldChange(e, 'home_flash_sort','home_flash_sort','inputnum')}
                        placeholder={`${sldComLanguage('请输入排序')}`}/>
                    )}
                  </FormItem>
                }else if(record.type == 'home_flash_range_picker'){
                  //展示时间
                  content = <FormItem
                    style={{ width: 300}}
                  >
                    {getFieldDecorator(`home_flash_range_picker`,{initialValue:record.value,
                      // rules:[{
                      //   required: true,
                      //   whitespace: true,
                      //   message: "请选择展示时间",
                      // }]
                    })(
                      <RangePicker
                        style={{ width: 300}}
                        placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`,
                        ]}
                        onChange={e => this.handleFieldChange(e, 'home_flash_range_picker','home_flash_range_picker','range_picker')}
                        getCalendarContainer={(triggerNode)=>{
                          return triggerNode.parentNode
                        }}
                      />)}
                  </FormItem>
                }
              }
          }
          return content;
        },
      } ],
    };
  }

  first_flag = false;

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(!nextProps.modalVisible&&!this.props.modalVisible){
      //防止别的模板发生变化，影响数据报错
      return false;
    }
    if (!this.first_flag&&!isEmptyObject(nextProps.content)) {
      let ope_data = nextProps.content;

      let tmp_info = [];
      if(ope_data.title!=undefined){
        tmp_info.push({
          key: ope_data.title.name,
          name: ope_data.title.label,
          value: ope_data.title.initialValue,
          type: 'input',
          required:ope_data.title.required,
        });
      }
      if(ope_data.sub_title!=undefined){
          tmp_info.push({
            key: ope_data.sub_title.name,
            name: ope_data.sub_title.label,
            value: ope_data.sub_title.initialValue,
            type: 'input',
            required:ope_data.sub_title.required,
          });
      }
      tmp_info.push({
        key: 'link_type',
        name: `${sldComLanguage('操作')}`,
        value: ope_data.link_type,
        type: 'link_type',
      });
      if(ope_data.link_value!=undefined&&ope_data.link_value){
        let tmp_info_new = {
          key:'link_value',
          name:`${sldComLanguage('关键字')}`,
          value:ope_data.link_value,
          type:ope_data.link_type,
          info:ope_data.info!=undefined?ope_data.info:{},
          required:true,
        }
        if(ope_data.link_type == 'url'){
          tmp_info_new.name = `${sldComLanguage('链接地址')}`;
          tmp_info_new.required = true;
        }else if(ope_data.link_type == 'keyword'){
          tmp_info_new.name = `${sldComLanguage('关键字')}`;
          tmp_info_new.required = true;
        }else if(ope_data.link_type == 'goods'){
          tmp_info_new.name = `${sldComLanguage('商品名称')}`;
          tmp_info_new.required = false;
        }else if(ope_data.link_type == 'category'){
          tmp_info_new.name = `${sldComLanguage('分类名称')}`;
          tmp_info_new.required = false;
        }
        tmp_info.push(tmp_info_new);
      }
      this.setState({
        modal_tip:nextProps.modal_tip,
        data: tmp_info,
        img_width: nextProps.content.width,
        img_height: nextProps.content.height,
        source:nextProps.content.source!=undefined?nextProps.content.source:'',
      });
    }
  }

  //上传图片
  setImg = (info) => {
    let {data} = this.state;
    let img_data = info.file.response;
    if (info.file.status!=undefined&&info.file.status!='error') {
      if(img_data.state == 200){
        data.map(item=>{
          if(item.key == 'img'){
            item.value = img_data.data.url;
            item.imgPath = img_data.data.path;
          }
        })
      }
    }

    this.setState({data});
  }

  //操作类型选择事件
  sldHandSeleChange = (val) => {
    this.props.form.resetFields();
    let {data} = this.state;
    let cur_data = [];
    for(let i in data){
      if(data[i].key!='link_value'){
        if(data[i].key=='link_type'){
          data[i].value = val;
        }
        cur_data.push(data[i]);
      }
    }
    for(let i=0;i<cur_data.length;i++){
      if(cur_data[i].key == 'link_type'){
        if(val == 'url'){
          cur_data.splice(i+1,0,{
            key:'link_value',
            name:`${sldComLanguage('链接地址')}`,
            value:'',
            type:'url',
            required:true,
          });
        }else if(val == 'keyword'){
          cur_data.splice(i+1,0,{
            key:'link_value',
            name:`${sldComLanguage('关键字')}`,
            value:'',
            type:'keyword',
            required:true,
          });
        }else if(val == 'goods'){
          cur_data.splice(i+1,0,{
            key:'link_value',
            name:`${sldComLanguage('商品名称')}`,
            value:'',
            info:{},
            type:'goods',
            required:true,
          });
        }else if(val == 'category'){
          cur_data.splice(i+1,0,{
            key:'link_value',
            name:`${sldComLanguage('分类名称')}`,
            value:'',
            info:{},
            type:'category',
            required:true,
          });
        }else if(val == 'topic'){
          cur_data.splice(i+1,0,{
            key:'link_value',
            name:`${sldComLanguage('专题名称')}`,
            value:'',
            info:{},
            type:'topic',
            required:true,
          });
        }
      }
    }

    data= cur_data;
    this.setState({data,link_type:val});
  }

  /*
  * input编辑事件 e为组件的值，type为数据的key，key为数据的key，com_type 为组件类型，不同的组件对数据的处理不一样
  * com_type为input 则为e.target.value
  * com_type为inputnum 则为e
  * com_type为range_picker 则为moment对象
  * */
  handleFieldChange(e, type,key,com_type='') {
    this.first_flag = true;
    let { data } = this.state;
    for(let i in data){
      if(data[i].key == key){
        let tmp_val = '';
        if(com_type == 'inputnum'){
          tmp_val = e+'';
        }else if(com_type == 'range_picker'){
          tmp_val = e;//moment 对象
        }else{
          tmp_val = e.target.value;
        }
        data[i].value = tmp_val;
      }
    }
    this.setState({ data});
  }

  //确定事件
  sldConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //将数据组装，返回给上级页面
        const {data,source} = this.state;
        let tmp_info = {}
        for(let i in data){
          if(data[i].key == 'img'){
            tmp_info.imgUrl = data[i].value;
            tmp_info.imgPath = data[i].imgPath;
          }else if(data[i].key == 'link_type'){
            tmp_info.link_type = data[i].value;
            tmp_info.link_value = '';
            tmp_info.info = {};
          }else if(data[i].key == 'link_value'){
            tmp_info.link_type = data[i].type;
            tmp_info.link_value = data[i].value;
            tmp_info.info = data[i].info;
          }
				}
				this.props.sldHandleConfirm({  ...values,...tmp_info });
				this.sldCancle();
			}
		});
	};

	//取消事件-清空表单
	sldCancle = () => {
		this.first_flag = false;
		this.props.form.resetFields();
		this.props.sldHandleCancle();
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.props.form.resetFields();
	};

	//选择商品或者分类取消事件
	sldHandleLinkCancle = () => {
		let { data } = this.state;
		let cur_data = [];
		for (let i in data) {
			if (data[i].key != 'link_value') {
				if (data[i].key == 'link_type') {
					data[i].value = '';
				}
				cur_data.push(data[i]);
			}
		}
		data = cur_data;
		this.setState({ data, link_type: '' });
	};

	//商品或分类选中事件
	seleSku = (val) => {
		let { data } = this.state;
		data.map(item => {
			if (item.type == 'goods') {
				item.value = val.goodsName;
				item.info = val;
			} else if (item.type == 'category') {
				item.value = val.categoryName;
				item.info = val;
			} else if (item.type == 'topic') {
				item.value = val.categoryName;
        if (this.props.client == 'mobile') {
          item.value = val.name;
        } else {
          item.value = val.decoName;
        }
        item.info = val;
			}
		});
		this.setState({ data, link_type: '' });
	};

	render() {
		const { data, columns, link_type, modal_tip } = this.state;
		const { title, modalVisible, submiting, zIndex, show_foot } = this.props;
		return <Modal
			title={title}
			zIndex={zIndex}
			afterClose={this.closeReset}
			width={this.props.width ? this.props.width : 416}
			visible={modalVisible}
			onOk={this.sldConfirm}
			onCancel={this.sldCancle}
			footer={show_foot != undefined && !show_foot ? null : [
				<Button key="back" onClick={this.sldCancle}>{sldComLanguage('取消')}
        </Button>,
				<Button key="submit" type="primary" loading={submiting} onClick={this.sldConfirm}>
					{sldComLanguage('确定')}

				</Button>,
			]}
		>
			<Form
				layout="horizontal"
			>
				<div>{showMoreModalHelpTip(modal_tip)}</div>
				<Table
					showHeader={false}
					columns={columns}
					dataSource={data}
					bordered
					pagination={false}
          scroll={{y:400}}
				/>
			</Form>
			<SldSelGoodsSingleDiy link_type={link_type} seleSku={this.seleSku} sldHandleCancle={this.sldHandleLinkCancle}/>
		</Modal>;
	}
}


