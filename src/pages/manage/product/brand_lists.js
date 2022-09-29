import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
	sldIconBtn,
	failTip,
	sucTip,
	sldSearchValClear,
	list_com_page_size_10,
	formItemLayoutModal,
  sldPopConfirmDiy,
	getTableNum,
	sldComLanguage,
  sldtbaleOpeBtnText,
	dragSldTableColumn,
	sldHandlePaginationData,
	getSldComImg,
	getSldComShowMoreTtex,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import { apiUrl } from '@/utils/sldconfig.js';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
	product,
}))
@Form.create()
export default class Brand_lists extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search_con: '',
			initLoading: false,
			submiting: false,
			show_preview_modal: false,//预览图片modal框是否展示
			preview_img: '',//预览图片
			preview_alt_con: '',//预览图片内容
			modalTableVisible: false,//input 后缀弹出框是否显示
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: '',
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			upload_img_info: {},//上传的图片信息
			addData: [{
				type: 'input',
				label: `${sldComLanguage('品牌名称')}`,
				name: 'brandName',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('品牌名称')}`,
				extra: `${sldComLanguage('最多输入20个字')}`,
				initialValue: '',
        maxLength:20,
				rules: [{
					required: true,
          whitespace: true,
					message: `${sldComLanguage('请输入')}${sldComLanguage('品牌名称')}`,
				},],
			},
        {
				type: 'upload_img_upload',
				label: `${sldComLanguage('品牌LOGO')}`,
				name: 'image',
				extra: `${sldComLanguage('建议上传宽153*高54的图片')}`,
				fileList: [],
				img_info: {},
				upload_name: 'file',
        required: true,
				upload_url: apiUrl + `v3/oss/common/upload?source=setting`,
				uploadPreview: this.uploadImgPre,
				uploadChange: (info) => this.uploadImg(info, 'image'),
				initialValue: '',
			},{
				type: 'textarea',
				label: `${sldComLanguage('品牌描述')}`,//品牌描述
				disable: true,
				name: 'brandDesc',
				placeholder: `${sldComLanguage('请输入')}${sldComLanguage('品牌描述')}`,
				initialValue: '',
        extra: `${sldComLanguage('最多输入200个字')}`,
				maxLength: 200,
			},
			],//modal框的数据
			formValues: {},//搜索条件、
			columns: [
				{
					title: ' ',
					dataIndex: 'brandId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('品牌名称')}`,
					dataIndex: 'brandName',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('品牌LOGO')}`,
					dataIndex: 'imageUrl',
					align: 'center',
					width: 100,
					render: (text) => {
						return getSldComImg(text,160,60,85,30);//图片预览
					},
				},
				{
					title: `${sldComLanguage('品牌描述')}`,
					dataIndex: 'brandDesc',
					align: 'center',
					width: 100,
					render: (text) => {
						return getSldComShowMoreTtex(text,50,200);
					},
				},
        {
          title: `${sldComLanguage('在售/全部商品')}`,
          dataIndex: 'onSaleGoodsNum',
          align: 'center',
          width: 120,
          render: (text, record) => {
            return <div>{text}/{record.totalGoodsNum}</div>;
          },
        },
				{
					title: `${sldComLanguage('创建时间')}`,
					dataIndex: 'createTime',
					align: 'center',
					width: 150,
				},
				{
					title: `${sldComLanguage('操作')}`,//操作
					align: 'center',
					width: 80,
					render: (text, record) => (
						<Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editBrand(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateBrand(record.brandId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
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

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.updateFlag == 'brand_list'){
      this.get_list({ pageSize: pageSize });
    }
  }

	//上传图片
	uploadImg = (info, type) => {
		let { addData } = this.state;
		if(info.file.status!=undefined&&info.file.status!='error') {
			for (let i in addData) {
				if (addData[i].name == type) {
					addData[i].fileList = info.fileList;
					addData[i].img_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
				}
			}
			this.setState({ addData });
		}
	};

	//预览图片
	uploadImgPre = (info) => {
		this.viewImg(true, info.url||info.thumbUrl);
	};

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

	//编辑品牌
	editBrand = (val) => {
		let { addData } = this.state;
		for (let i in addData) {
			if (addData[i].name == 'sort') {
				addData[i].initialValue = val.sort * 1;
			} else if (addData[i].name == 'isRecommend') {
				addData[i].initialValue = val.isRecommend == 1 ? true : false;
			} else if (addData[i].name == 'image') {
				let fileList = [];
				let tmp_data = {};
				tmp_data.uid = val.brandId;
				tmp_data.name = val.imageUrl;
				tmp_data.status = 'done';
				tmp_data.url = val.imageUrl;
				fileList.push(tmp_data);
				addData[i].fileList = fileList;
				addData[i].img_info.path = val.image;
			}else{
				addData[i].initialValue = val[addData[i].name];
			}
		}
		this.cur_edit_id = val.brandId;//当前操作数据id
		this.setState({ type: 'edit', title: `${sldComLanguage('编辑')}${sldComLanguage('品牌')}`, addData: addData, modalVisible: true });
	};

	//添加品牌
	addBrand = () => {
		let { addData } = this.state;
		for (let i in addData) {
			if (addData[i].type == 'single_checkbox') {
				addData[i].initialValue = false;
			} else if (addData[i].type == 'upload_img_upload') {
				addData[i].fileList = [];
				addData[i].img_info = {};
			} else {
				addData[i].initialValue = '';
			}
		}
		this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加')}${sldComLanguage('品牌')}`, addData: addData });
	};

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		dispatch({
			type: 'product/get_brand_lists',
			payload: params,
			callback: (res) => {
				this.setState({ initLoading: false });
        this.props.setUpdateFlag('');
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
		const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
		pageSize = params.pageSize;
		this.setState({
			params: params,
		});
		this.get_list(params);
	};


	//表格拖动
	resizeTable = (index, size, type, data) => {
		let datas = dragSldTableColumn(index, size, data);
		this.setState({ [type]: datas });
	};

	sldHandleCancle = () => {
		this.setState({ modalVisible: false });
	};

	//品牌管理操作，edit 编辑，del 删除，recommend 推荐  unrecommend 不推荐,
	operateBrand = (id, type) => {
		const { dispatch } = this.props;
		let dis_type = '';
		let params = { brandId: id };
		if (type == 'edit') {
			dis_type = 'product/edit_goods_brand';
			params = id;
		} else if (type == 'del') {
			dis_type = 'product/del_brand';
			params = {brandIds:id}
		} else if (type == 'recommend' || type == 'unrecommend') {
			dis_type = 'product/edit_brand_recommend';
			params.brandId = id;
			params.isRecommend = type == 'recommend'?1:0;
		}
		dispatch({
			type: dis_type,
			payload: params,
			callback: (res) => {
				if (res.state == 200) {
					sucTip(res.msg);
					this.get_list(this.state.params);
					this.setState({
						modalVisible: false,
					});
				} else {
					failTip(res.msg);
				}
				this.setState({ submiting: false });
			},
		});
	};

	sldHandleConfirm = (val) => {
		const { type, addData } = this.state;
		const { dispatch } = this.props;
		let _this = this;
		for (let i in addData) {
			if (addData[i].name == 'image') {
				if (addData[i].img_info.path == undefined) {
					failTip(`${sldComLanguage('请上传')}${sldComLanguage('品牌LOGO')}`);
					return false;
				} else {
					val.image = addData[i].img_info.path;
				}
			}
		}
		val.isRecommend = val.isRecommend ? 1 : 0;
		this.setState({ submiting: true });
		if (type == 'edit') {
			val.brandId = this.cur_edit_id;
			this.operateBrand(val,'edit');
		} else {
			dispatch({
				type: 'product/add_goods_brand',
				payload: val,
				callback: (res) => {
					if (res.state == 200) {
            sucTip(res.msg);
						_this.get_list({ pageSize: pageSize });
						this.setState({
							modalVisible: false,
							formValues: {},
							search_con: '',
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
		let { formValues } = this.state;
		formValues.brandName = val;
		this.setState({ formValues,params: { pageSize: pageSize } });
		this.get_list({ pageSize: pageSize, ...formValues });
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
		const { selectedRows, search_con, columns, initLoading, data, submiting, addData, modalVisible, title, preview_img, preview_alt_con, show_preview_modal } = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
				<div className={global.operate_bg}>
					{sldIconBtn(() => this.addBrand(), `${sldComLanguage('新增')}${sldComLanguage('品牌')}`, 7, 7)}{/* 新增品牌 */}
          {/*请输入品牌名称        搜索*/}
					{sldSearchValClear(`${sldComLanguage('请输入')}${sldComLanguage('品牌名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
				</div>
				<Spin spinning={initLoading}>
					{/*标准表格-start*/}
					<StandardTable
            totalHeight={this.props.tableHeight}
						selectedRows={selectedRows}
						data={data}
						rowKey={'brandId'}
						isCheck={false}
						columns={columns}
						onSelectRow={this.handleSelectRows}
						onSldHandleSeleRow={this.onSldHandleSeleRow}
						onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
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

				{/*图片预览-start*/}
				<SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={300}
							   preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
				{/*图片预览-end*/}

			</div>

		);
	}
}
