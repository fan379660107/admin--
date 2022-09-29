import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import SldStatDate from '@/components/SldStatDate';
import stat from '@/assets/css/stat.less';
import LineArea from '@/components/SldStatBizcharts/LineArea';

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class NewTrend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTrendInitLoading: false,//会员/店铺新增趋势模块加载状态
      newTrendParams: {
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//会员/店铺新增趋势的筛选条
      newTrendData: [],//会员/店铺新增趋势数据
    };
  }

  componentDidMount() {
    this.getNewTrend();
  }

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
    let { newTrendParams } = this.state;
    let _this = this;
    if (index == '_new_trend') {
      //会员/店铺新增趋势的时间筛选
      newTrendParams = { ...newTrendParams, ...date };
      this.setState({ newTrendParams }, () => {
        _this.getNewTrend();
      });
    }
  };

  //获取会员/店铺新增趋势的数据
  getNewTrend = () => {
    this.setState({ newTrendInitLoading: true });
    const { dispatch } = this.props;
    let { newTrendParams } = this.state;
    let newTrendData = [];
    dispatch({
      type: 'common/get_new_trend',
      payload: newTrendParams,
      callback: (res) => {
        this.setState({ newTrendInitLoading: false });
        if (res.state == 200) {
          let data = res.data;
          for (let i in data.memberList) {
            newTrendData.push({
              month: data.memberList[i].statsTime,
              city: `${sldComLanguage('新增会员数')}`,
              temperature: data.memberList[i].newMemberNum,
            });
            newTrendData.push({
              month: data.storeList[i].statsTime,
              city: `${sldComLanguage('新增店铺数')}`,
              temperature: data.storeList[i].newStoreNum,
            });
          }
          this.setState({
            newTrendData,
          });
        }
      },
    });
  };

  render() {
    const { newTrendInitLoading, newTrendData } = this.state;
    return (
      <div className={`${stat.visualized_item}`}>
        <div className={`${stat.top_info_operate} ${global.flex_com_space_between}`}>
          <div className={`${stat.left_label}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('会员/店铺新增趋势')}`, 10, 0, 0)}
          </div>
          <SldStatDate idIndex={'_new_trend'} updateSelectDate={(date) => this.updateSelectDate(date, '_new_trend')}/>
        </div>
        <Spin spinning={newTrendInitLoading}>
          <div className={`${stat.main_area}`}>
            {newTrendData.length>0
              ?<LineArea data={newTrendData}/>
              :noDataPlaceholder()
            }
          </div>
        </Spin>
      </div>
    );
  }
}
