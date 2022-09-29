/*
* 优惠券——平台优惠券列表
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
  sldIconBtn,
  formItemLayoutModal,
  sldIconBtnNo,
  sldPopConfirmDiy,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import promotion from '@/assets/css/promotion.less';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ promotion }) => ({
  promotion,
}))
@Form.create()
export default class SystemLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_height: 0,
      enableFlag: 0,//优惠券开关
      operateData: [],
      modal_width: 700,//查看规格、下架优惠券的modal框宽度
      down_reason_list: [],//获取违规下架理由
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      modalVisibleDetail: false,
      initLoading: false,
      submiting: false,
      show_foot: false,
      modalVisible: false,//是否显示规格弹框
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('优惠券规格')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      addData: [{
        type: 'select',
        label: `${sldComLanguage('下架理由')}`,
        name: 'offlineReason',
        placeholder: `${sldComLanguage('请选择下架理由')}`,
        sel_data: [],
        sele_key: 'reasonId',
        sele_name: 'content',
        diy: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择下架理由')}`,
        }],
      }, {
        type: 'textarea',
        label: `${sldComLanguage('备注')}`,
        name: 'offlineComment',
        placeholder: `${sldComLanguage('请输入违规下架理由')}`,
        extra: `${sldComLanguage('最多输入100字')}`,
        maxLength: 100,
      }],//下架数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('优惠券名称')}`,
        name: 'couponName',
        placeholder: `${sldComLanguage('请输入优惠券名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('活动状态')}`,
        name: 'state',
        placeholder: `${sldComLanguage('请选择活动状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('未开始')}` },
          { key: '2', name: `${sldComLanguage('进行中')}` },
          { key: '3', name: `${sldComLanguage('已失效')}` },
          { key: '4', name: `${sldComLanguage('已结束')}` },
        ],
      }, {
        type: 'select',
        label: `${sldComLanguage('优惠券类型')}`,
        name: 'couponType',
        placeholder: `${sldComLanguage('请选择优惠券类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('满减券')}` },
          { key: '2', name: `${sldComLanguage('折扣券')}` },
          { key: '3', name: `${sldComLanguage('随机金额券')}` },
        ],
      }, {
        type: 'select',
        label: `${sldComLanguage('获取方式')}`,
        name: 'publishType',
        placeholder: `${sldComLanguage('请选择获取方式')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('免费领取')}` },
          { key: '3', name: `${sldComLanguage('活动赠送')}` },
        ],
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('活动时间')}`,
        name: 'search_activity_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }, {
        type: 'rangepicker',
        label: `${sldComLanguage('使用时间')}`,
        name: 'search_user_time',
        placeholder1: `${sldComLanguage('开始时间')}`,
        placeholder2: `${sldComLanguage('结束时间')}`,
      }],
      view_spec_data: [{
        type: 'scroll_table',
        name: '',
        label: ``,
        width: 680,
        content: '',
        data: [],
        columns: this.goods_spec_columns,
        rowKey: 'id',
        scroll: { y: 300 },
      }],//查看规格
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('优惠券名称')}`,
          dataIndex: 'couponName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('优惠券类型')}`,
          dataIndex: 'couponTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('优惠内容')}`,
          dataIndex: 'couponContent',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('已领取/已使用/发布数')}`,
          dataIndex: 'publishNum',
          align: 'center',
          width: 150,
          render: (text, record) => {
            return <Link to={{
              pathname: '/marketing_promotion/coupon_to_receive_list',
              query: {
                id: record.couponId,
              },
            }}>
              <div className={promotion.voucher_num}>{record.receivedNum}/{record.usedNum}/{record.publishNum}</div>
            </Link>;
          },
        },
        {
          title: `${sldComLanguage('活动时间')}`,
          dataIndex: 'publishStartTime',
          align: 'center',
          width: 150,
          render: function(text, record) {
            return record.publishType==3?'--':<div className={global.voucher_time_wrap}>
              <p>{text}</p>
              <p>~</p>
              <p>{record.publishEndTime}</p>
            </div>;
          },
        },
        {
          title: `${sldComLanguage('使用时间')}`,
          dataIndex: 'effectiveStart',
          align: 'center',
          width: 150,
          render: function(text, record) {
            let res = '';
            if (record.cycle) {
              res = `${sldComLanguage('领取后')}${record.cycle}${sldComLanguage('天内')}`;
            } else {
              res = <div className={global.voucher_time_wrap}>
                <p>{text}</p>
                <p>~</p>
                <p>{record.effectiveEnd}</p>
              </div>;
            }
            return res;
          },
        },
        {
          title: `${sldComLanguage('获取方式')}`,
          dataIndex: 'publishTypeValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('活动状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
          render: function(text, record) {
            return record.publishType==3?'--':text;
          },
        },
        {
          title: `${sldComLanguage('推荐')}`,
          dataIndex: 'isRecommend',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return record.publishType == 1 ? <Switch
              onChange={(checked) => this.operate({
                couponId: record.couponId,
                isRecommend: checked ? 1 : 0,
              }, 'recommend')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/> : '--';
          },
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_promotion/coupon_to_view',
                query: {
                  id: record.couponId,
                  type: 'system',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              <Link to={{
                pathname: '/marketing_promotion/coupon_to_add',
                query: {
                  id: record.couponId,
                  type: 'copy',
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('复制')}`, () => null)}
              </Link>
              {/* 只有未开始的才可以编辑 */}
              {record.state == 1 &&
              <Fragment>
                <span className={global.splitLine}></span>
                <Link to={{
                  pathname: '/marketing_promotion/coupon_to_add',
                  query: {
                    id: record.couponId,
                    type: 'edit',
                  },
                }}>
                  {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                </Link>
              </Fragment>
              }
              {/* 只有进行中的才可以失效 */}
              {record.state == 3 &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('失效后不可恢复，是否确定失效？')}`, () => this.operate(record.couponId, 'invalid'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('失效')}`, () => null))}
              </Fragment>
              }
              {/* 只有未开始、已失效、已结束的才可以删除 */}
              {(record.state == 1 || record.state == 2 || record.state == 4) &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record.couponId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  goods_spec_columns = [
    {
      title: ' ',
      dataIndex: 'id',
      align: 'center',
      width: 30,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: `${sldComLanguage('规格名称')}`,
      dataIndex: 'specValue',
      align: 'center',
      width: 400,
    },
    {
      title: `${sldComLanguage('编码')}`,
      dataIndex: 'productCode',
      align: 'center',
      width: 200,
    },
  ];

  operate_ids = '';//当前操作的优惠券id串
  reason_list = [];

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.checkCouponState();
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

  //验证优惠券开关
  checkCouponState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'coupon_is_enable' },
      callback: (res) => {
        if (res.state == 200) {
          this.setState({ enableFlag: res.data[0].value });
        }
      },
    });
  };

  //优惠券操作  type: invalid 失效 copy 复制  del 删除
  operate = (id, type) => {
    const { params } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = '';
    if (type == 'invalid') {
      dis_type = 'promotion/invalid_coupon';
      param_data.couponId = id;
    } else if (type == 'copy') {
      dis_type = 'promotion/copy_coupon';
      param_data.couponId = id;
    } else if (type == 'del') {
      dis_type = 'promotion/del_coupon';
      param_data.couponId = id;
    } else if (type == 'recommend') {
      dis_type = 'promotion/recommend_coupon';
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

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'promotion/get_coupon_lists',
      payload: { ...params, systemType: 'admin' },
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

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
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
      values.publishStartTime = values.search_activity_time[0] ? values.search_activity_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.publishEndTime = values.search_activity_time[1] ? values.search_activity_time[1].format(dateFormat) + ' 23:59:59' : '';
      delete values.search_activity_time;
    }
    //使用时间处理
    if (values.search_user_time) {
      values.effectiveStart = values.search_user_time[0] ? values.search_user_time[0].format(dateFormat) + ' 00:00:00' : '';
      values.effectiveEnd = values.search_user_time[1] ? values.search_user_time[1].format(dateFormat) + ' 24:00:00' : '';
      delete values.search_user_time;
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

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  lockUpGoods = (ids) => {
    let { addData, operateData } = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    this.operate_ids = ids;
    this.setState({
      operateData,
      modal_width: 500,
      title: `${sldComLanguage('违规下架优惠券')}`,
      modalVisible: true,
      show_foot: true,
    });
  };

  sldHandleConfirm = (val) => {
    let selectd_reason = this.reason_list.filter(item => item.reasonId == val.offlineReason)[0];
    val.offlineReason = selectd_reason.content;
    val.couponIds = this.operate_ids;
    this.operate(val, 'down');
  };

  render() {
    const { selectedRows, search_data, columns, initLoading, data, show_preview_modal, preview_img, preview_alt_con, enableFlag, modalVisible, title, modal_width, operateData, show_foot, submiting, search_height } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
        <div className={global.tableListForm} ref={'search_part'}>
          <Search search_data={search_data} moreSearchToggle={() => this.moreSearchToggle()}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        {/*公共功能条-start*/}
        <div className={global.operate_bg}>
          <Link to={{
            pathname: '/marketing_promotion/coupon_to_add',
          }}>
            {enableFlag == 0
              ? sldIconBtnNo(() => null, `${sldComLanguage('新建优惠券')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E', `${sldComLanguage('优惠券活动未开启')}`)
              : sldIconBtn(() => null, `${sldComLanguage('新建优惠券')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E')
            }
          </Link>
        </div>
        {/*公共功能条-end*/}
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 200 - search_height - 20}
            bordered={false}
            selectedRows={selectedRows}
            data={data}
            rowKey={'couponId'}
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

        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={900}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        { /*新增/编辑对话框-start*/}
        <SldModal
          width={modal_width}
          title={title}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot={show_foot}
        />
        { /*新增/编辑对话框-end*/}
      </div>

    );
  }
}
