import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
	failTip,
	sucTip,
	list_com_page_size_10,
	dragSldTableColumn,
	sldHandlePaginationData,
	sldLlineRtextAddGoodsAddMargin,
	formItemLayoutModal,
	getTableNum,
	sldComLanguage,
	sldtbaleOpeBtn,
	getSldComImg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import { apiUrl } from '@/utils/sldconfig.js';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';

let pageSize = list_com_page_size_10;
@connect(({ pc_home }) => ({
	pc_home,
}))
@Form.create()
export default class HomeCat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cur_data: {},//当前操作数据
			modal_tip: [],//操作提示
			modalImgVisible: false,//上传多图广告modal是否显示
			initLoading: false,
			submiting: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			addData: [{
				type: 'upload_img_upload',
				label: `${sldComLanguage('分类图标')}`,//分类图标
				name: 'categoryIcon',
				fileList: [],
				img_info: {},
				upload_name: 'file',
				upload_url: apiUrl + `v3/oss/common/upload?source=adminDeco`,
				uploadPreview: this.uploadImgPre,
				uploadChange: (info) => this.uploadImg(info, 'categoryIcon'),
				initialValue: '',
				extra: `${sldComLanguage('建议上传16*16的图片')}`,//建议上传16*16的图片
			},
			],//modal框的数据
			formValues: {},//搜索条件、
			columns: [
				{
					title: ' ',
					dataIndex: 'goodsCategoryId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('分类图标')}`,//分类图标
					dataIndex: 'categoryIconUrl',
					align: 'center',
					width: 100,
					render: (text, record, index) => {
						return text ? getSldComImg(text, 20, 20, 16, 16) : null;
					},
				},
				{
					title: `${sldComLanguage('分类名称')}`,//分类名称
					dataIndex: 'name',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('广告图')}`,//广告图
					dataIndex: 'advertisePicture',
					align: 'center',
					width: 100,
					render: (text, record, index) => {
						return text
							? <div className={global.flex_com_row_center}>
								{
									JSON.parse(text.replace(/&quot;/g,"\"")).map((val, key) => {
										return getSldComImg(val.imgUrl, 227, 146, 30, 30)
									})
								}
							</div>
							: null;
					},
				},
				{
					title: `${sldComLanguage('更新时间')}`,//更新时间
					dataIndex: 'updateTime',
					align: 'center',
					width: 150,
				}, {
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 100,
					render: (text, record) => (
						<Fragment>
							{
								sldtbaleOpeBtn(sldComLanguage('分类图标设置'), 'fenlei2', () => this.editCat(record, 'icon'))//分类图标设置
							}
							{
								sldtbaleOpeBtn(sldComLanguage('分类广告设置'), 'guanggao', () => this.editCat(record, 'adv'))//分类广告设置
							}
						</Fragment>
					),
				},
			],
			adv_data: {
				width: 227,
				height: 146,//高度为0的话表示不限制
				data: [{
					imgUrl: '',
					imgPath: '',
					title: '',
					link_type: '',
					link_value: '',
					info: {},
				}, {
					imgUrl: '',
					imgPath: '',
					title: '',
					link_type: '',
					link_value: '',
					info: {},
				}, {
					imgUrl: '',
					imgPath: '',
					title: '',
					link_type: '',
					link_value: '',
					info: {},
				}],
			},
		};
	}

	empty_data = {
		imgUrl: '',
		imgPath: '',
		title: '',
		link_type: '',
		link_value: '',
		info: {},
	};//空数据
	cur_type = '';//当前操作类型 icon 图标 adv 分类广告
	cur_row_info = '';//当前操作行信息
	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

	//预览图片
	uploadImgPre = (info) => {
		this.viewImg(true, info.response.data.url);
	};

	//预览图片/关闭预览图片
	viewImg = (flag, img = '', text = '') => {
		this.setState({
			preview_img: img,
			preview_alt_con: text,
			show_preview_modal: flag,
		});
	};

	//上传图片
	uploadImg = (info, type) => {
		let { addData } = this.state;
		if (info.file.status != undefined && info.file.status != 'error') {
			for (let i in addData) {
				if (addData[i].name == type) {
					addData[i].fileList = info.fileList;
					addData[i].img_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
				}
			}
			this.setState({ addData });
		}
	};
	//编辑分类   type icon：分类图标  adv:分类广告
	editCat = (val, type) => {
		let { adv_data, modalImgVisible, addData, modalVisible, cur_data } = this.state;
		if (type == 'adv') {
			if(val.advertisePicture){
				let tmp_data = JSON.parse(val.advertisePicture.replace(/&quot;/g,"\""));
				for(let i in adv_data.data){
					adv_data.data[i] = tmp_data[i]!=undefined?tmp_data[i]:this.empty_data;
				}
			}else{
				for(let i in adv_data.data){
					adv_data.data[i] = this.empty_data;
				}
			}
			cur_data = adv_data;
			modalImgVisible = true;
		} else if (type == 'icon') {
			for (let i in addData) {
				if (addData[i].name == 'categoryIcon') {
					let fileList = [];
					let tmp_data = {};
					tmp_data.uid = val.goodsCategoryId;
					tmp_data.name = val.categoryIconUrl;
					tmp_data.status = 'done';
					tmp_data.url = val.categoryIconUrl;
					fileList.push(tmp_data);
					addData[i].fileList = fileList;
					addData[i].img_info.path = val.categoryIconPath;
				} else {
					addData[i].initialValue = val[addData[i].name];
				}
			}
			modalVisible = true;
		}
		this.cur_type = type;
		this.cur_row_info = val;
		this.setState({
			cur_data,
			modalImgVisible,
			modal_tip: [],
			addData: addData,
			modalVisible,
			adv_data
		});
	};

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		let { data } = this.state;
		dispatch({
			type: 'pc_home/get_home_cat_lists',
			payload: params,
			callback: (res) => {
				this.setState({ initLoading: false });
				if (res.state == 200) {
					if (res.data.length == 0 && this.state.params.currentPage > 1) {
						params.currentPage = params.currentPage - 1;
						this.get_list(params);
					} else {
						data.list = res.data;
						this.setState({
							data: data,
						});
					}
				}
			},
		});
	};

	handleSelectRows = (rows, rowkeys) => {
		this.setState({
			selectedRows: rows,
			selectedRowKeys: rowkeys,
		});
	};

	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
		const { formValues } = this.state;
		if (type == 'main') {
			const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
			pageSize = params.pageSize;
			this.setState({ params });
			this.get_list(params);
		}
	};


//表格拖动
	resizeTable = (index, size, type, data) => {
		let datas = dragSldTableColumn(index, size, data);
		this.setState({ [type]: datas });
	};


	sldHandleCancle = () => {
		this.setState({ modalVisible: false, modalImgVisible: false });
	};

	sldHandleConfirm = (val) => {
		let { adv_data, params, addData } = this.state;
		const { dispatch } = this.props;
		let param_data = {};
		param_data.goodsCategoryId = this.cur_row_info.goodsCategoryId;//分类id
		if (this.cur_type == 'icon') {
			for (let i in addData) {
				if (addData[i].name == 'categoryIcon') {
					if (addData[i].img_info.path == undefined) {
						failTip(`${sldComLanguage('请上传')}${sldComLanguage('分类图标')}`);//请上传分类图标
						return false;
					} else {
						param_data.categoryIcon = addData[i].img_info.path;//分类图标
					}
				}
			}
		} else if (this.cur_type == 'adv') {
			param_data.advertisePicture = JSON.stringify(val);//分类的广告数据
		}
		dispatch({
			type: 'pc_home/edit_cat',
			payload: param_data,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
					this.get_list(params);
					this.setState({
						modalVisible: false,
						modalImgVisible: false,
					});
				} else {
					failTip(res.msg);
				}
				this.setState({ submiting: false });
			},
		});
	};

	render() {
		const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, modalImgVisible, cur_data, modal_tip } = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('首页分类')}${sldComLanguage('管理')}`, 0, 0, 10)}{/*首页分类管理*/}
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
						selectedRows={selectedRows}
						data={data}
						rowKey={'goodsCategoryId'}
						isCheck={false}
						columns={columns}
						onSelectRow={this.handleSelectRows}
						onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
						onSldHandleSeleRow={this.onSldHandleSeleRow}
						resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
						isColumnResize={true}
					/>
					{/*标准表格-end*/}

				</Spin>
				{/*新增/编辑对话框-start*/}
				<SldModal
					title={`${sldComLanguage('首页分类图标设置')}`}//首页分类图标设置
					submiting={submiting}
					width={500}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					formItemLayoutModal={formItemLayoutModal}
					content={addData}
				/>
				{/*新增/编辑对话框-end*/}
				<SldDiyMoreImgModal
					width={1000}
					title={`${sldComLanguage('首页分类广告设置')}`}//首页分类广告设置
					sldSeleSingleRow={true}
					submiting={submiting}
					modalVisible={modalImgVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					content={cur_data}
					modal_tip={modal_tip}
				/>
			</div>

		);
	}
}
