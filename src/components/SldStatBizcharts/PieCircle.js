/*
* 封装的饼状环形图
* @zjf-2021-06-30
* */
import React, { Component, Fragment } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  Guide
} from "bizcharts";
import {noDataPlaceholder,formatNumPieCircle} from '@/utils/utils';
import DataSet from "@antv/data-set";
import global from '@/global.less';

export default class PieCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmpty:false,
      dv:'',
      pieData: props.data,
      cols :{
        percent: {
          formatter: val => {
            val = (val * 100).toFixed(2) + "%";
            return val;
          }
        }
      },
      axisType:props.axisType==='amount'? props.axisType:'number',
      customGuideTitle:props.customGuideTitle
    }
  };

  componentDidMount() {
    this.initData();
    setTimeout(()=>{
      this.setState({showEmpty:true})
    },3000)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let _this = this;
    if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
      this.setState({ pieData: nextProps.data,axisType:nextProps.axisType,customGuideTitle:nextProps.customGuideTitle }, () => {
        _this.initData();
      });
    }
  }

  initData = () => {
    let { pieData, } = this.state;
    const { DataView } = DataSet;
    let dv = new DataView();
    if (pieData.length > 0) {
      dv.source(pieData).transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent',
      });
    } else {
      dv = '';
    }

    this.setState({
      dv,
    });
  };
  //数据求和
  sumValue = (array)=>{
    if(!array){
      return;
    }
    let tempSum=0;
    array.forEach(item=>{
      tempSum+=item.count;
    })
    //数据格式化
    tempSum = formatNumPieCircle(tempSum,this.state.axisType == 'amount'?2:0)
    return tempSum;
  }

  render() {
    const { cols,dv,axisType,customGuideTitle,showEmpty } = this.state;
    const {tipTitle} = this.props;
    const {Html}=Guide;
    return (
      <Fragment>
        {dv? <Chart
          data={dv}
          scale={cols}
          padding={[80, 100, 80, 80]}
          forceFit
          height={450}
        >
          <Coord type={"theta"} radius={0.75} innerRadius={0.75} />
          <Axis name="percent" />
          <Guide>
            <Html
              position={["50%", "50%"]}
              html={`<div style="color:#646566;font-size:1em;text-align: center;width: 10em;fontFamily:'-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Roboto,Arial,PingFang SC,Hiragino Sans GB,Microsoft Yahei,SimSun,sans-serif'">${customGuideTitle || 'Total'}<br><span style="color:#262626;font-size:2em;display: inline-block;margin-top: .4em;">${this.sumValue(dv.rows)}</span></div>`}
              alignX="middle"
              alignY="middle"
            />
          </Guide>
          <Tooltip
            showTitle={false}
            htmlContent={(title, items) => {
              return `<div class="g2_tooltip_custom" style='position:absolute;height: auto;background-color: black;z-index:8;opacity: 0.9'><div class="g2-tooltip-title">${tipTitle || '提示'}</div><ul><li className='${global.flex_row_start_center}'><i style="background-color: ${items[0]['color']};"></i><span style='margin-right: 5px;'>${items[0].point._origin.item}:</span>${axisType==='amount'? '￥':''}${items[0].point._origin.count}&nbsp;&nbsp;&nbsp;${parseFloat(items[0].point._origin.percent*100).toFixed(2)}%</li></ul></div>`;
            }}
          />

          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              "item*percent",
              (item, percent) => {
                percent = percent * 100 + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ": " + val;
              }}
            />
          </Geom>
        </Chart>:(showEmpty?noDataPlaceholder():' ')}
      </Fragment>
    );
  }
}
