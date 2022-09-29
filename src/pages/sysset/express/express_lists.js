import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import { failTip, sucTip, sldSearch, list_com_page_size_10, dragSldTableColumn, sldHandlePaginationData, sldLlineRtextAddGoodsAddMargin, formItemLayoutModal, getTableNum, sldComLanguage, getSldCopyData, sldtbaleOpeBtnText, sldPopConfirmDiy,validatorNumbe
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ sldsetting }) => ({
	sldsetting,
}))
@Form.create()
export default class Express_lists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initLoading: false,
			submiting: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: '',
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			upload_img_info: {},//上传的图片信息
			operateData: [],//操作的数据
			addData: [{
				type: 'input',
				label: `${sldComLanguage('物流名称')}`,
				name: 'expressName',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('物流公司名称')}`,
				initialValue: '',
        maxLength:10,
				rules: [{
					required: true,
          whitespace: true,
					message: `${sldComLanguage('请输入')}${sldComLanguage('物流公司名称')}`,
				}],
			},
			{
				type: 'input',
				label: `${sldComLanguage('物流代码')}`,
				name: 'expressCode',
        maxLength:100,
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('物流公司代码')}`,
				initialValue: '',
			},
			 {
				type: 'inputnum',
				label: `${sldComLanguage('排序')}`,//排序
				extra: `${sldComLanguage('请输入排序，越小越靠前')}`,
				name: 'sort',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
				initialValue: '',
				min: 0,
				rules: [{
					required: true,
					message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
				},{ validator: (rule, value, callback)=>validatorNumbe(rule, value, callback)}],
			},
			{
				type: 'input',
				label: `${sldComLanguage('物流公司网址')}`,
				name: 'website',
				placeholder: `${sldComLanguage('请输入物流公司网址')}`,
				initialValue: '',
        maxLength:100,
				rules: [{
					required: true,
          whitespace: true,
					message: `${sldComLanguage('请输入物流公司网址')}`,
				}],
			},
				{
					type: 'switch',
					label: `${sldComLanguage('启用')}`,
					name: 'expressState',
					placeholder: ``,
					initialValue: 1,
				},
			],//modal框的数据
			formValues: {},//搜索条件、
			columns: [
				{
					title: ' ',
					dataIndex: 'expressId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('物流公司')}`,
					dataIndex: 'expressName',
					align: 'center',
					width: 200,
				},
        {
          title: `${sldComLanguage('物流代码')}`,
          dataIndex: 'expressCode',
          align: 'center',
          width: 150,
        },
				{
					title: `${sldComLanguage('网址(仅供参考)')}`,
					dataIndex: 'website',
					align: 'center',
					width: 100,
				},
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 80,
        },
				{
					title: `${sldComLanguage('开启')}`,
					dataIndex: 'expressState',
					align: 'center',
					width: 80,
					render: (text, record) => (
						<Switch checkedChildren={`${sldComLanguage('启用')}`}
							onChange={(checked) => this.operateExpress(record.expressId, checked ? 'start' : 'stop')}
							unCheckedChildren={`${sldComLanguage('停用')}`}
							checked={text == 1 ? true : false}
							valuepropname={'checked'} />
					),
				},
				{
					title: `${sldComLanguage('操作')}`,
					width: 100,
					align: 'center',
					render: (text, record) => (
						<Fragment>
              {sldtbaleOpeBtnText(sldComLanguage('编辑'), () => this.editExpress(record))}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateExpress(record.expressId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(sldComLanguage('删除'), () => null))}
						</Fragment>
					),
				},
			],
			search_data: [{
				type: 'input',
				label: `${sldComLanguage('物流名称')}`,
				name: 'expressName',
				placeholder: `${sldComLanguage('请输入物流公司名称')}`,
			},
			],
		};
	}

	cur_edit_id = '';//当前操作数据id
	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}



	//编辑物流公司
	editExpress = (val) => {
		let { addData, operateData } = this.state;
		operateData = getSldCopyData(addData);
		for (let i in operateData) {
		  if(!(operateData[i].name == 'sort'||operateData[i].name == 'website')){
        operateData[i].disable = true;
      }
			operateData[i].initialValue = val[operateData[i].name];
		}
		this.cur_edit_id = val.expressId;//当前操作数据id
		this.setState({ type: 'edit', title: `${sldComLanguage('编辑')}${sldComLanguage('物流公司')}`, operateData, modalVisible: true });
	};

	//物流公司操作  del：删除 edit：编辑
	operateExpress = (id, type) => {
		const { params,formValues } = this.state;
		const { dispatch } = this.props;
		let dis_type = '';
		let param_data = {};
		if (type == 'del') {
			dis_type = 'sldsetting/del_express';
			param_data.expressId = id;
		} else if (type == 'edit') {
			dis_type = 'sldsetting/edit_express';
			param_data = id;
		} else if (type == 'stop' || type == 'start') {
			dis_type = 'sldsetting/edit_express';
			param_data.expressState = type == 'stop' ? 0 : 1;
			param_data.expressId = id;
		}
		dispatch({
			type: dis_type,
			payload: param_data,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
					this.get_list({...params,...formValues});
					this.setState({ modalVisible: false });
				} else {
					failTip(res.msg);
				}
				this.setState({ submiting: false });
			},
		});
	};

	//添加物流公司
	addExpress = () => {
		let { addData, operateData } = this.state;
		operateData = getSldCopyData(addData);
		this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加')}${sldComLanguage('物流公司')}`, operateData });
	};

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'sldsetting/get_express_lists',
			payload: params,
			callback: (res) => {
				this.setState({ initLoading: false });
				if (res.state == 200) {
					if ((res.data.list==null||res.data.list.length == 0) && this.state.params.current > 1) {
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
		const { type, addData } = this.state;
		const { dispatch } = this.props;
		let _this = this;
    val.expressState = val.expressState?1:0;
		this.setState({ submiting: true });
		if (type == 'edit') {
			val.expressId = this.cur_edit_id;
			this.operateExpress(val, 'edit');
		} else {
			dispatch({
				type: 'sldsetting/add_express',
				payload: val,
				callback: (res) => {
					if (res.state == 200) {
					  sucTip(res.msg);
						_this.get_list({ pageSize: pageSize });
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

	render() {
		const { selectedRows, search_data, columns, initLoading, data, submiting, operateData, modalVisible, title, search_con } = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				{sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('物流管理')}`, 0, 0, 10)}
				<div className={global.tableListForm}>
					<Search search_data={search_data}
						seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
					/>
				</div>
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
						selectedRows={selectedRows}
						data={data}
						rowKey={'expressId'}
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
				{/*新增/编辑对话框-start*/}
				<SldModal
					title={title}
					submiting={submiting}
					width={500}
					modalVisible={modalVisible}
					sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
					sldHandleCancle={this.sldHandleCancle}
					formItemLayoutModal={formItemLayoutModal}
					content={operateData}
				/>
				{/*新增/编辑对话框-end*/}
			</div>
		);
	}
}
