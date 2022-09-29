import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import AfterSalesLists from './aftersales_lists';
import AftersalesCheckLists from './aftersales_check_lists';

const TabPane = Tabs.TabPane;
let sthis = '';
@connect(({ order }) => ({
  order,
}))
@Form.create()
export default class Service extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      sld_show_tip: true,//是否显示页面提示，默认显示
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      activeTabKey: '1',
      updateFlag:'',//更新数据标识 1:售后列表 2 退款审核
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  setUpdateFlag = (flag) => {
    this.setState({updateFlag:flag})
  }

  //tab设置
  changeSldTab = (key) => {
    this.setState({
      activeTabKey: key,
    }, () => {
    });
  };

  render() {
    const { initLoading, activeTabKey,updateFlag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('售后管理')}`, 0, 0, 10)}{/*售后管理*/}
          <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
            <TabPane tab={`${sldComLanguage('售后列表')}`} key="1">{/*售后列表*/}
              <AfterSalesLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
            </TabPane>
            <TabPane tab={`${sldComLanguage('退款审核')}`} key="2">{/*退款审核*/}
              <AftersalesCheckLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}
