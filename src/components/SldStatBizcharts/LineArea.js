/*
* 封装的折线面积图
* @zjf-2021-06-30
* */
import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';

export default class LineArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)) {
      this.setState({ data: nextProps.data });
    }
  }

  render() {
    const { data } = this.state;
    const scale = {
      type: 'linear',
      temperature: {
        minTickInterval: 1,
      },
      month: {},
    };
    const { lineColor, areaColor, unit } = this.props;
    let showUnit = unit != undefined && unit ? unit : '';
    return (
      <Chart style={{ marginTop: '27px', marginLeft: '-29px' }} height={498} data={data} padding={[70, 70, 100, 100]}
             scale={scale} forceFit>
        <Legend
          forceFit={true}
          marker={{
            symbol: (x, y, radius) => {
              const r = radius / 2;
              return [
                ['M', x - 3 * r, y],
                ['L', x + 3 * r, y],
                ['M', x - r, y],
                ['A', r, r, 0, 0, 0, x + r, y],
                ['A', r, r, 0, 0, 0, x - r, y],
              ];
            },
          }}
          offsetY={-20}
          padding={[0]}
          position='top-center'
          allowAllCanceled={true}
        />
        <Axis label={{
          formatter: val => {
            return (val.toString().indexOf('-') == -1 ? `${(parseFloat(val) % 3 === 0 ? val : '')}` : val);
          },
        }} line={{ stroke: 'rgba(153, 153, 153, .3)' }} name="month"/>
        <Axis
          line={{ stroke: 'rgba(153, 153, 153, .3)' }}
          name="temperature"
          label={{
            formatter: val => `${val}`,
          }}
        />
        <Tooltip
          crosshairs={{
            type: 'y',
          }}
          htmlContent={(title, items) => {
            return `<div class="g2_tooltip_custom" style='position:absolute;'>
<div class="g2-tooltip-title">${title} </div>
<ul>
${items.map((item) => (
              `<li className='${global.flex_row_start_center}'>
                <i style="background-color: ${item['point']['color']};"></i>
                <span style='margin-right: 5px;' title={item.name}>${item.name.toString().length > 20 ? (item.name.substring(0, 20) + '...') : item.name}:</span>&nbsp;
                ${showUnit || (this.props.extra != undefined && this.props.extra && (item.name == this.props.showUnitKey) ? '¥' : '')}${item.value}</li>`
            )).join('')}
</ul>
</div>`;
          }}
        />
        <Geom
          type="line"
          position="month*temperature"
          size={1.5}
          shape={'smooth'}
          color={lineColor != undefined ? lineColor : ['city', 'rgba(33, 195, 188, 1)-rgba(30, 135, 240, 1)']}
          style={{
            stroke: 'rgba(0,0,0,0)',
            lineWidth: 0,
          }}
        />
        <Geom
          type="area"
          position="month*temperature"
          tooltip={false}
          size={4}
          shape={'smooth'}
          color={areaColor != undefined ? areaColor : ['city', ['l(90) 0:rgba(33, 195, 188, 0.38) 0.5:rgba(33, 195, 188, 0.18) 1:rgba(33, 195, 188, 0)', 'l(90) 0:rgba(30, 135, 240, 0.38)) 0.5:rgba(30, 135, 240, 0.18) 1:rgba(30, 135, 240, 0)']]}
          style={{
            stroke: 'rgba(0,0,0,0)',
            lineWidth: 0,
          }}
        />
      </Chart>
    );
  }
}
