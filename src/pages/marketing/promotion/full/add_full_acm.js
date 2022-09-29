/*
* 满优惠——满减活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, DatePicker, InputNumber, Checkbox } from 'antd';
import {
  failTip,
  sldCommonTitleByBg,
  dateTimeFormat,
  getSldEmptyH,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import moment from 'moment';

let sthis = '';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ promotion }) => ({
  promotion,
}))
@Form.create()
export default class AddFullAcm extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      sel_goods: {},//选择的赠品信息
      sel_voucher: {},//选择的优惠券信息
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
  }

  componentWillUnmount() {
  }

  //获取满减详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { detail, sel_goods, sel_voucher } = this.state;
    dispatch({
      type: 'promotion/get_full_acm_detail',
      payload: { fullId: id },
      callback: async (res) => {
        if (res.state == 200) {
          detail = res.data;
          //初始化选中的优惠券数据
          if (detail.couponList != null && detail.couponList.length != undefined && detail.couponList.length > 0) {
            sel_voucher = detail.couponList[0];
          }
          //初始化选中的商品数据
          if (detail.giftList != null && detail.giftList.length != undefined && detail.giftList.length > 0) {
            sel_goods = detail.giftList[0];
          }
          this.setState({
            detail, sel_goods, sel_voucher,
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

  render() {
    const { loading, detail, sel_goods, sel_voucher, viewFlag } = this.state;
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
                  {sldCommonTitleByBg(`${sldComLanguage('活动基本信息')}`)}
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

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('优惠门槛')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('以元为单位，设置使用该活动的最低金额')}`}
                        >
                          {getFieldDecorator('fullValue', {
                            initialValue: detail.fullValue, rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入优惠门槛')}`,
                            }],
                          })(
                            <InputNumber disabled={viewFlag} style={{ width: 400 }} min={1} max={9999999} precision={2}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('优惠内容')}
                      </div>
                      <div className={`${promotion.right} ${global.flex_column_start_start}`}>
                        <FormItem
                          style={{ width: 300 }}
                          extra={`${sldComLanguage('以元为单位，满足优惠门槛后可以享受优惠的金额')}`}
                        >
                          <span
                            style={{ marginRight: 10 }}>{sldComLanguage('减')}</span>{getFieldDecorator('minusValue', { initialValue: detail.minusValue })(
                          <InputNumber disabled={viewFlag} style={{ width: 100 }} min={0} max={9999999} precision={2}/>,
                        )}<span style={{ marginLeft: 10 }}>{sldComLanguage('元')}</span>
                        </FormItem>

                        {getSldEmptyH(10)}
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('sendCouponIds', {
                            initialValue: sel_voucher.couponId != undefined && sel_voucher.couponId ? true : false,
                            valuePropName: 'checked',
                          })(
                            <Checkbox
                              disabled={viewFlag}
                              onChange={(e) => this.handleVoucher(e)}
                            >
                              {sldComLanguage('送优惠券')}
                            </Checkbox>,
                          )}
                          {sel_voucher.couponId != undefined && sel_voucher.couponId && !viewFlag &&
                          <span className={`${promotion.reset_sel}`}
                                onClick={() => this.resetSel('voucher')}>{sldComLanguage('重新选择')}</span>
                          }
                        </FormItem>
                        {sel_voucher.couponId != undefined && sel_voucher.couponId &&
                        <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                          <div className={`${global.flex_row_start_center}`}><span
                            className={`${promotion.sel_tip}`}>{sldComLanguage('您已选择如下优惠券：')}</span></div>
                          <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                            <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                              src={require('../../../../assets/voucher.png')}/></div>
                            <div className={`${global.flex_column_between_start}`}>
                              <span className={`${promotion.goods_name}`}>{sldComLanguage('优惠券')}</span>
                              <span className={`${promotion.goods_price}`}>{sel_voucher.couponName}</span>
                            </div>
                          </div>
                        </div>
                        }
                        {getSldEmptyH(10)}
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('sendGoodsIds', {
                            initialValue: sel_goods.goodsId != undefined && sel_goods.goodsId ? true : false,
                            valuePropName: 'checked',
                          })(
                            <Checkbox
                              disabled={viewFlag}
                              onChange={(e) => this.handleGoods(e)}
                            >
                              {sldComLanguage('送赠品')}
                            </Checkbox>,
                          )}
                          {sel_goods.goodsId != undefined && sel_goods.goodsId && !viewFlag &&
                          <span className={`${promotion.reset_sel}`}
                                onClick={() => this.resetSel('goods')}>{sldComLanguage('重新选择')}</span>
                          }
                        </FormItem>
                        {sel_goods.goodsId != undefined && sel_goods.goodsId &&
                        <div className={`${promotion.sel_goods} ${global.flex_column_start_start}`}>
                          <div className={`${global.flex_row_start_center}`}><span
                            className={`${promotion.sel_tip}`}>{sldComLanguage('您已选择如下赠品：')}</span></div>
                          <div className={`${promotion.goods_info} ${global.flex_row_start_center}`}>
                            <div className={`${promotion.left} ${global.flex_row_center_center}`}><img
                              src={sel_goods.mainImgUrl || sel_goods.goodsImage}/></div>
                            <div className={`${global.flex_column_between_start}`}>
                              <span className={`${promotion.goods_name}`}>{sldComLanguage('赠品')}</span>
                              <span className={`${promotion.goods_price}`}>{sel_goods.goodsName}</span>
                            </div>
                          </div>
                        </div>
                        }
                      </div>
                    </div>

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
