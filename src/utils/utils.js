import moment from 'moment';
import React, { Component, Fragment } from 'react';
import nzh from 'nzh/cn';
import router from 'umi/router';
import { getMenuMatches } from '@/components/SiderMenu/BaseMenu';
import Link from 'umi/link';
import ALibbSvg from '@/components/ALibbSvg';
import { parse, stringify } from 'qs';
import styles from '../global.less';
import { message, Popconfirm, Input, notification, Icon, Tooltip, Popover } from 'antd';
import { apiUrl, uploadLimit, sldStatShowDebug } from './sldconfig.js';
import { formatMessage } from 'umi/locale';
import request from './request';
import fetch from 'dva/fetch';
import { getLocale } from 'umi/locale';

const Search = Input.Search;

export const menu_second_color = ['#ff7e28', '#f5ba43'];//一级菜单页面图标的颜色
export const menu_second_default_icon = 'tiaoboleixing';//一级菜单页面默认的图标
export const menu_second_icon_marginT = 12;//一级菜单页面图标距离左边的距离
export const sld_ueditor_url = `${apiUrl}ueditor/index.html`;//ueditor的地址

//统一配置
export const commonSetting = {
  'operateTipSwitch': true,//页面操作提示开关
  'specLimit': 3,//发布商品——每个商品最多添加3个规格项
  'specValLimit': 10,//发布商品——每个规格项最多添加10个规格值
};

export function sldSvgIcon(svgColor, svgW, svgH, svg) {
  return <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg}/>;
}

/*
 * 表格分页数据统一
 * @param {object} pagination 分页数据对象
 * @param {object} filtersArg  表格列的过滤数据
 * @param {object} sorter 表格列的筛选数据
 * @param {object} formValues 搜索数据
 * */
export function sldHandlePaginationData(pagination, filtersArg, sorter, formValues = {}) {
  const filters = Object.keys(filtersArg).reduce((obj, key) => {
    const newObj = { ...obj };
    newObj[key] = getValue(filtersArg[key]);
    return newObj;
  }, {});

  const params = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    ...formValues,
    ...filters,
  };
  if (sorter.field) {
    params.sorter = `${sorter.field}_${sorter.order}`;
  }
  return params;
}

/*
 * 表格分页数据统一（只用于统计的报表模块）
 * @param {object} pagination 分页数据对象
 * @param {object} filtersArg  表格列的过滤数据
 * @param {object} sorter 表格列的筛选数据
 * @param {object} formValues 搜索数据
 * @param {number} type 1为sort字段为驼峰形式，2为sort字段为下划线连接
 * */
export function sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues = {}, type = 1, pageSize) {
  const filters = Object.keys(filtersArg).reduce((obj, key) => {
    const newObj = { ...obj };
    newObj[key] = getValue(filtersArg[key]);
    return newObj;
  }, {});

  const params = {
    current: pagination.current || 1,
    pageSize: pagination.pageSize || pageSize,
    ...formValues,
    ...filters,
  };
  //升序、降序的处理
  if (sorter.order) {
    if (sorter.order == 'ascend') {
      params.type = 'asc';
    } else if (sorter.order == 'descend') {
      params.type = 'desc';
    }
  }
  if (sorter.field) {
    if (type == 1) {
      //sort字段为驼峰形式
      params.sort = sorter.field;
    } else if (type == 2) {
      //sort字段为下划线连接
      params.sort = sldConvert(sorter.field);
    }
  }
  return params;
}

/*
* 驼峰形式的字符串转为下划线连接
* @param {int} index 第几列
* @param {int} size 宽度值
* @param {array} columns_data table的columns数据
* */
export function sldConvert(str) {
  let target = '';
  let strArray = str.split('');
  strArray.map(item => {
    if (item === item.toUpperCase()) {
      target += `_${item.toLowerCase()}`;
    } else {
      target += item;
    }
  });
  return target;
}

/*
* 表格拖动更新每列的宽度
* @param {int} index 第几列
* @param {int} size 宽度值
* @param {array} columns_data table的columns数据
* */
export function dragSldTableColumn(index, size, columns_data) {
  let nextColumns = [...columns_data];
  nextColumns[index] = {
    ...nextColumns[index],
    width: size.width,
  };
  return nextColumns;
}

//判断数据是否是空对象
export function isEmptyObject(data) {
  if (Object.getOwnPropertyNames(data).length === 0) {
    return true;//空对象
  } else {
    return false;//非空对象
  }
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

//将数字转为字符串
export function numExcString(text) {
  return text.toString();
}

//如果为null的话返回空字符串
export function isNullExcString(text) {
  return text == null ? '' : text;
}

//设置用户登录有效期缓存时间
export function setLocalStorageTime() {
  localStorage.setItem('time', new Date().getTime());
}

//获取缓存的值——json类型
export function getLocalStorageJsonVal(key) {
  let val = localStorage.getItem(key);
  return JSON.parse(val);
}


/*
* 获取缓存的值——String类型
* 返回值字符串  有值返回具体的值，否则返回空字符串
* @zjf-2020-11-26
* */
export function getLocalStorageStingVal(key) {
  let val = localStorage.getItem(key);
  return val != undefined && val != null && val ? val : '';
}


//获取三级缓存地址
export function getSldArea() {
  return JSON.parse(localStorage.getItem('common_area_list'));
}

//高度填充
export function getSldEmptyH(sldHeight, bg = '#fff') {
  return <div style={{ width: '100%', height: sldHeight, background: bg }}></div>;
}

//宽度填充
export function getSldEmptyW(sldWidth) {
  return <div style={{ height: '100%', width: sldWidth }}></div>;
}

//获取用户缓存
export function getSldToken() {
  return localStorage.getItem('sld_token');
}


//退出登陆
export async function loginOut() {
  //跳转登录页
  let des_url = window.location.href;
  if (des_url.indexOf('redirect=') != -1) {
    des_url = des_url.substring(0, des_url.indexOf('redirect=') - 1);
  }
  await requestLogout();//调用退出登录的接口
  //清除全部缓存
  localStorage.clear();
  router.replace('/user/login?redirect=' + encodeURIComponent(des_url));
  window.location.reload();
}

//调用退出登录的接口
async function requestLogout() {
  let sld_refresh_token = localStorage.getItem('sld_refresh_token');
  let param = new FormData();
  param.append('grant_type', 'refresh_token');
  param.append('refresh_token', sld_refresh_token);
  await fetch(apiUrl + 'v3/adminLogin/oauth/logout', {
    credentials: 'include',
    headers: {
      Authorization: 'Basic VVcxS2FsRlhVblJoVnpROTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09',
    },
    method: 'POST',
    body: param,
  }).then(response => response.json());
}

//验证手机号
export function sldCheckMobile(s) {
  if (mobile_reg.test(s)) {
    return true;
  } else {
    return false;
  }
}

//验证邮箱
export function sldCheckEmail(s) {
  let regu = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  let re = new RegExp(regu);
  if (re.test(s)) {
    return true;
  } else {
    return false;
  }
}

//验证固定电话
export function sldCheckTel(s) {
  let regu = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
  let re = new RegExp(regu);
  if (re.test(s)) {
    return true;
  } else {
    return false;
  }
}

/**
 检查输入的字符是否具有特殊字符
 输入:str  字符串
 返回:true 或 flase; true表示包含特殊字符
 主要用于注册信息的时候验证
 */
  // export function sldCheckQuote(str) {
  //     let items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "", "{", "}", "[", "]", "(", ")");
  //     items.push(":", ";", "'", "|", "\", "<", ">", "?", "/", "<<", ">>", "||", "//");
  //     items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
  //     items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
  //     str = str.toLowerCase();
  //     for (var i = 0; i < items.length; i++) {
  //         if (str.indexOf(items[i]) >= 0) {
  //             return true;
  //         }
  //     }
  //     return false;
  // }


export const sld_token = localStorage.getItem('sld_token');
export const goods_spec_list_page_size = 2;//商品管理—规格管理
export const check_brand_list_page_size = 10;//待审核品牌
export const goods_list_del_page_size = 10;//已删除商品列表
export const list_com_page_size_10 = 10;
export const list_com_page_size_5 = 5;
export const list_com_page_size_7 = 7;
export const list_com_page_size_15 = 15;
export const list_com_page_size_20 = 20;
export const list_com_page_size_16 = 16;
export const list_com_page_more = 10000;
export const mobile_reg = /(1[3-9]\d{9}$)/;//手机号的正则表达式

export const formItemLayoutModal = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export const formItemLayoutModalTwo = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          {this.sldComLanguage('万')}
        </span>
      </span>
    );
  }
  return result;
}

// 如果内容为空，返回-
export function sldEmptyHandle1(str) {
  return (str === '' || str == null) ? '-' : str;
}

// 如果内容为空或者undefined，返回''
export function sldEmptyHandle2(str) {
  return (str == undefined || str == null) ? '' : str;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

//返回左边一个竖线，右侧文字的结构
export function sldLlineRtext(leftColor, Rtext) {
  return <div className={styles.title}>
    <span style={{ backgroundColor: leftColor }} className={styles.left_border}/>{Rtext}
  </div>;
}

//返回左边一个竖线，右侧文字的结构_添加商品(字体大小，颜色变化)
export function sldLlineRtextAddGoods(leftColor, Rtext) {
  return <div className={styles.title_add_goods}>
    <span style={{ backgroundColor: leftColor }} className={styles.left_border}/><span>{Rtext}</span>
  </div>;
}

//返回左边一个竖线，右侧文字的结构_添加商品(字体大小，颜色变化) 增加上下左边的距离
export function sldLlineRtextAddGoodsAddMargin(leftColor, Rtext, ml = 0, mt = 0, mb = 0, subTitle='') {
  return <div className={styles.title_add_goods} style={{ marginLeft: ml, marginTop: mt, marginBottom: mb }}>
    <span style={{ backgroundColor: leftColor }} className={styles.left_border}/>
    <span className={styles.title}>{Rtext}</span>
    {subTitle&&
    <span className={styles.sub_title}>{subTitle}</span>
    }
  </div>;
}

//通用的标题，有背景色和标题名称
export function sldCommonTitleByBg(text) {
  return <div className={styles.common_title_bg}>
    <span className={styles.title}>{text}</span>
  </div>;
}

//通用的title（主要用于商品详情页）
export function sldCommonTitle(context, cont_color = '#333333', ml = 5, mt = 20, mb = 20) {
  return <div
    style={{ marginLeft: ml, marginTop: mt, marginBottom: mb, fontSize: 14, color: cont_color, fontWeight: 'bold' }}>
    {context}
  </div>;
}

/*
* 返回图标，下面文字
* @params svg svg图标名称
* @params text 底部文本
* @params marginT 底部文本距离svg图标的距离
* @params lindto 跳转连接
* */
export function sldTsvgBotText(svg, text, marginT, lindto = '', key, svgColor = '#5F96E3', width = 40, height = 40, font_color = '#555') {
  return <div key={key} className={styles.icon_text_width}>
    {lindto
      ?<Link to={lindto != '' ? lindto : '/'} className={styles.icon_text}>
        <ALibbSvg fill={svgColor} width={width} height={height} type={svg}/>
        <span style={{ marginTop: marginT, color: font_color }}>{text}</span>
      </Link>
      :<Fragment>
        <ALibbSvg fill={svgColor} width={width} height={height} type={svg}/>
        <span style={{ marginTop: marginT, color: font_color }}>{text}</span>
      </Fragment>
    }
  </div>;
}

/*
* 返回图标
* @params svg svg图标名称
* @params color 图标颜色
* @params width 图标宽度
* @params height 图标高度
* */
export function sldTsvg(svg, color, width, height) {
  return <ALibbSvg fill={color} width={width} height={height} type={svg}/>;
}

/*
 * 成功提示
 * @params con 提示内容
 * @params time 提示时间
 * */
export function sucTip(con, time = 2) {
  message.success(con, time);
}

/*
 * 失败提示
 * @params con 提示内容
 * @params time 提示时间
 * */
export function failTip(con, time = 3) {
  // message.error(con, time);
  message.warn(con, time);
}


//根据路由获取页面名称
function getPathName(pathname) {
  let path_array = pathname.split('/');
  let path_id = 'menu';
  for (let i = 0; i < path_array.length; i++) {
    if (path_array[i] != '') {
      path_id += '.' + path_array[i];
    }
  }
  return formatMessage({ id: path_id });
}


/*
* @params props 为this.props
*
* */

// Get the currently selected menu
export function setTopRoute(props) {
  const {
    location: { pathname }, menuData,
  } = props;
  if (pathname == '/dashboard/commonuse/desc' || pathname == '/' || pathname.split('/').length == 2) {
    //如果是常用功能页面，不需要存路由，并将activeKey置空
    localStorage.setItem('activePaneKey', '');
    return false;
  }
  //如果该路由在缓存里，重置activekey，否则存缓存并重置activekey
  let storagePane = localStorage.getItem('storagePane');
  let name = `${sldComLanguage('默认页面')}`; //页面名称
  name = getPathName(pathname);
  let route_info = { title: name, key: pathname };
  if (pathname != '/' && pathname != '/dists/') {
    if (storagePane != undefined) {
      storagePane = JSON.parse(storagePane);
      //检测是否有一样的
      let flag = true;
      for (let i = 0; i < storagePane.length; i++) {
        if (storagePane[i].key == pathname) {
          flag = false;
          break;
        }
      }
      if (flag) {
        storagePane = storagePane.concat(route_info);
        localStorage.setItem('storagePane', JSON.stringify(storagePane));
      }
    } else {
      localStorage.setItem('storagePane', JSON.stringify([{ title: name, key: pathname }]));
    }
  }
  localStorage.setItem('activePaneKey', pathname);
};

/*
 * 删除单条数据确认提示框
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params showText 展示文本
 * */
export function sldPopConfirm(position, title, callback, okText, cancleText, showText, paddingL = 0, paddingR = 0, color = '#555') {
  return <Popconfirm
    placement={position}
    title={title}
    onConfirm={callback}
    okText={okText}
    cancelText={cancleText}>
    <a style={{ paddingLeft: paddingL, paddingRight: paddingR, color: color }}
       href="javascript:void(0)">{showText}</a>
  </Popconfirm>;
}

/*
 * 删除单条数据确认提示框,主要用于Dropdown 下面的menuitem样式
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params showText 展示文本
 * */
export function sldPopConfirmMenu(position, title, callback, okText, cancleText, showText, paddingL = 0, paddingR = 0, color = '#555') {
  return <Popconfirm placement={position} title={title}
                     onConfirm={callback} okText={okText} cancelText={cancleText}>
    <a style={{ color: color, fontSize: 12 }} href="javascript:void(0)">{showText}</a>
  </Popconfirm>;
}

/*
 * 返回图标按钮——不带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtn(callback, text, wrapML, wrapMR, svgW = 15, svgH = 15, textML = 4, svg = 'xinzeng', svgColor = '#ff5908') {
  return <div style={{ marginLeft: wrapML, marginRight: wrapMR }} className={styles.sld_common_btn}
              onClick={callback}>
    <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg}/>
    <span style={{ marginLeft: textML, fontSize: 13, color: '#333' }}>{text}</span>
  </div>;
}

/*
 * 返回图标按钮——不带背景色 和 sldIconBtn一样，但是不能点击，属于禁用按钮
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * @params showTitle 禁止操作的提示
 * */
export function sldIconBtnNo(callback, text, wrapML, wrapMR, svgW = 15, svgH = 15, textML = 4, svg = 'xinzeng', svgColor = '#ff5908', showTitle = `${sldComLanguage('禁止操作')}`) {
  return <div style={{ marginLeft: wrapML, marginRight: wrapMR }}
              className={`${styles.sld_common_btn} ${styles.sld_common_btn_not_allowed}`} title={showTitle}
              onClick={callback}>
    <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} opacity={.3}/>
    <span style={{ marginLeft: textML, fontSize: 13, color: '#cbcbcb' }}>{text}</span>
  </div>;
}

/*
 * 返回图标按钮——带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtnBg(callback, svg, text, svgColor, wrapML, wrapMR, svgW = 15, svgH = 15, textML) {
  return <div style={{ marginLeft: wrapML, marginRight: wrapMR, backgroundColor: '#FF6A12' }}
              className={styles.sld_common_btn} onClick={callback}>
    <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg}/>
    <span style={{ marginLeft: textML, color: '#fff', fontSize: 13 }}>{text}</span>
  </div>;
}

/*
 * 返回搜索框
 * @params placeholder 搜索框默认文本
 * @params width 搜索框宽度
 * @params callback 按钮点击事件
 * @params btnText 按钮文本
 * @params value 搜索框默认值
 * */
export function sldSearch(placeholder, width, callback, btnText, value = '') {
  return <Search
    placeholder={placeholder}
    enterButton={btnText}
    defaultValue={value}
    size="default"
    onSearch={value => callback(value)}
    style={{ width: width }}
  />;
}

/*
 * 返回搜索框——受控组件（重置搜索的时候自动清空搜索内容）
 * @params placeholder 搜索框默认文本
 * @params width 搜索框宽度
 * @params callback 按钮点击事件
 * @params btnText 按钮文本
 * @params value 搜索框默认值
 * @params callbackCon 搜索框值变化事件
 * */
export function sldSearchVal(placeholder, width, callback, btnText, value, callbackCon) {
  return <Search
    placeholder={placeholder}
    enterButton={btnText}
    value={value}
    size="default"
    onSearch={value => callback(value)}
    onChange={callbackCon}
    style={{ width: width }}
  />;
}

/*
 * 返回搜索框——受控组件（重置搜索的时候自动清空搜索内容）增加删除按钮
 * * @params placeholder 搜索框默认文本
 * @params btnText 按钮文本
 * @params callback 按钮点击事件
 * */
export function sldSearchValClear(placeholder, width, callback, btnText, value, callbackCon, clearcallback, rightV) {
  return <div style={{ position: 'relative' }}><Search
    placeholder={placeholder}
    enterButton={btnText}
    value={value}
    size="default"
    onSearch={value => callback(value)}
    onChange={callbackCon}
    style={{ width: width }}
  />{value &&
  <span onClick={clearcallback} style={{ position: 'absolute', top: 6, right: rightV, zIndex: 2, cursor: 'pointer' }}>{
    <ALibbSvg
      fill={'#c8c8c8'} width={14} height={14} type={'qingchu'}/>}</span>}</div>;
}

/*
 * 返回图标按钮_带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtnBorder(callback, svg, text, svgColor, wrapML, wrapMR, svgW, svgH, textML) {
  return <div
    style={{
      marginLeft: wrapML,
      marginRight: wrapMR,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#E5E5E5',
    }}
    className={styles.sld_common_btn} onClick={callback}>
    <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg}/>
    <span style={{ marginLeft: textML }}>{text}</span>
  </div>;
}

/*
 * 右上角消息通知
 * @params message 消息标题
 * @params desc 消息描述
 * @params icon 图标
 * @params iconcolor 图标颜色
 * */
export function sldNoticeRightTop(message, desc, icon, iconcolor) {
  return notification.open({
    message: message,
    description: desc,
    icon: <Icon type={icon} style={{ color: iconcolor }}/>,
    duration: 2,
  });
}

/*
 * 表格内文字过多的展示处理
 * @params message 消息标题
 * @params desc 消息描述
 * @params icon 图标
 * @params iconcolor 图标颜色
 * */
export function sldRowMoreShow(text, length) {
  let res = '';
  if (text.length == 0) {
    res = '';
  } else if (text.length <= length) {
    res = text;
  } else {
    res = <Tooltip placement="topLeft" title={text}>
      {text.substr(0, length) + '...'}
    </Tooltip>;
  }
  return res;
}


/*
 * 文字左右两个部分展示
 * @params left_text 左部分文字
 * @params right_text 右部分文字
 * */
export function sldRowTextShow(left_text, right_text) {
  return <div className={styles.weight_r_span_wrap}><span
    className={styles.weight_w_left_span}>{left_text}</span><span
    className={styles.weight_w_right_span}>{right_text}</span></div>;
}

/*
 * 文字左右两个部分展示,居于两端
 * @params left_text 左部分文字
 * @params right_text 右部分文字
 * */
export function sldRowTextShowBetweent(left_text, right_text) {
  return <div className={styles.weight_r_span_wrap_betweent}><span
    style={{ justifyContent: 'flex-start', paddingLeft: 11 }}
    className={styles.weight_w_left_span}>{left_text}</span><span style={{ justifyContent: 'flex-end' }}
                                                                  className={styles.weight_w_right_span}>{right_text}</span>
  </div>;
}

/*
 * 删除某个tab的数据
 * @params del_tab  要删除的tab
 * */
export function sldDelTab(del_tab) {
  let pane = JSON.parse(localStorage.getItem('storagePane'));
  pane = pane.filter(pane => pane.key !== del_tab);
  localStorage.setItem('storagePane', JSON.stringify(pane));
}


/**
 * 帮助提示_单条提示
 * @params  string con 展示的内容
 */
export function showHelpTip(con) {
  return <div className={styles.help_wrap}>
    {con}
  </div>;
}


/**
 * 帮助提示_多条提示
 * @params  string title 提示标题
 * @params  string tip_array 提示详情
 * @params number marginT 提示模块距离上方距离
 * @params boolean sld_show_tip 是否显示提示内容
 */
export function showMoreHelpTip(title, tip_array, marginT = 0, sld_show_tip = true) {
  if (!commonSetting.operateTipSwitch) {
    sld_show_tip = false;
  }
  return sld_show_tip
    ? <div className={styles.diy_tip_div} style={{ marginTop: marginT }}>
      <span>{title}</span>
      <ul>
        {tip_array.map((item, index) => {
          return <li key={index}>• {item}</li>;
        })}
      </ul>
    </div>
    : null
    ;
}

/**
 * 帮助提示_多条提示_装修modal弹框处，没有背景
 * @params  string con 展示的内容
 */
export function showMoreModalHelpTip(tip_array) {
  return <div className={styles.diy_modal_tip_div}>
    <ul>
      {tip_array.map((item, index) => {
        return <li key={index}>• {item}</li>;
      })}
    </ul>
  </div>;
}


//通用的年月日
export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';


/*
 * 删除单条数据确认提示框_除了提示框 别的东西都是自定义
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params content 展示内容
 * */
export function sldPopConfirmDiy(position, title, callback, okText, cancleText, content) {
  return <Popconfirm placement={position} title={title}
                     onConfirm={callback} okText={okText} cancelText={cancleText}>
    {content}
  </Popconfirm>;
}

/**
 * 验证输入的是否是英文字母
 */
export function validatorLetter(rule, value, callback) {
  let reg = /^[A-Za-z]+$/;
  if (!reg.test(value)) {
    callback(`${sldComLanguage('请输入正确的首字母')}`);
  }
  callback();
}

/**
 * 验证大小在0～255范围内
 */
export function validatorNumbe(rule, value, callback) {
  if (!(value >= 0 && value <= 255)) {
    callback(`${sldComLanguage('请输入0~255的数字')}`);
  }
  callback();
}


/**
 * 验证会员名，由中、英文、数字、"-"及"_"，且不能全为数字
 */
export function validatorMem(rule, value, callback) {
  let reg = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$');
  let reg_num = new RegExp('^[0-9]*$');
  if (!value || value.replace(/(^\s*)|(\s*$)/g, '') == '') {
    callback();
  }
  if (value.length < 6 || value.length > 20) {
    callback(`${sldComLanguage('请输入6-20位的会员名')}`);
  } else {
    if (reg.test(value)) {
      if (reg_num.test(value)) {
        callback(`${sldComLanguage('会员名不能全为数字')}`);
      } else {
        callback();
      }
    } else {
      callback(`${sldComLanguage('会员名须由中、英文、数字、"-"及"_"组成')}`);
    }
  }
}

/**
 * 验证会员的密码，6～20位，由字母、数字或符号组成的验证
 */
export function validatorMemPwd(rule, value, callback) {
  if (value.length < 6 || value.length > 20) {
    callback(`${sldComLanguage('请输入6～20位的密码')}`);
  } else if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback(`${sldComLanguage('密码不可以有中文')}`);
  } else if (!(/^\S*$/.test(value))) {
    callback(`${sldComLanguage('密码中不可以有空格')}`);
  } else {
    callback();
  }
}

/**
 * 验证数据都是正整数
 */
export function validatorIntegerPositive(rule, value, callback) {
  let reg = /^[1-9]\d*$/;
  if (value && !reg.test(value)) {
    return false;
  }
  return true;
}

/**
 * 验证数据都是正整数，react from表单验证
 */
export function validatorIntegerPositiveForm(rule, value, callback) {
  let reg = /^[1-9]\d*$/;
  if (value && !reg.test(value)) {
    callback(`${sldComLanguage('请输入正整数')}`);
  }
  callback();
}

/**
 * 验证数据都是2～999的整数
 */
export function validatorConversionRatio(rule, value, callback) {
  let reg = /^[1-9]\d*$/;
  value = value * 1;
  if (value) {
    if (!reg.test(value)) {
      callback(`${sldComLanguage('请输入2~999的整数')}`);
    } else if (value < 2 || value > 999) {
      callback(`${sldComLanguage('请输入2~999的整数')}`);
    }
  }
  callback();
}

/**
 * 验证数据都是1～99999的整数
 */
export function validatorGoodsValidity(rule, value, callback) {
  let reg = /^[1-9]\d*$/;
  value = value * 1;
  if (value) {
    if (!reg.test(value)) {
      callback(`${sldComLanguage('请输入1～99999的整数')}`);
    } else if (value < 1 || value > 99999) {
      callback(`${sldComLanguage('请输入1～99999的整数')}`);
    }
  } else {
    callback(`${sldComLanguage('请输入1～99999的整数')}`);
  }
  callback();
}

/**
 * 验证银行卡号限制21位
 */
export function validatorBankCode(rule, value, callback) {
  let res = validatorIntegerPositive(rule, value, callback);
  if (value && (value + '').length > 22 || !res) {
    callback(`${sldComLanguage('请输入正确的数据')}`);
  }
  callback();
}

/**
 * 获取表格序号
 */
export function getTableNum(params, pageSize, index) {
  let cur_page = params.current != undefined ? params.current : 1;
  return (cur_page - 1) * pageSize + index + 1;
}

/**
 * 返回上下拖动的拖动条
 */
export function getSldResizeBar() {
  return <div style={{ position: 'relative' }}>
    <div style={{ width: '100%', height: 4, backgroundColor: '#c5cfdc', position: 'absolute', zIndex: 1 }}>
    </div>
  </div>;
}

/**
 * 获取商品列表商品图片的展示
 */
export function getSldListGoodsImg(img_url) {
  return img_url ? <div className={`${styles.flex_com_row_center}`}>
    <Popover placement="rightTop"
             content={<div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_160}`}>
               <img src={img_url}/>
             </div>}>
      <div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_30}`}>
        <img src={img_url}/>
      </div>
    </Popover>
  </div> : null;
}

/**
 * 获取商品列表商品图片的展示
 */
export function getSldListGoodsImg80(img_url) {
  return img_url ? <div className={`${styles.flex_com_row_center}`}>
    <Popover placement="rightTop"
             content={<div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_200}`}>
               <img src={img_url}/>
             </div>}>
      <div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_80}`}>
        <img src={img_url}/>
      </div>
    </Popover>
  </div> : null;
}

/**
 * 审核通过拒绝处理是否必填数据
 * @param array  data  要处理的数据
 * @param  e radio选择的结果
 * @param array  filed  字段名，要对哪个数据进行处理
 */
export function sldHandleCheckData(data, e, filed) {
  for (let i in data) {
    if (data[i].name == filed) {
      if (e.target.value) {
        //通过 审核意见非必填
        delete data[i].rules;
      } else {
        //拒绝 审核意见必填
        data[i].rules = [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入审核意见')}`,
        }];
      }
      break;
    }
  }
  return data;
}

/**
 * 验证输入的是否是特殊字符
 * @params  String str  验证的字符串
 */
export function validatorSpecialString(rule, value, callback) {
  const regs = /[`~!@¥#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
  if (value && regs.test(value)) {
    callback(`${sldComLanguage('检测到有特殊字符，请重新输入')}`);
  }
  callback();
}

/**
 * input_after 后缀样式
 */
export function sldInputAfterAddons() {
  return <span className={styles.input_after_wrap}
               style={{ marginLeft: 5, marginRight: 5 }}>{sldTsvg('sousuo1', '#666', 16, 16)}</span>;
}

/**
 * 多语言-统一获取语言
 */
export function sldComLanguage(name) {
  const selectedLang = getLocale();
  return name != undefined && name ? (selectedLang == 'zh-CN' ? name : formatMessage({ id: name })) : '';
}

/**
 * 上传图片限制，限制的大小是服务器的配置
 */
export function sldBeforeUpload(file, fileList, limit = uploadLimit) {
  if (file.size != undefined && file.size > 1024 * 1024 * limit) {
    failTip(`${sldComLanguage('上传文件过大，请上传小于')}` + { limit } + `${sldComLanguage('M的图片')}`);
    return false;
  }
}

/**
 * 表格里的操作按钮,后续增加了判断，主要解决<a> cannot appear as a descendant of <a>这个警告
 */
export function sldtbaleOpeBtn(text, svg, callback, svgW = 14, svgH = 14) {
  return callback == null
    ? <span title={text} style={{ marginRight: 3 }}>
			<ALibbSvg fill={'#FA6F1E'} width={svgW} height={svgH} type={svg}/>
		</span>
    : <a href='javascript:void(0)' onClick={callback} title={text} style={{ marginRight: 3 }}>
      <ALibbSvg fill={'#FA6F1E'} width={svgW} height={svgH} type={svg}/>
    </a>;
}

/**
 * 表格里的操作按钮,Link跳转用
 */
export function sldtbaleOpeLink(text, svg, svgW = 14, svgH = 14) {
  return <span title={text} style={{ marginRight: 3 }}>
		<ALibbSvg fill={'#FA6F1E'} width={svgW} height={svgH} type={svg}/>
	</span>;
}


/**
 * 获取列表图片的展示+预览效果
 * @params  String img_url  图片地址
 * @params  String showW  图片预览的宽度
 * @params  String showH  图片预览的高度
 * @params  String viewW  图片展示的宽度
 * @params  String viewH  图片展示的高度
 */
export function getSldComImg(img_url, showW, showH, viewW, viewH) {
  return img_url ? <div className={`${styles.flex_com_row_center}`}>
    <Popover placement="rightTop"
             content={<div className={`${styles.flex_com_row_center} ${styles.com_img_wrap}`}
                           style={{ width: showW, height: showH }}>
               <img src={img_url}/>
             </div>}>
      <div className={`${styles.flex_com_row_center} ${styles.com_img_wrap}`}
           style={{ width: viewW, height: viewH, margin: '0 5px' }}>
        <img src={img_url}/>
      </div>
    </Popover>
  </div> : null;
}

/*
 * 获取缓存中图片信息
 * @params name  缓存的键
 * */
export function getSldImgSet(name) {
  return localStorage.getItem(name) != undefined && localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : '';
}

/*
 * 圆形背景里面展示图标，用户装修模块的操作
 * @params callback 点击事件
 * @params svgW 图标宽度
 * @params svgH 图标高度
 * @params svg 图标
 * @params svgColor 图标颜色
 * */
export function getOSvgMDiy(callback, svg, svgColor, svgW = 15, svgH = 15) {
  return <div href={'javascript:void(0)'} onClick={callback}
              className={`${styles.mdiy_operate_a} ${styles.flex_row_center_center}`} style={{ height: 30 }}>
    <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} extra={{ marginLeft: 15 }}/>
  </div>;
}

/*
 *返回统计图标Y轴的标题样式
 * */
export function getSldStatYTitle() {
  return {
    textStyle: {
      fontSize: '12',
      textAlign: 'center',
      fill: '#666',
      fontWeight: 'bold',
    }, // 坐标轴文本属性配置
  };
}

/*
 *封装的请求
 * method:请求方式  get  post
 * url 访问地址
 * params 参数
 * data_type json json格式 默认是表单提交
 * */
export function sldComRequest(method, url, params, data_type = '') {
  if (method == 'get') {
    let tmp_url = apiUrl + `${url}`;
    if (params != undefined) {
      tmp_url += `?${stringify(params)}`;
    }
    return request(tmp_url);
  } else if (method == 'post') {
    if (data_type == 'json') {
      return request(apiUrl + `${url}`, {
        method: 'POST',
        body: params,
      }, 'json');
    } else {
      return request(apiUrl + `${url}`, {
        method: 'POST',
        body: `${stringify(params)}`,
      });
    }
  }
}

/**
 * 获取页面横线
 */
export function getSldHorLine(num) {
  return <div style={{ height: num }} className={styles.com_line}></div>;
}

/**
 * 获取页面横线
 * @param {number} num  横线高度
 * @param {string} bgColor  横线的颜色
 */
export function getSldHorLineBgColor(num, bgColor) {
  return <div style={{ height: num, background: bgColor }} className={styles.com_line}></div>;
}

export async function sldCommonService(params, method, url, data_type = '') {
  let cur_time = new Date().getTime();
  let start_time = localStorage.getItem('time');
  let sld_refresh_token = localStorage.getItem('sld_refresh_token');
  //不需要token的接口
  let speial_request = [
    'v3/adminLogin/oauth/token',//登录
    'v3/adminLogin/oauth/logout',//退出登录
    'v3/captcha/common/getCaptcha',//获取验证码
    'v3/system/admin/setting/getPcMainImage',//获取登录页图片
  ];
  let updateFlag = start_time && (cur_time - start_time > (58 * 60 * 1000)) && speial_request.indexOf(url) == -1 && sld_refresh_token != undefined && sld_refresh_token != null;
  // console.info('调试是否更新token的条件：',updateFlag);
  if (updateFlag) {
    // console.info('通过refresh_token刷新token');
    //用户token过期之后重新根据refresh_token获取token(58分钟，token的有效期是60分钟)
    let res = await refreshToken();
    if (res.state == 200) {
      localStorage.setItem('sld_token', res.data.access_token);
      localStorage.setItem('sld_refresh_token', res.data.refresh_token);
      //更新sld_token的时间
      setLocalStorageTime();
      return sldComRequest(method, url, params, data_type);
    } else {
      loginOut();
    }
  } else {
    return sldComRequest(method, url, params, data_type);
  }
}

async function refreshToken() {
  let param = new FormData();
  param.append('grant_type', 'refresh_token');
  param.append('refresh_token', localStorage.getItem('sld_refresh_token'));
  let result = await fetch(apiUrl + 'v3/adminLogin/oauth/token', {
    credentials: 'include',
    headers: {
      Authorization: 'Basic VVcxS2FsRlhVblJoVnpROTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09',
    },
    method: 'POST',
    body: param,
  }).then(response => response.json());
  return result;
}

/**
 * 文字过多 表个列只展示一部分，鼠标悬浮展示全部
 * @param {string} str  展示的数据
 * @param {number} strDefaultLength  默认展示的字数
 * @param {string} popWidth  弹窗的宽度
 * @param {string} popHeight  弹窗的高度
 */
export function getSldComShowMoreTtex(str, strDefaultLength, popWidth, popHeight = '') {
  return str && str.length > strDefaultLength ? <Popover placement="rightTop"
                                                         content={<div style={{
                                                           width: popWidth,
                                                           height: popHeight ? popHeight : 'auto',
                                                           wordBreak: 'break-all',
                                                         }}>
                                                           {str}
                                                         </div>}>
    <div>
      {str.length > strDefaultLength ? str.substr(0, strDefaultLength - 1) + '...' : str}
    </div>
  </Popover> : str;
}

/**
 * 对象数组实现深拷贝
 * @param {array} origion_data  源对象数组
 */
export function getSldCopyData(origion_data) {
  let new_data = [];
  if (origion_data.length > 0) {
    for (let i in origion_data) {
      if (typeof origion_data[i] == 'object') {
        new_data.push({ ...origion_data[i] });
      } else {
        new_data.push(origion_data[i]);
      }
    }
  }
  return new_data;
}

/**
 * 页面要适应高度，不同屏幕获取相应的高度，高度以1080为准，传入的值直接是1080设计图的尺寸就可以
 */
export function sldFullHeight(height) {
  return Math.round(document.body.clientHeight * height / 1920);
}

/*
* 笛卡尔积返回商品的SKU
* 参数的格式：二维数组，eg:[[1, 2, 3], ['a', 'b', 'c']]
* */
export function calcDescartes(array) {
  if (array.length < 2) return array[0] || [];
  return [].reduce.call(array, function(col, set) {
    var res = [];
    col.forEach(function(c) {
      set.forEach(function(s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      });
    });
    return res;
  });
}

/**
 * 表格里的操作按钮,后续增加了判断，主要解决<a> cannot appear as a descendant of <a>这个警告
 * 按钮用文字表示
 */
export function sldtbaleOpeBtnText(text, callback, svgW = 14, svgH = 14) {
  return callback == null
    ? <span className={styles.tableOperateText} style={{ marginRight: 3 }}>
			{text}
		</span>
    : <a className={styles.tableOperateText} href='javascript:void(0)' onClick={callback} title={text}
         style={{ marginRight: 3 }}>
      {text}
    </a>;
}


/*
 * 返回一个数字的整数和小数
 * number 需要处理的数据
 * type: 要获取的数据 int 整数  decimal 小数
 */
export function getPartNumber(number, type) {
  let target = '';
  if (number == undefined) {
    return false;
  }
  number = number.toString();
  if (type == 'int') {
    target = number.split('.')[0];
  } else if (type == 'decimal') {
    target = number.split('.')[1] != undefined ? ('.' + number.split('.')[1]) : '.00';
    if (target.length < 3) {
      target += '0';
    }
  }
  return target;
}

/**
 * 验证邮箱
 */
export function validatorVendorEmail(rule, value, callback) {
  if (!value || value.replace(/(^\s*)|(\s*$)/g, '') == '') {
    callback();
  }
  if (value) {
    if (sldCheckEmail(value)) {
      callback();
    } else {
      callback(`${sldComLanguage('请输入正确的邮箱')}`);
    }
  } else {
    callback();
  }
}


/**
 * 比较2个纯数字数组是否相等
 * a,b 为要比较的数字数组
 * 相等返回true，否则返回false
 */
export function isEqualArray(a, b) {
  if (a.length > 0 && b.length > 0) {
    return a.sort().toString() == b.sort().toString();
  }
  if (a.length == 0 && b.length == 0) {
    return true;
  }
  return false;
}

/*
* 格式化数字，超过1万的处理成单位为W的数据，未超过的不处理
* */
export function formatNumW(num) {
  let result = 0;
  num = num * 1;
  if (num < 10000) {
    result = num;
  } else {
    result = (num / 10000).toFixed(2) + 'w';
  }
  return result;
}

/*
判断是否是IE 11及以下或者其他(其他里包括IE edge)
 */
export function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
}

/*
格式化月或者日，小于10的时候前面用0补齐
 */
export function formatMonthOrDay(val) {
  let resutl = val * 1;
  if (resutl < 10) {
    resutl = '0' + val;
  }
  return resutl;
}

export function noDataPlaceholder(width = '120px', tips = '暂无数据') {
  return <div className={`${styles.flex_column_center_center}`} style={{ width: '100%', height: '100%' }}>
    <img style={{ width }} src={require('../assets/table_nodata_icon.png')} alt=''/>
    <span style={{ fontSize: '12px', color: '#C3C3C3', marginTop: '10px' }}>{tips}</span>
  </div>;
}

/*
 * 获取昨天的日期  返回的结果如：2021-07-01
 * */
export function sldGetYesterdayDate() {
  let today = new Date();
  today.setTime(today.getTime() - 24 * 60 * 60 * 1000);
  let target = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  return target;
}

/*
 * 数字格式化，增加单位万，减少数据长度，返回数据如：1.5万或者8,999
 * @param {Number} num 要格式化的数据
 * */
export function formatNum(num, toFixedNum = 0, color = '#333') {
  let target = num * 1;
  let unit = '';
  if (target) {
    if (target < 10000) {
      target = target.toFixed(toFixedNum);
    } else {
      target = (target / 10000).toFixed(toFixedNum) * 1;
      unit = '万';
    }
    let regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
    target = target.toString().replace(regExpInfo, '$1,');
  } else {
    target = num;
  }
  return <Fragment><span className={styles.statNumVal}>{target}</span><span className={styles.statNumUnit}
                                                                            style={{ color: color }}>{unit}</span></Fragment>;
}

/*
 * 数字格式化，增加单位万，减少数据长度，返回数据如：1.5万或者8,999
 * @param {Number} num 要格式化的数据
 * */
export function formatNumPieCircle(num, toFixedNum = 0) {
  let target = num * 1;
  let unit = '';
  if (target) {
    if (target < 10000) {
      target = target.toFixed(toFixedNum);
    } else {
      target = (target / 10000).toFixed(1) * 1;
      unit = '万';
    }
    let regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
    target = target.toString().replace(regExpInfo, '$1,');
    target = target + unit;
  } else {
    target = num;
  }
  return target;
}

/*
 * 去除字符串左右两端的空格
 * @param {String} str 去除空格的字符串
 * */
export function trimString(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

/*
 * 统计事件
 * @param {Object} data 统计数据
 * */
export function sldStatEvent(data) {
  //将data和公共属性合并得到最终要发送的数据
  let sldStatCommonProperty = {
    pageUrl: window.location.href,
    referrerPageUrl: document.referrer,
    equipmentType: 3, //设备类型，1-pc，2-移动设备，3-其他
  };
  let targetParams = {
    ...sldStatCommonProperty,
    ...data,
  };
  //日志开启的话需要打印数据
  if (sldStatShowDebug) {
    console.info('统计传输数据: ', targetParams);
  }
  let param = new FormData();
  param.append('u', base64Encode(JSON.stringify(targetParams)));
  //发送请求
  fetch(apiUrl + 'v3/statistics/front/member/behavior/save', {
    credentials: 'include',
    headers: {
      Authorization: 'Basic VVcxS2FsRlhVblJoVnpROTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09',
    },
    method: 'POST',
    body: param,
  });
}

/**
 * base64加密
 * @params data String 要加密的字符串
 * @zjf-2021-06-28
 */
export function base64Encode(data) {
  let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }

  return enc;
}

export function utf8Encode(string) {
  string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  let utftext = '',
    start,
    end;
  let stringl = 0,
    n;

  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    let c1 = string.charCodeAt(n);
    let enc = null;

    if (c1 < 128) {
      end++;
    } else if ((c1 > 127) && (c1 < 2048)) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
}

/*
 * 富文本内容反转义（接口返回的富文本内容经过了转义，导致内容无法展示，所以需要反转义）
 * @param {String} str 富文本内容
 * */
export function quillEscapeToHtml(str) {
  if(str!=undefined&&str){
    const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' }
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
      return arrEntities[t]
    })
  }else{
    return ''
  }
}

/*
 * 关闭当前浏览器窗口
 * */
export function pageClose() {
  if (navigator.userAgent.indexOf("MSIE") > 0) {
    if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
      window.opener = null;
      window.close();
    } else {
      window.open('', '_top');
      window.top.close();
    }
  }
  else if (navigator.userAgent.indexOf("Firefox") > 0) {
    window.location.href = 'about:blank ';
  } else {
    window.opener = null;
    window.open('', '_self', '');
    window.close();
  }
}

/**
 * 上传视频限制，限制的大小是服务器的配置
 */
export function sldBeforeUploadVideo(file, fileList, limit = uploadLimit) {
  if (file.type.indexOf('mp4')>-1) {
    if (file.size != undefined && file.size > 1024 * 1024 * limit) {
      failTip(`上传视频过大，请上传小于${limit}M的视频`);
      return false;
    }
  } else{
    failTip(`请上传mp4格式的视频`);
    return false;
  }
}
