/*
* 秒杀活动商品列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
	list_com_page_size_10,
	dragSldTableColumn,
	sldHandlePaginationData,
	getTableNum,
	sldComLanguage,
  sldtbaleOpeBtnText,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
  getSldListGoodsImg80,
  formItemLayoutModal,
  list_com_page_more,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import { failTip } from '../../../../utils/utils';

let pageSize = list_com_page_size_10;
@connect(({ seckill }) => ({
  seckill,
}))
@Form.create()
export default class SeckillGoodsLists extends Component {
	constructor(props) {
		super(props);
		this.state = {
      query: props.location.query,
			search_con: '',
			initLoading: false,
			submiting: false,
      modalVisible: false,
			data: {},//列表数据
			selectedRows: [],
			selectedRowKeys: [],//selectedRows的key
			title: '',
			type: 'add',//'add'新增  'edit'编辑
			params: { pageSize: pageSize },//搜索条件
			formValues: {},//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,
      },],
			columns: [
				{
					title: ' ',
					dataIndex: 'goodsId',
					align: 'center',
					width: 55,
					render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
				},
				{
					title: `${sldComLanguage('商品图片')}`,
					dataIndex: 'goodsImage',
					align: 'center',
					width: 100,
          render: (text, record) => {
            return getSldListGoodsImg80(text);
          },
				},
        {
          title: `${sldComLanguage('商品名称')}`,
          dataIndex: 'goodsName',
          align: 'center',
          width: 100,
        },
				{
					title: `${sldComLanguage('店铺名称')}`,
					dataIndex: 'storeName',
					align: 'center',
					width: 100,
				},{
          title: `${sldComLanguage('活动标签')}`,
          dataIndex: 'labelName',
          align: 'center',
          width: 100,
        },
				{
					title: `${sldComLanguage('操作')}`,
					align: 'center',
					width: 100,
					render: (text, record) => (
						<Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('查看SKU')}`, () => this.viewSpec(record))}{/*查看sku*/}
						</Fragment>
					),
				},
			],
      operateData:[],//查看规格数据
      view_spec_data: [{
        type: 'scroll_table',
        name: '',
        label: ``,
        width: 880,
        content: '',
        data: [],
        columns: this.goods_spec_columns,
        rowKey: 'id',
      }],//查看规格
		};
	}

  goods_spec_columns = [
    {
      title: ' ',
      dataIndex: 'productId',
      align: 'center',
      width: 30,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: `${sldComLanguage('商品规格')}`,
      dataIndex: 'specValues',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        return <div style={{width:200,wordBreak:'normal',wordWrap:'break-word'}}>{text?text:`${sldComLanguage('默认')}`}</div>;
      },
    },
    {
      title: `${sldComLanguage('原价(元)')}`,
      dataIndex: 'productPrice',
      align: 'center',
      width: 110,
    },
    {
      title: `${sldComLanguage('商品库存')}`,
      dataIndex: 'productStock',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('秒杀价(元)')}`,
      dataIndex: 'seckillPrice',
      align: 'center',
      width: 110,
    },
    {
      title: `${sldComLanguage('秒杀库存')}`,
      dataIndex: 'seckillStock',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('限购数量')}`,
      dataIndex: 'upperLimit',
      align: 'center',
      width: 100,
    },
  ];

	componentDidMount() {
		this.get_list({ pageSize: pageSize });
	}

  // 查看规格
  viewSpec = (val) => {
    const { dispatch } = this.props;
    let {operateData,view_spec_data,query} = this.state;
    dispatch({
      type: 'seckill/get_seckill_goods_sku_lists',
      payload: {pageSize:list_com_page_more,goodsId:val.goodsId,stageId:query.id},
      callback: (res) => {
        if (res.state == 200) {
          operateData = JSON.parse(JSON.stringify(view_spec_data));
          operateData[0].columns = this.goods_spec_columns;
          operateData[0].data = res.data.list;
          this.setState({
            modalVisible: true,
            operateData
          });
        }else{
          failTip(res.msg);
          return false;
        }
      },
    });
  };

	//获取数据列表
	get_list = (params) => {
		this.setState({ initLoading: true });
		const { dispatch } = this.props;
		const {query} = this.state;
		dispatch({
			type: 'seckill/get_joined_goods_lists',
			payload: {...params,stageId:query.id},
			callback: (res) => {
				this.setState({ initLoading: false });
				if (res.state == 200) {
					if (res.data.list.length == 0 && this.state.params.current > 1) {
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
		const { selectedRows, columns, initLoading, data,search_data ,modalVisible,operateData} = this.state;
		return (
			<div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('活动商品')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
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
						rowKey={'goodsId'}
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

        { /*新增/编辑对话框-start*/}
        <SldModal
          width={900}
          title={`${sldComLanguage('查看商品SKU')}`}
          submiting={false}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot={false}
        />
        { /*新增/编辑对话框-end*/}

			</div>

		);
	}
}
