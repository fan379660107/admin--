import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { showMoreHelpTip, getSldEmptyH, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import ImportExcelGoods from './import';
import PublishPlatFormGoods from './publish_goods';
import ImportStoreGoods from './import_store_goods';
import SldComHeader from '@/components/SldComHeader';

const goodsTip = [`${sldComLanguage('导入店铺商品数据：将店铺商品导入到商品资料库，店铺从商品资料库导入的商品除外')}；`, `${sldComLanguage('如果导入的店铺商品的条形码与商品资料库商品条形码重复，则需要判断商品资料库商品是否有图片，没有图片，则将店铺商品覆盖商品资料库商品，有图片，则不导入')}；`, `${sldComLanguage('如果导入的店铺商品的条形码未与商品资料库商品条形码重复，则允许导入')}。`];
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class AddPlatformProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: '1',
      scroll_h: 0,
      sld_show_tip: true,//是否显示页面提示，默认显示
    };
  }

  componentDidMount() {
  }

  handleToggleTip = (e) => {
    this.setState({
      scroll_h: e ? 0 : -96,
      sld_show_tip: !this.state.sld_show_tip,
    });
  };

  onHandleTabClick = (e) => {
    this.setState({ activeTabKey: e });
  };

  render() {
    const { sld_show_tip, activeTabKey, scroll_h } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={1}
          title={`${sldComLanguage('添加商品资料')}`}
          handleToggleTip={this.handleToggleTip}
        />
        {getSldEmptyH(8)}
        <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('店铺商品导入')}`} key="1">
            {showMoreHelpTip(``, goodsTip, 8, sld_show_tip)}{/*操作提示*/}
            <ImportStoreGoods scroll_h={scroll_h}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('Excel导入')}`} key="2">
            <ImportExcelGoods/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('直接发布')}`} key="3">
            <PublishPlatFormGoods/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
