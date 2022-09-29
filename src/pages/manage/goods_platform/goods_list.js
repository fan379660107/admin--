import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Popconfirm, Empty } from 'antd';
import {
  failTip,
  sucTip,
  list_com_page_size_10,
  dragSldTableColumn,
  getTableNum,
  sldComLanguage,
  sldHandlePaginationData,
  getSldListGoodsImg80,
  sldTsvg,
  list_com_page_more,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  formItemLayoutModal,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './product.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import goods from '@/assets/css/goods.less';
import { Scrollbars } from 'react-custom-scrollbars';
import SldScrollbars from '@/components/SldScrollbars';
import SldModal from '@/components/SldModal/SldModal';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ product, goods_platform }) => ({
  product, goods_platform,
}))
@Form.create()
export default class PlatformGoodsLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_width: 500,//modal框宽度
      modalSubmiting: false,//modal框的按钮loading
      modalVisible: false,//modal框是否显示
      show_foot: false,//是否显示modal底部的操作按钮
      showMoreCat: false,//是否展示二三级分类的标识，默认不显示
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: ``,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      goodsOneCat: [],//一级分类数据
      goodsOneToAllCat: [],//一级分类下的所有二三级数据
      curSelCatId: [],//当前选中的一、二、三级分类id
      addData: [{
        type: 'textarea',
        label: `${sldComLanguage('下架理由')}`,
        name: 'offlineReason',
        placeholder: `${sldComLanguage('请输入下架理由')}`,
        extra: `${sldComLanguage('最多输入100字')}`,
        maxLength: 100,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入下架理由')}`,
        }],
      }],//下架数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,
        name: 'goodsName',
        placeholder: `${sldComLanguage('请输入商品名称')}`,
      }, {
        type: 'input',
        label: `${sldComLanguage('商品品牌')}`,
        name: 'brandName',
        placeholder: `${sldComLanguage('请输入品牌名称')}`,
      }, {
        type: 'select',
        label: `${sldComLanguage('商品类型')}`,
        name: 'isVirtualGoods',
        placeholder: `${sldComLanguage('请选择商品类型')}`,
        sel_data: [
          { key: '', name: `${sldComLanguage('全部')}` },
          { key: 1, name: `${sldComLanguage('实物商品')}` },
          { key: 2, name: `${sldComLanguage('虚拟商品')}` },
        ],
      }],
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: <div style={{ marginLeft: 2 }}>{sldComLanguage('商品信息')}</div>,
          dataIndex: 'mainImage',
          align: 'left',
          width: 250,
          render: (text, record) => {
            return <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
              {record.isVirtualGoods == 2 &&
              <span className={`${styles.virtual_goods_flag}`}>{sldComLanguage('虚拟')}</span>}
              <div className={styles.goods_img}>{getSldListGoodsImg80(text)}</div>
              <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                <span className={styles.goods_name}>
                  {record.goodsName}
                </span>
                <span className={styles.goods_brief}>
                  {record.categoryPath}
                </span>
              </div>
            </div>;
          },
        },
        {
          title: `${sldComLanguage('商品品牌')}`,
          dataIndex: 'brandName',
          align: 'center',
          width: 100,
          render: (text, record) => (text ? text : '--'),
        },
        {
          title: `${sldComLanguage('售价(元)')}`,
          dataIndex: 'goodsPrice',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <Fragment>
              <Link to={{
                pathname: '/manage_goods_platform/list_to_edit',
                query: {
                  id: record.platformGoodsId,
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('SKU')}`, () => this.viewSpec(record))}
              <span className={global.splitLine}></span>
              {props.state == 2
                ? sldtbaleOpeBtnText(`${sldComLanguage('下架')}`, () => this.operate_pre(record.platformGoodsId))
                : sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定刊登该商品吗')}?`, () => this.operate_pre(record.platformGoodsId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('刊登')}`, () => null))
              }
              <span className={global.splitLine}></span>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}?`, () => this.operate({ platformGoodsIds: record.platformGoodsId }, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>;
          },
        },
      ],
      view_spec_data: [{
        type: 'scroll_table',
        name: '',
        label: ``,
        width: 680,
        content: '',
        data: [],
        columns: this.goods_spec_columns,
        rowKey: 'productId',
      }],//查看规格
      operateData: [],
    };
  }

  goods_spec_columns = [
    {
      title: ' ',
      dataIndex: 'productId',
      align: 'center',
      width: 30,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: `${sldComLanguage('商品规格')}`,
      dataIndex: 'specValues',
      align: 'center',
      width: 200,
      render: (text, record, index) => {
        return <div style={{ wordBreak: 'normal', wordWrap: 'break-word' }}>{text}</div>;
      },
    },
    {
      title: `${sldComLanguage('价格(元)')}`,
      dataIndex: 'productPrice',
      align: 'center',
      width: 100,
    },
    {
      title: `${sldComLanguage('条形码')}`,
      dataIndex: 'barCode',
      align: 'center',
      width: 150,
      render: (text) => {
        return text ? text : '--';
      },
    },
  ];

  curOperatedGoodsIds = '';//当前操作的商品ids字符串

  componentDidMount() {
    if (this.props.state == '3') {
      let { columns } = this.state;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].dataIndex == 'goodsPrice') {
          columns.splice(i + 1, 0, {
            title: `${sldComLanguage('下架理由')}`,
            dataIndex: 'offlineReason',
            align: 'center',
            width: 100,
          });
          break;
        }
      }
      this.setState({ columns });
    }
    this.get_list({ pageSize: pageSize });
    this.get_one_cat();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.updateFlag) {
      this.get_list({ pageSize: pageSize });
      this.setState({ formValues: {}, params: {}, curSelCatId: [], selectedRows: [], selectedRowKeys: [] });
    }
  }

  //操作 type: 操作类型  del：删除 publish: 刊登  lockup: 下架
  operate = (id, type) => {
    const { params, formValues } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = 'goods_platform/import_goods';
    param_data = id;
    if (type == 'del') {
      dis_type = 'goods_platform/del_goods';
    } else if (type == 'publish') {
      dis_type = 'goods_platform/publish_goods';
    } else if (type == 'lockup') {
      dis_type = 'goods_platform/lockup_goods';
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          if (type == 'del') {
            //删除商品无需更新其他tab数据
            this.props.setUpdateFlag('');
          } else {
            this.props.setUpdateFlag(type);
          }
          this.get_list({ ...params, ...formValues, pageSize: pageSize });
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch, state } = this.props;
    dispatch({
      type: 'goods_platform/get_platform_goods_lists',
      payload: { ...params, state: state },
      callback: (res) => {
        let data = {};
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_list(params);
          } else {
            data = res.data;
          }
        }
        this.setState({ initLoading: false, data });
      },
    });
  };

  //获取一级分类
  get_one_cat = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/get_cate_list_by_id',
      payload: { categoryId: 0, isSort: true, pageSize: list_com_page_more },
      callback: (res) => {
        let goodsOneCat = [];
        if (res.state == 200) {
          goodsOneCat = res.data.list;
        } else {
          failTip(res.data.msg);
        }
        this.setState({
          goodsOneCat,
        });
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    let { data } = this.state;
    let temp_rows = [];
    if (rowkeys.length > 0) {
      data.list.map(item => {
        if (rowkeys.indexOf(item.platformGoodsId) > -1) {
          temp_rows.push(item);
        }
      });
    }
    this.setState({
      selectedRows: temp_rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({ params });
      this.get_list(params);
    }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
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

  //选中一级分类事件
  selCat = (id) => {
    this.setState({ showMoreCat: true });
    //获取该一级分类下的所有分类
    this.getAllCat(id);
  };

  //根据一级分类id获取该一级分类下的所有分类
  getAllCat = (id) => {
    const { dispatch } = this.props;
    this.setState({ submiting: true });
    dispatch({
      type: 'goods_platform/get_all_cat_by_one_id',
      payload: { categoryId1: id },
      callback: (res) => {
        this.setState({
          submiting: false,
        }, () => {
          let goodsOneToAllCat = [];
          if (res.state == 200) {
            goodsOneToAllCat = res.data;
          } else {
            failTip(res.data.msg);
          }
          this.setState({ goodsOneToAllCat });
        });
      },
    });
  };

  //选中分类进行搜索
  selCatSearch = (id, grade = 1, second = 0) => {
    let { params, formValues, curSelCatId } = this.state;
    this.get_list({ ...params, ...formValues, categoryId: id });
    [1, 2, 3].map((item, index) => {
      if (index == grade - 1) {
        curSelCatId[index] = id;
      } else if (index > grade - 1) {
        curSelCatId[index] = 0;
      }
      if (grade == 3) {
        curSelCatId[1] = second;
      }
    });

    this.setState({ showMoreCat: false, formValues: { categoryId: id }, curSelCatId });
  };

  //是否显示更多分类事件
  isShowMoreCat = (flag) => {
    this.setState({ showMoreCat: flag });
  };

  //批量刊登、下架操作的事件
  operate_pre = (id = '') => {
    const { state } = this.props;
    let { addData } = this.state;
    if (state == '2') {
      //下架
      this.curOperatedGoodsIds = id ? id : this.state.selectedRowKeys.join(',');
      this.setState({
        modalVisible: true,
        show_foot: true,
        title: `${sldComLanguage('商品下架')}`,
        modal_width: 500,
        operateData: JSON.parse(JSON.stringify(addData)),
      });
    } else {
      this.operate({ platformGoodsIds: id ? id : this.state.selectedRowKeys.join(',') }, 'publish');
    }
  };

  // 查看规格
  viewSpec = (val) => {
    let { view_spec_data, operateData } = this.state;
    operateData = JSON.parse(JSON.stringify(view_spec_data));
    operateData[0].columns = this.goods_spec_columns;
    operateData[0].data = val.productList;
    this.setState({
      modalVisible: true,
      show_foot: false,
      title: `${sldComLanguage('查看规格')}`,
      modal_width: 700,
      operateData,
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    val.platformGoodsIds = this.curOperatedGoodsIds;
    this.operate(val, 'lockup');
  };

  render() {
    const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, goodsOneCat, showMoreCat, goodsOneToAllCat, curSelCatId, submiting, show_foot, operateData, modalVisible, title, modal_width, modalSubmiting } = this.state;
    const { scroll_h, state } = this.props;
    return (
      <div className={global.common_page} style={{ flex: 1, padding: 0 }}>
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <Spin spinning={initLoading}>
          <div className={`${global.flex_row_start_start} ${goods.import_store_goods}`}>
            <div className={`${global.flex_column_start_start} ${goods.left_part}`}>
              <p className={`${goods.title} ${global.flex_row_start_center}`}>{sldComLanguage('商品分类')}</p>
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 305 - scroll_h}>
                <div className={`${goods.goods_cat}`} onMouseEnter={() => this.isShowMoreCat(true)}>
                  {goodsOneCat.map((item) => {
                    return <div key={item.categoryId}
                                className={`${goods.cat_item} ${global.flex_row_between_center} ${curSelCatId[0] == item.categoryId ? goods.selected_cat_item : null}`}
                                onMouseEnter={() => this.selCat(item.categoryId)}
                                onMouseLeave={() => this.isShowMoreCat(false)}
                                onClick={() => this.selCatSearch(item.categoryId)}>
                      <span className={goods.cat_name}>{item.categoryName}</span>
                      <div className={goods.to_right_icon}>
                        {sldTsvg('gengduo2', curSelCatId[0] == item.categoryId ? '#FF701E' : '#101010', 14, 14)}
                      </div>
                    </div>;
                  })}
                </div>
              </Scrollbars>

              {showMoreCat &&
              <div className={`${goods.more_cat} ${global.flex_column_start_start}`}
                   style={{ height: document.body.clientHeight - 303 - scroll_h }}
                   onMouseEnter={() => this.isShowMoreCat(true)}
                   onMouseLeave={() => this.isShowMoreCat(false)}>

                {goodsOneToAllCat.length > 0
                  ? <Fragment>
                    {submiting &&
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      textAlign: 'center',
                      marginTop: (document.body.clientHeight - 348 - scroll_h) / 2 - 60,
                      top: 0,
                      bottom: 0,
                      left: 0,
                    }}>
                      <Spin spinning={submiting}>
                      </Spin>
                    </div>
                    }
                    <SldScrollbars
                      autoHeight
                      autoHeightMin={100}
                      autoHeightMax={document.body.clientHeight - 305 - scroll_h}
                    >
                      {goodsOneToAllCat.map((second_item, second_index) => {
                        return <div key={'2_' + second_index}
                                    className={`${goods.item} ${global.flex_row_start_start}`}>
                          <div className={`${goods.second_cat} ${global.flex_row_end_center}`}
                               onClick={() => this.selCatSearch(second_item.categoryId, 2)}>
                          <span className={goods.cat_name}
                                style={{ color: curSelCatId[1] == second_item.categoryId ? '#FF701E' : '#4C4C4C' }}>{second_item.categoryName}</span>
                            <div className={goods.to_right_icon}>
                              {sldTsvg('gengduo2', curSelCatId[1] == second_item.categoryId ? '#FF701E' : '#101010', 14, 14)}
                            </div>
                          </div>
                          <div className={`${global.flex_row_start_start} ${goods.third_cat}`}>
                            {second_item.children.length > 0 && second_item.children.map((third_item, third_index) => {
                              return <a key={'3_' + third_index} className={goods.item}
                                        onClick={() => this.selCatSearch(third_item.categoryId, 3, third_item.pid)}
                                        style={{ color: curSelCatId[2] == third_item.categoryId ? '#FF701E' : '#999' }}>{third_item.categoryName}</a>;
                            })}
                          </div>
                        </div>;
                      })}
                    </SldScrollbars>
                  </Fragment>
                  : <div className={global.flex_row_center_center} style={{ width: '100%', flex: 1 }}>
                    <Empty
                      image={require('@/assets/moudle_disable.png')}
                      imageStyle={{
                        height: 80,
                      }}
                      description={
                        <span>{sldComLanguage(`${sldComLanguage('暂无下级分类')}`)}</span>
                      }
                    >
                    </Empty>
                  </div>
                }
              </div>
              }
            </div>
            <div className={`${goods.right_goods} ${global.flex_column_start_start}`}>
              <div className={`${goods.operate_wrap} ${global.flex_row_start_center}`}>
                {state == 2
                  ? (selectedRowKeys.length > 0
                      ? <a className={`${goods.btn}`} onClick={() => this.operate_pre()}>{sldComLanguage('批量下架')}</a>
                      : <a className={`${goods.btn}`} onClick={() => {
                        failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);
                      }}>{sldComLanguage('批量下架')}</a>
                  )
                  : (selectedRowKeys.length > 0
                      ? <Popconfirm
                        placement="leftBottom"
                        title={`${sldComLanguage('确定批量刊登选中的商品吗')}?`}
                        onConfirm={() => this.operate({ platformGoodsIds: selectedRowKeys.join(',') }, 'publish')}
                        okText={`${sldComLanguage('确定')}`}
                        cancelText={`${sldComLanguage('取消')}`}
                      >
                        <a className={`${goods.btn}`}>{sldComLanguage('批量刊登')}</a>
                      </Popconfirm>
                      : <a className={`${goods.btn}`} onClick={() => {
                        failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);
                      }}>{sldComLanguage('批量刊登')}</a>
                  )
                }

                {selectedRowKeys.length > 0
                  ? <Popconfirm
                    placement="leftBottom"
                    title={`${sldComLanguage('确认批量删除选中的商品吗')}?`}
                    onConfirm={() => this.operate({ platformGoodsIds: selectedRowKeys.join(',') }, 'del')}
                    okText={`${sldComLanguage('确定')}`}
                    cancelText={`${sldComLanguage('取消')}`}
                  >
                    <a className={`${goods.btn}`} style={{ marginLeft: 15 }}>{sldComLanguage('批量删除')}</a>
                  </Popconfirm>
                  : <a className={`${goods.btn}`} style={{ marginLeft: 15 }} onClick={() => {
                    failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);
                  }}>{sldComLanguage('批量删除')}</a>
                }
                {selectedRowKeys.length > 0 &&
                <div className={global.flex_row_start_center} style={{ marginLeft: 15 }}>
                  <span className={goods.sel_goods_num_tip}>{sldComLanguage('已选')}</span>
                  <span className={`${goods.sel_goods_num_tip} ${goods.sel_goods_num}`}>{selectedRowKeys.length}</span>
                  <span className={goods.sel_goods_num_tip}>{sldComLanguage('款商品')}</span>
                </div>
                }
              </div>
              <Scrollbars
                autoHeight
                autoHeightMin={100}
                autoHeightMax={document.body.clientHeight - 305 - scroll_h}>
                {/*标准表格-start*/}
                <StandardTable
                  showScrollbar={false}
                  bordered={false}
                  selectedRows={selectedRows}
                  data={data}
                  rowKey={'platformGoodsId'}
                  isCheck={true}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                  onSldHandleSeleRow={this.onSldHandleSeleRow}
                  resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                  isColumnResize={true}
                />
                {/*标准表格-end*/}
              </Scrollbars>
            </div>
          </div>
        </Spin>
        { /*新增/编辑对话框-start*/}
        <SldModal
          width={modal_width}
          title={title}
          submiting={modalSubmiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={operateData}
          show_foot={show_foot}
        />
        { /*新增/编辑对话框-end*/}
      </div>
    );
  }
}
