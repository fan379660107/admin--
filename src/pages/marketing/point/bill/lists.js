import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  list_com_page_size_10,
  sldHandlePaginationData,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  dateFormat,
  sldIconBtn,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldComHeader from '@/components/SldComHeader';
import Search from '@/components/Search/Search';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ point }) => ({
  point,
}))
@Form.create()
export default class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll_h:86,
      search_height:0,
      initLoading: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      },{
        type: 'input',
        label: `${sldComLanguage('结算单号')}`,
        name: 'billSn',
        placeholder: `${sldComLanguage('请输入结算单号')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('结算状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择结算状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('待确认')}` },
          { key: '2', name: `${sldComLanguage('待审核')}` },
          { key: '3', name: `${sldComLanguage('待结算')}` },
          { key: '4', name: `${sldComLanguage('结算完成')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('结算时间')}`,
        name: 'create_bill_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'billId',
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
          title: `${sldComLanguage('结算单号')}`,
          dataIndex: 'billSn',
          align: 'center',
          width: 200,
        },
        {
          title: `${sldComLanguage('出账时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('结算日')}`,
          dataIndex: 'startTime',
          align: 'center',
          width: 150,
          render: function(text, record) {
            return <div className={global.voucher_time_wrap}>
              <p>{text}</p>
              <p>~</p>
              <p>{record.endTime}</p>
            </div>;
          },
        },{
          title: `${sldComLanguage('使用积分')}`,
          dataIndex: 'integral',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('积分抵扣金额(元)')}`,
          dataIndex: 'integralCashAmount',
          align: 'center',
          width: 150,
        },{
          title: `${sldComLanguage('支付现金(元)')}`,
          dataIndex: 'cashAmount',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('应结金额(元)')}`,
          dataIndex: 'settleAmount',
          align: 'center',
          width: 100,
        },  {
          title: `${sldComLanguage('结算状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Link to={{
              pathname: '/marketing_point/bill_list_to_detail',
              query: {
                id: record.billId,
              },
            }}>
              {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
            </Link>
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

  resize = () =>{
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'point/get_bill_lists',
      payload: params,
      callback: (res) => {
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

        this.setState({ initLoading: false });
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

  //表格列拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    //时间处理
    if (values.create_bill_time) {
      values.startTime = values.create_bill_time[0] ? values.create_bill_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.endTime = values.create_bill_time[1] ? values.create_bill_time[1].format(dateFormat) + ' 23:59:59' : '';
      values.create_bill_time = '';
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

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 86:10,
    })
  }

  handleSldExcel = () => {
    const { params, formValues,selectedRowKeys } = this.state;
    const paramData = {
      ...params,
      ...formValues,
    };
    if(selectedRowKeys.length>0){
      paramData.billSns = selectedRowKeys.join(',');
    }
    paramData.fileName = `${sldComLanguage('结算单导出')}`;
    const { dispatch } = this.props;
    this.setState({initLoading:true})
    dispatch({
      type: 'point/export_bill_list',
      payload: paramData,
      callback: (res) => {
        this.setState({initLoading:false})
      }
    });
  };

  render() {
    const { selectedRows, columns, initLoading, data, search_data, search_height, scroll_h } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={2}
          title={`${sldComLanguage('结算账单管理')}`}
          tip_title={`${sldComLanguage('温馨提示')}`}
          tip_data={[`${sldComLanguage('计算公式：结算金额 = 现金使用金额 + 积分抵扣金额')}`, `${sldComLanguage(' 结算流程：生成结算单 > 店铺确认 > 平台审核 > 结算完成')}`]}
          handleToggleTip = {this.handleToggleTip}
        />
        <div className={global.tableListForm} ref={'search_part'} style={{marginTop:0}}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.handleSldExcel(), `${sldComLanguage('结算单导出')}`, 7, 7,15,15,4,'ziyuan23')}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-150-scroll_h-search_height-20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'billSn'}
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
