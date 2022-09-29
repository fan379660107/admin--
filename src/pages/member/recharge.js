import React, { Component } from 'react';
import { Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import RechargeSetting from './recharge_setting';
import RechargeList from './recharge_list';

const TabPane = Tabs.TabPane;
export default class Recharge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      activeTabKey: '1',
    };
  }

  componentDidMount() {
  }

  onHandleTabClick = (e) => {
    this.setState({ activeTabKey: e });
  };


  render() {
    const { activeTabKey } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('充值管理')}`, 0, 0, 10)}
        <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('基本设置')}`} key="1">
            <RechargeSetting/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('充值明细')}`} key="2">
            <RechargeList/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
