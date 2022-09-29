import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import KeepAlive from 'react-activation';
import SettleStoreListContent from './settle_store_list_content';

@connect(({ product, share }) => ({
  product, share,
}))
@Form.create()
export default class GoodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.location.query,
    };
  }

  componentDidMount() {
    //获取浏览器参数
    const { query } = this.state;
    if (query != undefined && query.tab == 'check') {
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: true, type: 'change_settle_store_list_tab', sldGlobalShareData: { activeTabKey: '3' } },
      });
    }
  }

  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('入驻店铺管理')}`, 0, 0, 5)}
        <KeepAlive>
          <SettleStoreListContent/>
        </KeepAlive>
      </div>
    );
  }
}
