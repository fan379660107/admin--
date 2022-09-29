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
export default class AppVersionSet extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      flag: 0,
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],
      scroll_h: 152,
    };
  }

  componentDidMount() {
    this.get_app_set_info();
  }

  componentWillUnmount() {

  }

  //获取站点的基本信息
  get_app_set_info = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    let str_info = 'app_android_hot_edition,app_android_hot_link,app_android_hot_tip,app_android_package_edition,app_android_package_link,app_ios_hot_edition,app_ios_hot_link,app_ios_hot_tip,app_ios_package_edition,app_ios_package_link';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          res.data.map(item => {
            info_data.push({
              type: 'input',
              label: item.title,
              extra: item.description,
              name: item.name,
              placeholder: '',
              initialValue: item.value,
            });
          });
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

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 152 : 100,
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
            scroll_h={200}
            bottom_empty={40}
          />
          }
        </div>
      </Spin>
    );
  }
}
