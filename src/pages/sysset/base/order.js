import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
  failTip,
  sucTip,
  showMoreHelpTip,
  getSldEmptyH,
  sldComLanguage,
} from '@/utils/utils';
import {
  sld_config_save_btn,
  sld_need_update_setting,
} from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';

const TabPane = Tabs.TabPane;
let sthis = '';
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class Order extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      sld_show_tip: true,//是否显示页面提示，默认显示
      flag: 0,//订单导出设置标识
      refund_flag: 0,//退款设置标识
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],//订单导出设置数据
      refund_data: [],//退款设置数据
      activeTabKey: 'order_export',//默认展示订单导出
    };
  }

  order_code_data = [];//订单编码数组

  componentDidMount() {
    this.get_detail_info();
  }

  componentWillUnmount() {

  }

  //获取订单导出配置信息
  get_info = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    dispatch({
      type: 'sldsetting/get_order_export_info',
      callback: (res) => {
        if (res.state == 200) {
          info_data = [];
          let data = Object.keys(res.data).map((el) => {
            this.order_code_data.push(el);
            return { key: el, val: res.data[el] };
          });
          info_data.push({
            type: 'more_checkbox',
            label: `${sldComLanguage('订单导出字段设置')}`,
            name: 'order_list_code',
            placeholder: '',
            initialValue: [],
            data: data,
          });
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
        }
        this.setState({ initLoading: false });
        sthis.get_order_export_config(info_data);
      },
    });
  };

  get_order_export_config = (info_data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'order_list_code' },
      callback: (res) => {
        if (res.state == 200) {
          for (let i in info_data) {
            if (info_data[i].name == 'order_list_code') {
              info_data[i].initialValue = res.data[0].value != '' ? res.data[0].value.split(',') : [];
            }
          }
          this.setState({ info_data, flag: 1 });
        } else {
          failTip(res.data.msg);
        }
      },
    });
  };
  //保存事件
  handleSubmit = (values) => {
    const { dispatch } = this.props;
    let { activeTabKey } = this.state;
    let dis_type = '';
    let param_data = {};
    if (activeTabKey == 'order_export') {
      dis_type = 'common/saveSetting';
      let selected_code = [];//选中的导出字段的code
      this.order_code_data.map(item => {
        if (values.order_list_code.indexOf(item) > -1) {
          if(selected_code.indexOf(item) == -1){
            selected_code.push(item);
          }
        }
      });
      if(selected_code.length == 0){
        failTip(`${sldComLanguage('至少设置一个字段')}～`);
        return false;
      }
      param_data = { order_list_code: selected_code.join(',') };
    } else if (activeTabKey == 'refund_setting_switch') {
      dis_type = 'common/saveSetting';
      param_data = values;
    }
    this.setState({ submitting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
        this.setState({ submitting: false });
      },
    });
  };

  //tab设置
  changeSldTab = (key) => {
    this.setState({
      activeTabKey: key,
    }, () => {
      if (key != 'return_address') {
        this.get_detail_info();
      }
    });
  };

  get_detail_info = () => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { activeTabKey, refund_data, refund_flag } = this.state;
    let dis_type = '';
    let param_data = {};
    if (activeTabKey == 'order_export') {
      this.get_info();
      return false;
    } else if (activeTabKey == 'refund_setting_switch') {
      dis_type = 'common/getSetting';
      param_data = { str: 'refund_setting_switch' };
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (activeTabKey == 'refund_setting_switch') {
            refund_flag = true;
            refund_data = [];
            for (let i in res.data) {
              if (res.data[i].type == 4) {
                refund_data.push({
                  type: 'radio_select',
                  label: res.data[i].title,
                  extra: res.data[i].description,
                  name: res.data[i].name,
                  placeholder: '',
                  sel_data: [{
                    key: '1',
                    value: `${sldComLanguage('退回余额')}`,
                  }, {
                    key: '0',
                    value: `${sldComLanguage('原路退回')}`,
                  }],
                  initialValue: res.data[i].value,
                });
              }
            }
            if (refund_data.length > 0) {
              refund_data.push(sld_config_save_btn);
            }
          }
          this.setState({ refund_flag, refund_data });
        }
      },
    });

  };

  handleToggleTip = () => {
    this.setState({
      sld_show_tip: !this.state.sld_show_tip,
    });
  };


  render() {
    const { info_data, submitting, initLoading, flag, activeTabKey, refund_flag, refund_data, sld_show_tip } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          <SldComHeader
            type={1}
            title={`${sldComLanguage('运营配置')}`}//运营配置
            handleToggleTip={() => this.handleToggleTip()}
          />
          {getSldEmptyH(10)}
          <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
            <TabPane tab={sldComLanguage('订单导出配置')} key="order_export">
              {showMoreHelpTip(``, sld_need_update_setting(), 8, sld_show_tip)}{/*操作提示*/}
              {getSldEmptyH(8)}
              {flag == 1 &&
              <SldTableEdit
                submiting={submitting}
                width={1000}
                data={info_data}
                handleSubmit={this.handleSubmit}
              />
              }
            </TabPane>
            <TabPane tab={`${sldComLanguage('退款配置')}`}
                     key="refund_setting_switch">
              {showMoreHelpTip(``, sld_need_update_setting(), 8, sld_show_tip)}{/*操作提示*/}
              {getSldEmptyH(8)}
              {refund_flag == 1 &&
              <SldTableEdit
                submiting={submitting}
                width={1000}
                data={refund_data}
                handleSubmit={this.handleSubmit}
              />
              }
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}
