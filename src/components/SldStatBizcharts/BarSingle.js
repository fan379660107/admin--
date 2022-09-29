/*
* 封装的柱状图
* @zjf-2021-06-30
* data数据格式：[{
        name: 'London',
        key:'5/1',
        value:109,
      },{
        name: 'Berlin',
        key:'5/1',
        value:103,
      }]
* */
import React, { Component } from 'react';
import global from '@/global.less';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';

import DataSet from '@antv/data-set';

export default class StatisticsTrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dv: '',
      data: props.data,
      AxisType: 'number',
    };
  };

  componentDidMount() {
    this.initData(this.props.data);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let _this = this;
    if (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)) {
      this.setState({ data: JSON.parse(JSON.stringify(nextProps.data)) }, () => {
        _this.initData(nextProps.data);
      });
    }
  }

  initData = (data) => {
    if (data.length > 0 && data[0].value && (data[0].value).toString().indexOf('%') != -1) {
      this.setState({
        AxisType: 'percent',
      });
    }
    const { DataView } = DataSet;
    let dv = new DataView();
    if (data.length > 0) {
      dv.source(data).transform({
        type: 'map',
        callback(row) { // 加工数据后返回新的一行，默认返回行数据本身
          row['月份'] = ' ' + row['key'];
          row['月均降雨量'] = parseFloat(row['value']) || 0;
          return row;
        },
      });
    } else {
      dv = '';
    }
    this.setState({
      dv,
    });
  };

  render() {
    const { dv, AxisType } = this.state;
    const scale = {
      day: {
        type: 'cat',
      },
    };
    const { color, unit, showTip } = this.props;
    let showUnit = unit != undefined && unit ? unit : '';
    let showTooltip = showTip != undefined && showTip ? showTip : '';
    return (
      dv && <Chart padding={[80, 64, 56, 64]} height={400} data={dv} forceFit scale={scale}>
        <Axis line={{ stroke: 'rgba(119, 119, 119, .8)' }} name="月份"/>
        <Axis label={{
          formatter: val => `${val}${AxisType === 'percent' ? '%' : ''}`,
        }} line={{ stroke: 'rgba(119, 119, 119, .5)' }} name="月均降雨量"/>
        <Legend position='top' offsetY={-30} allowAllCanceled={true}/>
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
          htmlContent={(title, items) => {
            let showName = items[0].point != undefined && items[0].point._origin != undefined && items[0].point._origin.name ? items[0].point._origin.name : items[0].name;
            return `<div class="g2_tooltip_custom" style='position:absolute;'>
<div class="g2-tooltip-title">${title} </div>
<ul>
${items.map((item) => (
              `<li className='${global.flex_row_start_center}'>
                <i style="background-color: ${item['point']['color'].split('1:')[1]};"></i>
                <span style='margin-right: 5px;'>${showName}:</span>
                ${showUnit}${item.value}</li>`
            )).join('')}
</ul>
</div>`;
          }}
        />
        <Geom
          type="interval"
          position="月份*月均降雨量"
          color={color[1]}
          adjust={[
            {
              type: 'dodge',
              marginRatio: 0,
            },
          ]}
        />
      </Chart>
    );
  }
}
