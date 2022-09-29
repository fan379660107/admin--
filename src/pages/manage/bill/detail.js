import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form,Tooltip } from 'antd';
import {
  sldCommonTitle,
  getTableNum,
  list_com_page_size_10,
  sldLlineRtextAddGoods,
  getSldHorLine,
  sldIconBtnBg,
  sldComLanguage,
  sucTip,
  failTip,
  formItemLayoutModal,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  getSldEmptyH,
  sldSvgIcon,
} from '@/utils/utils';
import { settle_account_bank, settle_account_alipay } from '@/utils/util_data';
import global from '@/global.less';
import bill from './bill.less';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import { Scrollbars } from 'react-custom-scrollbars';
import StandardTable from '@/components/StandardTable';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldModal from '@/components/SldModal/SldModal';
import Link from 'umi/link';
import { apiUrl } from '@/utils/sldconfig';

let pageSize = list_com_page_size_10;
let sthis = '';
@connect(({ bill, share }) => ({
  bill, share
}))
@Form.create()
export default class BillDetail extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      spreaderFlag: false,//推手开关，默认为false，关闭
      preview_img: '',
      show_preview_modal: false,
      modal_width: 500,//modal框的宽度
      show_foot: true,//是否展示modal框的底部操作按钮
      title: '',//modal框title
      submiting: false,
      modalVisible: false,
      query: props.location.query,
      params: { pageSize: pageSize },//搜索条件
      settle_account: [],//结算账户信息
      bill_base_data: [{
        type: 'show_text',
        label: `${sldComLanguage('结算单号')}`,
        name: 'billSn',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('结算起止时间')}`,
        name: 'startTime',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('店铺联系人')}`,
        name: 'contactName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('店铺联系电话')}`,
        name: 'contactPhone',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//结算信息
      bill_detail_data: {},//结算单详情数据
      operateData: [],//modal框数据
      bill_progress_data: [{
        code: 'createBill',
        state: `${sldComLanguage('生成结算单')}`,
        time: '',
        state_code: 1,
        cur_state: 'cur',
      }, {
        code: 'storeConfirm',
        state: `${sldComLanguage('店铺确认')}`,
        time: '',
        state_code: 2,
        cur_state: 'no',
      }, {
        code: 'systemCheck',
        state: `${sldComLanguage('平台审核')}`,
        time: '',
        state_code: 3,
        cur_state: 'no',
      }, {
        code: 'finish',
        state: `${sldComLanguage('结算完成')}`,
        time: '',
        state_code: 4,
        cur_state: 'no',
      }],//结算进度数据
      bill_settle_img: [{
        type: 'show_text',
        label: `${sldComLanguage('打款备注')}`,
        name: 'paymentRemark',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_goods_img_more',
        label: `${sldComLanguage('结算凭证')}`,
        name: 'paymentEvidence',
        initialValue: '',
        data: [],
        item_height: 142,
        preView: this.viewImg,
      }],//结算凭证
      addData: [{
        type: 'textarea',
        label: `${sldComLanguage('打款备注')}`,
        disable: true,
        name: 'paymentRemark',
        placeholder: `${sldComLanguage('请输入汇款单号、支付方式等付款凭证信息，最多输入200字')}`,
        initialValue: '',
        maxLength: 200,
      }, {
        type: 'upload_img_upload',
        label: `${sldComLanguage('打款凭证')}`,
        name: 'image',
        required: true,
        fileList: [],
        img_info: {},
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=setting`,
        uploadPreview: this.uploadImgPre,
        uploadChange: (info) => this.uploadImg(info, 'image'),
        initialValue: '',
      }],//确认打款数据
      columns_order: [
        {
          title: ' ',
          dataIndex: 'bindId',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('订单号')}`,
          dataIndex: 'orderSn',
          align: 'center',
          width: 120,
        },
        {
          title: `${sldComLanguage('订单金额(元)')}`,
          dataIndex: 'orderAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('佣金(元)')}`,
          dataIndex: 'commission',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('退还佣金(元)')}`,
          dataIndex: 'refundCommission',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('退单金额(元)')}`,
          dataIndex: 'refundAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('平台优惠券')}`,
          dataIndex: 'platformVoucherAmount',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('积分抵扣金额')}`,
          dataIndex: 'integralCashAmount',
          align: 'center',
          width: 100,
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
          title: `${sldComLanguage('下单日期')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 120,
        },
        {
          title: `${sldComLanguage('完成日期')}`,
          dataIndex: 'finishTime',
          align: 'center',
          width: 120,
        }, {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Link to={{
              pathname: '/manage_order/order_lists_to_detail',
              query: {
                orderSn: record.orderSn,
              },
            }}>
              {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
            </Link>
          ),
        }],//订单商品规格表头
    };
  }

  needUpdate = 0;//是否需要更新上级页面数据

  componentDidMount() {
    const { query } = this.state;
    this.get_bill_detail(query.id);
    this.get_setting();
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { spreaderFlag, columns_order } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'spreader_is_enable' },
      callback: (res) => {
        if (res.state == 200) {
          spreaderFlag = res.data[0].value == 1 ? true : false;
          //推手开启，结算列表增加推手佣金列
          if (spreaderFlag) {
            for (let i = 0; i < columns_order.length; i++) {
              if (columns_order[i].dataIndex == 'compensationAmount') {
                columns_order.splice(i + 1, 0, {
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
        this.setState({ spreaderFlag, columns_order });
      },
    });
  };

  //预览图片
  uploadImgPre = (info) => {
    this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadImg = (info, type) => {
    let { addData } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in addData) {
        if (addData[i].name == type) {
          addData[i].fileList = info.fileList;
          addData[i].img_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
        }
      }
      this.setState({ addData });
    }
  };

  //获取结算详情
  get_bill_detail = (id) => {
    const { dispatch } = this.props;
    let { bill_base_data, bill_detail_data, bill_progress_data, settle_account, bill_settle_img } = this.state;
    dispatch({
      type: 'bill/get_bill_detail',
      payload: { billId: id },
      callback: async (res) => {
        if (res.state == 200) {
          bill_detail_data = res.data;

          //结算账户信息 账户类型：1-银行账号；2-支付宝账号
          settle_account = [];
          let settleAccount = [];
          if (bill_detail_data.accountType == 1) {
            settleAccount = settle_account_bank();
          } else {
            settleAccount = settle_account_alipay();
          }
          settleAccount.map((item) => {
            settle_account.push({
              type: 'show_text',
              label: `${item.label}`,
              name: `${item.code}`,
              extra: ``,
              item_height: 42,
              text: bill_detail_data[item.code],
            });
          });

          //结算信息
          for (let reagent in bill_base_data) {
            if (bill_base_data[reagent].name == 'startTime') {
              bill_base_data[reagent].text = bill_detail_data.startTime + ' ~ ' + bill_detail_data.endTime;
            } else {
              bill_base_data[reagent].text = bill_detail_data[bill_base_data[reagent].name];
            }
          }

          bill_settle_img.map(item => {
            if (item.name == 'paymentEvidence') {
              item.data = bill_detail_data[item.name]?[{ imageUrl: bill_detail_data[item.name] }]:[];
            } else {
              item.text = bill_detail_data[item.name]?bill_detail_data[item.name]:'--';
            }
          });

          for (let pro in bill_progress_data) {
            if (pro < bill_detail_data.logList.length) {
              bill_progress_data[pro].time = bill_detail_data.logList[pro].createTime;
            }
            if (bill_detail_data.state < bill_progress_data[pro].state_code) {
              bill_progress_data[pro].cur_state = 'no';
            } else if (bill_detail_data.state == bill_progress_data[pro].state_code) {
              bill_progress_data[pro].cur_state = 'cur';
            } else {
              bill_progress_data[pro].cur_state = 'pass';
            }
          }

          this.setState({
            loading: false,
            bill_base_data,//订单信息
            bill_detail_data,
            bill_progress_data,
            settle_account,
            bill_settle_img,
          });
        }
      },
    });
  };

  //确认打款
  pay = () => {
    const { addData } = this.state;
    for (let i in addData) {
      if (addData[i].type == 'upload_img_upload') {
        addData[i].fileList = [];
        addData[i].img_info = {};
      } else {
        addData[i].initialValue = '';
      }
    }
    this.setState({
      addData,
      modalVisible: true,
      title: `${sldComLanguage('确认打款')}`,
    });
  };

  //结算单操作  type:操作类型   settle：确认打款
  operateBill = (id, type) => {
    const { query } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'settle') {
      dis_type = 'bill/settle_bill';
      param_data = id;
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          this.needUpdate++;
          sucTip(res.msg);
          this.setState({
            modalVisible: false,
          });
          this.get_bill_detail(query.id);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    const { addData } = this.state;
    let param = {};
    param.billId = this.state.query.id;
    param.paymentRemark = val.paymentRemark;
    for (let i in addData) {
      if (addData[i].name == 'image') {
        if (addData[i].img_info.path == undefined) {
          param.paymentEvidence = '';
          failTip(sldComLanguage('请上传打款凭证～'));
          return false;
        } else {
          param.paymentEvidence = addData[i].img_info.path;
        }
      }
    }
    this.operateBill(param, 'settle');
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '') => {
    this.setState({
      preview_img: img,
      show_preview_modal: flag,
    });
  };

  //审核结算单操作
  checkConfirm = () => {
    const { dispatch } = this.props;
    let { query } = this.state;
    dispatch({
      type: 'bill/check_bill',
      payload: { billId: query.id },
      callback: async (res) => {
        if (res.state == 200) {
          this.needUpdate++;
          sucTip(res.msg);
          this.get_bill_detail(query.id);
        } else if (res.state == 255) {
          failTip(res.msg);
        }
      },
    });
  };

  goBack = () => {
    if(this.needUpdate>0){
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: true, type: 'edit_bill', sldGlobalShareData: {} },
      });
    }
    this.props.history.goBack();
  }

  render() {
    const { bill_base_data, bill_detail_data, submiting, modalVisible, addData, title, show_foot, modal_width, bill_progress_data, settle_account, bill_settle_img, preview_img, show_preview_modal, spreaderFlag, columns_order } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('结算详情')}`)}
          {sldIconBtnBg(() => this.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldHorLine(1)}
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 100}>
          <div className={`${global.flex_row_center_start} ${bill.progress}`}>
            {bill_progress_data.map((item, index) => {
              return <div key={index}
                          className={`${global.flex_column_start_center} ${bill.item}`}>
                <div className={`${bill.top} ${global.flex_row_center_center}`}>
                  <span className={`${bill.left_line}`}/><img
                  src={require(`../../../assets/bill/${index + 1}_${item.cur_state}.png`)}/><span
                  className={`${bill.right_line}`}/>
                </div>
                <span className={`${bill.state}`}>{item.state}</span>
                <span className={`${bill.time}`}>{item.time}</span>
              </div>;
            })}
          </div>
          {bill_detail_data.state == 1 &&
          <div className={`${bill.state_part} ${global.flex_column_start_center}`}>
            <span className={bill.title}>{sldComLanguage('等待店铺确认')}</span>
          </div>
          }
          {bill_detail_data.state == 2 &&
          <div className={`${bill.state_part} ${global.flex_column_start_center}`}>
            <span className={bill.title}>{sldComLanguage('等待平台审核')}</span>
            {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确认审核通过该结算单？')}`, () => this.checkConfirm(), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
              <div className={bill.invoice_btn}>{sldComLanguage('审核结算单')}</div>)}
          </div>
          }
          {bill_detail_data.state == 3 &&
          <div className={`${bill.state_part} ${global.flex_column_start_center}`}>
            <span className={bill.title}>{sldComLanguage('等待平台结算')}</span>
            <div onClick={() => this.pay()} className={bill.invoice_btn}>确认打款</div>
          </div>
          }
          {bill_detail_data.state == 4 &&
          <div className={`${bill.state_part} ${global.flex_column_start_center}`}>
            <span className={bill.title}>{sldComLanguage('结算完成')}</span>
          </div>
          }
          {sldCommonTitle('结算信息', '#333', 5, 15, 15)}
          <div className={`${bill.detail_total_part} ${global.flex_row_start_center}`}>
            <img src={require('../../../assets/bill/detail_total_icon.png')}/>
            <span
              className={bill.amount_total}>&nbsp;{sldComLanguage('结算金额')}￥{bill_detail_data.settleAmount} = &nbsp;</span>
            <span
              className={bill.amount_detail}> {sldComLanguage('订单金额￥')}{bill_detail_data.orderAmount} - {sldComLanguage('平台佣金￥')}{bill_detail_data.commission} +{sldComLanguage('退还佣金￥')}{bill_detail_data.refundCommission} - {sldComLanguage('退单金额￥')}{bill_detail_data.refundAmount} + {sldComLanguage('平台优惠券￥')}{bill_detail_data.platformVoucherAmount} + {sldComLanguage('积分抵扣金额￥')}{bill_detail_data.integralCashAmount} - {sldComLanguage('定金赔偿金额￥')}{bill_detail_data.compensationAmount}
              {spreaderFlag &&
              <Fragment>
                - {sldComLanguage('推手佣金￥')}{bill_detail_data.attachCommission}
              </Fragment>
              }
            </span>

          </div>
          {bill_detail_data.state == 4 && (bill_detail_data.paymentEvidence||bill_detail_data.paymentRemark) &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('结算凭证')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                            data={bill_settle_img}/>
          </Fragment>
          }

          {sldCommonTitle(`${sldComLanguage('结算信息')}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={bill_base_data}/>

          {bill_detail_data.state != 1 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('结算账号信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            data={settle_account}/>
          </Fragment>
          }
          {sldCommonTitle(`${sldComLanguage('结算订单信息')}`, '#333', 5, 15, 15)}
          <StandardTable
            selectedRows={[]}
            data={{ list: bill_detail_data.orderList, pagination: {} }}
            size={'small'}
            rowKey={'orderSn'}
            isCheck={false}
            columns={columns_order}
            sldpagination={false}
          />
          {getSldEmptyH(40)}
        </Scrollbars>
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          show_foot={show_foot}
          width={modal_width}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        {/*新增/编辑对话框-end*/}
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={`${sldComLanguage('商品图片')}`} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
}
