import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Radio, Spin, Select } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  noDataPlaceholder,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StoreSalesRank from '@/components/SldStat/StoreSalesRank';
import GoodsSalesRank from '@/components/SldStat/GoodsSalesRank';
import PieCircle from '@/components/SldStatBizcharts/PieCircle';
import StatisticsReportTrade from './report/trade';
import Bars from '@/components/SldStatBizcharts/Bars';
import BarSingle from '@/components/SldStatBizcharts/BarSingle';
import moment from 'moment';
import LineArea from '@/components/SldStatBizcharts/LineArea';
import AreaStack from '@/components/SldStatBizcharts/AreaStack';
import SldStatDate from '@/components/SldStatDate';
import Pie from '@/components/SldStatBizcharts/Pie';
import areaData from '@/assets/area.json';

const barColor = {
  two: ['name', ['l(270) 0:rgba(173, 197, 255, 1) 1:rgba(87, 131, 255, 1)', 'l(270) 0:rgba(147, 238, 210, 0.85) 1:rgba(90, 216, 166, 0.85)']],
  single: ['name', ['l(270) 0:rgba(173, 197, 255, 1) 1:rgba(87, 131, 255, 1)']],
};
const { Option } = Select;

@connect(({ common, global }) => ({
  common, global,
}))
@Form.create()

export default class TradeOther extends Component {

  constructor(props) {
    super(props);
    this.state = {
      changeTrendTypeData: [
        { label: `${sldComLanguage('下单金额/支付金额')}`, value: 'orderSubmitAmount' },
        { label: `${sldComLanguage('下单数/支付订单数')}`, value: 'orderSubmitNum' },
        { label: `${sldComLanguage('下单客单价/支付客单价')}`, value: 'orderSubmitAtv' },
        { label: `${sldComLanguage('浏览量')}`, value: 'viewNum' },
        { label: `${sldComLanguage('浏览-支付转化率')}`, value: 'pvPayRate' },
      ],//近30天变化趋势的筛选项
      changeTrendLoading: false,//近30天变化趋势模块的loading
      provinceSalesTrendLoading: false,//各省份销售变化趋势模块的loading
      terminalSalesTrendLoading: false,//各终端销售变化趋势模块的loading
      curChangeTrendDataType: 'orderSubmitAmount',//近30天变化趋势的选中项
      changeTrendData: [],//近30天变化趋势的数据
      provinceSalesTrendData: [],//各省份销售变化趋势的数据
      changeTrendAllData: [],//近30天变化趋势的全部数据
      curChangeTrendClientType: 'all',//近30天变化趋势的终端类型，默认为all 全部
      changeTrendDataBarColor: barColor.two,//柱状图颜色
      changeTrendDataFlag: 2,//近30天变化趋势的柱子类型：1为一组一条柱子的 2为一组两条柱子的
      provinceSalesTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各省份销售变化趋势的筛选条件
      provinceCode: 'CN003000000',//各省份销售变化趋势模块选择的省份
      provinceSalesPercentParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各省份销售占比的筛选条件
      provinceSalesPercentData: [],//各省份销售占比数据-销量占比
      provinceSalesPercentAmountData: [],//各省份销售占比数据-销售额占比
      curProvinceSalesPercentType: 'amount',//各省份销售占比数据-当前选中类型，默认为销售额
      terminalSalesPercentDataParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各终端销售占比的筛选条件
      terminalSalesPercentData: [],//各终端销售占比-销量占比
      terminalSalesPercentAmountData: [],//各终端销售占比-销售额占比
      curTerminalSalesPercentType: 'amount',//各终端销售占比数据-当前选中类型，默认为销售额
      terminalSalesTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//各终端销售变化趋势的筛选条件
      terminalSalesTrendData: [],//各终端销售变化趋势-销量占比
      terminalSalesTrendAmountData: [],//各终端销售变化趋势-销售额占比
      curTerminalSalesTrendType: 'amount',//各终端销售变化趋势数据-当前选中类型，默认为销售额
      unit: `${sldComLanguage('¥')}`,//近30天变化趋势图表的单位
    };
  };

  componentDidMount() {
    this.getChangeTrendData();
    this.getProvinceSalesTrendData();
    this.getProvinceSalesPercentData();
    this.getTerminalSalesPercentData();
    this.getTerminalSalesTrendData();
    //解决柱形图在各别电脑会出现抖动的问题
    document.querySelector('section.ant-layout:not(.ant-layout-has-sider)').style.width = '100vw';
  }

  //获取各终端销售变化趋势的数据
  getTerminalSalesTrendData = () => {
    this.setState({ terminalSalesTrendLoading: true });
    const { dispatch } = this.props;
    let { terminalSalesTrendParams } = this.state;
    let terminalSalesTrendData = [];
    let terminalSalesTrendAmountData = [];
    dispatch({
      type: 'statistics/get_terminal_sales_trend',
      payload: terminalSalesTrendParams,
      callback: (res) => {
        this.setState({ terminalSalesTrendLoading: false });
        if (res.state == 200) {
          let time = res.data.statsTime;
          res.data.map(item => {
            item.terminalList.map(child => {
              terminalSalesTrendData.push({
                month: item.statsTime,//横轴
                city: child.terminalName,
                temperature: child.orderPayNum,//纵轴
              });
              terminalSalesTrendAmountData.push({
                month: item.statsTime,//横轴
                city: child.terminalName,
                temperature: child.orderPayAmount,//纵轴
              });
            });
          });
          this.setState({
            terminalSalesTrendData,
            terminalSalesTrendAmountData,
          });
        }
      },
    });
  };

  //获取各省份销售占比数据
  getProvinceSalesPercentData = () => {
    this.setState({ provinceSalesPercentLoading: true });
    const { dispatch } = this.props;
    let { provinceSalesPercentParams } = this.state;
    let provinceSalesPercentData = [];
    let provinceSalesPercentAmountData = [];
    dispatch({
      type: 'statistics/get_province_sales_percent',
      payload: provinceSalesPercentParams,
      callback: (res) => {
        this.setState({ provinceSalesPercentLoading: false });
        if (res.state == 200) {
          res.data.orderNumList.map(item => {
            provinceSalesPercentData.push({ item: item.provinceName, count: item.orderPayNum });
          });
          res.data.orderAmountList.map(item => {
            provinceSalesPercentAmountData.push({ item: item.provinceName, count: item.orderPayAmount });
          });
          this.setState({
            provinceSalesPercentData,//各省份销售占比数据-销量占比
            provinceSalesPercentAmountData,//各省份销售占比数据-销售额占比
          });
        }
      },
    });
  };

  //获取各终端销售占比数据
  getTerminalSalesPercentData = () => {
    this.setState({ terminalSalesPercentLoading: true });
    const { dispatch } = this.props;
    let { terminalSalesPercentDataParams } = this.state;
    let terminalSalesPercentData = [];
    let terminalSalesPercentAmountData = [];
    dispatch({
      type: 'statistics/get_terminal_sales_percent',
      payload: terminalSalesPercentDataParams,
      callback: (res) => {
        this.setState({ terminalSalesPercentLoading: false });
        if (res.state == 200) {
          res.data.orderNumList.map(item => {
            terminalSalesPercentData.push({ item: item.terminalName, count: item.orderPayNum });
          });
          res.data.orderAmountList.map(item => {
            terminalSalesPercentAmountData.push({ item: item.terminalName, count: item.orderPayAmount });
          });
          this.setState({
            terminalSalesPercentData,//各终端销售占比数据-销量占比
            terminalSalesPercentAmountData,//各终端销售占比数据-销售额占比
          });
        }
      },
    });
  };

  //获取各省份销售变化趋势的数据
  getProvinceSalesTrendData = () => {
    this.setState({ provinceSalesTrendLoading: true });
    const { dispatch } = this.props;
    let { provinceCode, provinceSalesTrendData, provinceSalesTrendParams } = this.state;
    let params = { ...provinceSalesTrendParams };
    if (provinceCode) {
      params.provinceCode = provinceCode;
    }
    dispatch({
      type: 'statistics/get_province_sales_trend',
      payload: params,
      callback: (res) => {
        this.setState({ provinceSalesTrendLoading: false });
        if (res.state == 200) {
          provinceSalesTrendData = [];
          this.setState({ provinceSalesTrendData: [] }, () => {
            for (let i in res.data.orderAmountList) {
              provinceSalesTrendData.push({
                month: res.data.orderAmountList[i].statsTime,//横轴
                city: `${sldComLanguage('销售额')}`,
                temperature: res.data.orderAmountList[i].orderPayAmount,//纵轴
              });
              provinceSalesTrendData.push({
                month: res.data.orderAmountList[i].statsTime,//横轴
                city: `${sldComLanguage('订单量')}`,
                temperature: res.data.orderNumList[i].orderPayNum,//纵轴
              });
            }
            this.setState({
              provinceSalesTrendData,
            });
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
    let { curChangeTrendDataType, changeTrendDataBarColor, changeTrendDataFlag, unit } = this.state;//近30天变化趋势的选中项
    let changeTrendData = [];
    let curData = data;
    changeTrendDataBarColor = barColor.two;
    changeTrendDataFlag = 2;
    for (let i in curData) {
      let time = curData[i].statsTime;
      if (curChangeTrendDataType == 'orderSubmitAmount') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('下单金额')}`,
          value: curData[i].orderSubmitAmount,
        });
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('支付金额')}`,
          value: curData[i].orderPayAmount,
        });
        unit = `${sldComLanguage('¥')}`;
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
        unit = '';
      } else if (curChangeTrendDataType == 'orderSubmitAtv') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('下单客单价')}`,
          value: curData[i].orderSubmitAtv,
        });
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('支付客单价')}`,
          value: curData[i].orderPayAtv,
        });
        unit = `${sldComLanguage('¥')}`;
      } else if (curChangeTrendDataType == 'viewNum') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('浏览量')}`,
          value: curData[i].viewNum,
        });
        changeTrendDataBarColor = barColor.single;
        changeTrendDataFlag = 1;
        unit = '';
      } else if (curChangeTrendDataType == 'pvPayRate') {
        changeTrendData.push({
          key: time,
          name: `${sldComLanguage('浏览-付款转化率')}`,
          value: curData[i].pvPayRate,
        });
        changeTrendDataBarColor = barColor.single;
        changeTrendDataFlag = 1;
        unit = '';
      }
    }
    this.setState({ changeTrendData, changeTrendDataBarColor, changeTrendDataFlag, changeTrendLoading: false, unit });
  };

  //tab切换事件
  handleChangeTab = (e, type) => {
    this.setState({ [type]: e.target.value }, () => {
      if (type == 'curChangeTrendClientType') {
        this.getChangeTrendData();
      }
    });
  };

  //销售额、销量的切换事件
  handleChangeAmountNumType = (e, type) => {
    this.setState({ [type]: e.target.value });
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

  //省份选择事件
  handleSelectProvince = (e) => {
    this.setState({ provinceCode: e }, () => {
      this.getProvinceSalesTrendData();
    });
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

  render() {
    const { curChangeTrendClientType, changeTrendLoading, changeTrendTypeData, curChangeTrendDataType, changeTrendData, changeTrendDataFlag, changeTrendDataBarColor, provinceSalesTrendLoading, provinceSalesTrendData, provinceSalesPercentData, provinceSalesPercentLoading, provinceSalesPercentAmountData, curProvinceSalesPercentType, terminalSalesPercentData, terminalSalesPercentLoading, curTerminalSalesPercentType, terminalSalesPercentAmountData, provinceCode, terminalSalesTrendLoading, terminalSalesTrendData, curTerminalSalesTrendType, terminalSalesTrendAmountData, unit } = this.state;

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
                <Bars data={changeTrendData} color={changeTrendDataBarColor} flag={changeTrendDataFlag} unit={unit}/>}
                {changeTrendData.length > 0 && changeTrendDataFlag == 1 &&
                <BarSingle data={changeTrendData} color={changeTrendDataBarColor} flag={changeTrendDataFlag}/>}
              </div>
            </Spin>
          </div>
        </div>
        {/* 近30天变化趋势-end */}
        <div style={{ flexWrap: 'wrap', backgroundColor: '#f0f2f5', marginTop: 10 }}
             className={`${global.flex_row_between_start}`}>

          {/* 店铺销售排行-TOP10-start */}
          <StoreSalesRank/>
          {/* 店铺销售排行-TOP100-end */}

          {/* 商品销售排行-TOP10-start */}
          <GoodsSalesRank/>
          {/* 商品销售排行-TOP10-end */}

          {/* 各省份销售变化趋势-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各省份销售趋势')}`, 10, 0, 0)}
                <div style={{ marginLeft: 10 }}>
                  <Select defaultValue={provinceCode} style={{ width: 115 }}
                          onChange={(e) => this.handleSelectProvince(e)}>
                    {areaData.map((item) => {
                      return <Option key={item.regionCode} value={item.regionCode}>{item.regionName}</Option>;
                    })}
                  </Select>
                </div>
              </div>
              <SldStatDate idIndex={'_province_sales_trend'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_province_sales_trend')}/>
            </div>
            <Spin spinning={provinceSalesTrendLoading}>
              <div className={`${stat.table_main}`}>
                {provinceSalesTrendData.length > 0
                  ? <LineArea data={provinceSalesTrendData} extra={true} showUnitKey={'销售额'}/>
                  : noDataPlaceholder()
                }
              </div>
            </Spin>
          </div>
          {/* 各省份销售变化趋势-end */}

          {/* 各省份销售占比-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各省份销售占比')}`, 10, 0, 0)}
                <div style={{ marginLeft: 10 }}>
                  <Radio.Group size={'small'}
                               onChange={(e) => this.handleChangeAmountNumType(e, 'curProvinceSalesPercentType')}
                               defaultValue="amount">
                    <Radio.Button value="amount">{sldComLanguage('销售额')}</Radio.Button>
                    <Radio.Button value="sales">{sldComLanguage('订单量')}</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <SldStatDate idIndex={'_province_sales_percent'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_province_sales_percent')}/>
            </div>
            <Spin spinning={provinceSalesPercentLoading}>
              <div className={`${stat.table_main}`}>
                <Pie
                  axisType={curProvinceSalesPercentType}
                  data={curProvinceSalesPercentType == 'amount' ? provinceSalesPercentAmountData : provinceSalesPercentData}
                  showNumPrecision={curProvinceSalesPercentType == 'amount' ? 2 : 0}
                  tipTitle={curProvinceSalesPercentType == 'amount' ? '各省份销售额占比' : '各省份订单量占比'}
                />
              </div>
            </Spin>
          </div>
          {/* 各省份销售占比-end */}

          {/* 各终端销售变化趋势-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端销售趋势')}`, 10, 0, 0)}
                <div style={{ marginLeft: 10 }}>
                  <Radio.Group size={'small'}
                               onChange={(e) => this.handleChangeAmountNumType(e, 'curTerminalSalesTrendType')}
                               defaultValue="amount">
                    <Radio.Button value="amount">{sldComLanguage('销售额')}</Radio.Button>
                    <Radio.Button value="sales">{sldComLanguage('订单量')}</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <SldStatDate idIndex={'_terminal_sales_trend'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_terminal_sales_trend')}/>
            </div>
            <Spin spinning={terminalSalesTrendLoading}>
              <div className={`${stat.table_main}`}>
                <div style={{ padding: '10px 20px 35px 20px', height: 443 }}>
                  {((curTerminalSalesTrendType == 'amount' && terminalSalesTrendAmountData.length > 0) || (curTerminalSalesTrendType != 'amount' && terminalSalesTrendData.length > 0))
                    ? <AreaStack
                      data={curTerminalSalesTrendType == 'amount' ? terminalSalesTrendAmountData : terminalSalesTrendData}
                      unit={curTerminalSalesTrendType == 'amount' ? '¥' : ''}/>
                    : noDataPlaceholder()
                  }
                </div>
              </div>
            </Spin>
          </div>
          {/* 各终端销售变化趋势-end */}

          {/* 各终端销售占比-start */}
          <div className={`${stat.common_table_item}`} style={{ marginTop: 10 }}>
            <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
              <div className={`${global.flex_row_start_center}`}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('各终端销售占比')}`, 10, 0, 0)}
                <div style={{ marginLeft: 10 }}>
                  <Radio.Group size={'small'}
                               onChange={(e) => this.handleChangeAmountNumType(e, 'curTerminalSalesPercentType')}
                               defaultValue="amount">
                    <Radio.Button value="amount">{sldComLanguage('销售额')}</Radio.Button>
                    <Radio.Button value="sales">{sldComLanguage('订单量')}</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
              <SldStatDate idIndex={'_terminal_sales_percent'}
                           updateSelectDate={(date) => this.updateSelectDate(date, '_terminal_sales_percent')}/>
            </div>
            <Spin spinning={terminalSalesPercentLoading}>
              <div className={`${stat.table_main}`}>
                {<PieCircle
                  customGuideTitle={curTerminalSalesPercentType == 'amount' ? `${sldComLanguage('总销售额(元)')}` : `${sldComLanguage('总订单量')}`}
                  axisType={curTerminalSalesPercentType}
                  data={curTerminalSalesPercentType == 'amount' ? terminalSalesPercentAmountData :
                    terminalSalesPercentData}
                  tipTitle={curTerminalSalesPercentType == 'amount' ? `${sldComLanguage('各终端销售额占比')}` : `${sldComLanguage('各终端订单量占比')}`}
                />}
              </div>
            </Spin>
          </div>
          {/* 各终端销售占比-end */}

          {/* 交易报表-start */}
          <StatisticsReportTrade/>
          {/* 交易报表-end */}
        </div>
      </Fragment>
    );
  }
}
