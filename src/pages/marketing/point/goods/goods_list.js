import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { showMoreHelpTip,getSldEmptyH,sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import GoodsOnlineLists from './goods_online_lists';
import GoodsCheckLists from './goods_check_lists';
import GoodsStorageLists from './goods_storage_lists';
import GoodsOfflineLists from './goods_offline_lists';
import SldComHeader from '@/components/SldComHeader';
const goodsTip = [`${sldComLanguage('商品只有在审核通过才能正常出售。商品是否需审核可以在“商品设置”中配置。')}`,`${sldComLanguage('违规下架或审核失败的商品，商家只能重新编辑后才能够进行出售。')}`];
const checkGoodsTip = [`${sldComLanguage('在“商品设置”中，开启商品审核后，商家发布、编辑商品需要管理员审核才能正常销售。')}`,`${sldComLanguage('审核状态分为：审核通过、等待审核和审核失败三种状态，审核失败后请详细填写审核失败原因方便商家修改。')}`];
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll_h: 64,
      sld_show_tip:true,//是否显示页面提示，默认显示
      updateFlag:'',//更新数据标识 online:在售商品 check 待审核 storage 仓库中 offline 违规下架
    };
  }
  componentDidMount() {
  }

  setUpdateFlag = (flag) => {
    this.setState({updateFlag:flag})
  }

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 64:0,
      sld_show_tip:!this.state.sld_show_tip
    })
  }

  render() {
    const {sld_show_tip,updateFlag,scroll_h} = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={1}
          title={`${sldComLanguage('商品管理')}`}
          handleToggleTip = {this.handleToggleTip}
        />
        {getSldEmptyH(8)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('在售列表')}`} key="1">
            {showMoreHelpTip(``, goodsTip,8,sld_show_tip)}
            <GoodsOnlineLists updateFlag={updateFlag} scroll_h={scroll_h} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('待审核商品')}`} key="2">
            {showMoreHelpTip(``, checkGoodsTip,8,sld_show_tip)}
            <GoodsCheckLists updateFlag={updateFlag} scroll_h={scroll_h} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('仓库中商品')}`} key="3">
            <GoodsStorageLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('违规下架商品')}`} key="4">
            <GoodsOfflineLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
        </Tabs>

      </div>

    );
  }
}
