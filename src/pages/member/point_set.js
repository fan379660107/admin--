import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_need_update_setting, sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

let sthis = '';
@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class PointSet extends Component {
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
    this.get_base_info();
  }

  componentWillUnmount() {

  }

  //获取积分设置的基本信息
  get_base_info = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    let str_info = 'integral_present_register,integral_present_login,integral_present_order_evaluate,integral_present_goods_buy,integral_present_order_max';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          res.data.map(item => {
            info_data.push({
              type: 'inputnum',
              label: item.title,
              extra: item.description,
              name: item.name,
              min:0,
              placeholder: '',
              initialValue: item.value,
              max:99999999,
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

  render() {
    const { info_data, submitting, initLoading, flag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          <SldComHeader
            type={2}
            title={`${sldComLanguage('积分设置')}`}
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
