/*
* 评论回复列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Modal, Spin } from 'antd';
import {
	failTip,
	sucTip,
	list_com_page_size_10,
	dragSldTableColumn,
	sldHandlePaginationData,
  sldPopConfirmDiy,
	dateFormat,
	getTableNum,
	sldComLanguage,
	sldtbaleOpeBtnText,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class CommentReplyLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initLoading: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: `${sldComLanguage('查看回复')}`,
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('回复人')}`,
				name: 'fromAuthorName',
				placeholder: `${sldComLanguage('请输入回复人名称')}`,
			},{
				type: 'input',
				label: `${sldComLanguage('被回复人')}`,
				name: 'toAuthorName',
				placeholder: `${sldComLanguage('请输入被回复人名称')}`,
			},{
				type: 'input',
				label: `${sldComLanguage('回复内容')}`,
				name: 'content',
				placeholder: `${sldComLanguage('请输入回复内容')}`,
			},{
				type: 'rangepicker',
				label: `${sldComLanguage('回复时间')}`,
				name: 'reply_time',
				placeholder1: `${sldComLanguage('开始时间')}`,
				placeholder2: `${sldComLanguage('结束时间')}`,
			}],
			formValues: {},//搜索条件
			columns: [
				{
					title: ' ',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('回复内容')}`,
					dataIndex: 'content',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('回复时间')}`,
					dataIndex: 'createTime',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('回复人名称')}`,
					dataIndex: 'fromAuthorName',
					align: 'center',
					width: 100,
				},{
					title: `${sldComLanguage('被回复人名称')}`,
					dataIndex: 'toAuthorName',
					align: 'center',
					width: 100,
				},{
					title: `${sldComLanguage('获赞数')}`,
					dataIndex: 'likeNum',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 80,
					render: (text, record) => (
						<Fragment>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage(`${sldComLanguage('删除后不可恢复，是否确定删除')}`)}`, () => this.operateCommentReply(record.replyId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
						</Fragment>
					),
				},
			],
		};
	}

	commentId = '';

	componentDidMount() {
		if(this.props.commentId){
			this.commentId = this.props.commentId;
			this.get_list({ pageSize: pageSize });
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.commentId = nextProps.commentId;
		if(nextProps.commentId){
			this.get_list({ pageSize: pageSize });
		}
	}

	//评论回复操作  id: 回复id
	operateCommentReply = (id) => {
		const { params } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		dis_type = 'svideo/del_video_comment_reply';
		param_data.replyId = id;
		dispatch({
			type: dis_type,
			payload: param_data,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
					this.get_list(params);
				} else {
					failTip(res.msg);
				}
			},
		});
	};

	//获取数据列表(获取所有的视频，未审核通过的不在内)
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'svideo/get_video_comment_reply',
			payload: { ...params,commentId:this.commentId},
			callback: (res) => {
				this.setState({ initLoading: false });
				if (res.state == 200) {
					if (res.data.length == 0 && this.state.params.currentPage > 1) {
						params.currentPage = params.currentPage - 1;
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

	sldCancle = () => {
		this.props.sldModalCancle();
	};

	sldConfirm = (val) => {
		this.props.sldModalCancle();
	};

	//搜索事件
	search = (data) => {
		const values = { ...data };
		//时间处理
		if (values.reply_time) {
			values.startTime = values.reply_time[0] ? values.reply_time[0].format(dateFormat)+' 00:00:00' : '';
			values.endTime = values.reply_time[1] ? values.reply_time[1].format(dateFormat)+ ' 23:59:59' : '';
			delete values.reply_time;
		}
    for(let i in values){
      if(values[i] == ''){
        delete values[i]
      }
    }
		this.setState({
			formValues: values,
		});
		this.get_list({ pageSize: pageSize, ...values });
	};
	//搜索重置事件
	seaReset = () => {
		//搜索条件置为空
		this.setState({
			formValues: {},
		});
		this.get_list({ pageSize: pageSize });
	};

	//关闭modal之后重置数据
	closeReset = () => {
		this.props.form.resetFields();
	};

	render() {
		const { selectedRows, search_data, columns, initLoading, data, } = this.state;
		const {modalVisible} = this.props;
		return (
			<Modal
				centered
				destroyOnClose={true}
				title={`${sldComLanguage('查看回复')}`}
				afterClose={this.closeReset}
				width={1000}
				visible={modalVisible}
				onOk={this.sldConfirm}
				onCancel={this.sldCancle}
				footer={false}
			>
        <div style={{margin:10}}>
				<div className={global.tableListForm}>
					<Search search_data={search_data}
							seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
				</div>
				<Spin spinning={initLoading} style={{paddingLeft:10}}>
					{/*标准表格-start*/}
					<StandardTable
						paddingLeft={10}
						width={980}
						selectedRows={selectedRows}
						data={data}
						rowKey={'replyId'}
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
        </div>
			</Modal>

		);
	}
}
