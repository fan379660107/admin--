import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form,Tabs } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import OpeningAdv from './opening_adv';
import HomeAdv from './home_adv';

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
      activeKey:'1',
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  changeSldTab = (e) =>{
    this.setState({activeKey:e})
  }

  render() {
    const {activeKey} = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('首页广告设置')}`, 0, 0, 10)}
        <Tabs activeKey={activeKey} type="card" onChange={(key) => this.changeSldTab(key)}>
          <TabPane tab={`${sldComLanguage('开屏图设置')}`} key="1">
            <OpeningAdv/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('顶部广告设置')}`} key="2">
            <HomeAdv/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
