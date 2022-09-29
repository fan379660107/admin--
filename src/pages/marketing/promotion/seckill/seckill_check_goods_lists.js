/*
* 秒杀活动待审核商品列表
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
  sldIconBtn,
  sldPopConfirmDiy,
  getSldListGoodsImg80,
  formItemLayoutModal,
  list_com_page_more,
  sucTip,
  failTip,
  sldPopConfirm,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ seckill }) => ({
  seckill,
}))
@Form.create()
export default class SeckillCheckGoodsLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_width: 500,
      modal_title: '',//modal弹框标题
      search_con: '',
      show_foot: false,
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
      refuseData: [{
        type: 'textarea',
        label: `${sldComLanguage('拒绝理由')}`,
        extra: `${sldComLanguage('最多输入100字')}`,
        name: 'auditReason',
        placeholder: `${sldComLanguage('请输入拒绝理由')}`,
        initialValue: '',
        maxLength: 100,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入拒绝理由')}`,
        }],
      }],//拒绝理由数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'verifyState',
        placeholder: `${sldComLanguage('请选审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待审核')}` },
          { key: '3', name: `${sldComLanguage('审核拒绝')}` },
        ],
      }],
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
        }, {
          title: `${sldComLanguage('活动标签')}`,
          dataIndex: 'labelName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('参加场次')}`,
          dataIndex: 'stageName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('审核状态')}`,
          dataIndex: 'verifyStateValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('拒绝理由')}`,
          dataIndex: 'remark',
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

              {record.verifyState != 3 &&
              <Fragment>
                <span className={global.splitLine}></span>
                {/*确定审核通过该商品吗？*/}
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定审核通过该商品吗')}`, () => this.operate({
                    goodsIds: record.goodsId,
                    stageIds: record.stageId,
                    state: 1,
                  }, 'pass'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('审核通过')}`, () => null))}
                <span className={global.splitLine}></span>
                {sldtbaleOpeBtnText(`${sldComLanguage('审核拒绝')}`, () => this.refuse({
                  goodsIds: record.goodsId,
                  stageIds: record.stageId,
                }, 'single'))}
              </Fragment>
              }

              {/*只有审核拒绝才可以删除*/}
              {record.verifyState == 3 &&
              <Fragment>
                <span className={global.splitLine}></span>
                {/*删除后不可恢复，是否确定删除？*/}
                {
                  sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
                }
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
      operateData: [],//查看规格数据
      view_spec_data: [{
        type: 'scroll_table',
        name: '',
        label: ``,
        width: 880,
        content: '',
        data: [],
        columns: this.goods_spec_columns,
        rowKey: 'productId',
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
        return <div style={{ width: 200, wordBreak: 'normal', wordWrap: 'break-word' }}>{text ? text : '默认'}</div>;
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
  cur_operate_data = {};//拒绝操作的参数

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //审核拒绝 type:single 单个拒绝 more 批量拒绝
  refuse = (val, type) => {
    if (type == 'single') {
      this.cur_operate_data = val;
    } else {
      let param = {};
      val.map((item) => {
        param.goodsIds.push(item.goodsIds);
        param.stageIds.push(item.stageIds);
      });
      this.cur_operate_data = param;
    }
    this.cur_operate_data.state = 0;
    let { operateData, refuseData } = this.state;
    operateData = JSON.parse(JSON.stringify(refuseData));
    this.setState({
      modalVisible: true,
      operateData,
      modal_title: `${sldComLanguage('拒绝理由')}`,
      modal_width: 500,
      show_foot: true,
    });
  };

  sldHandleConfirm = (val) => {

    this.cur_operate_data.auditReason = val.auditReason;
    this.operate(this.cur_operate_data, 'refuse');
  };

  //批量审核通过数据处理
  batchPassData = () => {
    const { selectedRows } = this.state;
    let param = {};
    param.goodsIds = [];
    param.stageIds = [];
    selectedRows.map((item) => {
      param.goodsIds.push(item.goodsId);
      param.stageIds.push(item.stageId);
    });
    param.goodsIds = param.goodsIds.join(',');
    param.stageIds = param.stageIds.join(',');
    param.state = 1;
    this.operate(param, 'pass');
  };

  //活动操作  del：删除 pass: 审核通过 refuse: 拒绝
  operate = (id, type) => {
    this.setState({ initLoading: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'seckill/del_goods';
      param_data.goodsId = id.goodsId;
      param_data.stageId = id.stageId;
    } else if (type == 'pass' || type == 'refuse') {
      dis_type = 'seckill/check_goods';
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
            selectedRows: [],
            selectedRowKeys: [],
          });
          this.cur_operate_data = {};
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ initLoading: false });
      },
    });
  };

  // 查看规格
  viewSpec = (val) => {
    const { dispatch } = this.props;
    let { operateData, view_spec_data } = this.state;
    dispatch({
      type: 'seckill/get_seckill_goods_sku_lists',
      payload: { pageSize: list_com_page_more, goodsId: val.goodsId, stageId: val.stageId },
      callback: (res) => {
        if (res.state == 200) {
          operateData = JSON.parse(JSON.stringify(view_spec_data));
          operateData[0].columns = this.goods_spec_columns;
          operateData[0].data = res.data.list;
          this.setState({
            modalVisible: true,
            operateData,
            modal_title: `${sldComLanguage('查看商品SKU')}`,
            modal_width: 900,
            show_foot: false,
          });
        } else {
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
    dispatch({
      type: 'seckill/get_check_goods_lists',
      payload: { ...params, seckillId: this.props.query },
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_list(params);
          } else {
            if (res.data.list.length > 0) {
              res.data.list.map((item, index) => {
                item.key = index;
              });
            }
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
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
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
    const { selectedRows, columns, initLoading, data, search_data, modalVisible, operateData, submiting, modal_title, modal_width, show_foot, selectedRowKeys } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}
             style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);
              //确认审核通过选中的商品吗？
            }, `审核通过`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a') : sldPopConfirm('leftBottom', `${sldComLanguage('确认审核通过选中的商品吗？')}`, () => this.batchPassData(), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('审核通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a'), 0, 0, '#0fb39a')}

            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);
              //确认审核拒绝选中的商品吗？
            }, `审核拒绝`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920') : sldIconBtn(() => this.refuse(selectedRows, 'more'), `${sldComLanguage('审核拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920')}
          </div>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'key'}
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
          title={modal_title}
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
