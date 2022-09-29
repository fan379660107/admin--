import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  dateFormat,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ presale }) => ({
  presale,
}))
@Form.create()
export default class PreslaeListsAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height:0,
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      curData: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      cur_data: {},//多图选择器的数据
      formValues: {},//搜索条件
      search_data: [ {
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('活动名称')}`,
        name: 'presellName',
        placeholder: `${sldComLanguage('请输入活动名称')}`,
      },{
        type: 'rangepicker',
        label: `${sldComLanguage('活动时间')}`,
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择活动状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待发布')}` },
          { key: '2', name: `${sldComLanguage('未开始')}` },
          { key: '3', name: `${sldComLanguage('进行中')}` },
          { key: '4', name: `${sldComLanguage('已失效')}` },
          { key: '5', name: `${sldComLanguage('已结束')}` },
        ],
      }],
      columns: [
        {
          title: '',
          dataIndex: 'presellId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('活动名称')}`,
          dataIndex: 'presellName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('活动时间')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 100,
          render: function(text, record) {
            return <div className={global.voucher_time_wrap}>
              <p>{text}</p>
              <p>~</p>
              <p>{record.endTime}</p>
            </div>;
          },
        }, {
          title: `${sldComLanguage('活动状态')}`,
          dataIndex: 'stateValue',
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
                pathname: '/marketing_promotion/presale_goods_list',
                query: {
                  id: record.presellId,
                  type:2
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看商品')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              <Link to={{
               pathname: '/marketing_promotion/presale_to_view',
                query: {
                  id: record.presellId,
                  type:2
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看详情')}`, () => null)}
              </Link>

              {(record.state == 3||record.state == 2) &&
                <Fragment>
                  <span className={global.splitLine}></span>
                  {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定失效该活动吗？')}`, () => this.operate(record.presellId, 'exp'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('失效')}`, () => null))}
                </Fragment>
              }

              {(record.state == 1||record.state == 4 ||record.state ==5)&&
                <Fragment>
                  {/*删除后不可恢复，是否确定删除？*/}
                  {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record.presellId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () =>{
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  //活动操作  del：删除 exp: 失效
  operate = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'presale/del_activity';
      param_data = { presellId: id };
    } else if (type == 'exp') {
      dis_type = 'presale/exp_activity';
      param_data.presellId = id;
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.setState({
            modalVisible: false,
          });
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
    params.type=2
    dispatch({
      type: 'presale/get_presale_list',
      payload: params,
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
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.search_create_time;
    }
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
    this.setState({
      formValues: values,
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize });
  };

  render() {
    const { selectedRows, columns, initLoading, data, search_data,search_height } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data}
            seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()} />
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 140-search_height-15}
            selectedRows={selectedRows}
            data={data}
            rowKey={'presellId'}
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
