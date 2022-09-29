import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {Form, Spin, Modal, } from 'antd';
import {
	failTip,
	list_com_page_size_10,
	isEmptyObject,
	getTableNum,
	sldComLanguage,
	sldHandlePaginationData,
	dragSldTableColumn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ activity }) => ({
	activity,
}))
@Form.create()
export default class SldSelGoodsSingle extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			rowKey:'id',//table唯一标识别
			expandedRowKeys: [],
			link_type: props.link_type,//链接类型
			modalAddSkuIsShow: false,//是否展示modal框
			width: 900,//modal框宽带
			modaltitle: `${sldComLanguage('选择器')}`,//选择器
			params: { pageSize: pageSize },//搜索条件
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('商品名称')}`,//商品名称
				name: 'q_name1',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`,//请输入商品名称
			},],//筛选器
			loading: false,
			data: {},//表格的数据
			selectedRows: [],
			selectedRowKeys: [],
			columns: [],
			sldpagination: true,//是否展示分页
		};

	}

	init_flag = true;

	goods_columns = [
		{
			title: ' ',
			dataIndex: 'id',
			align: 'center',
			width: 55,
			render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
		},
		{
			title: `${sldComLanguage('商品名称')}`,//商品名称
			dataIndex: 'name1',
			align: 'center',
			width: 200,
		}, {
			title: `${sldComLanguage('商品分类名称')}`,//商品分类名称
			dataIndex: 'goodsCategoryName',
			align: 'center',
			width: 150,
		}, {
			title: `${sldComLanguage('库存')}`,//库存
			dataIndex: 'goodsStock',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('PC价(元)')}`,//PC价(元)
			dataIndex: 'mallPcPrice',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('移动端价(元)')}`,//移动端价(元)
			dataIndex: 'mallMobilePrice',
			align: 'center',
			width: 100,
		}, {
			title: `${sldComLanguage('上架时间')}`,//上架时间
			dataIndex: 'upTime',
			align: 'center',
			width: 150,
		},
	];
	recommend_goods_columns = [
		{
			title: ' ',
			dataIndex: 'linkUrl',
			align: 'center',
			width: 55,
			render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
		},
		{
			title: `${sldComLanguage('商品名称')}`,//商品名称
			dataIndex: 'goodsName',
			align: 'center',
			width: 200,
		}, {
			title: `${sldComLanguage('商品分类名称')}`,//商品分类名称
			dataIndex: 'goodsCategoryName',
			align: 'center',
			width: 150,
		}, {
			title: `${sldComLanguage('库存')}`,//库存
			dataIndex: 'goodsStock',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('PC价(元)')}`,//PC价(元)
			dataIndex: 'mallPcPrice',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('移动端价(元)')}`,//移动端价(元)
			dataIndex: 'mallMobilePrice',
			align: 'center',
			width: 100,
		}
	];

	special_goods_columns = [
		{
			title: ' ',
			dataIndex: 'linkUrl',
			align: 'center',
			width: 55,
			render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
		},
		{
			title: `${sldComLanguage('商品名称')}`,//商品名称
			dataIndex: 'goodsName',
			align: 'center',
			width: 200,
		},  {
			title: `${sldComLanguage('库存')}`,//库存
			dataIndex: 'stock',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('PC价(元)')}`,//PC价(元)
			dataIndex: 'pcPrice',
			align: 'center',
			width: 100,
		},
		{
			title: `${sldComLanguage('移动端价(元)')}`,//移动端价(元)
			dataIndex: 'mobilePrice',
			align: 'center',
			width: 100,
		}
	];

	cat_columns = [
		{
			title: `${sldComLanguage('分类名称')}`,//分类名称
			align: 'left',
			dataIndex: 'name',
			width: 250,
		},
	];

	componentDidMount() {
		if (this.props.link_type != '') {
			this.get_list({ pageSize: pageSize });
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		let { columns, modaltitle,rowKey } = this.state;
		if (nextProps.link_type == 'goods' || nextProps.link_type == 'category' || nextProps.link_type == 'recommend_goods'|| nextProps.link_type == 'special_goods'|| nextProps.link_type == 'integer_goods'|| nextProps.link_type == 'jtt_goods'|| nextProps.link_type == 'group_goods'|| nextProps.link_type == 'flash_goods') {
			if (nextProps.link_type == 'goods') {
				rowKey = 'id';
				columns = this.goods_columns;
				modaltitle = `${sldComLanguage('选择商品')}`;//选择商品
			} else if (nextProps.link_type == 'category') {
				rowKey = 'id';
				columns = this.cat_columns;
				modaltitle = `${sldComLanguage('选择分类')}`;//选择分类
			} else if (nextProps.link_type == 'recommend_goods') {
				rowKey = 'upTime';
				columns = [...this.special_goods_columns,{
					title: `抢购价`,//抢购价
					dataIndex: 'price',
					align: 'center',
					width: 100,
				}];
				modaltitle = `${sldComLanguage('选择推荐商品')}`;//选择推荐商品
			} else if (nextProps.link_type == 'special_goods') {
				rowKey = 'upTime';
				columns = this.special_goods_columns;
				modaltitle = `${sldComLanguage('选择专题商品')}`;//选择专题商品
			} else if (nextProps.link_type == 'integer_goods') {
				rowKey = 'upTime';
				columns = [...this.special_goods_columns,{
					title: `${sldComLanguage('现金+积分')}`,//现金+积分
					dataIndex: 'price',
					align: 'center',
					width: 100,
					render: (text, record, index) => {
						return text+'+'+record.integral;//图片预览
					},
				}];
				modaltitle = `${sldComLanguage('选择积分商品')}`;//选择积分商品
			} else if (nextProps.link_type == 'jtt_goods') {
				rowKey = 'upTime';
				columns = [...this.special_goods_columns,{
					title: `${sldComLanguage('初始价格')}`,//初始价格
					dataIndex: 'price',
					align: 'center',
					width: 100,
				}];
				modaltitle = `${sldComLanguage('选择阶梯团商品')}`;//选择阶梯团商品
			} else if (nextProps.link_type == 'group_goods') {
				rowKey = 'upTime';
				columns = [...this.special_goods_columns,{
					title: `${sldComLanguage('团购价')}`,//团购价
					dataIndex: 'price',
					align: 'center',
					width: 100,
				}];
				modaltitle = `${sldComLanguage('选择团购商品')}`;//选择团购商品
			} else if (nextProps.link_type == 'flash_goods') {
				rowKey = 'upTime';
				columns = [...this.special_goods_columns,{
					title: `${sldComLanguage('抢购价')}`,//抢购价
					dataIndex: 'price',
					align: 'center',
					width: 100,
				}];
				modaltitle = `${sldComLanguage('选择限时抢购商品')}`;//选择限时抢购商品
			}
			this.setState({
				rowKey,
				link_type: nextProps.link_type,
				modalAddSkuIsShow: true,
				columns,
				modaltitle,
			}, () => {
				sthis.get_list({ pageSize: pageSize });
			});
		}
	}

	componentWillUnmount() {

	}

	//获取数据列表
	get_list = (params) => {
		this.setState({ loading: true });
		const { dispatch,link_type } = this.props;
		let { data } = this.state;
		let dis_type = '';
		let new_params = { ...params };
		if (link_type == 'goods') {
			//获取商品数据
			dis_type = 'activity/get_goods_spu_lists';
			new_params.state = 3;
		} else if (link_type == 'category') {
			//获取分类数据
			dis_type = 'activity/get_cate_list';
		} else if (link_type == 'recommend_goods') {
			//获取推荐商品
			dis_type = 'activity/get_recommend_banner_goods';
		} else if (link_type == 'special_goods') {
			//获取专题商品
			dis_type = 'activity/get_special_banner_goods';
			new_params.channel = this.props.channel;
		} else if (link_type == 'integer_goods') {
			//获取专题商品
			dis_type = 'activity/get_integer_banner_goods';
			new_params.channel = this.props.channel;
		} else if (link_type == 'jtt_goods') {
			//获取阶梯团商品
			dis_type = 'activity/get_jtt_banner_goods';
			new_params.channel = this.props.channel;
		} else if (link_type == 'group_goods') {
			//获取团购商品
			dis_type = 'activity/get_group_banner_goods';
			new_params.channel = this.props.channel;
		} else if (link_type == 'flash_goods') {
			//获取限时抢购商品
			dis_type = 'activity/get_flash_banner_goods';
			new_params.channel = this.props.channel;
		}
		dispatch({
			type: dis_type,
			payload: new_params,
			callback: (res) => {
				this.setState({ loading: false });
				if (res.state == 200) {
					if (res.data.length == 0 && this.state.params.currentPage > 1) {
						params.currentPage = params.currentPage - 1;
						this.get_list(params);
					} else {
						if (link_type == 'goods') {
							data = res.data;
						} else if (link_type == 'category') {
							data = { list: res.data, pagination: {} };
						} else if (link_type == 'recommend_goods'||link_type == 'special_goods'||link_type == 'integer_goods'||link_type == 'jtt_goods'||link_type == 'group_goods'||link_type == 'flash_goods') {
							data = res.data;
						}
						this.setState({
							data,
						});
					}
				}
			},
		});
	};

	handleSelectRows = (rows, rowkeys) => {
		//针对翻页无法保存选择的行数据处理
		let { selectedRows, selectedRowKeys } = this.state;
		let pre_sele_rows_keyarray = [];
		for (let i in selectedRows) {
			pre_sele_rows_keyarray.push(selectedRows[i].id);
		}
		//去掉的话要删掉行数据
		for (let i in selectedRowKeys) {
			if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
				selectedRows = selectedRows.filter(item => item.id != selectedRowKeys[i]);
			}
		}
		//没有的话追加行数据
		for (let i in rowkeys) {
			if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
				let cur_row = rows.filter(item => item.id == rowkeys[i])[0];
				selectedRows.push(cur_row);
			}
		}
		this.setState({
			selectedRows: selectedRows,
			selectedRowKeys: rowkeys,
		});
	};

	//搜索事件
	search = (data) => {
    for (let i in data) {
      if (data[i] == '') {
        delete data[i];
      }
    }
		this.setState({
			formValues: data,
		});
		this.get_list({ pageSize: pageSize, ...data });
	};
	//搜索重置事件
	seaReset = () => {
		//搜索条件置为空
		this.setState({
			formValues: {},
			selectedKeys: [' '],
      params: { pageSize: pageSize }
		});
		this.get_list({ pageSize: pageSize });
	};

	sldConfirm = () => {
		let { modalTableSeleData } = this.state;
		if (!isEmptyObject(modalTableSeleData)) {
			this.setState({
				modalAddSkuIsShow: false,
				link_type: '',
			});
			this.props.seleSku(modalTableSeleData);
		} else {
			failTip(`${sldComLanguage('请选择数据')}`);//请选择数据
		}
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.init_flag = true;
	};

	//取消事件
	sldCancle = () => {
		this.props.sldHandleCancle();
		this.setState({
			modalAddSkuIsShow: false,
			link_type: '',
		});
	};

	//选中单行的操作
	onSldHandleSeleRow = (record) => {
		this.setState({
			modalTableSeleData: record,
		});
	};

	onExpand = (expanded, record) => {
		let { expandedRowKeys } = this.state;
		if (expanded) {
			expandedRowKeys.push(record.id);
		} else {
			expandedRowKeys = expandedRowKeys.filter(item => item != record.id);
		}
		this.setState({ expandedRowKeys });
	};

	//表格列拖动
	resizeTable = (index, size, type, data) => {
		let datas = dragSldTableColumn(index, size, data);
		this.setState({ [type]: datas });
	};

	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
		if (type == 'main') {
			const { formValues } = this.state;
			const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
			pageSize = params.pageSize;
			this.setState({
				params: params,
			});
			this.get_list(params);
		}
	};


	render() {
		const { link_type } = this.props;
		const { modalAddSkuIsShow, modaltitle, width, data, columns, search_data, loading, sldpagination, expandedRowKeys,rowKey } = this.state;
		return (
			<Modal destroyOnClose={true}
				   onOk={this.sldConfirm}
				   afterClose={this.closeReset}
				   onCancel={this.sldCancle} visible={modalAddSkuIsShow} width={width} title={modaltitle}>

				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<div className={global.common_page} style={{ flex: 1 }}>
						{link_type != 'category' &&
						<div className={global.tableListForm}>
							<div style={{ position: 'relative' }}>
								<Search search_data={search_data} top={0} seaSubmit={(data) => this.search(data)}
										seaReset={() => this.seaReset()}/>
							</div>
						</div>
						}
						<Scrollbars autoHeight
									autoHeightMin={50}
									autoHeightMax={document.body.clientHeight - 500}>
							<Spin spinning={loading}>
								{/*标准表格-start*/}
								<StandardTable
									expandedRowKeys={expandedRowKeys}
									selectedRows={[]}
									selectedRowKeys={[]}
									data={data}
									rowKey={rowKey}
									isCheck={false}
									columns={columns}
									onSldHandleSeleRow={this.onSldHandleSeleRow}
									onSelectRow={this.handleSelectRows}
									flag_show_sele_data={true}
									sldpagination={sldpagination}
									onExpand={this.onExpand}
									onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
									resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
									isColumnResize={true}
								/>
								{/*标准表格-end*/}
							</Spin>
						</Scrollbars>
					</div>
				</div>
			</Modal>
		);
	}
}
