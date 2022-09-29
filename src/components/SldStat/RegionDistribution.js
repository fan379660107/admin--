import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Radio } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import Map from '@/components/SldStatBizcharts/Map';

@connect(({ common }) => ({
  common,
}))
@Form.create()

export default class RegionDistribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionDistributionInitLoading: false,//地域分布模块加载状态
      regionDistributioData: [],//地域分布数据
      regionDistributioType: 'member',
    };
  }

  componentDidMount() {
    this.getRegionDistribution('member');
  }

  //获取地域分布的数据 type 类型 'member'为会员，'store'为店铺
  getRegionDistribution = (type) => {
    this.setState({ regionDistributionInitLoading: true });
    const { dispatch } = this.props;
    let regionDistributioData = [];
    let dis_type = 'common/get_member_region_distribution';
    if (type == 'store') {
      dis_type = 'common/get_store_region_distribution';
    }
    dispatch({
      type: dis_type,
      callback: (res) => {
        this.setState({ regionDistributionInitLoading: false });
        if (res.state == 200) {
          if (res.data.length > 0) {
            for (let i in res.data) {
              regionDistributioData.push({
                name: res.data[i].provinceName,
                value: type == 'store' ? res.data[i].storeNum : res.data[i].memberNum,
              });
            }
          }
          this.setState({
            regionDistributioData,
          });
        }
      },
    });
  };

  //地域分布 会员、店铺的切换
  handleChangeRegionDistributionType = (type) => {
    this.setState({ regionDistributioType: type.target.value });
    this.getRegionDistribution(type.target.value);
  };

  render() {
    const { regionDistributionInitLoading, regionDistributioData, regionDistributioType } = this.state;
    return (
      <div className={`${stat.visualized_item}`}>
        <div className={`${stat.top_info_operate} ${global.flex_row_start_center}`}>
          <div className={`${stat.left_label}`}>
            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('地域分布')}`, 10, 0, 0)}
          </div>
          <div style={{ marginLeft: 20 }}>
            <Radio.Group size={'small'} onChange={(e) => this.handleChangeRegionDistributionType(e)}
                         defaultValue="member">
              <Radio.Button value="member">{sldComLanguage('会员')}</Radio.Button>
              <Radio.Button value="store">{sldComLanguage('店铺')}</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <Spin spinning={regionDistributionInitLoading}>
          <div className={`${stat.main_area}`}>
            <Map data={regionDistributioData} type={regionDistributioType}/>
          </div>
        </Spin>
      </div>
    );
  }
}
