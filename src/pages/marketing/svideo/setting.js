import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
  sldLlineRtextAddGoodsAddMargin,
  getSldEmptyH,
} from '@/utils/utils';
import { sld_config_save_btn } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';

let sthis = '';
@connect(({ svideo, videoCommon }) => ({
  svideo, videoCommon,
}))
@Form.create()
export default class SvideoSetting extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      flag: 0,
      submitting: false,//提交按钮加载状态
      initLoading: false,//页面初始化加载状态
      info_data: [],
    };
  }

  componentDidMount() {
    this.get_setting();
  }

  componentWillUnmount() {

  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    this.setState({initLoading:true})
    dispatch({
      type: 'svideo/get_svideo_setting',
      callback: (res) => {
        if (res.state == 200) {
          info_data = [];
          for (let i in res.data) {
            if (res.data[i].type == 1) {
              info_data.push({
                type: 'inputnum',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                min: 0,
                max: 1000,
                placeholder: '',
                initialValue: res.data[i].value,
              });
            } else if (res.data[i].type == 4) {
              info_data.push({
                type: 'switch',
                label: res.data[i].title,
                extra: res.data[i].description,
                name: res.data[i].name,
                placeholder: '',
                initialValue: res.data[i].value,
              });
            }
          }
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
          this.setState({ info_data, flag: 1 });
        } else {
          failTip(res.msg);
        }
        this.setState({initLoading:false})
      },
    });
  };

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    values.video_switch = values.video_switch ? 1 : 0;
    values.video_audit_switch = values.video_audit_switch ? 1 : 0;
    values.member_review_switch = values.member_review_switch ? 1 : 0;
    values.member_bind_goods = values.member_bind_goods ? 1 : 0;
    dispatch({
      type: 'videoCommon/saveSetting',
      payload: values,
      callback: (res) => {
        this.setState({ submitting: false });
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  render() {
    const { info_data, submitting, initLoading, flag } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('短视频设置')}`, 0)}
        {getSldEmptyH(10)}
        <Spin spinning={initLoading}>
          {flag == 1 &&
          <SldTableEdit
            submiting={submitting}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
          />
          }
        </Spin>
      </div>
    );
  }
}
