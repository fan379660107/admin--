import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';

let sthis = '';
@connect(({ common }) => ({
  common
}))
@Form.create()
export default class Setting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],
      needTipFlag: false,//保存按钮是否出现二次提示标识
      resetFlag: 1,
    };
  }

  origionPresaleIsEnable = 0;//原始的预售活动开关
  curPresaleIsEnable = 0;//最新的预售活动开关

  componentDidMount() {
    this.get_setting();
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data,resetFlag } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload:{str:'presale_is_enable,presale_compensate,deposit_order_auto_cancel_time,tail_money_order_payment_reminder,presale_order_delivery_reminder,deposit_agreement'},
      callback: (res) => {
        if(res.state == 200){
          info_data = [];
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              let tmp_data = {
                type: 'inputnum',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                min:0,
                max:1439,//1440为1天，小于1天
                initialValue: res.data[i].value,
              };
              if(res.data[i].name == 'presale_compensate'){
                //预售赔偿
                tmp_data.max = 10;
              }else if(res.data[i].name == 'deposit_order_auto_cancel_time'){
                //定金订单自动取消时间
                tmp_data.min = 5;
                tmp_data.max = 1440;
              }else if(res.data[i].name == 'tail_money_order_payment_reminder'){
                //尾款订单支付提醒、预售订单发货提醒
                tmp_data.max = 24;
              }
              info_data.push({...tmp_data});
            } else if (res.data[i].type == 4) {
              let temp = {
                type: 'switch',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
              };
              if(res.data[i].name == 'presale_is_enable'){
                temp.onChange = this.handlePresaleIsEnable;
                this.origionPresaleIsEnable = res.data[i].value == 1?true:false;
                this.curPresaleIsEnable = this.origionPresaleIsEnable;
              }
              info_data.push(temp);
            }
          }
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
          this.setState({ info_data,resetFlag:resetFlag+1 });
        }else{
          failTip(res.msg);
        }
      },
    });
  };

  handlePresaleIsEnable = (e) => {
    this.curPresaleIsEnable = e;
    this.setState({ needTipFlag: this.origionPresaleIsEnable == this.curPresaleIsEnable ? false : true });
  }

  //保存事件
  handleSubmit = (values) => {
    const { dispatch } = this.props;
    let {needTipFlag} = this.state;
    for(let i in values){
      if(i == 'presale_is_enable'){
        values.presale_is_enable = values.presale_is_enable?1:0;
      }else{
        if(values[i] == ''||values[i] == null){
          values[i] = 0
        }
        if(i == 'deposit_order_auto_cancel_time'&&!values[i]){
          failTip('定金订单自动取消时间必填～');
          return false;
        }
      }
    }
    this.setState({ submitting: true });
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        if (res.state == 200) {
          this.origionPresaleIsEnable = this.curPresaleIsEnable;
          needTipFlag = false;
          sucTip(res.msg);
          this.get_setting();
        } else {
          failTip(res.msg);
        }
        this.setState({ submitting: false,needTipFlag });
      },
    });
  };

  //确认修改
  confirm = (e) => {
    this.handleSubmit(e);
  };

  //取消修改,把所有数据恢复到最初
  cancle = (e) => {
    this.get_setting()
  };

  render() {
    const { info_data, submitting, initLoading, needTipFlag, resetFlag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          <SldTableEdit
            resetFlag={resetFlag}
            submiting={submitting}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
            needTipFlag={needTipFlag}
            tip={{
              title: `${sldComLanguage('修改预售活动开关会导致正在进行中的活动失效，确定修改吗')}？`,
              confirm: this.confirm,
              cancle: this.cancle,
            }}
          />
        </div>
      </Spin>
    );
  }
}
