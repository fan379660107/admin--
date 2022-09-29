import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
} from '@/utils/utils';
import { sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';

let sthis = '';
@connect(({ common }) => ({
  common,
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
    };
  }

  componentDidMount() {
    this.get_setting();
  }

  componentWillUnmount() {

  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    let str_info = 'coupon_is_enable,coupon_expired_reminder';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              if (res.data[i].name == 'coupon_expired_reminder') {
                info_data.push({
                  type: 'inputnum',
                  label: res.data[i].title,
                  extra: res.data[i].description,
                  name: res.data[i].name,
                  placeholder: '',
                  min:0,
                  max:1439,//1440为1天，小于1天
                  initialValue: res.data[i].value,
                });
              }
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
        }
        this.setState({ info_data, flag: 1 });
      },
    });
  };

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    values.coupon_is_enable = values.coupon_is_enable ? 1 : 0;
    dispatch({
      type: 'common/saveSetting',
      payload: values,
      callback: (res) => {
        this.setState({ submitting: false });
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  render() {
    const { info_data, submitting, initLoading, flag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          {flag == 1 &&
          <SldTableEdit
            submiting={submitting}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
          />
          }
        </div>
      </Spin>
    );
  }
}
