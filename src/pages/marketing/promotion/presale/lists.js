import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH,sldLlineRtextAddGoodsAddMargin,sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import PresaleLists from './presale_lists';
import PresaleListsAll from './presale_lists_all';
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
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', '预售', 0)}
        {getSldEmptyH(8)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={sldComLanguage('定金预售')} key="1">
            <PresaleLists/>
          </TabPane>
          <TabPane tab={sldComLanguage('全款预售')} key="2">
            <PresaleListsAll/>
          </TabPane>
          <TabPane tab={sldComLanguage('活动标签')} key="3">
            <LabelLists/>
          </TabPane>
          <TabPane tab={sldComLanguage('预售设置')} key="4">
            <Setting/>
          </TabPane>
        </Tabs>

      </div>
    );
  }
}
