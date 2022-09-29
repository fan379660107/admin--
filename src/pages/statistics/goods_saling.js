import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin, Radio } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  noDataPlaceholder,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportGoodsSaling from './report/goods_saling';
import SldStatDate from '@/components/SldStatDate';
import BrandSalesRank from '@/components/SldStat/BrandSalesRank';
import GoodsSalesTrendTop from '@/components/SldStat/GoodsSalesTrendTop';
import PieCircle from '@/components/SldStatBizcharts/PieCircle';
import LineArea from '@/components/SldStatBizcharts/LineArea';
import GoodsSalesRank from '@/components/SldStat/GoodsSalesRank';
import GoodsCollectionRank from '@/components/SldStat/GoodsCollectionRank';
import SldScrollbars from '@/components/SldScrollbars';
import OverView from '@/components/SldStat/OverView';

@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsGoodsSaling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terminalSalesPercentLoading: false,//各终端销售占比模块loading
      goodsSalesTendLoading: false,//商品动销趋势模块loading
      goodsPreviewData: [
        {
          name: `${sldComLanguage('商品总数')}`,
          isShowOperate: false,
          num: '',
          differenceNum: '',
          bg: require('@/assets/goods_item_bg_1.png'),
          mapValue: 'goodsTotalNum',
          mapDifferentValue: '',
          isDifferenceShow: false,
        },
        {
          name: `${sldComLanguage('动销商品数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/goods_item_bg_2.png'),
          mapValue: 'movableGoodsNum',
          mapDifferentValue: 'preMovableGoods',
          isDifferenceShow: true,
        },
        {
          name: `${sldComLanguage('新增商品数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/goods_item_bg_3.png'),
          mapValue: 'newGoodsNum',
          mapDifferentValue: 'preNewGoods',
          isDifferenceShow: true,
        },
        {
          name: `${sldComLanguage('品牌数')}`,
          isShowOperate: false,
          num: '',
          differenceNum: '',
          bg: require('@/assets/goods_item_bg_4.png'),
          isDifferenceShow: false,
          mapValue: 'brandTotalNum',
        },
        {
          name: `${sldComLanguage('新增品牌数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/goods_item_bg_5.png'),
          mapValue: 'newBrandNum',
          mapDifferentValue: 'preNewBrand',
          isDifferenceShow: true,
        },
      ],
      goodsSalesTendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//商品动销趋势的筛选条件
      terminalSalesPercentData: [],//各终端销售占比数据
      terminalSalesPercentAllData: [],//各终端销售占比全部数据
      goodsSalesTendData: [],//商品动销趋势图表数据
      goodsSalesTendAllData: [],//商品动销趋势全部数据
      curGoodsSalesTendDataType: 'newGoodsList',//商品动销趋势当前选中的数据类型：newGoodsList-新增商品数，movableGoodsList-动销商品数，orderNumList-下单数，orderPayNumList-支付订单数
      paramsOptions: [
        {
          startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
        {
          startTime: (moment().subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
        {
          startTime: (moment().subtract(30, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
      ],
      goodsSalesTendTypeData: [
        { label: `${sldComLanguage('新增商品数')}`, value: 'newGoodsList' },
        { label: `${sldComLanguage('动销商品数')}`, value: 'movableGoodsList' },
        { label: `${sldComLanguage('下单数')}`, value: 'orderNumList' },
        { label: `${sldComLanguage('支付订单数')}`, value: 'orderPayNumList' },
      ],//商品动销趋势的筛选项
      terminalSalesPercentTabActive: 'orderAmountList',//各终端销售占比当前tab orderAmountList-销售额 orderNumList-订单量
      terminalSalesPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各终端销售占比的筛选条件
    };
  };

  goodsSalesTendLineColor = ['city', 'rgba(30, 135, 240, 1)'];//商品动销趋势图表的line颜色
  goodsSalesTendAreaColor = ['city',
    ['l(90) 0:rgba(30, 135, 240, 0.38) 0.5:rgba(30, 135, 240, 0.18) 1:rgba(30, 135, 240, 0)',
    ],
  ];//商品动销趋势图表的area颜色

  componentDidMount() {
    this.getGoodsSalesTendData();
    this.getTerminalSalesPercentData();
    this.getGoodsPreviewData();
  }

  //获取各终端销售占比数据
  getTerminalSalesPercentData = () => {
    this.setState({ terminalSalesPercentLoading: true });
    const { dispatch } = this.props;
    let { terminalSalesPercentParams } = this.state;
    dispatch({
      type: 'statistics/get_terminal_sales_percent',
      payload: terminalSalesPercentParams,
      callback: (res) => {
        this.setState({ terminalSalesPercentLoading: false });
        if (res.state == 200) {
          this.initTerminalSalesPercentData(res.data);
          this.setState({
            terminalSalesPercentAllData: res.data,
          });
        }
      },
    });
  };

  initTerminalSalesPercentData = (data) => {
    const { terminalSalesPercentTabActive } = this.state;//各终端销售占比当前tab orderAmountList-销售额 orderNumList-订单量
    let terminalSalesPercentData = [];
    let curData = data[terminalSalesPercentTabActive];
    for (let i in curData) {
      terminalSalesPercentData.push({
        item: curData[i].terminalName,
        count: terminalSalesPercentTabActive == 'orderAmountList' ? curData[i].orderPayAmount : curData[i].orderPayNum,
      });
    }
    this.setState({ terminalSalesPercentData });
  };

  //获取商品动销趋势数据
  getGoodsSalesTendData = () => {
    this.setState({ goodsSalesTendLoading: true });
    const { dispatch } = this.props;
    let { goodsSalesTendParams, goodsSalesTendAllData } = this.state;
    dispatch({
      type: 'statistics/get_goods_sales_trend',
      payload: goodsSalesTendParams,
      callback: (res) => {
        this.setState({ goodsSalesTendLoading: false });
        goodsSalesTendAllData = res.data;
        if (res.state == 200) {
          this.handleMemberClientPercentData(res.data);
          this.setState({
            goodsSalesTendAllData,
          });
        }
      },
    });
  };

  //根据当前选中的类型处理图表需要的数据
  handleMemberClientPercentData = (data) => {
    const { curGoodsSalesTendDataType } = this.state;//商品动销趋势当前选中的数据类型：newGoodsList-新增商品数，movableGoodsList-动销商品数，orderNumList-下单数，orderPayNumList-支付订单数
    let goodsSalesTendData = [];
    let curData = data[curGoodsSalesTendDataType];
    for (let i in curData) {
      let time = curData[i].statsTime;
      if (curGoodsSalesTendDataType == 'newGoodsList') {
        goodsSalesTendData.push({
          month: time,
          city: `${sldComLanguage('新增商品数')}`,
          temperature: curData[i].newGoodsNum,
        });
      } else if (curGoodsSalesTendDataType == 'movableGoodsList') {
        goodsSalesTendData.push({
          month: time,
          city: `${sldComLanguage('动销商品数')}`,
          temperature: curData[i].movableGoodsNum,
        });
      } else if (curGoodsSalesTendDataType == 'orderNumList') {
        goodsSalesTendData.push({
          month: time,
          city: `${sldComLanguage('下单数')}`,
          temperature: curData[i].orderSubmitNum,
        });
      } else if (curGoodsSalesTendDataType == 'orderPayNumList') {
        goodsSalesTendData.push({
          month: time,
          city: `${sldComLanguage('支付订单数')}`,
          temperature: curData[i].orderPayNum,
        });
      }
    }
    this.setState({ goodsSalesTendData });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { terminalSalesPercentParams, goodsSalesTendParams } = this.state;
    let _this = this;
    if (index == '_terminal_sales_percent') {
      //各终端销售占比的时间筛选
      terminalSalesPercentParams = { ...terminalSalesPercentParams, ...date };
      this.setState({ terminalSalesPercentParams }, () => {
        _this.getTerminalSalesPercentData();
      });
    } else if (index == '_goods_sales_trend') {
      //商品动销趋势的时间筛选
      goodsSalesTendParams = { ...goodsSalesTendParams, ...date };
      this.setState({ goodsSalesTendParams }, () => {
        _this.getGoodsSalesTendData();
      });
    }
  };

  //tab切换事件
  handleChangeTab = (e, type) => {
    let { terminalSalesPercentAllData } = this.state;
    this.setState({ [type]: e.target.value }, () => {
      if (type == 'terminalSalesPercentTabActive') {
        this.initTerminalSalesPercentData(terminalSalesPercentAllData);
      }
    });
  };

  //商品动销趋势筛选事件
  handleGoodsSalesTendType = (e) => {
    let { goodsSalesTendAllData } = this.state;
    this.setState({
      curGoodsSalesTendDataType: e.target.value,
    }, () => {
      this.getGoodsSalesTendData(goodsSalesTendAllData);
    });
  };

  getGoodsPreviewData = (itemIndex, params) => {
    const { dispatch } = this.props;
    this.setState({ headerModuleLoadingStatus: true });
    const { paramsOptions } = this.state;

    function commonResolve(res) {
      this.setState({ headerModuleLoadingStatus: false });
      if (res.state === 200) {
        const { goodsPreviewData } = this.state;
        let item;
        for (let i = 0, len = goodsPreviewData.length; i < len; i++) {
          if (itemIndex!=undefined) {
            itemIndex = itemIndex+1;
            item = goodsPreviewData[itemIndex];
          } else {
            item = goodsPreviewData[i];
          }
          if (res.data[item.mapDifferentValue] && res.data[item.mapDifferentValue].indexOf('-') === 0) {
            //较上期下降
            item.differenceNum = res.data[item.mapDifferentValue];
          } else {
            //较上期上涨
            item.differenceNum = '+' + (res.data[item.mapDifferentValue] || '0');
          }
          item.num = res.data[item.mapValue];
          if (itemIndex!=undefined) {
            break;
          }
        }
        return JSON.parse(JSON.stringify(goodsPreviewData));
      }
    }

    dispatch({
      type: 'statistics/get_goods_preview_data',
      payload: params ? params : paramsOptions[0],
      callback: (res) => {
        let tempObj1 = commonResolve.call(this, res);
        dispatch({
          type: 'statistics/get_goods_preview_data_static',
          payload: {},
          callback: (res) => {
            let tempObj2 = commonResolve.call(this, res);
            this.setState({
              goodsPreviewData: [tempObj2[0], tempObj1[1], tempObj1[2], tempObj2[3], tempObj1[4]],
            });
          },
        });
      },
    });
  };

  render() {
    const { goodsPreviewData, headerModuleLoadingStatus, terminalSalesPercentLoading, terminalSalesPercentData, goodsSalesTendLoading, goodsSalesTendData, goodsSalesTendTypeData, curGoodsSalesTendDataType, terminalSalesPercentTabActive } = this.state;
    return (
      <div className={`${stat.saling_stat} ${stat.stat_part}`}
           style={{ flex: 1 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${stat.label_panel}`} style={{ background: '#fff' }}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('商品总览')}`, 10, 0, 0)}
          </div>
          <Spin spinning={headerModuleLoadingStatus}>
            <OverView tabItem={5} data={goodsPreviewData} getMemberPreviewData={this.getGoodsPreviewData}/>
          </Spin>
          {/* 商品动销趋势-start */}
          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('商品动销趋势')}`, 10, 0, 0)}
              </div>
              <SldStatDate idIndex={'_goods_sales_trend'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_goods_sales_trend')}/>
            </div>
            <div className={`${stat.change_trend_radio}`}>
              <span>{sldComLanguage('筛选项：')}</span>
              <Radio.Group
                options={goodsSalesTendTypeData}
                onChange={this.handleGoodsSalesTendType}
                defaultValue={curGoodsSalesTendDataType}
              />
            </div>
            <Spin spinning={goodsSalesTendLoading}>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, height: 498 }}>
                {goodsSalesTendData.length>0
                  ?<LineArea data={goodsSalesTendData} lineColor={this.goodsSalesTendLineColor}
                             areaColor={this.goodsSalesTendAreaColor}/>
                  :noDataPlaceholder()
                }
              </div>
            </Spin>
          </div>
          {/* 商品动销趋势-end */}

          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap', marginTop: -10 }}>
            {/* 品牌销售排行-TOP10-start */}
            <BrandSalesRank/>
            {/* 品牌销售排行-TOP10-end */}

            {/* 商品销售排行-TOP10-start */}
            <GoodsSalesRank/>
            {/* 商品销售排行-TOP10-end */}
          </div>

          {/* 商品销售变化趋势-TOP10-start */}
          <GoodsSalesTrendTop/>
          {/* 商品销售变化趋势-TOP10-end */}

          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap', marginTop: -10 }}>
            {/* 各终端销售占比-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                <div className={`${global.flex_row_start_center}`}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端销售占比')}`, 10, 0, 0)}
                  <div style={{ marginLeft: 10 }}>
                    <Radio.Group size={'small'}
                                 onChange={(e) => this.handleChangeTab(e, 'terminalSalesPercentTabActive')}
                                 defaultValue={terminalSalesPercentTabActive}>
                      <Radio.Button value="orderAmountList">{sldComLanguage('销售额')}</Radio.Button>
                      <Radio.Button value="orderNumList">{sldComLanguage('订单量')}</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <SldStatDate idIndex={'_terminal_sales_percent'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_terminal_sales_percent')}/>
              </div>
              <Spin spinning={terminalSalesPercentLoading}>
                <div onClick={(e) => {
                  e.stopPropagation();
                }} className={`${stat.table_main}`}>
                  {terminalSalesPercentTabActive === 'orderAmountList' ?
                    <PieCircle customGuideTitle={sldComLanguage('各终端销售总额(元)')} axisType='amount' data={terminalSalesPercentData} tipTitle={sldComLanguage('各终端销售额占比')}/> :
                    <PieCircle customGuideTitle={sldComLanguage('各终端总订单量')} tipTitle={sldComLanguage('各终端订单量占比')} data={terminalSalesPercentData}/>
                  }
                </div>
              </Spin>
            </div>
            {/* 各终端销售占比-end */}

            {/* 商品收藏数排行-TOP10-start */}
            <GoodsCollectionRank/>
            {/* 商品收藏数排行-TOP10-end */}
          </div>

          {/* 商品报表-start */}
          <StatisticsReportGoodsSaling/>
          {/* 商品报表-end */}
        </SldScrollbars>
      </div>
    );
  }
}
