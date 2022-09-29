/*
* 通用的modal弹框，主要实现快捷添加，快捷搜索便添加的功能
* 目前只用于添加类型时选择规格和品牌 分类里面选择商品类型
* 多选
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
	formItemLayoutModal,
	sldHandlePaginationData,
	sldComLanguage
} from '@/utils/utils';
import {
	comm_cur_page_global,
	column_client_tags_search,
	column_spec_list,
	column_brand_list,
	column_attr_list,
	type_list_column,
  enterprise_list_column,
} from '@/utils/util_data';
import global from '@/global.less';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = 10;
let sthis = '';
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class CommonSeleMore extends Component {

	constructor(props) {
		comm_cur_page_global.cur = 1;
		super(props);
		sthis = this;
		this.state = {
			show_flag:false,//是否显示表格
			submiting: false,//按钮loading
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			modalVisible: false,
			modalTableVisible: props.modalTableVisible,//列表展示对话框是否显示
			data: {},//数据
			loading: false,//是否加载中
			title: `${sldComLanguage('新增商品单位')}`,//新增商品单位
			tableTitle: props.tableTitle,
			tablesldSAddTitle: props.tablesldSAddTitle,//input后缀添加modal的标题
			params: { pageSize: pageSize },//搜索条件
			curData: {},//编辑的数据
			addData: [],//要渲染的modal的数据
			formValues: {},//搜索条件
			modalTableSeleData: {},//表格里面选中的值
			search_modal_width: props.search_modal_width,//modal宽度、
			addTableData: [{
				type: 'modal_table_sele',
				search: this.modalSearch,
				searchCon: this.modalSearchCon,
				table: {},
				isCheck: true,
				columns: column_client_tags_search,
				rowKey: 'unit_id',
				search_value: '',//搜索内容
				handleSelectRows: this.handleSelectRows,
				onChange: this.handleTablePagination,
				onSldHandleSeleRow: this.onSldHandleSeleRow,
				selectedRows: [],
				selectedRowKeys: [],
				add: false,
				topSeaplaceHolder:'',//搜索框的placeholder
				searchClear:this.sldSearClear,//清除搜索框内容的事件
        extraProps:{},//额外的属性
			}],//列表对话框展示的数据
		};
	}

	cur_operate_type = this.props.cur_operate_type;//点击类型，很重要，根据这个识别点击类型，然后获取数据
	type = this.props.cur_type;//show_list表示表格搜索，add表示添加数据
	flag = 1;//是否走componentWillReceiveProps方法，0不走，1走
	modalTableSeleData = {};//当前选中的数据
	selectedRows = [];//选中的行数据
	selectedRowKeys = [];//选中的行id
	componentDidMount() {
		this.initData();
	}

	componentWillReceiveProps(props) {
		this.setState({
			modalTableVisible: props.modalTableVisible,
		});
		if ((!this.props.modalTableVisible) && props.modalTableVisible) {
			this.flag = 1;
		}
		if (this.flag == 1) {
			let { addTableData } = this.state;
			if (props.modalTableVisible) {
				this.flag = 0;
			} else {
				this.flag = 1;
			}
			addTableData[0].selectedRows = props.selectedRows;
			addTableData[0].selectedRowKeys = props.selectedRowKeys;
      if(props.extraProps!=undefined){
        addTableData[0].extraProps = props.extraProps;
      }
			this.selectedRows = props.selectedRows;
			this.selectedRowKeys = props.selectedRowKeys;
			this.setState({
				tableTitle: props.tableTitle,
				modalTableVisible: props.modalTableVisible,
				search_modal_width: props.search_modal_width,
				addTableData: addTableData,
				tablesldSAddTitle: props.tablesldSAddTitle,
			});
			this.cur_operate_type = props.cur_operate_type,
				this.type = props.cur_type;
			this.initData();
		}
	}

	initData = () => {
		if (this.type == 'show_list') {
			this.get_list({ pageSize: pageSize });
		}
	};

	handleSelectRows = (rows, rowkeys) => {
		//针对翻页无法保存选择的行数据处理
		let selectedRows = this.selectedRows;
		let selectedRowKeys = this.selectedRowKeys;
		let pre_sele_rows_keyarray = [];
		let main_key = 'id';
		if(this.cur_operate_type == 'search_spec_more'){
			main_key =  'specId';
		}else if(this.cur_operate_type == 'search_brand_more'){
			main_key =  'brandId';
		}else if(this.cur_operate_type == 'search_attr_more'){
			main_key =  'attributeId';
		}else if(this.cur_operate_type == 'search_goods_type'){
			main_key =  'typeId';
		}
		for (let i in selectedRows) {
			pre_sele_rows_keyarray.push(selectedRows[i][main_key]);
		}
		//去掉的话要删掉行数据
		for (let i in selectedRowKeys) {
			if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
				selectedRows = selectedRows.filter(item => item[main_key] != selectedRowKeys[i]);
			}
		}
		//没有的话追加行数据
		for (let i in rowkeys) {
			if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
				let cur_row = rows.filter(item => item[main_key] == rowkeys[i])[0];
				selectedRows.push(cur_row);
			}
		}

		let { addTableData } = this.state;
		addTableData[0].selectedRows = selectedRows;
		addTableData[0].selectedRowKeys = rowkeys;
		this.setState({
			addTableData: addTableData,
		});
		this.selectedRows = selectedRows;//选中的行数据
		this.selectedRowKeys = rowkeys;//选中的行id
	};

	//清空选中的数据
	clearSeleData = () => {
		this.selectedRows = [];//选中的行数据
		this.selectedRowKeys = [];//选中的行id
		let { addTableData } = this.state;
		addTableData[0].selectedRows = [];
		addTableData[0].selectedRowKeys = [];
		this.setState({
			addTableData: addTableData,
		});
	};


	//选中单行的操作
	onSldHandleSeleRow = (record) => {
		this.modalTableSeleData = record;
	};

	//获取数据列表
	get_list = (params) => {
		this.flag = 0;
		const { dispatch } = this.props;
		let { addTableData } = this.state;
		if (this.cur_operate_type == 'search_spec_more') {
			//获取规格列表
;			dispatch({
				type: 'product/get_goods_spec_list',
				payload: {...params,state:1},
				callback: (res) => {
					addTableData[0].table = res.data;
					addTableData[0].type = 'modal_table_sele';
					addTableData[0].isCheck = true;
					addTableData[0].columns = column_spec_list();
					addTableData[0].rowKey = 'specId';
					addTableData[0].topSeaplaceHolder = `${sldComLanguage('请输入规格名称')}`;//搜索框的placeholder
					this.setState({
						addTableData: addTableData,
						show_flag:true,
					});
				},
			});
		} else if (this.cur_operate_type == 'search_brand_more') {
			//获取品牌列表
			dispatch({
				type: 'product/get_brand_lists',
				payload: params,
				callback: (res) => {
					addTableData[0].table = res.data;
					addTableData[0].type = 'modal_table_sele';
					addTableData[0].isCheck = true;
					addTableData[0].columns = column_brand_list();
					addTableData[0].rowKey = 'brandId';
					addTableData[0].topSeaplaceHolder = `${sldComLanguage('请输入品牌名称')}`;//搜索框的placeholder
					this.setState({
						addTableData: addTableData,
						show_flag:true,
					});
				},
			});
		} else if (this.cur_operate_type == 'search_attr_more') {
			//获取检索属性列表
			dispatch({
				type: 'product/get_search_attr_lists',
				payload: {...params,isShow:1},
				callback: (res) => {
					addTableData[0].table = res.data;
					addTableData[0].type = 'modal_table_sele';
					addTableData[0].isCheck = true;
					addTableData[0].columns = column_attr_list();
					addTableData[0].rowKey = 'attributeId';
					addTableData[0].topSeaplaceHolder = `${sldComLanguage('请输入属性名称')}`;//搜索框的placeholder
					this.setState({
						addTableData: addTableData,
						show_flag:true,
					});
				},
			});
		} else if (this.cur_operate_type == 'search_goods_type') {
			dispatch({
				type: 'product/get_goods_type_list',
				payload: { ...params },
				callback: (res) => {
					addTableData[0].table = res.data;
					addTableData[0].type = 'modal_table_sele';
					addTableData[0].isCheck = false;
					addTableData[0].columns = type_list_column();
					addTableData[0].rowKey = 'typeId';
					addTableData[0].add = false;
					addTableData[0].topSeaplaceHolder = `${sldComLanguage('请输入类型名称')}`;//搜索框的placeholder
					this.setState({
						addTableData: addTableData,
						show_flag:true,
					});
				},
			});
		} else if (this.cur_operate_type == 'search_product_enterprise') {
		  //选择生产企业
			dispatch({
				type: 'product/enterprises',
				payload: { ...params },
				callback: (res) => {
					addTableData[0].table = res.data;
					addTableData[0].type = 'modal_table_sele';
					addTableData[0].isCheck = false;
					addTableData[0].columns = enterprise_list_column();
					addTableData[0].rowKey = 'enterprisesId';
					addTableData[0].add = false;
          addTableData[0].search_right = 647;//搜索框里删除按钮距离右边的距离
					addTableData[0].topSeaplaceHolder = `${sldComLanguage('请输入生产企业')}`;//搜索框的placeholder
					this.setState({
						addTableData: addTableData,
						show_flag:true,
					});
				},
			});
		}
	};

	//搜索内容
	modalSearch = (val) => {
		let { params, addTableData } = this.state;
		addTableData[0].search_value = val;
		let search_key = 'name';
		if(this.cur_operate_type == 'search_spec_more'){
			search_key =  'specName';
		}else if(this.cur_operate_type == 'search_brand_more'){
			search_key =  'brandName';
		}else if(this.cur_operate_type == 'search_attr_more'){
			search_key =  'attributeName';
		}else if(this.cur_operate_type == 'search_goods_type'){
			search_key =  'typeName';
		}else if(this.cur_operate_type == 'search_product_enterprise'){
			search_key =  'enterprisesName';
		}
		params[search_key] = val;
		this.get_list(params);
		this.setState({
			formValues: { ...params},
			addTableData: addTableData,
      params: { pageSize: pageSize }
		});
	};

	//搜索内容
	modalSearchCon = (val) => {
		let { addTableData } = this.state;
		addTableData[0].search_value = val.target.value;
		this.setState({
			addTableData: addTableData,
		});
	};

	//清空搜索内容
	sldSearClear = () => {
		let { addTableData } = this.state;
		addTableData[0].search_value = '';
		this.setState({
			addTableData: addTableData,
		});
		this.modalSearch('');
	};

	//表格数据的确认操作-将选中的数据传回到父组件
	sldHandleTableConfirm = (val) => {
		if (this.cur_operate_type == 'search_brand_more' || this.cur_operate_type == 'search_spec_more' || this.cur_operate_type == 'search_attr_more') {
			this.props.seleCurData(this.selectedRows, this.selectedRowKeys);
		} else {
			this.props.seleCurData(this.modalTableSeleData);
		}
		this.clearSeleData();
		this.sldHandleTableCancle();
	};

	handleTablePagination = (pagination, filtersArg, sorter) => {
		const { formValues } = this.state;
		const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
		comm_cur_page_global.cur = pagination.current;
    pageSize = params.pageSize;
		this.setState({
			params: params,
		});
		this.get_list(params);
	};

	//列表展示对话框隐藏
	sldHandleTableCancle = () => {
		this.clearSeleData();
		comm_cur_page_global.cur = 1;//列表序号重置为1
		this.props.sldHandleTableCancle();
	};

	render() {
		const { addTableData, tableTitle, search_modal_width, modalTableVisible,show_flag } = this.state;
		return (
			<div className={`${global.common_page_20}`}>
				{/*列表展示对话框-start*/}
				{
					show_flag&&<SldModal
						destroyOnClose={true}
						zIndex={11}
						title={tableTitle}
						width={search_modal_width}
						modalVisible={modalTableVisible}
						sldHandleConfirm={(val) => this.sldHandleTableConfirm(val)}
						sldHandleCancle={this.sldHandleTableCancle}
						formItemLayoutModal={formItemLayoutModal}
						content={addTableData}
					/>
				}
				{/*列表展示对话框-end*/}
			</div>
		);
	}
}
