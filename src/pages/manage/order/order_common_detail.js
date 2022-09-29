import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Radio, Modal, Select, Input } from 'antd';
import {
  sldComLanguage,
  failTip,
  sucTip,
  getSldHorLine,
  getSldListGoodsImg80,
  sldLlineRtextAddGoods,
  sldIconBtnBg,
  sldCommonTitle,
  list_com_page_more,
  formItemLayoutModal,
  getSldEmptyH,
  pageClose,
} from '@/utils/utils';
import global from '@/global.less';
import order from './order.less';
import { Scrollbars } from 'react-custom-scrollbars';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import SldModal from '@/components/SldModal/SldModal';
import StandardTable from '@/components/StandardTable';

const { info } = Modal;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let sthis = '';
@connect(({ order }) => ({
  order,
}))
@Form.create()
export default class Order_detail extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      reserve_info: [],//用户预留信息
      query: props.location.query,
      order_detail: {},
      return_progress_data: [], //退货进度条
      invoice_info: [{
        type: 'show_text',
        label: `${sldComLanguage('单位名称')}`,
        name: 'invoiceTitle',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('税号')}`,
        name: 'taxCode',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('收票邮箱')}`,
        name: 'receiverEmail',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//公司——普通发票
      receiver_info: [{ //收货人信息
        type: 'show_text',
        label: `${sldComLanguage('会员名称')}`,
        name: 'memberName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('收货人')}`,
        name: 'receiverName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('收货人手机号')}`,
        name: 'receiverMobile',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('收货地址')}`,
        name: 'receiverAreaInfo',
        extra: ``,
        item_height: 42,
        text: ``,
      }],
      order_info: [{
        type: 'show_text',
        label: `${sldComLanguage('订单类型')}`,
        name: 'orderTypeValue',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('订单号')}`,
        name: 'orderSn',
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
        label: `${sldComLanguage('支付方式')}`,
        name: 'paymentName',
        extra: ``,
        item_height: 42,
        text: ``,
      }, {
        type: 'show_text',
        label: `${sldComLanguage('订单备注')}`,
        name: 'orderRemark',
        extra: ``,
        item_height: 42,
        text: ``,
      }],//订单信息
      goodsInfoList: [], //商品信息
      orderLogList: [],
      operateData: [], //弹框操作数据
      resList: [], // 取消原因数据
      modalVisible: false,
      titleName: '',
      submiting: false,
      show_foot: true,
      modal_width: 700,
      propType: '',
      deliverModal: false,
      expressList: [], //快递公司数据
      deliverType: '', //发货方式
    };
  }


  columns_order_goods = [
    {
      title: ' ',
      align: 'center',
      width: 30,
      render: (text, record, index) => index * 1 + 1,
    },
    {
      title: `${sldComLanguage('商品信息')}`,
      dataIndex: 'productImage',
      align: 'center',
      width: 500,
      render: (text, record) => {
        return <div className={`${order.goods_info} ${global.com_flex_row_flex_start}`}>
          <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
          <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
    <span className={order.goods_name} style={{ marginTop: 6, width: 380 }} title={record.goodsName}>
    {record.goodsName}
    </span>
            <span className={order.goods_brief} title={record.specValue}>
    {record.specValues}
    </span>
          </div>
        </div>;
      },
    },
    {
      title: `${sldComLanguage('单价(元)')}`,
      dataIndex: 'productShowPrice',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('数量')}`,
      dataIndex: 'productNum',
      align: 'center',
      width: 100,
    },
  ];//订单商品表头

  columns_order_log = [
    {
      title: ' ',
      align: 'center',
      width: 30,
      render: (text, record, index) => index * 1 + 1,
    },
    {
      title: `${sldComLanguage('操作方')}`,
      dataIndex: 'logRole',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        let con = '';
        if (text == 1) {
          con = '系统管理员';
        } else if (text == 2) {
          con = '商家';
        } else if (text == 2) {
          con = '会员';
        }
        return con;
      },
    }, {
      title: `${sldComLanguage('操作人')}`,
      dataIndex: 'logUserName',
      align: 'center',
      width: 100,
    }, {
      title: `${sldComLanguage('操作时间')}`,
      dataIndex: 'logTime',
      align: 'center',
      width: 150,
    }, {
      title: `${sldComLanguage('操作内容')}`,
      dataIndex: 'logContent',
      align: 'center',
      width: 200,
    },
  ];//订单操作日志表头

  invoice_info_other = [{ //收票信息
    type: 'show_text',
    label: `${sldComLanguage('是否需要开票')}`,
    name: 'invoiceStatus',
    extra: ``,
    item_height: 42,
    text: `${sldComLanguage('否')}`,
  }];//不需要发票的情况

  invoice_info_personal = [{
    type: 'show_text',
    label: `${sldComLanguage('发票抬头')}`,
    name: 'invoiceTitle',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('收票邮箱')}`,
    name: 'receiverEmail',
    extra: ``,
    item_height: 42,
    text: ``,
  }];//个人发票

  invoice_info_VAT = [{
    type: 'show_text',
    label: `${sldComLanguage('单位名称')}`,
    name: 'invoiceTitle',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('税号')}`,
    name: 'taxCode',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('注册地址')}`,
    name: 'registerAddr',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('注册电话')}`,
    name: 'registerPhone',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('开户银行')}`,
    name: 'bankName',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('银行账户')}`,
    name: 'bankAccount',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('收票人')}`,
    name: 'receiverName',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('收票电话')}`,
    name: 'receiverMobile',
    extra: ``,
    item_height: 42,
    text: ``,
  }, {
    type: 'show_text',
    label: `${sldComLanguage('收票地址')}`,
    name: 'receiverAddress',
    extra: ``,
    item_height: 42,
    text: ``,
  }];//公司发票——增值税发票


  componentDidMount() {
    const { query } = this.state;
    this.get_order_detail({ orderSn: query.orderSn });
  }

  get_order_detail = (params) => {
    const { dispatch } = this.props;
    let { order_detail, return_progress_data, invoice_info, receiver_info, order_info, goodsInfoList, orderLogList, reserve_info } = this.state;
    dispatch({
      type: 'order/get_order_detail',
      payload: params,
      callback: res => {
        if (res.state == 200) {
          order_detail = res.data;
          orderLogList = res.data.orderLogs;
          //收票信息
          if (order_detail.invoiceStatus == 1) {
            let invoice_type = '';
            if (order_detail.invoiceInfo.titleType == 1) {
              //个人发票
              invoice_info = JSON.parse(JSON.stringify(this.invoice_info_personal));
              invoice_type = `${sldComLanguage('个人发票')}`;
            } else {
              //公司发票
              if (order_detail.invoiceInfo.invoiceType != 1) {
                //增值税发票
                invoice_info = JSON.parse(JSON.stringify(this.invoice_info_VAT));
                invoice_type = `${sldComLanguage('增值税专用发票')}`;
              } else {
                invoice_type = `${sldComLanguage('普通发票')}`;
              }
            }

            //需要发票
            for (let item in invoice_info) {
              invoice_info[item].text = !order_detail['invoiceInfo'][invoice_info[item].name] ? '--' : order_detail['invoiceInfo'][invoice_info[item].name];
            }
            let invoice_content = order_detail.invoiceInfo.invoiceContent == 1 ? `${sldComLanguage('商品明细')}` : `${sldComLanguage('商品类别')}`;
            //需要添加发票类型和发票内容
            invoice_info = [{
              type: 'show_text',
              label: `${sldComLanguage('发票类型')}`,
              name: 'invoiceTypeCombine',
              extra: ``,
              item_height: 42,
              text: invoice_type,
            }, {
              type: 'show_text',
              label: `${sldComLanguage('发票内容')}`,
              name: 'invoiceContent',
              extra: ``,
              item_height: 42,
              text: invoice_content,
            }, ...invoice_info];

          } else {
            //不需要发票
            invoice_info = JSON.parse(JSON.stringify(this.invoice_info_other));
          }

          //收货人信息
          receiver_info.map(item=>{
            if (item.name == 'receiverAreaInfo') {
              item.text = order_detail.receiverAreaInfo + ' ' + order_detail.receiverAddress;
            } else {
              item.text = !order_detail[item.name] ? '--' : order_detail[item.name];
            }
          })

          //订单信息
          for (let item in order_info) {
            if (order_info[item].name == 'orderTypeValue') {
              order_info[item].text = order_detail[order_info[item].name]
                ? (`${order_detail[order_info[item].name]}${sldComLanguage('订单')}${order_detail.isVirtualGoods == 2 ? ('、' + sldComLanguage('虚拟订单')) : ''}`)
                : (order_detail.isVirtualGoods == 2 ? `${sldComLanguage('虚拟订单')}` : `${sldComLanguage('普通订单')}`);
            } else {
              order_info[item].text = order_detail[order_info[item].name] == '' ? '--' : order_detail[order_info[item].name];
            }
          }

          //用户预留信息
          if (order_detail.isVirtualGoods == 2 && order_detail.orderReserveList.length != undefined && order_detail.orderReserveList.length) {
            order_detail.orderReserveList.map(item => {
              reserve_info.push({
                type: 'show_text',
                label: item.reserveName,
                name: item.reserveId,
                extra: ``,
                item_height: 42,
                text: item.reserveValue,
              });
            });
          }

          if (order_detail.orderState == 0) { // 订单取消
            return_progress_data.push({
              icon: require('../../../assets/order/submit_pass.png'),
              state: `${sldComLanguage('提交订单')}`,
              time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/fail_current.png'),
              state: `${sldComLanguage('订单取消')}`,
              time: (orderLogList.length > 0 && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
              state_color: 'rgba(255, 113, 30,1)',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: 'rgba(255, 113, 30,1)',
            });
          } else if (order_detail.orderState == 10) { //未付款订单
            return_progress_data.push({
              icon: require('../../../assets/order/submit_current.png'),
              state: `${sldComLanguage('提交订单')}`,
              time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
              state_color: 'rgba(255, 113, 30,1)',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: 'rgba(255, 113, 30,1)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/pay_future.png'),
              state: `${sldComLanguage('付款成功')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#eee',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/deliver_future.png'),
              state: `${sldComLanguage('商品发货')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#eee',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/suc_future.png'),
              state: `${sldComLanguage('订单完成')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#222',
            });
          } else if (order_detail.orderState == 20) {
            return_progress_data.push({
              icon: require('../../../assets/order/submit_pass.png'),
              state: `${sldComLanguage('提交订单')}`,
              time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/pay_current.png'),
              state: `${sldComLanguage('付款成功')}`,
              time: (orderLogList.length > 0 && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
              state_color: 'rgba(255, 113, 30,1)',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: 'rgba(255, 113, 30,1)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/deliver_future.png'),
              state: `${sldComLanguage('商品发货')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#eee',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/suc_future.png'),
              state: `${sldComLanguage('订单完成')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#222',
            });
          } else if (order_detail.orderState == 30) {
            return_progress_data.push({
              icon: require('../../../assets/order/submit_pass.png'),
              state: `${sldComLanguage('提交订单')}`,
              time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/pay_pass.png'),
              state: `${sldComLanguage('付款成功')}`,
              time: (orderLogList.length > 0 && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/deliver_current.png'),
              state: `${sldComLanguage('商品发货')}`,
              time: (orderLogList.length > 0 && orderLogList[2].logTime != undefined) ? orderLogList[2].logTime : '',
              state_color: 'rgba(255, 113, 30,1)',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: 'rgba(255, 113, 30,1)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/suc_pass.png'),
              state: `${sldComLanguage('订单完成')}`,
              time: '',
              state_color: '#999999',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: '#222',
            });
          } else if (order_detail.orderState == 40) {
            return_progress_data.push({
              icon: require('../../../assets/order/submit_pass.png'),
              state: `${sldComLanguage('提交订单')}`,
              time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/pay_pass.png'),
              state: `${sldComLanguage('付款成功')}`,
              time: (orderLogList.length > 0 && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/deliver_pass.png'),
              state: `${sldComLanguage('商品发货')}`,
              time: (orderLogList.length > 0 && orderLogList[2].logTime != undefined) ? orderLogList[2].logTime : '',
              state_color: 'rgba(255, 113, 30, .6)',
              time_color: 'rgba(255, 113, 30, .3)',
              line_color: 'rgba(255, 113, 30, .3)',
            });
            return_progress_data.push({
              icon: require('../../../assets/order/suc_current.png'),
              state: `${sldComLanguage('订单完成')}`,
              time: (orderLogList.length > 0 && orderLogList[3].logTime != undefined) ? orderLogList[3].logTime : '',
              state_color: 'rgba(255, 113, 30,1)',
              time_color: 'rgba(255, 113, 30, .5)',
              line_color: 'rgba(255, 113, 30,1)',
            });
          }

          this.setState({
            order_detail: res.data,
            invoice_info,
            receiver_info,
            order_info,
            reserve_info,
            return_progress_data,
            goodsInfoList: order_detail.orderProductList,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  get_afsReasonlist = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/order_reason',
      payload: {
        afsType: 2,
        pageSize: list_com_page_more,
      },
      callback: res => {
        if (res.state == 200) {
          this.setState({
            resList: res.data.list,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  agreeReturn = (type) => {
    const { dispatch } = this.props;
    let { resList, modalVisible, operateData, deliverModal, query, show_foot, order_detail } = this.state;
    let titlename = '';
    let cancleBool = false, deliverBool = false;
    if (type == 'cancleOrder') {
      operateData.push({
        type: 'onlytxt',
        label: ' ',
        content: `${sldComLanguage('*取消订单后，订单将自动关闭；')}`,
        fontSize: '12px',
        fontColor: '#6072C5',
        right: 18,
        bgcColor: '#F2F2F2',
      });
      operateData.push({
        type: 'select',
        label: `${sldComLanguage('取消理由')}`,
        name: 'cancelReasonId',
        placeholder: `${sldComLanguage('请选择取消理由')}`,
        sel_data: resList,
        sele_key: 'reasonId',
        sele_name: 'content',
        diy: true,
        rules: [{
          required: true,
          message: `${sldComLanguage('请选择取消理由')}`,
        }],
      });
      operateData.push({
        type: 'textarea',
        label: `${sldComLanguage('取消备注')}`,
        name: 'cancelRemark',
        placeholder: `${sldComLanguage('请输入取消备注，最多50个字')}`,
        initialValue: '',
      });
      titlename = `${sldComLanguage('取消订单')}`;
      cancleBool = true;
      show_foot = true;
    } else if (type == 'deliver') {
      dispatch({
        type: 'order/get_express',
        payload: { pageSize: list_com_page_more },
        callback: res => {
          if (res.state == 200) {
            deliverBool = true;
            this.setState({
              expressList: res.data.list,
              deliverModal: deliverBool && !deliverModal,
              propType: type,
              show_foot: true,
            });
          } else {
            failTip(res.msg);
          }
        },
      });
    } else if (type == 'flow') {
      if (order_detail.deliverType == 1) {
        //无需物流
        info({
          width: 470,
          title: '该订单是自行配送，您可以联系配送人了解具体进度',
          content: <div>
            <p>配送人姓名：{order_detail.deliverName}</p>
            <p>配送人手机号：{order_detail.deliverMobile}</p>
          </div>,
        });
      } else {
        dispatch({
          type: 'order/get_flow',
          payload: { orderSn: query.orderSn },
          callback: res => {
            if (res.state == 200) {
              if (res.data.routeList == null) {
                res.data.routeList = [];
              }
              operateData.push({
                type: 'show_express',
                content: res.data,
              });
              cancleBool = true;
              titlename = `${sldComLanguage('物流信息')}`;
              this.setState({
                operateData: operateData,
                modalVisible: cancleBool && !modalVisible,
                titleName: titlename,
                propType: type,
                show_foot: false,
              });
            } else {
              failTip(res.msg);
            }
          },
        });
      }
    }

    this.setState({
      operateData: operateData,
      modalVisible: cancleBool && !modalVisible,
      titleName: titlename,
      propType: type,
      show_foot,
    });

  };

  //弹框确定操作
  sldHandleConfirm = (val) => {
    const { propType, query, modalVisible } = this.state;
    const { dispatch } = this.props;
    if (propType == 'cancleOrder') {
      val.orderSn = query.orderSn;
      dispatch({
        type: 'order/cancleOrder',
        payload: val,
        callback: res => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.setState({
              modalVisible: !modalVisible,
              return_progress_data: [],
            });
            this.get_orderDetail({ orderSn: query.orderSn });
          } else {
            failTip(res.msg);
          }
        },
      });
    }
  };

  //弹框取消操作
  sldHandleCancle = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      operateData: [],
    });
  };

  sldDeliverHandleCancle = () => {
    const { deliverModal } = this.state;
    this.setState({
      deliverModal: !deliverModal,
      deliverType: '',
    });
  };

  deliverConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { query } = this.state;
        const { dispatch } = this.props;
        values.orderSn = query.orderSn;
        dispatch({
          type: 'order/confirmDelivery',
          payload: values,
          callback: res => {
            if (res.state == 200) {
              sucTip(res.msg);
              this.setState({
                deliverModal: false,
                return_progress_data: [],
                deliverType: '',
              });
              this.get_orderDetail({ orderSn: query.orderSn });
            } else {
              failTip(res.msg);
            }
          },
        });
      }
    });
  };

  //选择发货方式
  redioOnChange = (e) => {
    this.setState({
      deliverType: e.target.value,
    });
  };


  render() {
    const {
      order_detail, invoice_info, receiver_info, order_info, return_progress_data, titleName, submiting, show_foot, modal_width, modalVisible, operateData, deliverModal, expressList, reserve_info,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columons = [{
      title: `${sldComLanguage('商品信息')}`,//商品信息
      dataIndex: 'productLeadLittle',
      align: 'center',
      width: 250,
      render: (text, record) => {
        return <div className={`${order.goods_info1} ${global.com_flex_row_flex_start}`}>
          <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
          <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
                        <span className={order.goods_name}>
                            {record.goodsName}
                        </span>
          </div>
        </div>;
      },
    }, {
      title: `${sldComLanguage('商品规格')}`,
      dataIndex: 'specInfo',
    }, {
      title: `${sldComLanguage('今日营业额')}`,
      dataIndex: 'productShowPrice',

    }, {
      title: `${sldComLanguage('商品单价(元)')}`,
      dataIndex: 'productNum',
    }];
    return (
      <div className={global.common_page}
           style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('订单详情')}`)}
          {sldIconBtnBg(() => pageClose(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldHorLine(1)}
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${global.flex_row_center_start} ${order.progress}`}>
            {return_progress_data.map((item, index) => {
              return <div key={index} className={`${global.flex_column_start_center} ${order.item}`}>
                <div className={`${order.top} ${global.flex_row_center_center}`}>
                  <span className={`${order.left_line}`} style={{ borderColor: item.line_color }}/><img
                  src={item.icon}/><span className={`${order.right_line}`} style={{ borderColor: item.line_color }}/>
                </div>
                <span className={`${order.state}`} style={{ color: item.state_color }}>{item.state}</span>
                <span className={`${order.time}`} style={{ color: item.time_color }}>{item.time}</span>
              </div>;
            })}
          </div>

          {
            order_detail.orderState == 0 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{`${sldComLanguage('订单已取消')}`}</span>
              <span
                className={order.tip}>取消原因:{order_detail.refuseReason + (order_detail.refuseRemark ? (',' + order_detail.refuseRemark) : '')}</span>
            </div>
          }

          {
            order_detail.orderState == 10 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
          }

          {
            (order_detail.orderState == 20 && order_detail.lockState == 0) &&
            <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
          }

          {
            (order_detail.orderState == 20 && order_detail.lockState > 0) &&
            <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
          }

          {
            order_detail.orderState == 30 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{`${sldComLanguage('商品已发出,等待买家收货')}`}</span>
              {order_detail.isVirtualGoods == 1 &&
              <div className={order.btnsty}>
                <div onClick={() => this.agreeReturn('flow')}
                     className={order.cancle_btn}>{sldComLanguage('查看物流')}</div>
              </div>
              }
            </div>
          }

          {
            order_detail.orderState == 40 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{`${sldComLanguage('买家已确认收货,订单完成')}`}</span>
              {order_detail.isVirtualGoods == 1 &&
              <div className={order.btnsty}>
                <div onClick={() => this.agreeReturn('flow')}
                     className={order.cancle_btn}>{sldComLanguage('查看物流')}</div>
              </div>
              }
            </div>
          }

          {
            order_detail.orderState == 50 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
              <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
          }

          {sldCommonTitle(`${sldComLanguage('订单信息:')}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={order_info}/>
          {order_detail.isVirtualGoods == 1 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('收货人信息:')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            data={receiver_info}/>
          </Fragment>
          }
          {order_detail.isVirtualGoods == 2 && order_detail.orderReserveList.length > 0 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('用户预留信息')}`, '#333', 5, 15, 15)}
            <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                            data={reserve_info}/>
          </Fragment>
          }
          {sldCommonTitle(`${sldComLanguage('发票信息:')}`, '#333', 5, 15, 15)}
          <SldTableRowTwo r_color={'#333'} l_color={'#999'} l_fontw={500} r_fontw={600} form={this.props.form}
                          data={invoice_info}/>
          {order_detail.orderOperateList != undefined && order_detail.orderOperateList.length != undefined && order_detail.orderOperateList.length > 0 &&
          <Fragment>
            {sldCommonTitle(`${sldComLanguage('更多操作日志')}`, '#333', 5, 15, 15)}
            <StandardTable
              selectedRows={[]}
              data={{ list: order_detail.orderOperateList, pagination: {} }}
              size={'small'}
              rowKey={'logId'}
              isCheck={false}
              columns={this.columns_order_log}
              sldpagination={false}
            />
          </Fragment>
          }
          {sldCommonTitle(`${sldComLanguage('商品信息')}`, '#333', 5, 15, 15)}
          <StandardTable
            selectedRows={[]}
            data={{ list: order_detail.orderProductList, pagination: {} }}
            size={'small'}
            rowKey={'orderProductId'}
            isCheck={false}
            columns={this.columns_order_goods}
            sldpagination={false}
          />
          <div className={`${global.flex_row_end_center} ${order.order_detail_total}`}>
            <span className={order.amount_detail}>
            {sldComLanguage('商品总金额')}({sldComLanguage('¥')}{order_detail.goodsAmount}) + {sldComLanguage('运费')}({sldComLanguage('¥')}{order_detail.expressFee})
              {order_detail.promotionInfo != undefined && order_detail.promotionInfo.length > 0 && order_detail.promotionInfo.map(item => {
                return ` - ${item.promotionName}(${sldComLanguage('¥')}${item.discount})`;
              })}
            </span>
            <span
              className={order.amount_total}> = {sldComLanguage('订单金额')}({sldComLanguage('¥')}{order_detail.orderAmount})</span>
          </div>
          {getSldEmptyH(40)}
        </Scrollbars>
        {/*取消订单-start*/}
        <SldModal
          title={titleName}
          submiting={submiting}
          show_foot={show_foot}
          width={modal_width}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
        />
        {/*取消订单-end*/}
        {/* 发货弹框-start */}
        <Modal
          centered
          title={sldComLanguage('商品发货')}

          width={modal_width}
          visible={deliverModal}
          onCancel={() => this.sldDeliverHandleCancle()}
          onOk={this.deliverConfirm}
        >
          <Form layout="horizontal">
            <div style={{
              width: modal_width,
              paddingLeft: modal_width * 0.11,
              marginTop: 10,
            }}>
              <div style={{
                color: '#6072C5',
                width: 18 / 24 * (modal_width ? modal_width : 416),
                fontSize: 12,
              }}>{sldComLanguage('* 请仔细填写物流公司及快递单号，发货后24小时内仅支持1次更正，逾期不可修改；')}</div>
              <span style={{
                display: 'inline-block',
                width: 18 / 24 * (modal_width ? modal_width : 416),
                height: 1,
                backgroundColor: '#F2F2F2',
              }}></span>
            </div>
            <FormItem
              label={sldComLanguage('收货人姓名')}
              {...formItemLayoutModal}
            >
              <span>{order_detail.name}</span>
            </FormItem>
            <FormItem
              label={sldComLanguage('收货人电话')}
              {...formItemLayoutModal}
            >
              <span>{order_detail.mobile}</span>
            </FormItem>
            <FormItem></FormItem>
            <FormItem
              label={sldComLanguage('收货人地址')}
              {...formItemLayoutModal}
            >
              <span>{order_detail.receiverAreaInfo + ' ' + order_detail.receiverAddress}</span>
            </FormItem>
            <FormItem
              label={sldComLanguage('发货方式')}
              {...formItemLayoutModal}
            >
              {getFieldDecorator('deliverType', {
                rules: [{
                  required: true,
                  message: `${sldComLanguage('请选择发货方式')}`,
                }],
              })(
                <RadioGroup onChange={(e) => this.redioOnChange(e)}>
                  <Radio value={1}>{sldComLanguage('物流发货')}</Radio>
                  <Radio value={2}>{sldComLanguage('无需物流')}</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            {
              this.state.deliverType == '1' ? <Fragment>
                <FormItem
                  label={sldComLanguage('物流公司')}
                  {...formItemLayoutModal}
                >
                  {getFieldDecorator('expressId', {
                    rules: [{
                      required: true,
                      message: `${sldComLanguage('请选择物流公司')}`,
                    }],
                  })(
                    <Select
                      placeholder={sldComLanguage('请选择物流公司')}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {
                        expressList.length > 0 && expressList.map(item => <Option
                          value={item.expressId}>{item.expressName}</Option>)
                      }
                    </Select>,
                  )}
                </FormItem>
                <FormItem
                  label="快递单号"
                  {...formItemLayoutModal}
                >
                  {getFieldDecorator('expressNumber', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: `${sldComLanguage('请输入物流单号')}`,
                    }],
                  })(
                    <Input placeholder={sldComLanguage('请输入物流单号')}/>,
                  )}
                </FormItem>
              </Fragment> : null
            }
            {
              this.state.deliverType == '2' ? <Fragment>
                <FormItem
                  label={sldComLanguage('联系人')}
                  {...formItemLayoutModal}
                >
                  {getFieldDecorator('deliverName', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: `${sldComLanguage('请输入联系人')}`,
                    }],
                  })(
                    <Input placeholder={sldComLanguage('请输入联系人')}/>,
                  )}
                </FormItem>
                <FormItem
                  label={sldComLanguage('联系方式')}
                  {...formItemLayoutModal}
                >
                  {getFieldDecorator('deliverMobile', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: `${sldComLanguage('请输入联系方式')}`,
                    }],
                  })(
                    <Input placeholder={sldComLanguage('请输入联系方式')}/>,
                  )}
                </FormItem>
              </Fragment> : null
            }
          </Form>
        </Modal>
        {/* 发货弹框-end */}
      </div>

    );
  }
}
