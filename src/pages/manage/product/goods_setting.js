import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import { sld_config_save_btn,sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import SldComHeader from '@/components/SldComHeader';


let sthis = '';
@connect(({ common }) => ({
  common,
}))
@Form.create()
export default class GoodsSetting extends Component {
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

  allowUpdateRequestFlag = true;//立即更新商品数据的允许请求标识

  componentDidMount() {
    this.get_setting();
  }

  componentWillUnmount() {

  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { info_data } = this.state;
    let str_info = 'goods_publish_need_audit,goods_sort_weight_sale,goods_sort_weight_view';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: (res) => {
        if (res.state == 200) {
          res.data.map(item => {
            if(item.name == 'goods_publish_need_audit'){
              info_data.push({
                type: 'switch',
                label: item.title,
                extra: item.description,
                name: item.name,
                placeholder: '',
                initialValue: item.value,
              });
            }else{
              info_data.push({
                type: 'inputnum',
                label: item.title,
                extra: item.description,
                name: item.name,
                placeholder: '',
                min:0,
                max:100,
                initialValue: item.value,
              });
            }
          });
          if (info_data.length > 0) {
            info_data.push(sld_config_save_btn);
          }
        }
        this.setState({ info_data, flag: 1 });
      },
    });
  };

  //保存事件
  handleSubmit = (values) => {
    this.setState({ submitting: true });
    const { dispatch } = this.props;
    values.goods_publish_need_audit = values.goods_publish_need_audit ? 1 : 0;
    dispatch({
      type: 'common/saveSetting',
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

  //立即更新商品数据
  updateGoods = () => {
    if(!this.allowUpdateRequestFlag)return;//上一次请求还没有结束，不继续请求
    this.allowUpdateRequestFlag = false;
    const { dispatch } = this.props;
    dispatch({
      type: 'common/updateEsGoods',
      callback: (res) => {
        this.allowUpdateRequestFlag = true;
        if (res.state == 200) {
          sucTip(res.msg);
        } else {
          failTip(res.msg);
        }
      },
    });
  }

  render() {
    const { info_data, submitting, initLoading, flag } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
        <SldComHeader
            type={2}
            title={`${sldComLanguage('商品设置')}`}
            tip_title={''}
            tip_data={sld_need_update_setting()}
          />
          {flag == 1 &&
          <SldTableEdit
            submiting={submitting}
            width={1000}
            data={info_data}
            handleSubmit={this.handleSubmit}
            showOtherBtn={{
              text:`${sldComLanguage('立即更新商品数据')}`,
              callback:this.updateGoods,
            }}
          />
          }
        </div>
      </Spin>
    );
  }
}
