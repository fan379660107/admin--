import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  getSldEmptyH,sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import VendorMsgTplList from './vendor_msg_tpl_list';
import MemberMsgTplList from './member_msg_tpl_list';

const TabPane = Tabs.TabPane;
let sthis = '';
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class MsgTpl extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      sld_show_tip: true,//是否显示页面提示，默认显示
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      activeTabKey: 'member',//默认会员消息模板
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  //tab设置
  changeSldTab = (key) => {
    this.setState({
      activeTabKey: key,
    }, () => {
    });
  };

  render() {
    const { initLoading, activeTabKey } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('消息模板管理')}`, 0, 0, 10)}
          <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
            <TabPane tab={`${sldComLanguage('会员消息模板')}`} key="member">
              {getSldEmptyH(8)}
              <MemberMsgTplList/>
            </TabPane>
            <TabPane tab={`${sldComLanguage('商户消息模板')}`} key="system">
              {getSldEmptyH(8)}
              <VendorMsgTplList tpl={2}/>
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}
