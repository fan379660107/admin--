//流量报表模块-按店铺统计
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
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsReportFlowByStore extends Component {
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
          title: `${sldComLanguage('店铺访客数')}`,
          dataIndex: 'storeVisitorNum',
          align: 'center',
          sorter: true,
          width: 100,
          defaultSortOrder: 'descend',
        },
        {
          title: `${sldComLanguage('店铺浏览量')}`,
          dataIndex: 'storeViewNum',
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
      type: 'statistics/get_flow_report_by_store_lists',
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
      if (params.sort && params.sort == 'storeViewNum') {
        //店铺浏览量
        params.sort = 'viewNum';
      }
      if (params.sort && params.sort == 'storeVisitorNum') {
        //店铺访客数
        params.sort = 'visitorNum';
      }
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
    let cur_params = { ...this.state.params, ...values, current: 1 };
    this.props.updateExportParam(cur_params);
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
    const { search_data, columns, selectedRows, data, initLoading } = this.state;
    return (
      <Fragment>
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
        />
        {/*标准表格-end*/}
        </Spin>
      </Fragment>
    );
  }
}
