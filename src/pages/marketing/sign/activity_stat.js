/*
* 活动签到统计
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import Link from 'umi/link';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  sldSvgIcon,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';

let pageSize = list_com_page_size_10;
@connect(({ sign }) => ({
  sign,
}))
@Form.create()
export default class ActivityStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('活动周期')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 300,
          render: function(text, record) {
            return <div>{text}～{record.endTime}</div>;
          },
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('签到用户数')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('该活动周期内签到的总用户数')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'memberNum',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('总签到次数')}`,
          dataIndex: 'totalSign',
          align: 'center',
          width: 100,
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('新签到用户数')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('在该活动周期内第一次签到且之前从未签到过的总用户数')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'newMemberNum',
          align: 'center',
          width: 100,
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('新用户占比')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('新签到用户数/签到用户数')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'newMemberRate',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_promotion/sign_to_activity_detail',
                query: {
                  id: record.signActivityId,
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
              </Link>
            </Fragment>
          ),
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
    dispatch({
      type: 'sign/get_activity_stat_list',
      payload: { ...params },
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

  render() {
    const { selectedRows, columns, initLoading, data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'signActivityId'}
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
