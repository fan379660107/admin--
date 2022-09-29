/*
* 封装的柱状图
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

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:props.data||[],
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
      this.setState({data:nextProps.data,})
    }
  }

  render() {
    const {data} = this.state;
    const scale = {
      type:'linear',
      temperature: {
        minTickInterval:1
      },
      month: {
        tickCount:9,
      }
    };
    return (
      <Chart style={{ marginTop: '27px', marginLeft: '-29px' }} height={498} data={data} padding={[70,70,70,100]} scale={scale} forceFit>
        <Legend forceFit={true} marker = {{
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
        }} offsetY={-20} padding={[0]} position='top-center' allowAllCanceled={true}/>
        <Axis line={{stroke:'rgba(153, 153, 153, .3)'}} name="month"/>
        <Axis
          line={{stroke:'rgba(153, 153, 153, .3)'}}
          name="temperature"
          label={{
            formatter: val => `${val}`,
          }}
        />
        <Tooltip
          g2-tooltip={{
            boxShadow: 'none',
            color: '#fff',
            backgroundColor: '#222',
          }}
          crosshairs={{
            type: 'y',
          }}
          style={{
            color: 'red',
          }}
        />
        <Geom
          type="interval"
          position="month*temperature"
          size={0}
          shape={'smooth'}
          color={['city', 'rgba(87, 131, 255, 1)-rgba(30, 135, 240, 1)']}
          style={{
            stroke: 'rgba(0,0,0,0)',
            lineWidth: 0,
          }}
        />
        <Geom
          type="interval"
          position="month*temperature"
          tooltip={false}
          size={50}
          shape={'smooth'}
          color={['city', ['l(90) 0:rgba(87, 131, 255, 1) 0.5:rgba(87, 131, 255, 0.6) 1:rgba(173, 197, 255, 0.69)', 'l(90) 0:rgba(30, 135, 240, 0.38)) 0.5:rgba(30, 135, 240, 0.18) 1:rgba(30, 135, 240, 0)']]}
          // color={'city'}
          style={{
            stroke: 'rgba(0,0,0,0)',
            lineWidth: 100,
          }}
        />
      </Chart>
    );
  }
}
