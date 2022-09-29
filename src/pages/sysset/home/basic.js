import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tooltip as TooltipAntd } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, formatNum } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import styles from './basic.less';
import SldScrollbars from '@/components/SldScrollbars';
import StoreSalesRank from '@/components/SldStat/StoreSalesRank';
import GoodsSalesRank from '@/components/SldStat/GoodsSalesRank';
import CategoryRank from '@/components/SldStat/CategoryRank';
import BrandSales from '@/components/SldStat/BrandSales';
import RegionDistribution from '@/components/SldStat/RegionDistribution';
import NewTrend from '@/components/SldStat/NewTrend';
import FlowTrend from '@/components/SldStat/FlowTrend';
import PayOrderTrend from '@/components/SldStat/PayOrderTrend';
import router from 'umi/router';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

TweenOne.plugins.push(Children);
@connect(({ sldsetting, common, global }) => ({
  sldsetting, common, global,
}))
@Form.create()

export default class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedFlag: false,//顶部数据是否加载完成
      waitDealLoading: false,//顶部待办事项数据是否加载完成
      goods_data_one: [{
        icon: require('@/assets/stat_item_icon_1.png'),
        label: `${sldComLanguage('待审核店铺')}`,
        tip: `${sldComLanguage('（元）')}`,
        mapKey: 'auditStoreNum',
        num: '',
        path: '/manage_store/settle_store_list?tab=check',
      }, {
        icon: require('@/assets/stat_item_icon_2.png'),
        label: `${sldComLanguage('待审核商品')}`,
        tip: ``,
        mapKey: 'auditGoodsNum',
        num: '',
        path: '/manage_product/goods_list?tab=check',
      }, {
        icon: require('@/assets/stat_item_icon_3.png'),
        label: `${sldComLanguage('待审核品牌')}`,
        tip: ``,
        mapKey: 'auditBrandNum',
        num: '',
        path: '/manage_product/brand?tab=check',
      }, {
        icon: require('@/assets/stat_item_icon_4.png'),
        label: `${sldComLanguage('待确认退款单')}`,
        tip: ``,
        mapKey: 'confirmReturnNum',
        num: '',
        path: '/manage_order/service',
      }, {
        icon: require('@/assets/stat_item_icon_5.png'),
        label: `${sldComLanguage('待处理结算单')}`,
        tip: ``,
        mapKey: 'dealBillNum',
        num: '',
        path: '/manage_bill/lists',
      }],
      todayTradeLoadedFlag: false,
      todayFlowLoadedFlag: false,
      todayGoodsLoadedFlag: false,
      todayMemberLoadedFlag: false,
      todayTradeLoading: false,
      todayFlowLoading: false,
      todayGoodsLoading: false,
      todayMemberLoading: false,
      todayTradeData: {
        update_time: '',
        label: `${sldComLanguage('今日交易概况')}`,
        loading: false,
        key: 'todayTrade',
        statsTime: '',
        children: [
          {
            key: `${sldComLanguage('下单数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台用户成功提交订单的笔数总和')}`,
            mapKey: 'orderSubmitNum',
          },
          {
            key: `${sldComLanguage('下单金额(元)')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台用户成功提交订单的金额总和')}`,
            mapKey: 'orderSubmitAmount',
          },
          {
            key: `${sldComLanguage('支付订单数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台用户成功支付的订单数量总和')}`,
            mapKey: 'orderPayNum',
          },
          {
            key: `${sldComLanguage('支付金额(元)')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台用户成功支付的金额总和')}`,
            mapKey: 'orderPayAmount',
          },
        ],
      },//今日交易信息
      todayFlowData: {
        update_time: '',
        label: `${sldComLanguage('今日流量概况')}`,
        loading: false,
        key: 'todayFlow',
        statsTime: '',
        children: [
          {
            key: `${sldComLanguage('访客数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台所有页面的去重人数总和')}`,
            mapKey: 'visitorNum',
          },
          {
            key: `${sldComLanguage('浏览量')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台所有页面被访问的次数总和')}`,
            mapKey: 'viewNum',
          },
          {
            key: `${sldComLanguage('商品访客数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，访问商品详情页的去重人数')}`,
            mapKey: 'goodsVisitorNum',
          },
          {
            key: `${sldComLanguage('商品浏览量')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，访问商品详情页的人次数')}`,
            mapKey: 'goodsViewNum',
          },
        ],
      },//今日流量信息
      todayGoodsData: {
        update_time: '',
        label: `${sldComLanguage('今日商品概况')}`,
        loading: false,
        key: 'todayGoods',
        statsTime: '',
        children: [
          {
            key: `${sldComLanguage('商品总数')}`,
            value: '',
            tip: `${sldComLanguage('截止至当前时间，全平台店铺的商品spu总数')}`,
            mapKey: 'goodsTotalNum',
          },
          {
            key: `${sldComLanguage('新增商品数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台新增商品spu数')}`,
            mapKey: 'newGoodsNum',
          },
          {
            key: `${sldComLanguage('在售商品数')}`,
            value: '',
            tip: `${sldComLanguage('截止至当前时间，状态为在售的商品数量')}`,
            mapKey: 'saleGoodsNum',
          },
          {
            key: `${sldComLanguage('下架商品数')}`,
            value: '',
            tip: `${sldComLanguage('截止至当前时间，全平台违规下架的商品总数')}`,
            mapKey: 'shelfGoodsNum',
          },
        ],
      },//今日商品信息
      todayMemberData: {
        update_time: '',
        label: `${sldComLanguage('今日用户概况')}`,
        loading: false,
        key: 'todayMember',
        statsTime: '',
        children: [
          {
            key: `${sldComLanguage('店铺总数')}`,
            value: '',
            tip: `${sldComLanguage('截止至当前时间，全平台商家总数，包括自营商家和入驻商家')}`,
            mapKey: 'storeNum',
          },
          {
            key: `${sldComLanguage('新增店铺数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台新增商家数')}`,
            mapKey: 'newStoreNum',
          },
          {
            key: `${sldComLanguage('会员总数')}`,
            value: '',
            tip: `${sldComLanguage('截止至当前时间，全平台注册会员数')}`,
            mapKey: 'memberNum',
          },
          {
            key: `${sldComLanguage('新增会员数')}`,
            value: '',
            tip: `${sldComLanguage('统计时间内，全平台首次注册并发生访问行为的用户。')}`,
            mapKey: 'newMemberNum',
          },
        ],
      },//今日会员信息
    };
  }

  componentDidMount() {
    this.getWaitEventData();
    this.getTodayTradeInfo();
    this.getTodayMemberInfo();
    this.getTodayFlowInfo();
    this.getTodayGoodsInfo();
  }

  //获取待办栏目数据
  getWaitEventData = () => {
    const { dispatch } = this.props;
    //loading开始
    this.setState({
      waitDealLoading: true,
    });
    dispatch({
      type: 'sldsetting/get_home_basic_wait_deal_stat_info',
      callback: (res) => {
        if (res.state === 200) {
          let { goods_data_one } = this.state;
          goods_data_one.map(item => {
            item.num = res.data[item.mapKey];
          });
          this.setState({ goods_data_one });
        }
        this.setState({ waitDealLoading: false, loadedFlag: true });
      },
    });
  };

  //获取今日交易信息数据
  getTodayTradeInfo = () => {
    const { dispatch } = this.props;
    let { todayTradeData } = this.state;
    //loading开始
    this.setState({ todayTradeLoading: true });
    dispatch({
      type: 'sldsetting/get_home_basic_today_trade_info',
      callback: (res) => {
        if (res.state === 200) {
          todayTradeData.children.map(item => {
            item.value = res.data[item.mapKey];
          });
          todayTradeData.statsTime = res.data.statsTime;
          this.setState({ todayTradeData });
        }
        this.setState({ todayTradeLoading: false, todayTradeLoadedFlag: true });
      },
    });
  };

  //获取今日用户信息数据
  getTodayMemberInfo = () => {
    const { dispatch } = this.props;
    let { todayMemberData } = this.state;
    //loading开始
    this.setState({ todayMemberLoading: true });
    dispatch({
      type: 'sldsetting/get_home_basic_today_member_info',
      callback: (res) => {
        if (res.state === 200) {
          todayMemberData.children.map(item => {
            item.value = res.data[item.mapKey];
          });
          todayMemberData.statsTime = res.data.statsTime;
          this.setState({ todayMemberData });
        }
        this.setState({ todayMemberLoading: false, todayMemberLoadedFlag: true });
      },
    });
  };

  //获取今日流量信息数据
  getTodayFlowInfo = () => {
    const { dispatch } = this.props;
    let { todayFlowData } = this.state;
    //loading开始
    this.setState({ todayFlowLoading: true });
    dispatch({
      type: 'sldsetting/get_home_basic_today_flow_info',
      callback: (res) => {
        if (res.state === 200) {
          todayFlowData.children.map(item => {
            item.value = res.data[item.mapKey];
          });
          todayFlowData.statsTime = res.data.statsTime;
          this.setState({ todayFlowData });
        }
        this.setState({ todayFlowLoading: false, todayFlowLoadedFlag: true });
      },
    });
  };

  //获取今日商品信息数据
  getTodayGoodsInfo = () => {
    const { dispatch } = this.props;
    let { todayGoodsData } = this.state;
    //loading开始
    this.setState({ todayGoodsLoading: true });
    dispatch({
      type: 'sldsetting/get_home_basic_today_goods_info',
      callback: (res) => {
        if (res.state === 200) {
          todayGoodsData.children.map(item => {
            item.value = res.data[item.mapKey];
          });
          todayGoodsData.statsTime = res.data.statsTime;
          this.setState({ todayGoodsData });
        }
        this.setState({ todayGoodsLoading: false, todayGoodsLoadedFlag: true });
      },
    });
  };

  //待办事项跳转
  menuItemGoPage = (path) => {
    router.push(path);
  };

  render() {
    const { goods_data_one, loadedFlag, waitDealLoading, todayTradeData, todayFlowData, todayGoodsData, todayMemberData, todayTradeLoadedFlag, todayFlowLoadedFlag, todayGoodsLoadedFlag, todayMemberLoadedFlag, todayTradeLoading, todayFlowLoading, todayGoodsLoading, todayMemberLoading } = this.state;
    const todayData = [
      { ...todayTradeData },
      { ...todayFlowData },
      { ...todayGoodsData },
      { ...todayMemberData },
    ];
    return (
      <div className={`${styles.basic_new} ${stat.stat_part}`}
           style={{ flex: 1 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${styles.module_item}`}>
            <div className={`${stat.label_panel}`}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('待办事项')}`, 10, 0, 0)}
            </div>
            <Spin spinning={waitDealLoading}>
              <div className={`${styles.stat_amount_new} ${global.flex_com_row_space_around_center}`}>
                {goods_data_one.map((item, index) => (
                  <div key={index} onClick={() => (this.menuItemGoPage(item.path))} key={item.bg}
                       className={`${styles.item} ${styles.goods} ${global.flex_com_row_start_start}`}
                  >
                    <div className={`${styles.left_pending_icon}`}>
                      <img src={item.icon} alt=""/>
                    </div>
                    <div className={`${styles.item_desc}`}>
                      <div className={`${styles.item_title}`}>{item.label}</div>
                      <div title={item.num} className={`${styles.item_num}`}>
                        {loadedFlag && (
                          item.num > 10000
                            ? formatNum(item.num)
                            : <TweenOne animation={{
                              Children: {
                                value: item.num, floatLength: 0,
                                formatMoney: true,
                              },
                              duration: 1000,
                            }}/>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Spin>
          </div>
          <div className={`${styles.today_info_panel} ${global.flex_com_space_between}`}>
            {todayData.map((item, index) => (
              <div key={index} className={`${styles.today_info_item}`}>
                <div className={`${styles.position_title} ${global.flex_row_start_center}`}>
                  {item.label}
                </div>
                <div className={`${styles.title} ${global.flex_row_end_center}`}>
                  <span className={`${styles.update_time}`}>{item.statsTime}</span>
                </div>
                <Spin spinning={eval(item.key+"Loading")}>
                  <div className={`${styles.info_children}`}>
                    <ul>
                      {item.children.map((item2, index2) => (
                        <li key={index2}>
                          <div className={`${styles.key} ${global.flex_row_start_center}`}>
                            <span>{item2.key}</span>
                            <TooltipAntd placement="right" title={item2.tip}>
                              <img style={{ cursor: 'pointer' }}
                                   src={require('@/assets/home_basic/help_icon.png')}></img>
                            </TooltipAntd>
                          </div>
                          <div className={`${styles.value}`} title={item2.value}>
                            {eval(item.key+"LoadedFlag") &&
                            (item2.value > 10000
                              ? formatNum(item2.value, (item2.mapKey=='orderSubmitAmount'||item2.mapKey=='orderPayAmount'||item2.mapKey=='orderPayAmount') ? 2 : 0)
                              : <TweenOne animation={{
                                Children: {
                                  value: typeof value === 'number' ? value : item2.value,
                                  floatLength: (item2.mapKey=='orderSubmitAmount'||item2.mapKey=='orderPayAmount'||item2.mapKey=='orderPayAmount') ? 2 : 0,
                                  formatMoney: true,
                                },
                                duration: 1000,
                              }}/>)
                            }
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Spin>
              </div>
            ))}

          </div>
          <div className={`${styles.visualized_panel} ${global.flex_row_between_start}`}>
            {/* 支付/下单金额趋势-start */}
            <PayOrderTrend/>
            {/* 支付/下单金额趋势-end */}

            {/* 流量趋势-start */}
            <FlowTrend/>
            {/* 流量趋势-end */}

            {/* 会员/店铺新增趋势-start */}
            <NewTrend/>
            {/* 会员/店铺新增趋势-end */}

            {/* 地域分布-start */}
            <RegionDistribution/>
            {/* 地域分布-end */}
          </div>
          <div style={{ flexWrap: 'wrap', marginBottom: '10px' }} className={`${global.flex_row_between_start}`}>
            <StoreSalesRank/>
            <GoodsSalesRank/>
            <CategoryRank/>
            {/* 品牌销售占比-start */}
            <BrandSales/>
            {/* 品牌销售占比-end */}
          </div>
        </SldScrollbars>
      </div>
    );
  }
}
