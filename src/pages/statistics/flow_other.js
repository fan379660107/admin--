import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Radio, Spin } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StoreFlowRank from '@/components/SldStat/StoreFlowRank';
import GoodsFlowRank from '@/components/SldStat/GoodsFlowRank';
import PieCircle from '@/components/SldStatBizcharts/PieCircle';
import Bars from '@/components/SldStatBizcharts/Bars';
import BarSingle from '@/components/SldStatBizcharts/BarSingle';
import StatisticsReportFlow from './report/flow';
import SldStatDate from '@/components/SldStatDate';
import moment from 'moment';

const barColor = {
  two: ['name', ['l(270) 0:rgba(173, 197, 255, 1) 1:rgba(87, 131, 255, 1)', 'l(270) 0:rgba(147, 238, 210, 0.85) 1:rgba(90, 216, 166, 0.85)']],
  single: ['name', ['l(270) 0:rgba(173, 197, 255, 1) 1:rgba(87, 131, 255, 1)']],
};

@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class FlowOther extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeTrendLoading: false,//近30天变化趋势模块的loading
      terminalViewNumPercentLoading: false,//各终端浏览量占比模块的loading
      terminalVisitorNumPercentLoading: false,//各终端访客数占比模块的loading
      changeTrendTypeData: [
        { label: `${sldComLanguage('访客数/新访客数')}`, value: 'visitor' },
        { label: `${sldComLanguage('浏览量')}`, value: 'viewNum' },
        { label: `${sldComLanguage('下单人数/支付人数')}`, value: 'orderSubmitMemberNum' },
        { label: `${sldComLanguage('下单数/支付订单数')}`, value: 'orderSubmitNum' },
        { label: `${sldComLanguage('浏览-付款转化率')}`, value: 'pvPayRate' },
      ],//近30天变化趋势的筛选项
      curChangeTrendDataType: 'visitor',//近30天变化趋势的筛选项——默认选项
      changeTrendData: [],//近30天变化趋势的数据
      changeTrendAllData: [],//近30天变化趋势的全部数据
      curChangeTrendClientType: 'all',//近30天变化趋势的终端类型，默认为all 全部
      changeTrendDataBarColor: barColor.two,//柱状图颜色
      changeTrendDataFlag: 2,//近30天变化趋势的柱子类型：1为一组一条柱子的 2为一组两条柱子的
      terminalViewNumPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各终端浏览量占比的筛选条件
      terminalVisitorNumPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各终端访客占比的筛选条件
      terminalViewNumPercentData: [],//各终端浏览量占比的数据
      terminalVisitorNumPercentData: [],//各终端访客数占比的数据
    };
  };

  componentDidMount() {
    this.getChangeTrendData();
    this.getTerminalViewNumPercentParamsData();
    this.getTerminalVisitorNumPercentParamsData();
  }

  //获取各终端浏览量占比的数据
  getTerminalViewNumPercentParamsData = () => {
    this.setState({ terminalViewNumPercentLoading: true });
    const { dispatch } = this.props;
    let { terminalViewNumPercentParams } = this.state;
    let terminalViewNumPercentData = [];
    dispatch({
      type: 'statistics/get_terminal_view_num_percent',
      payload: terminalViewNumPercentParams,
      callback: (res) => {
        this.setState({ terminalViewNumPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            terminalViewNumPercentData.push({
              item: item.terminalName,
              count: item.viewNum,
            });
          });
          this.setState({
            terminalViewNumPercentData,
          });
        }
      },
    });
  };

  //获取各终端访客数占比的数据
  getTerminalVisitorNumPercentParamsData = () => {
    this.setState({ terminalVisitorNumPercentLoading: true });
    const { dispatch } = this.props;
    let { terminalVisitorNumPercentParams } = this.state;
    let terminalVisitorNumPercentData = [];
    dispatch({
      type: 'statistics/get_terminal_visitor_num_percent',
      payload: terminalVisitorNumPercentParams,
      callback: (res) => {
        this.setState({ terminalVisitorNumPercentLoading: false });
        if (res.state == 200) {
          res.data.map(item => {
            terminalVisitorNumPercentData.push({
              item: item.terminalName,
              count: item.visitorNum,
            });
          });
          this.setState({
            terminalVisitorNumPercentData,
          });
        }
      },
    });
  };

  //获取近30天变化趋势的数据
  getChangeTrendData = () => {
    this.setState({ changeTrendLoading: true });
    const { dispatch } = this.props;
    let { curChangeTrendClientType, changeTrendAllData } = this.state;
    let params = {};
    if (curChangeTrendClientType != 'all') {
      params.terminalTypes = curChangeTrendClientType;
    }
    dispatch({
      type: 'statistics/get_change_trend_data',
      payload: params,
      callback: (res) => {
        changeTrendAllData = res.data;
        if (res.state == 200) {
          this.handleChangeTendTypeData(res.data);
          this.setState({
            changeTrendAllData,
          });
        }
      },
    });
  };

  //根据当前选中的近30天变化趋势类型处理图表需要的数据
  handleChangeTendTypeData = (data) => {
    let { curChangeTrendDataType, changeTrendDataBarColor, changeTrendDataFlag } = this.state;//近30天变化趋势的选中项：visitor-访客数/新访客数，viewNum-浏览量，orderSubmitMemberNum-下单人数/支付人数，orderSubmitNum-下单数/支付订单数，pvPayRate-浏览-付款转化率
    let changeTrendData = [];
    let curData = data;
    changeTrendDataBarColor = barColor.two;
    changeTrendDataFlag = 2;
    for (let i in curData) {
      let time = curData[i].statsTime;
      if (curChangeTrendDataType == 'visitor') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('访客数')}`,
          value: curData[i].visitorNum,
        });
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('新访客数')}`,
          value: curData[i].newVisitorNum,
        });
      } else if (curChangeTrendDataType == 'viewNum') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('浏览量')}`,
          value: curData[i].viewNum,
        });
        changeTrendDataBarColor = barColor.single;
        changeTrendDataFlag = 1;
      } else if (curChangeTrendDataType == 'orderSubmitMemberNum') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('下单人数')}`,
          value: curData[i].orderSubmitMemberNum,
        });
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('支付人数')}`,
          value: curData[i].orderPayMemberNum,
        });
      } else if (curChangeTrendDataType == 'orderSubmitNum') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('下单数')}`,
          value: curData[i].orderSubmitNum,
        });
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('支付订单数')}`,
          value: curData[i].orderPayNum,
        });
      } else if (curChangeTrendDataType == 'pvPayRate') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('浏览-付款转化率')}`,
          value: curData[i].pvPayRate || '0%',
        });
        changeTrendDataBarColor = barColor.single;
        changeTrendDataFlag = 1;
      }
    }
    this.setState({ changeTrendLoading: false });
    this.setState({ changeTrendData, changeTrendDataBarColor, changeTrendDataFlag });
  };

  //近30天变化趋势筛选事件
  handleChangeTrendType = (e) => {
    let { changeTrendAllData } = this.state;
    this.setState({
      curChangeTrendDataType: e.target.value,
      changeTrendLoading: true,
    }, () => {
      this.handleChangeTendTypeData(changeTrendAllData);
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDatePie = (date, index) => {
    let { terminalViewNumPercentParams, terminalVisitorNumPercentParams } = this.state;
    let _this = this;
    if (index == '_terminal_view_num_percent') {
      //各终端浏览量占比的时间筛选
      terminalViewNumPercentParams = { ...terminalViewNumPercentParams, ...date };
      this.setState({ terminalViewNumPercentParams }, () => {
        _this.getTerminalViewNumPercentParamsData();
      });
    } else if (index == '_terminal_visitor_num_percent') {
      //各终端访客占比的时间筛选
      terminalVisitorNumPercentParams = { ...terminalVisitorNumPercentParams, ...date };
      this.setState({ terminalVisitorNumPercentParams }, () => {
        _this.getTerminalVisitorNumPercentParamsData();
      });
    }
  };
  //tab切换事件
  handleChangeTab = (e, type) => {
    this.setState({ [type]: e.target.value }, () => {
      if (type == 'curChangeTrendClientType') {
        this.getChangeTrendData();
      }
    });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { provinceSalesPercentParams, terminalSalesPercentDataParams, provinceSalesTrendParams, terminalSalesTrendParams } = this.state;
    let _this = this;
    if (index == '_province_sales_percent') {
      //各省份销售占比的时间筛选
      provinceSalesPercentParams = { ...provinceSalesPercentParams, ...date };
      this.setState({ provinceSalesPercentParams }, () => {
        _this.getProvinceSalesPercentData();
      });
    } else if (index == '_terminal_sales_percent') {
      //各省份销售占比的时间筛选
      terminalSalesPercentDataParams = { ...terminalSalesPercentDataParams, ...date };
      this.setState({ terminalSalesPercentDataParams }, () => {
        _this.getTerminalSalesPercentData();
      });
    } else if (index == '_province_sales_trend') {
      //各省份销售变化趋势的时间筛选
      provinceSalesTrendParams = { ...provinceSalesTrendParams, ...date };
      this.setState({ provinceSalesTrendParams }, () => {
        _this.getProvinceSalesTrendData();
      });
    } else if (index == '_terminal_sales_trend') {
      //各终端销售变化趋势的时间筛选
      terminalSalesTrendParams = { ...terminalSalesTrendParams, ...date };
      this.setState({ terminalSalesTrendParams }, () => {
        _this.getTerminalSalesTrendData();
      });
    }
  };

  render() {
    const { changeTrendTypeData, curChangeTrendDataType, curChangeTrendClientType, changeTrendLoading, changeTrendData, changeTrendDataBarColor, changeTrendDataFlag, terminalViewNumPercentData, terminalViewNumPercentLoading, terminalVisitorNumPercentLoading, terminalVisitorNumPercentData } = this.state;
    return (
      <Fragment>
        {/* 近30天变化趋势-start */}
        <div style={{ backgroundColor: '#f0f2f5' }} className={`${global.flex_row_between_start}`}>
          <div style={{ marginTop: '10px', width: '100%', marginRight: 0 }} className={`${stat.common_table_item}`}>
            <div className={`${stat.label_panel} ${global.flex_row_start_center}`}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('近30天变化趋势')}`, 10, 0, 0)}
              <div style={{ marginLeft: 10 }}>
                <Radio.Group size={'small'} onChange={(e) => this.handleChangeTab(e, 'curChangeTrendClientType')}
                             defaultValue={curChangeTrendClientType}>
                  <Radio.Button value="all">全部</Radio.Button>
                  <Radio.Button value="android">Android</Radio.Button>
                  <Radio.Button value="ios">IOS</Radio.Button>
                  <Radio.Button value="pc">PC</Radio.Button>
                  <Radio.Button value="xcx">微信小程序</Radio.Button>
                  <Radio.Button value="h5">H5</Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <div className={`${stat.change_trend_radio}`}>
              <span>{sldComLanguage('筛选项：')}</span>
              <Radio.Group
                options={changeTrendTypeData}
                onChange={this.handleChangeTrendType}
                defaultValue={curChangeTrendDataType}
              />
            </div>
            <Spin spinning={changeTrendLoading}>
              <div style={{ height: 400 }}>
                {changeTrendData.length > 0 && changeTrendDataFlag == 2 &&
                <Bars data={changeTrendData} color={changeTrendDataBarColor} flag={changeTrendDataFlag}/>}
                {changeTrendData.length > 0 && changeTrendDataFlag == 1 &&
                <BarSingle data={changeTrendData} color={changeTrendDataBarColor} flag={changeTrendDataFlag}/>}
              </div>
            </Spin>
          </div>
        </div>
        {/* 近30天变化趋势-end */}

        <div style={{ flexWrap: 'wrap', backgroundColor: '#f0f2f5' }} className={`${global.flex_row_between_start}`}>
          {/* 各终端浏览量占比-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端浏览量占比')}`, 10, 0, 0)}
              <SldStatDate idIndex={'_terminal_view_num_percent'}
                           updateSelectDate={(date) => this.updateSelectDatePie(date, '_terminal_view_num_percent')}/>
            </div>
            <Spin spinning={terminalViewNumPercentLoading}>
              <div className={`${stat.table_main}`}>
                {
                  <PieCircle tipTitle={sldComLanguage('各终端浏览量占比')} customGuideTitle={sldComLanguage('各终端浏览量总数')}
                             data={terminalViewNumPercentData}/>}
              </div>
            </Spin>
          </div>
          {/* 各终端浏览量占比-end */}

          {/* 各终端访客数占比-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端访客数占比')}`, 10, 0, 0)}
              <SldStatDate idIndex={'_terminal_visitor_num_percent'}
                           updateSelectDate={(date) => this.updateSelectDatePie(date, '_terminal_visitor_num_percent')}/>
            </div>
            <Spin spinning={terminalVisitorNumPercentLoading}>
              <div className={`${stat.table_main}`}>
                {
                  <PieCircle customGuideTitle={sldComLanguage('各终端总访客数')} tipTitle={sldComLanguage('各终端访客数占比')}
                             data={terminalVisitorNumPercentData}/>}
              </div>
            </Spin>
          </div>
          {/* 各终端访客数占比-end */}

          {/* 店铺流量排行-start */}
          <StoreFlowRank/>
          {/* 店铺流量排行-end */}

          {/* 商品流量排行-start */}
          <GoodsFlowRank/>
          {/* 商品流量排行-end */}

          {/* 流量报表-start */}
          <StatisticsReportFlow/>
          {/* 流量报表-end */}
        </div>
      </Fragment>
    );
  }
}
