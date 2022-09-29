import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import {
  list_com_page_size_10,
  sldHandlePaginationData,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  dateFormat,
  sldIconBtn,
  sldSvgIcon,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldComHeader from '@/components/SldComHeader';
import Search from '@/components/Search/Search';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ bill, share }) => ({
  bill, share
}))
@Form.create()
export default class BillListContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBarToTop: 0,//StandardTable滚动条是否返回顶部的标识，默认为0，不返回，逐渐加1
      scroll_h:86,
      search_height:0,
      spreaderFlag: false,//推手开关，默认为false，关闭
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
        label: `${sldComLanguage('结算日')}`,
        name: 'create_bill_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
        show_time: true,
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
        }, {
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
          title: `${sldComLanguage('订单金额(元)')}`,
          dataIndex: 'orderAmount',
          align: 'center',
          width: 120,
        },{
          title: `${sldComLanguage('佣金(元)')}`,
          dataIndex: 'commission',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('退单金额(元)')}`,
          dataIndex: 'refundAmount',
          align: 'center',
          width: 120,
        },{
          title: `${sldComLanguage('退还佣金(元)')}`,
          dataIndex: 'refundCommission',
          align: 'center',
          width: 120,
        },{
          title: `${sldComLanguage('平台优惠券')}`,
          dataIndex: 'platformVoucherAmount',
          align: 'center',
          width: 120,
        },{
          title: `${sldComLanguage('积分抵扣金额(元)')}`,
          dataIndex: 'integralCashAmount',
          align: 'center',
          width: 150,
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('定金赔偿金额(元)')}
            <Tooltip placement="bottomLeft" title={`${sldComLanguage('对于定金预售活动，因商家问题导致无法发货，对会员赔偿的金额')}`}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip>
          </div>,
          dataIndex: 'compensationAmount',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('应结金额(元)')}`,
          dataIndex: 'settleAmount',
          align: 'center',
          width: 100,
        },{
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
              pathname: '/manage_bill/lists_to_detail',
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
    setTimeout(()=>{
      this.resize();
    },500);
    window.addEventListener('resize', this.resize);
    this.get_setting();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.share.flag && nextProps.share.type == 'edit_bill') {
      //编辑导致的页面更新数据
      const { params, formValues } = this.state;
      this.get_list({ ...params, ...formValues });
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: false, type: '', sldGlobalShareData: {} },
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { spreaderFlag, columns } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'spreader_is_enable' },
      callback: (res) => {
        if (res.state == 200) {
          spreaderFlag = res.data[0].value == 1 ? true : false;
          //推手开启，结算列表增加推手佣金列
          if (spreaderFlag) {
            for (let i = 0; i < columns.length; i++) {
              if (columns[i].dataIndex == 'compensationAmount') {
                columns.splice(i + 1, 0, {
                  title: `${sldComLanguage('推手佣金(元)')}`,
                  dataIndex: 'attachCommission',
                  align: 'center',
                  width: 100,
                });
                break;
              }
            }
          }
        }
        this.setState({ spreaderFlag, columns });
      },
    });
  };

  resize = () =>{
    const {search_height} = this.state;
    if(this.refs.search_part!=undefined){
      if(this.refs.search_part.clientHeight != search_height){
        this.setState({search_height:this.refs.search_part.clientHeight})
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'bill/get_bill_lists',
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
    let { formValues, scrollBarToTop } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      scrollBarToTop = scrollBarToTop + 1;
      this.setState({ params, scrollBarToTop });
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
      type: 'bill/export_bill_list',
      payload: paramData,
      callback: (res) => {
        this.setState({initLoading:false})
      }
    });
  };

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 86:10,
    })
  }

  render() {
    const { selectedRows, columns, initLoading, data, search_data,search_height,scroll_h, scrollBarToTop } = this.state;
    return (
      <Fragment>
        <SldComHeader
          type={2}
          title={`${sldComLanguage('结算账单管理')}`}
          tip_title={`${sldComLanguage('温馨提示')}`}
          tip_data={[`${sldComLanguage('计算公式：结算金额 = 订单金额 - 平台佣金 + 退还佣金 - 退单金额 + 平台优惠券 + 积分抵现金额 - 定金赔偿金额 - 推手佣金')}`,`${sldComLanguage('结算流程：生成结算单 > 店铺确认 > 平台审核 > 结算完成')}`]}
          handleToggleTip = {this.handleToggleTip}
        />
        <div className={global.tableListForm}  ref={'search_part'} style={{marginTop:0}}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.handleSldExcel(), `${sldComLanguage('结算单导出')}`, 7, 7,15,15,4,'ziyuan23')}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
          scrollBarToTop={scrollBarToTop}
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
      </Fragment>
    );
  }
}
