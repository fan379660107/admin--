import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldLlineRtextAddGoodsAddMargin,
  list_com_page_size_10,
  getTableNum,
  dateFormat,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ member }) => ({
  member,
}))
@Form.create()
export default class List extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      loading: false,
      data: {},
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('会员名')}`,//会员名
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('会员名')}`,//请输入会员名
      }, {
        type: 'input',
        label: `${sldComLanguage('操作人')}`,//操作人
        name: 'adminName',
        placeholder: `${sldComLanguage('请输入管理员名字')}`,//请输入管理员名字
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('变更时间')}`,//变更时间
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
        placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      },
      ],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'logId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('会员名')}`,//会员名
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('变动金额(元)')}`,//变动金额(元)
          dataIndex: 'changeValue',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
            return <span style={{color:record.state == 1?'#10d154':'#f30606',whiteSpace:'noWrap'}}>{(record.state == 1?'+':'-')+text}</span>;
          },
        },
        {
          title: `${sldComLanguage('冻结金额(元)')}`,//冻结金额(元)
          dataIndex: 'freezeValue',
          align: 'center',
          width: 100,
        }, , {
          title: `${sldComLanguage('当前总金额(元)')}`,//当前总金额（元）
          dataIndex: 'afterChangeAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('当前冻结金额(元)')}`,//当前冻结金额(元)
          dataIndex: 'freezeAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('变更时间')}`,//变更时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作管理员')}`,
          dataIndex: 'adminName',
          align: 'center',
          width: 80,
        },
        {
          title: `${sldComLanguage('操作描述')}`,//操作描述
          dataIndex: 'description',
          align: 'center',
          width: 200,
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'member/get_balance_log',
      payload: { ...params },
      callback: (res) => {
        this.setState({ loading: false });
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

  //导出Excel
  Export = () => {
    const { formValues } = this.state;
    formValues.fileName = `${sldComLanguage('资金明细导出')}`;
    const { dispatch } = this.props;
    this.setState({loading:true})
    dispatch({
      type: 'member/export_balance_log',
      payload: {...formValues,type:'export'},
      callback: (res) => {
        this.setState({loading:false})
      }
    })
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.search_create_time) {
      values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat) + ' 23:59:59' : '';
      values.search_create_time = '';
    }
    for(let i in values){
      if(values[i] == ''){
        delete values[i]
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

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  render() {
    const {
      selectedRows, search_data, columns, data, loading,
    } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('资金明细')}`, 0, 0, 10)}{/*资金明细*/}
        <div>
          <div className={global.tableListForm}>
            <Search search_data={search_data}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
            />
          </div>
          {/*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.Export(), `${sldComLanguage('导出Excel')}`, 7, 0, 16, 16, 3, 'ziyuan52', '#2ea9ff')}
          </div>
          {/*公共功能条-end*/}
          <Spin spinning={loading}>
            {/*标准表格-start*/}
            <StandardTable
              totalHeight={document.body.clientHeight - 240}
              selectedRows={selectedRows}
              data={data}
              rowKey={'logId'}
              isCheck={false}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
              resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
              isColumnResize={true}
              showMarkColor={true}
            />
            {/*标准表格-end*/}
          </Spin>
        </div>
      </div>
    );
  }
}
