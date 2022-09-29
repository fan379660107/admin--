import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  list_com_page_size_10,
  getTableNum,
  dateFormat,
  sldComLanguage,
  sldPopConfirmDiy,
  dateTimeFormat,
  sldtbaleOpeBtnText,
  sldSvgIcon,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './recharge.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ order }) => ({
  order,
}))
@Form.create()
export default class RechargeList extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      loading: false,
      submiting: false,
      modalVisible: false,
      data: {},
      search_height: 0,
      statData: {},//统计数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      payData: [{
        type: 'datepicker',
        label: `${sldComLanguage('付款时间')}`,//付款时间
        name: 'pay_time',
        placeholder: `${sldComLanguage('请选择付款时间')}`,//请选择付款时间
        show_time: true,
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择付款时间')}`,//请选择付款时间
        }],
      }, {
        type: 'select',
        label: `${sldComLanguage('付款方式')}`,//付款方式
        name: 'paymentCode',
        placeholder: `${sldComLanguage('请选择付款方式')}`,//请选择付款方式
        sel_data: [
          { key: 'PCALIPAY', name: `${sldComLanguage('PC支付宝')}` },//PC支付宝
          { key: 'H5ALIPAY', name: `${sldComLanguage('H5支付宝')}` },//H5支付宝
          { key: 'PCWXPAY', name: `${sldComLanguage('PC微信')}` },//PC微信
          { key: 'H5WXPAY', name: `${sldComLanguage('H5微信')}` },//H5微信
        ],
      }, {
        type: 'input',
        label: `${sldComLanguage('平台交易号')}`,//平台交易号
        name: 'tradeSn',
        placeholder: `${sldComLanguage('请输入平台交易号')}`,//请输入平台交易号
        initialValue: '',
        maxLength: 40,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入平台交易号')}`,//请输入平台交易号
        }],
      },
      ],//modal框-积分经验值数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('会员名')}`,//会员名
        name: 'memberName',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('会员名')}`,//请输入会员名
      }, {
        type: 'input',
        label: `${sldComLanguage('手机号')}`,//手机号
        name: 'memberMobile',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('手机号')}`,//请输入手机号
      }, {
        type: 'select',
        label: `${sldComLanguage('充值状态')}`,
        name: 'payState',
        placeholder: `${sldComLanguage('请选择充值状态')}`,//请选择充值状态
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '2', name: `${sldComLanguage('已支付')}` },
          { key: '1', name: `${sldComLanguage('未支付')}` },
        ],
      }, {
        type: 'select',
        label: `${sldComLanguage('充值方式')}`,
        name: 'paymentCode',
        placeholder: `${sldComLanguage('请选择充值方式')}`,//请选择充值方式
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: 'WXPAY', name: `${sldComLanguage('微信支付')}` },
          { key: 'ALIPAY', name: `${sldComLanguage('支付宝支付')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('创建时间')}`,//创建时间
        name: 'search_create_time',
        placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
        placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('支付时间')}`,//支付时间
        name: 'search_pay_time',
        placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
        placeholder2: `${sldComLanguage('结束时间')}`,//结束时间
      },
      ],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'rechargeId',
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
          title: `${sldComLanguage('手机号')}`,//手机号
          dataIndex: 'memberMobile',
          align: 'center',
          width: 120,
        },
        {
          title: `${sldComLanguage('充值金额')}`,//充值金额
          dataIndex: 'payAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('充值方式')}`,//充值方式
          dataIndex: 'paymentName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('充值单号')}`,//充值单号
          dataIndex: 'rechargeSn',
          align: 'center',
          width: 120,
        }, {
          title: `${sldComLanguage('充值流水号')}`,//充值流水号
          dataIndex: 'tradeSn',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('充值状态')}`,//充值状态
          dataIndex: 'payStateValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('支付完成时间')}`,//支付完成时间
          dataIndex: 'payTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 120,
          render: (text, record) => (
            record.payState == 1 ? <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('付款')}`, () => this.pay(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateRecharge(record.rechargeId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment> : '--'
          ),
        },
      ],
    };
  }


  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_stat_data();
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

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'member/get_recharge_list',
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

  //获取统计数据
  get_stat_data = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'member/get_recharge_stat',
      callback: (res) => {
        if (res.state == 200) {
          this.setState({
            statData: res.data,
          });
        }
      },
    });
  };

  //去付款
  pay = (val) => {
    this.setState({
      modalVisible: true,
      title: `付款`,//付款
      curData: val,
    });
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
    if (values.search_pay_time) {
      values.payStartTime = values.search_pay_time[0] ? values.search_pay_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.payEndTime = values.search_pay_time[1] ? values.search_pay_time[1].format(dateFormat) + ' 23:59:59' : '';
      values.search_pay_time = '';
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
  //搜索模块点击展开/收起
  moreSearchToggle = () => {
    const { search_height } = this.state;
    if (this.refs.search_part != undefined) {
      if (this.refs.search_part.clientHeight != search_height) {
        this.setState({ search_height: this.refs.search_part.clientHeight });
      }
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

  //操作 del 编辑  pay 付款
  operateRecharge = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'pay') {
      param_data = id;
      dis_type = 'member/pay_recharge_log';
    } else if (type == 'del') {
      param_data.rechargeIds = id;
      dis_type = 'member/del_recharge_log';
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          if (type == 'pay') {
            //付款成功的话需要更新统计信息
            this.get_stat_data();
          }
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

  sldHandleConfirm = (val) => {
    const { curData } = this.state;
    val.payTime = val.pay_time.format(dateTimeFormat);
    delete val.pay_time;
    val.rechargeId = curData.rechargeId;
    this.operateRecharge(val, 'pay');
  };

  render() {
    const {
      selectedRows, search_data, columns, data, loading, payData, submiting, title, modalVisible, statData, search_height,
    } = this.state;
    return (
      <div className={global.common_page} style={{ padding: '10px 0 0 0' }}>
        <div className={styles.stat_part}>
          <div className={`${styles.left} ${styles.item}`}>
            {sldSvgIcon('#FD6F1B', 95, 95, 'ziyuan57')}
            <div>
              <span className={styles.num}>{statData.rechargeNum}</span>
              <p className={styles.tip}>{sldComLanguage('累计充值人数')}</p>
            </div>
          </div>
          <div className={`${styles.right} ${styles.item}`}>
            {sldSvgIcon('#FD6F1B', 95, 95, 'ziyuan58')}
            <div>
              <span className={styles.num}>{statData.rechargeSum}</span>
              <p className={styles.tip}>{sldComLanguage('累计充值金额(元)')}</p>
            </div>
          </div>
        </div>

        <div>
          <div className={global.tableListForm} ref={'search_part'}>
            <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}
            />
          </div>
          <Spin spinning={loading}>
            {/*标准表格-start*/}
            <StandardTable
              totalHeight={document.body.clientHeight - 270 - search_height - 15 - 40}
              selectedRows={selectedRows}
              data={data}
              rowKey={'rechargeId'}
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
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={payData}
        />
        {/*新增/编辑对话框-end*/}
      </div>

    );
  }
}
