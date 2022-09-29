import React, { Component, Fragment } from 'react';
import global from '../global.less';
import addRank from '@/assets/css/add_rank.less';

/*
 * 新建排行榜的item的左侧
 * @param {boolean} required 是否必填
 * @param {string} text  展示的文本
 * @param {number} borderTopWidth  顶部border的宽度
 * */
export function sldRankLeft(required, text, borderTopWidth, height = 72) {
  return <div className={`${addRank.sld_det_r_item} ${global.flex_row_end_center}`} style={{
    width: 200, height: height, borderTopWidth: borderTopWidth,
  }}>
    {required ? <div style={{ color: 'red' }}>*</div> : null}
    <div className={addRank.sld_det_r_text}>
      {text}
    </div>
  </div>;
}

/*
 * 新建排行榜的item的左侧
 * @param {object} text dom节点
 * @param {number} borderTopWidth  顶部border的宽度
 * */
export function sldRankRight(text, borderTopWidth, height = 72) {
  return <div className={`${addRank.sld_det_r_item} ${global.flex_column_center_start}`}
              style={{ width: 800, paddingLeft: 20, height: height, borderTopWidth: borderTopWidth }}>
    <div className={addRank.sld_det_r_text} style={{ width: '100%' }}>
      {text}
    </div>
  </div>;
}

//排行榜的标题，有背景色和标题名称
export function sldRankTitleByBg(text) {
  return <div className={addRank.add_rand_title_bg}>
    <span className={addRank.title}>{text}</span>
  </div>;
}


