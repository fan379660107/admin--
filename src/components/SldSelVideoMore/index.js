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
	getSldComImg,
	sldtbaleOpeBtnText,
	getSldCopyData,
	formItemLayoutModal,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ video }) => ({
	video
}))
@Form.create()
export default class SldSelVideoMore extends Component {
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
			operateData: [],//modal弹框用到的数据
			previewData: [{
				type: 'view_video',
				label: ``,//
				name: 'view_video',
				initialValue: '',
				width:600,
				height:400,
			}],//预览视频
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('视频名称')}`,//视频名称
				name: 'video_name',
				placeholder: `${sldComLanguage('请输入视频名称')}`,//请输入视频名称
			},
			],
			sel_columns: [
				{
					title: ' ',
					dataIndex: 'video_id',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum({}, pageSize, index),
				},
				{
					title: `${sldComLanguage('封面图')}`,//封面图
					dataIndex: 'video_image',
					align: 'center',
					width: 70,
					render: (text, record) => {
						return getSldComImg(text,200,200,60,60);//图片预览
					},
				},
				{
					title: `${sldComLanguage('视频名称')}`,//视频名称
					dataIndex: 'video_name',
					align: 'center',
					width: 150,
				}, {
					title: `${sldComLanguage('视频简介')}`,//视频名称
					dataIndex: 'introdution',
					align: 'center',
					width: 200,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 60,
					render: (text, record) => {
						return sldPopConfirm('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delSelVideo(record.video_id), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtn(sldComLanguage('删除'), 'shanchu2', null), 0, 0, '#1890ff')//删除 删除后不可恢复，是否确定删除？
					}

				},
			],
			columns: [
				{
					title: ' ',
					dataIndex: 'video_id',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('封面图')}`,//封面图
					dataIndex: 'video_image',
					align: 'center',
					width: 70,
					render: (text, record) => {
						return getSldComImg(text,200,200,60,60);//图片预览
					},
				},
				{
					title: `${sldComLanguage('视频名称')}`,//视频名称
					dataIndex: 'video_name',
					align: 'center',
					width: 150,
				}, {
					title: `${sldComLanguage('视频简介')}`,//视频名称
					dataIndex: 'introdution',
					align: 'center',
					width: 200,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 80,
					render: (text, record) => (
						<Fragment>
							{
								sldtbaleOpeBtnText(`${sldComLanguage('预览')}`,() => this.preview(record.video_path))//预览
							}
						</Fragment>
					),
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
		dis_type = 'com_svideo/get_video_lists';
		new_params.q_state = 6;
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
						this.setState({
							data: res.data,
						});
					}
				}
			},
		});
	};

	preview = (video_path) => {
		let { operateData,previewData } = this.state;
		operateData = getSldCopyData(previewData);
		for(let i in operateData){
			if(operateData[i].name == 'view_video'){
				operateData[i].initialValue = video_path
			}
		}
		this.setState({
			modalVisible:true,
			operateData,
			show_foot:false,
		});
	}

	handleSelectRows = (rows, rowkeys) => {
		//针对翻页无法保存选择的行数据处理
		let { selectedRows, selectedRowKeys } = this.state;
		let pre_sele_rows_keyarray = [];
		for (let i in selectedRows) {
			pre_sele_rows_keyarray.push(selectedRows[i].video_id);
		}
		//去掉的话要删掉行数据
		for (let i in selectedRowKeys) {
			if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
				selectedRows = selectedRows.filter(item => item.video_id != selectedRowKeys[i]);
			}
		}
		//没有的话追加行数据
		for (let i in rowkeys) {
			if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
				let cur_row = rows.filter(item => item.video_id == rowkeys[i])[0];
				selectedRows.push(cur_row);
			}
		}
		this.setState({
			selectedRows: selectedRows,
			selectedRowKeys: rowkeys,
		});
	};

	//删除选中的商品
	delSelVideo = (id) => {
		let { selectedRows, selectedRowKeys } = this.state;
		selectedRows = selectedRows.filter(item => item.video_id != id);
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
					video_id: selectedRows[i].video_id,
					author_id: selectedRows[i].author_id,
					introdution: selectedRows[i].introdution,
					status: selectedRows[i].status,
					status_str: selectedRows[i].status_str,
					video_image: selectedRows[i].video_image,
					video_name: selectedRows[i].video_name,
					video_path: selectedRows[i].video_path,
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

	sldHandleCancle = () => {
		this.setState({ modalVisible: false });
	};

	render() {
		const { modalAddSkuIsShow, width, modaltitle } = this.props;
		const { selectedRows, search_data, data, loading, selectedRowKeys,sel_columns,columns,operateData,show_foot,modalVisible } = this.state;
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
									rowKey={'video_id'}
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
								rowKey={'video_id'}
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
						{/*查看详情对话框-start*/}
						<SldModal
							submiting={false}
							title={`${sldComLanguage('预览')}`}
							width={600}
							modalVisible={modalVisible}
							formItemLayoutModal={formItemLayoutModal}
							content={operateData}
							sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
							sldHandleCancle={this.sldHandleCancle}
							show_foot={show_foot}
						/>
						{/*查看详情对话框-end*/}
					</div>
				</div>

			</Modal>
		);
	}
}
