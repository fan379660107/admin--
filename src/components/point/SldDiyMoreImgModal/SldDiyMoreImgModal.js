/*
* 多图选择器
* */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Select,
	Icon,
	Button,
	Input,
	Modal,
	Table,
	Upload,
} from 'antd';
import {
	showMoreModalHelpTip,
	sldBeforeUpload,
	formItemLayoutModal,sldComLanguage,getLocalStorageStingVal
} from '@/utils/utils';
import { diy_link_type,m_diy_point_link_type } from '@/utils/util_data';
import { apiUrl,uploadLimit } from '@/utils/sldconfig.js';
import styles from '@/pages/decorate/pc/pcdecorate.less';
import color from './index.less';
import SldSelGoodsSingleDiy from '@/components/point/SldSelGoodsSingleDiy';
import { SketchPicker } from 'react-color';

const FormItem = Form.Item;
const Option = Select.Option;

let sthis = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class SldDiyMoreImgModal extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		const {
			form: { getFieldDecorator },
		} = props;
		this.state = {
			link_type: '',//当前链接的操作类型
			img_width: 150,//图片的宽度
			img_height: 150,//图片的高度
      admin_show_width:150,//这里显示的图片的宽度
      admin_show_height:150,//这里显示的图片的高度
			sele_index: 0,//当前选中的index
			selectedRowKeys: [],
			cur_data: [{
				key: 'img',
				name: `${sldComLanguage('图片')}`,
				value: '',
				imgPath: '',
				type: 'img',
				required: true,
			}, {
				key: 'link_type',
				name: `${sldComLanguage('操作')}`,
				value: '',
				type: 'link_type',
			}],//当前
			data: [
				[{
					key: 'img',
					name: '',
					value: '',
					imgPath: '',
					type: 'img',
					required: true,
				}, {
					key: 'link_type',
					name: `${sldComLanguage('操作')}`,
					value: '',
					type: 'link_type',
				}], [{
					key: 'img',
					name: `${sldComLanguage('图片')}`,
					value: '',
					imgPath: '',
					type: 'img',
					required: true,
				}, {
					key: 'link_type',
					name: `${sldComLanguage('操作')}`,
					value: 'url',
					type: 'link_type',
				}, {
					key: 'link_value',
					name: `${sldComLanguage('操作')}`,
					value: '1111',
					type: 'url',
				}],
			],//数据
			columns: [{
				align: 'right',
				width: 150,
				dataIndex: 'name',
				render: (text, record) => {
					return <div>
						<span className={styles.table_left_con}>{text}</span>
						{record.required != undefined && record.required &&
						<span className={styles.table_left_require}>*</span>
						}
					</div>;
				},
			}, {
				align: 'left',
				dataIndex: 'type',
				render: (text, record) => {
					let content = '';
					if (record.type == 'img') {
						content = <div className={styles.modal_img}>
							<span
								className={styles.modal_tip_color}>{sldComLanguage('此处对应上传上方选中标签项内容，要求宽度为')}{this.state.img_width}{sldComLanguage('像素、高度')}{this.state.img_height == 0 ? `${sldComLanguage('不限制')}` : this.state.img_height + `${sldComLanguage('像素')}`}{sldComLanguage('的图片；支持格式gif，jpg，png。')}</span>
							<Upload
								withCredentials={true}
								beforeUpload={(file, fileList)=>sldBeforeUpload(file, fileList,this.props.uploadLimit!=undefined?this.props.uploadLimit:uploadLimit)}
								accept={'.gif, .jpeg, .png,.jpg,'}
								showUploadList={false}
								name={'file'}
								action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
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
					} else if (record.type == 'link_type') {
					  let cur_all_link = diy_link_type();
					  if(props.client != undefined && props.client == 'mobile'){
              cur_all_link = m_diy_point_link_type();
            }
						content = <div>
							<Select
								value={record.value}
								style={{ width: 120 }}
								placeholder={`${sldComLanguage('请选择链接类型')}`}
								onSelect={this.sldHandSeleChange}
                getPopupContainer={triggerNode => triggerNode.parentNode}
							>
								{cur_all_link.map((item, index) =>
									<Option key={index} value={item.key}>{item.name}</Option>,
								)}
							</Select>
						</div>;
					} else if (record.type == 'url') {
						content = <FormItem
						>
							{getFieldDecorator(`link_type`, {
								initialValue: record.value, rules: [{
									required: true,
									whitespace: true,
									message: `${sldComLanguage('请输入链接地址')}`,
								}],
							})(
								<Input
                  maxLength={250}
									onChange={e => this.handleFieldChange(e, 'url', 'link_value')}
									placeholder={`${sldComLanguage('请输入链接地址')}`}/>,
							)}
						</FormItem>;
					} else if (record.type == 'keyword') {
						content = <FormItem
						>
							{getFieldDecorator(record.type, {
								initialValue: record.value, rules: [{
									required: true,
									whitespace: true,
									message: `${sldComLanguage('请输入关键字')}`,
								}],
							})(
								<Input
                  maxLength={250}
									onChange={e => this.handleFieldChange(e, record.type, 'link_value')}
									placeholder={`${sldComLanguage('请输入关键字')}`}/>,
							)}
						</FormItem>;
					} else if (record.type == 'main_title' || record.type == 'sub_title') {
            let limit = 255;
            if(this.props.extra!=undefined&&this.props.extra[record.type+'_limit']!=undefined&&this.props.extra[record.type+'_limit']){
              limit = this.props.extra[record.type+'_limit'];
            }
            content = <FormItem
						>
							{getFieldDecorator(record.type, {
								initialValue: record.value, rules: [{
									required: true,
									whitespace: true,
									message: `${sldComLanguage('请输入')}` + record.name,
								}],
							})(
								<Input
                  maxLength={limit}
									onChange={e => this.handleFieldChange(e, record.type, record.key)}
									placeholder={`${sldComLanguage('请输入')}` + record.name}/>,
							)}
						</FormItem>;
					} else if (record.type == 'goods' || record.type == 'category') {
						content = <div>
							<span>{record.value}</span>
						</div>;
					}else if (record.type == 'bg_color' ) {
					  //设置颜色
            content = <Fragment
            >
              <span className={`${color.selected_color} ${record.value!=undefined&&record.value ? color.bg_color_current : null}`}
                    style={{ background: record.value }} onClick={()=>this.showColorPicker(true,record.key)}></span>
              {record.show_color_picker!=undefined&&record.show_color_picker && (
                <div className={color.color_picker_wrap}>
                  <div className={color.color_picker_mask}
                       onClick={() => this.showColorPicker(false,record.key)}/>
                  <SketchPicker
                    color={record.value}
                    onChangeComplete={(e) => this.setBgColor(e.hex,record.key)}/>
                </div>
              )}
            </Fragment>;
          }
					return content;
				},
			}],
		};
	}

	first_flag = false;

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (!nextProps.modalVisible && !this.props.modalVisible) {
			//防止别的模板发生变化，影响数据报错
			return false;
		}
		if (!this.first_flag) {
			let ope_data = nextProps.content.data;
			let new_data = [];
			for (let i in ope_data) {
				let tmp_info = [];
				if (ope_data[i].main_title != undefined) {
					tmp_info.push({
						key: 'main_title',
						name: `${sldComLanguage('图片标题')}`,
						value: ope_data[i].main_title,
						type: 'main_title',
						info: {},
						required: true,
					});
				}
				if (ope_data[i].sub_title != undefined) {
					tmp_info.push({
						key: 'sub_title',
						name: `${sldComLanguage('图片子标题')}`,
						value: ope_data[i].sub_title,
						type: 'sub_title',
						info: {},
						required: true,
					});
				}
        if (ope_data[i].bg_color != undefined) {
          tmp_info.push({
            key: 'bg_color',
            name: `${sldComLanguage('图片背景色')}`,
            value: ope_data[i].bg_color,
            type: 'bg_color',
            info: {},
            required: true,
          });
        }
				tmp_info.push({
					key: 'img',
					name: `${sldComLanguage('图片')}`,
					value: ope_data[i].imgUrl,
					imgPath: ope_data[i].imgPath,
					type: 'img',
					required: true,
				});
				tmp_info.push({
					key: 'link_type',
					name: `${sldComLanguage('操作')}`,
					value: ope_data[i].link_type,
					type: 'link_type',
				});
				if (ope_data[i].link_value != undefined && ope_data[i].link_value) {
					let tmp_info_new = {
						key: 'link_value',
						name: `${sldComLanguage('关键字')}`,
						value: ope_data[i].link_value,
						type: ope_data[i].link_type,
						info: ope_data[i].info != undefined ? ope_data[i].info : {},
						required: true,
					};
					if (ope_data[i].link_type == 'url') {
						tmp_info_new.name = `${sldComLanguage('链接地址')}`;
						tmp_info_new.required = true;
					} else if (ope_data[i].link_type == 'keyword') {
						tmp_info_new.name = `${sldComLanguage('关键字')}`;
						tmp_info_new.required = true;
					} else if (ope_data[i].link_type == 'goods') {
						tmp_info_new.name = `${sldComLanguage('商品名称')}`;
						tmp_info_new.required = true;
					} else if (ope_data[i].link_type == 'category') {
						tmp_info_new.name = `${sldComLanguage('分类名称')}`;
						tmp_info_new.required = true;
					}
					tmp_info.push(tmp_info_new);
				}
				new_data.push(tmp_info);
			}
			this.setState({
				data: new_data,
				img_width: nextProps.content.width,
				img_height: nextProps.content.height,
        admin_show_width:nextProps.content.admin_show_width!=undefined&&nextProps.content.admin_show_width>0?nextProps.content.admin_show_width:nextProps.content.width,
        admin_show_height:nextProps.content.admin_show_height!=undefined&&nextProps.content.admin_show_height>0?nextProps.content.admin_show_height:nextProps.content.height,
			});
		}
	}

	//上传图片
	setImg = (info) => {
		let { sele_index, data } = this.state;
		let img_data = info.file.response;
		if (info.file.status != undefined && info.file.status != 'error') {
			if (img_data != undefined && img_data.state != undefined && img_data.state == 200) {
				data[sele_index].map(item => {
					if (item.key == 'img') {
						item.value = img_data.data.url;
						item.imgPath = img_data.data.path;
						item.width = img_data.data.width;
						item.height = img_data.data.height;
					}
				});
			}
		}
		this.setState({ data });
	};

	//操作类型选择事件
	sldHandSeleChange = (val) => {
		this.props.form.resetFields(['link_type','keyword']);
		let { data, sele_index } = this.state;
		let cur_data = [];
		for (let i in data[sele_index]) {
			if (data[sele_index][i].key != 'link_value') {
				if (data[sele_index][i].key == 'link_type') {
					data[sele_index][i].value = val;
				}
				cur_data.push(data[sele_index][i]);
			}
		}
		if (val == 'url') {
			cur_data.push({
				key: 'link_value',
				name: `${sldComLanguage('链接地址')}`,
				value: '',
				type: 'url',
				required: true,
			});
		} else if (val == 'keyword') {
			cur_data.push({
				key: 'link_value',
				name: `${sldComLanguage('关键字')}`,
				value: '',
				type: 'keyword',
				required: true,
			});
		} else if (val == 'goods') {
			cur_data.push({
				key: 'link_value',
				name: `${sldComLanguage('商品名称')}`,
				value: '',
				info: {},
				type: 'goods',
				required: true,
			});
		} else if (val == 'category') {
			cur_data.push({
				key: 'link_value',
				name: `${sldComLanguage('分类名称')}`,
				value: '',
				info: {},
				type: 'category',
				required: true,
			});
		}
		data[sele_index] = cur_data;
		this.setState({ data, link_type: val });
	};

	//input编辑事件
	handleFieldChange(e, type, key) {
		this.first_flag = true;
		let { data, sele_index } = this.state;
		for (let i in data[sele_index]) {
			if (data[sele_index][i].key == key) {
				data[sele_index][i].value = e.target.value;
			}
		}
		this.setState({ data });
	}

	//颜色选择器是否显示
  showColorPicker = (flag,key) => {
    let { data, sele_index } = this.state;
    for (let i in data[sele_index]) {
      if (data[sele_index][i].key == key) {
        data[sele_index][i].show_color_picker = flag;
      }
    }
    this.setState({ data });
  }

  //设置背景色
  setBgColor = (rgba,key) => {
    let { data, sele_index } = this.state;
    for (let i in data[sele_index]) {
      if (data[sele_index][i].key == key) {
        data[sele_index][i].value = rgba;
      }
    }
    this.setState({ data });
  }

	//确定事件
	sldConfirm = (e) => {
		e.preventDefault();
		const {content} = this.props;
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				//将数据组装，返回给上级页面
				const { data } = this.state;
				let parent_data = [];
				for (let i in data) {
					let tmp_info = {};
					for (let j in data[i]) {
						if (data[i][j].key == 'img') {
							tmp_info.imgUrl = data[i][j].value;
							tmp_info.imgPath = data[i][j].imgPath;
							tmp_info.width = data[i][j].width;
							tmp_info.height = data[i][j].height;
						} else if(data[i][j].key == 'link_type'){
              tmp_info.link_type = data[i][j].value;
              tmp_info.link_value = '';
              tmp_info.info = {};
						} else if (data[i][j].key == 'link_value') {
              tmp_info.link_type = data[i][j].type;
              tmp_info.link_value = data[i][j].value;
              tmp_info.info = data[i][j].info;
						} else if (data[i][j].key == 'main_title') {
							tmp_info.main_title = data[i][j].value;
						} else if (data[i][j].key == 'sub_title') {
							tmp_info.sub_title = data[i][j].value;
						} else if (data[i][j].key == 'bg_color') {
							tmp_info.bg_color = data[i][j].value;
						}
					}
					parent_data.push(tmp_info);
				}
				if(content!=undefined&&content.title_info != undefined && content.title_info.title_name != undefined){
					this.props.sldHandleConfirm({title_name:values.title_name,parent_data});
				}else{
					this.props.sldHandleConfirm(parent_data);
				}

				this.sldCancle();
			}
		});
	};

	//取消事件-清空表单
	sldCancle = () => {
		this.props.form.resetFields();
		this.props.sldHandleCancle();
		this.first_flag = false;
		this.setState({ sele_index: 0 });
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.props.form.resetFields();
	};

	//选择图片操作
	seleCurData = (index) => {
		this.setState({ sele_index: index }, () => {
			this.props.form.resetFields(['link_type','keyword','main_title','sub_title']);
		});

	};

	//删除该图片对应的数据
	del_img = (index) => {
		let { data } = this.state;
		data[index] = data[index].filter(item => item.key != 'link_value');
		data[index].map(item => {
			if (item.key == 'img') {
				item.value = '';
				item.imgPath = '';
			} else if (item.key == 'link_type'||item.key == 'main_title'||item.key == 'sub_title') {
				item.value = '';
			}
		});
		this.setState({ data });
	};

	//选择商品或者分类取消事件
	sldHandleLinkCancle = () => {
		let { data, sele_index } = this.state;
		let cur_data = [];
		for (let i in data[sele_index]) {
			if (data[sele_index][i].key != 'link_value') {
				if (data[sele_index][i].key == 'link_type') {
					data[sele_index][i].value = '';
				}
				cur_data.push(data[sele_index][i]);
			}
		}
		data[sele_index] = cur_data;
		this.setState({ data, link_type: '' });
	};

	//商品或分类选中事件
	seleSku = (val) => {
		let { data, sele_index } = this.state;
		data[sele_index].map(item => {
			if (item.type == 'goods') {
				item.value = val.goodsName;
				item.info = val;
			} else if (item.type == 'category') {
				item.value = val.labelName;
				item.info = val;
			}
		});
		this.setState({ data, link_type: '' });
	};

	render() {
		const { data, columns, sele_index, link_type,admin_show_width,admin_show_height } = this.state;
		const { title, modalVisible, submiting, zIndex, show_foot, modal_tip, form: { getFieldDecorator }, content } = this.props;
		return <Modal
      maskClosable={false}
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
				{...formItemLayoutModal}
			>
				<div>{showMoreModalHelpTip(modal_tip)}</div>
				{content!=undefined&&content.title_info != undefined && content.title_info.title_name != undefined &&
				<FormItem
					label={`${sldComLanguage('标题名称')}`}
				>
					{getFieldDecorator('title_name', {
						initialValue: content.title_info.title_name, rules: [{
							required: true,
							whitespace: true,
							message: `${sldComLanguage('请输入标题名称')}`,
						}],
					})(
						<Input
              maxLength={4}
							placeholder={`${sldComLanguage('请输入标题名称')}`}/>,
					)}
				</FormItem>
				}
				<div className={styles.imgs_wrap}>
					{data.map((item, index) => {
						return item.map((val, key) => {
							if (val.key == 'img') {
								return <div onClick={() => this.seleCurData(index)} key={index}
											className={`${styles.adv_more_img_wrap} ${sele_index == index ? styles.seleImg : null}`}
											style={{ width: admin_show_width, height: admin_show_height ? admin_show_height : 100 }}>
									{val.value == ''
										? null
										: <img className={styles.adv_01_img} src={val.value}/>}
									<span onClick={() => this.del_img(index)} className={styles.del_img}>{sldComLanguage('删除')}</span>
								</div>;
							}
						});
					})}
				</div>
				<Table
					showHeader={false}
					columns={columns}
					dataSource={data[sele_index]}
					bordered
					pagination={false}
				/>
			</Form>
			<SldSelGoodsSingleDiy link_type={link_type} seleSku={this.seleSku}
								  sldHandleCancle={this.sldHandleLinkCancle}
                            client={this.props.client!=undefined?this.props.client:'mobile'}
      />
		</Modal>;
	}
}


