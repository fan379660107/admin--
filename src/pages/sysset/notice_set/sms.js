import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

let sthis = '';
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class Sms extends Component {
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
    this.get_sms_info();
  }

  componentWillUnmount() {

  }


  //获取短信配置信息
  get_sms_info = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    dispatch({
      type: 'sldsetting/get_sms_info',
      callback: (res) => {
        if (res.state == 200) {
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              if (res.data[i].name == 'notification_sms_tpl_content') {
                info_data.push({
                  type: 'textarea',
                  label: res.data[i].title,
                  extra: res.data[i].description,
                  name: res.data[i].name,
                  placeholder: '',
                  initialValue: res.data[i].value,
                });
              } else {
                info_data.push({
                  type: 'input',
                  disabled: res.data[i].name == 'notification_sms_provider' ? true : false,
                  label: res.data[i].title,
                  extra: res.data[i].description,
                  name: res.data[i].name,
                  placeholder: '',
                  initialValue: res.data[i].value,
                });
              }

            }
          }
          if (info_data.length > 0) {
            info_data.push({
              type: 'button',
              label: '',
              name: 'button',
            });
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
          <SldComHeader
            type={2}
            title={sldComLanguage('短信配置')}
            tip_title={''}
            tip_data={sld_need_update_setting()}
          />
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
