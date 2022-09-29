import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_config_save_btn, sld_promotion_point_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

let sthis = '';
@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class PromotionPointSetting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      flag: 0,
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],
      needTipFlag: false,//保存按钮是否出现二次提示标识
      resetFlag: 1,
    };
  }

  origionIntegralConversionRatio = 0;//原始的积分换算比例
  curIntegralConversionRatio = 0;//最新的积分换算比例

  componentDidMount() {
    this.get_setting();
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data,resetFlag } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'integral_cash_out_is_enable,integral_conversion_ratio,integral_max_deduct_rate,integral_use_lowest_amount' },
      callback: (res) => {
        if (res.state == 200) {
          info_data = [];
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              let temp = {
                type: 'inputnum',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                min: 1,
                placeholder: ``,
                initialValue: res.data[i].value,
                rules: [{
                  required: true,
                  message: ``,
                }],
              };
              if (res.data[i].name == 'integral_conversion_ratio') {
                //积分换算比例
                temp.placeholder = `${sldComLanguage('请输入积分换算比例')}`;
                temp.min = 1;
                temp.max = 99999999;
                temp.precision = 0;
                temp.rules = [{
                  required: true,
                  message: `${sldComLanguage('请输入积分换算比例')}`,
                }];
                this.origionIntegralConversionRatio = res.data[i].value * 1;
                this.curIntegralConversionRatio = this.origionIntegralConversionRatio;
                temp.onChange = this.handleIntegralConversionRatio;
              } else if (res.data[i].name == 'integral_max_deduct_rate') {
                //最高抵现比例
                temp.placeholder = `${sldComLanguage('请输入最高抵现比例')}`;
                temp.min = 1;
                temp.max = 100;
                temp.precision = 0;
                temp.rules = [{
                  required: true,
                  message: `${sldComLanguage('请输入最高抵现比例')}`,
                }];
              } else if (res.data[i].name == 'integral_use_lowest_amount') {
                //积分最低使用金额
                temp.placeholder = `${sldComLanguage('请输入积分最低使用金额')}`;
                temp.min = 1;
                temp.max = 999999;
                temp.precision = 0;
                temp.rules = [{
                  required: true,
                  message: `${sldComLanguage('请输入积分最低使用金额')}`,
                }];
              }
              info_data.push(temp);
            } else if (res.data[i].type == 4) {
              info_data.push({
                type: 'switch',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
              });
            }
          }
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
          this.setState({ info_data, flag: 1,resetFlag:resetFlag+1 });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    let {needTipFlag} = this.state;
    values.integral_cash_out_is_enable = values.integral_cash_out_is_enable ? 1 : 0;
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.origionIntegralConversionRatio = this.curIntegralConversionRatio;
          needTipFlag = false;
        } else {
          failTip(res.msg);
        }
        this.setState({ submitting: false, needTipFlag });
      },
    });
  };

  handleIntegralConversionRatio = (e) => {
    this.curIntegralConversionRatio = e;
    this.setState({ needTipFlag: this.origionIntegralConversionRatio == this.curIntegralConversionRatio ? false : true });
  };

  //更新积分兑换比例
  updatePointRate = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/updatePointRate',
      payload: { integralScale: val },
      callback: (res) => {
        if (res.state != 200) {
          failTip(res.msg);
        } else {
          this.origionIntegralConversionRatio = val;
          this.setState({needTipFlag:false})
        }
      },
    });
  };

  //确认修改
  confirm = (e) => {
    this.updatePointRate(e.integral_conversion_ratio);
    this.handleSubmit(e);
  };

  //取消修改
  cancle = (e) => {
    this.get_setting()
  };

  render() {
    const { info_data, submitting, initLoading, flag, needTipFlag, resetFlag } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={2}
          title={sldComLanguage('积分抵现设置')}
          tip_title={''}
          tip_data={sld_promotion_point_setting()}
        />
        <Spin spinning={initLoading}>
          {flag == 1 &&
          <SldTableEdit
            submiting={submitting}
            resetFlag={resetFlag}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
            needTipFlag={needTipFlag}
            tip={{
              title: `${sldComLanguage('修改积分换算比例会导致之前的积分商品全部下架，确定修改吗')}？`,
              confirm: this.confirm,
              cancle: this.cancle,
            }}
          />
          }
        </Spin>
      </div>
    );
  }
}
