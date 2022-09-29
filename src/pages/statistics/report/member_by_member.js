//会员报表模块-按会员统计
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldComLanguage,
  list_com_page_size_10,
  sldHandlePaginationDataStat,
  dragSldTableColumn,
  getTableNum,
  dateFormat,
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

export default class StatisticsReportMemberByMember extends Component {
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
        label: `${sldComLanguage('会员名')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('会员名')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('注册时间')}`,
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      },
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'memberId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('会员名')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
          render: (text) => {
            return <span title={text}>{text}</span>;
          },

        },
        {
          title: `${sldComLanguage('注册时间')}`,
          dataIndex: 'registerTime',
          align: 'center',
          sorter: true,
          width: 150,
          defaultSortOrder: 'descend',
        },
        {
          title: `${sldComLanguage('累计充值金额')}`,
          dataIndex: 'rechargeAmount',
          align: 'center',
          sorter: true,
          width: 120,
          render: (text) => {
            return `¥${text.toFixed(2)}`;
          },
        },
        {
          title: `${sldComLanguage('下单数')}`,
          dataIndex: 'orderSubmitNum',
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
      type: 'statistics/get_member_report_by_member_lists',
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
    params = { ...params, ...date, current:1 };
    this.get_list(params);
    this.props.updateExportParam(params);
    this.setState({ params });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    this.setState({
      formValues: values,
    });
    //时间处理
    if (values.search_create_time) {
      values.registerStartTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.registerEndTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat) + ' 23:59:59' : '';
      values.search_create_time = '';
    }
    let cur_params = { ...this.state.params, ...values, current: 1 };
    this.props.updateExportParam(cur_params);
    this.get_list(cur_params);
  };
  //搜索重置事件
  seaReset = () => {
    let { params } = this.state;
    delete params.memberName;
    delete params.registerStartTime;//会员注册开始时间
    delete params.registerEndTime;//会员注册结束时间
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
    const { search_data, columns, selectedRows, data, initLoading } = this.state;
    return (
      <div className={`${stat.stat_common_table}`}>
        <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0' }}>
          <SldStatDate idIndex={'_report_flow_by_store'}
                       updateSelectDate={(date) => this.updateSelectDate(date, '_report_flow_by_store')}/>
        </div>
        <div className={global.tableListForm} ref={'search_part'} style={{ marginRight: 10 }}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
          />
        </div>
        <Spin spinning={initLoading}>
        {/*标准表格-start*/}
        <StandardTable
          selectedRows={selectedRows}
          data={data}
          rowKey={'memberId'}
          isCheck={false}
          columns={columns}
          onSelectRow={this.handleSelectRows}
          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
          onSldHandleSeleRow={this.onSldHandleSeleRow}
          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
          isColumnResize={false}
          border={false}
          showScrollbar={false}
          scroll={{x:1200}}
        />
        {/*标准表格-end*/}
        </Spin>
      </div>
    );
  }
}
