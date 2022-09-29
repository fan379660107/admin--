import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  isEmptyObject,
  validatorNumbe,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  list_com_page_more,
  showMoreHelpTip,
  getSldEmptyH,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import CommonSeleMore from '@/components/SldSelMore';

let pageSize = list_com_page_more;
let sthis = '';
@connect(({ product,common }) => ({
  product,common
}))
@Form.create()
export default class CateLists extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      expandedRowKeys: [],//展开的行
      show_table_modal_add: false,//是否显示input后缀搜索modal上的新增按钮，默认不显示
      modalSldAddVisible: false,//是否显示input后缀add的modal框，默认不显示
      tablesldSAddTitle: `${sldComLanguage('添加')}`,//input后缀add的modal框的标题   添加
      search_add_modal_width: 500,//input后缀add的modal框的宽度
      cur_type: '',//show_list表示表格搜索，add表示添加数据
      cur_operate_type: '',//当前操作对象
      search_modal_width: 600,//默认搜索，modal宽度
      tableTitle: '',
      data: {},
      formValues: {},
      modalTableVisible: false,//选择商品类型弹框
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      disableSelectRowKeys: [],//禁止选择key数组
      modalVisible: false,
      title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,//新增商品分类
      type: 'add',//'add'新增  'edit'编辑
      params: {},//搜索条件
      curData: {},//编辑的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('分类名称')}`,//分类名称
        name: 'categoryName',
        extra:`${sldComLanguage('最多输入6个字')}`,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,//请输入分类名称
        initialValue: '',
        maxLength:6,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,//请输入分类名称
        }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,//排序
        name: 'sort',
        extra: `${sldComLanguage('请输入0~255的数字,值越小,显示越靠前')}`,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      }, ],//modal框的数据
      sele_cat_info: {},//添加/编辑的时候选择的分类信息
      columns: [
        {
          title: `${sldComLanguage('分类名称')}`,//分类名称
          align: 'left',
          dataIndex: 'categoryName',
          width: 200,
        },
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('在售/全部商品')}`,
          dataIndex: 'onSaleGoodsNum',
          align: 'center',
          width: 120,
          render: (text, record) => {
            return <div>{text}/{record.totalGoodsNum}</div>;
          },
        },
        {
          title: `${sldComLanguage('分佣比例')}`,//分佣比例
          align: 'center',
          dataIndex: 'scaling',
          width: 100,
          render: (text, record) => {
            return <div>  {record.scaling!=0?((record.scaling*100).toFixed(1)+'%'):'--'} </div>;
          },
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editCat(record))}

              {record.grade <= 2 &&
                <Fragment>
                  <span className={global.splitLine}></span>
                  {sldtbaleOpeBtnText(`${sldComLanguage('添加下级分类')}`, () => this.addNextCat(record))}
                </Fragment>
              }

              {record.children == null &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateCat(record.categoryId, 'del', record), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  sele_type_id = '';//添加分类选中的商品类型id
  cur_edit_id = '';//当前操作数据id
  cur_selectedRows = [];
  cur_selectedRowKeys = [];

  good_bind_data = [{
    type: 'tag_show_btn_sel',
    label: `${sldComLanguage('绑定品牌')}`,//绑定品牌
    name: 'brandIds',
    btn_text: `${sldComLanguage('选择品牌')}`,//选择品牌
    btn_icon: 'jia',
    sel_data: [],//选择的数据
    sel_data_keys: [],//选择的数据id
    initialValue: '',
    main_key: 'brandId',
    main_name: 'brandName',
    btn_callback: () => this.showAllUnit('search_brand_more', 'brandIds'),
    del_tag_callback: (id, name, main_key) => this.del_sel_tag(id, name, main_key),

  }, {
    type: 'tag_show_btn_sel',
    label: `${sldComLanguage('绑定属性')}`,
    name: 'attrIds',
    btn_text: `${sldComLanguage('选择属性')}`,//选择属性
    btn_icon: 'jia',
    sel_data: [],//选择的数据
    sel_data_keys: [],//选择的数据id
    initialValue: '',
    main_key: 'attributeId',
    main_name: 'attributeName',
    btn_callback: () => this.showAllUnit('search_attr_more', 'attrIds'),
    del_tag_callback: (id, name, main_key) => this.del_sel_tag(id, name, main_key),
  },{
    type: 'inputnum',
    label: `${sldComLanguage('分佣比例')}`,//分佣比例
    name: 'scaling',
    extra: `${sldComLanguage('请输入0~100的数字,最多1位小数')}`,
    placeholder: ``,
    initialValue: '',
    formatter: (value)=>`${value}%`,
    min: 0,
    max: 100,
    precision: 1,
    rules: [{
      required: true,
      message: `${sldComLanguage('请输入分佣比例')}`,//请输入分佣比例
    },],
  }];

  cat_data = {
    type: 'TreeSelectDIy',
    label: `${sldComLanguage('上级分类')}`,//上级分类
    name: 'pid',
    placeholder: `${sldComLanguage('请选择')}${sldComLanguage('上级分类')}`,//请选择上级分类
    initialValue: '',
    help: `${sldComLanguage('默认为最顶级')}`,//默认为最顶级
    disabled: false,
    data: [],
    sele_key: 'categoryId',
    sele_name: 'categoryName',
    allowClear: true,
    onSelect: (value, node, extra) => this.sldHandleSelCat(value, node, extra),
  };

  componentDidMount() {
    this.get_list({ categoryId: 0 });//grade为1表示获取一级数据
    this.get_tree_list(0,2);
  }

  componentWillUnmount() {

  }

  //获取分类树数据
  get_tree_list = (pid = 0, grade = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/get_cate_tree_list',
      payload: {pId:pid,grade:grade},
      callback: (res) => {
        this.cat_data.data = res.data
      },
    });
  };

  //获取数据列表
  get_list = (params, grade = '', updateFlag = false) => {
    const { dispatch } = this.props;
    let { data, expandedRowKeys } = this.state;
    dispatch({
      type: 'product/get_cate_list_by_id',
      payload: {...params,pageSize:pageSize},
      callback: (res) => {
        //grade为1直接赋值
        if (grade != '') {
          for (let i in data.list) {
            if (grade == 1) {
              if (data.list[i].categoryId == params.categoryId) {
                if (updateFlag) {
                  data.list[i].children = [res.data.list[0], ...data.list[i].children];
                } else {
                  data.list[i].children = res.data.list;
                }
                break;
              }
            } else {
              if (data.list[i].children != undefined) {
                for (let j in data.list[i].children) {
                  if (data.list[i].children[j].categoryId == params.categoryId) {
                    data.list[i].children[j].children = res.data.list;
                    break;
                  }
                }
              }
            }
          }
        } else {
          if (updateFlag) {
            data.list = [res.data.list[0], ...data.list];
          } else {
            data.list = res.data.list;
          }
        }
        this.setState({
          data: data,
        });
      },
    });
  };

  //显示modal弹框_弹框专属
  showAllUnit = (val,name) => {
    let { tableTitle, search_modal_width,addData,disableSelectRowKeys } = this.state;
    if (val == 'search_brand_more') {
      tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('关联品牌')}`;//请选择关联品牌
      search_modal_width = 800;
    } else if (val == 'search_attr_more') {
      tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('关联属性')}`;//请选择关联属性
      search_modal_width = 800;
    }
    for (let i in addData) {
      if (addData[i].name == name) {
        this.cur_selectedRows = JSON.parse(JSON.stringify(addData[i].sel_data));
        this.cur_selectedRowKeys =JSON.parse(JSON.stringify(addData[i].sel_data_keys));
        disableSelectRowKeys = JSON.parse(JSON.stringify(addData[i].sel_data_keys));
        break;
      }
    }
    this.setState({
      modalTableVisible: true,
      cur_operate_type: val,
      cur_type: 'show_list',
      tableTitle: tableTitle,
      search_modal_width: search_modal_width,
      disableSelectRowKeys,
    });
  };

  del_sel_tag = (id, name, main_key) => {
    let { addData } = this.state;
    for (let i in addData) {
      if (addData[i].name == name) {
        addData[i].sel_data = addData[i].sel_data.filter(item => (item[main_key] != id));
        addData[i].sel_data_keys = addData[i].sel_data_keys.filter(item => item != id);
        this.cur_selectedRows = addData[i].sel_data;
        this.cur_selectedRowKeys = addData[i].sel_data_keys;
        break;
      }
    }
    this.setState({ addData });
  };

  //选择分类事件
  sldHandleSelCat = (value, node, extra) => {
    let { addData } = this.state;
    let tmp_info = node.props.extra;
    addData = addData.filter(item => item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' );
    if (tmp_info.grade > 1) {
      //二三级分类可以添加类型 设置佣金
      for (let i = 0; i < addData.length; i++) {
        if (addData[i].name == 'pid') {
          addData.splice(i + 1, 0, this.good_bind_data[0]);
          addData.splice(i + 2, 0, this.good_bind_data[1]);
          addData.splice(i + 3, 0, this.good_bind_data[2]);
        }
      }
    }
    this.setState({
      sele_cat_info: tmp_info,
      addData,
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };

  //新增功能
  addCat = () => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' );
    for (let i = 0; i < addData.length; i++) {
      addData[i].disabled = false;
      if (addData[i].name == 'categoryName') {
        addData.splice(i + 1, 0, this.cat_data);
        addData[i].initialValue = '';
      } else {
        addData[i].initialValue = '';
      }
    }
    this.sele_type_id = '';
    this.cur_selectedRows = [];
    this.cur_selectedRowKeys = [];
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,
      addData,
      sele_cat_info: {},
    });//添加商品分类
  };

  //添加下级功能
  addNextCat = (val) => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' );
    this.cur_selectedRows = [];
    this.cur_selectedRowKeys = [];
    //清空之前选择的数据
    this.good_bind_data.map((item,index)=>{
      if(this.good_bind_data[index].name == 'brandIds'||this.good_bind_data[index].name == 'attrIds'){
        this.good_bind_data[index].sel_data = [];
        this.good_bind_data[index].sel_data_keys = [];
      }
    });
    for (let i = 0; i < addData.length; i++) {
      if (addData[i].name == 'categoryName') {
        addData.splice(i + 1, 0, this.cat_data);
        if (val.grade == 2) {
          addData.splice(i + 2, 0, this.good_bind_data[0]);
          addData.splice(i + 3, 0, this.good_bind_data[1]);
          addData.splice(i + 4, 0, this.good_bind_data[2]);
        }
        addData[i].initialValue = '';
      } else {
        if (addData[i].name == 'pid') {
          addData[i].initialValue = val.categoryName;
          addData[i].disabled = true;
        } else {
          addData[i].initialValue = '';
        }
      }
    }
    this.sele_type_id = '';
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加')}${sldComLanguage('下级分类')}`,
      addData,
      sele_cat_info: val,
    });//添加下级分类
  };

  //编辑商品分类
  editCat = (val) => {
    let { addData } = this.state;
    addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' );
    for (let i = 0; i < addData.length; i++) {
      if (addData[i].name == 'categoryName') {
        addData[i].initialValue = val[addData[i].name];
        if (val.grade == 3) {
          addData.splice(i + 1, 0, this.good_bind_data[0]);
          addData.splice(i + 2, 0, this.good_bind_data[1]);
          addData.splice(i + 3, 0, this.good_bind_data[2]);
        }
      } else if (addData[i].name == 'scaling') {
        addData[i].initialValue = (val[addData[i].name]*100).toFixed(1);
      } else {
        if(addData[i].name == 'brandIds'){
          addData[i].sel_data = val.goodsBrandList;
          addData[i].sel_data_keys = [];
          val.goodsBrandList.map(item=>{
            addData[i].sel_data_keys.push(item.brandId);
          });
        }else if(addData[i].name == 'attrIds'){
          addData[i].sel_data = val.goodsAttributeList;
          addData[i].sel_data_keys = [];
          val.goodsAttributeList.map(item=>{
            addData[i].sel_data_keys.push(item.attributeId);
          });
        }else{
          addData[i].initialValue = val[addData[i].name];
        }
      }
    }
    this.sele_type_id = '';
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑')}${sldComLanguage('商品分类')}`,//编辑商品分类
      addData: addData,
      modalVisible: true,
      curData: val,
      sele_cat_info: { grade: val.grade },
    });
  };

  //分类操作事件 type add:添加 edit:编辑 del:删除 cache:更新分类缓存 curItemData:为当前操作数据
  operateCat = (id, type, curItemData = '') => {
    let params = {};
    const { dispatch } = this.props;
    let { data, sele_cat_info } = this.state;
    curItemData = curItemData ? curItemData : sele_cat_info;
    let dis_type = '';
    if (type == 'add') {
      dis_type = 'product/add_goods_cat';
      params = id;
    } else if (type == 'edit') {
      dis_type = 'product/edit_goods_cat';
      params = id;
    } else if (type == 'del') {
      dis_type = 'product/del_goods_cat';
      params.categoryId = id;
    } else if (type == 'cache') {
      dis_type = 'common/update_goods_cat_cache';
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          if (type == 'add') {
            //直接追加数据
            if (params.pid == 0) {
              //新增一级分类
              this.get_list({ categoryId: 0 }, '', true);//表示新增一级分类
            } else {
              this.get_list({ categoryId: params.pid }, sele_cat_info.grade, true);
            }
          } else if (type == 'edit') {
            //直接更新当前数据
            curItemData = { ...curItemData, ...params };
            if (curItemData.grade == 1) {
              //更新第一级数据
              let temp = data.list.filter(item => item.categoryId == id.categoryId)[0];
              for (let s in params) {
                temp[s] = params[s];
              }
            } else if (curItemData.grade == 2) {
              //更新第二级数据
              let tempPData = data.list.filter(item => item.categoryId == curItemData.pid)[0];//更新数据的父级数据
              let temp = tempPData.children.filter(item => item.categoryId == id.categoryId)[0];//更新的数据
              for (let h in params) {
                temp[h] = params[h];
              }
            } else {
              //更新第三级数据，因为有属性数据，所有从接口获取
              this.get_list({ categoryId: curItemData.pid }, 2);
            }
          } else if (type == 'del') {
            //根据上级id，获取上级的所有下级，然后删除当前数据，要注意，只有一条数据的时候要将上级的children置为null
            if (curItemData.grade == 1) {
              //删除第一级数据
              data.list = data.list.filter(item => item.categoryId != id);
            } else if (curItemData.grade == 2) {
              //删除第二级数据
              let tempPData = data.list.filter(item => item.categoryId == curItemData.pid)[0];//删除数据的父级数据
              tempPData.children = tempPData.children.filter(item => item.categoryId != id);//过滤掉要删除的数据
              if (tempPData.children.length == 0) {
                tempPData.children = null;
              }
            } else {
              a:for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].children && data.list[i].children.length != undefined && data.list[i].children.length) {
                  for (let j = 0; j < data.list[i].children.length; j++) {
                    //删除第三级数据
                    if (data.list[i].children[j].categoryId == curItemData.pid) {
                      let tempPData = data.list[i].children[j];//删除数据的父级数据
                      tempPData.children = tempPData.children.filter(item => item.categoryId != id);//过滤掉要删除的数据
                      if (tempPData.children.length == 0) {
                        tempPData.children = null;
                      }
                      break a;
                    }
                  }
                }
              }
            }
          } else if (type == 'switch') {
            //直接更新当前数据
            let temp = data.list.filter(item => item.categoryId == id.categoryId)[0];
            temp.state = id.state;
          }
          this.get_tree_list(0,2);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false, data: JSON.parse(JSON.stringify(data)) });
      },
    });
  };

  sldHandleConfirm = (val) => {
    const { curData, type, sele_cat_info, addData } = this.state;
    let sld_params = {};
    sld_params.categoryName = val.categoryName;
    sld_params.sort = val.sort;
    for (let i in addData) {
      if (addData[i].name == 'brandIds') {
        sld_params.bindBrands = addData[i].sel_data_keys.join(',');
      } else if (addData[i].name == 'attrIds') {
        sld_params.bindAttributes = addData[i].sel_data_keys.join(',');
      }
    }
    if(val.scaling){
      sld_params.scaling = (val.scaling/100).toFixed(3);//分佣比例
    }
    if (type == 'edit') {
      sld_params.categoryId = curData.categoryId;
      sld_params.pid = curData.pid;
      this.operateCat(sld_params, 'edit');
    } else {
      sld_params.pid = isEmptyObject(sele_cat_info) ? 0 : sele_cat_info.categoryId;//父分类id,一级分类==0
      this.operateCat(sld_params, 'add');
    }
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };
  //列表展示对话框隐藏_弹框专属
  sldHandleTableCancle = () => {
    this.setState({ modalTableVisible: false });
  };
  //inout后缀的新增modal框隐藏
  sldHandleAddCancle = () => {
    this.setState({ modalSldAddVisible: false });
  };

  //选中数据的操作_弹框专属
  seleCurData = (selectedRows, selectedRowKeys) => {
    let { cur_operate_type, addData } = this.state;
    if (cur_operate_type == 'search_brand_more') {
      for (let i in addData) {
        if (addData[i].name == 'brandIds') {
          addData[i].sel_data = selectedRows;
          addData[i].sel_data_keys = selectedRowKeys;
          this.cur_selectedRows = JSON.parse(JSON.stringify(addData[i].sel_data));
          this.cur_selectedRowKeys = JSON.parse(JSON.stringify(addData[i].sel_data_keys));
          break;
        }
      }
    } else if (cur_operate_type == 'search_attr_more') {
      for (let i in addData) {
        if (addData[i].name == 'attrIds') {
          addData[i].sel_data = selectedRows;
          addData[i].sel_data_keys = selectedRowKeys;
          this.cur_selectedRows = JSON.parse(JSON.stringify(addData[i].sel_data));
          this.cur_selectedRowKeys = JSON.parse(JSON.stringify(addData[i].sel_data_keys));
          break;
        }
      }
    }
    this.setState({
      addData,
    });
  };

  onExpand = (expanded, record) => {
    let { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.categoryId);
      this.get_list({ categoryId: record.categoryId }, record.grade);
    } else {
      expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
    }
    this.setState({ expandedRowKeys });
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, modalTableVisible, cur_operate_type, tableTitle, cur_type, search_modal_width, show_table_modal_add, modalSldAddVisible, tablesldSAddTitle, search_add_modal_width, expandedRowKeys,disableSelectRowKeys } = this.state;

    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分类管理')}`, 0, 0, 5,``)}
        {showMoreHelpTip(``, [`${sldComLanguage('当分类数据有更新的时候，需点击`更新分类缓存`按钮才能生效')}`], 8, true)}
        {getSldEmptyH(10)}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addCat(), `${sldComLanguage('新增')}`, 7, 0)}
            {sldIconBtn(() => this.operateCat('','cache'), `${sldComLanguage('更新分类缓存')}`, 7, 0, 13, 13, 4, 'shuaxin1')}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-220}
            expandedRowKeys={expandedRowKeys}
            selectedRows={selectedRows}
            data={data}
            rowKey={'categoryId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            sldpagination={false}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
            onExpand={this.onExpand}
          />
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
            zIndex={1}
            width={500}
            title={title}
            submiting={submiting}
            modalVisible={modalVisible}
            sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
            sldHandleCancle={this.sldHandleCancle}
            formItemLayoutModal={formItemLayoutModal}
            content={addData}
          />
          { /*新增/编辑对话框-end*/}

        </Spin>
        {/*input后缀弹出框-start*/}
        <CommonSeleMore
          extraProps={{'disableSelectRowKeys':disableSelectRowKeys,'specilSetCheckBox':true}}
          selectedRows={JSON.parse(JSON.stringify(this.cur_selectedRows))}
          selectedRowKeys={JSON.parse(JSON.stringify(this.cur_selectedRowKeys))}
          modalTableVisible={modalTableVisible}
          cur_operate_type={cur_operate_type}
          tableTitle={tableTitle}
          cur_type={cur_type}
          search_modal_width={search_modal_width}
          sldHandleTableCancle={this.sldHandleTableCancle}
          seleCurData={this.seleCurData}
          show_table_modal_add={show_table_modal_add}
          modalSldAddVisible={modalSldAddVisible}
          tablesldSAddTitle={tablesldSAddTitle}
          search_add_modal_width={search_add_modal_width}
          sldHandleAddCancle={this.sldHandleAddCancle}/>
        {/*input后缀弹出框-end*/}
      </div>
    );
  }
}
