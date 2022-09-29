import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoods,sldIconBtnBg,getSldEmptyH,sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import SeckillDetailLists from './seckill_detail_lists';
import SeckillCheckGoodsLists from './seckill_check_goods_lists';

const TabPane = Tabs.TabPane;
@connect(({ seckill }) => ({
  seckill,
}))
@Form.create()
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
    };
  }
  componentDidMount() {
  }

  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <div className={global.flex_com_space_between}>
          {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('秒杀活动详情')}`)}
          {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
        </div>
        {getSldEmptyH(8)}
        <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
          <TabPane tab={`${sldComLanguage('活动场次')}`} key="1">{/* 活动场次 */}
            <SeckillDetailLists query={ this.state.query.id}/>
          </TabPane>
          <TabPane tab={`${sldComLanguage('商品审核')}`} key="2">{/*商品审核 */}
            <SeckillCheckGoodsLists  query={ this.state.query.id}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
