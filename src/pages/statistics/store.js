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
import StatisticsReportStore from './report/store';
import SldStatDate from '@/components/SldStatDate';
import Pie from '@/components/SldStatBizcharts/Pie';
import Map from '@/components/SldStatBizcharts/Map';
import LineArea from '@/components/SldStatBizcharts/LineArea';
import SldScrollbars from '@/components/SldScrollbars';
import OverView from '@/components/SldStat/OverView';

@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStoreTrendLoading: false,//新增店铺趋势模块loading
      regionDistributionLoading: false,//地域分布模块loading
      storeGradePercentLoading: false,//店铺等级分布占比模块loading
      storeTypePercentLoading: false,//店铺类型占比模块loading
      overViewData: [
        {
          name: `${sldComLanguage('店铺总数')}`,
          isShowOperate: false,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_1.png'),
          mapValue: 'storeNum',
          mapDifferentValue: '',
        },
        {
          name: `${sldComLanguage('新增店铺数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_2.png'),
          mapValue: 'newStoreNum',
          mapDifferentValue: 'preNewStore',
          isDifferenceShow: true,
        },
        {
          name: `${sldComLanguage('访客数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_3.png'),
          mapValue: 'visitorNum',
          mapDifferentValue: 'preVisitor',
          isDifferenceShow: true,
        },
        {
          name: `${sldComLanguage('浏览量')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_4.png'),
          mapValue: 'viewNum',
          mapDifferentValue: 'preView',
          isDifferenceShow: true,
        },
      ],
      newStoreTrendData: [],//新增店铺趋势数据
      newStoreTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//新增店铺趋势的筛选条件
      regionDistributionShowType: 'map',//地域分布展示类型当前tab
      regionDistributionDataMap: [],//地域分布地图数据
      regionDistributionDataPie: [],//地域分布饼状数据
      storeGradePercentData: [],//店铺等级分布占比数据
      storeTypePercentData: [],//店铺类型占比占比数据
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
    };
  };

  newStoreTrendLineColor = ['city', 'rgba(30, 135, 240, 1)'];//新增店铺趋势图表的line颜色
  newStoreTrendAreaColor = ['city', ['l(90) 0:rgba(30, 135, 240, 0.38) 0.5:rgba(30, 135, 240, 0.18) 1:rgba(30, 135, 240, 0)']];//新增店铺趋势图表的area颜色

  componentDidMount() {
    this.getNewStoreTrendData();
    this.getRegionDistributionData();
    this.getStoreGradePercentData();
    this.getStoreTypePercentData();
    this.getStorePreviewData();
  }

  //获取新增店铺趋势数据
  getNewStoreTrendData = () => {
    this.setState({ newStoreTrendLoading: true });
    const { dispatch } = this.props;
    let { newStoreTrendParams } = this.state;
    let newStoreTrendData = [];
    dispatch({
      type: 'statistics/get_new_store_trend',
      payload: newStoreTrendParams,
      callback: (res) => {
        this.setState({ newStoreTrendLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            newStoreTrendData.push({
              month: item.statsTime,
              city: `${sldComLanguage('新增店铺数')}`,
              temperature: item.newStoreNum,
            });
          });
          this.setState({
            newStoreTrendData,
          });
        }
      },
    });
  };

  //获取地域分布数据
  getRegionDistributionData = () => {
    this.setState({ regionDistributionLoading: true });
    const { dispatch } = this.props;
    let regionDistributionDataMap = [];
    let regionDistributionDataPie = [];
    dispatch({
      type: 'statistics/get_store_region_distribution',
      callback: (res) => {
        this.setState({ regionDistributionLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            regionDistributionDataMap.push({
              name: item.provinceName,
              value: item.storeNum,
            });
            regionDistributionDataPie.push({
              item: item.provinceName,
              count: item.storeNum,
            });
          });
          this.setState({
            regionDistributionDataMap,
            regionDistributionDataPie,
          });
        }
      },
    });
  };

  //获取店铺等级分布占比数据
  getStoreGradePercentData = () => {
    this.setState({ storeGradePercentLoading: true });
    const { dispatch } = this.props;
    let storeGradePercentData = [];
    dispatch({
      type: 'statistics/get_store_grade_percent',
      callback: (res) => {
        this.setState({ storeGradePercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            storeGradePercentData.push({
              item: item.gradeName,
              count: item.storeNum,
            });
          });
          this.setState({
            storeGradePercentData,
          });
        }
      },
    });
  };

  //获取店铺类型占比数据
  getStoreTypePercentData = () => {
    this.setState({ storeTypePercentLoading: true });
    const { dispatch } = this.props;
    let storeTypePercentData = [];
    dispatch({
      type: 'statistics/get_store_type_percent',
      callback: (res) => {
        this.setState({ storeTypePercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            storeTypePercentData.push({
              item: item.typeName,
              count: item.storeNum,
            });
          });
          this.setState({
            storeTypePercentData,
          });
        }
      },
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { newStoreTrendParams } = this.state;
    let _this = this;
    if (index == '_new_store_trend') {
      //新增店铺趋势的时间筛选
      newStoreTrendParams = { ...newStoreTrendParams, ...date };
      this.setState({ newStoreTrendParams }, () => {
        _this.getNewStoreTrendData();
      });
    }
  };
//获取头部店铺总览数据
  getStorePreviewData = (itemIndex, params) => {
    const { dispatch } = this.props;
    this.setState({ headerModuleLoadingStatus: true });
    let { paramsOptions,overViewData } = this.state;

    function commonResolve(res) {
      this.setState({ headerModuleLoadingStatus: false });
      if (res.state === 200) {
        let tempData = JSON.parse(JSON.stringify(overViewData));
        let item;
        for (let i = 0, len = tempData.length; i < len; i++) {
          if (itemIndex!=undefined) {
            itemIndex = itemIndex+1;
            item = tempData[itemIndex];
          } else {
            item = tempData[i];
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
        return tempData;
      }
    }

    dispatch({
      type: 'statistics/get_store_preview_data',
      payload: params ? params : paramsOptions[0],
      callback: (res) => {

        let tempObj1 = commonResolve.call(this, res);
        this.setState({
          overViewData: [overViewData[0], tempObj1[1], tempObj1[2], tempObj1[3]],
        });

        if(itemIndex == undefined){
          dispatch({
            type: 'statistics/get_store_total_num',
            payload: {},
            callback: (res) => {
              //伪造规范数据格式
              let tempObj2 = commonResolve.call(this, res);
              this.setState({
                overViewData: [tempObj2[0], tempObj1[1], tempObj1[2], tempObj1[3]],
              });
            },
          });
        }
      },
    });
  };
  //tab切换事件
  handleChangeTab = (e, type) => {
    this.setState({ [type]: e.target.value });
  };

  render() {
    const { overViewData, headerModuleLoadingStatus, newStoreTrendLoading, newStoreTrendData, regionDistributionShowType, regionDistributionLoading, regionDistributionDataMap, regionDistributionDataPie, storeGradePercentLoading, storeGradePercentData, storeTypePercentLoading, storeTypePercentData } = this.state;
    return (
      <div className={`${stat.saling_stat} ${stat.stat_part}`}
           style={{ flex: 1 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${stat.label_panel}`} style={{ background: '#fff' }}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺总览')}`, 10, 0, 0)}
          </div>
          <Spin spinning={headerModuleLoadingStatus}>
            <OverView data={overViewData} getMemberPreviewData={this.getStorePreviewData}/>
          </Spin>
          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap', marginTop: 10 }}>
            {/* 新增店铺趋势-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('新增店铺趋势')}`, 10, 0, 0)}
                <SldStatDate idIndex={'_new_store_trend'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_new_store_trend')}/>
              </div>
              <Spin spinning={newStoreTrendLoading}>
                <div className={`${stat.table_main}`}>
                  {newStoreTrendData.length>0
                    ?<LineArea data={newStoreTrendData} lineColor={this.newStoreTrendLineColor}
                               areaColor={this.newStoreTrendAreaColor}/>
                    :noDataPlaceholder()
                  }
                </div>
              </Spin>
            </div>
            {/* 新增店铺趋势-end */}

            {/* 地域分布-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                <div className={`${global.flex_row_start_center}`}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('地域分布')}`, 10, 0, 0)}
                </div>
                <div style={{ marginRight: 10 }}>
                  <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'regionDistributionShowType')}
                               defaultValue="map">
                    <Radio.Button value="map">{sldComLanguage('地图')}</Radio.Button>
                    <Radio.Button value="pie">{sldComLanguage('饼状图')}</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <Spin spinning={regionDistributionLoading}>
                <div className={`${stat.table_main}`}>
                  {regionDistributionShowType == 'map'
                    ? <Map data={regionDistributionDataMap} type={'store'}/>
                    : <Pie data={regionDistributionDataPie} showNumPrecision={0} tipTitle={'店铺地域分布'}/>
                  }
                </div>
              </Spin>
            </div>
            {/* 地域分布-end */}

            {/* 店铺等级分布占比-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺等级分布占比')}`, 10, 0, 0)}
              </div>
              <Spin spinning={storeGradePercentLoading}>
                <div onClick={e => e.stopPropagation()} className={`${stat.table_main}`}>
                  <Pie data={storeGradePercentData} showNumPrecision={0} tipTitle={'店铺等级分布占比'}/>
                </div>
              </Spin>
            </div>
            {/* 店铺等级分布占比-end */}

            {/* 店铺类型占比-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺类型占比')}`, 10, 0, 0)}
              </div>
              <Spin spinning={storeTypePercentLoading}>
                <div onClick={e => e.stopPropagation()} className={`${stat.table_main}`}>
                  <Pie data={storeTypePercentData} showNumPrecision={0} tipTitle={'店铺类型占比'}/>
                </div>
              </Spin>
            </div>
            {/* 店铺类型占比-end */}
          </div>

          {/* 店铺报表-start */}
          <StatisticsReportStore/>
          {/* 店铺报表-end */}
        </SldScrollbars>
      </div>
    );
  }
}
