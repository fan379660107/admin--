import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldPopConfirm,
  sldSearchValClear,
  getSldEmptyW,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  validatorNumbe,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let comm_cur_page = 1;//当前页数
let pageSize = list_com_page_size_10;
@connect(({ article }) => ({
  article,
}))
@Form.create()
export default class Article_cat_lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      data: {},
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('分类名称')}`,//分类名称
        name: 'categoryName',
        extra: `最多10个字`,//最多10个字
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,//请输入分类名称
        initialValue: '',
        maxLength:10,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,//请输入分类名称
        }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,//排序
        name: 'sort',
        extra: `${sldComLanguage('数字越小，显示越靠前，0～255')}`,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      }],//modal框的数据
      columns: [
        {
          title: ' ',
          dataIndex: 'categoryId',
          align: 'center',
          width: 55,
          render: (text, record, index) => {
            return (comm_cur_page - 1) * pageSize + index + 1;
          },
        },
        {
          title: `${sldComLanguage('分类名称')}`,//分类名称
          align: 'center',
          dataIndex: 'categoryName',
          width: 200,
        },
        {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          align: 'center',
          width: 150,
          dataIndex: 'createTime',
        },
        {
          title: `${sldComLanguage('排序')}`,//排序
          align: 'center',
          dataIndex: 'sort',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText('编辑', () => this.editCat(record))}
              <span className={global.splitLine}></span>
              {record.isSystemCate != 1 &&
              sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.del_cat(record.categoryId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText('删除', () => null))
              }
            </Fragment>
          ),
        },
      ],
    };
  }


  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/get_article_cat_lists',
      payload: params,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.current > 1) {
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

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      comm_cur_page = pagination.current;
      pageSize = params.pageSize;
      this.get_list(params);
    }
  };

  //新增功能
  addCat = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加')}${sldComLanguage('文章分类')}`,
      addData: addData,
    });//添加文章分类
  };

  //编辑文章分类
  editCat = (val) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = val[addData[i].name];
    }
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑')}${sldComLanguage('文章分类')}`,//编辑文章分类
      addData: addData,
      modalVisible: true,
      curData: val,
    });
  };

  //删除单条数据
  del_cat = (val) => {
    this.del_cat_com({ categoryIds: val });
  };

  //批量删除数据
  del_cat_morer = () => {
    const { selectedRowKeys } = this.state;
    this.del_cat_com({ categoryIds: selectedRowKeys.join(',') });
  };

  //删除事件
  del_cat_com = (payload) => {
    const { params } = this.state;
    let _this = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'article/del_article_cat',
      payload: payload,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          _this.get_list(params);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  sldHandleConfirm = (val) => {
    this.setState({ submiting: true });
    const { curData, params, type } = this.state;
    const { dispatch } = this.props;
    let dis_type = 'article/add_article_cat';
    if (type == 'edit') {
      val.categoryId = curData.categoryId;
      dis_type = 'article/edit_article_cat';
    }
    dispatch({
      type: dis_type,
      payload: val,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.get_list(params);
          this.setState({
            modalVisible: false,
          });
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //搜索
  sldSearch = (val) => {
    let { formValues } = this.state;
    formValues.categoryName = val;
    this.setState({ formValues,params: { pageSize: pageSize } });
    this.get_list({ ...formValues, pageSize: pageSize });
  };

  //搜索框内容的变化
  sldSearChange = (val) => {
    this.setState({
      search_con: val.target.value,
    });
  };

  //清空搜索内容
  sldSearClear = () => {
    this.setState({
      search_con: '',
    });
    this.sldSearch('');
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, selectedRowKeys, search_con } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('文章分类')}${sldComLanguage('管理')}`, 0, 0, 5)}{/*文章分类管理*/}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addCat(), `${sldComLanguage('新增文章分类')}`, 7, 0)}{/*新增文章分类*/}
            {selectedRowKeys.length == 0
              ? sldIconBtn(() => {
              failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
              //删除     删除后不可恢复，是否确定删除？
            }, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 4, 'shanchu')
              : sldPopConfirm('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}？`, () => this.del_cat_morer(), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 4, 'shanchu'), 0, 0, '#1890ff')}
            {getSldEmptyW(7)}
            {/*请输入分类名称        搜索*/}
            {sldSearchValClear(`${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'categoryId'}
            isCheck={true}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            sldpagination={true}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
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

      </div>
    );
  }
}
