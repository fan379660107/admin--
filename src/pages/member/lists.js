import React, { Component } from 'react';
import KeepAlive from 'react-activation';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import MemberList from './member_lists';

export default class List extends Component {
  render() {
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('会员管理')}`, 0, 0, 10)}
        <KeepAlive>
          <MemberList/>
        </KeepAlive>
      </div>
    );
  }
}
