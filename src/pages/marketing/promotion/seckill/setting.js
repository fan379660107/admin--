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
@connect(({ seckill,common }) => ({
  seckill,common
}))
@Form.create()
export default class Setting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      needTipFlag: false,//保存按钮是否出现二次提示标识
      flag: 0,
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],
      resetFlag: 1,
    };
  }

  origionSeckillIsEnable = 0;//原始的秒杀活动开关
  curSeckillIsEnable = 0;//最新的秒杀活动开关

  componentDidMount() {
    this.get_setting();
  }

  componentWillUnmount() {

  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data,resetFlag } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload:{str:'seckill_is_enable,seckill_is_audit_enable,seckill_order_cancle'},
      callback: (res) => {
        if(res.state == 200){
          info_data = [];
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              info_data.push({
                type: 'inputnum',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                min:1,
                max:1439,//1440为1天，小于1天
                initialValue: res.data[i].value,
              });
            } else if (res.data[i].type == 4) {
              let temp = {
                type: 'switch',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
              };
              if(res.data[i].name == 'seckill_is_enable'){
                temp.onChange = this.handleSeckillIsEnable;
                this.origionSeckillIsEnable = res.data[i].value == 1?true:false;
                this.curSeckillIsEnable = this.origionSeckillIsEnable;
              }
              info_data.push(temp);
            }
          }
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
          this.setState({ info_data, flag: 1,resetFlag:resetFlag+1 });
        }else{
          failTip(res.msg);
        }
      },
    });
  };

  handleSeckillIsEnable = (e) => {
    this.curSeckillIsEnable = e;
    this.setState({ needTipFlag: this.origionSeckillIsEnable == this.curSeckillIsEnable ? false : true });
  }

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    let {needTipFlag} = this.state;
    values.seckill_is_enable = values.seckill_is_enable?1:0;
    values.seckill_is_audit_enable = values.seckill_is_audit_enable?1:0;
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.origionSeckillIsEnable = this.curSeckillIsEnable;
          needTipFlag = false;
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
    const { info_data, submitting, initLoading, flag, needTipFlag, resetFlag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          {flag == 1 &&
          <SldTableEdit
            resetFlag={resetFlag}
            submiting={submitting}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
            needTipFlag={needTipFlag}
            tip={{
              title: `${sldComLanguage('修改秒杀活动开关会导致正在进行中的活动失效，确定修改吗')}？`,
              confirm: this.confirm,
              cancle: this.cancle,
            }}
          />
          }
        </div>
      </Spin>
    );
  }
}
