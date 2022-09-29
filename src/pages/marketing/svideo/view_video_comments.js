/*
* 视频的评论列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {  Form, Spin } from 'antd';
import {
	failTip,
	sucTip,
  sldPopConfirmDiy,
	list_com_page_size_10,
	dragSldTableColumn,
	sldHandlePaginationData,
	dateFormat,
	getTableNum,
	sldComLanguage,
	sldtbaleOpeBtnText,
	sldLlineRtextAddGoods,
	sldIconBtnBg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import CommentReplyLists from './comment_reply_lists';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class ViewVideoComments extends Component {
	constructor(props) {
		super(props);
		this.state = {
			commonId:'',
			preview_img: '',
			preview_alt_con: '',
			show_preview_modal: false,
			submiting:false,
			title:'',
			modalVisible:false,
			operateData:[],
			show_foot:false,
			query: props.location.query,
			initLoading: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			params: { pageSize: pageSize },//搜索条件
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('评论人')}`,//评论人
				name: 'authorName',
				placeholder: `${sldComLanguage('评论人名称')}`,//请输入评论人名称
			},{
				type: 'input',
				label: `${sldComLanguage('评论内容')}`,//评论内容
				name: 'content',
				placeholder: `${sldComLanguage('评论内容')}`,//请输入评论内容
			},{
				type: 'rangepicker',
				label: `${sldComLanguage('评论时间')}`,//评论时间
				name: 'comment_time',
				placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
				placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
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
					title: `${sldComLanguage('评论内容')}`,//评论内容
					dataIndex: 'content',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('评论人名称')}`,//评论人名称
					dataIndex: 'authorName',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('获赞数')}`,//获赞数
					dataIndex: 'likeNum',
					align: 'center',
					width: 100,
				}, {
					title: `${sldComLanguage('评论时间')}`,//评论时间
					dataIndex: 'createTime',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 80,
					render: (text, record) => (
						<Fragment>
							{
							sldtbaleOpeBtnText(`${sldComLanguage('查看回复')}`,() => this.viewReply(record))//查看回复
							}
							<span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateComment(record.commentId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
						</Fragment>
					),
				},
			],
		};
	}

	cur_data = '';

	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		const { query } = this.state;
		dispatch({
			type: 'svideo/get_video_comments',
			payload: { ...params, videoId: query.id},
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

	viewReply = (record) => {
			//获取评论的所有回复
		 this.setState({
			 modalVisible:true,
			 commentId:record.commentId,
		 })
	}

	sldModalCancle = () => {
		this.setState({ modalVisible: false });
	};

	//视频评论操作  id: 评论id
	operateComment = (id) => {
		this.setState({ submiting: true });
		const { params } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		dis_type = 'svideo/del_video_comment_and_reply';
		param_data.commentId = id;
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
				this.setState({ submiting: false,modalVisible:false, });
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

	//搜索事件
	search = (data) => {
		const values = { ...data };
    //时间处理
    if (values.comment_time) {
      values.startTime = values.comment_time[0] ? values.comment_time[0].format(dateFormat)+' 00:00:00' : '';
      values.endTime = values.comment_time[1] ? values.comment_time[1].format(dateFormat)+ ' 23:59:59' : '';
      delete values.comment_time;
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

	//预览图片/关闭预览图片
	viewImg = (flag, img = '', text = '') => {
		this.setState({
			preview_img: img,
			preview_alt_con: text,
			show_preview_modal: flag,
		});
	};


	render() {
		const { selectedRows, search_data, columns, initLoading, data, show_preview_modal, preview_img, preview_alt_con,expandData,query,submiting,title,modalVisible,operateData,show_foot,commentId} = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				<div className={global.flex_com_space_between} style={{marginBottom: 8,}}>
					{sldLlineRtextAddGoods('#FA6F1E',`${sldComLanguage('查看')}` + query.videoName + `${sldComLanguage('的评论')}`)}
					{sldIconBtnBg(() => this.props.history.goBack(),'fanhui',`${sldComLanguage('返回上级页面')}`,'#fff',7,0)}
				</div>
				<div className={global.tableListForm}>
					<Search search_data={search_data}
							seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
				</div>
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
						selectedRows={selectedRows}
						data={data}
						rowKey={'commentId'}
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
				<CommentReplyLists modalVisible={modalVisible} commentId = {commentId} sldModalCancle={()=>this.sldModalCancle()}/>
				{/*图片预览-start*/}
				<SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
							   preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
				{/*图片预览-end*/}
			</div>

		);
	}
}
