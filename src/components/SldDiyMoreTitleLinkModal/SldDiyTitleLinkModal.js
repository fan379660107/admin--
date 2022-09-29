/*
* 标题+链接选择器_多选
* */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form, Select, Button, Input, Modal, Table,
} from 'antd';
import global from '../../global.less';
import {
	showMoreModalHelpTip,
	sldComLanguage,
  isEmptyObject,
} from '@/utils/utils';
import { diy_link_type, } from '@/utils/util_data';
import styles from '@/pages/decorate/pc/pcdecorate.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';

const FormItem = Form.Item;
const Option = Select.Option;

let sthis = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class SldDiyMoreTitleLinkModal extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator }
    } = props;
    this.state = {
      source:'',
      link_type:'',
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
            if(this.props.extra!=undefined&&this.props.extra['input_limit']!=undefined&&this.props.extra['input_limit']){
              limit = this.props.extra['input_limit'];
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
          }else if(record.type == 'link_type'){
            content = <div>
              <Select
                value={record.value}
                style={{ width: 120 }}
                placeholder={`${sldComLanguage('请选择链接类型')}`}
                onSelect={(e)=>this.sldHandSeleChange(e,record.key)}
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
                  onChange={e => this.handleFieldChange(e, 'url',record.key)}
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
                  onChange={e => this.handleFieldChange(e, 'keyword',record.key)}
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
          return content;
        },
      } ],
    };
  }

  first_flag = false;
  operate_info = {};//操作下拉框选择事件的信息

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
      ope_data.map((item,index)=>{
        if(item.title!=undefined){
          tmp_info.push({
            key: item.title.name,
            name: item.title.label,
            value: item.title.initialValue,
            type: 'input',
            required:item.title.required,
          });
        }
        tmp_info.push({
          key: 'link_type_'+index,
          name: `${sldComLanguage('操作')}`,
          value: item.link_type,
          type: 'link_type',
        });
        if(item.link_value!=undefined&&item.link_value) {
          let tmp_info_new = {
            key: 'link_value_' + index,
            name: `${sldComLanguage('关键字')}`,
            value: item.link_value,
            type: item.link_type,
            info: item.info != undefined ? item.info : {},
            required: true,
          }
          if (item.link_type == 'url') {
            tmp_info_new.name = `${sldComLanguage('链接地址')}`;
            tmp_info_new.required = true;
          } else if (item.link_type == 'keyword') {
            tmp_info_new.name = `${sldComLanguage('关键字')}`;
            tmp_info_new.required = true;
          } else if (item.link_type == 'goods') {
            tmp_info_new.name = `${sldComLanguage('商品名称')}`;
            tmp_info_new.required = false;
          } else if (item.link_type == 'category') {
            tmp_info_new.name = `${sldComLanguage('分类名称')}`;
            tmp_info_new.required = false;
          }
          tmp_info.push(tmp_info_new);
        }
      });
      this.setState({
        modal_tip:nextProps.modal_tip,
        data: tmp_info,
        source:nextProps.content.source!=undefined?nextProps.content.source:'',
      });
    }
  }

  //操作类型选择事件
  sldHandSeleChange = (val,key) => {
    this.props.form.resetFields();
    let {data} = this.state;
    let key_index = 0;//当前操作数据的key所属的index（父组件里面的index）
    let ley_array = key.split('_');
    key_index = ley_array[ley_array.length-1];

    let target_data = data.filter(item=>item.key == key);
    target_data[0].value = val;
    target_data = data.filter(item=>item.key != ('link_value_'+key_index));

    let cur_link_type_index = data.findIndex((item)=>{
      return item.key == key}
      )

    this.operate_info = {
      link_type_key:key,
      link_type_parent_index:key_index,
      link_value_index:cur_link_type_index+1,
    };//操作下拉框选择事件的信息

    let temp = {};
    let cur_key = 'link_value_'+key_index;
    if(val == 'url'){
      temp = {
        key:cur_key,
        name:`${sldComLanguage('链接地址')}`,
        value:'',
        type:'url',
        required:true,
      }
    }else if(val == 'keyword'){
      temp = {
        key:cur_key,
        name:`${sldComLanguage('关键字')}`,
        value:'',
        type:'keyword',
        required:true,
      }
    }else if(val == 'goods'){
      temp = {
        key:cur_key,
        name:`${sldComLanguage('商品名称')}`,
        value:'',
        info:{},
        type:'goods',
        required:true,
      }
    }else if(val == 'category'){
      temp = {
        key:cur_key,
        name:`${sldComLanguage('分类名称')}`,
        value:'',
        info:{},
        type:'category',
        required:true,
      }
    }else if(val == 'topic'){
      temp = {
        key:cur_key,
        name:`${sldComLanguage('专题名称')}`,
        value:'',
        info:{},
        type:'topic',
        required:true,
      }
    }
    target_data.splice(cur_link_type_index+1,0,temp);
    this.setState({data:JSON.parse(JSON.stringify(target_data)),link_type:val});
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
    let target = data.filter(item=>item.key == key)[0];
    target.value = e.target.value;
    this.setState({ data:JSON.parse(JSON.stringify(data))},()=>{
      this.props.form.resetFields();
    });
  }

  //确定事件
  sldConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //将数据组装，返回给上级页面
        const {data} = this.state;
        let target = [];
        let target_index = 1;
        data.map((item,index)=>{
          if(item.key.indexOf('title')>-1){
            target.push({
              title: {
                label: item.name,
                name: 'title'+target_index,
                initialValue: item.value,
                required: true,
              },
              link_type: '',
              link_value: '',
              info: {},
            })
            target_index++;
          }else{
            let key_array = item.key.split('_');
            let parent_index = key_array[key_array.length-1];
            if(item.key.indexOf('link_type')>-1){
              target[parent_index].link_type = item.value;
            }else{
              target[parent_index].link_value = item.value;
              target[parent_index].info = item.info;
            }
          }
        });
				this.props.sldHandleConfirm(target);
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
    data[this.operate_info.link_value_index-1].value = '';
    data = data.filter(item=>item.key != ('link_value'+this.operate_info.link_type_parent_index));
		this.setState({ data:JSON.parse(JSON.stringify(data)), link_type: '' });
	};

	//商品或分类选中事件
	seleSku = (val) => {
		let { data } = this.state;
    let target = data.filter(item=>item.key == ('link_value_'+this.operate_info.link_type_parent_index))[0];
    if (target.type == 'goods') {
      target.value = val.goodsName;
      target.info = val;
    } else if (target.type == 'category') {
      target.value = val.categoryName;
      target.info = val;
    } else if (target.type == 'topic') {
      target.value = val.categoryName;
      if (this.props.client == 'mobile') {
        target.value = val.name;
      } else {
        target.value = val.decoName;
      }
      target.info = val;
    }
		this.setState({ data:JSON.parse(JSON.stringify(data)), link_type: '' });
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


