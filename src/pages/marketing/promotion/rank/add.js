import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, Select, Upload, Icon, Switch, TreeSelect, Empty } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  dragSldTableColumn,
  getSldHorLine,
  getSldEmptyH,
  getSldComImg,
  list_com_page_more,
  sldBeforeUpload,
  getLocalStorageStingVal,
  sldHandlePaginationData,
  list_com_page_size_10,
  getTableNum,
  getSldEmptyW,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
  validatorNumbe,
} from '@/utils/utils';
import { sldRankLeft, sldRankRight, sldRankTitleByBg } from '@/utils/utils_v2';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import addRank from '@/assets/css/add_rank.less';
import { apiUrl } from '@/utils/sldconfig.js';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let sthis = '';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { SHOW_PARENT } = TreeSelect;
let pageSize = list_com_page_size_10;
@connect(({ rank, global, project }) => ({
  rank, global, project,
}))
@Form.create()
export default class AddRank extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      currentRankType: 1,//选中的榜单类型
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      query: props.location.query,
      showBindGoods: props.location.query.id != undefined && props.location.query.id > 0 && props.location.query.type == 'edit',//是否展示删除操作
      viewFlag: props.location.query.id != undefined && props.location.query.id > 0 && props.location.query.type == 'view',//是否是查看
      GoodsTablePaginationFlag: false,//商品表格是否允许显示分页信息
      GoodsTableCheckFlag: false,//商品表格是否允许选择标识
      showLoadGoodsModule: false,//是否显示商品模块
      showLoadGoodsSearchModule: false,//是否显示商品搜索模块
      loadGoodsParams: {},//加载商品按钮的搜索条件
      formValues: {},//商品模块的搜索条件
      rankMaxAddGoodsNum: 0,//最大绑定商品数
      bgFileList: [],//背景图
      isFirstLoading: true,//是否第一次加载
      goodsLoading: false,//商品加载
      detail: {},//排行榜详情
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      catData: [],//启用的榜单分类
      goodsCatData: [],//商品分类
      goodsData: { list: [], pagination: {} },//商品数据
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
      }],
      search_data_rank_type_4: [
        {
        type: 'tree_select_single',
        label: `${sldComLanguage('商品分类')}`,
        name: 'goodsCategoryId',
        data: [],
        placeholder: `${sldComLanguage('请选择商品分类')}`,
      }],//自定义榜单类型的筛选条件
      columns: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('商品名称')}`,
          dataIndex: 'goodsImage',
          align: 'center',
          width: 250,
          render: (text, record) => {
            return <div className={`${global.goods_info} ${global.com_flex_row_flex_start}`}>
              <div className={global.goods_img}>{getSldComImg(text, 200, 200, 74, 74)}</div>
              <div className={`${global.com_flex_column_space_between} ${global.goods_detail}`}>
                <span className={global.goods_name} title={record.goodsName}>
                  {record.goodsName}
                </span>
                <span className={global.goods_brief} title={record.categoryPath}>
                  {record.categoryPath}
                </span>
              </div>
            </div>;
          },
        },
        {
          title: `${sldComLanguage('店铺名称')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('商品价格(¥)')}`,
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('商品库存')}`,
          dataIndex: 'goodsStock',
          align: 'center',
          width: 100,
        },
      ],
    };
  }

  goodsCatData = [];//商品分类
  columns_rank_type_1 = [
    {
      title: `${sldComLanguage('销量')}`,
      dataIndex: 'saleNum',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('销售额(¥)')}`,
      dataIndex: 'saleAmount',
      align: 'center',
      width: 100,
    }];//畅销榜商品列
  columns_rank_type_2 = [
    {
      title: `${sldComLanguage('好评数')}`,
      dataIndex: 'highNum',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('好评率')}`,
      dataIndex: 'highRate',
      align: 'center',
      width: 100,
    }];//好评榜商品列
  columns_rank_type_3 = [
    {
      title: `${sldComLanguage('发布时间')}`,
      dataIndex: 'createTime',
      align: 'center',
      width: 120,
    },
  ];//新品榜商品列
  columns_rank_type_4 = [
    {
      title: `${sldComLanguage('品牌名称')}`,
      dataIndex: 'brandName',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return text ? text : '--';
      },
    }, {
      title: `${sldComLanguage('销量')}`,
      dataIndex: 'saleNum',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('销售额(¥)')}`,
      dataIndex: 'saleAmount',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('上榜理由')}`,
      dataIndex: 'rankReason',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <Fragment>
          {(sthis.state.selectedRowKeys.length > 0 && sthis.state.selectedRowKeys.indexOf(record.goodsId) > -1)
            ? <FormItem
              style={{ width: '100%' }}
            >
              {sthis.props.form.getFieldDecorator(`rankReason${record.goodsId}`, {
                initialValue: text, rules: [{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入上榜理由')}`,
                }],
              })(
                <TextArea
                  maxLength={100}
                  placeholder={`${sldComLanguage('请输入上榜理由,最多100字')}`}
                  style={{ width: '100%' }}
                  rows={3}
                  onChange={e => sthis.handleFieldChange(e, 'rankReason', record.goodsId)}
                />,
              )}
            </FormItem>
            : null
          }
        </Fragment>;
      },
    },
  ];//自定义榜商品列
  delete_option = [{
    title: `${sldComLanguage('操作')}`,
    align: 'center',
    dataIndex: 'operation',
    width: 100,
    render: (text, record) => (
      <Fragment>
        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delGoods(record.goodsId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
          sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
      </Fragment>
    ),
  }];//绑定的商品的删除操作

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.getDetail(query.id);
      this.getBindGoodsList(query.id);
    } else {
      this.setState({ isFirstLoading: false });
    }
    this.getCat({ pageSize: list_com_page_more });
    this.getGoodsCat();

    this.checkRankState();
  }

  //商品选中的表格编辑事件
  handleFieldChange(val, fieldName, key) {
    val = val.target.value;
    const { goodsData, selectedRows } = this.state;
    let target1 = goodsData.list.filter(item => item.goodsId == key)[0];
    if (target1) {
      target1[fieldName] = val;
    }
    let target2 = selectedRows.filter(item => item.goodsId == key)[0];
    if (target2) {
      target2[fieldName] = val;
    }
    this.setState({ goodsData, selectedRows });
  }

  //获取可用的榜单分类
  getCat = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rank/get_allowed_label_lists',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          this.setState({
            catData: res.data,
          });
        }
      },
    });
  };

  //获取商品分类
  getGoodsCat = () => {
    const { dispatch } = this.props;
    let { search_data_rank_type_4 } = this.state;
    dispatch({
      type: 'rank/get_goods_cat',
      callback: (res) => {
        if (res.state == 200) {
          for (let i in res.data) {
            res.data[i].key = res.data[i].categoryId;
            res.data[i].value = res.data[i].categoryId;
            res.data[i].title = res.data[i].categoryName;
            if (res.data[i].children != null && res.data[i].children.length > 0) {
              res.data[i].children.map(item => {
                item.key = item.categoryId;
                item.value = item.categoryId;
                item.title = item.categoryName;
                if (item.children != null && item.children.length > 0) {
                  item.children.map(child => {
                    child.key = child.categoryId;
                    child.value = child.categoryId;
                    child.title = child.categoryName;
                  });
                }
              });
            }
          }
          this.goodsCatData = res.data;
          let temp = search_data_rank_type_4.filter(item => item.type == 'tree_select_single');
          temp[0].data = res.data;
          this.setState({
            goodsCatData: res.data,
            search_data_rank_type_4,
          });
        }
      },
    });
  };

  //验证排行榜开关
  checkRankState = () => {
    const { dispatch } = this.props;
    let { rankMaxAddGoodsNum } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'rank_max_add_goods_num' },
      callback: (res) => {
        if (res.state == 200) {
          rankMaxAddGoodsNum = res.data[0].value * 1;
          this.setState({ rankMaxAddGoodsNum, isFirstLoading: false });
        }
      },
    });
  };

  //获取排行榜详情
  getDetail = async (id) => {
    const { dispatch } = this.props;
    let { bgFileList, detail } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'rank/get_rank_detail',
      payload: { rankId: id },
      callback: async (res) => {
        if (res.state == 200) {
          let data = res.data;
          //初始化背景图数据-start
          bgFileList = [];
          if (data.backgroundImage) {
            let tmp_data = {};
            tmp_data.uid = data.backgroundImage;
            tmp_data.name = data.backgroundImage;
            tmp_data.status = 'done';
            tmp_data.url = data.backgroundImageUrl;
            tmp_data.response = {
              data: {
                url: data.backgroundImageUrl,
                path: data.backgroundImage,
              },
            };
            bgFileList.push(tmp_data);
          }
          //初始化背景图数据-end

          detail = res.data;
        }
        this.setState({ isFirstLoading: false, loading: false, detail, bgFileList });
      },
    });
  };

  //获取绑定的榜单商品
  getBindGoodsList = (id) => {
    let { selectedRows, selectedRowKeys, goodsData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'rank/get_rank_bind_goods',
      payload: { rankId: id },
      callback: async (res) => {
        if (res.state == 200) {
          if (res.data.length > 0) {
            selectedRows = res.data;
            selectedRows.map(item => {
              selectedRowKeys.push(item.goodsId);
            });
            goodsData.list = res.data;
          }
          this.setState({
            selectedRows,
            selectedRowKeys,
            goodsData,
            GoodsTablePaginationFlag: false,//商品表格是否允许显示分页信息
            GoodsTableCheckFlag: false,//商品表格是否允许选择标识
            showLoadGoodsModule: true,//是否显示商品模块
          });
        }
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    let { rankMaxAddGoodsNum,selectedRows,selectedRowKeys } = this.state;
    if (rowkeys.length > rankMaxAddGoodsNum * 1) {
      failTip(`${sldComLanguage('您选择的商品超过了最大限制，请重新选择')}～`);
      return false;
    }else{
      if(rowkeys.length>rows.length){
        rows.map(item=>{
          if(selectedRowKeys.indexOf(item.goodsId) == -1){
            selectedRows.push(item);
          }
        })
      }else{
        selectedRows = rows;
      }
    }
    this.setState({
      selectedRows,
      selectedRowKeys: rowkeys,
    });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({ params }, () => {
        this.loadGoods();
      });
    }
  };

  //保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    const { query, bgFileList, selectedRows } = this.state;
    let fileds = ['rankName', 'categoryId', 'sort', 'rankType'];
    let formData = this.props.form.getFieldsValue();
    if (formData.rankType != 4) {
      fileds = fileds.concat(['isAutoUpdate', 'goodsCategoryId', 'statsTime']);
      if (formData.rankType == 1) {
        fileds.push('bestSellerRankRule');
      } else if (formData.rankType == 2) {
        fileds = fileds.concat(['highCommentNum', 'highCommentRate']);
      } else if (formData.rankType == 3) {
        fileds.push('newProductRankRule');
      }
    }
    this.props.form.validateFieldsAndScroll(fileds, (err, values) => {
        if (!err) {
          let dis_type = '';
          if (bgFileList.length > 0 && bgFileList[0].response != undefined && bgFileList[0].response.data != undefined) {
            values.backgroundImage = bgFileList[0].response.data.path;//背景图
          } else {
            values.backgroundImage = '';
          }
          if (values.rankType == 4) {
            values.isAutoUpdate = 0;//是否自动更新：1-自动；0-手动
          } else {
            values.isAutoUpdate = values.isAutoUpdate ? 1 : 0;//是否自动更新：1-自动；0-手动
          }

          if (values.isAutoUpdate == 0) {
            //手动更新的话需要获取商品信息
            if (selectedRows.length == 0) {
              failTip(`${sldComLanguage('请选择商品')}～`);
              return false;
            } else {
              values.goodsList = [];
              selectedRows.map((item, index) => {
                let temp = {
                  goodsId: item.goodsId,
                  goodsRank: index + 1,
                  rankReason: item.rankReason != undefined ? item.rankReason : '',
                };
                values.goodsList.push(temp);
              });
            }
          }

          if (query.id != undefined && query.id > 0 && query.type == 'edit') {
            //编辑排行榜
            values.rankId = query.id;
            dis_type = 'rank/edit_rank';
          } else {
            //新建排行榜
            dis_type = 'rank/add_rank';
          }
          sthis.setState({ loading: true });
          dispatch({
            type: dis_type,
            payload: values,
            callback: (res) => {
              sthis.setState({ loading: false });
              if (res.state == 200) {
                sucTip(res.msg);
                setTimeout(() => {
                  sthis.props.history.goBack();
                }, 500);
              } else {
                failTip(res.msg);
              }
            },
          });
        }
      },
    );
  };

  //商品删除事件
  delGoods = (goodsId) => {
    let { selectedRows, selectedRowKeys, goodsData } = this.state;
    selectedRows = selectedRows.filter(item => item.goodsId != goodsId);
    selectedRowKeys = selectedRowKeys.filter(item => item != goodsId);
    goodsData.list = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
      goodsData,
    });
  };

  //预览图片
  uploadPreview = (info) => {
    this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadChange = (info) => {
    let { bgFileList } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      bgFileList = info.fileList;
    }
    this.setState({ bgFileList });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //获取榜单商品 source 来源  btn:来自于加载榜单商品按钮（formValues要置为空），为空表示搜索或者分页
  loadGoods = (source) => {
    let loadGoodsParams = {};//商品筛选条件
    let formData = this.props.form.getFieldsValue();
    const { dispatch } = this.props;
    let { goodsData, GoodsTableCheckFlag, rankMaxAddGoodsNum, GoodsTablePaginationFlag, showLoadGoodsSearchModule, formValues, params, selectedRows, selectedRowKeys } = this.state;
    let dis_type = 'rank/get_all_rank_goods';
    loadGoodsParams.rankType = formData.rankType;//rankType 榜单类型 1-畅销榜；2-好评榜；3-新品榜；4-自定义
    let fileds = [];//需要验证的字段

    if (formData.rankType == 4) {
      fileds = [];
      showLoadGoodsSearchModule = true;//显示商品搜索模块
      GoodsTableCheckFlag = true;//允许表格商品多选
      GoodsTablePaginationFlag = true;//显示分页信息
    } else {
      fileds = ['goodsCategoryId'];
      if (formData.rankType == 2) {
        fileds = ['goodsCategoryId', 'highCommentNum', 'highCommentRate'];
      }
      //isAutoUpdate 是否自动更新：1-自动；0-手动
      if (formData.isAutoUpdate) {
        //自动更新的话，商品数据只展示，不更新
        showLoadGoodsSearchModule = false;//不显示商品搜索模块
        GoodsTableCheckFlag = false;//不允许表格商品选择
        GoodsTablePaginationFlag = false;//不显示分页信息
        loadGoodsParams.pageSize = rankMaxAddGoodsNum;
      } else {
        showLoadGoodsSearchModule = true;//显示商品搜索模块
        GoodsTableCheckFlag = true;//允许表格商品多选
        GoodsTablePaginationFlag = true;//显示分页信息
        loadGoodsParams.pageSize = pageSize;
      }
    }
    formValues = source ? {} : formValues;//来自于加载榜单商品按钮的话，formValues要置为空
    params = source ? {} : params;//来自于加载榜单商品按钮的话，params要置为空
    selectedRows = source ? [] : selectedRows;//来自于加载榜单商品按钮的话，selectedRows要置为空
    selectedRowKeys = source ? [] : selectedRowKeys;//来自于加载榜单商品按钮的话，selectedRowKeys要置为空
    goodsData = source ? { list: [], pagination: {} } : goodsData;//来自于加载榜单商品按钮的话，goodsData要置为空
    this.props.form.validateFieldsAndScroll(fileds, (err, values) => {
      if (!err) {
        if (loadGoodsParams.rankType != 4) {
          loadGoodsParams.goodsCategoryId = formData.goodsCategoryId;//商品分类id
          loadGoodsParams.statsTime = formData.statsTime;//统计时间：1-近7天；2-近30天
          if (loadGoodsParams.rankType == 1) {
            loadGoodsParams.bestSellerRankRule = formData.bestSellerRankRule;//畅销榜计算规则：1-销量排行；2-销售额排行
          } else if (loadGoodsParams.rankType == 2) {
            loadGoodsParams.highCommentNum = formData.highCommentNum;//好评数
            loadGoodsParams.highCommentRate = formData.highCommentRate;//好评率
          } else if (loadGoodsParams.rankType == 3) {
            loadGoodsParams.newProductRankRule = formData.newProductRankRule;//新品榜计算规则：1-按照商品发布的时间降序排列；2-按照商品发布的时间升序排列
          }
        }
        sthis.setState({ goodsLoading: true });
        dispatch({
          type: dis_type,
          payload: { ...params, ...loadGoodsParams, ...formValues },
          callback: (res) => {
            if (res.state == 200) {
              //如果是自定义榜，需要赋予上榜理由
              goodsData = res.data;
              if(goodsData.list.length > 0){
                goodsData.list.map(item=>{
                  if(selectedRowKeys.indexOf(item.goodsId)>-1){
                    let temp = selectedRows.filter(rows=>rows.goodsId == item.goodsId)[0];
                    item.rankReason = temp.rankReason;
                  }
                });
              }
            } else {
              failTip(res.msg);
            }
            sthis.setState({
              goodsData,
              goodsLoading: false,
              showBindGoods: false,//是否展示删除操作
              showLoadGoodsModule: true,
              GoodsTableCheckFlag,
              GoodsTablePaginationFlag,
              showLoadGoodsSearchModule,
              loadGoodsParams,
              formValues,
              params,
              selectedRows,
              selectedRowKeys,
            });
          },
        });
      }
    });

  };

  //自动更新开关事件
  handleIsAutoUpdateFlag = (e) => {
    this.setState({
      GoodsTableCheckFlag:!e,
      GoodsTablePaginationFlag:!e,
    })
  }

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
    }, () => {
      this.loadGoods();
    });
  };

  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize },
    });
    this.loadGoods({ pageSize: pageSize });
  };

  //榜单类型选择事件
  handleRandType = (e) => {
    this.setState({ goodsData: { list: [], pagination: {} }, selectedRowKeys: [], selectedRows: [] });
  };

  render() {
    const {
      loading, detail, isFirstLoading, catData, goodsCatData, bgFileList, columns, goodsData, selectedRows, goodsLoading, rankMaxAddGoodsNum, showLoadGoodsModule, GoodsTableCheckFlag, GoodsTablePaginationFlag, showLoadGoodsSearchModule, search_data, search_data_rank_type_4, showBindGoods, query, viewFlag, selectedRowKeys, preview_img, show_preview_modal, preview_alt_con,
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    let currentRankType = this.props.form.getFieldValue('rankType');
    let goodsColumn = (showBindGoods && !detail.isAutoUpdate) ? [...columns, ...this['columns_rank_type_' + (currentRankType != undefined ? currentRankType : 1)], ...this.delete_option] : [...columns, ...this['columns_rank_type_' + (currentRankType != undefined ? currentRankType : 1)]];
    goodsColumn = JSON.parse(JSON.stringify(goodsColumn));
    goodsColumn.map(item => {
      if (item.dataIndex == 'goodsImage') {
        item.render = (text, record) => {
          return <div className={`${global.goods_info} ${global.com_flex_row_flex_start}`}>
            <div className={global.goods_img}>{getSldComImg(record.goodsImage, 200, 200, 74, 74)}</div>
            <div className={`${global.com_flex_column_space_between} ${global.goods_detail}`}>
                <span className={global.goods_name} title={record.goodsName}>
                  {record.goodsName}
                </span>
              <span className={global.goods_brief} title={record.categoryPath}>
                  {record.categoryPath}
                </span>
            </div>
          </div>;
        };
      } else if (item.dataIndex == 'brandName') {
        item.render = (text, record) => {
          return text ? text : '--';
        };
      } else if (item.dataIndex == 'rankReason') {
        item.render = (text, record) => {
          return <Fragment>
            {sthis.state.viewFlag
              ? (text ? text : '--')
              : <Fragment>
                {(sthis.state.selectedRowKeys.length > 0 && sthis.state.selectedRowKeys.indexOf(record.goodsId) > -1)
                  ? <FormItem
                    style={{ width: '100%' }}
                  >
                    {sthis.props.form.getFieldDecorator(`rankReason${record.goodsId}`, {
                      initialValue: text, rules: [{
                        required: true,
                        whitespace: true,
                        message: `${sldComLanguage('请输入上榜理由')}`,
                      }],
                    })(
                      <TextArea
                        maxLength={100}
                        placeholder={`${sldComLanguage('请输入上榜理由,最多100字')}`}
                        style={{ width: '100%' }}
                        rows={3}
                        onChange={e => sthis.handleFieldChange(e, 'rankReason', record.goodsId)}
                      />,
                    )}
                  </FormItem>
                  : null
                }
              </Fragment>
            }
          </Fragment>;
        };
      } else if (item.dataIndex == 'operation') {
        item.render = (text, record) => (
          <Fragment>
            {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delGoods(record.goodsId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
              sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
          </Fragment>
        );
      }
    });
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    //页面标题的处理
    let pageTitle = `${sldComLanguage('新建排行榜')}`;
    if (query.type != undefined) {
      if (query.type == 'edit') {
        pageTitle = `${sldComLanguage('编辑排行榜')}`;
      } else {
        pageTitle = `${sldComLanguage('查看排行榜')}`;
      }
    } else {
      pageTitle = `${sldComLanguage('新建排行榜')}`;
    }
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', pageTitle, 0, 0, 10)}
        {getSldHorLine(1)}
        {getSldEmptyH(20)}
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 120}>
              <div
                className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity} ${global.flex_column_start_center}`}>

                {/* 基本信息-start */}
                {!isFirstLoading &&
                <Fragment>
                  {sldRankTitleByBg(`${sldComLanguage('基本信息')}`)}
                  <div className={addRank.sld_det_lr_wrap}>
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(true, '榜单名称', 1)}
                      {sldRankRight(<FormItem
                        extra={`${sldComLanguage('最多输入10个字')}`}
                        style={{ width: 300 }}
                      >
                        {getFieldDecorator('rankName', {
                          initialValue: detail.rankName, rules: [{
                            required: true,
                            whitespace: true,
                            message: `${sldComLanguage('请输入榜单名称')}`,
                          }],
                        })(
                          <Input disabled={viewFlag} maxLength={10} style={{ width: 400 }}
                                 placeholder={`${sldComLanguage('请输入榜单名称')}`}/>,
                        )}
                      </FormItem>, 1)}
                    </div>


                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(true, '关联分类', 0)}
                      {sldRankRight(<FormItem>
                        {getFieldDecorator('categoryId', {
                          initialValue: detail.categoryId?detail.categoryId:undefined,
                          rules: [{
                            required: true,
                            message: `${sldComLanguage('请选择关联分类')}`,
                          }],
                        })(
                          <Select disabled={viewFlag} placeholder={`${sldComLanguage('请选择关联分类')}`}
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                                  style={{ width: 400 }}
                          >
                            {catData.map((item, index) => {
                              return <Option key={index}
                                             value={item.categoryId}>{item.categoryName}</Option>;
                            })}
                          </Select>,
                        )}
                      </FormItem>, 0)}
                    </div>


                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(true, '排序', 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 300 }}
                        extra={`${sldComLanguage('请输入0~255的数字,值越小显示越靠前')}`}
                      >
                        {getFieldDecorator('sort', {
                          initialValue: detail.sort, rules: [{
                            required: true,
                            message: `${sldComLanguage('请输入排序')}`,
                          }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
                        })(
                          <InputNumber disabled={viewFlag} max={255} min={0} precision={0} style={{ width: 400 }}
                                       placeholder={`${sldComLanguage('请输入排序')}`}/>,
                        )}
                      </FormItem>, 0)}
                    </div>

                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`} style={{
                      width: 1000,
                    }}>
                      {sldRankLeft(false, '背景图', 0, 150)}
                      {!viewFlag && sldRankRight(<FormItem
                        style={{ width: 400 }}
                        extra={`${sldComLanguage('建议上传【宽750*高354】的图片，支持gif，jpeg，jpg，png格式的图片')}`}
                      >
                        <div className={`${global.flex_row_start_start}`}>
                          <Upload
                            withCredentials={true}
                            beforeUpload={sldBeforeUpload}
                            accept={'.gif, .jpeg, .png,.jpg,'}
                            name={'file'}
                            action={apiUrl + `v3/oss/common/upload?source=setting`}
                            listType="picture-card"
                            fileList={bgFileList}
                            onPreview={(info) => this.uploadPreview(info)}
                            onChange={(info) => this.uploadChange(info)}
                            headers={{
                              Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                            }}
                          >
                            {bgFileList.length >= 1 ? null : uploadButton}
                          </Upload>
                        </div>
                      </FormItem>, 0, 150)}
                      {viewFlag && sldRankRight(<FormItem
                        style={{ width: 400 }}
                      >
                        {detail.backgroundImageUrl
                          ? getSldComImg(detail.backgroundImageUrl, 400, 400, 110, 110)
                          : '--'
                        }
                      </FormItem>, 0, 150)}
                    </div>
                  </div>
                  {/* 基本信息-end */}

                  {/* 生成榜单-start */}
                  {getSldEmptyH(20)}
                  {sldRankTitleByBg(`${sldComLanguage('生成榜单')}`)}
                  <div className={addRank.sld_det_lr_wrap}>
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(true, '榜单类型', 1)}
                      {sldRankRight(<FormItem
                        style={{ width: 300 }}
                      >
                        {getFieldDecorator('rankType', {
                          initialValue: detail.rankType != undefined ? detail.rankType * 1 : 1,
                        })(
                          <RadioGroup disabled={viewFlag} size={'small'} buttonStyle="solid"
                                      onChange={this.handleRandType}>
                            <Radio.Button value={1}>{sldComLanguage('畅销榜')}</Radio.Button>
                            <Radio.Button value={2}>{sldComLanguage('好评榜')}</Radio.Button>
                            <Radio.Button value={3}>{sldComLanguage('新品榜')}</Radio.Button>
                            <Radio.Button value={4}>{sldComLanguage('自定义')}</Radio.Button>
                          </RadioGroup>,
                        )}
                      </FormItem>, 1)}
                    </div>


                    {currentRankType != 4 &&
                    <Fragment>
                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(true, '商品品类', 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('goodsCategoryId', {
                            initialValue: detail.goodsCategoryId != undefined ? detail.goodsCategoryId : [], rules: [{
                              required: true,
                              message: `${sldComLanguage('请选择生成榜单的商品分类')}`,
                            }],
                          })(
                            <TreeSelect disabled={viewFlag} treeData={goodsCatData} onChange={null}
                                        showCheckedStrategy={SHOW_PARENT} placeholder={sldComLanguage('请选择生成榜单的商品分类')}
                                        style={{ width: 400 }}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        dropdownStyle={{ maxHeight: 300 }}
                            />,
                          )}
                        </FormItem>, 0)}
                      </div>


                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(true, '统计时间', 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('statsTime', {
                            initialValue: detail.statsTime != undefined ? detail.statsTime * 1 : 1,
                          })(
                            <RadioGroup disabled={viewFlag} size={'small'}>
                              <Radio value={1}>{sldComLanguage('近7天')}</Radio>
                              <Radio value={2}>{sldComLanguage('近30天')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>, 0)}
                      </div>


                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(true, sldComLanguage('计算规则'), 0, currentRankType == 2 ? 120 : 72)}

                        {/*畅销榜-start*/}
                        {currentRankType == 1 &&
                        <Fragment>
                          {sldRankRight(<FormItem
                            style={{ width: 300 }}
                          >
                            {getFieldDecorator('bestSellerRankRule', {
                              initialValue: detail.bestSellerRankRule != undefined ? detail.bestSellerRankRule * 1 : 1,
                            })(
                              <RadioGroup disabled={viewFlag} size={'small'}>
                                <Radio value={1}>{sldComLanguage('销量排行')}</Radio>
                                <Radio value={2}>{sldComLanguage('销售额排行')}</Radio>
                              </RadioGroup>,
                            )}
                          </FormItem>, 0)}
                        </Fragment>
                        }
                        {/*畅销榜-end*/}


                        {/*好评榜-start*/}
                        {currentRankType == 2 &&
                        <Fragment>
                          {sldRankRight(<div className={global.flex_column_center_start}>
                            <FormItem
                              style={{ width: 300 }}
                              extra={`${sldComLanguage('请输入1-1000的整数')}`}
                            >
                              <div className={global.flex_row_start_center}>
                                <span style={{ display: 'inline-block', marginRight: 5, color: 'rgba(0, 0, 0, 0.65)' }}>
                                  {sldComLanguage('好评数不低于')}
                                </span>
                                {getFieldDecorator('highCommentNum', {
                                  initialValue: detail.highCommentNum, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('请输入好评数')}`,
                                  }],
                                })(
                                  <InputNumber disabled={viewFlag} max={1000} min={1} precision={0}
                                               style={{ width: 140 }}
                                               placeholder={`${sldComLanguage('请输入好评数')}`}/>,
                                )}
                                <span style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>
                                  {sldComLanguage('条')}
                                </span>
                              </div>
                            </FormItem>
                            <FormItem
                              style={{ width: 300 }}
                              extra={`${sldComLanguage('请输入1-100的整数')}`}
                            >
                              <div className={global.flex_row_start_center}>
                                <span style={{ display: 'inline-block', marginRight: 5, color: 'rgba(0, 0, 0, 0.65)' }}>
                                  {sldComLanguage('好评率不低于')}
                                </span>
                                {getFieldDecorator('highCommentRate', {
                                  initialValue: detail.highCommentRate, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('请输入好评率')}`,
                                  }],
                                })(
                                  <InputNumber disabled={viewFlag} max={100} min={1} precision={0}
                                               style={{ width: 140 }}
                                               placeholder={`${sldComLanguage('请输入好评率')}`}/>,
                                )}
                                <span style={{ display: 'inline-block', marginLeft: 5, color: 'rgba(0, 0, 0, 0.65)' }}>
                                  %
                                </span>
                              </div>
                            </FormItem>
                          </div>, 0, 120)}
                        </Fragment>
                        }
                        {/*好评榜-end*/}

                        {/*新品榜-start*/}
                        {currentRankType == 3 &&
                        <Fragment>
                          {sldRankRight(<FormItem
                            style={{ width: 300 }}
                          >
                            {getFieldDecorator('newProductRankRule', {
                              initialValue: detail.newProductRankRule != undefined ? detail.newProductRankRule * 1 : 1,
                            })(
                              <RadioGroup disabled={viewFlag} size={'small'}>
                                <Radio value={1}>{sldComLanguage('按照商品发布的时间降序排列')}</Radio>
                                <Radio value={2}>{sldComLanguage('按照商品发布的时间升序排列')}</Radio>
                              </RadioGroup>,
                            )}
                          </FormItem>, 0)}
                        </Fragment>
                        }
                        {/*新品榜-end*/}

                      </div>

                      <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                        {sldRankLeft(true, '自动更新', 0)}
                        {sldRankRight(<FormItem
                          style={{ width: 500 }}
                          extra={`${sldComLanguage('开启自动更新后榜单数据每日更新1次。关闭自动更新后榜单数据可手动进行更新。')}`}
                        >
                          {getFieldDecorator('isAutoUpdate', {
                            valuePropName: 'checked',
                            initialValue: detail.isAutoUpdate != undefined ? Boolean(detail.isAutoUpdate * 1) : true,
                          })(
                            <Switch disabled={viewFlag} onChange={(e) => this.handleIsAutoUpdateFlag(e)}/>,
                          )}
                        </FormItem>, 0)}
                      </div>
                    </Fragment>
                    }

                    {!viewFlag &&
                    <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                      {sldRankLeft(false, '  ', 0)}
                      {sldRankRight(<FormItem
                        style={{ width: 400 }}
                      >
                        <div onClick={() => this.loadGoods('btn')} className={promotion.rank_load_goods_btn}>加载榜单商品
                        </div>
                      </FormItem>, 0)}
                    </div>
                    }

                  </div>
                  {/* 生成榜单-end */}

                  {/* 榜单商品-start */}
                  {showLoadGoodsModule &&
                  <div className={`${global.flex_column_start_center} ${addRank.add_rank_goods_wrap}`}>
                    <div className={`${addRank.add_rank_goods_title} ${global.flex_row_start_center}`}>
                      <span className={addRank.add_rank_goods_title_con}>{sldComLanguage('榜单商品')}</span>
                      {getSldEmptyW(15)}
                      {(this.props.form.getFieldValue('rankType') == 4 || (this.props.form.getFieldValue('rankType') != 4 && !this.props.form.getFieldValue('isAutoUpdate'))) &&
                      <Fragment>
                        <span className={addRank.add_rank_goods_title_con}>{sldComLanguage('已选')}</span>
                        <span className={addRank.add_rank_goods_title_con}
                              style={{ color: '#FF6A12' }}>{selectedRowKeys.length}</span>
                        <span className={addRank.add_rank_goods_title_con}>{sldComLanguage('款商品')}，</span>
                      </Fragment>
                      }
                      <span
                        className={addRank.add_rank_goods_title_con}>{sldComLanguage('最多可绑定')}{rankMaxAddGoodsNum}款{sldComLanguage('商品')}</span>
                    </div>
                    {showLoadGoodsSearchModule &&
                    <div className={`${global.tableListForm} ${addRank.add_rank_search_goods_wrap}`}>
                      <Search
                        search_data={currentRankType == 4 ? [...search_data, ...search_data_rank_type_4] : search_data}
                        seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
                    </div>
                    }
                    <Spin spinning={goodsLoading}>
                      {/*标准表格-start*/}
                      <div className={`${global.flex_row_start_start}`}>
                        {getSldEmptyW(20)}
                        <StandardTable
                          width={960}
                          totalHeight={500}
                          bordered={false}
                          selectedRowKeys={selectedRowKeys}
                          selectedRows={selectedRows}
                          data={goodsData}
                          rowKey={'goodsId'}
                          isCheck={GoodsTableCheckFlag}
                          columns={goodsColumn}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          onSldHandleSeleRow={this.onSldHandleSeleRow}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize={true}
                          sldpagination={GoodsTablePaginationFlag}
                        />
                      </div>
                      {getSldEmptyH(20)}
                      {/*标准表格-end*/}
                    </Spin>
                  </div>
                  }
                  {/* 榜单商品-end */}

                </Fragment>
                }
              </div>

              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                  {sldComLanguage(`${sldComLanguage('返回')}`)}
                </div>
                {!isFirstLoading && !viewFlag &&
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  保存
                </div>
                }
              </div>
              {getSldEmptyH(70)}
            </Scrollbars>
          </Form>
        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
};
