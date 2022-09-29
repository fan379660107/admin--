import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldLlineRtextAddGoods,
  getTableNum,
  sldComLanguage,
  dateFormat,
  sldIconBtnBg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ sign }) => ({
  sign,
}))
@Form.create()
export default class SignMemberStatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      formValues: {},//搜索条件
      search_data: [{
        type: 'select',
        label: `${sldComLanguage('签到类型')}`,
        name: 'signType',
        placeholder: `${sldComLanguage('请选择签到类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '0', name: `${sldComLanguage('每日签到')}` },
          { key: '1', name: `${sldComLanguage('连续签到')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('签到时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }],
      columns: [
        {
          title: ' ',
          dataIndex: 'logId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('签到时间')}`,
          dataIndex: 'signTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('签到类型')}`,
          dataIndex: 'signTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('获取奖励类型')}`,
          dataIndex: 'bonusTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('获取奖励值')}`,
          dataIndex: 'bonusIntegral',
          align: 'center',
          width: 150,
          render: (text, record, index) => {
            let res = '';
            if (text) {
              res += `${text}积分`;
            }
            if (record.bonusVoucherName) {
              if (res) {
                res += '+';
              }
              res += `${record.bonusVoucherName}`;
            }
            return res;
          },
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
    const { query } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'sign/get_member_stat_detail',
      payload: { ...params, memberId: query.id },
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
    const { selectedRows, columns, initLoading, data, search_data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('会员签到明细')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'logId'}
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
