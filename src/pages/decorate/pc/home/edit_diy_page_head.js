/*
* 装修页面头部
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {sldSvgIcon,sldComLanguage} from '@/utils/utils';
import global from '@/global.less';
import styles from './edit_diy_page_head.less';

let sthis = '';
@connect(({ common, pc_home }) => ({
  common, pc_home,
}))
@Form.create()

export default class EditDdiyPageHead extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    this.state = {
      hot_search_words: [],//热搜词
      mall_logo: '',//商城logo
      nav_list: [],//导航列表
    };
  }


  componentDidMount() {
    this.get_base_setting();//获取基本配置信息
    this.get_nav_list();//获取导航列表
  }

  //获取基本配置信息
  get_base_setting = () => {
    const { dispatch } = this.props;
    let { hot_search_words, mall_logo } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'hot_search_words,main_site_logo' },
      callback: (res) => {
        if (res.state == 200) {
          res.data.map(item => {
            if (item.name == 'hot_search_words') {
              let tmp = [];
              if (item.value) {
                tmp = item.value.split(',');
              }
              hot_search_words = tmp;
            } else if (item.name == 'main_site_logo') {
              mall_logo = item.imageUrl ? item.imageUrl : require('@/assets/pc_diy_top_default_mall_logo.png');
            }
          });
          this.setState({ hot_search_words, mall_logo });
        }
      },
    });
  };

  //获取导航列表
  get_nav_list = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_home_nav_list',
      payload: { pageSize: 30 },
      callback: (res) => {
        if (res.state == 200) {
          this.setState({ nav_list: res.data.list });
        }
      },
    });
  };


  render() {
    const { hot_search_words, mall_logo, nav_list } = this.state;
    return (
      <Fragment>
        {/* 最顶部 start */}
        <div className={styles.header_wrap}>
          <div className={styles.header}>
            <div className={styles.header_left}>
              <span className={styles.hello}>{sldComLanguage('您好，欢迎来到')}</span>
              <span className={`${styles.register} ${styles.h1}`}>{sldComLanguage('登录')}</span>
              <span className={`${styles.register} ${styles.h1}`}>{sldComLanguage('注册')}</span>
            </div>
            <div className={styles.header_right}>
              <ul>
                <li>
                  <div className={styles.li_item}>{sldComLanguage('商城首页')}</div>
                </li>
                <li>
                  <div className={`${styles.has_more} ${styles.li_item}`}>
                    {sldComLanguage('我的订单')}
                    <div className={styles.li_item_more}>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('待支付订单')}</a>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('待收货订单')}</a>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('待评价订单')}</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.li_item}>{sldComLanguage('个人中心')}</div>
                </li>
                <li>
                  <div className={`${styles.has_more} ${styles.li_item}`}>
                    {sldComLanguage('我的收藏')}
                    <div className={styles.li_item_more}>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('商品收藏')}</a>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('店铺收藏')}</a>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('我的足迹')}</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={`${styles.has_more} ${styles.li_item}`}>
                    {sldComLanguage('我的账户')}
                    <div className={styles.li_item_more}>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('我的优惠券')}</a>
                      <a href="javascript:void(0)" className={styles.li_item_more_item}>{sldComLanguage('我的余额')}</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={`${styles.li_item}`}>{sldComLanguage('服务中心')}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* 最顶部 end */}

        {/* 搜索部分 start */}
        <div className={`${styles.sld_home_top_search} ${styles.container}`}>
          <div className={`${styles.ld} ${styles.sld_home_top_search_left}`}>
            <a className={`${styles.sld_logo_wrap} ${global.flex_row_start_center}`}>
              <img src={mall_logo}/>
            </a>
          </div>
          <div className={styles.sld_seach_wrap}>
            <div className={`${styles.sld_seach_box} ${styles.ld}`}>
              <div className={styles.form}>
                <input type="text" className={styles.text} autocomplete="off" style={{ color: 'rgb(153,153,153)' }}
                       placeholder={sldComLanguage('请输入关键词')}/>
                <input type="submit" value={sldComLanguage('搜索')} className={styles.button}/>
              </div>
              <div className={styles.hot_search_wrap}>
                <div>
                  {hot_search_words.length && hot_search_words.map((item, index) => {
                    return <a key={index} href="javascript:void(0)">{item}</a>;
                  })
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sld_cart_wrap}>
            <dl class>
              <dt className={`${styles.ld} ${styles.cart_icon_text_wrap}`}
                  style={{ borderBottom: '1px solid rgb(239, 239, 239)' }}>
                <span className={styles.iconfont}>{sldSvgIcon('#e2231a',16,16,'gouwuche1')}</span>
                <a href="javascript:void(0)">{sldComLanguage('我的购物车')}</a>
                <div className={styles.cart_goods_num}>0</div>
              </dt>
            </dl>
          </div>
        </div>
        {/* 搜索部分 end */}

        {/* 导航 start */}
        <div className={styles.nav_cat}>
          <div className={styles.header}>
            <div className={styles.product_sort}>
              <img src={require('@/assets/pc_diy_top_all_cat_icon.png')}/>
              <span className={styles.sort}>{sldComLanguage('产品分类')}</span>
            </div>
            <nav>
              <li><a href="javascript:void(0)">{sldComLanguage('首页')}</a></li>
              {nav_list.length && nav_list.map((item, index) => {
                return <li key={index}><a href="javascript:void(0)">{item.navName}</a></li>;
              })}
            </nav>
          </div>
        </div>
        {/* 导航 end */}
      </Fragment>
    );
  }
}
