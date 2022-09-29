/*
* 入驻店铺管理——入驻审核列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  sldtbaleOpeBtnText,
  list_com_page_more,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import router from 'umi/router';

let pageSize = list_com_page_size_10;
@connect(({ store, share }) => ({
  store, share,
}))
@Form.create()
export default class ApplyStoreList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height: 0,
      initLoading: false,
      scrollBarToTop: 0,//StandardTable滚动条是否返回顶部的标识，默认为0，不返回，逐渐加1
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('商品规格')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('店主账号')}`,
        name: 'vendorName',
        placeholder: `${sldComLanguage('请输入店主账号')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('店铺等级')}`,
        name: 'storeGradeId',
        placeholder: `${sldComLanguage('请选择店铺等级')}`,
        sel_data: [],
        diy: true,
        sele_key: 'gradeId',
        sele_name: 'gradeName',
      }, {
        type: 'select',
        label: `${sldComLanguage('审核状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择审核状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待审核')}` },
          { key: '2', name: `${sldComLanguage('待付款')}` },
          { key: '3', name: `${sldComLanguage('已拒绝')}` },
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
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('店主账号')}`,
          dataIndex: 'vendorName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('联系人')}`,
          dataIndex: 'contactName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('联系电话')}`,
          dataIndex: 'contactPhone',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('店铺等级')}`,
          dataIndex: 'storeGradeName',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('审核状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('拒绝理由')}`,
          dataIndex: 'refuseReason',
          align: 'center',
          width: 100,
          render: (text, record) => (text ? text : '--'),
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {record.state != 1
                ? sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.goDetail(record))
                : sldtbaleOpeBtnText(`${sldComLanguage('审核')}`, () => this.goDetail(record))
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  reason_list = [];

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_store_grade();
    setTimeout(() => {
      this.resize();
    }, 500);
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.share.flag && nextProps.share.type == 'check_settle_store') {
      //审核导致的页面更新数据
      const { params, formValues } = this.state;
      this.get_list({ ...params, ...formValues });
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: true, type: 'edit_settle_store_info', sldGlobalShareData: {} },
      });
    }
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

  goDetail = (val) => {
    router.push(`/manage_store/settle_store_list_apply_detail?id=${val.applyId}&state=${val.state}`);
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'store/get_apply_store_list',
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

  //获取店铺列表
  get_store_grade = () => {
    let { search_data } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'store/get_grade_lists',
      payload: { pageSize: list_com_page_more },
      callback: (res) => {
        if (res.state == 200) {
          let tmp_data = search_data.filter(item => item.name == 'storeGradeId')[0];
          tmp_data.sel_data = res.data.list;
        }
        this.setState({ search_data });
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
    let { formValues, scrollBarToTop } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      scrollBarToTop = scrollBarToTop + 1;
      this.setState({ params, scrollBarToTop });
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

  render() {
    const { selectedRows, search_data, columns, initLoading, data, search_height, scrollBarToTop } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 130 - search_height - 20}
            bordered={false}
            scrollBarToTop={scrollBarToTop}
            selectedRows={selectedRows}
            data={data}
            rowKey={'applyId'}
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
