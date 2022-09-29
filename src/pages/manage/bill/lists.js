import React, { Component } from 'react';
import global from '@/global.less';
import KeepAlive from 'react-activation';
import BillListContent from './lists_content';

export default class Lists extends Component {
  render() {
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <KeepAlive>
          <BillListContent/>
        </KeepAlive>
      </div>
    );
  }
}
