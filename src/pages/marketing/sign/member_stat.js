/*
* 用户签到统计
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  sldSearchValClear,
  getSldEmptyW,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';

let pageSize = list_com_page_size_10;
@connect(({ sign }) => ({
  sign,
}))
@Form.create()
export default class MemberStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_con: '',//搜索内容
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
          title: `${sldComLanguage('会员名称')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('第一次签到')}`,
          dataIndex: 'firstSignTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('最近一次签到')}`,
          dataIndex: 'lastSignTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('签到总次数')}`,
          dataIndex: 'signTotal',
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
                pathname: '/marketing_promotion/sign_to_member_detail',
                query: {
                  id: record.memberId,
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
      type: 'sign/get_member_stat_list',
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

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { memberName: val },
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize, memberName: val });
  };

  //搜索框内容的变化
  sldSearChange = (val) => {
    this.setState({
      search_con: val.target.value,
    });
  };

  //清空搜索内容
  sldSearClear = () => {
    this.setState({
      search_con: '',
    });
    this.sldSearch('');
  };

  render() {
    const { selectedRows, columns, initLoading, data, search_con } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.operate_bg}>
          {getSldEmptyW(7)}
          {sldSearchValClear(`${sldComLanguage('请输入')}${sldComLanguage('会员名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'memberId'}
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
