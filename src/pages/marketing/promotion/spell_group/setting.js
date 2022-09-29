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
@connect(({ ladder_group,common }) => ({
  ladder_group,common
}))
@Form.create()
export default class Setting extends Component {
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

  origionSpellIsEnable = 0;//原始的拼团活动开关
  curSpellIsEnable = 0;//最新的拼团活动开关

  componentDidMount() {
    this.get_setting();
  }

  componentWillUnmount() {

  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data,resetFlag} = this.state;
    dispatch({
      type: 'common/getSetting',
      payload:{str:'spell_is_enable,spell_order_auto_cancel_time'},
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
                min:5,
                max:1440,//1440为1天
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
              if(res.data[i].name == 'spell_is_enable'){
                temp.onChange = this.handleSpellIsEnable;
                this.origionSpellIsEnable = res.data[i].value == 1?true:false;
                this.curSpellIsEnable = this.origionSpellIsEnable;
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

  handleSpellIsEnable = (e) => {
    this.curSpellIsEnable = e;
    this.setState({ needTipFlag: this.origionSpellIsEnable == this.curSpellIsEnable ? false : true });
  }

  //保存事件
  handleSubmit = (values) => {
    const { dispatch } = this.props;
    let {needTipFlag} = this.state;
    values.spell_is_enable = values.spell_is_enable?1:0;
    if(!values.spell_order_auto_cancel_time){
      failTip(`${sldComLanguage('订单自动取消时间不能为空～')}`);
      return false;
    }
    this.setState({ submitting: true });
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.origionSpellIsEnable = this.curSpellIsEnable;
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
              title: `${sldComLanguage('修改拼团活动开关会导致正在进行中的活动失效，确定修改吗')}？`,
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
