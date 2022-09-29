import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_config_save_btn, sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

let sthis = '';
@connect(({ seckill, common }) => ({
  seckill, common,
}))
@Form.create()
export default class PointSetting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      flag: 0,
      submitting: false,//提交按钮加载状态
      needTipFlag: false,//保存按钮是否出现二次提示标识
      initLoading: false,//页面初始化加载状态
      info_data: [],
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
      payload: { str: 'integral_mall_is_enable,integral_audit_is_enable,integral_conversion_ratio' },
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
                placeholder: `${sldComLanguage('请输入积分换算比例')}`,
                initialValue: res.data[i].value,
                rules: [{
                  required: true,
                  message: `${sldComLanguage('请输入积分换算比例')}`,
                }],
              };
              if (res.data[i].name == 'integral_conversion_ratio') {
                this.origionIntegralConversionRatio = res.data[i].value * 1;
                this.curIntegralConversionRatio = res.data[i].value * 1;
                temp.onChange = this.handleIntegralConversionRatio;
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

  handleIntegralConversionRatio = (e) => {
    this.curIntegralConversionRatio = e;
    this.setState({ needTipFlag: this.origionIntegralConversionRatio == this.curIntegralConversionRatio ? false : true });
  };

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    let {needTipFlag} = this.state;
    values.integral_mall_is_enable = values.integral_mall_is_enable ? 1 : 0;
    values.integral_audit_is_enable = values.integral_audit_is_enable ? 1 : 0;
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        this.setState({ submitting: false });
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
        }
      },
    });
  };

  //立即更新商品数据
  updateGoods = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/updateEsPointGoods',
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //确认修改积分换算比例
  confirm = (e) => {
    this.updatePointRate(e.integral_conversion_ratio);
    this.handleSubmit(e);
  };

  //取消修改积分换算比例
  cancle = (e) => {
    this.get_setting();
  };

  render() {
    const { info_data, submitting, initLoading, flag, needTipFlag, resetFlag } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={2}
          title={sldComLanguage('基本设置')}
          tip_title={''}
          tip_data={sld_need_update_setting()}
        />
        <Spin spinning={initLoading}>
          {flag == 1 &&
          <SldTableEdit
            submiting={submitting}
            resetFlag={resetFlag}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
            showOtherBtn={{
              text: `${sldComLanguage('立即更新商品数据')}`,
              callback: this.updateGoods,
            }}
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
