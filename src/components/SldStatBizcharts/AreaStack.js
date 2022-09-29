/*
* 封装的面积层叠图
* @zjf-2021-07-31
* */
import React, { Component } from 'react';
import { Area } from '@ant-design/charts';

export default class AreaStack extends Component {
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

    const { color, unit } = this.props;
    let showUnit = unit != undefined && unit ? unit : '';
    return (
      <Area data={data}
            xField={'month'}
            yField={'temperature'}
            seriesField={'city'}
            colorField={'type'}
            color={color ? color : ['rgba(2, 137, 255, 1)', 'rgba(236, 140, 100, 1)', 'rgba(62, 207, 250, 1)', 'rgba(138, 125, 250, 1)', 'rgba(124, 140, 168, 1)', 'rgba(248, 201, 78, 1)', 'rgba(30, 135, 240, 1)', 'rgba(224, 224, 224, 1)', 'rgba(246, 91, 91, 1)', 'rgba(38, 172, 106, 1)']}
            areaStyle={{ fillOpacity: 0.4 }}
            smooth={true}
            legend={
              {
                position: 'top',
                marker: { symbol: 'diamond', style: { opacity: 1, color: 'red', background: 'blue' } },
                itemHeight: 60,
                background: 'green',
              }
            }
            tooltip={
              {
                customItems: (originalItems) => {
                  originalItems.map(item => (item.value = (showUnit ? '¥' : '') + item.value));
                  return originalItems;
                },
                domStyles: {
                  'g2-tooltip': { background: 'rgba(0,0,0,.9)' },
                  'g2-tooltip-name': { color: '#fff' },
                  'g2-tooltip-value': { color: '#fff' },
                  'g2-tooltip-title': { color: '#fff' },
                },
              }
            }/>
    );
  }
}
