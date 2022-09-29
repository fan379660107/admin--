import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import {
  sldComLanguage,
  showMoreHelpTip,
  sldLlineRtextAddGoodsAddMargin,
} from '@/utils/utils';
import { sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import AppVersionSet from './app_version_set';
import AppGuideSet from './app_guide_set';

let sthis = '';
const TabPane = Tabs.TabPane;
@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class APPSetInfo extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      activeTabKey: '1',
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {

  }

  onHandleTabClick = (e) => {
    this.setState({ activeTabKey: e });
  };

  render() {
    const { activeTabKey } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('APP配置')}`, 0, 0, 10)}
        <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('基本设置')}`} key="1">
            {showMoreHelpTip(``, sld_need_update_setting(), 8, true)}{/*操作提示*/}
            <AppVersionSet/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('引导页设置')}`} key="2">
            {showMoreHelpTip(``, sld_need_update_setting(), 8, true)}{/*操作提示*/}
            <AppGuideSet/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
