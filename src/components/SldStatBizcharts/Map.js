/*
* 封装的地图统计图
* @zjf-2021-06-30
* */
import React, { Component } from 'react';
import global from '@/global.less';
import DataSet from '@antv/data-set';
import {
  Chart,
  Geom,
  Tooltip,
  Legend,
  getTheme,
} from 'bizcharts';

const MAP_URL = 'https://gw.alipayobjects.com/os/basement_prod/a502afb5-d979-443c-9c40-92c0bc297dc9.json';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area_data: props.data,//从接口获取的数据
      scale: {
        latitude: {
          sync: true,
          nice: false,
        },
        longitude: {
          sync: true,
          nice: false,
        },
        value: {
          formatter: (val)=>{return val.toString().indexOf('.')!=-1? '':val}
        },
      },
      areaData: '',
      chinaGeo: '',
      chartsProxyData:{
        width:600,
        height:500
      }
    };
  }

  componentDidMount() {
    fetch(MAP_URL).then(v => v.json()).then((v) => {
      this.setState({ chinaGeo: v }, () => {
        this.initData();
      });
    });
    let resizeTimer;
    this.calcChartsProxyData();
    window.addEventListener('resize',()=>{
      clearTimeout(resizeTimer)
      resizeTimer=setTimeout(()=>{
        this.calcChartsProxyData()
      },100)
    })
  }
  calcChartsProxyData=()=>{
    const {chartsProxyData} = this.state;
    if(!(document.querySelector('.map_charts') && document.querySelector('.map_charts').clientWidth)){
      return;
    }
    if(document.querySelector('.map_charts').clientWidth!=undefined&&document.querySelector('.map_charts').clientWidth>600){
      chartsProxyData.width=600;
    }else{
      chartsProxyData.width=document.querySelector('.map_charts').clientWidth;
    }
    chartsProxyData.height=chartsProxyData.width*500/600;
    this.setState({chartsProxyData})
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
      const { chinaGeo } = this.state;
      this.setState({ area_data: nextProps.data }, () => {
        if (chinaGeo) {
          this.initData();
        }
      });
    }
  }

  initData = () => {
    const { chinaGeo, area, area_data } = this.state;
    let data = this.processGeoData(chinaGeo, area_data);
    this.setState({
      areaData: data,
    });
  };

  processGeoData = (geoData, dataValue) => {
    let { features } = geoData;
    features.forEach((one) => {
      const name = one && one.properties && one.properties.name;
      one.value = 0;
      dataValue.forEach((item) => {
        if (name.includes(item.name)) {
          one.value = item.value;
        }
      });
    });
    const geoDv = new DataSet.View().source(geoData, { type: 'GeoJSON' });
    return geoDv;
  };

  render() {
    const { scale, areaData,chartsProxyData } = this.state;
    const {type} = this.props;
    return (
      <Chart className='map_charts' width={chartsProxyData.width} height={chartsProxyData.height} scale={scale} data={areaData} padding={['10%', '8%', 0, '10%']}>
        <Geom
          type="polygon"
          position="longitude*latitude"
          style={{ lineWidth: 1, stroke: '#fff' }}
          color={['value', ['#e5ebfd', '#4f7efa']]}
          tooltip={[
            'name*value',
            (name, value) => ({
              name,
              value: `${type=='member'?'会员总数':'店铺总数'}：${value}`,
            }),
          ]}
          state={{
            selected: {
              style: (t) => {
                const res = getTheme().geometries.polygon.polygon.selected.style;
                return { ...res, fill: 'purple', stroke: '#ccc',lineWidth:1 }
              }
            }
          }}
        >
          <Tooltip showTitle={false}/>
          <Legend
            position="right-bottom"
            offsetY={-100}
            offsetX={-60}
            slidable={false}
            width={20}
            allowAllCanceled={true}
          />
        </Geom>
      </Chart>
    );
  }
}
