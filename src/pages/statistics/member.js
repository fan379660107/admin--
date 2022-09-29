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
import StatisticsReportMember from './report/member';
import SldStatDate from '@/components/SldStatDate';
import Pie from '@/components/SldStatBizcharts/Pie';
import Map from '@/components/SldStatBizcharts/Map';
import GoodsPreferRank from '@/components/SldStat/GoodsPreferRank';
import OverView from '@/components/SldStat/OverView';
import PieCircle from '@/components/SldStatBizcharts/PieCircle';
import AreaStack from '@/components/SldStatBizcharts/AreaStack';
import SldScrollbars from '@/components/SldScrollbars';

@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionDistributionLoading: false,//地域分布模块loading
      submitMemberRegionPercentLoading: false,//下单会员地域分布占比模块loading
      memberClientPercentLoading: false,//各终端会员占比模块loading
      changeTrendLoading: false,//变化趋势模块loading
      overViewMemTotalNumData: {
        name: `${sldComLanguage('会员总数')}`,
        isShowOperate: false,
        num: '',
        differenceNum: '',
        bg: require('@/assets/store_item_bg_1.png'),
        mapValue: 'rechargeMemberNum',
        mapDifferentValue: 'preRechargeMember',
        isDifferenceShow: false,
      },
      overViewData: [
        {
          name: `${sldComLanguage('新增会员数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_2.png'),
          mapValue: 'newMemberNum',
          mapDifferentValue: 'preNewMember',
          isDifferenceShow: true,

        },
        {
          name: `${sldComLanguage('储值会员数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_3.png'),
          mapValue: 'rechargeMemberNum',
          mapDifferentValue: 'preRechargeMember',
          isDifferenceShow: true,

        },
        {
          name: `${sldComLanguage('支付人数')}`,
          isShowOperate: true,
          num: '',
          differenceNum: '',
          bg: require('@/assets/store_item_bg_4.png'),
          mapValue: 'payMemberNum',
          mapDifferentValue: 'prePayMember',
          isDifferenceShow: true,
        },
      ],
      headerModuleLoadingStatus: false,
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
      submitMemberRegionPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//下单会员地域分布占比的筛选条件
      changeTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//变化趋势的筛选条件
      regionDistributionShowType: 'map',//地域分布展示类型当前tab
      regionDistributionDataMap: [],//地域分布地图数据
      regionDistributionDataPie: [],//地域分布饼状数据
      submitMemberRegionPercentData: [],//下单会员地域分布占比数据
      memberClientPercentData: [],//各终端会员占比数据
      changeTrendData: [],//变化趋势图表数据
      changeTrendAllData: [],//变化趋势全部数据
      curChangeTrengDataType: 'newMemberNum',//变化趋势当前选中的数据类型：newMemberNum-新增会员数，rechargeMemberNum-储值会员数，orderSubmitMemberNum-下单人数，orderPayMemberNum-支付人数
      changeTrendTypeData: [
        { label: `${sldComLanguage('新增会员数')}`, value: 'newMemberNum' },
        { label: `${sldComLanguage('储值会员数')}`, value: 'rechargeMemberNum' },
        { label: `${sldComLanguage('下单人数')}`, value: 'orderSubmitMemberNum' },
        { label: `${sldComLanguage('支付人数')}`, value: 'orderPayMemberNum' },
      ],//变化趋势的筛选项
    };
  };

  componentDidMount() {
    this.getChangeTrendData();
    this.getMemberClientPercentData();
    this.getRegionDistributionData();
    this.getSubmitMemberRegionPercentData();
    this.getMemberPreviewData();
    this.getMemberTotalNum();
  }

  //获取会员总览——会员总数
  getMemberTotalNum = () => {
    const { dispatch } = this.props;
    const { overViewMemTotalNumData } = this.state;
    dispatch({
      type: 'statistics/get_member_total_num',
      callback: (res) => {
        if (res.state == 200) {
          overViewMemTotalNumData.num = res.data.memberNum;
          this.setState({
            overViewMemTotalNumData,
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
      type: 'statistics/get_member_region_distribution',
      callback: (res) => {
        this.setState({ regionDistributionLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            regionDistributionDataMap.push({
              name: item.provinceName,
              value: item.memberNum,
            });
            regionDistributionDataPie.push({
              item: item.provinceName,
              count: item.memberNum,
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

  //获取下单会员地域分布占比数据
  getSubmitMemberRegionPercentData = () => {
    this.setState({ submitMemberRegionPercentLoading: true });
    const { dispatch } = this.props;
    let { submitMemberRegionPercentParams } = this.state;
    let submitMemberRegionPercentData = [];
    dispatch({
      type: 'statistics/get_submit_member_region_percent',
      payload: submitMemberRegionPercentParams,
      callback: (res) => {
        this.setState({ submitMemberRegionPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            submitMemberRegionPercentData.push({
              item: item.provinceName,
              count: item.memberNum,
            });
          });
          this.setState({
            submitMemberRegionPercentData,
          });
        }
      },
    });
  };

  //获取各终端会员占比数据
  getMemberClientPercentData = () => {
    this.setState({ memberClientPercentLoading: true });
    const { dispatch } = this.props;
    let memberClientPercentData = [];
    dispatch({
      type: 'statistics/get_member_client_percent',
      callback: (res) => {
        this.setState({ memberClientPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            memberClientPercentData.push({
              item: item.terminalName,
              count: item.memberNum,
            });
          });
          this.setState({
            memberClientPercentData,
          });
        }
      },
    });
  };

  //获取变化趋势数据
  getChangeTrendData = () => {
    this.setState({ changeTrendLoading: true });
    const { dispatch } = this.props;
    let { changeTrendParams, changeTrendAllData } = this.state;
    dispatch({
      type: 'statistics/get_change_trend',
      payload: changeTrendParams,
      callback: (res) => {
        this.setState({ changeTrendLoading: false });
        changeTrendAllData = res.data;
        if (res.state == 200) {
          this.handleMemberClientPercentData(res.data);
          this.setState({
            changeTrendAllData,
          });
        }
      },
    });
  };

  //根据当前选中的类型处理图表需要的数据
  handleMemberClientPercentData = (data) => {
    const { curChangeTrengDataType } = this.state;//变化趋势当前选中的数据类型：newMemberNum-新增会员数，rechargeMemberNum-储值会员数，orderSubmitMemberNum-下单人数，orderPayMemberNum-支付人数
    let changeTrendData = [];
    if (data.length > 0) {
      data.map(item => {
        item.terminalList.map(child => {
          changeTrendData.push({
            month: item.statsTime,
            city: child.terminalName,
            temperature: child[curChangeTrengDataType],
          });
        });
      });
    }
    this.setState({ changeTrendData });
  };
  //获取头部会员总览数据
  getMemberPreviewData = (itemIndex, params) => {
    const { dispatch } = this.props;
    this.setState({ headerModuleLoadingStatus: true });
    const { paramsOptions } = this.state;
    dispatch({
      type: 'statistics/get_category_return_sale_member_data',
      payload: params ? params : paramsOptions[0],
      callback: (res) => {
        this.setState({ headerModuleLoadingStatus: false });
        if (res.state === 200) {
          let { overViewData } = this.state;
          overViewData = JSON.parse(JSON.stringify(overViewData));
          let item;
          for (let i = 0, len = overViewData.length; i < len; i++) {
            if (itemIndex != undefined) {
              item = overViewData[itemIndex];
            } else {
              item = overViewData[i];
            }

            if (res.data[item.mapDifferentValue] && res.data[item.mapDifferentValue].indexOf('-') === 0) {
              //较上期下降
              item.differenceNum = res.data[item.mapDifferentValue];

            } else {
              //较上期上涨
              item.differenceNum = '+' + (res.data[item.mapDifferentValue] || '0');

            }
            item.num = res.data[item.mapValue];
            if (itemIndex != undefined) {
              break;
            }
          }
          this.setState({ overViewData });
        }
      },
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { submitMemberRegionPercentParams, changeTrendParams } = this.state;
    let _this = this;
    if (index == '_submit_member_region_percent') {
      //下单会员地域分布占比的时间筛选
      submitMemberRegionPercentParams = { ...submitMemberRegionPercentParams, ...date };
      this.setState({ submitMemberRegionPercentParams }, () => {
        _this.getSubmitMemberRegionPercentData();
      });
    } else if (index == '_change_trend') {
      //变化趋势的时间筛选
      changeTrendParams = { ...changeTrendParams, ...date };
      this.setState({ changeTrendParams }, () => {
        _this.getChangeTrendData();
      });
    }
  };

  //tab切换事件
  handleChangeTab = (e, type) => {
    this.setState({ [type]: e.target.value });
  };

  //变化趋势筛选事件
  handleChangeTrendType = (e) => {
    let { changeTrendAllData } = this.state;
    this.setState({
      curChangeTrengDataType: e.target.value,
    }, () => {
      this.handleMemberClientPercentData(changeTrendAllData);
    });
  };

  render() {
    const { headerModuleLoadingStatus, overViewData, regionDistributionShowType, regionDistributionLoading, regionDistributionDataMap, regionDistributionDataPie, submitMemberRegionPercentLoading, submitMemberRegionPercentData, memberClientPercentLoading, memberClientPercentData, changeTrendLoading, changeTrendData, changeTrendTypeData, curChangeTrengDataType, overViewMemTotalNumData } = this.state;
    return (
      <div className={`${stat.saling_stat} ${stat.stat_part}`}
           style={{ flex: 1 }}>
        <SldScrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 60}
        >
          <div className={`${stat.label_panel}`} style={{ background: '#fff' }}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('会员总览')}`, 10, 0, 0)}
          </div>

          {/* 会员总览-start */}
          <Spin spinning={headerModuleLoadingStatus}>
            <OverView data={[overViewMemTotalNumData, ...overViewData]}
                      getMemberPreviewData={this.getMemberPreviewData}/>
          </Spin>
          {/* 会员总览-end */}

          {/* 变化趋势-start */}
          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('变化趋势')}`, 10, 0, 0)}
              </div>
              <SldStatDate idIndex={'_change_trend'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_change_trend')}/>
            </div>
            <div className={`${stat.change_trend_radio} ${global.flex_row_start_center}`}>
              <span>{sldComLanguage('筛选项：')}</span>
              <Radio.Group
                options={changeTrendTypeData}
                onChange={this.handleChangeTrendType}
                defaultValue={curChangeTrengDataType}
              />

            </div>
            <Spin spinning={changeTrendLoading}>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, height: 498 }}>
                <div style={{ padding: '10px 20px 35px 20px', height: 443 }}>
                  {changeTrendData.length > 0
                    ? <AreaStack data={changeTrendData}/>
                    : noDataPlaceholder()
                  }
                </div>
              </div>
            </Spin>
          </div>
          {/* 变化趋势-end */}

          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap' }} style={{ marginTop: -10 }}>
            {/* 会员偏好商品排行-TOP10-start */}
            <GoodsPreferRank/>
            {/* 会员偏好商品排行-TOP10-end */}

            {/* 各终端会员占比-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端会员占比')}`, 10, 0, 0)}
              </div>
              <Spin spinning={memberClientPercentLoading}>
                <div onClick={(e) => {
                  e.stopPropagation();
                }} className={`${stat.table_main}`}>
                  <PieCircle customGuideTitle={sldComLanguage('各终端会员总数')} tipTitle={sldComLanguage('各终端会员占比')}
                             data={memberClientPercentData}/>
                </div>
              </Spin>
            </div>
            {/* 各终端会员占比-end */}
          </div>
          <div className={`${global.flex_row_start_start}`} style={{ flexWrap: 'wrap' }}>
            {/* 下单会员地域分布占比-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('下单会员地域分布占比')}`, 10, 0, 0)}
                <SldStatDate idIndex={'_submit_member_region_percent'}
                             updateSelectDate={(date) => this.updateSelectDate(date, '_submit_member_region_percent')}/>
              </div>
              <Spin spinning={submitMemberRegionPercentLoading}>
                <div onClick={e => e.stopPropagation()} className={`${stat.table_main}`}>
                  <Pie data={submitMemberRegionPercentData} showNumPrecision={0} tipTitle={'下单会员地域分布占比'}/>
                </div>
              </Spin>
            </div>
            {/* 下单会员地域分布占比-end */}

            {/* 地域分布-start */}
            <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
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
                    ? <Map data={regionDistributionDataMap} type={'member'}/>
                    : <Pie data={regionDistributionDataPie} showNumPrecision={0} tipTitle={'会员地域分布'}/>
                  }
                </div>
              </Spin>
            </div>
            {/* 地域分布-end */}
          </div>

          {/* 会员报表-start */}
          <StatisticsReportMember/>
          {/* 会员报表-end */}
        </SldScrollbars>
      </div>
    );
  }
}
