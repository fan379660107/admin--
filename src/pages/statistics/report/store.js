//店铺报表模块
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  list_com_page_size_10,
  sldHandlePaginationDataStat,
  dragSldTableColumn,
  sldIconBtnBg,
  failTip,
  getTableNum,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsReportStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      data: {},//列表数据
      params: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        pageSize: pageSize,
      },
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('店铺名称')}`,
      },
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'storeId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
          render: (text) => {
            return <span title={text}>{text}</span>;
          },
        },
        {
          title: `${sldComLanguage('支付金额')}`,
          dataIndex: 'orderPayAmount',
          align: 'center',
          sorter: true,
          width: 100,
          defaultSortOrder: 'descend',
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: `${sldComLanguage('下单金额')}`,
          dataIndex: 'orderSubmitAmount',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: `${sldComLanguage('支付订单数')}`,
          dataIndex: 'orderPayNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('下单数')}`,
          dataIndex: 'orderSubmitNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('店铺访客数')}`,
          dataIndex: 'visitorNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('店铺浏览量')}`,
          dataIndex: 'viewNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('商品访客数')}`,
          dataIndex: 'goodsVisitorNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('商品浏览量')}`,
          dataIndex: 'goodsViewNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('被访问商品数')}`,
          dataIndex: 'viewGoodsNum',
          align: 'center',
          sorter: true,
          width: 120,
        },
        {
          title: `${sldComLanguage('动销商品数')}`,
          dataIndex: 'salingGoodsNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('退单数')}`,
          dataIndex: 'returnNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('退单金额')}`,
          dataIndex: 'returnAmount',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
      ],
    };
  };

  componentDidMount() {
    this.get_list(this.state.params);
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/get_store_report_lists',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          this.setState({
            data: JSON.parse(JSON.stringify(res.data)),
          });
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
    let { formValues, params } = this.state;
    if (type == 'main') {
      const temp = sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues, 1, pageSize);
      pageSize = params.pageSize;
      params = { ...params, ...temp };
      this.setState({ params });
      this.get_list(params);
    }
  };

//表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { params } = this.state;
    params = { ...params, ...date, current: 1, pageSize: pageSize };
    this.get_list(params);
    this.setState({ params });
  };

  handleSldExcel = () => {
    const { params, formValues } = this.state;
    let paramData = {
      ...params,
      ...formValues,
    };
    paramData.fileName = `${sldComLanguage('订单导出')}`;
    const { dispatch } = this.props;
    this.setState({ initLoading: true });
    dispatch({
      type: 'statistics/export_store_report',
      payload: paramData,
      callback: (res) => {
        if (res.state != undefined && res.state == 255) {
          failTip(res.msg);
        }
        this.setState({ initLoading: false });
      },
    });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    this.setState({
      formValues: values,
    });
    let cur_params = { ...this.state.params, ...values, current: 1 };
    this.get_list(cur_params);
  };

  //搜索重置事件
  seaReset = () => {
    let { params } = this.state;
    delete params.storeName;
    delete params.current;
    //搜索条件置为空
    this.setState({
      formValues: {},
      data: {},
      params: params,
    });
    this.get_list(params);
  };

  render() {
    const { columns, selectedRows, data, initLoading, search_data } = this.state;
    return (
      <div className={`${stat.stat_common_table}`}>
        <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺报表')}`, 10, 0, 0)}
            {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
          </div>
          <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0 10px 10px' }}>
            <SldStatDate idIndex={'_report_store'}
                         updateSelectDate={(date) => this.updateSelectDate(date, '_report_store')}/>
          </div>
          <div className={global.tableListForm} ref={'search_part'} style={{ marginRight: 10 }}>
            <Search search_data={search_data}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
            />
          </div>
          <Spin spinning={initLoading}>
            <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10 }}>
              {/*标准表格-start*/}
              <StandardTable
                selectedRows={selectedRows}
                data={data}
                rowKey={'storeId'}
                isCheck={false}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                onSldHandleSeleRow={this.onSldHandleSeleRow}
                resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                isColumnResize={false}
                border={false}
                showScrollbar={false}
                scroll={{ x: 1400 }}
              />
              {/*标准表格-end*/}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}
