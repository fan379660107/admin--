import React, { Component } from 'react';
import { Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import WithdrawSetting from './withdraw_setting';
import WithdrawList from './withdraw_list';

const TabPane = Tabs.TabPane;
export default class Withdraw extends Component {
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
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('提现管理')}`, 0, 0, 10)}
        <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('基本设置')}`} key="1">
            <WithdrawSetting/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('提现明细')}`} key="2">
            <WithdrawList/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
