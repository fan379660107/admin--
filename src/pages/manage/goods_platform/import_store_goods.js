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
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './product.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import goods from '@/assets/css/goods.less';
import { Scrollbars } from 'react-custom-scrollbars';
import SldScrollbars from '@/components/SldScrollbars';

let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class ImportStoreGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMoreCat: false,//是否展示二三级分类的标识，默认不显示
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: `${sldComLanguage('商品规格')}`,
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      goodsOneCat: [],//一级分类数据
      goodsOneToAllCat: [],//一级分类下的所有二三级数据
      curSelCatId: [],//当前选中的一、二、三级分类id
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
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,
        name: 'storeName',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,
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
          title: `${sldComLanguage('所属店铺')}`,
          dataIndex: 'storeName',
          align: 'center',
          width: 100,
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
          render: (text, record) => (
            <Fragment>
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定导入该商品吗')}?`, () => this.operate({ goodsIds: record.goodsId }), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('导入')}`, () => null))}
            </Fragment>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_one_cat();
  }

  componentWillReceiveProps(nextProps, nextContext) {

  }

  //操作
  operate = (id) => {
    const { params, formValues } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    let dis_type = 'goods_platform/import_goods';
    param_data = id;
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list({ ...params, ...formValues, pageSize: pageSize });
          this.setState({
            selectedRows: [],
            selectedRowKeys: [],
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
    const { dispatch } = this.props;
    dispatch({
      type: 'goods_platform/get_store_goods_lists',
      payload: { ...params },
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
        if (rowkeys.indexOf(item.goodsId) > -1) {
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
      curSelCatId: [],
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

  render() {
    const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, goodsOneCat, showMoreCat, goodsOneToAllCat, curSelCatId, submiting } = this.state;
    const { scroll_h } = this.props;
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
                autoHeightMax={document.body.clientHeight - 350 - scroll_h}>
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
                   style={{ height: document.body.clientHeight - 348 - scroll_h }}
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
                      autoHeightMax={document.body.clientHeight - 350 - scroll_h}
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
                {selectedRowKeys.length > 0
                  ? <Popconfirm
                    placement="leftBottom"
                    title={`${sldComLanguage('确定批量导入选中的商品吗')}？`}
                    onConfirm={() => this.operate({ goodsIds: selectedRowKeys.join(',') })}
                    okText={`${sldComLanguage('确定')}`}
                    cancelText={`${sldComLanguage('取消')}`}
                  >
                    <a className={`${goods.btn}`}>{sldComLanguage('批量导入')}</a>
                  </Popconfirm>
                  : <a className={`${goods.btn}`} onClick={() => {
                    failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);
                  }}>批量导入</a>
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
                autoHeightMax={document.body.clientHeight - 350 - scroll_h}>
                {/*标准表格-start*/}
                <StandardTable
                  showScrollbar={false}
                  bordered={false}
                  selectedRows={selectedRows}
                  selectedRowKeys={selectedRowKeys}
                  data={data}
                  rowKey={'goodsId'}
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
      </div>
    );
  }
}
