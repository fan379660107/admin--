/*
* 满优惠——添加满N件折扣活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Checkbox, DatePicker } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  dateTimeFormat,
  getSldHorLine,
  sldCommonTitleByBg,
  getSldEmptyH,
  sldIconBtn,
} from '@/utils/utils';
import { num_to_num } from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import ALibbSvg from '@/components/ALibbSvg';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let sthis = '';
@connect(({ promotion, global }) => ({
  promotion, global,
}))
@Form.create()
export default class AddFullNld extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      ladder_promotion: [{
        key: 1,
        fullValue: '',//优惠门槛
        minusValue: '',//优惠金额
        sendCouponIds: false,//是否赠送优惠券
        sel_voucher: {},//选择的优惠券信息
        sendGoodsIds: false,//是否送赠品
        sel_goods: {},//选择的赠品信息
      }],//阶梯优惠数组
      curData: {},//当前操作的数据
      link_type: '',
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      detail: {},//活动详情数据
      viewFlag: true,//查看标识
    };
  }

  componentDidMount() {
    this.get_detail(this.props.id);
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {
  }

  //获取满N件折扣详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { detail, ladder_promotion } = this.state;
    let _this = this;
    dispatch({
      type: 'promotion/get_full_nld_detail',
      payload: { fullId: id },
      callback: async (res) => {
        if (res.state == 200) {
          detail = res.data;
          detail.ruleList.map((item, index) => {
            if (index == 0) {
              ladder_promotion[0].fullValue = item.fullValue;
              ladder_promotion[0].minusValue = item.minusValue;
              //初始化选中的优惠券数据
              if (item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0) {
                ladder_promotion[0].sel_voucher = item.couponList[0];
                ladder_promotion[0].sendCouponIds = true;
              }
              //初始化选中的商品数据
              if (item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0) {
                ladder_promotion[0].sel_goods = item.giftList[0];
                ladder_promotion[0].sendGoodsIds = true;
              }
            } else {
              ladder_promotion.push({
                fullValue: item.fullValue,
                minusValue: item.minusValue,
                sel_voucher: item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0 ? item.couponList[0] : {},
                sendCouponIds: item.couponList != null && item.couponList.length != undefined && item.couponList.length > 0 ? true : false,
                sel_goods: item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0 ? item.giftList[0] : {},
                sendGoodsIds: item.giftList != null && item.giftList.length != undefined && item.giftList.length > 0 ? true : false,
              });
              _this.key += 1;
            }
          });
          this.setState({
            detail, ladder_promotion,
          });
        } else {
          failTip(res.msg);
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

  key = 1;
  ladder_item = {
    key: 1,
    fullValue: '',//优惠门槛
    minusValue: '',//优惠金额
    sendCouponIds: false,//是否赠送优惠券
    sel_voucher: {},//选择的优惠券信息
    sendGoodsIds: false,//是否送赠品
    sel_goods: {},//选择的赠品信息
  };

  render() {
    const {
      loading,ladder_promotion, detail, viewFlag,
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={`${promotion.full_activity} ${global.common_page_20} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 165}>
              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>

                {/* 基本信息-start */}
                <div>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('满N件折扣活动')}`, 0, 0, 10)}
                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动名称')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('最多输入20个字')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('fullName', {
                            initialValue: detail.fullName, rules: [{
                              required: true,
                              whitespace: true,
                              message: `${sldComLanguage('请输入活动名称')}`,
                            }],
                          })(
                            <Input maxLength={20} disabled={viewFlag} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入活动名称')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('活动时间')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('活动时间不可与其他活动重叠')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('activityTime', {
                            initialValue: detail.startTime != undefined && detail.startTime
                              ? [moment(detail.startTime, dateTimeFormat), moment(detail.endTime, dateTimeFormat)]
                              : '', rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入活动时间')}`,
                            }],
                          })(
                            <RangePicker
                              disabled={viewFlag}
                              style={{ width: 400 }}
                              placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                              showTime
                              getCalendarContainer={(triggerNode)=>{
                                return triggerNode.parentNode
                              }}
                            />,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    {ladder_promotion.map((item, index) => {
                      return <Fragment key={index}>
                        {getSldEmptyH(15)}
                        <div className={`${promotion.common_title_bg} ${global.flex_row_between_center}`}>
                          <span className={`${promotion.title}`}>{`${num_to_num()[index + 1]}${sldComLanguage('级优惠')}`}</span>
                          {index > 0 &&
                          <div className={`${promotion.del_ladder_pro}`} onClick={() => this.delPromotion(item.key)}>
                            <ALibbSvg
                              fill={'#c8c8c8'} width={18} height={18} type={'qingchu'}/>
                          </div>}
                        </div>
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                          <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠门槛')}
                          </div>
                          <div className={`${promotion.right}`}>
                            <FormItem
                              extra={`${sldComLanguage('以件为单位，设置使用该活动的最低件数')}`}
                            >
                              {getFieldDecorator(`fullValue_${item.key}`, {
                                initialValue: item.fullValue, rules: [{
                                  required: true,
                                  message: `${sldComLanguage('请输入优惠门槛')}`,
                                }],
                              })(
                                <InputNumber disabled={viewFlag} style={{ width: 400 }} min={1} max={9999999} precision={0}/>,
                              )}
                            </FormItem>
                          </div>
                        </div>

                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                          <div className={`${promotion.left}`}>
                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠内容')}
                          </div>
                          <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                            <FormItem
                              style={{ width: 300 }}
                              extra={`${sldComLanguage('优惠折扣，满足优惠门槛后可以享受该优惠折扣，例如：输入90代表9折')}`}
                            >
                          <span
                            style={{ marginRight: 10 }}>打</span>{getFieldDecorator(`minusValue_${item.key}`, { initialValue: item.minusValue })(
                              <InputNumber disabled={viewFlag} style={{ width: 100 }} min={0} max={100} precision={0}/>,
                            )}<span style={{ marginLeft: 10 }}>{sldComLanguage('折')}</span>
                            </FormItem>

                            {getSldEmptyH(10)}
                            <FormItem
                              style={{ width: 300 }}
                            >
                              {getFieldDecorator(`sendCouponIds_${item.key}`, {
                                initialValue: item.sendCouponIds,
                                valuePropName: 'checked',
                              })(
                                <Checkbox
                                  disabled={viewFlag}
                                  onChange={(e) => this.handleGoodsOrVoucher('voucher', e, item)}
                                >
                                  {sldComLanguage('送优惠券')}
                                </Checkbox>,
                              )}
                              {item.sel_voucher.couponId != undefined && item.sel_voucher.couponId && !viewFlag &&
                              <span className={`${promotion.reset_sel}`}
                                    onClick={() => this.resetSel('voucher',item)}>{sldComLanguage('重新选择')}</span>
                              }
                            </FormItem>
                            {item.sel_voucher.couponId != undefined && item.sel_voucher.couponId &&
                            <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                              <div className={`${global.flex_row_start_center}`}><span
                                className={`${promotion.sel_tip}`}>{sldComLanguage('营您已选择如下优惠券：')}</span></div>
                              <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                                <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                                  src={require('../../../../assets/voucher.png')}/></div>
                                <div className={`${global.flex_column_between_start}`}>
                                  <span className={`${promotion.goods_name}`}>{sldComLanguage('优惠券')}</span>
                                  <span className={`${promotion.goods_price}`}>{item.sel_voucher.couponName}</span>
                                </div>
                              </div>
                            </div>
                            }
                            {getSldEmptyH(10)}
                            <FormItem
                              style={{ width: 600 }}
                            >
                              {getFieldDecorator(`sendGoodsIds_${item.key}`, {
                                initialValue: item.sendGoodsIds,
                                valuePropName: 'checked',
                              })(
                                <Checkbox
                                  disabled={viewFlag}
                                  onChange={(e) => this.handleGoodsOrVoucher('goods', e, item)}
                                >
                                  {sldComLanguage('送赠品')}
                                </Checkbox>,
                              )}
                              {item.sel_goods.goodsId != undefined && item.sel_goods.goodsId && !viewFlag &&
                              <span className={`${promotion.reset_sel}`}
                                    onClick={() => this.resetSel('voucher',item)}>{sldComLanguage('重新选择')}</span>
                              }
                            </FormItem>
                            {item.sel_goods.goodsId != undefined && item.sel_goods.goodsId &&
                            <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                              <div className={`${global.flex_row_start_center}`}><span
                                className={`${promotion.sel_tip}`}>{sldComLanguage('您已选择如下赠品：')}</span></div>
                              <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                                <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                                  src={item.sel_goods.mainImgUrl || item.sel_goods.goodsImage}/></div>
                                <div className={`${global.flex_column_between_start}`}>
                                  <span className={`${promotion.goods_name}`}>{sldComLanguage('赠品')}</span>
                                  <span className={`${promotion.goods_price}`}>{item.sel_goods.goodsName}</span>
                                </div>
                              </div>
                            </div>
                            }
                          </div>
                        </div>
                      </Fragment>;
                    })}

                    {ladder_promotion.length < 5 && !viewFlag &&
                    <div className={`${global.flex_row_start_center} ${promotion.add_new}`}>
                      {sldIconBtn(() => this.addPromotion(), `${sldComLanguage('添加下级优惠')}`, 7, 7)}{/*添加下级优惠*/}
                      <span className={`${promotion.add_new_tip}`}>{sldComLanguage('提醒：每级优惠不叠加，如：满足二级优惠条件后则不再享有一级优惠，最多支持5级优惠~')}</span>
                    </div>
                    }

                  </div>
                </div>
                {/* 基本信息-end */}
              </div>

            </Scrollbars>
          </Form>
        </Spin>

      </div>
    );
  }
};
