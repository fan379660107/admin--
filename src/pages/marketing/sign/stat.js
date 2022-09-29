import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, sldLlineRtextAddGoodsAddMargin } from '@/utils/utils';
import global from '@/global.less';
import SignList from './list';
import ActivityStat from './activity_stat';
import MemberStat from './member_stat';

const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class SignStat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('签到管理')}`, 0, 0, 10)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('签到活动')}`} key="1">
            <SignList/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('活动签到统计')}`} key="2">
            <ActivityStat/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('用户签到统计')}`} key="3">
            <MemberStat/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
