import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch, Radio, Popconfirm, Empty } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_more,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  validatorNumbe,
  sldComLanguage,
  getSldEmptyH,
  quillEscapeToHtml,
} from '@/utils/utils';
import global from '@/global.less';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import router from 'umi/router';
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
export default class Instance_template_lists extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      screenW: document.body.clientWidth,//页面宽度
      filter_code: '',//筛选器当前选中项
      search_height: 0,
      formValues: {},//搜索条件
      submiting: false,//按钮loading
      loading: false,
      data: { list: [] },
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('实例化名称')}`,
        name: 'name',
        placeholder: `${sldComLanguage('实例化名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('使用状态')}`,
        name: 'isEnable',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('使用状态')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: '1', name: `${sldComLanguage('启用')}` },
          { key: '0', name: `${sldComLanguage('禁用')}` },
        ],
      }],//搜索数据
      addData: [{
        type: 'show_subtitle',
        color: '#ff7e28',
        name: `${sldComLanguage('基本信息')}`,
        distance: {
          left: 5,
          top: 5,
          right: 5,
          bottom: 10,
        },
      }, {
        type: 'input',
        label: `${sldComLanguage('实例化模板名称')}`,
        name: 'name',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('实例化模板名称')}`,
        initialValue: '',
        maxLength: 20,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('实例化模板名称')}`,
        }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,//排序
        name: 'sort',
        placeholder: `${sldComLanguage('请输入排序')}`,
        extra: `${sldComLanguage('请输入0~255的数字,数据越小显示越靠前')}`,
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入排序')}`,
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      },
      ],//modal框的数据
    };
  }

  sele_tpl_data = {
    type: 'sele_tpl_type',
    handleTabChange(val) {
      sthis.handleTabChange(val);
    },
    handle_sele_tpl(val) {
      sthis.handle_sele_tpl(val);
    },
    activeKey: '',//默认第一个模板分类
    sele_tpl_info: {},//选中的模板信息
    data_left: [],//模板分类列表
    data_right: [],//模板列表
  };//选择模板数据信息

  sele_tpl_title = {
    type: 'show_subtitle',
    color: '#ff7e28',
    name: `${sldComLanguage('选择模板')}`,
    distance: {
      left: 5,
      top: 10,
      right: 5,
      bottom: 10,
    },
  };//选择模板的标题

  filter_data = [
    { filter_code: '', filter_name: `${sldComLanguage('全部')}` },
    { filter_code: 'main_banner', filter_name: `${sldComLanguage('主轮播')}` },
    { filter_code: 'adv_floor', filter_name: `${sldComLanguage('广告楼层')}` },
    { filter_code: 'goods_floor', filter_name: `${sldComLanguage('商品楼层')}` },
  ];//订单过滤器

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_tpl_type_list();
    this.get_tpl_list('');
    this.resize();
    window.addEventListener('resize', this.resize);
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({ screenW: document.body.clientWidth });
  };

  //获取所有模板类型列表
  get_tpl_type_list = () => {
    const { dispatch } = this.props;
    let { search_data } = this.state;
    dispatch({
      type: 'pc_home/get_tpl_type_list',
      callback: (res) => {
        if (res.state == 200) {
          if (res.data.length != 0) {
            this.sele_tpl_data.data_left = res.data;
            this.sele_tpl_data.activeKey = res.data[0].type;
            this.get_tpl_list(res.data[0].type, 'first');
            for (let i in search_data) {
              if (search_data[i].name == 'tplType') {
                search_data[i].sel_data = res.data;
                break;
              }
            }
            this.setState({ search_data });
          }
        }
      },
    });
  };

  //根据模板类型获取该类型下的模板
  get_tpl_list = (tpl_type, type = '') => {
    const { dispatch } = this.props;
    let { addData, search_data } = this.state;
    let param = {};
    if (tpl_type) {
      param.type = tpl_type;
    }
    param.pageSize = list_com_page_more;
    dispatch({
      type: 'pc_home/get_tpl_list',
      payload: param,
      callback: (res) => {
        if (tpl_type == '') {
          //用于搜索
          for (let i in search_data) {
            if (search_data[i].name == 'tplId') {
              search_data[i].sel_data = res.data.list;
              break;
            }
          }
          this.setState({ search_data });
        }
        if (type == 'first') {
          if (res.state == 200) {
            this.sele_tpl_data.data_right = res.data.list;
          } else {
            this.sele_tpl_data.data_right = [];
          }
        } else {
          addData.map(item => {
            if (item.type == 'sele_tpl_type') {
              item.data_right = [];
              if (res.state == 200) {
                item.data_right = res.data.list;
              }
            }
          });
          this.setState({ addData });

        }

      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_tpl_instance_list',
      payload: params,
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

  //保存表格列的内容
  save_edit_filed = (record, filed, value) => {
    let { data } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/edit_instance_tpl',
      payload: { dataId: record.dataId, name: record.name, sort: record.sort },
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          let tmp = data.list.filter(item => item.dataId == record.dataId)[0];
          tmp[filed] = value;
          tmp.is_edit_name = false;
          tmp.is_edit_sort = false;
          this.setState({ data });
        } else {
          failTip(res.msg);
        }
      },
    });

  };

  //编辑表格列的内容
  edit_filed_con = (id, filed, value) => {
    let { data } = this.state;
    let tmp = data.list.filter(item => item.dataId == id)[0];
    tmp[filed] = value;
    this.setState({ data });
  };

  //编辑表格列内容
  edit_filed = (id, filed, flag) => {
    let { data } = this.state;
    let tmp = data.list.filter(item => item.dataId == id)[0];
    tmp[filed] = flag;
    this.setState({ data });
  };


  //装修模板切换
  handleTabChange = (val) => {
    let { addData } = this.state;
    addData.map((item) => {
      if (item.type == 'sele_tpl_type') {
        item.activeKey = val;
      }
    });
    this.setState({ addData });
    this.get_tpl_list(val);
  };

  //装修模板的选择
  handle_sele_tpl = (val) => {
    let { addData } = this.state;
    addData.map((item) => {
      if (item.type == 'sele_tpl_type') {
        item.sele_tpl_info = val;
      }
    });
    this.setState({ addData });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
    pageSize = params.pageSize;
    this.setState({
      params: params,
    });
    this.get_list(params);
  };

  //新增数据
  addData = () => {
    let { addData } = this.state;
    addData = addData.filter(item => item.type != 'sele_tpl_type' && item.name != `${sldComLanguage('选择模板')}`);
    addData.map(item => {
      if (item.type != 'show_subtitle') {
        item.initialValue = '';
      }
    });
    addData.push(this.sele_tpl_title);
    addData.push(this.sele_tpl_data);
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加')}${sldComLanguage('装修模板')}`,
      addData: addData,
    });
  };

  //实例化模板装修
  diyTpl = (val) => {
    //装修数据存缓存
    val.back_route = '/decorate_pc/instance_template_lists';
    let temp = {};
    for(let i in val){
      if(i != 'html'){
        if(i == 'json'){
          let target_json = JSON.parse(quillEscapeToHtml(val[i]));
          temp[i] = target_json;
        }else{
          temp[i] = val[i]
        }
      }
    }
    localStorage.setItem('pc_diy_tpl', JSON.stringify(temp));
    router.push('/decorate_pc/instance_template_lists_to_add');
  };

  //编辑数据
  editData = (val) => {
    let { addData } = this.state;
    addData = addData.filter(item => item.type != 'sele_tpl_type' && item.name != `${sldComLanguage('选择模板')}`);
    addData.map(item => {
      if (item.type != 'show_subtitle') {
        item.initialValue = val[item.name];
      }
    });
    //编辑装修模板基本信息
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑装修模板基本信息')}`,
      addData: addData,
      modalVisible: true,
      curData: val,
    });
  };

  sldHandleConfirm = (val) => {
    const { curData, type, addData } = this.state;
    const { dispatch } = this.props;
    if (type == 'edit') {
      val.dataId = curData.dataId;
      this.operateInstanceTpl(val, 'edit');
    } else {
      let sele_tpl_info = addData.filter(item => item.type == 'sele_tpl_type')[0].sele_tpl_info;
      val.html = sele_tpl_info.data;
      val.json = sele_tpl_info.defaultData;
      val.tplPcId = sele_tpl_info.tplPcId;
      if (val.tplPcId == undefined) {
        failTip(`${sldComLanguage('请选择模板')}`);
        return false;
      }
      this.setState({ submiting: true });
      dispatch({
        type: 'pc_home/add_instance_tpl',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              filter_code:'',
              modalVisible: false,
              params: { pageSize: pageSize },
            });
          } else {
            failTip(res.msg);
          }
          this.setState({ submiting: false });
        },
      });
    }
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
    let {filter_code} = this.state;
    for (let i in values) {
      if (values[i] == '') {
        delete values[i];
      }
    }
    this.setState({
      formValues: values,
      params: { pageSize: pageSize },
    });

    let search_param = { pageSize: pageSize, ...values };
    if(filter_code){
      search_param.tplType = filter_code;
    }
    this.get_list(search_param);
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      filter_code:'',
      formValues: {},
      params: { pageSize: pageSize },
    });
    this.get_list({ pageSize: pageSize });
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  //是否启用
  handleSetEnable = (val, id) => {
    this.operateInstanceTpl({ dataId: id, isEnable: val }, 'enable');
  };


  //实例化模板操作，edit 编辑，del 删除，enable 启用/禁用, diy 装修 copy 复制
  operateInstanceTpl = (id, type) => {
    const { dispatch } = this.props;
    let {formValues,filter_code} = this.state;
    let dis_type = '';
    let params = { dataId: id };
    if (type == 'add') {
      dis_type = 'pc_home/add_home_flash';
      params = id;
    } else if (type == 'edit') {
      dis_type = 'pc_home/edit_instance_tpl';
      params = id;
    } else if (type == 'del') {
      dis_type = 'pc_home/del_instance_tpl';
    } else if (type == 'copy') {
      dis_type = 'pc_home/copy_instance_tpl';
    } else if (type == 'enable') {
      dis_type = 'pc_home/enable_instance_tpl';
      params = id;
    }
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          let search_param = {...this.state.params,...formValues}
          if(filter_code){
            search_param.tplType = filter_code;
          }
          this.get_list(search_param);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  render() {
    const { modalVisible, title, addData, submiting, data, loading, type, search_data, filter_code, screenW } = this.state;
    let itemW = (screenW - (this.props.global.collapsed ? 80 : 150) - 40 - 20) / 2;
    return (
      <Spin spinning={loading}>
        <div className={global.common_page}>
          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('实例化装修模板管理')}`, 0, 0, 10)}
          <div className={global.tableListForm}>
            <Search search_data={search_data}
                    seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
          </div>
          {/*筛选器-start*/}
          <div style={{ marginBottom: 10 }}>
            <RadioGroup value={filter_code} size="small" onChange={this.clickFilter}>
              {this.filter_data.map((item, index) => {
                return <RadioButton key={index + 1}
                                    value={item.filter_code}>{item.filter_name}</RadioButton>;
              })}
            </RadioGroup>
          </div>
          {/*筛选器-end*/}
          {/*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addData(), `${sldComLanguage('添加装修模板')}`, 7, 7)}
          </div>
          {/*公共功能条-end*/}
          {/*模板展示-start*/}
          {data.list.length > 0
            ? <Scrollbars autoHeight
                          autoHeightMax={document.body.clientHeight - 240}>
              <div style={{ columnWidth: itemW }}>
                {
                  data.list.map((item, index) => {
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
                          <Switch size={'small'} checked={item.isEnable == 1 ? true : false}
                                  onChange={(val) => this.handleSetEnable(val, item.dataId)}/>
                          <img className={global.opt_icon} onClick={() => this.editData(item)}
                               src={require('@/assets/pc_diy_img/web_tpl_edit_icon.png')}/>
                          <img className={global.opt_icon} onClick={() => this.diyTpl(item)}
                               src={require('@/assets/pc_diy_img/web_tpl_diy_icon.png')}/>
                          <Popconfirm
                            placement={'leftBottom'}
                            title={`${sldComLanguage('删除后不可恢复，是否确定删除')}`}
                            onConfirm={() => this.operateInstanceTpl(item.dataId, 'del')}
                            okText={`${sldComLanguage('确定')}`}
                            cancelText={`${sldComLanguage('取消')}`}>
                            <img className={global.opt_icon} src={require('@/assets/pc_diy_img/web_ins_tpl_del_icon.png')}/>
                          </Popconfirm>
                        </div>
                      </div>
                      <div style={{ width: '100%', zoom: itemW / 1210,overflow:'hidden' }}>
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
                  })
                }
              </div>
              {getSldEmptyH(20)}
            </Scrollbars>
            :
            <div className={global.flex_column_center_center} style={{ width: '100%', height: '100%', marginTop: 100 }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('暂无数据')}`}/>
            </div>
          }

          {/*模板展示-end*/}
          {/*新增/编辑对话框-start*/}
          <SldModal
            width={type == 'add' ? 900 : 600}
            title={title}
            sldSeleSingleRow={true}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          {/*新增/编辑对话框-end*/}
        </div>
      </Spin>
    );
  }
}
