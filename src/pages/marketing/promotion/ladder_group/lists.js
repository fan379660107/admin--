import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH,sldLlineRtextAddGoodsAddMargin,sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import ActivityLists from './activity_lists';
import LabelLists from './label_lists';
import Setting from './setting';
const TabPane = Tabs.TabPane;
@connect(({ seckill }) => ({
  seckill,
}))
@Form.create()
export default class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('阶梯团活动')}`, 0)}
        {getSldEmptyH(8)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('阶梯团活动')}`} key="1">
            <ActivityLists/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('阶梯团标签')}`} key="2">
            <LabelLists/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('阶梯团设置')}`} key="3">
            <Setting/>
          </TabPane>
        </Tabs>
      </div>

    );
  }
}
