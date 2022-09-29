/*
* 商品管理——在售商品
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  dateFormat,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  sldIconBtn,
  formItemLayoutModal,
  getSldListGoodsImg80,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './product.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class GoodsOnlineLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operateData:[],
      modal_width: 700,//查看规格、下架商品的modal框宽度
      down_reason_list: [],//获取违规下架理由
      modalVisibleDetail: false,
      initLoading: false,
      submiting: false,
      show_foot: false,
      modalVisible: false,//是否显示规格弹框
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('商品规格')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      addData:[{
        type: 'select',
        label: `${sldComLanguage('下架理由')}`,//下架理由
        name: 'offlineReason',
        placeholder: `${sldComLanguage('请选择下架理由')}`,//请选择下架理由
        sel_data: [],
        sele_key: 'reasonId',
        sele_name: 'content',
        diy: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择下架理由')}`,//请选择下架理由
        }],
      },{
        type: 'textarea',
        label: `${sldComLanguage('备注')}`,//备注
        name: 'offlineComment',
        placeholder: `${sldComLanguage('请输入违规下架理由')}`,//请输入违规下架理由
        extra: `${sldComLanguage('最多输入100字')}`,
        maxLength: 100,
      }],//下架数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,//商品名称
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,//请输入商品名称
      },{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,//店铺名称
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,//请输入店铺名称
      },{
        type: 'select',
        label: `${sldComLanguage('商品类型')}`,
        name: 'isVirtualGoods',
        placeholder: `${sldComLanguage('请选择商品类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: 1, name: `${sldComLanguage('实物商品')}` },
          { key: 2, name: `${sldComLanguage('虚拟商品')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('发布时间')}`,//发布时间
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
        placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('商品信息')}`,//商品信息
          dataIndex: 'mainImage',
          align: 'center',
          width: 250,
          render: (text, record) => {
            return <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
              {record.isVirtualGoods == 2&&<span className={`${styles.virtual_goods_flag}`}>虚拟</span>}
              <div className={styles.goods_img}>{getSldListGoodsImg80(text)}</div>
              <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                <span className={styles.goods_name}>
                  {record.goodsName}
                </span>
                <span className={styles.goods_brief}>
                  {record.categoryPath}
                </span>
                <span className={styles.goods_brief}>
                  {sldComLanguage('所属店铺：')}{record.storeName}
                </span>
              </div>
            </div>;
          },
        },
        {
          title: `${sldComLanguage('商品价格')}`,
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('商品库存')}`,
          dataIndex: 'goodsStock',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('实际/虚拟销量')}`,
          dataIndex: 'actualSales',
          align: 'center',
          width: 150,
          render: (text, record) => {
            return <div>{record.actualSales}/{record.virtualSales}</div>
          },
        },
        {
          title: `${sldComLanguage('发布时间')}`,//发布时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <div style={{whiteSpace:'nowrap'}}>
              {sldtbaleOpeBtnText(`${sldComLanguage('查看详情')}`, () => this.viewDetail(record.goodsId))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('违规下架')}`, () => this.lockUpGoods(record.goodsId))}
            </div>
          ),
        },
      ],
    };
  }

  operate_ids = '';//当前操作的商品id串
  reason_list = [];

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_reason_list();//获取违规下架的理由
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.updateFlag == 'online'){
      this.get_list({ pageSize: pageSize });
    }
  }

  //查看详情
  viewDetail = (id) => {
    window.open(`/manage_product/goods_list_to_detail?id=${id}`, '_blank');
  };

  //商品操作
  operateGoods = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = 'product/lockup_goods';
    param_data = id;
    this.setState({submiting:true})
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.setState({
            modalVisible:false,
            selectedRows: [],
            selectedRowKeys: [],
          })
          this.props.setUpdateFlag('offline');
        } else {
          failTip(res.msg);
        }
        this.setState({submiting:false})
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'product/get_goods_lists',
      payload: { ...params,state:3},
      callback: (res) => {
        this.setState({ initLoading: false });
        this.props.setUpdateFlag('');
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.current > 1) {
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

  //获取违规下架理由
  get_reason_list = () => {
    const { dispatch } = this.props;
    let {addData} = this.state;
    dispatch({
      type: 'common/get_reason_list',
      payload: { type: 101,isShow: 1 },
      callback: (res) => {
        if (res.state == 200) {
          for(let i in addData){
            if(addData[i].name == 'offlineReason'){
              addData[i].sel_data = res.data.list;
              break;
            }
          }
          this.reason_list = res.data.list;
          this.setState({addData});
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

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat)+' 00:00:00' : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat)+ ' 23:59:59' : '';
      delete values.search_create_time
    }
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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  lockUpGoods = (ids) => {
    let {addData,operateData} = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    this.operate_ids = ids;
    this.setState({
      operateData,
      modal_width:500,
      title:`${sldComLanguage('违规下架商品')}`,
      modalVisible:true,
      show_foot:true,
    })
  }

  sldHandleConfirm = (val) => {
    let selectd_reason = this.reason_list.filter(item=>item.reasonId == val.offlineReason)[0];
    val.offlineReason = selectd_reason.content;
    val.goodsIds = this.operate_ids;
    this.operateGoods(val, 'down')
  };

  render() {
    const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, modalVisible,title,modal_width,operateData,show_foot,submiting } = this.state;
    const {scroll_h} = this.props;
    return (
      <div className={global.common_page} style={{ flex: 1,paddingTop:0 }}>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}
             style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);//请先选中数据
              //确认下架选中的商品吗？
            }, `${sldComLanguage('批量违规下架')}`, 7, 0, 15, 15, 3, 'ziyuan31', '#f9a006') : sldIconBtn(() => this.lockUpGoods(selectedRowKeys.join(',')), `${sldComLanguage('批量违规下架')}`, 7, 0, 15, 15, 3, 'ziyuan31', '#f9a006')}
          </div>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-250 - scroll_h}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'goodsId'}
            isCheck={true}
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
          width={modal_width}
          title={title}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot={show_foot}
        />
        { /*新增/编辑对话框-end*/}
      </div>
    );
  }
}
