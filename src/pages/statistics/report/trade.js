//交易报表模块
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  list_com_page_size_10,
  sldHandlePaginationDataStat,
  dragSldTableColumn,
  sldIconBtnBg,
  failTip,
  sldSvgIcon,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsReportTrade extends Component {
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
      columns: [
        {
          title: `${sldComLanguage('时间')}`,
          dataIndex: 'statsTime',
          align: 'center',
          sorter: true,
          width: 80,
          defaultSortOrder: 'descend',
        },
        {
          title: `${sldComLanguage('下单数')}`,
          dataIndex: 'orderSubmitNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('下单人数')}`,
          dataIndex: 'orderSubmitMemberNum',
          align: 'center',
          sorter: true,
          width: 100,
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
          title: `${sldComLanguage('支付人数')}`,
          dataIndex: 'orderPayMemberNum',
          align: 'center',
          sorter: true,
          width: 100,
        },
        {
          title: `${sldComLanguage('支付金额')}`,
          dataIndex: 'orderPayAmount',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: <div style={{ position: 'relative' }}>
            <span style={{ marginRight: 17 }}>{sldComLanguage('支付转化率')}</span>
            <Tooltip placement="bottomLeft" title={`${sldComLanguage('下单-支付转化率：统计时间内，支付人数/下单人数')}`}>
              <div style={{ right: 0, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip>
          </div>,
          dataIndex: 'submitPayRate',
          align: 'center',
          sorter: true,
          width: 100,
          render: (text) => {
            return `${text?text:'--'}`;
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
      type: 'statistics/get_trade_report_lists',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          this.setState({
            data: res.data,
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
      const temp = sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues, 2, pageSize);
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
    params = { ...params, ...date, current:1 };
    this.get_list(params);
    this.setState({ params });
  };

  handleSldExcel = () => {
    const { params } = this.state;
    let paramData = {
      ...params,
    };
    paramData.fileName = `${sldComLanguage('订单导出')}`;
    const { dispatch } = this.props;
    this.setState({ initLoading: true });
    dispatch({
      type: 'statistics/export_trade_report',
      payload: paramData,
      callback: (res) => {
        if (res.state != undefined && res.state == 255) {
          failTip(res.msg);
        }
        this.setState({ initLoading: false });
      },
    });
  };

  render() {
    const { columns, selectedRows, data, initLoading } = this.state;
    return (
      <div className={`${stat.stat_common_table}`}>
        <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
          <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('交易报表')}`, 10, 0, 0)}
            {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
          </div>
          <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0 10px 10px' }}>
            <SldStatDate idIndex={'_report_trade'}
                         updateSelectDate={(date) => this.updateSelectDate(date, '_report_trade')}/>
          </div>
          <Spin spinning={initLoading}>
          <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10 }}>
            {/*标准表格-start*/}
            <StandardTable
              selectedRows={selectedRows}
              data={data}
              rowKey={'statsTime'}
              isCheck={false}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
              onSldHandleSeleRow={this.onSldHandleSeleRow}
              resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
              isColumnResize={false}
              border={false}
              showScrollbar={false}
            />
            {/*标准表格-end*/}
          </div>
          </Spin>
        </div>
      </div>
    );
  }
}
