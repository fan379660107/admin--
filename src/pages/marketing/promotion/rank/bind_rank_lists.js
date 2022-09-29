/*
* 分类绑定的排行榜列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch, Icon } from 'antd';
import Link from 'umi/link';
import {
  sldLlineRtextAddGoods,
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldIconBtnBg,
  sldHandlePaginationData,
  sldtbaleOpeBtnText, sucTip, sldPopConfirmDiy, failTip,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ rank }) => ({
  rank,
}))
@Form.create()
export default class BindRankLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('榜单名称')}`,
        name: 'rankName',
        placeholder: `${sldComLanguage('请输入榜单名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('榜单类型')}`,
        name: 'rankType',
        placeholder: `${sldComLanguage('请选择榜单类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('畅销榜')}` },
          { key: '2', name: `${sldComLanguage('好评榜')}` },
          { key: '3', name: `${sldComLanguage('新品榜')}` },
          { key: '4', name: `${sldComLanguage('自定义')}` },
        ],
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'rankId',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('榜单名称')}`,
          dataIndex: 'rankName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('榜单分类')}`,
          dataIndex: 'categoryName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('榜单类型')}`,
          dataIndex: 'rankTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('创建时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('更新时间')}`,
          dataIndex: 'updateTime',
          align: 'center',
          width: 150,
          render: (text) => (text ? text : '--'),
        },
        {
          title: `${sldComLanguage('更新方式')}`,
          dataIndex: 'isAutoUpdateValue',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <div className={global.flex_row_center_center}>
              {text}
              {record.isAutoUpdate == 0 &&
              <Fragment>
                <div className={global.rank_sync_icon} style={{ marginLeft: 5 }}
                     onClick={() => this.operate(record.rankId, 'update')}>
                  <Icon type="sync" style={{ color: '#778595' }}/>
                </div>
              </Fragment>
              }
            </div>;
          },
        },
        {
          title: `${sldComLanguage('启用状态')}`,
          dataIndex: 'state',
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operate({
                rankId: record.rankId,
                isEnable: checked,
              }, 'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {record.state == 1
                ? <Link to={{
                  pathname: '/marketing_promotion/rank_to_add',
                  query: {
                    id: record.rankId,
                    type: 'view',
                  },
                }}>
                  {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                </Link>
                : <Fragment>
                  <Link to={{
                    pathname: '/marketing_promotion/rank_to_add',
                    query: {
                      id: record.rankId,
                      type: 'edit',
                    },
                  }}>
                    {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                  </Link>
                  <span className={global.splitLine}></span>
                  <Fragment>
                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后数据不可恢复，是否确定删除')}？`, () => this.operate(record.rankId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                      sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                  </Fragment>
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
    window.addEventListener('resize', this.resize, { passive: true });
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

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { query } = this.state;
    if (query.id != undefined && query.id) {
      params.categoryId = query.id;
    }
    dispatch({
      type: 'rank/get_rank_list',
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

  //操作  type:  del 删除 update 手动更新数据  switch 启用
  operate = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = '';
    if (type == 'del') {
      dis_type = 'rank/del_rank';
      param_data.rankId = id;
    } else if (type == 'update') {
      dis_type = 'rank/update_rank_goods';
      param_data.rankId = id;
    } else if (type == 'switch') {
      dis_type = 'rank/switch_rank';
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
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('关联榜单')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 235 - 15}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'rankId'}
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
