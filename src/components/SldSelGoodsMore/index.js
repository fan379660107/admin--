import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
	 Form, Spin, Modal,
} from 'antd';
import {
	failTip,
	sldPopConfirm,
	list_com_page_size_10,
	getTableNum,
	sldComLanguage,
	getSldEmptyH,
	sldtbaleOpeBtn,
	sldHandlePaginationData,
	dragSldTableColumn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ pc_home,project }) => ({
	pc_home,
	project,
}))
@Form.create()
export default class SldSelGoodsMore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			modalVisible: false,
			loading: false,
			data: {},
			title: '',
			params: { pageSize: pageSize },//搜索条件
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('商品名称')}`,//商品名称
				name: 'goodsName',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`,//请输入商品名称
			},
			],
			sel_columns: [
				{
					title: ' ',
					dataIndex: 'goodsId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum({}, pageSize, index),
				},
				{
					title: `${sldComLanguage('商品图片')}`,//商品图片
					dataIndex: 'mainImgUrl',
					align: 'center',
					width: 70,
					render: (text, record) => (
						<div className={global.goods_modal_img}><img src={text}/></div>
					),
				},
				{
					title: `${sldComLanguage('商品名称')}`,//商品名称
					dataIndex: 'goodsName',
					align: 'center',
					width: 200,
				},
        {
          title: `价格(元)`,//价格
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
				{
					title: `操作`,//操作
					align: 'center',
					width: 60,
					render: (text, record) => {
						return sldPopConfirm('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delSelGoods(record.id), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtn(sldComLanguage('删除'), 'shanchu2', null), 0, 0, '#1890ff')//删除 删除后不可恢复，是否确定删除？
					}

				},
			],
			columns: [
				{
					title: ' ',
					dataIndex: 'goodsId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('商品图片')}`,//商品图片
					dataIndex: 'mainImgUrl',
					align: 'center',
					width: 70,
					render: (text, record) => (
						<div className={global.goods_modal_img}><img src={text}/></div>
					),
				},
				{
					title: `${sldComLanguage('商品名称')}`,//商品名称
					dataIndex: 'goodsName',
					align: 'center',
					width: 200,
				}, {
					title: `${sldComLanguage('库存')}`,//库存
					dataIndex: 'goodsStock',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('价格(元)')}`,//价格
					dataIndex: 'goodsPrice',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('商品状态')}`,//商品状态
					dataIndex: 'stateValue',
					align: 'center',
					width: 100,
				}, {
					title: `${sldComLanguage('发布时间')}`,//发布时间
					align: 'center',
					dataIndex: 'createTime',
					width: 150,
				},
			],
			formValues: {},//搜索条件
		};
	}

	init_flag = true;

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.get_list({ pageSize: pageSize });
		this.setState({
			selectedRows: [...nextProps.selectedRows],
			selectedRowKeys: [...nextProps.selectedRowKeys],
		});
	}

	componentWillUnmount() {

	}

	//获取数据列表
	get_list = (params) => {
		this.setState({ loading: true });
		const { dispatch } = this.props;
		let dis_type = '';
		let new_params = { ...params };
		dis_type = 'project/get_goods_spu_lists';
		new_params.state = 2;
		dispatch({
			type: dis_type,
			payload: new_params,
			callback: (res) => {
				this.setState({ loading: false });
				if (res.state == 200) {
					if (res.data.list.length == 0 && this.state.params.current > 1) {
						params.current = params.current - 1;
						this.get_list(params);
					} else {
						this.setState({
							data: res.data,
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
			pre_sele_rows_keyarray.push(selectedRows[i].goodsId);
		}
		//去掉的话要删掉行数据
		for (let i in selectedRowKeys) {
			if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
				selectedRows = selectedRows.filter(item => item.goodsId != selectedRowKeys[i]);
			}
		}
		//没有的话追加行数据
		for (let i in rowkeys) {
			if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
				let cur_row = rows.filter(item => item.goodsId == rowkeys[i])[0];
				selectedRows.push(cur_row);
			}
		}
		this.setState({
			selectedRows: selectedRows,
			selectedRowKeys: rowkeys,
		});
	};

	//删除选中的商品
	delSelGoods = (id) => {
		let { selectedRows, selectedRowKeys } = this.state;
		selectedRows = selectedRows.filter(item => item.id != id);
		selectedRowKeys = selectedRowKeys.filter(item => item != id);
		this.setState({
			selectedRows: selectedRows,
			selectedRowKeys: selectedRowKeys,
		});
	}


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


	//搜索事件
	search = (data) => {
		this.setState({
			formValues: data,
      params: { pageSize: pageSize }
		});
		this.get_list({ pageSize: pageSize, ...data });
	};
	//搜索重置事件
	seaReset = () => {
		//搜索条件置为空
		this.setState({
			formValues: {},
      params: { pageSize: pageSize }
		});
		this.get_list({ pageSize: pageSize });
	};

	//取消事件
	sldCancle = () => {
		this.setState({
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			params:{pageSize:pageSize}
		});
		this.props.sldHandleAddSkuModalCancle();
	};

	sldConfirm = () => {
		let { selectedRows, selectedRowKeys } = this.state;
		if (selectedRowKeys.length > 0) {
			if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
				failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
				return false;
			}
			if (this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
				failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个商品')}`);//该模块需要选择   个商品
				return false;
			}
			let tmp_rows = [];
			for (let i in selectedRows) {
				tmp_rows.push({
          goodsId: selectedRows[i].goodsId,
          goodsName: selectedRows[i].goodsName,
          goodsPrice: selectedRows[i].goodsPrice,
          goodsStock: selectedRows[i].goodsStock,
					mainImgUrl: selectedRows[i].mainImgUrl,
          stateValue: selectedRows[i].stateValue,
				});
			}
			this.props.seleSku(tmp_rows, selectedRowKeys);
			this.props.sldHandleAddSkuModalCancle();
		} else {
			failTip(`${sldComLanguage('请选择商品')}`);//请选择商品
		}
		this.setState({params:{pageSize:pageSize}})
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.init_flag = true;
	};

	render() {
		const { modalAddSkuIsShow, width, modaltitle } = this.props;
		const { selectedRows, search_data, data, loading, selectedRowKeys,sel_columns,columns } = this.state;
		return (
			<Modal destroyOnClose={true}
				   onOk={this.sldConfirm}
				   afterClose={this.closeReset}
				   onCancel={this.sldCancle} visible={modalAddSkuIsShow} width={width} title={modaltitle}>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<div className={global.common_page} style={{ flex: 1 }}>
						{/*标准表格-start*/}
						{selectedRows.length>0&&
							<Fragment>
								<StandardTable
									totalHeight={200}
									selectedRows={[]}
									selectedRowKeys={[]}
									data={{list:selectedRows}}
									rowKey={'goodsId'}
									isCheck={false}
									columns={sel_columns}
									onSldHandleSeleRow={null}
									onSelectRow={null}
									onChange={null}
									sldpagination={false}
								/>
								{getSldEmptyH(10)}
							</Fragment>
						}
						{/*标准表格-end*/}

						<div className={global.tableListForm}>
							<div style={{ position: 'relative' }}>
								<Search search_data={search_data} top={0} seaSubmit={(data) => this.search(data)}
										seaReset={() => this.seaReset()}/>
							</div>
						</div>
						<Spin spinning={loading}>
							{/*标准表格-start*/}
							<StandardTable
								selectedRows={selectedRows}
								selectedRowKeys={selectedRowKeys}
								data={data}
								rowKey={'goodsId'}
								isCheck={true}
								columns={columns}
								onSelectRow={this.handleSelectRows}
								flag_show_sele_data={true}
								onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
								resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
								isColumnResize={true}
							/>
							{/*标准表格-end*/}
						</Spin>
					</div>
				</div>

			</Modal>
		);
	}
}
