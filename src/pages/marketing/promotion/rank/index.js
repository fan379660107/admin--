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
export default class RankIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateFlag: '',//更新数据标识 list:在榜单列表
    };
  }

  setUpdateFlag = (flag) => {
    this.setState({ updateFlag: flag });
  };

  render() {
    const {updateFlag} = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('排行榜')}`, 0)}
        {getSldEmptyH(8)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('榜单列表')}`} key="1">
            <ActivityLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('榜单分类')}`} key="2">
            <LabelLists/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('排行榜设置')}`} key="3">
            <Setting updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
