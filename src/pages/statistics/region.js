import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin, Radio } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportRegion from './report/region';
import SldStatDate from '@/components/SldStatDate';
import Pie from '@/components/SldStatBizcharts/Pie';
import Map from '@/components/SldStatBizcharts/Map';
import SldScrollbars from '@/components/SldScrollbars';
import BarSingle from '@/components/SldStatBizcharts/BarSingle';

const barColor = ['name', ['l(270) 0:rgba(173, 197, 255, 1) 1:rgba(87, 131, 255, 1)']];//变化趋势柱状图的颜色
@connect(({ statistics, common }) => ({
  statistics, common,
}))
@Form.create()

export default class StatisticsRegion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payOrderTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },
      payOrderTrendData: [],//支付/下单金额趋势数据
      payAmountPercentDataLoading: false,//各省份支付金额占比模块loading
      provinceRiseTrendLoading: false,//各省份增长趋势模块loading
      regionDistributionLoading: false,//地域分布模块loading
      payAmountPercentData: [],//各省份支付金额占比
      provinceRiseTrendMemberData: [],//各省份增长趋势数据（会员）
      provinceRiseTrendStoreData: [],//各省份增长趋势数据（店铺）
      regionDistributionDataMap: [],//地域分布地图数据
      regionDistributionDataPie: [],//地域分布饼状数据
      payAmountPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各省份支付金额占比的筛选条件
      provinceRiseTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各省份增长趋势的筛选条件
      provinceRiseTrendActive: 'member',//各省份增长趋势当前tab
      regionDistributionActive: 'member',//地域分布当前tab
      regionDistributionShowType: 'map',//地域分布展示类型当前tab
    };
  };

  componentDidMount() {
    this.getPayAmountPercentData();
    this.getProvinceRiseTrendData();
    this.getRegionDistributionData('member');
  }

  //获取各省份支付金额占比数据
  getPayAmountPercentData = () => {
    this.setState({ payAmountPercentDataLoading: true });
    const { dispatch } = this.props;
    let { payAmountPercentParams } = this.state;
    let payAmountPercentData = [];
    dispatch({
      type: 'statistics/get_region_pay_amount_percent',
      payload: payAmountPercentParams,
      callback: (res) => {
        this.setState({ payAmountPercentDataLoading: false });
        if (res.state == 200) {
          res.data.orderAmountList.map(item => {
            payAmountPercentData.push({ item: item.provinceName, count: item.orderPayAmount });
          });
          this.setState({
            payAmountPercentData,
          });
        }
      },
    });
  };

  //获取各省份增长趋势数据
  getProvinceRiseTrendData = () => {
    this.setState({ provinceRiseTrendLoading: true });
    const { dispatch } = this.props;
    let { provinceRiseTrendParams } = this.state;
    let provinceRiseTrendMemberData = [];
    let provinceRiseTrendStoreData = [];
    dispatch({
      type: 'statistics/get_province_rise_trend',
      payload: provinceRiseTrendParams,
      callback: (res) => {
        this.setState({ provinceRiseTrendLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            provinceRiseTrendMemberData.push({
              key: item.provinceName,
              name: item.provinceName,
              value: item.memberNum,
            });
            provinceRiseTrendStoreData.push({ key: item.provinceName, name: item.provinceName, value: item.storeNum });
          });
          this.setState({
            provinceRiseTrendMemberData,
            provinceRiseTrendStoreData,
          });
        }
      },
    });
  };

  //获取地域分布数据
  getRegionDistributionData = (type) => {
    this.setState({ regionDistributionLoading: true });
    const { dispatch } = this.props;
    let regionDistributionDataMap = [];
    let regionDistributionDataPie = [];
    let dis_type = type == 'member' ? 'statistics/get_member_region_distribution' : 'statistics/get_store_region_distribution';
    dispatch({
      type: dis_type,
      callback: (res) => {
        this.setState({ regionDistributionLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            regionDistributionDataMap.push({
              name: item.provinceName,
              value: type == 'member' ? item.memberNum : item.storeNum,
            });
            regionDistributionDataPie.push({
              item: item.provinceName,
              count: type == 'member' ? item.memberNum : item.storeNum,
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

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { payAmountPercentParams, provinceRiseTrendParams } = this.state;
    let _this = this;
    if (index == '_region_pay_amount_percent') {
      //各省份支付金额占比的时间筛选
      payAmountPercentParams = { ...payAmountPercentParams, ...date };
      this.setState({ payAmountPercentParams }, () => {
        _this.getPayAmountPercentData();
      });
    } else if (index == '_report_province_rise_trend') {
      //各省份增长趋势的时间筛选
      provinceRiseTrendParams = { ...provinceRiseTrendParams, ...date };
      this.setState({ provinceRiseTrendParams }, () => {
        _this.getProvinceRiseTrendData();
      });
    }
  };

  //tab切换事件
  handleChangeTab = (e, type) => {
    if (type == 'regionDistributionActive') {
      //地域分布会员/店铺切换的话需要重新请求数据
      this.getRegionDistributionData(e.target.value);
    }
    this.setState({ [type]: e.target.value });
  };

  render() {
    const { payAmountPercentDataLoading, payAmountPercentData, provinceRiseTrendLoading, provinceRiseTrendMemberData, provinceRiseTrendStoreData, provinceRiseTrendActive, regionDistributionLoading, regionDistributionDataMap, regionDistributionDataPie, regionDistributionShowType, regionDistributionActive } = this.state;
    return (
      <div className={`${stat.saling_stat} ${stat.stat_part}`}
           style={{ flex: 1, overflow: 'auto' }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${global.flex_row_between_start}`}>
            {/* 各省份支付金额占比-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各省份支付金额占比')}`, 10, 0, 0)}
                <SldStatDate idIndex={'_region_pay_amount_percent'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_region_pay_amount_percent')}/>
              </div>
              <Spin spinning={payAmountPercentDataLoading}>
                <div className={`${stat.table_main}`}>
                  <Pie data={payAmountPercentData} axisType={'amount'} tipTitle={'各省份支付金额'}/>
                </div>
              </Spin>
            </div>
            {/* 各省份支付金额占比-end */}

            {/* 地域分布-start */}
            <div className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                <div className={`${global.flex_row_start_center}`}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('地域分布')}`, 10, 0, 0)}
                  <div style={{ marginLeft: 10 }}>
                    <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'regionDistributionActive')}
                                 defaultValue="member">
                      <Radio.Button value="member">{sldComLanguage('会员')}</Radio.Button>
                      <Radio.Button value="store">{sldComLanguage('店铺')}</Radio.Button>
                    </Radio.Group>
                  </div>
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
                    ? <Map data={regionDistributionDataMap} type={regionDistributionActive}/>
                    : <Pie data={regionDistributionDataPie}/>
                  }
                </div>
              </Spin>
            </div>
            {/* 地域分布-end */}
          </div>

          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各省份增长趋势')}`, 10, 0, 0)}
                <div style={{ marginLeft: 10 }}>
                  <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'provinceRiseTrendActive')}
                               defaultValue="member">
                    <Radio.Button value="member">{sldComLanguage('会员')}</Radio.Button>
                    <Radio.Button value="store">{sldComLanguage('店铺')}</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <SldStatDate idIndex={'_report_province_rise_trend'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_report_province_rise_trend')}/>
            </div>
            <Spin spinning={provinceRiseTrendLoading}>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10 }}>
                <BarSingle
                  data={provinceRiseTrendActive == 'member' ? provinceRiseTrendMemberData : provinceRiseTrendStoreData}
                  color={barColor} showTip={provinceRiseTrendActive == 'member' ? `${sldComLanguage('新增会员数')}` : `${sldComLanguage('新增店铺数')}` }/>
              </div>
            </Spin>
          </div>

          {/* 地域概况报表-start */}
          <StatisticsReportRegion/>
          {/* 地域概况报表-end */}
        </SldScrollbars>
      </div>
    );
  }
}
