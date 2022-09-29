import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
	failTip,
	sucTip,
	sldPopConfirm,
	dragSldTableColumn,
	sldHandlePaginationData,
	list_com_page_size_10,
	sldLlineRtextAddGoodsAddMargin,
	sldComLanguage,
	sldtbaleOpeBtn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
let comm_cur_page = 1;//当前页数
let sthis = '';
@connect(({ order }) => ({
	order,
}))
@Form.create()
export default class Order_return_lists extends Component {
	constructor(props) {
		super(props);
		sthis = this;
		this.state = {
			isReset: false,//是否清空搜索条件的内容
			loading: false,
			data: {},
			title: '',
			params: {pageSize:pageSize},//搜索条件
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('订单号')}`,//订单号
				name: 'q_orderSn',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号')}`,//请输入订单号
			}, {
				type: 'select',
				label: `${sldComLanguage('退货状态')}`,//退货状态
				name: 'q_stateReturn',
				placeholder: `${sldComLanguage('请选择')}${sldComLanguage('退货状态')}`,//请选择退货状态
				sel_data: [
					{ key: '', name: `${sldComLanguage('全部')}` },//全部
					{ key: '1', name: `${sldComLanguage('未处理')}` },//未处理
					{ key: '2', name: `${sldComLanguage('审核通过')}` },//审核通过
					{ key: '3', name: `${sldComLanguage('用户发货')}` },//用户发货
					{ key: '4', name: `${sldComLanguage('店铺收货')}` },//店铺收货
					{ key: '5', name: `${sldComLanguage('不予处理')}` },//不予处理
				],
			}, {
				type: 'select',
				label: `${sldComLanguage('退款状态')}`,//退款状态
				name: 'q_stateMoney',
				placeholder: `${sldComLanguage('请选择')}${sldComLanguage('退款状态')}`,//请选择退款状态
				sel_data: [
					{ key: '', name: `${sldComLanguage('全部')}` },//全部
					{ key: '1', name: `${sldComLanguage('未退款')}`},//未退款
					{ key: '2', name: `${sldComLanguage('退款到账户')}`},//退款到账户
					{ key: '3', name: `${sldComLanguage('退款到银行')}`},//退款到银行
				],
			},
			],
			formValues: {},//搜索条件
			expandData: [{
				key: `${sldComLanguage('订单号')}：`,//订单号
				val: 'orderSn',
			}, {
				key: `${sldComLanguage('创建时间')}：`,//创建时间
				val: 'createTime',
			}, {
				key: `${sldComLanguage('问题描述')}：`,//问题描述
				val: 'question',
			}, {
				key: `${sldComLanguage('退货数量')}：`,//退货数量
				val: 'number',
			}, {
				key: `${sldComLanguage('退款金额')}：`,//退款金额
				val: 'returnMoney',
			}, {
				key: `${sldComLanguage('退回积分')}：`,//退回积分
				val: 'returnIntegral',
			}, {
				key: `${sldComLanguage('退回优惠券')}：`,//退回优惠券
				val: 'returnVoucherUserId',
			}],//额外展开的信息
			columns: [
				{
					title: '',
					dataIndex: 'id',
					align: 'center',
					width: 55,
					render: (text, record, index) => {
						return (comm_cur_page - 1) * pageSize + index + 1;
					},
				},
				{
					title: `${sldComLanguage('订单号')}`,//订单号
					dataIndex: 'orderSn',
					align: 'center',
					width: 200,
				},
				{
					title: `${sldComLanguage('商品名称')}`,//商品名称
					dataIndex: 'goodsName',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('用户名')}`,//用户名
					dataIndex: 'memberName',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('问题描述')}`,//问题描述
					dataIndex: 'question',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('退货数量')}`,//退货数量
					dataIndex: 'number',
					align: 'center',
					width: 80,
				}, {
					title: `${sldComLanguage('退款金额')}`,//退款金额
					dataIndex: 'returnMoney',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('退货状态')}`,//退货状态
					dataIndex: 'stateReturnValue',
					align: 'center',
					width: 80,
				}, {
					title: `${sldComLanguage('退款状态')}`,//退款状态
					dataIndex: 'stateMoneyValue',
					align: 'center',
					width: 80,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 100,
					render: (text, record) => (
						record.stateReturn == 4 && record.stateMoney == 1
							? sldPopConfirm('leftBottom', `${sldComLanguage('order.order_return_lists.is_confirm_refund')}`, () => this.operateReturn(record.id, 'return_to_account'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtn(sldComLanguage('order.order_return_lists.confirm_refund'),'tuihuanhuo',null), 0, 0, '#1890ff')//确认退款 用户货款将由系统退还到用户的账户中，确认要退款吗？
						:'--'
					),
				},
			],
		};
	}

	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

	componentWillUnmount() {
	}


	//获取数据列表
	get_list = (params) => {
		this.setState({ loading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'order/get_order_return_lists',
			payload: { ...params },
			callback: (res) => {
				this.setState({ loading: false });
				if (res.state == 200) {
					if (res.data.length == 0 && this.state.params.currentPage > 1) {
						params.currentPage = params.currentPage - 1;
						this.get_list(params);
					} else {
						this.setState({
							data: res.data,
							isReset: false,
						});
					}
				}
			},
		});
	};

	operateReturn = (id, type) => {
		this.setState({ submiting: true });
		const { params } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		if (type == 'return_to_account') {
			//退款到账号
			dis_type = 'order/confirm_return_to_account';
			param_data.id = id;
		}
		dispatch({
			type: dis_type,
			payload: param_data,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
					this.setState({
						modalVisible: false,
					});
					this.get_list(params);
				} else {
					failTip(res.msg);
				}
				this.setState({ submiting: false });
			},
		});
	};


	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
		if (type == 'main') {
			const { formValues } = this.state;
			const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
			comm_cur_page = pagination.current;
      pageSize = params.pageSize;
			this.setState({
				params: params,
			});
			this.get_list(params);
		}
	};

	//搜索事件
	search = (data) => {
		const values = { ...data };
    for(let i in values){
      if(values[i] == ''){
        delete values[i]
      }
    }
		this.setState({
			formValues: values,
      params: { pageSize: pageSize }
		});
		this.get_list({ pageSize: pageSize, ...values });
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


	//表格拖动
	resizeTable = (index, size, type, data) => {
		let datas = dragSldTableColumn(index, size, data);
		this.setState({ [type]: datas });
	};


	render() {
		const { search_data, columns, data, loading, isReset, expandData } = this.state;
		return (
			<div className={global.common_page}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('退货管理')}`, 0, 0, 10)}{/* 退货管理*/}
				<div className={global.tableListForm}>
					<Search source={'four_five'} search_data={search_data}
							seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()} isReset={isReset}/>
				</div>
				<Spin spinning={loading}>
					{/*标准表格-start*/}
					<StandardTable
						expandData={expandData}
						selectedRows={[]}
						data={data}
						rowKey={'id'}
						isCheck={false}
						columns={columns}
						onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
						resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
						isColumnResize={true}
						showMarkColor={true}
					/>
					{/*标准表格-end*/}

				</Spin>
			</div>

		);
	}
}
