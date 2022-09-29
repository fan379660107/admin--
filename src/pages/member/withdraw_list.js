import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  sldIconBtn,
  sldPopConfirm,
  dateFormat,
  getSldComShowMoreTtex,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ member }) => ({
  member,
}))
@Form.create()
export default class WithdrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height: 0,
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',
      params: { pageSize: pageSize },//搜索条件
      addData: [{
        type: 'textarea',
        label: `${sldComLanguage('拒绝理由')}`,
        name: 'refuseReason',
        placeholder: `${sldComLanguage('请输入拒绝理由')}`,
        extra: `${sldComLanguage('最多输入100字')}`,
        maxLength: 100,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入拒绝理由')}`,
        }],
      }],//下架数据
      operateData: [],//modal弹框数据
      search_data: [
        {
          type: 'input',
          label: `${sldComLanguage('提现单号')}`,
          name: 'cashSn',
          placeholder: `${sldComLanguage('请输入提现单号')}`,
        },
        {
          type: 'rangepicker',
          label: `${sldComLanguage('申请时间')}`,
          name: 'search_create_time',
          placeholder1: `${sldComLanguage('开始时间')}`,
          placeholder2: `${sldComLanguage('结束时间')}`,
        },
        {
          type: 'input',
          label: `${sldComLanguage('会员名')}`,
          name: 'memberName',
          placeholder: `${sldComLanguage('请输入会员名')}`,
        },
        {
          type: 'input',
          label: `${sldComLanguage('收款人')}`,
          name: 'receiveName',
          placeholder: `${sldComLanguage('请输入收款人')}`,
        },
        {
          type: 'select',
          label: `${sldComLanguage('状态')}`,
          name: 'state',
          placeholder: `${sldComLanguage('请选择审核状态')}`,
          sel_data: [
            { key: '', name: `${sldComLanguage('全部')}` },
            { key: '1', name: `${sldComLanguage('待处理')}` },
            { key: '2', name: `${sldComLanguage('已完成')}` },
            { key: '3', name: `${sldComLanguage('已拒绝')}` },
            { key: '4', name: `${sldComLanguage('提现失败')}` },
          ],
        },
        {
          type: 'select',
          label: `${sldComLanguage('提现方式')}`,
          name: 'receiveType',
          placeholder: `${sldComLanguage('请选择提现方式')}`,
          sel_data: [
            { key: '', name: `${sldComLanguage('全部')}` },
            { key: 'WXPAY', name: `${sldComLanguage('微信')}` },
            { key: 'ALIPAY', name: `${sldComLanguage('支付宝')}` },
          ],
        }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'cashId',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('提现单号')}`,
          dataIndex: 'cashSn',
          align: 'center',
          width: 120,
        },
        {
          title: `${sldComLanguage('交易流水号')}`,
          dataIndex: 'transactionSn',
          align: 'center',
          width: 150,
          render: (text) => {
            return text ? text : '--';
          },
        },
        {
          title: `${sldComLanguage('提现方式')}`,
          dataIndex: 'receiveBank',
          align: 'center',
          width: 80,
        },
        {
          title: `${sldComLanguage('申请时间')}`,
          dataIndex: 'applyTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('会员名')}`,
          dataIndex: 'memberName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('收款人')}`,
          dataIndex: 'receiveName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('手机号')}`,
          dataIndex: 'memberMobile',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('提现金额(¥)')}`,
          dataIndex: 'cashAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('手续费(¥)')}`,
          dataIndex: 'serviceFee',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('拒绝理由')}`,
          dataIndex: 'refuseReason',
          align: 'center',
          width: 100,
          render: (text) => {
            return text ? getSldComShowMoreTtex(text, 50, 200) : '--';
          },
        },
        {
          title: `${sldComLanguage('提现失败理由')}`,
          dataIndex: 'failReason',
          align: 'center',
          width: 102,
          render: (text) => {
            return text ? getSldComShowMoreTtex(text, 50, 200) : '--';
          },
        },
        {
          title: `${sldComLanguage('操作人')}`,
          dataIndex: 'adminName',
          align: 'center',
          width: 100,
          render: (text) => {
            return text ? text : '--';
          },
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 80,
          render: (text, record) => {
            return <Fragment>
              {record.state == 1 ?
                <Fragment>
                  {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确认通过该提现申请吗？')}`, () => this.operate({
                      cashIds: record.cashId,
                      isPass: true,
                    }, 'pass'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                    sldtbaleOpeBtnText(`${sldComLanguage('通过')}`, () => null))}
                  {sldtbaleOpeBtnText(`${sldComLanguage('拒绝')}`, () => this.refuse(record.cashId))}
                </Fragment>
                : '--'
              }
            </Fragment>;
          },
        },
      ],
    };
  }

  operate_ids = '';//当前操作数据id
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

  refuse = (ids) => {
    let { addData, operateData } = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    this.operate_ids = ids;
    this.setState({
      operateData,
      modal_width: 500,
      title: `${sldComLanguage('拒绝理由')}`,
      modalVisible: true,
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'member/get_withdraw_list',
      payload: { ...params },
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          res.data.list.map(item => {
            if (item.state != 1) {
              item.disabled = true;
            }
          });
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

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //操作
  operate = (id) => {
    const { params, formValues } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = 'member/audit_withdraw';
    param_data = id;
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list({ ...params, ...formValues });
          this.setState({
            modalVisible: false,
            selectedRows: [],
            selectedRowKeys: [],
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleConfirm = (val) => {
    val.isPass = false;
    val.cashIds = this.operate_ids;
    this.operate(val);
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

  render() {
    const { selectedRows, columns, initLoading, data, submiting, search_height, modalVisible, title, selectedRowKeys, search_data, operateData } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, padding: '10px 0 0 0' }}>
        <div className={global.tableListForm} style={{ marginTop: 0 }} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}
             style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);
            }, `${sldComLanguage('批量通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a') : sldPopConfirm('leftBottom', `${sldComLanguage('确认通过选中的提现申请吗？')}`, () => this.operate({
              cashIds: selectedRowKeys.join(','),
              isPass: true,
            }), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('批量通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a'), 0, 0, '#0fb39a')}

            {selectedRowKeys.length == 0 ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);
            }, `${sldComLanguage('批量拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920') : sldIconBtn(() => this.refuse(selectedRowKeys.join(',')), `${sldComLanguage('批量拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920')}
          </div>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 190 - search_height - 20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'cashId'}
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
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
        />
        {/*新增/编辑对话框-end*/}
      </div>
    );
  }
}
