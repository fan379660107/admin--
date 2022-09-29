import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Tabs } from 'antd';
import {
  getSldEmptyH,
  showMoreHelpTip,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import SldComHeader from '@/components/SldComHeader';
import BrandLists from './brand_lists';
import BrandListsWaitCheck from './brand_lists_wait_check';

const brandTip = [`${sldComLanguage('商品品牌建立后可与商品分类进行绑定，新增一个品牌则需要重新与商品分类建立所属关系。')}`
  , `${sldComLanguage('品牌绑定商品分类后，商家发布商品时，可根据发布的商品所在分类找到对应的所属品牌并选择。')}`];
const checkBrandTip = [`${sldComLanguage('审核通过后，申请品牌和分类的绑定关系生效，发布商品的时候选择该分类即可选择该品牌。')}`, `${sldComLanguage('分类需绑定到第三级。')}`];
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
  product,
}))

@Form.create()
export default class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
      activeTabKey: 'list',
      sld_show_tip: true,//是否显示页面提示，默认显示
      tip_height: 64,//提示内容高度
      updateFlag: '',//更新数据标识 brand_list:品牌列表 brand_list_wait_check 待审核品牌
    };
  }

  componentDidMount() {
    //获取浏览器参数
    const { query } = this.state;
    if (query != undefined && query.tab == 'check') {
      this.setState({ activeTabKey: 'check' });
    }
  }

  componentWillUnmount() {

  }

  //tab设置
  changeSldTab = (key) => {
    this.setState({
      activeTabKey: key,
    });
  };

  handleToggleTip = () => {
    let { tip_height } = this.state;
    tip_height = this.state.sld_show_tip ? 0 : 64;
    this.setState({
      sld_show_tip: !this.state.sld_show_tip,
      tip_height,
    });
  };

  setUpdateFlag = (flag) => {
    this.setState({ updateFlag: flag });
  };

  render() {
    const { activeTabKey, sld_show_tip, tip_height, updateFlag } = this.state;
    return (
      <div className={global.common_page}>
        <SldComHeader
          type={1}
          title={`${sldComLanguage('品牌管理')}`}//品牌管理
          handleToggleTip={() => this.handleToggleTip()}
        />
        {getSldEmptyH(10)}
        <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
          <TabPane tab={`${sldComLanguage('品牌列表')}`} key="list">{/*品牌列表*/}
            {showMoreHelpTip(``, brandTip, 8, sld_show_tip)}{/*操作提示*/}
            <BrandLists type={1} tableHeight={document.body.clientHeight - 210 - tip_height} updateFlag={updateFlag}
                        setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('待审核品牌')}`} key="check">{/*待审核品牌*/}
            {showMoreHelpTip(``, checkBrandTip, 8, sld_show_tip)}{/*操作提示*/}
            <BrandListsWaitCheck type={2} tableHeight={document.body.clientHeight - 210 - tip_height}
                                 updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
