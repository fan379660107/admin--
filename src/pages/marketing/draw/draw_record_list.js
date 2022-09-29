/*
* 中奖记录列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  dateFormat,
  sldHandlePaginationData,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ draw }) => ({
  draw,
}))
@Form.create()
export default class DrawRecordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawId: props.drawId,//当前活动id
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入会员名称')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('抽奖时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('中奖状态')}`,
        name: 'isPrize',
        placeholder: `${sldComLanguage('请选择中奖状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '0', name: `${sldComLanguage('未中奖')}` },
          { key: '1', name: `${sldComLanguage('已中奖')}` },
        ],
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
          title: `${sldComLanguage('会员名称')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('中奖信息')}`,
          dataIndex: 'description',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('中奖状态')}`,
          dataIndex: 'isPrizeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('抽奖时间')}`,
          dataIndex: 'recordTime',
          align: 'center',
          width: 150,
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    const {drawId} = this.state;
    dispatch({
      type: 'draw/get_draw_record_list',
      payload: { ...params, drawId: drawId },
      callback: (res) => {
        this.setState({ initLoading: false });
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
    //活动时间处理
    if (values.search_activity_time) {
      values.startTime = values.search_activity_time[0] ? values.search_activity_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_activity_time[1] ? values.search_activity_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.search_activity_time;
    }
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
    this.setState({
      formValues: values,
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize });
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 150}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'recordId'}
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
      </div>
    );
  }
}
