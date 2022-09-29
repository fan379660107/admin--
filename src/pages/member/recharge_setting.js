import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
  showMoreHelpTip,
  getSldEmptyH,
} from '@/utils/utils';
import { sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';

let sthis = '';
@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class RechargeSetting extends Component {
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
    let str_info = 'recharge_is_enable';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          res.data.map(item => {
            info_data.push({
              type: 'switch',
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
    values.recharge_is_enable = values.recharge_is_enable ? 1 : 0;
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
        <div className={global.common_page} style={{padding:'10px 0 0 0'}}>
          {showMoreHelpTip(``, ['修改配置成功后，需点击右上角更新配置按钮更新配置才可生效'], 0)}{/*操作提示*/}
          {getSldEmptyH(10)}
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
