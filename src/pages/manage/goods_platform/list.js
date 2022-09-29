import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { showMoreHelpTip, getSldEmptyH, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import PlatformGoodsLists from './goods_list';
import SldComHeader from '@/components/SldComHeader';

const goodsTip = [`${sldComLanguage('商品在刊登后才能被商家导入。对于待刊登和已下架状态的商品，则不能导入')}。`];
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class PlatformGoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      activeTabKey: '1',
      scroll_h: 0,
      sld_show_tip: true,//是否显示页面提示，默认显示
      updateFlag: '',//更新数据标识 1:已刊登 2 待刊登 3 已下架
    };
  }

  componentDidMount() {
  }

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 0 : -49,
      sld_show_tip: !this.state.sld_show_tip,
    });
  };

  setUpdateFlag = (flag) => {
    this.setState({ updateFlag: flag });
  };

  onHandleTabClick = (e) => {
    this.setState({ activeTabKey: e });
  };

  setUpdateFlag = (flag) => {
    this.setState({ updateFlag: flag });
  };

  render() {
    const { sld_show_tip, updateFlag, scroll_h, activeTabKey } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={1}
          title={`${sldComLanguage('商品资料库')}`}
          handleToggleTip={this.handleToggleTip}
        />
        {showMoreHelpTip(``, goodsTip, 8, sld_show_tip)}{/*操作提示*/}
        {getSldEmptyH(8)}
        <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('已刊登')}`} key="1">
            <PlatformGoodsLists state={2} scroll_h={scroll_h} updateFlag={updateFlag}
                                setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('待刊登')}`} key="2">
            <PlatformGoodsLists state={1} scroll_h={scroll_h} updateFlag={updateFlag}
                                setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('已下架')}`} key="3">
            <PlatformGoodsLists state={3} scroll_h={scroll_h} updateFlag={updateFlag}
                                setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
