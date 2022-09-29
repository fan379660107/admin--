import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  formatNum,
} from '@/utils/utils';
import global from '@/global.less';
import RealtimeOther from './realtime_other';
import stat from '@/assets/css/stat.less';
import SldScrollbars from '@/components/SldScrollbars';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

TweenOne.plugins.push(Children);
@connect(({ statistics, global }) => ({
  statistics, global,
}))
@Form.create()

export default class StatisticsRealtime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedFlag: false,//顶部数据是否加载完成
      screenW: document.body.clientWidth,//屏幕宽度
      refreshTime: '',//更新时间
      initLoading: false,
      detailData: {},//页面数据
      realTimeData1: {
        icon: require('@/assets/real_icon_1.png'),
        title: `${sldComLanguage('平台汇总')}`,
        list: [
          {
            name: `${sldComLanguage('销售总额(元)')}`,
            value: '',
            isHelpIcon: false,
            tip: `${sldComLanguage('截止至当前时间，全平台累计销售额')}`,
            mapKey: 'orderPayAmountTotal',
            isMoney: true,
          },
          {
            name: `${sldComLanguage('会员总数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('截止至当前时间，全平台注册会员数')}`,
            mapKey: 'memberNum',
          },
          {
            name: `${sldComLanguage('店铺总数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('截止至当前时间，全平台商家总数，包括自营商家和入驻商家')}`,
            mapKey: 'storeNum',
          },
          {
            name: `${sldComLanguage('在售商品数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('截止至当前时间，状态为在售的商品数量')}`,
            mapKey: 'saleGoodsNum',
          },
        ],
      },
      realTimeData2: {
        icon: require('@/assets/real_icon_2.png'),
        title: `${sldComLanguage('今日实时')}`,
        list: [
          {
            name: `${sldComLanguage('今日销售额(元)')}`,
            value: '',
            isHelpIcon: false,
            tip: `${sldComLanguage('今日0时至当前时间的销售额')}`,
            mapKey: 'orderPayAmount',
            isMoney: true,
          },
          {
            name: `${sldComLanguage('新增会员数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台注册的人数总和')}`,
            mapKey: 'newMemberNum',
          },
          {
            name: `${sldComLanguage('新增店铺数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台新增商家数')}`,
            mapKey: 'newStoreNum',
          },
          {
            name: `${sldComLanguage('新增商品')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台新增商品spu数')}`,
            mapKey: 'newGoodsNum',
          },
          {
            isBr: true,
          },
          {
            name: `${sldComLanguage('访客数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台所有页面的去重人数总和')}`,
            mapKey: 'visitorNum',
          },
          {
            name: `${sldComLanguage('浏览量')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台所有页面被访问的次数总和')}`,
            mapKey: 'viewNum',
          },
          {
            name: `${sldComLanguage('商品访客数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，访问商品详情页的去重人数')}`,
            mapKey: 'goodsVisitorNum',
          },
          {
            name: `${sldComLanguage('商品浏览量')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，访问商品详情页的人次数')}`,
            mapKey: 'goodsViewNum',
          },
          {
            isBr: true,
          },
          {
            name: `${sldComLanguage('下单数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台用户成功提交订单的笔数总和')}`,
            mapKey: 'orderSubmitNum',
          },
          {
            name: `${sldComLanguage('下单人数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台成功提交订单的去重人数总和')}`,
            mapKey: 'orderSubmitMemberNum',
          },
          {
            name: `${sldComLanguage('下单金额(元)')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台用户成功提交订单的金额总和')}`,
            mapKey: 'orderSubmitAmount',
            isMoney: true,

          },
          {
            name: `${sldComLanguage('下单客单价(元)')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台下单金额/下单人数')}`,
            mapKey: 'orderSubmitAtv',
            isMoney: true,

          },
          {
            name: `${sldComLanguage('访问-下单转化率')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台下单人数/平台访客数')}`,
            mapKey: 'pvSubmitRate',
          },
          {
            isBr: true,
          },
          {
            name: `${sldComLanguage('支付订单数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台用户成功支付的订单数量总和')}`,
            mapKey: 'orderPayNum',
          },
          {
            name: `${sldComLanguage('支付人数')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台成功付款的去重人数总和')}`,
            mapKey: 'orderPayMemberNum',
          },
          {
            name: `${sldComLanguage('支付金额(元)')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台用户成功支付的金额总和')}`,
            mapKey: 'orderPayAmount',
            isMoney: true,

          },
          {
            name: `${sldComLanguage('支付客单价(元)')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台下单金额/下单人数')}`,
            mapKey: 'orderPayAtv',
            isMoney: true,

          },
          {
            name: `${sldComLanguage('访问-支付转化率')}`,
            value: '',
            isHelpIcon: true,
            tip: `${sldComLanguage('统计时间内，全平台支付人数/平台访客数')}`,
            mapKey: 'pvPayRate',
          },
        ],
      },
    };
  }

  componentDidMount() {
    this.resize();
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    window.addEventListener('resize', this.resize, { passive: true });
    this.initData();
  }

  resize = () => {
    this.setState({ screenW: document.body.clientWidth });
  };

  //获取页面数据
  initData = (type = '') => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    let { detailData, realTimeData2, realTimeData1, refreshTime } = this.state;
    let params = {};
    if (type) {
      params.refresh = type;
    }
    dispatch({
      type: 'statistics/get_realtime_data',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          detailData = res.data;

          //渲染头部实时分析的数据
          const { realTimeData1, realTimeData2 } = this.state;
          const tempArray = [...realTimeData1.list, ...realTimeData2.list];
          const tempActionData = { ...res.data.platformSummary, ...res.data.platformTodaySummary,orderPayAmountTotal:res.data.platformSummary.orderPayAmount };
          tempArray.forEach((item, index) => {
            tempArray[index]['value'] = tempActionData[item.mapKey];
          });
          refreshTime = res.data.statsTime;
          this.setState({
            detailData,
            realTimeData2,
            realTimeData1,
            refreshTime,
          });

        }
        this.setState({ loadedFlag: true, initLoading: false });
      },
    });
  };

  render() {
    const { realTimeData2, realTimeData1, initLoading, refreshTime, screenW, loadedFlag, detailData } = this.state;
    const leftW = this.props.global != undefined && this.props.global.collapsed != undefined && this.props.global.collapsed ? 90 : 150;
    let itemW = (screenW * 1 - leftW - 20 - 100 - 30 - 80) / 5;
    return (
      <div className={`${stat.real_stat} ${stat.stat_part}`}
           style={{ flex: 1 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <Spin spinning={initLoading}>
            <div className={`${stat.module_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('实时分析')}`, 10, 0, 0)}
                <Tooltip placement="right" title={`${sldComLanguage('今日实时数据的统计时间均为今日零时至当前更新时间。点击刷新按钮可强制更新。')}`}>
                  <img style={{ display: 'inline-block', marginLeft: '10px' }}
                       src={require('@/assets/home_basic/help_icon.png')}></img>
                </Tooltip>
                <div className={`${stat.update_time_panel} ${global.flex_row_start_center}`}>
                  <span>{`${sldComLanguage('更新时间：')}`}{refreshTime}</span>
                  <i onClick={() => this.initData(true)} className={`${stat.reload_icon}`}></i>
                </div>
              </div>
              <div className={`${stat.real_num_panel}`}>
                <div className={`${stat.num_stat_item} ${global.flex_row_start_center}`}>
                  <div className={`${stat.left_slide} ${global.flex_column_center_center}`}>
                    <img src={realTimeData1.icon} className={`${stat.slide_icon}`}></img>
                    <span className={`${stat.slide_title}`}>{realTimeData1.title}</span>
                  </div>
                  <div className={`${stat.right_main}`}>
                    <ul className={`${global.flex_row_start_center}`}>
                      {realTimeData1.list.map((item, index) => (
                        <li key={index} className={`${global.flex_column_center_start}`} style={{ width: itemW }}>
                          <div className={`${stat.up_desc}`}>
                            <span>{item.name}</span>

                            {item.isHelpIcon ? <Tooltip placement="right" title={item.tip}>
                              <img src={require('@/assets/home_basic/help_icon.png')}></img>
                            </Tooltip> : ''}
                          </div>
                          <div className={`${stat.down_num}`} title={item.value}>
                            <span>
                            {loadedFlag && (
                              item.value > 10000
                                ? formatNum(item.value, item.isMoney ? 2 : 0)
                                : <TweenOne animation={{
                                  Children: {
                                    value: item.value, floatLength: item.isMoney ? 2 : 0,
                                    formatMoney: true,
                                  },
                                  duration: 1000,
                                }}/>
                            )}
                          </span>
                          </div>
                        </li>
                      ))}

                    </ul>
                  </div>
                </div>
                <div>
                  <div className={`${stat.num_stat_item} ${global.flex_row_start_start}`}>
                    <div
                      className={`${stat.left_slide} ${global.flex_column_center_center}`}>
                      <img src={realTimeData2.icon} className={`${stat.slide_icon}`}></img>
                      <span className={`${stat.slide_title}`}>{realTimeData2.title}</span>
                    </div>
                    <div className={`${stat.right_main}`}>
                      <ul style={{ flexWrap: 'wrap' }} className={`${global.flex_row_start_center}`}>
                        {realTimeData2.list.map((item, index) => (
                          item.isBr ?
                            <li key={index} style={{ height: '15px', width: '100%', backgroundColor: '#ffffff' }}></li>
                            :
                            <li key={index} className={`${global.flex_column_center_start}`} style={{ width: itemW }}>
                              <div className={`${stat.up_desc}`}>
                                <span>{item.name}</span>
                                {item.isHelpIcon ? <Tooltip placement="right" title={item.tip}>
                                  <img src={require('@/assets/home_basic/help_icon.png')}></img>
                                </Tooltip> : ''}
                              </div>
                              <div className={`${stat.down_num}`} title={item.value}>
                                <span>
                                  {loadedFlag && (item.mapKey != 'pvSubmitRate') && (item.mapKey != 'pvPayRate') && (
                                    item.value > 10000
                                      ? formatNum(item.value, item.isMoney ? 2 : 0)
                                      : <TweenOne animation={{
                                        Children: {
                                          value: item.value, floatLength: item.isMoney ? 2 : 0,
                                          formatMoney: true,
                                        },
                                        duration: 1000,
                                      }}/>
                                  )}
                                  {loadedFlag && (item.mapKey == 'pvSubmitRate' || item.mapKey == 'pvPayRate') &&
                                  <Fragment>
                                    {item.value}
                                  </Fragment>
                                  }
                              </span>
                              </div>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RealtimeOther detailData={detailData}/>
          </Spin>
        </SldScrollbars>
      </div>
    );
  }
}
