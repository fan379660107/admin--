import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldLlineRtextAddGoodsAddMargin,
  getTableNum,
  sldComLanguage,
  sldPopConfirmDiy,
  dateFormat,
  sldtbaleOpeBtnText,
  sldPopConfirm,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class OperateLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_con: '',
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      formValues: {},//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('操作人')}`,//操作人
        name: 'adminName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('操作人')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('操作行为')}`,
        name: 'logContent',
        placeholder: `${sldComLanguage('请输入操作行为')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('操作时间')}`,
        name: 'search_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      },
      ],
      columns: [
        {
          title: ' ',
          dataIndex: 'logId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('操作人')}`,
          dataIndex: 'adminName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作行为')}`,
          dataIndex: 'logContent',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作时间')}`,
          dataIndex: 'logTime',
          align: 'center',
          width: 100,
        },
        {
          title: `IP`,//IP
          dataIndex: 'logIp',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateLog(record.logId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }


  //操作日志操作  del：删除  export:操作日志导出
  operateLog = (id, type) => {
    const { params, formValues } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'sldsetting/del_operate_log';
      param_data = { logIds: id };
    } else if (type == 'export') {
      formValues.logIds = id;
      formValues.fileName = `${sldComLanguage('操作日志导出')}`;
      dis_type = 'sldsetting/export_operate_log';
      param_data = {...formValues};
      this.setState({initLoading:true})
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if(type != 'export'){
          if (res.state == 200) {
            sucTip(res.msg);
            this.setState({
              modalVisible: false,
              selectedRowKeys: [],
              selectedRows: [],
            });
            this.get_list({...params,...formValues});
          } else {
            failTip(res.msg);
          }
        }else{
          this.setState({initLoading:false})
        }
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'sldsetting/get_operate_log_lists',
      payload: params,
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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.search_time) {
      values.startTime = values.search_time[0] ? values.search_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.search_time[1] ? values.search_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.search_time;
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

  render() {
    const { selectedRows, columns, initLoading, data, search_data, selectedRowKeys } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('操作行为')}`, 0, 0, 10)}{/*操作日志管理*/}
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
          />
        </div>
        <div className={global.operate_bg}>
          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
            failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
            //确认删除选中的数据吗？
          }, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 3, 'xinzeng1', '#ff0f3c') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的数据吗')}？`, () => this.operateLog(selectedRowKeys.join(','), 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 3, 'xinzeng1', '#ff0f3c'), 0, 0, '#1890ff')}

          {sldIconBtn(() => this.operateLog(selectedRowKeys.join(','), 'export'), `${sldComLanguage('操作日志导出')}`, 7, 0, 16, 16, 3, 'ziyuan52', '#2ea9ff')}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'logId'}
            isCheck={true}
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
