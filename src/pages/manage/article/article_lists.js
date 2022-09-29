import React, { Component } from 'react';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import KeepAlive from 'react-activation';
import ArticleListContent from './article_list_content';

export default class Article_lists extends Component {
  render() {
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('文章')}${sldComLanguage('管理')}`, 0, 0, 5)}
        <KeepAlive>
          <ArticleListContent/>
        </KeepAlive>
      </div>
    );
  }
}
