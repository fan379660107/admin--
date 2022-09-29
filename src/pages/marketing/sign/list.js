/*
* 签到活动列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import Link from 'umi/link';
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
  sldLlineRtextAddGoodsAddMargin,
  getSldEmptyH,
  sldIconBtn,
  sldPopConfirmDiy,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ sign }) => ({
  sign,
}))
@Form.create()
export default class SignList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height: 0,
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'rangepicker',
        label: `${sldComLanguage('活动时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
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
          title: `${sldComLanguage('开始时间')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('结束时间')}`,
          dataIndex: 'endTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('日签奖励')}`,
          dataIndex: 'integralPerSign',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return text ? (text + `${sldComLanguage('积分')}`) : '--';
          },
        },
        {
          title: `${sldComLanguage('连签奖励')}`,
          dataIndex: 'continueNum',
          align: 'center',
          width: 100,
          render: (text, record) => {
            let res = '';
            if (text) {
              res += `${sldComLanguage('连签')}${text}${sldComLanguage('次,奖励')}`;
              if (record.bonusIntegral) {
                res += `${record.bonusIntegral}${sldComLanguage('积分')},`;
              }
              if (record.bonusVoucher) {
                res += `${sldComLanguage('一张')}${record.bonusVoucherName}`;
              }
            }
            return res;
          },
        },
        {
          title: `${sldComLanguage('活动状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('是否提醒')}`,
          dataIndex: 'isRemind',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Switch
              onChange={(checked) => this.operate({
                signActivityId: record.signActivityId,
                isRemind: checked ? 1 : 0,
              }, 'remind')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>;
          },
        },
        {
          title: `${sldComLanguage('是否开启')}`,
          dataIndex: 'state',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Switch
              onChange={(checked) => this.operate({
                signActivityId: record.signActivityId,
                isOpen: checked ? 1 : 0,
              }, 'open')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>;
          },
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_promotion/sign_to_add',
                query: {
                  id: record.signActivityId,
                  tar: 'view',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
              </Link>
              {/* 只有未开始、已结束的才可以编辑 */}
              {(record.signState == 1 || record.signState == 3) &&
              <Fragment>
                <span className={global.splitLine}></span>
                <Link to={{
                  pathname: '/marketing_promotion/sign_to_add',
                  query: {
                    id: record.signActivityId,
                    tar: 'edit',
                  },
                }}>
                  {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                </Link>
              </Fragment>
              }
              {/*只有未开始、已结束的才可以删除 */}
              {(record.signState == 1 || record.signState == 3) &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record.signActivityId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    const { search_height } = this.state;
    if (this.refs.search_part != undefined) {
      if (this.refs.search_part.clientHeight != search_height) {
        this.setState({ search_height: this.refs.search_part.clientHeight });
      }
    }
  };

  //签到操作  type: remind 提醒 open开启 del 删除
  operate = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = '';
    if (type == 'remind') {
      dis_type = 'sign/is_remind';
      param_data = id;
    } else if (type == 'del') {
      dis_type = 'sign/del';
      param_data.signActivityId = id;
    } else if (type == 'open') {
      dis_type = 'sign/is_open';
      param_data = id;
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'sign/get_lists',
      payload: { ...params, systemType: 'seller' },
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

  //搜索点击
  moreSearchToggle = () => {
    const { search_height } = this.state;
    if (this.refs.search_part != undefined) {
      if (this.refs.search_part.clientHeight != search_height) {
        this.setState({ search_height: this.refs.search_part.clientHeight });
      }
    }
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data, search_height } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}>
          <Link to={{
            pathname: '/marketing_promotion/sign_to_add',
          }}>
            {sldIconBtn(() => null, `${sldComLanguage('新建活动')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E')}
          </Link>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 100 - search_height - 20}
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
