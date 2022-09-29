import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Empty } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  getSldHorLine,
  getSldEmptyH,
} from '@/utils/utils';
import global from '@/global.less';

let sthis = '';
@connect(({ goods_platform }) => ({
  goods_platform,
}))
@Form.create()
export default class VOP extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const {} = this.state;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('VOP商品库')}`, 0, 0, 10)}
        {getSldHorLine(1)}
        {getSldEmptyH(10)}
        <Fragment>
          {getSldEmptyH(150)}
          <Empty
            image={require('@/assets/moudle_disable.png')}
            imageStyle={{
              height: 80,
            }}
            description={
              <span>{sldComLanguage('该模块暂未开启')}</span>
            }
          >
          </Empty>
        </Fragment>
      </div>
    );
  }
}
;
