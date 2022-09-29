/*
* 评论列表*/
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {  Form, Spin } from 'antd';
import Link from 'umi/link';
import {
	failTip,
	sucTip,
  sldPopConfirmDiy,
	list_com_page_size_10,
	dragSldTableColumn,
	sldHandlePaginationData,
	sldLlineRtextAddGoodsAddMargin,
	formItemLayoutModal,
	getTableNum,
	sldComLanguage,
	sldtbaleOpeBtnText,
	getSldComImg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class CommentLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preview_img: '',
			preview_alt_con: '',
			show_preview_modal: false,
			modalVisible: false,
			initLoading: false,
			submiting: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: `${sldComLanguage('禁止发布')}`,
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			operateData: [],//modal弹框用到的数据
			forbidData: [{
				type: 'textarea',
				label: `${sldComLanguage('禁止理由')}`,
				name: 'remark',
				placeholder: `${sldComLanguage('请输入禁止理由，最多输入150字')}`,
				initialValue: '',
				rules: [{
					required: true,
					message: `${sldComLanguage('请输入禁止理由')}`,
				},{
					max: 150,
					message: `${sldComLanguage('最多输入150字')}`,
				},],
			}],//禁止理由
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('作品名称')}`,
				name: 'videoName',
				placeholder: `${sldComLanguage('请输入作品名称')}`,
			},{
				type: 'input',
				label: `${sldComLanguage('会员名称')}`,
				name: 'memberName',
				placeholder: `${sldComLanguage('请输入会员名称')}`,
			},{
				type: 'input',
				label: `${sldComLanguage('会员昵称')}`,
				name: 'memberNickname',
				placeholder: `${sldComLanguage('请输入会员昵称')}`,
			}, {
        type: 'select',
        label: `${sldComLanguage('作品类型')}`,
        name: 'videoType',
        initialValue: '',
        placeholder: `${sldComLanguage('请选择作品类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('视频')}` },
          { key: '2', name: `${sldComLanguage('图文')}` },
        ],
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
					title: `${sldComLanguage('作品名称')}`,
					dataIndex: 'videoName',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('封面')}`,
					dataIndex: 'videoImage',
					align: 'center',
					width: 100,
					render: (text, record) => {
						return getSldComImg(text,200,200,60,60);//图片预览
					},
				},
				{
					title: `${sldComLanguage('作品简介')}`,
					dataIndex: 'introduction',
					align: 'center',
					width: 100,
				},{
					title: `${sldComLanguage('会员名称')}`,
					dataIndex: 'memberName',
					align: 'center',
					width: 100,
				},{
					title: `${sldComLanguage('会员昵称')}`,
					dataIndex: 'memberNickname',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('评论数')}`,
					align: 'center',
					dataIndex: 'commentNum',
					width: 100,
				},
        {
          title: `${sldComLanguage('作品类型')}`,
          align: 'center',
          dataIndex: 'videoTypeValue',
          width: 100,
        },
				{
					title: `${sldComLanguage('操作')}`,
					align: 'center',
					width: 80,
					render: (text, record) => (
						<div style={{whiteSpace:'nowrap'}}>
              {record.commentNum>0
                ?<Fragment>
                  <Link to={{
                    pathname: '/marketing_svideo/comment_lists_to_view',
                    query: {
                      id: record.videoId,
                      videoName: record.videoName,
                    },
                  }}>
                    {
                      sldtbaleOpeBtnText(`${sldComLanguage('查看评论')}`,null)
                    }
                  </Link>
                  <span className={global.splitLine}></span>
                  {
                    sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operateVideoComment(record.videoId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('删除评论')}`, () => null))//删除后不可恢复，是否确定删除？
                  }
                </Fragment>
                :'--'
              }
						</div>
					),
				},
			],
		};
	}

	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

	//视频评论操作  id: 视频id
	operateVideoComment = (id) => {
		this.setState({ submiting: true });
		const { params } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		dis_type = 'svideo/del_video_comment';
		param_data.videoId = id;
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

	//获取数据列表(获取所有的视频，未审核通过的不在内)
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'svideo/get_comment_video_list',
			payload: { ...params,type:''},
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

	//预览图片/关闭预览图片
	viewImg = (flag, img = '', text = '') => {
		this.setState({
			preview_img: img,
			preview_alt_con: text,
			show_preview_modal: flag,
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
		this.setState({ modalVisible: false });
	};

	sldHandleConfirm = (val) => {
		this.operateVideo(val,5);
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

	render() {
		const { selectedRows, search_data, columns, initLoading, data, modalVisible, operateData, show_preview_modal, preview_img, preview_alt_con,expandData,title,submiting,} = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('作品列表')}`, 0, 0, 5)}
				<div className={global.tableListForm}>
					<Search search_data={search_data}
							seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
				</div>
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
            totalHeight={document.body.clientHeight - 140-20}
						expandData={expandData}
						selectedRows={selectedRows}
						data={data}
						rowKey={'videoId'}
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
				{/*查看详情对话框-start*/}
				<SldModal
					submiting={submiting}
					title={title}
					width={600}
					modalVisible={modalVisible}
					formItemLayoutModal={formItemLayoutModal}
					content={operateData}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
				/>
				{/*查看详情对话框-end*/}
				{/*图片预览-start*/}
				<SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
							   preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
				{/*图片预览-end*/}
			</div>

		);
	}
}
