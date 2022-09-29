import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio, Modal, Empty } from 'antd';
import {
  failTip,
  list_com_page_more,
  sldComLanguage,
  getSldEmptyH,
  sldTsvg,
} from '@/utils/utils';
import global from '@/global.less';
import Search from '@/components/Search/Search';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../pcdecorate.less';
import Adv_01 from './adv_01';
import Adv_02 from './adv_02';
import Adv_04 from './adv_04';
import Adv_05 from './adv_05';
import Adv_06 from './adv_06';
import Adv_07 from './adv_07';
import Adv_08 from './adv_08';
import Adv_09 from './adv_09';
import Adv_10 from './adv_10';
import Adv_11 from './adv_11';
import Adv_12 from './adv_12';
import Adv_13 from './adv_13';
import Adv_19 from './adv_19';
import Adv_20 from './adv_20';
import Adv_21 from './adv_21';
import MainBanner from './main_banner';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let pageSize = list_com_page_more;
let sthis = '';
@connect(({ pc_home, global }) => ({
  pc_home, global,
}))
@Form.create()
export default class SelInstanceTemplateLists extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      tplType:'',//实例化模板类型
      curSelectInstanceTplId: '',//当前选中的实例化模板id
      filter_code: '',//筛选器当前选中项
      formValues: {},//搜索条件
      loading: false,
      data: { list: [] },
      modalVisible: false,
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('实例化名称')}`,
        name: 'name',
        placeholder: `${sldComLanguage('实例化名称')}`,
      }],//搜索数据
    };
  }

  filter_data = [
    { filter_code: '', filter_name: `${sldComLanguage('全部')}` },
    { filter_code: 'adv_floor', filter_name: `${sldComLanguage('广告楼层')}` },
    { filter_code: 'goods_floor', filter_name: `${sldComLanguage('商品楼层')}` },
  ];//订单过滤器

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      tplType:nextProps.type=='floor'?'banner_except':nextProps.type
    },()=>{
      this.get_list({ pageSize: pageSize });
    })
  }

  componentWillUnmount() {
  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch,tplPcId } = this.props;
    const {tplType} = this.state;
    let search_param = { tplType:tplType,...params, isEnable: 1 };
    if(tplPcId){
      search_param.tplId = tplPcId;
    }
    dispatch({
      type: 'pc_home/get_tpl_instance_list',
      payload: search_param,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_list(params);
          } else {
            this.setState({
              data: res.data,
            });
          }
        }
      },
    });
  };

  //条件过滤器
  clickFilter = (e) => {
    //搜索条件置为空
    this.setState({
      filter_code: e.target.value,
    });
    const { formValues } = this.state;
    let param = { pageSize: pageSize, current: 1 };
    if (e.target.value) {
      param.tplType = e.target.value;
    }
    this.get_list({ ...param, ...formValues });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
    this.setState({
      formValues: values,
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize, ...values });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize });
  };

  selectInstanceTpl = (val) => {
    this.setState({ curSelectInstanceTpl: val });
  };

  //取消或者关闭事件
  sldCancle = () => {
    this.setState({ curSelectInstanceTpl: '',filter_code: '', });//重置选中模板
    this.props.calcleSelInstanceModal();
  };

  sldConfirm = () => {
    let { curSelectInstanceTpl } = this.state;
    if (!curSelectInstanceTpl) {
      failTip(`${sldComLanguage('请先选择数据')}～`);
      return;
    } else {
      this.props.confirmSelInstanceModal(curSelectInstanceTpl);
      this.sldCancle();
    }
  };

  render() {
    const { data, loading, search_data, filter_code, curSelectInstanceTpl } = this.state;
    const { visible, width, type,tplPcId } = this.props;
    let itemW = (width - 40) / 2;
    return (
      <Modal destroyOnClose={true}
             onOk={this.sldConfirm}
             afterClose={this.sldCancle}
             onCancel={this.sldCancle}
             visible={visible}
             width={width}
             title={this.props.title}>
        <div className={global.common_page}>
          <Spin spinning={loading}>
            <div className={global.tableListForm} ref={'search_part'}>
              <Search search_data={search_data}
                      seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
            </div>
            {/*筛选器-start*/}
            {type == 'floor'&&tplPcId == 0&&
            <div style={{ marginBottom: 10 }}>
              <RadioGroup value={filter_code} size="small" onChange={this.clickFilter}>
                {this.filter_data.map((item, index) => {
                  return <RadioButton key={index + 1}
                                      value={item.filter_code}>{item.filter_name}</RadioButton>;
                })}
              </RadioGroup>
            </div>
            }
            {/*筛选器-end*/}
            {/*模板展示-start*/}
              {data.list.length>0
                ?<Scrollbars autoHeight
                             autoHeightMax={document.body.clientHeight - 350}>
                  <div style={{ columnWidth: itemW }}>
                    {data.list.map((item, index) => {
                      if (item.json == null && !item.json) {
                        return null;
                      }
                      let data_json = typeof (item.json) == 'string' ? JSON.parse(item.json.replace(/&quot;/g,"\"")) : item.json;
                      return <div key={index} className={global.web_tpl_list_item} style={{
                        width: itemW, height: '100%', overflow: 'auto',
                      }}>
                        <div className={`${global.operation} ${global.flex_row_between_center}`}>
                          <span className={global.tpl_name}>{item.name}</span>
                          <div className={`${global.flex_row_end_center}`}>
                            <div className={global.opt_icon} onClick={() => this.selectInstanceTpl(item)}>
                              {sldTsvg(`${curSelectInstanceTpl && curSelectInstanceTpl.dataId == item.dataId ? 'xuanzhong3' : 'ziyuan43'}`, '#ff7e28', 16, 16)}
                            </div>
                          </div>
                        </div>
                        <div style={{ width: '100%', zoom: itemW / 1210 }}>
                          {data_json.type == 'adv_01' &&
                          <Adv_01 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_02' &&
                          <Adv_02 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_04' &&
                          <Adv_04 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_05' &&
                          <Adv_05 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_06' &&
                          <Adv_06 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_07' &&
                          <Adv_07 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_08' &&
                          <Adv_08 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_09' &&
                          <Adv_09 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_10' &&
                          <Adv_10 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_11' &&
                          <Adv_11 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_12' &&
                          <Adv_12 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_13' &&
                          <Adv_13 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_19' &&
                          <Adv_19 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_20' &&
                          <Adv_20 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'adv_21' &&
                          <Adv_21 tpl_info={data_json}
                                  save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                          {data_json.type == 'main_banner' &&
                          <MainBanner tpl_info={data_json}
                                      save_tpl_data={(val, html) => this.save_tpl_data(val, html, index)}/>
                          }
                        </div>
                      </div>;
                    })}
                  </div>
                  {getSldEmptyH(20)}
                </Scrollbars>
                :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%',marginTop:50,marginBottom:70}}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('暂无数据')}`}/>
                </div>
              }
            {/*模板展示-end*/}
          </Spin>
        </div>
      </Modal>
    );
  }
}
