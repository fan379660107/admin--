import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
	dragSldTableColumn,
	sldHandlePaginationData,
	list_com_page_size_10,
	sldLlineRtextAddGoodsAddMargin,
	sldComLanguage,
  sldtbaleOpeBtnText,
} from '@/utils/utils';
import Link from 'umi/link';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';

let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_10;
@connect(({ agreement }) => ({
	agreement,
}))
@Form.create()
export default class Lists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			loading: false,//按钮loading
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: '',
			params: { pageSize: pageSize },//搜索条件
			columns: [
				{
					title: ' ',
					dataIndex: 'agreementCode',
					align: 'center',
					width: 55,
					render: (text, record, index) => {
						return (comm_cur_page - 1) * pageSize + index + 1;
					},
				},
				{
					title: `${sldComLanguage('标题')}`,
					width: 150,
					align: 'center',
					dataIndex: 'title',
				},
				{
					title: `${sldComLanguage('时间')}`,
					dataIndex: 'updateTime',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('操作')}`,
					align: 'center',
					width: 100,
					render: (text, record) => (
						<Fragment>
							<Link to={{
								pathname: '/sysset_agreement/lists_to_edit',
								query: { agreementCode: record.agreementCode, source: '/sysset_agreement/lists' },
							}}>
								{
                  sldtbaleOpeBtnText(sldComLanguage('编辑'), null)
								}
							</Link>
						</Fragment>
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
		const { dispatch } = this.props;
		dispatch({
			type: 'agreement/get_agreement_lists',
			payload: params,
			callback: (res) => {
				this.setState({ loading: false });
				if (res.state == 200) {
					if (res.data.length == 0 && this.state.params.current > 1) {
						params.current = params.current - 1;
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

	render() {
		const { selectedRows, columns, data, loading } = this.state;
		return (
			<div className={global.common_page}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('协议')}${sldComLanguage('管理')}`, 0, 0, 10)}
				<Spin spinning={loading}>
					{ /*标准表格-start*/}
					<StandardTable
						selectedRows={selectedRows}
						data={data}
						rowKey={'agreementCode'}
						isCheck={false}
						columns={columns}
						onSelectRow={this.handleSelectRows}
						onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
						resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
						isColumnResize={true}
					/>
					{ /*标准表格-end*/}
				</Spin>

			</div>
		);
	}
}
