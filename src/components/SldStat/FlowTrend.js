import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin, } from 'antd';
import {sldLlineRtextAddGoodsAddMargin,sldComLanguage,noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldStatDate from '@/components/SldStatDate';
import LineArea from '@/components/SldStatBizcharts/LineArea';

@connect(({ common }) => ({
  common
}))
@Form.create()

export default class FlowTrend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flowTrendInitLoading: false,//流量趋势模块加载状态
      flowTrendParams:{
        startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
        endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
      },//流量趋势的筛选条件
      flowTrendData:[],//流量趋势数据=
    };
  }

  componentDidMount() {
    this.getFlowTrend();
  }

  //获取流量趋势的数据
  getFlowTrend = () => {
    this.setState({ flowTrendInitLoading: true });
    const { dispatch } = this.props;
    let { flowTrendParams } = this.state;
    let flowTrendData = [];
    dispatch({
      type: 'common/get_flow_trend',
      payload: flowTrendParams,
      callback: (res) => {
        this.setState({ flowTrendInitLoading: false });
        if (res.state == 200) {
          let data = res.data;
          for(let i in data.visitorNumList){
            flowTrendData.push({
              month:data.visitorNumList[i].statsTime,
              city:`${sldComLanguage('访客数')}`,
              temperature:data.visitorNumList[i].visitorNum,
            })
            flowTrendData.push({
              month:data.viewNumList[i].statsTime,
              city:`${sldComLanguage('访问量')}`,
              temperature:data.viewNumList[i].viewNum,
            })
          }
          this.setState({
            flowTrendData,
          });
        }
      },
    });
  }

  //时间筛选器返回的时间数据
  updateSelectDate = (date,index) => {
    let {flowTrendParams} = this.state;
    let _this = this;
    if(index == '_flow_trend'){
      //流量趋势的时间筛选
      flowTrendParams = {...flowTrendParams,...date}
      this.setState({flowTrendParams},()=>{
        _this.getFlowTrend()
      })
    }
  }

  render() {
    const { flowTrendInitLoading, flowTrendData, } = this.state;
    return (
      <div className={`${stat.visualized_item}`}>
        <div className={`${stat.top_info_operate} ${global.flex_com_space_between}`}>
          <div className={`${stat.left_label}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('流量趋势')}`, 10, 0, 0)}
          </div>
          <SldStatDate idIndex={'_flow_trend'} updateSelectDate={(date)=>this.updateSelectDate(date,'_flow_trend')}/>
        </div>
        <Spin spinning={flowTrendInitLoading}>
          <div className={`${stat.main_area}`}>
            {flowTrendData.length>0
              ?<LineArea data={flowTrendData}/>
              :noDataPlaceholder()
            }
          </div>
        </Spin>
      </div>
    );
  }
}
