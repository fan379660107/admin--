import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  getSldHorLine,
} from '@/utils/utils';
import global from '@/global.less';
import PublishPlatFormGoods from './publish_goods';

let sthis = '';
@connect(({ goods_platform }) => ({
  goods_platform,
}))
@Form.create()
export default class EditPlatformProduct extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      id: props.location.query != undefined && props.location.query.id != undefined && props.location.query.id ? props.location.query.id : '',//商品id
    };
  }

  componentDidMount() {
  }

  render() {
    const { id } = this.state;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('编辑商品资料')}`, 0, 0, 10)}
        {getSldHorLine(1)}
        <PublishPlatFormGoods id={id} back={()=>{this.props.history.goBack();}}/>
      </div>
    );
  }
};
