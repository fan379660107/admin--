import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, getSldEmptyH, sldLlineRtextAddGoodsAddMargin } from '@/utils/utils';
import global from '@/global.less';
import Setting from './setting';
import SystemLists from './system_lists';

const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('优惠券管理')}`, 0, 0, 10)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('优惠券设置')}`} key="1">
            <Setting/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('平台优惠券')}`} key="2">
            <SystemLists/>
          </TabPane>
        </Tabs>

      </div>

    );
  }
}
