import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, InputNumber, Switch } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
  getSldEmptyH,
} from '@/utils/utils';
import { sldRankLeft, sldRankRight, sldRankTitleByBg } from '@/utils/utils_v2';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import addRank from '@/assets/css/add_rank.less';

let sthis = '';
const FormItem = Form.Item;
@connect(({ common, global }) => ({
  common, global,
}))
@Form.create()
export default class WithdrawSetting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      isFirstLoading: true,//是否第一次加载
      detail: {},//详情
      loading: true,
    };
  }

  componentDidMount() {
    this.get_setting();
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { detail } = this.state;
    let str_info = 'withdraw_is_enable,withdraw_alipay_is_enable,withdraw_wxpay_is_enable,withdraw_fee,min_withdraw_amount';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          detail = {};
          res.data.map(item => {
            detail[item.name] = item.value;
          });
        }
        this.setState({ isFirstLoading: false, loading: false, detail });
      },
    });
  };

  //保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.withdraw_is_enable = values.withdraw_is_enable ? 1 : 0;
          values.withdraw_alipay_is_enable = values.withdraw_alipay_is_enable ? 1 : 0;
          values.withdraw_wxpay_is_enable = values.withdraw_wxpay_is_enable ? 1 : 0;
          if (values.withdraw_is_enable == 1 && values.withdraw_alipay_is_enable == 0 && values.withdraw_wxpay_is_enable == 0) {
            failTip(`${sldComLanguage('需开启至少一种提现方式')}～`);
            return false;
          }
          this.setState({ loading: true });
          dispatch({
            type: 'common/saveSetting',
            payload: values,
            callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                sucTip(res.msg);
              } else {
                failTip(res.msg);
              }
            },
          });
        }
      },
    );
  };

  render() {
    const {
      loading, detail, isFirstLoading,
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 120}>
              <div
                className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity} ${global.flex_column_start_center}`}>
                {!isFirstLoading &&
                <Fragment>
                  <div className={addRank.sld_det_lr_wrap}>
                    {sldRankTitleByBg(`${sldComLanguage('功能设置')}`)}
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(true, '提现开关', 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 500 }}
                        extra={`${sldComLanguage('开关开启后，用户可以申请余额提现。')}`}
                      >
                        {getFieldDecorator('withdraw_is_enable', {
                          valuePropName: 'checked',
                          initialValue: detail.withdraw_is_enable != undefined && detail.withdraw_is_enable == 1 ? true : false,
                        })(
                          <Switch/>,
                        )}
                      </FormItem>, 0)}
                    </div>
                  </div>
                  {this.props.form.getFieldValue('withdraw_is_enable') &&
                  <Fragment>
                    {getSldEmptyH(10)}
                    <div className={addRank.sld_det_lr_wrap}>
                      {sldRankTitleByBg(`${sldComLanguage('提现方式设置')}`)}
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                        width: 1000,
                      }}>
                        {sldRankLeft(true, sldComLanguage('支付宝提现'), 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 500 }}
                          extra={`${sldComLanguage('开关开启后，用户可以申请余额提现至支付宝账户。')}`}
                        >
                          {getFieldDecorator('withdraw_alipay_is_enable', {
                            valuePropName: 'checked',
                            initialValue: detail.withdraw_alipay_is_enable != undefined && detail.withdraw_alipay_is_enable == 1 ? true : false,
                          })(
                            <Switch/>,
                          )}
                        </FormItem>, 0)}
                      </div>

                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                        width: 1000,
                      }}>
                        {sldRankLeft(true, sldComLanguage('微信提现'), 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 500 }}
                          extra={`${sldComLanguage('开关开启后，用户可以申请余额提现至微信零钱。')}`}
                        >
                          {getFieldDecorator('withdraw_wxpay_is_enable', {
                            valuePropName: 'checked',
                            initialValue: detail.withdraw_wxpay_is_enable != undefined && detail.withdraw_wxpay_is_enable == 1 ? true : false,
                          })(
                            <Switch/>,
                          )}
                        </FormItem>, 0)}
                      </div>
                    </div>
                    {getSldEmptyH(10)}
                    <div className={addRank.sld_det_lr_wrap}>
                      {sldRankTitleByBg(`${sldComLanguage('详细设置')}`)}
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(false, sldComLanguage('提现手续费'), 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 250 }}
                          extra={`${sldComLanguage('提现手续费比例，0或不填代表不收取手续费。')}`}
                        >
                          {getFieldDecorator('withdraw_fee', {
                            initialValue: detail.withdraw_fee,
                          })(
                            <InputNumber
                              max={50} min={0} precision={2} style={{ width: 180 }}
                              placeholder={`${sldComLanguage('')}`}/>,
                          )}<span style={{ marginLeft: 10 }}>%</span>
                        </FormItem>, 0)}
                      </div>
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(false, sldComLanguage('最低提现金额'), 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 250 }}
                          extra={`${sldComLanguage('0或不填代表不设置最低提现金额。')}`}
                        >
                          {getFieldDecorator('min_withdraw_amount', {
                            initialValue: detail.min_withdraw_amount,
                          })(
                            <InputNumber
                              max={100000} min={0} precision={2} style={{ width: 180 }}
                              placeholder={`${sldComLanguage('')}`}/>,
                          )}<span style={{ marginLeft: 10 }}>{sldComLanguage('元')}</span>
                        </FormItem>, 0)}
                      </div>
                    </div>
                  </Fragment>
                  }
                  {getSldEmptyH(60)}
                </Fragment>
                }
              </div>

              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                {!isFirstLoading &&
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  {sldComLanguage('保存')}
                </div>
                }
              </div>
              {getSldEmptyH(70)}
            </Scrollbars>
          </Form>
        </Spin>
      </div>
    );
  }
};
