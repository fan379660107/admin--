//商品品类报表模块
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Tabs } from 'antd';
import {
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  sldIconBtnBg,
  failTip,
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportGoodsCategoryByDay from './goods_category_by_day';
import StatisticsReportGoodsCategoryByCategory from './goods_category_by_category';

const TabPane = Tabs.TabPane;
@connect(({ statistics }) => ({
  statistics,
}))
@Form.create()

export default class StatisticsReportGoodsBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      export_params: {
        day: {
          startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        }, category: {
          startTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 00:00:00'),
          endTime: (moment().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59:999'),
        },
      },//导出的筛选条件
      active_key: 'day',//当前tab
    };
  };

  componentDidMount() {
  }

  handleSldExcel = () => {
    const { export_params, active_key } = this.state;
    let paramData = {
      ...export_params[active_key],
    };
    paramData.fileName = `${sldComLanguage('商品品类报表导出')}`;
    const { dispatch } = this.props;
    this.setState({ initLoading: true });
    let dis_type = 'statistics/export_goods_category_report_by_day';
    if (active_key == 'category') {
      dis_type = 'statistics/export_goods_category_report_by_category';
    }
    dispatch({
      type: dis_type,
      payload: paramData,
      callback: (res) => {
        if (res.state != undefined && res.state == 255) {
          failTip(res.msg);
        }
        this.setState({ initLoading: false });
      },
    });
  };

  onHandleTabClick = (e) => {
    this.setState({ active_key: e });
  };

  //更新导出的参数
  updateExportParam = (params, type) => {
    let { export_params } = this.state;
    export_params[type] = { ...export_params[type], ...params };
    this.setState({ export_params });
  };

  render() {
    return (
      <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
        <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('品类销售报表')}`, 10, 0, 0)}
          {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
        </div>
        <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, marginTop: 10 }}>
          <Tabs type="card" defaultActiveKey="day" animated={false} onTabClick={this.onHandleTabClick}>
            <TabPane tab={`${sldComLanguage('按天')}`} key="day">
              <StatisticsReportGoodsCategoryByDay updateExportParam={(e) => this.updateExportParam(e, 'day')}/>
            </TabPane>
            <TabPane tab={`${sldComLanguage('按品类')}`} key="category">
              <StatisticsReportGoodsCategoryByCategory
                updateExportParam={(e) => this.updateExportParam(e, 'category')}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
