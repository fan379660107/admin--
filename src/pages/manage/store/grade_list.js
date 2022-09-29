import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
	sldIconBtn,
	failTip,
	sucTip,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
	sldSearchValClear,
	list_com_page_more,
	dragSldTableColumn,
	sldHandlePaginationData,
	sldLlineRtextAddGoodsAddMargin,
	formItemLayoutModal,
	validatorNumbe,
	getTableNum,
	sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_more;
@connect(({ store }) => ({
  store,
}))
@Form.create()
export default class GradeList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search_con: '',
			initLoading: false,
			submiting: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: '',
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			addData: [{
				type: 'input',
				label: `${sldComLanguage('等级名称')}`,
				name: 'gradeName',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('等级名称')}`,
				initialValue: '',
        maxLength:6,
				rules: [{
					required: true,
					whitespace: true,
					message: `${sldComLanguage('请输入')}${sldComLanguage('等级名称')}`,
				}],
			}, {
				type: 'inputnum',
				label: `${sldComLanguage('可推荐商品数')}`,
				name: 'recommendLimit',
				min: 0,
        max:9999,
				placeholder: `${sldComLanguage('请输入可推荐商品数')}`,
				initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入可推荐商品数')}`,
        }],
			}, {
				type: 'inputnum',
				label: `${sldComLanguage('可发布商品数')}`,
				name: 'goodsLimit',
				min: 1,
        max:9999,
				placeholder: `${sldComLanguage('请输入可发布商品数')}`,
				initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入可发布商品数')}`,
        }],
			}, {
				type: 'inputnum',
				label: `${sldComLanguage('收费标准')}`,
				name: 'price',
				min:1,
				max:99999999,
        		precision: 0,
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('收费标准')}`,
				extra: `${sldComLanguage('请输入1～99999999之间的整数，在会员开通或升级店铺时将显示在前台')}`,
				initialValue: '',
				rules: [{
					required: true,
					message: `${sldComLanguage('请输入')}${sldComLanguage('收费标准')}`,
				}],
			}, {
				type: 'textarea',
				label: `${sldComLanguage('申请说明')}`,//申请说明
				name: 'description',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('申请说明')}`,
				extra: `${sldComLanguage('申请说明，在会员开通或升级店铺时将显示在前台，最多100字')}`,
				initialValue: '',
        maxLength:100
			}, {
				type: 'inputnum',
				label: `${sldComLanguage('排序')}`,
				extra: `${sldComLanguage('请输入0~255的数字,数值越大表明级别越高')}`,
				name: 'sort',
				min: 0,
        max:255,
				placeholder: `${sldComLanguage('请输入排序')}`,
				initialValue: '',
				rules: [{
					required: true,
					message: `${sldComLanguage('请输入排序')}`,
				}, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
			},
			],//modal框的数据
			formValues: {},//搜索条件
			columns: [
				{
					title: ' ',
					align: 'center',
          dataIndex: 'gradeId',
					width: 50,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('等级名称')}`,
					dataIndex: 'gradeName',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('可推荐商品数')}`,
					dataIndex: 'recommendLimit',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('可发布商品数')}`,
					dataIndex: 'goodsLimit',
					align: 'center',
					width: 100,
				},
				{
					title: `${sldComLanguage('收费标准（每年）')}`,
					dataIndex: 'price',
					align: 'center',
					width: 100,
				},
        {
          title: `${sldComLanguage('申请说明')}`,
          dataIndex: 'description',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('排序')}`,//排序
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 100,
					render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.edit(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.gradeId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
					),
				},
			],
		};
	}

	cur_edit_id = '';//当前操作数据id
	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

	//编辑店铺等级
	edit = (val) => {
		let { addData } = this.state;
		for (let i in addData) {
			addData[i].initialValue = val[addData[i].name];
		}
		this.cur_edit_id = val.gradeId;//当前操作数据id
		this.setState({ type: 'edit', title: `${sldComLanguage('编辑')}${sldComLanguage('店铺等级')}`, addData: addData, modalVisible: true });//编辑店铺等级
	};

	//店铺等级操作  del：删除 edit: 编辑
	operate = (id, type) => {
		this.setState({ submiting: true });
		const { params } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		if (type == 'del') {
			dis_type = 'store/del_grade';
			param_data = { gradeId: id };
		} else if (type == 'edit') {
			dis_type = 'store/edit_grade';
			param_data = id;
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

	//添加店铺等级
	add = () => {
		let { addData } = this.state;
		for (let i in addData) {
			addData[i].initialValue = '';
		}
		this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加')}${sldComLanguage('店铺等级')}`, addData: addData });//添加店铺等级
	};

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'store/get_grade_lists',
			payload: params,
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


	sldHandleCancle = () => {
		this.setState({ modalVisible: false });
	};

	sldHandleConfirm = (val) => {
		const { type } = this.state;
		const { dispatch } = this.props;
		this.setState({ submiting: true });
		if (type == 'edit') {
			val.gradeId = this.cur_edit_id;
			this.operate(val, 'edit');
		} else {
			dispatch({
				type: 'store/add_grade',
				payload: { ...val, spaceLimit: 1, confirm: 1 },
				callback: (res) => {
					if (res.state == 200) {
						this.get_list({ pageSize: pageSize });
						this.setState({
							modalVisible: false,
						});
					} else {
						failTip(res.msg);
					}
					this.setState({ submiting: false });
				},
			});
		}
	};

	//搜索
	sldSearch = (val) => {
		this.setState({
			formValues: { gradeName: val },
      params: { pageSize: pageSize }
		});
		this.get_list({ pageSize: pageSize, gradeName: val });
	};

	//搜索框内容的变化
	sldSearChange = (val) => {
		this.setState({
			search_con: val.target.value,
		});
	};

	//清空搜索内容
	sldSearClear = () => {
		this.setState({
			search_con: '',
		});
		this.sldSearch('');
	};

	render() {
		const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_con } = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺等级')}`, 0, 0, 5)}
				<div className={global.operate_bg}>
					{sldIconBtn(() => this.add(), `${sldComLanguage('新增等级')}`, 7, 7)}
          {/* 请输入等级名称           搜索*/}
					{sldSearchValClear(`${sldComLanguage('请输入')}${sldComLanguage('等级名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
				</div>
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
						selectedRows={selectedRows}
						data={data}
						rowKey={'gradeId'}
						isCheck={false}
						columns={columns}
						sldpagination={false}
						onSelectRow={this.handleSelectRows}
						onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
						onSldHandleSeleRow={this.onSldHandleSeleRow}
						resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
						isColumnResize={true}
					/>
					{/*标准表格-end*/}

				</Spin>
				{/*新增/编辑对话框-start*/}
				<SldModal
					title={title}
					submiting={submiting}
					width={500}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					formItemLayoutModal={formItemLayoutModal}
					content={addData}
				/>
				{/*新增/编辑对话框-end*/}

			</div>

		);
	}
}
