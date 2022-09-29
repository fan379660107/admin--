import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Input, Spin, InputNumber, Switch, Checkbox, Table, Tooltip } from 'antd';
import {
  failTip,
  sucTip,
  getSldEmptyH,
  calcDescartes,
  sldComLanguage,
  list_com_page_more,
  commonSetting,
  isEqualArray,
  sldCommonTitleByBg,
  sldSvgIcon,
  quillEscapeToHtml,
} from '@/utils/utils';
import { reserveInfoLimitType } from '@/utils/util_data';
import global from '@/global.less';
import { apiUrl, uploadLimit } from '@/utils/sldconfig.js';
import SldUEditor from '@/components/SldUEditor';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import SldTableSingleRow from '@/components/SldTableSingleRow';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SelGoodsCat from './sel_goods_cat';

const FormItem = Form.Item;
let sthis = '';
@connect(({ product, goods_platform, global, common }) => ({
  product, goods_platform, global, common,
}))
@Form.create()
export default class PublishPlatFormGoods extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    this.state = {
      initEditorFlag: false,//加载百度编辑器
      getEditorContentFlag: false,//获取百度编辑器内容标识
      initEditorContent: '',//百度编辑器内容
      show_radio_flag: false,//是否显示radio类型的数据
      is_set_img_spec: false,//是否设置图片规格
      top_nav_step: 1,//顶部导航当前步骤
      step: 1,//发布商品步骤
      modalVisible: false,//选择分类modal框
      submiting: false,//选择分类modal框,确定按钮的loading框架
      commonTop: 60,//nav切换时到顶部的距离
      loading: false,
      pageLoading: false,//页面loading
      show_table_modal_add: false,//是否显示input后缀搜索modal上的新增按钮，默认不显示
      modalSldAddVisible: false,//是否显示input后缀add的modal框，默认不显示
      tablesldSAddTitle: `${sldComLanguage('添加')}`,//input后缀add的modal框的标题   添加
      search_add_modal_width: 500,//input后缀add的modal框的宽度
      search_modal_width: 600,//默认搜索，modal宽度
      tableTitle: '',//弹框选择的标题
      cur_type: '',//show_list表示表格搜索，add表示添加数据
      cur_operate_type: '',//当前操作对象
      modalTableVisible: false,//选择商品类型弹框
      cur_data: [],//分类当前选中的数据
      sele_goods_cat_data: [],//选择的商品分类信息
      goods_fileList: [],//商品列表
      goodsCategoryId: '',//商品分类id
      goods_cat: [[], [], []],//平台商品分类数据
      filteredInfo: null,
      sortedInfo: null,
      modal_width: 800,//图片预览宽度
      show_preview_modal: false,//预览图片modal框是否展示
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      price: 0.000,//spu的售价
      bprice: 0.000,//spu的进价
      cost: 0.000,//spu的成本价
      screentW: '1000',
      screentH: '1000',
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      columns_spec: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`marketPrice${record.key}`, {
                initialValue: text,
              })(
                <InputNumber
                  min={0.01}
                  max={9999999}
                  precision={2}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'marketPrice', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: <div style={{ position: 'relative' }}>
            <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('价格')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('商品价格须低于市场价')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'productPrice',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`productPrice${record.key}`, {
                initialValue: text, rules: [{
                  required: true,
                  message: `${sldComLanguage('该项必填')}`,
                }],
              })(
                <InputNumber
                  min={0.01}
                  max={9999999}
                  precision={2}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'productPrice', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('重量(KG)')}`,
          dataIndex: 'weight',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`weight${record.key}`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'weight', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('长(CM)')}`,
          dataIndex: 'length',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`length${record.key}`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'length', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('宽(CM)')}`,
          dataIndex: 'width',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`width${record.key}`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'width', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('高(CM)')}`,
          dataIndex: 'height',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`height${record.key}`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e, 'height', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('条形码')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('虚拟商品无需填写')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'barCode',
          align: 'center',
          width: 150,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`barCode${record.key}`, {
                initialValue: text, rules: [{
                  maxLength: 30,
                  message: `${sldComLanguage('最多30个字符')}`,
                }],
              })(
                <Input
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChange(e.target.value, 'barCode', record.key)}
                />,
              )}
            </FormItem>
          ),
        }, {
          title: `${sldComLanguage('启用')}`,
          dataIndex: 'state',
          align: 'center',
          width: 60,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`state${record.key}`, {
                valuePropName: 'checked',
                initialValue: text == 1 ? true : false,
              })(
                <Switch
                  style={{ width: '100%' }}
                  disabled={record.isDefault == 1 ? true : false}
                  onChange={e => this.handleFieldChange(e ? 1 : 2, 'state', record.key)}
                />,
              )}
            </FormItem>
          ),
        }, {
          title: `${sldComLanguage('默认选中')}`,
          dataIndex: 'isDefault',
          align: 'center',
          width: 60,
          render: (text, record) => {
            return <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`isDefault${record.key}`, {
                valuePropName: 'checked',
                initialValue: text == 1 ? true : false,
              })(
                <Checkbox
                  onChange={e => this.handleFieldChangeDefault(e.target.checked ? 1 : 0, 'isDefault', record.key)}
                />,
              )}
            </FormItem>;
          },
        }],//商品规格表头
      columns_spu: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: `${sldComLanguage('市场价')}`,
          dataIndex: 'marketPrice',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`marketPrice`, {
                initialValue: text,
              })(
                <InputNumber
                  min={0.01}
                  max={9999999}
                  precision={2}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'marketPrice', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: <div style={{ position: 'relative' }}>
            <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>{sldComLanguage('价格')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('商品价格须低于市场价')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`goodsPrice`, {
                initialValue: text, rules: [{
                  required: true,
                  message: `${sldComLanguage('该项必填')}`,
                }],
              })(
                <InputNumber
                  min={0.01}
                  max={9999999}
                  precision={2}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'goodsPrice', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('重量(KG)')}`,
          dataIndex: 'weight',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`weight`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'weight', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('长(CM)')}`,
          dataIndex: 'length',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`length`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'length', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('宽(CM)')}`,
          dataIndex: 'width',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`width`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'width', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: `${sldComLanguage('高(CM)')}`,
          dataIndex: 'height',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`height`, {
                initialValue: text ? text : 1,
              })(
                <InputNumber
                  min={0.001}
                  max={999999.999}
                  precision={3}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e, 'height', record.key)}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: <div style={{ position: 'relative' }}>
            {sldComLanguage('条形码')}
            <Tooltip placement="bottomLeft" title={sldComLanguage('虚拟商品无需填写')}>
              <div style={{ right: -15, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
            </Tooltip></div>,
          dataIndex: 'barCode',
          align: 'center',
          width: 150,
          render: (text, record) => (
            <FormItem
              style={{ width: '100%' }}
            >
              {getFieldDecorator(`barCode`, {
                initialValue: text, rules: [{
                  maxLength: 30,
                  message: `${sldComLanguage('最多30个字符')}`,
                }],
              })(
                <Input
                  maxLength={250}
                  style={{ width: '100%' }}
                  onChange={e => this.handleFieldChangeSpu(e.target.value, 'barCode', record.key)}
                />,
              )}
            </FormItem>
          ),
        }],//spu商品价格信息表头
      goods_video_data: [{
        type: 'upload_video',
        label: `${sldComLanguage('商品视频')}`,
        name: 'video',
        extra: `${sldComLanguage('最大限制')}${uploadLimit}${sldComLanguage('M,支持mp4格式,推荐时长不低于6s,不超过90s')}`,
        fileList: [],
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=video`,
        initialValue: '',
        img_succ_info: {},
        item_height: 140,
        uploadPreview: this.uploadImgPre,
        delVideo: this.delVideo,
        uploadChange: (info) => this.uploadVideo(info, 'video'),
      }],
      goods_img_data: [],
      spec_set_data: [{
        type: 'goods_spec_sele_b2c',
        label: `${sldComLanguage('规格选择')}`,
        name: 'goods_spec_sele',
        sel_data: [],//供选择的数据
        show_data: [],//供显示的数据
        disable: props.id != undefined && props.id ? true : false,
        addSpec: this.addSpec,
        addSpecValue: this.addSpecValue,
        handleSetOpenFlag: (data) => this.handleSetOpenFlag(data),
        handleSpecChange: (data) => this.handleSpecChange(data),
        handleSpecFocus: (data) => this.handleSpecFocus(data),
        setImgSpec: (e, specId) => this.setImgSpec(e, specId),
        is_add_spec: false,//是否正在添加规格项handleSpecChange
        handleSpecSele: this.handleSpecSele,
        handleDelAddSpec: this.handleDelAddSpec,//删除添加的规格项名称
        handleEditAddSpec: this.handleEditAddSpec,//修改添加的规格项名称
        uploadPreview: this.uploadImgPre,
        uploadChange: this.uploadImgSpec,
        upload_name: 'file',
        upload_url: apiUrl + `v3/oss/common/upload?source=goods`,
      }],//规格数据
      spec_data_table: {
        list: [],
        pagination: { current: 1, pageSize: 2, total: 0 },
      },
      spu_data_table: {
        list: [{
          marketPrice: '',
          goodsPrice: '',
          weight: 1,
          length: 1,
          width: 1,
          height: 1,
          barCode: '',
        }],
        pagination: { current: 1, pageSize: 2, total: 0 },
      },//spu价格信息数据
      cur_goods_type: 1,//当前商品类型，1为实物，2为虚拟，默认为1
      goods_base_data: [{
        type: 'show_text_btn',
        label: `${sldComLanguage('商品分类')}`,
        name: 'goods_cat',
        initialValue: '',
        required: true,
        btn: {
          text: `${sldComLanguage('选择商品分类')}`,
          callback: this.sele_goods_cat,
        },
      }, {
        type: 'radio',
        label: `${sldComLanguage('商品类型')}`,
        extra: `${sldComLanguage('编辑商品的时候无法更改商品类型，请谨慎选择')}`,
        name: 'isVirtualGoods',
        placeholder: ``,
        sel_data: [
          { name: `${sldComLanguage('实物商品(需要物流)')}`, key: 1 },
          { name: `${sldComLanguage('虚拟商品(无需物流)')}`, key: 2 },
        ],
        initialValue: 1,
        onChange: this.handleGoodsType,
      }, {
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,
        name: 'goodsName',
        extra: `${sldComLanguage('最多输入50个字')}`,
        placeholder: `${sldComLanguage('请输入商品名称')}`,
        initialValue: '',
        required: true,
        maxLength: 50,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入商品名称')}`,
        }],
      }, {
        type: 'input',
        label: `${sldComLanguage('商品广告语')}`,
        name: 'goodsBrief',
        placeholder: `${sldComLanguage('请输入商品广告语')}`,
        extra: `${sldComLanguage('最多输入50个字')}`,
        initialValue: '',
        maxLength: 50,
      }, {
        type: 'select',
        label: `${sldComLanguage('品牌')}`,
        name: 'brandId',
        placeholder: `${sldComLanguage('请选择品牌')}`,
        sel_data: [],
        sele_key: 'brandId',
        sele_name: 'brandName',
        diy: true,
      }],//基本信息
      other_data: [{
        type: 'radio',
        label: `${sldComLanguage('发布状态')}`,
        name: 'state',
        placeholder: '',
        width: 250,
        sel_data: [
          { name: `${sldComLanguage('发布为待刊登')}`, key: 1 },
          { name: `${sldComLanguage('直接刊登')}`, key: 2 },
        ],
        initialValue: 1,
      }],//其他信息
      search_attr_data: [],//检索属性列信息
    };
  }

  afterSaleService = {
    type: 'radio',
    label: `${sldComLanguage('售后服务')}`,
    name: 'afterSaleService',
    placeholder: '',
    width: 250,
    sel_data: [
      { name: `${sldComLanguage('不支持退款')}`, key: 0 },
      { name: `${sldComLanguage('支持退款')}`, key: 1 },
    ],
    initialValue: 0,
  };//售后服务数据——选择虚拟商品

  reserveInfoList = {
    type: 'add_reserve_info',
    label: `${sldComLanguage('用户预留信息')}`,
    name: 'reserveInfoList',
    placeholder: '',
    width: 250,
    sel_data: [],
    initialValue: [],
    addReserveInfo: () => this.addReserveInfo(),//添加备注信息
    handleReserveInfo: (e, key, field) => this.handleReserveInfo(e, key, field),//预留信息操作事件
    delReserveInfo: (key) => this.delReserveInfo(key),//删除备注信息
  };//预留信息——选择虚拟商品

  img_item = {
    type: 'upload_img_upload',
    label: `${sldComLanguage('图片')}`,
    name: 'image',
    extra: `${sldComLanguage('建议尺寸800px*800px的方形图片,最大限制')}${uploadLimit}${sldComLanguage('M,在保证图片质量的情况下图片越小加载效果越好,最多可上传6张')}`,
    fileList: [],
    upload_name: 'file',
    upload_url: apiUrl + `v3/oss/common/upload?source=goods`,
    initialValue: '',
    img_succ_info: {},
    required: true,
    item_height: 140,
  };//图片数据

  service_list = [];//商品标签分列表
  search_attr_list = [];//搜索属性列表

  //新增预留信息事件
  addReserveInfo = () => {
    let { other_data } = this.state;
    let target_data = other_data.filter(item => item.name == 'reserveInfoList')[0];
    if (target_data.sel_data.length == 5) {
      failTip(`${sldComLanguage('用户预留信息最多添加5条')}～`);
    } else {
      target_data.sel_data.push({
        reserveName: '',
        reserveType: `${sldComLanguage('手机号')}`,
        isRequired: 0,
        key: (new Date()).valueOf(),
      });
      target_data.item_height = 70 + target_data.sel_data.length * 40;
      this.setState({ other_data });
    }
  };

  //预留信息操作事件
  handleReserveInfo = (e, key, filed) => {
    let { other_data } = this.state;
    let temp = other_data.filter(item => item.name == 'reserveInfoList')[0];
    let target_data = temp.sel_data.filter(item => item.key == key)[0];
    if (filed == 'isRequired') {
      target_data[filed] = e ? 1 : 0;
    } else {
      target_data[filed] = e;
    }
    this.setState({ other_data });
  };

  //预留信息删除事件
  delReserveInfo = (key) => {
    let { other_data } = this.state;
    let temp = other_data.filter(item => item.name == 'reserveInfoList')[0];
    temp.sel_data = temp.sel_data.filter(item => item.key != key);
    temp.item_height = 70 + temp.sel_data.length * 40;
    this.setState({ other_data });
  };

  //商品类型选择事件
  handleGoodsType = (e) => {
    let { other_data } = this.state;
    other_data = other_data.filter(item => item.name != 'afterSaleService' && item.name != 'reserveInfoList');
    if (e == 2) {
      other_data.push(JSON.parse(JSON.stringify(this.afterSaleService)));
      let reserveInfoList = JSON.parse(JSON.stringify(this.reserveInfoList));
      reserveInfoList.addReserveInfo = function() {
        sthis.addReserveInfo();
      };
      reserveInfoList.handleReserveInfo = function(e, key, field) {
        sthis.handleReserveInfo(e, key, field);
      };
      reserveInfoList.delReserveInfo = function(key) {
        sthis.delReserveInfo(key);
      };
      other_data.push(reserveInfoList);
    }
    this.setState({ cur_goods_type: e, other_data });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  componentDidMount() {
    if (this.props.id != undefined && this.props.id) {
      this.setState({ top_nav_step: 2, step: 2 });
    } else {
      this.setState({ show_radio_flag: true, initEditorFlag: true });
    }
    this.initSpuGoodsImaData();
    this.getSystemCat(1, 0);//获取平台分类
    this.get_spec_list();//获取规格列表
    this.resize();
    window.addEventListener('resize', this.resize);
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  //点击添加规格项事件
  addSpec = (flag) => {
    let { spec_set_data } = this.state;
    if (spec_set_data[0].show_data.length >= commonSetting.specLimit) {
      failTip(`${sldComLanguage('最多设置')}${commonSetting.specLimit}${sldComLanguage('组规格项')}`);
      return false;
    }
    let tmp_data = spec_set_data.filter(item => item.name == 'goods_spec_sele')[0];
    tmp_data.is_add_spec = flag;
    this.setState({ spec_set_data });
  };

  //点击添加规格值事件
  addSpecValue = (flag, specId) => {
    let { spec_set_data } = this.state;

    //show_data 里面的数据需要更新
    let tmp_data_show_data = spec_set_data[0].show_data.filter(item => item.specId == specId);
    if (tmp_data_show_data[0].showValList.length >= commonSetting.specValLimit) {
      failTip(`${sldComLanguage('每个规格项最多设置')}${commonSetting.specValLimit}${sldComLanguage('个规格值')}`);
      return false;
    }
    tmp_data_show_data[0].is_add_spec_val = flag;

    //sel_data 里面的数据需要更新
    let tmp_data = spec_set_data[0].sel_data.filter(item => item.specId == specId);
    tmp_data[0].is_add_spec_val = flag;


    this.setState({ spec_set_data });
  };

  //删除规格项名称：该数据的选中属性设为false，它下面的规格值的选中属性也设为false
  handleDelAddSpec = (data) => {
    let { spec_set_data } = this.state;
    let tmp_data = spec_set_data[0];
    if (data.type == 'spec') {
      //删除规格项
      //sel_data的处理
      let tmp_del_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
      tmp_del_data.sele_flag = false;
      if (tmp_del_data.valueList.length != undefined && tmp_del_data.valueList.length > 0) {
        tmp_del_data.valueList.map(item => {
          item.sele_flag = false;
        });
      }
      //图片规格的话，需要处理图片数据
      if (tmp_del_data.is_img_spec) {
        this.initSpuGoodsImaData();
      }

      //show_data里直接移除该条规格项
      tmp_data.show_data = tmp_data.show_data.filter(item => item.specId != data.specId);

    } else {
      //删除规格值（将该规格值的sele_flag置为false即可）
      //sel_data的处理
      let tmp_del_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
      let tmp_del_data_spec_val = tmp_del_data.valueList.filter(item => item.specValueId == data.specValueId)[0];
      //当前操作的规格值数据——对象
      tmp_del_data_spec_val.sele_flag = false;

      //show_data的处理
      let tmp_del_data_show_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
      tmp_del_data_show_data.valueList = JSON.parse(JSON.stringify(tmp_del_data.valueList));

      //showValList里面的规格值直接删掉
      tmp_del_data_show_data.showValList = tmp_del_data_show_data.showValList.filter(item => item.specValueId != data.specValueId);

      //图片规格需要删除图片数据
      if (tmp_del_data_show_data.is_img_spec) {
        this.operateSpecImg('del', { specValueId: data.specValueId });
      }

    }
    this.setState({
      spec_set_data,
    }, () => {
      sthis.getCalcDEscartes(spec_set_data[0].show_data);
    });
  };

  //设置图片规格 is_img_spec该规格项是否是图片规格，true为是
  setImgSpec = (e, specId) => {
    let { spec_set_data, is_set_img_spec, goods_img_data } = this.state;
    let tmp_data = spec_set_data[0];
    for (let i in tmp_data.show_data) {
      if (tmp_data.show_data[i].specId == specId) {
        //设置当前规格项是否是图片规格
        tmp_data.show_data[i].is_img_spec = e.target.checked;
        tmp_data.sel_data[i].is_img_spec = e.target.checked;
        is_set_img_spec = e.target.checked;
        if (e.target.checked == true) {
          //设置图片规格
          goods_img_data = [];
          if (tmp_data.show_data[i].showValList.length > 0) {
            for (let j in tmp_data.show_data[i].showValList) {
              let item = tmp_data.show_data[i].showValList[j];
              goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
              let cur_data = goods_img_data[goods_img_data.length - 1];
              cur_data.label = item.specValue;
              cur_data.name = 'image' + item.specValueId;
              cur_data.specId = item.specId;
              cur_data.specValueId = item.specValueId;
              cur_data.specValue = item.specValue;
              cur_data.extra_param = item;
              cur_data.fileList = [];
              cur_data.uploadPreview = function(info) {
                sthis.uploadImgPre(info);
              };
              cur_data.uploadChange = function(info, extra) {
                sthis.uploadImg(info, 'image' + extra.specValueId);
              };
            }
          }
          this.setState({ goods_img_data });
        } else {
          //取消图片规格的设置,将规格图片变为图片数据
          this.initSpuGoodsImaData();
        }
      } else {
        //不论当前规格是否是图片规格，非当前规格都是不选中的
        tmp_data.show_data[i].is_img_spec = false;
      }
    }
    this.setState({
      spec_set_data,
      is_set_img_spec,
    });
  };

  //图片规格数据
  operateSpecImg = (type, data) => {
    let { goods_img_data } = this.state;
    if (type == 'add') {
      //添加规格图片
      goods_img_data.push(JSON.parse(JSON.stringify(this.img_item)));
      let cur_data = goods_img_data[goods_img_data.length - 1];
      cur_data.label = data.specValue;
      cur_data.name = 'image' + data.specValueId;
      cur_data.specId = data.specId;
      cur_data.specValueId = data.specValueId;
      cur_data.specValue = data.specValue;
      cur_data.extra_param = data;
      cur_data.fileList = [];
      cur_data.uploadPreview = function(info) {
        sthis.uploadImgPre(info);
      };
      cur_data.uploadChange = function(info, extra) {
        sthis.uploadImg(info, 'image' + extra.specValueId);
      };
    } else if (type == 'edit') {
      //编辑规格图片
      let cur_data = goods_img_data.filter(item => item.specValueId == data.specValueId)[0];
      cur_data.label = data.specValue;
      cur_data.name = 'image' + data.specValueId;
      cur_data.specId = data.specId;
      cur_data.specValueId = data.specValueId;
      cur_data.specValue = data.specValue;
      cur_data.extra_param = data;
    } else if (type == 'del') {
      //删除规格图片
      goods_img_data = goods_img_data.filter(item => item.specValueId != data.specValueId);
      if (goods_img_data.length == 0) {
        //图片规格下面没有规格值的话，商品图片应该是spu的图片信息
        this.initSpuGoodsImaData();
        return false;
      }
    }
    this.setState({
      goods_img_data,
    });

  };

  //初始化spu的图片信息
  initSpuGoodsImaData = () => {
    let { goods_img_data } = this.state;
    goods_img_data = [JSON.parse(JSON.stringify(this.img_item))];
    let cur_data = goods_img_data[goods_img_data.length - 1];
    cur_data.label = '图片';
    cur_data.name = 'image';
    cur_data.specId = '';
    cur_data.specValueId = '';
    cur_data.specValue = '';
    cur_data.extra_param = {};
    cur_data.fileList = [];
    cur_data.uploadPreview = function(info) {
      sthis.uploadImgPre(info);
    };
    cur_data.uploadChange = function(info) {
      sthis.uploadImg(info, 'image');
    };
    this.setState({
      goods_img_data,
    });
  };

  //规格项聚焦事件
  handleSpecFocus = (data) => {
    let { spec_set_data } = this.state;
    if (data.type == 'spec') {
      let tmp_data = spec_set_data[0];
      let tmp_del_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
      tmp_del_data.is_editing = true;

    } else {
    }
    this.setState({
      spec_set_data,
    });
  };

  //设置规格选择框的open属性
  handleSetOpenFlag = (data) => {
    let { spec_set_data } = this.state;
    let tmp_data = spec_set_data[0];
    let tmp_spec_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//当前操作的规格项数据——对象
    if (data.type == 'spec') {
      tmp_spec_data.open_flag = data.flag;
    } else {
      let tmp_spec_val_data = tmp_spec_data.valueList.filter(item => item.specValueId == data.specValueId)[0];
      let tmp_show_spec_val_data = tmp_spec_data.showValList.filter(item => item.specValueId == data.specValueId)[0];
      tmp_spec_val_data.open_flag = data.flag;
      tmp_show_spec_val_data.open_flag = data.flag;
    }
    this.setState({
      spec_set_data,
    });
  };

  //添加/修改规格项或者规格值事件 operate：edit(修改) add(添加)
  handleSpecChange = (data) => {
    const { dispatch } = this.props;
    let { spec_set_data } = this.state;
    if (data.sel.length == 0) {//针对选择同一个数据
      return false;
    }
    let cur_val = data.sel;
    if (data.type == 'spec') {
      if (cur_val.length > 6) {
        failTip(`${sldComLanguage('最多输入6个字')}`);
        return false;
      }
      //添加规格项
      let tmp_data = spec_set_data[0];
      let sel_data = tmp_data.sel_data.filter(item => item.specName == cur_val);
      if (sel_data.length != undefined && sel_data.length > 0) {//选择已有规格
        let is_show_data = tmp_data.show_data.filter(item => item.specName == cur_val);
        if (is_show_data.length != undefined && is_show_data.length > 0) {
          failTip('该规格项已经存在了～');
          return false;
        }
        sel_data[0].sele_flag = true;
        tmp_data.is_add_spec = false;
        tmp_data.is_editing = false;
        if (data.operate == 'add') {
          //添加规格
          tmp_data.show_data.push({
            ...JSON.parse(JSON.stringify({ ...sel_data[0], is_add_spec_val: true })),
            showValList: [],
          });//将选中的数据添加到显示数据中,showValList为用户的显示,添加规格项之后自动显示一个规格值输入框
        } else {
          let pre_sele_spec_data_sel_data = tmp_data.sel_data.filter(item => item.specId == data.specId)[0];//sel_data里面之前选择的规格数据
          // 选择标识改为false，下面的规格值都要变为false
          pre_sele_spec_data_sel_data.sele_flag = false;

          let pre_sele_spec_data_show_data = tmp_data.show_data.filter(item => item.specId == data.specId)[0];//show_data里面之前选择的规格数据
          if (pre_sele_spec_data_show_data.valueList.length != undefined && pre_sele_spec_data_show_data.valueList.length > 0) {
            pre_sele_spec_data_show_data.valueList.map(item => {
              item.sele_flag = false;
            });
          }

          //show_data里面之前选择的规格位置，更新数据就可以了
          for (let i in tmp_data.show_data) {
            if (tmp_data.show_data[i].specId == data.specId) {
              tmp_data.show_data[i] = { ...JSON.parse(JSON.stringify(sel_data[0])), showValList: [] };
              break;
            }
          }

        }
        this.setState({
          spec_set_data,
        }, () => {
          sthis.getCalcDEscartes(spec_set_data[0].show_data);
        });
      } else {//编辑输入新规格
        dispatch({
          type: 'product/add_goods_spec',
          payload: { specName: cur_val, state: 1, sort: 1 },
          callback: (res) => {
            if (res.state == 200) {
              tmp_data.is_add_spec = false;
              tmp_data.is_editing = false;
              let add_data_info = {
                specId: res.data,
                specName: cur_val,
                sele_flag: true,
                valueList: [],
                showValList: [],//选中的规格值，用于展示
                open_flag: false,
              };
              tmp_data.sel_data.push(add_data_info);
              if (data.operate == 'add') {
                tmp_data.show_data.push(JSON.parse(JSON.stringify({ ...add_data_info, is_add_spec_val: true })));//将选中的数据添加到显示数据中
              } else {
                //show_data里面之前选择的规格位置，更新数据就可以了
                for (let i in tmp_data.show_data) {
                  if (tmp_data.show_data[i].specId == data.specId) {
                    tmp_data.show_data[i] = JSON.parse(JSON.stringify(add_data_info));
                    break;
                  }
                }
              }
              this.setState({
                spec_set_data,
              }, () => {
                sthis.getCalcDEscartes(spec_set_data[0].show_data);
              });
            } else {
              failTip(res.msg);
            }
          },
        });
      }
    } else {
      if (cur_val.length > 10) {
        failTip(`${sldComLanguage('最多输入10个字')}`);
        return false;
      }
      //添加规格值，若规格值存在，直接将选中标识置为1，否则请求接口添加
      let tmp_show_data = spec_set_data[0].show_data.filter(item => item.specId == data.specId);//当前操作的规格项的数据（show_data）——数组
      let tmp_sel_data = spec_set_data[0].sel_data.filter(item => item.specId == data.specId);//当前操作的规格项的数据（show_data）——数组
      let sel_spec_val_show_data = tmp_show_data[0].valueList.filter(item => item.specValue == cur_val);//当前操作的规格值数组——数组

      if (sel_spec_val_show_data.length != undefined && sel_spec_val_show_data.length > 0) {//从已有值中选择

        tmp_show_data[0].is_add_spec_val = false;//选择完毕的话将正在添加规格值的标识置为false
        //show_data里面该规格项下的规格值valueList的标识改为选中
        sel_spec_val_show_data[0].sele_flag = true;
        let is_show_spec_val_data = tmp_show_data[0].showValList.filter(item => item.specValue == cur_val);
        if (is_show_spec_val_data.length != undefined && is_show_spec_val_data.length > 0) {
          failTip('该规格值已经存在了～');
          return false;
        }
        if (data.operate == 'add') {
          tmp_show_data[0].showValList.push(JSON.parse(JSON.stringify(sel_spec_val_show_data[0])));//showValList里面增加该规格值
        } else {
          //修改规格值
          let pre_sele_specval_show_data = tmp_show_data[0].valueList.filter(item => item.specValueId == data.specValueId)[0];//show_data里面之前选择的规格值数据
          // 选择标识改为false
          pre_sele_specval_show_data.sele_flag = false;

          //showValList里面之前选择的规格值的位置，更新数据就可以了
          for (let i in tmp_show_data[0].showValList) {
            if (tmp_show_data[0].showValList[i].specValueId == data.specValueId) {
              tmp_show_data[0].showValList[i] = JSON.parse(JSON.stringify(sel_spec_val_show_data[0]));
              break;
            }
          }
        }

        //图片规格需要更新图片数据
        if (tmp_show_data[0].is_img_spec) {
          let img_base_data = {};
          img_base_data.specId = sel_spec_val_show_data[0].specId;
          img_base_data.specValueId = sel_spec_val_show_data[0].specValueId;
          img_base_data.specValue = sel_spec_val_show_data[0].specValue;
          this.operateSpecImg(data.operate, img_base_data);
        }

        tmp_sel_data[0].valueList = JSON.parse(JSON.stringify(tmp_show_data[0].valueList));
        this.setState({
          spec_set_data,
        }, () => {
          sthis.getCalcDEscartes(spec_set_data[0].show_data);
        });
      } else {
        dispatch({
          type: 'goods_platform/add_goods_spec_val',
          payload: { specId: data.specId, specValues: cur_val },
          callback: (res) => {
            if (res.state == 200) {
              tmp_show_data[0].is_add_spec_val = false;
              let add_data_info = {
                specId: data.specId,
                specValue: cur_val,
                sele_flag: true,
                specValueId: res.data,
              };
              tmp_show_data[0].valueList.push(add_data_info);
              if (data.operate == 'add') {
                tmp_show_data[0].showValList.push(JSON.parse(JSON.stringify(add_data_info)));//将选中的数据添加到显示数据中
                tmp_sel_data[0].valueList.push(JSON.parse(JSON.stringify(add_data_info)));//将选中的数据添加到可供选择的数据中
              } else {
                //showValList里面之前选择的规格值位置，更新数据就可以了
                for (let i in tmp_show_data[0].showValList) {
                  if (tmp_show_data[0].showValList[i].specValueId == data.specValueId) {
                    tmp_show_data[0].showValList[i] = JSON.parse(JSON.stringify(add_data_info));
                    break;
                  }
                }
              }
              //图片规格需要更新图片数据
              if (tmp_show_data[0].is_img_spec) {
                let img_base_data = {};
                img_base_data.specId = add_data_info.specId;
                img_base_data.specValueId = add_data_info.specValueId;
                img_base_data.specValue = add_data_info.specValue;
                this.operateSpecImg(data.operate, img_base_data);
              }
              this.setState({
                spec_set_data,
              }, () => {
                sthis.getCalcDEscartes(spec_set_data[0].show_data);
              });
            } else {
              failTip(res.msg);
            }
          },
        });
      }
    }
  };

  //获取规格信息
  get_spec_list = () => {
    const { dispatch, id } = this.props;
    let { spec_set_data, loading } = this.state;
    dispatch({
      type: 'goods_platform/get_goods_spec_list',
      payload: { pageSize: list_com_page_more },
      callback: (res) => {
        for (let i in spec_set_data) {
          if (spec_set_data[i].name == 'goods_spec_sele') {
            if (res.state == 200) {
              spec_set_data[i].sel_data = res.data.list;
            } else {
              spec_set_data[i].sel_data = [];
            }
          }
        }
        if (id != undefined && id > 0) {
          loading = true;
        }
        this.setState({ spec_set_data, loading }, () => {
          if (id != undefined && id) {
            sthis.get_goods_detail(id);
          }
        });
      },
    });
  };

  //列表展示对话框隐藏_弹框专属
  sldHandleTableCancle = () => {
    this.setState({ modalTableVisible: false });
  };

  //获取商品详情
  get_goods_detail = async (id) => {
    const { dispatch } = this.props;
    let { goods_base_data, initEditorContent, sele_goods_cat_data, goods_img_data, spec_data_table, spu_data_table, other_data, spec_set_data, goods_video_data } = this.state;
    goods_img_data = [];
    dispatch({
      type: 'goods_platform/get_goods_detail',
      payload: { platformGoodsId: id },
      callback: async (res) => {
        if (res.state == 200) {
          let result = res.data;
          await this.get_brand_attr_detail(result.categoryId3, res.data.attributeList != null && res.data.attributeList.length > 0 ? res.data.attributeList : []);
          //三级分类ID数组
          let tmp_goods_cat = result.categoryPath.split('->');
          sele_goods_cat_data[0] = {};
          sele_goods_cat_data[0].categoryId = result.categoryId1;
          sele_goods_cat_data[0].categoryName = tmp_goods_cat[0];
          sele_goods_cat_data[1] = {};
          sele_goods_cat_data[1].categoryId = result.categoryId2;
          sele_goods_cat_data[1].categoryName =tmp_goods_cat[1];
          sele_goods_cat_data[2] = {};
          sele_goods_cat_data[2].categoryId = result.categoryId3;
          sele_goods_cat_data[2].categoryName = tmp_goods_cat[2];

          //初始化商品的goods_base_data信息
          for (let i = 0; i < goods_base_data.length; i++) {
            if (goods_base_data[i].name == 'goods_cat') {
              goods_base_data[i].initialValue = tmp_goods_cat[0] + '>' + tmp_goods_cat[1] + '>' + tmp_goods_cat[2];//三级分类展示字符串
            } else {
              goods_base_data[i].initialValue = result[goods_base_data[i].name];
              if (goods_base_data[i].name == 'isVirtualGoods') {
                goods_base_data[i].disabled = true;
              }
            }
          }

          /*商品规格-start*/
          if (result.specInfoList != null && result.specInfoList.length != undefined && result.specInfoList.length > 0) {
            result.specInfoList.map((item, index) => {
              let tmp_spec_set_data = spec_set_data[0].sel_data.filter(items => items.specId == item.specId);
              if (tmp_spec_set_data != undefined && tmp_spec_set_data.length != undefined && tmp_spec_set_data.length > 0) {

                tmp_spec_set_data[0].sele_flag = true;
                tmp_spec_set_data[0].is_img_spec = item.isMain == 1 ? true : false;

                //规格值的处理
                let sele_spec_val_data = [];
                result.specInfoList[index].specValueList.map((item_spec_val, index_spec_val) => {
                  let tmp_spec_val_data = tmp_spec_set_data[0].valueList.filter(item => item.specValueId == item_spec_val.specValueId);
                  if (tmp_spec_val_data != undefined && tmp_spec_val_data.length != undefined && tmp_spec_val_data.length > 0) {
                    tmp_spec_val_data[0].sele_flag = true;
                    sele_spec_val_data.push({ ...tmp_spec_val_data[0] });
                  }

                  //商品图片处理
                  if (item.isMainSpec == 1) {
                    //该规格项是图片规格
                    goods_img_data.push(JSON.parse(JSON.stringify(sthis.img_item)));
                    let cur_data = goods_img_data[goods_img_data.length - 1];
                    cur_data.label = item_spec_val.specValue;
                    cur_data.name = 'image' + item_spec_val.specValueId;
                    cur_data.specId = item.specId;
                    cur_data.specValueId = item_spec_val.specValueId;
                    cur_data.specValue = item_spec_val.specValue;
                    cur_data.extra_param = { specValueId: item_spec_val.specValueId };
                    cur_data.fileList = [];
                    //组装图片
                    item_spec_val.imageList.map(item_spec_val_img => {
                      let img_info = {};
                      img_info.uid = item_spec_val_img.image;
                      img_info.thumbUrl = item_spec_val_img.imageUrl;//图片的url地址
                      img_info.status = 'done';
                      img_info.response = {};
                      img_info.response.state = 200;
                      img_info.response.data = {
                        path: item_spec_val_img.image,
                        url: item_spec_val_img.imageUrl,//图片的url地址
                      };
                      cur_data.fileList.push(img_info);
                    });

                    cur_data.uploadPreview = function(info) {
                      sthis.uploadImgPre(info);
                    };
                    cur_data.uploadChange = function(info, extra) {
                      sthis.uploadImg(info, 'image' + extra.specValueId);
                    };
                  }
                });

                //规格项的处理
                spec_set_data[0].show_data.push({
                  ...JSON.parse(JSON.stringify(tmp_spec_set_data[0])),
                  showValList: sele_spec_val_data,
                  is_img_spec: item.isMainSpec == 1 ? true : false,
                });
              }

            });

            //sku list的处理
            let skuList = [];
            let key = 0;
            result.productList.map((itemP, indexP) => {
              key += 1;
              let tmpItem = {};
              tmpItem.barCode = itemP.barCode;
              tmpItem.productPrice = itemP.productPrice;
              tmpItem.height = itemP.height;
              tmpItem.isDefault = itemP.isDefault;
              tmpItem.length = itemP.length;
              tmpItem.key = key;
              tmpItem.marketPrice = itemP.marketPrice;
              tmpItem.state = itemP.state;
              tmpItem.weight = itemP.weight;
              tmpItem.width = itemP.width;
              tmpItem.specValIdArray = [];
              // tmpItem.specValIdArray = itemP.specAttrId.split(',');
              tmpItem.specValIdArray = itemP.specValueIds.split(',');
              tmpItem.spec_info = [];
              //组装spec_info数据
              tmpItem.specValIdArray.map((itemSpecVal, indexSpecVal) => {
                let curItem = {};
                curItem.sele_flag = true;
                for (let specI = 0; specI < result.specInfoList.length; specI++) {
                  let tar_specValItem = result.specInfoList[specI].specValueList.filter(item => item.specValueId == itemSpecVal);
                  if (tar_specValItem.length > 0) {
                    curItem.specId = result.specInfoList[specI].specId;
                    curItem.specName = result.specInfoList[specI].specName;
                    curItem.specValue = tar_specValItem[0].specValue;
                    curItem.specValueId = tar_specValItem[0].specValueId;
                    curItem.specImage = tar_specValItem[0].imageList;
                    break;
                  }
                }
                tmpItem.spec_info.push({ ...curItem });
              });
              skuList.push({ ...tmpItem });
            });
            spec_data_table.list = skuList;
          } else {
            //初始化spu_data_table数据
            let tmp_spu_data = spu_data_table.list[0];
            let tar_data = result.productList[0];
            tmp_spu_data.marketPrice = tar_data.marketPrice;
            tmp_spu_data.goodsPrice = tar_data.productPrice;
            tmp_spu_data.weight = tar_data.weight;
            tmp_spu_data.length = tar_data.length;
            tmp_spu_data.width = tar_data.width;
            tmp_spu_data.height = tar_data.height;
            tmp_spu_data.barCode = tar_data.barCode;
          }

          if (result.imageList.length != 0) {
            //商品图片的处理
            goods_img_data = [JSON.parse(JSON.stringify(sthis.img_item))];
            let cur_data = goods_img_data[0];
            cur_data.label = `${sldComLanguage('图片')}`;
            cur_data.name = 'image';
            cur_data.specId = '';
            cur_data.specValueId = '';
            cur_data.specValue = '';
            cur_data.extra_param = {};
            cur_data.fileList = [];
            //初始化图片数据
            result.imageList.map(item => {
              let img_info = {};
              img_info.uid = item.image;
              img_info.thumbUrl = item.imageUrl;//图片的url地址
              img_info.status = 'done';
              img_info.response = {};
              img_info.response.state = 200;
              img_info.response.data = {
                path: item.image,
                url: item.imageUrl,//图片的url地址
              };
              cur_data.fileList.push(img_info);
            });
            cur_data.uploadPreview = function(info) {
              sthis.uploadImgPre(info);
            };
            cur_data.uploadChange = function(info) {
              sthis.uploadImg(info, 'image');
            };
          }

          /* 商品视频 start */
          if (result.goodsVideo) {
            let video_info = {};
            video_info.uid = result.goodsVideo;
            video_info.thumbUrl = result.goodsVideoUrl;//商品视频的url地址
            video_info.status = 'done';
            video_info.response = {};
            video_info.response.state = 200;
            video_info.response.data = {
              path: result.goodsVideo,
              url: result.goodsVideoUrl,//商品视频的url地址
            };
            goods_video_data[0].fileList = [video_info];
          }
          /* 商品视频 end */

          /* 其他信息数据start */
          other_data = other_data.filter(item => item.name != 'afterSaleService' && item.name != 'reserveInfoList');
          if (result.isVirtualGoods == 2) {
            other_data.push(JSON.parse(JSON.stringify(this.afterSaleService)));
            //预留信息
            let reserveInfoList = JSON.parse(JSON.stringify(this.reserveInfoList));
            reserveInfoList.addReserveInfo = function() {
              sthis.addReserveInfo();
            };
            reserveInfoList.handleReserveInfo = function(e, key, field) {
              sthis.handleReserveInfo(e, key, field);
            };
            reserveInfoList.delReserveInfo = function(key) {
              sthis.delReserveInfo(key);
            };
            //预留信息具体内容
            if (result.reserveList.length != undefined && result.reserveList.length > 0) {
              result.reserveList.map((item, index) => {
                reserveInfoList.sel_data.push({
                  reserveName: item.reserveName,
                  reserveType: reserveInfoLimitType().filter(s => s.key == item.reserveType)[0]['value'],
                  isRequired: item.isRequired,
                  key: (new Date()).valueOf() + index,
                });
              });
              reserveInfoList.item_height = 70 + reserveInfoList.sel_data.length * 40;
            }
            other_data.push(reserveInfoList);
          }
          for (let other_index in other_data) {
            other_data[other_index].initialValue = result[other_data[other_index].name];
          }
          /* 其他信息数据end */

          initEditorContent = quillEscapeToHtml(res.data.goodsDetails);//商品详情
          this.setState({
            loading: false,
            sele_goods_cat_data,//分类id数组
            goods_base_data,//商品的基本信息
            initEditorContent,//商品详情
            goods_img_data,//图片信息
            goods_video_data,//商品视频
            spec_set_data,//规格数据
            spu_data_table,//spu商品数据
            other_data,//其他信息数据
            spec_data_table,//展示的数据
            show_radio_flag: true,
            cur_goods_type: result.isVirtualGoods,
          }, () => {
            //根据选择的结果计算规格数据
            this.getCalcDEscartes(spec_set_data[0].show_data);
          });
        }
      },
    });
  };

  //处理规格选择事件
  handleSpecSele = (checked, val) => {
    let { spec_set_data } = this.state;
    let spec_data = spec_set_data[0].sel_data;
    let sel_spec = spec_data.filter(item => item.id == val.specId)[0];
    sel_spec.sele_id_array = sel_spec.sele_id_array || [];
    for (let i in sel_spec.attrList) {
      if (sel_spec.attrList[i].id == val.id) {
        sel_spec.attrList[i].sele_flag = checked;
        if (checked) {
          sel_spec.sele_id_array.push(val.id);
        } else {
          sel_spec.sele_id_array = sel_spec.sele_id_array.filter(item => item != val.id);
        }
      }
    }
    //根据选择的结果计算规格数据
    this.getCalcDEscartes(spec_data);
    this.setState({ spec_set_data });
  };

  //根据选择的结果计算规格数据，spec_data为规格项数组,spec_set_data[0].show_data
  getCalcDEscartes = (show_data) => {
    //组装笛卡尔积需要的二维数组，由规格值id组成
    let sel_spec_value_array = [];//二维数组，里面的数组为规格项下的规格值数组，是对象数组
    for (let i in show_data) {
      if (show_data[i].showValList.length != undefined && show_data[i].showValList.length > 0) {
        sel_spec_value_array.push(show_data[i].showValList);
      }
    }
    if (sel_spec_value_array.length == 0) {
      //当把规格项数据全部删除之后，需要重置数据
      let { spec_data_table, columns_spec } = this.state;
      spec_data_table.list = [];
      columns_spec = columns_spec.filter(item => item.dataIndex.indexOf('spec_info') == -1);
      this.setState({ spec_data_table, columns_spec });
      return false;
    }
    let spec_all_data = calcDescartes(sel_spec_value_array);//所有组合的规格
    this.getAllSpecTableData(spec_all_data);//组装规格表格数据

  };

  //组装规格表格数据
  getAllSpecTableData = (spec_all_data) => {
    //获取最新的表头数据
    let sele_spec_num = 0;//选中规格的数量
    let { spec_set_data, columns_spec, spec_data_table } = this.state;
    let sle_data_new = spec_set_data[0].show_data.filter(item => item.showValList.length > 0);
    columns_spec = columns_spec.filter(item => item.dataIndex.indexOf('spec_info') == -1);
    for (let i in sle_data_new) {
      sele_spec_num++;
      //更新表头
      for (let s in columns_spec) {
        if (columns_spec[s].dataIndex == 'marketPrice') {
          columns_spec.splice(s, 0, {
            title: sle_data_new[i].specName,
            dataIndex: 'spec_info[' + i + ']',
            align: 'center',
            width: 70,
            render: (text, record) => {
              return <span>{text.specValue}</span>;
            },
          });
          break;
        }
      }
    }
    //组装的本次的全部数据
    let temp_spec_table = [];
    for (let skuI = 0; skuI < spec_all_data.length; skuI++) {
      let temp_item_info = {};
      //表格数据
      let tmp_specValIdArray = [];
      if (sele_spec_num == 1) {
        tmp_specValIdArray.push(spec_all_data[skuI].specValueId);
      } else {
        if (spec_all_data[skuI].length > 0) {
          spec_all_data[skuI].map(item => {
            tmp_specValIdArray.push(item.specValueId);
          });
        }
      }
      temp_item_info.specValIdArray = tmp_specValIdArray;//规格值id数组，用于和之前的sku list比较

      temp_item_info.spec_info = (sele_spec_num == 1 ? [spec_all_data[skuI]] : spec_all_data[skuI]);//规格信息
      temp_item_info.key = skuI + 1;
      temp_item_info.state = 1;//是否启用 1-启用 2-不启用
      temp_item_info.isDefault = skuI == 0 ? 1 : 0;//是否默认货品：0-否；1-是，只有一个默认，如果未设置默认，则默认第一个货品
      temp_item_info.marketPrice = '';//市场价
      temp_item_info.productPrice = '';//销售价
      temp_item_info.weight = 1;//重量kg
      temp_item_info.length = 1;//长度cm
      temp_item_info.width = 1;//宽度cm
      temp_item_info.height = 1;//高度cm
      temp_item_info.barCode = '';//条形码

      temp_spec_table.push(temp_item_info);
    }

    let end_data = [];
    // end_data = temp_spec_table;
    let preData = JSON.parse(JSON.stringify(spec_data_table));
    //如果是初次加载，则直接赋值
    if (preData.list.length == 0) {
      end_data = JSON.parse(JSON.stringify(temp_spec_table));
    } else {
      end_data = this.combineSpecListData(temp_spec_table, preData.list);
    }
    spec_data_table.list = JSON.parse(JSON.stringify(end_data));
    this.setState({
      spec_data_table,
      columns_spec,
    });

  };


  /*
  *
  * 根据所有选中的规格值组装的数据，更新数据的值
  * curData 当前组装完的sku的list
  * preData 前一次组装完的sku的list
  * */
  combineSpecListData = (curData, preData) => {
    for (let i = 0; i < curData.length; i++) {
      for (let j = 0; j < preData.length; j++) {
        if (isEqualArray(curData[i].specValIdArray, preData[j].specValIdArray)) {
          //把之前的数据给到当前数据上
          let tmp_data = {
            ...preData[j],
            specValIdArray: JSON.parse(JSON.stringify(curData[i].specValIdArray)),
            spec_info: JSON.parse(JSON.stringify(curData[i].spec_info)),
            key: curData[i].key,
          };
          //同步spec_info的数据
          // tmp_data.spec_info.map((item,index)=>{
          //   let curSpecInfoData = preData[j].spec_info.filter(items=>items.specValueId == item.specValueId)[0];
          //   // tmp_data.spec_info[index].specImage = curSpecInfoData.specImage;
          // })
          curData[i] = JSON.parse(JSON.stringify(tmp_data));
          break;
        }
      }
    }
    return curData;
  };


  resize() {
    let scrollY = 0;
    let screentW = document.body.clientWidth;
    let screentH = document.body.clientHeight;
    //73为底部高度，50为顶部高度
    if (screentW > 1649) {
      scrollY = screentH - 73 - 50 - 310;
    } else if (screentW <= 1649) {
      scrollY = screentH - 73 - 50 - 350;
    }
    sthis.setState({ scrollY, screentW, screentH });
  }

  //spec_data_table 表格编辑事件
  handleFieldChange(val, fieldName, key) {
    const { spec_data_table } = this.state;
    const newData = spec_data_table.list.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName == 'productPrice'){
        if(target['marketPrice']&&val>=target['marketPrice']){
          target[fieldName] = target['marketPrice']-0.01;
        }else{
          target[fieldName] = val;
        }
      }else if(fieldName == 'marketPrice'){
        if(target['productPrice']&&val<=target['productPrice']){
          target[fieldName] = target['productPrice']+0.01;
        }else{
          target[fieldName] = val;
        }
      }else{
        target[fieldName] = val;
      }
      spec_data_table.list = newData;
      this.setState({ spec_data_table },()=>{
        this.props.form.resetFields(['productPrice'+key,'marketPrice'+key]);
      });
    }
  }

  //spec_data_table 表格设为默认选中事件
  handleFieldChangeDefault(val, fieldName, key) {
    const { spec_data_table } = this.state;
    let tar_data = spec_data_table.list.filter(item => item.key == key);
    tar_data[0].isDefault = val;
    if (val == 1) {
      //如果是默认选中的话，需要将其余的默认选中去掉
      spec_data_table.list.map((item, index) => {
        if (item.key != key) {
          this.props.form.resetFields(['isDefault' + item.key]);
          spec_data_table.list[index].isDefault = 0;
        } else {
          this.props.form.resetFields(['state' + item.key]);
          spec_data_table.list[index].state = 1;
        }
      });
    }
    this.setState({ spec_data_table });
  }

  //spu_data_table 表格编辑事件
  handleFieldChangeSpu(val, fieldName, key) {
    const { spu_data_table } = this.state;
    const newData = spu_data_table.list.map(item => ({ ...item }));
    const target = this.getRowByKeySpu(key, newData);
    if (target) {
      if(fieldName == 'goodsPrice'){
        if(target['marketPrice']&&val>=target['marketPrice']){
          target[fieldName] = target['marketPrice']-0.01;
        }else{
          target[fieldName] = val;
        }
      }else if(fieldName == 'marketPrice'){
        if(target['goodsPrice']&&val<=target['goodsPrice']){
          target[fieldName] = target['goodsPrice']+0.01;
        }else{
          target[fieldName] = val;
        }
      }else{
        target[fieldName] = val;
      }
      spu_data_table.list = newData;
      this.setState({ spu_data_table },()=>{
        this.props.form.resetFields(['goodsPrice','marketPrice']);
      });
    }
  }

  getRowByKey(key, newData) {
    const { spec_data_table } = this.state;
    return (newData || spec_data_table.list).filter(item => item.key === key)[0];
  }

  getRowByKeySpu(key, newData) {
    const { spu_data_table } = this.state;
    return (newData || spu_data_table.list).filter(item => item.key === key)[0];
  }

  //重新选择商品分类
  sele_goods_cat = () => {
    this.getSystemCat(1, 0);
    this.setState({ step: 1, sele_goods_cat_data: [], top_nav_step: 1 });
  };

  //获取平台分类
  getSystemCat = async (grade, categoryId) => {
    const { dispatch } = this.props;
    let { goods_cat } = this.state;
    let dis_type = 'product/get_cate_list_by_id';
    let param = { categoryId: categoryId, isSort: true,pageSize: list_com_page_more };
    await dispatch({
      type: dis_type,
      payload: { ...param, pageSize: list_com_page_more },
      callback: (res) => {
        if (res.state == 200) {
          goods_cat[grade - 1] = res.data.list;
          if (grade < 3) {
            for (let i = grade; i < 3; i++) {
              goods_cat[i] = [];
            }
          }
          this.setState({ goods_cat, cur_data: res.data.list });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //获取商品分类
  sldHandleGoodsCat = async (info, index) => {
    let { cur_data, sele_goods_cat_data, top_nav_step } = this.state;
    if (index == 3) {
      //选择的是最后一级的话需要获取分类相关的类型信息
      this.get_brand_attr_detail(info.categoryId);
      cur_data = info;
    } else {
      sele_goods_cat_data = sele_goods_cat_data.filter((item, indexs) => indexs < index);
      await this.getSystemCat(index + 1, info.categoryId);
    }
    sele_goods_cat_data[index - 1] = info;
    this.setState({ sele_goods_cat_data, cur_data, top_nav_step });

  };

  //根据类型id获取类型详情：绑定的属性、品牌 ,editData为编辑的数据
  get_brand_attr_detail = async (categoryId, editData = []) => {
    const { dispatch } = this.props;
    let { search_attr_data, goods_base_data } = this.state;
    await dispatch({
      type: 'goods_platform/get_brand_attr_detail',
      payload: { categoryId: categoryId, pageSize: list_com_page_more },
      callback: (res) => {
        if (res.state == 200) {
          //品牌信息
          let tmp_data = goods_base_data.filter(item => item.name == 'brandId')[0];
          tmp_data.sel_data = res.data.goodsBrandList;

          //平台检索属性
          this.search_attr_list = res.data.goodsAttributeList;
          if (res.data.goodsAttributeList.length > 0) {
            res.data.goodsAttributeList.map((item, index) => {
              let sel_data = item.attributeValueList;
              let tar_data = [];
              sel_data.map(item_attr_val => {
                tar_data.push({
                  key: item_attr_val.valueId,
                  name: item_attr_val.attributeValue,
                });
              });
              let initialValue = '';
              if (editData.length > 0) {
                let tar_data = editData.filter(edit_item => edit_item.attributeId == item.attributeId);
                if (tar_data != undefined && tar_data.length != undefined && tar_data.length > 0) {
                  initialValue = tar_data[0].attributeValueId;
                }
              }
              search_attr_data.push({
                type: 'select',
                label: item.attributeName,
                name: `search_attr_${item.attributeId}`,
                placeholder: `${sldComLanguage('请选择')}${item.attributeName}`,
                sel_data: tar_data,
                initialValue: initialValue,
              });
            });
          }
        }
        this.setState({ goods_base_data, search_attr_data });
      },
    });
  };


  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //预览图片
  uploadImgPre = (img) => {
    this.viewImg(true, img.url || img.thumbUrl);
  };

  //上传图片
  uploadImg = (info, filedName) => {
    let { goods_img_data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in goods_img_data) {
        if (goods_img_data[i].name == filedName) {
          goods_img_data[i].fileList = info.fileList;
          break;
        }
      }
      this.setState({ goods_img_data });
    }
  };

  //上传视频
  uploadVideo = (info, filedName) => {
    let { goods_video_data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in goods_video_data) {
        if (goods_video_data[i].name == filedName) {
          goods_video_data[i].fileList = info.fileList;
          break;
        }
      }
      this.setState({ goods_video_data });
    }
  };

  //删除视频
  delVideo = () => {
    let { goods_video_data } = this.state;
    goods_video_data[0].fileList = [];
    this.setState({ goods_video_data });
  };

  //规格上传图片处理(给每个规格值上添加图片)
  uploadImgSpec = ({ fileList }, val) => {
    let { spec_set_data } = this.state;
    let spec_data = spec_set_data[0].sel_data;
    let sel_spec = spec_data.filter(item => item.id == val.specId)[0];
    for (let i in sel_spec.attrList) {
      if (sel_spec.attrList[i].id == val.id) {
        sel_spec.attrList[i].fileList = fileList;
      }
    }
    this.setState({ spec_set_data });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleSaveAllData = () => {
    this.setState({ getEditorContentFlag: true });
  };

  //保存并新增事件
  saveData = (editorCon) => {
    const { dispatch, id } = this.props;
    const { sele_goods_cat_data, spec_data_table, goods_img_data, goods_video_data, spec_set_data, cur_goods_type, other_data, goods_base_data } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let params = {};
          //如果是多规格商品的话，需要直选默认选中一个
          if (spec_data_table.list.length > 0) {
            let selectedNum = 0;
            for (let skuI in spec_data_table.list) {
              if (spec_data_table.list[skuI].isDefault) {
                selectedNum += 1;
                break;
              }
            }
            if (selectedNum == 0) {
              failTip('多规格商品需要设置默认选中数据');
              return false;
            }
          }
          if (goods_video_data[0].fileList.length > 0) {
            params.goodsVideo = goods_video_data[0].fileList[0].response.data.path;//视频
          }
          params.categoryId3 = sele_goods_cat_data[2].categoryId;//是否是虚拟商品：1-实物商品；2-虚拟商品,默认1
          params.isVirtualGoods = values.isVirtualGoods;//商品类型
          if (params.isVirtualGoods == 2) {
            //虚拟商品
            params.afterSaleService = values.afterSaleService;//售后服务：0-不支持退款；1-支持退款(虚拟商品必填)
            //用户预留信息的处理
            let target_data = other_data.filter(item => item.name == 'reserveInfoList')[0]['sel_data'];
            if (target_data.length) {
              params.reserveInfoList = [];
              target_data.map(item => {
                params.reserveInfoList.push({
                  reserveName: item.reserveName,
                  reserveType: reserveInfoLimitType().filter(s => s.value == item.reserveType)[0]['key'],
                  isRequired: item.isRequired,
                });
              });
            }
          }
          params.brandId = values.brandId;//品牌ID
          params.goodsName = values.goodsName;
          params.goodsBrief = values.goodsBrief;//商品广告语
          params.state = values.state;//发布状态：1-待刊登；2-直接刊登,默认1

          params.productList = [];

          //店铺分类的处理
          params.storeInnerLabelList = this.sel_cat_data;

          //绑定的商品标签
          params.goodsLabelList = [];
          if (values.serviceLabelIds != undefined && values.serviceLabelIds.length > 0) {
            values.serviceLabelIds.map(item => {
              for (let i = 0; i < this.service_list.length; i++) {
                if (item == this.service_list[i].labelId) {
                  params.goodsLabelList.push({
                    goodsLabelId: item,
                    goodsLabelName: this.service_list[i].labelName,
                  });
                  break;
                }
              }
            });
          }

          //属性信息
          params.attributeAndParameter = {};
          params.attributeAndParameter.attributeList = [];//平台检索属性

          //平台检索属性
          if (this.search_attr_list.length > 0) {
            this.search_attr_list.map((item, index) => {
              if (values['search_attr_' + item.attributeId] != undefined && values['search_attr_' + item.attributeId]) {
                //根据属性值id获取属性值
                let cur_attr_val = item.attributeValueList.filter(attr_val => attr_val.valueId == values['search_attr_' + item.attributeId])[0].attributeValue;
                params.attributeAndParameter.attributeList.push({
                  attributeId: item.attributeId,
                  attributeName: item.attributeName,
                  attributeValue: cur_attr_val,
                  attributeValueId: values['search_attr_' + item.attributeId],
                });
              }
            });
          }

          if (spec_data_table.list.length > 0) {
            //规格信息列表,多规格必传
            params.specInfoList = [];
            for (let i in spec_set_data[0].show_data) {
              let item_spec_data = spec_set_data[0].show_data[i];
              let tmp_spec_data = {};//选择的规格数据
              tmp_spec_data.specId = item_spec_data.specId;
              tmp_spec_data.specName = item_spec_data.specName;
              tmp_spec_data.isMainSpec = item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec ? 1 : 0;
              tmp_spec_data.specValueList = [];
              for (let j in item_spec_data.showValList) {
                let tmp_spec_val_data = {};
                tmp_spec_val_data.specValueId = item_spec_data.showValList[j].specValueId;
                tmp_spec_val_data.specValue = item_spec_data.showValList[j].specValue;
                if (item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec) {
                  //如果是图片规格的话需要传图片
                  tmp_spec_val_data.imageList = [];
                  let cur_img_data = goods_img_data.filter(item => item.specValueId == item_spec_data.showValList[j].specValueId)[0].fileList;
                  if (cur_img_data.length == 0) {
                    failTip(`${sldComLanguage('规格值为')}` + item_spec_data.showValList[j].specValue + `${sldComLanguage('的图片组,至少上传一张商品图片')}`);
                    return false;
                  }

                  for (let s in cur_img_data) {
                    let item = cur_img_data[s].response;
                    if (item.state == 200) {
                      tmp_spec_val_data.imageList.push({
                        image: item.data.path,
                        isMain: s == 0 ? 1 : 2,//主图标识[1==主图,2==非主图]
                      });
                    }
                  }

                }
                tmp_spec_data.specValueList.push(tmp_spec_val_data);
              }
              params.specInfoList.push(tmp_spec_data);
            }

            //货品列表--启用规格必填
            for (let sku in spec_data_table.list) {
              let sku_item = spec_data_table.list[sku];
              let sku_data = {};//每个sku的数据

              sku_data.specInfoList = [];
              for (let spec in sku_item.spec_info) {
                let spec_data = {};
                spec_data.specId = sku_item.spec_info[spec].specId;
                spec_data.specName = sku_item.spec_info[spec].specName;
                spec_data.specValueId = sku_item.spec_info[spec].specValueId;
                spec_data.specValue = sku_item.spec_info[spec].specValue;
                sku_data.specInfoList.push(spec_data);
              }

              sku_data.marketPrice = sku_item.marketPrice;
              sku_data.productPrice = sku_item.productPrice;
              sku_data.weight = sku_item.weight;
              sku_data.length = sku_item.length;
              sku_data.width = sku_item.width;
              sku_data.height = sku_item.height;
              sku_data.barCode = sku_item.barCode;
              sku_data.state = sku_item.state;//是否启用，1-启用；2-不启用
              sku_data.isDefault = sku_item.isDefault;//是否默认货品：0-否；1-是，只有一个默认，如果未设置默认，则默认第一个货品

              params.productList.push(sku_data);
            }

          } else {
            //spu信息，有sku的话可不填
            params.marketPrice = values.marketPrice;//市场价
            params.productPrice = values.goodsPrice;//销售价
            params.weight = values.weight;//重量kg
            params.length = values.length;//长度cm
            params.width = values.width;//宽度cm
            params.height = values.height;//高度cm
            params.barCode = values.barCode;//条形码
          }

          params.goodsDetails = editorCon;//商品描述—富文本内容

          //图片信息
          params.imageList = [];
          let goods_data = goods_img_data[0].fileList;
          if (goods_data.length == 0) {
            failTip(`${sldComLanguage('至少上传一张商品图片')}`);
            this.setNavStep(3);
            return false;
          }
          for (let i in goods_data) {
            let item = goods_data[i].response;
            if (item.state == 200) {
              params.imageList.push({
                image: item.data.path,
                isMain: i == 0 ? 1 : 2,//主图标识[1==主图,2==非主图]
              });
            }
          }
          this.setState({ pageLoading: true });
          let dis_type = '';
          if (id != undefined && id) {
            //编辑商品
            params.platformGoodsId = id * 1;
            dis_type = 'goods_platform/edit_goods';
          } else {
            //新增商品
            dis_type = 'goods_platform/add_goods';
          }
          dispatch({
            type: dis_type,
            payload: params,
            callback: (res) => {
              sthis.setState({ pageLoading: false });
              if (res.state == 200) {
                sucTip(res.msg, 1);
                //如果是新增，清空数据继续新增，否则返回上一页
                if (id != undefined && id) {
                  setTimeout(() => {
                    this.props.back();
                  }, 500);
                } else {
                  this.clearData();
                }
              } else {
                failTip(res.msg);
              }
            },
          });
        } else {
          //商品名称的检测
          if (err.goodsName != undefined) {
            this.setNavStep(2);
            return;
          }
          //虚拟商品——用户预留信息的检测
          if (cur_goods_type == 2) {
            for (let i in err) {
              if (i.indexOf('reserveName') > -1) {
                this.setState({
                  top_nav_step: 2,
                }, () => {
                  if (this.refs.other_info_position.offsetTop != undefined && this.refs.other_info_position.offsetTop) {
                    this.refs.scrollbars.scrollTop(this.refs.other_info_position.offsetTop + 430);
                  }
                });
                return;
              }
            }
          }
          //spu价格、库存的检测
          if (err.goodsPrice != undefined) {
            this.setNavStep(3);
            return;
          }
          //sku价格、库存的检测
          for (let i in err) {
            if (i.indexOf('productPrice') > -1) {
              this.setNavStep(3);
              return;
            }
          }
        }
      },
    );
  };

  //清空页面已有数据
  clearData = () => {
    let { goods_base_data, goods_video_data, spec_data_table, spec_set_data, spu_data_table } = this.state;
    this.search_attr_list = [];
    //品牌信息
    let tmp_data = goods_base_data.filter(item => item.name == 'brandId')[0];
    tmp_data.sel_data = [];
    //清空视频信息
    goods_video_data[0].fileList = [];
    goods_video_data[0].img_succ_info = {};
    spec_data_table.list = [];//清空sku数据
    //清空spu数据 start
    spu_data_table = {
      list: [{
        marketPrice: '',
        goodsPrice: '',
        weight: 1,
        length: 1,
        width: 1,
        height: 1,
        barCode: '',
      }],
      pagination: { current: 1, pageSize: 2, total: 0 },
    };
    //清空spu数据 end

    //清空规格数据 start
    spec_set_data[0].sel_data = [];
    spec_set_data[0].show_data = [];
    spec_set_data[0].disable = false;
    spec_set_data[0].is_add_spec = false;
    //清空规格数据 end
    this.initSpuGoodsImaData();
    this.getSystemCat(1, 0);//获取平台分类
    this.get_spec_list();//获取规格列表
    this.setState({
      top_nav_step: 1,
      step: 1,
      sele_goods_cat_data: [],//选择的商品分类信息
      cur_data: [],//分类当前选中的数据
      search_attr_data: [],//检索属性列信息
      goods_base_data,
      goods_video_data,
      spec_data_table,
      spec_set_data,
      spu_data_table,
    });
    this.props.form.resetFields();
  };

  //设置发布商品顶部的步骤
  setNavStep = (val) => {
    let { top_nav_step } = this.state;
    if (top_nav_step != val) {
      this.setState({
        top_nav_step: val,
      });
    }
  };

  //返回上个页面
  backPre = () => {
    this.props.history.goBack();
  };

  //下一步，填写商品信息事件
  sldAddGoodsSecond = () => {
    //选择的分类显示在页面上
    let { goods_base_data, sele_goods_cat_data } = this.state;
    for (let i in goods_base_data) {
      if (goods_base_data[i].name == 'goods_cat') {
        goods_base_data[i].initialValue = '';
        for (let j in sele_goods_cat_data) {
          goods_base_data[i].initialValue += sele_goods_cat_data[j].categoryName;
          if (j < sele_goods_cat_data.length - 1) {
            goods_base_data[i].initialValue += ' > ';
          }
        }
        break;
      }
    }
    this.setState({ goods_base_data, sele_goods_cat_data, step: 2, top_nav_step: 2 });
  };

  //分类选择弹窗确认事件
  sldHandleConfirm = (val) => {
  };

  //分类选择取消事件
  sldCancle = () => {
    this.setState({ modalVisible: false });
  };

  operateCurNavStep = (step_val) => {
    if (this.state.step == 1) {
      failTip(`${sldComLanguage('只有三级分类才可发布商品,请先选择分类')}`);
      return;
    }
    this.setState({
      top_nav_step: step_val,
    });
  };

  //获取编辑器内容
  getEditorContent = (con) => {
    this.saveData(con);
    this.setState({ getEditorContentFlag: false });
  };

  render() {
    const { goods_base_data, spec_data_table, columns_spec, preview_img, preview_alt_con, show_preview_modal, modal_width, goods_img_data, spec_set_data, goods_cat, sele_goods_cat_data, cur_data, other_data, top_nav_step, spu_data_table, columns_spu, pageLoading, step, search_attr_data, show_radio_flag, goods_video_data, initEditorFlag, getEditorContentFlag, initEditorContent  } = this.state;
    const { id } = this.props;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative', padding: 0 }}>
        <Spin spinning={pageLoading}>
          <div className={`${global.add_goods_top_nav} ${global.flex_row_start_center}`}>
            <div
              className={`${global.top_nav_item} ${global.step1} ${global.right_row} ${top_nav_step >= 1 ? global.finished : null}`}>
              <div className={`${global.step} ${global.flex_row_start_center}`}>
                <div className={`${global.left} ${global.flex_row_center_center}`}>1</div>
                <div className={`${global.right} ${global.flex_column_center_start}`}>
                  <span className={`${global.title}`}>{sldComLanguage('商品分类')}</span>
                  <span className={`${global.sub_title}`}>{sldComLanguage('请选择商品分类,只有三级分类才能发布商品')}</span>
                </div>
              </div>
            </div>
            <div
              className={`${global.top_nav_item} ${global.step2} ${global.left_row} ${global.right_row} ${top_nav_step >= 2 ? global.finished : null}`}
              onClick={() => this.operateCurNavStep(2)}>
              <div className={`${global.step} ${global.flex_row_start_center}`}>
                <div className={`${global.left} ${global.flex_row_center_center}`}>2</div>
                <div className={`${global.right} ${global.flex_column_center_start}`}>
                  <span className={`${global.title}`}>{sldComLanguage('基本信息')}</span>
                  <span className={`${global.sub_title}`}>{sldComLanguage('填写商品基本信息,品牌信息以及筛选属性')}</span>
                </div>
              </div>
            </div>
            <div className={`${global.top_nav_item} ${global.left_row} ${top_nav_step >= 3 ? global.finished : null}`}
                 onClick={() => this.operateCurNavStep(3)}>
              <div className={`${global.step} ${global.flex_row_start_center}`} style={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 3,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 3,
              }}>
                <div className={`${global.left} ${global.flex_row_center_center}`}>3</div>
                <div className={`${global.right} ${global.flex_column_center_start}`}>
                  <span className={`${global.title}`}>{sldComLanguage('商品详情')}</span>
                  <span className={`${global.sub_title}`}>{sldComLanguage('设置规格信息,上传商品图片并完善商品详情')}</span>
                </div>
              </div>
            </div>
          </div>
          {step == 1
            ? <SelGoodsCat
              data={goods_cat}
              cur_data={cur_data}
              sldHandleGoodsCat={this.sldHandleGoodsCat}
              sldAddGoodsSecond={this.sldAddGoodsSecond}
              sele_goods_cat_data={sele_goods_cat_data}
            />
            : <Form onSubmit={() => this.handleSaveAllData()} layout="inline">
              <Scrollbars
                ref={'scrollbars'}
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 290}>
                <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                  <div style={{ display: top_nav_step == 2 ? 'block' : 'none' }}>

                    <div>
                      {sldCommonTitleByBg(`${sldComLanguage('基本信息')}`)}
                      {getSldEmptyH(10)}
                      {show_radio_flag &&
                      <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                                      data={goods_base_data}/>
                      }
                    </div>

                    {search_attr_data.length > 0 &&
                    <Fragment>
                      {getSldEmptyH(10)}
                      {sldCommonTitleByBg(`${sldComLanguage('检索属性')}`)}
                      {getSldEmptyH(10)}
                      <SldTableRowTwo form={this.props.form} data={search_attr_data}/>
                    </Fragment>
                    }

                    <Fragment>
                      {getSldEmptyH(10)}
                      <div ref={'other_info_position'}>
                        {sldCommonTitleByBg(`${sldComLanguage('其他信息')}`)}
                      </div>
                      {getSldEmptyH(10)}
                      {show_radio_flag &&
                      <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                                      data={other_data}/>
                      }
                    </Fragment>
                  </div>
                  <div style={{ display: top_nav_step == 3 ? 'block' : 'none' }}>
                    <div>
                      {sldCommonTitleByBg(`${sldComLanguage('商品规格')}`)}
                      {getSldEmptyH(10)}
                      <SldTableSingleRow part_width={100} lwidth={10} rwidth={90}
                                         form={this.props.form}
                                         data={spec_set_data}/>

                    </div>

                    {spec_data_table.list != undefined && spec_data_table.list.length > 0
                      ? <Fragment>
                        {/*可编辑表格-start this.props.global.leftWidth暂时换成150 */}
                        {getSldEmptyH(10)}
                        <div className={global.add_goods_sku_list}>
                          <Table pagination={false} columns={columns_spec} dataSource={spec_data_table.list}
                                 scroll={{ x: 1500, y: 300 }} size={'small'}/>
                        </div>
                      </Fragment>
                      : <Fragment>
                        {/* spu价格信息 */}
                        {getSldEmptyH(10)}
                        <div className={global.add_goods_sku_list}>
                          <Table pagination={false} columns={columns_spu} dataSource={spu_data_table.list}
                                 scroll={{ x: 1500, y: 300 }} size={'small'}/>
                        </div>
                      </Fragment>
                    }
                    {/* 可编辑表格-end*/}

                    {/* 商品图片 */}
                    <div>
                      {getSldEmptyH(10)}
                      {sldCommonTitleByBg(`${sldComLanguage('商品图片')}`)}
                      {getSldEmptyH(10)}
                      <SldTableRowTwo part_width={100} lwidth={10} rwidth={90}
                                      form={this.props.form} data={goods_img_data}/>
                    </div>
                    {/* 商品视频-start */}
                    <div>
                      {getSldEmptyH(10)}
                      {sldCommonTitleByBg(`${sldComLanguage('商品视频')}`)}
                      {getSldEmptyH(10)}
                      <SldTableRowTwo part_width={100} lwidth={10} rwidth={90}
                                      form={this.props.form} data={goods_video_data}/>
                    </div>
                    {/* 商品视频-end */}
                    {/* 商品详情描述 */}
                    <div>
                      {getSldEmptyH(10)}
                      {sldCommonTitleByBg(`${sldComLanguage('商品详情描述')}`)}
                      {getSldEmptyH(10)}
                    </div>
                    <div style={{
                      width: document.body.clientWidth - 209,
                    }}>
                      {initEditorFlag &&
                      <SldUEditor id={'agreement'} getContentFlag={getEditorContentFlag}
                                  getEditorContent={this.getEditorContent} initEditorContent={initEditorContent}/>
                      }
                      {getSldEmptyH(10)}
                    </div>
                  </div>
                </div>

                <div className={global.m_diy_bottom_wrap}
                     style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                  {id != undefined && id &&
                  <div onClick={() => this.props.back()} className={global.add_goods_bottom_btn}>
                    {sldComLanguage('返回')}
                  </div>
                  }
                  <div onClick={() => this.operateCurNavStep(top_nav_step == 2 ? 3 : 2)}
                       className={global.add_goods_bottom_btn}>
                    {top_nav_step == 2 ? `${sldComLanguage('下一步')}` : `${sldComLanguage('上一步')}`}
                  </div>

                  {!(id != undefined && id) &&
                  <div onClick={() => this.handleSaveAllData()}
                       className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                    {sldComLanguage('发布')}
                  </div>
                  }
                  {(id != undefined && id) &&
                  <div onClick={() => this.handleSaveAllData()}
                       className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                    {sldComLanguage('保存')}
                  </div>
                  }
                </div>
              </Scrollbars>
            </Form>
          }
        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={modal_width}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
}
