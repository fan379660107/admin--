import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage } from '@/utils/utils';
import SettledStoreListData from './settled_store_list_data';
import ApplyStoreList from './apply_store_list';
import ApplyCategoryList from './apply_category_list';
import SettledStoreListWillExpiredData from './settled_store_list_will_expired_data';
import SettledStoreReNewList from './settled_store_renew_list';

const TabPane = Tabs.TabPane;
@connect(({ product, share }) => ({
  product, share,
}))
@Form.create()
export default class SettleStoreListContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: '1',
      sld_show_tip: true,//是否显示页面提示，默认显示
      updateFlag: '',//更新数据标识 1:入驻店铺列表 2 临效期店铺 3 入驻审核 4 续签管理 5 经营类目审核
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'share/getShareData',
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.share.flag && nextProps.share.type == 'change_settle_store_list_tab') {
      //更改tab
      this.setState({ activeTabKey: nextProps.share.sldGlobalShareData.activeTabKey });
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: false, type: '', sldGlobalShareData: {} },
      });
    }
  }

  setUpdateFlag = (flag) => {
    this.setState({ updateFlag: flag });
  };

  handleToggleTip = () => {
    this.setState({
      sld_show_tip: !this.state.sld_show_tip,
    });
  };

  //tab设置
  onHandleTabClick = (key) => {
    this.setState({
      activeTabKey: key,
    });
  };

  render() {
    const { updateFlag, activeTabKey } = this.state;
    return (
      <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
        <TabPane tab={`${sldComLanguage('入驻店铺列表')}`} key="1">
          <SettledStoreListData updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
        </TabPane>
        <TabPane tab={`${sldComLanguage('临效期店铺')}`} key="2">
          <SettledStoreListWillExpiredData/>
        </TabPane>
        <TabPane tab={`${sldComLanguage('入驻审核')}`} key="3">
          <ApplyStoreList/>
        </TabPane>
        <TabPane tab={`${sldComLanguage('续签管理')}`} key="4">
          <SettledStoreReNewList/>
        </TabPane>
        <TabPane tab={`${sldComLanguage('经营类目审核')}`} key="5">
          <ApplyCategoryList updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
        </TabPane>
      </Tabs>
    );
  }
}
