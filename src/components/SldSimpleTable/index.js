/*
* 封装的简单表格，没有搜索，没有操作，只有列表展示+分页
* */
import React, { Component, Fragment } from 'react';
import { dragSldTableColumn, sldHandlePaginationData,getSldEmptyH } from '@/utils/utils';
import StandardTable from '../StandardTable';

export default class SldSimpleTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,// 列表数据
			selectedRows: [],
			formValues: {},// 搜索条件
			columns: props.columns,
			rowKey: props.rowKey,
			sldpagination: props.sldpagination,
			isCheck: props.isCheck,
		};
	}

	componentDidMount() {
	}

	componentWillReceiveProps(props) {
		this.setState({
			data: props.data,
		});
	}

	handleSelectRows = (rows, rowkeys) => {
	};

	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
		const { formValues } = this.state;
		if (type == 'main') {
			const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
			this.props.handlePagination(params);
		}
	};

	//表格拖动
	resizeTable = (index, size, type, data) => {
		const datas = dragSldTableColumn(index, size, data);
		this.setState({ [type]: datas });
	};

	render() {
		const { selectedRows, columns, data, isCheck, sldpagination, rowKey } = this.state;
		return (
			<Fragment>
				{getSldEmptyH(10)}
				<StandardTable
					selectedRows={selectedRows}
					data={data}
					rowKey={rowKey}
					isCheck={isCheck}
					columns={columns}
					sldpagination={sldpagination}
					onSelectRow={this.handleSelectRows}
					onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
					onSldHandleSeleRow={this.onSldHandleSeleRow}
					resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
					isColumnResize={true}
				/>
			</Fragment>

		);
	}
}
