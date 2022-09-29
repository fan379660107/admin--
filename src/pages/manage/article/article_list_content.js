import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldPopConfirm,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  formItemLayoutModal,
  validatorNumbe,
  sldComLanguage,
  sldPopConfirmDiy,
  sldtbaleOpeBtnText,
  getTableNum,
} from '@/utils/utils';
import Link from 'umi/link';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ article, share }) => ({
  article, share,
}))
@Form.create()
export default class ArticleListContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollBarToTop: 0,//StandardTable滚动条是否返回顶部的标识，默认为0，不返回，逐渐加1
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
        label: `${sldComLanguage('文章名称')}`,//文章名称
        name: 'name',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('文章名称')}`,//请输入文章名称
        initialValue: '',
        maxLength: 20,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('文章名称')}`,//请输入文章名称
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
      }],//modal框的数据
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('文章标题')}`,//文章标题
        name: 'title',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('文章标题')}`,//请输入文章标题
      },
        {
          type: 'input',
          label: `${sldComLanguage('文章内容')}`,//文章内容
          name: 'content',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('文章内容')}`,//请输入文章内容
        },
      ],
      cur_parent_id: '',//上级文章id
      columns: [
        {
          title: ' ',
          dataIndex: 'articleId',
          align: 'center',
          width: 30,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `文章标题`,
          width: 150,
          align: 'center',
          dataIndex: 'title',
        },
        {
          title: `${sldComLanguage('所属分类')}`,//所属分类
          align: 'center',
          dataIndex: 'categoryName',
          width: 100,
        },
        {
          title: `${sldComLanguage('是否显示')}`,//是否显示
          dataIndex: 'stateValue',
          align: 'center',
          width: 80,
        }, {
          title: `${sldComLanguage('排序')}`,//排序
          dataIndex: 'sort',
          align: 'center',
          width: 80,
        }, {
          title: `${sldComLanguage('创建时间')}`,//创建时间
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/manage_article/article_lists_to_add',
                query: { id: record.articleId },
              }}>
                {
                  sldtbaleOpeBtnText('编辑', null)
                }
              </Link>
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.del_article(record.articleId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText('删除', () => null))}
            </Fragment>
          ),
        },
      ],
    };
  }


  componentDidMount() {
    this.props.dispatch({
      type: 'share/getShareData',
    });
    this.get_list({ pageSize: pageSize });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.share.flag && nextProps.share.type == 'edit_article') {
      //编辑导致的页面更新数据
      const { params, formValues } = this.state;
      this.get_list({ ...params, ...formValues });
      this.props.dispatch({
        type: 'share/updateDate',
        payload: { flag: false, type: '', sldGlobalShareData: {} },
      });
    }
  }

  //获取数据列表
  get_list = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/get_article_lists',
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
              isReset: false,
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
    let { formValues, scrollBarToTop } = this.state;
    if (type == 'main') {
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      scrollBarToTop = scrollBarToTop + 1;
      this.setState({ params, scrollBarToTop });
      this.get_list(params);
    }
  };

  //删除单条数据
  del_article = (val) => {
    this.del_article_com({ ids: val });
  };

  //批量删除数据
  del_article_more = () => {
    const { selectedRowKeys } = this.state;
    this.del_article_com({ ids: selectedRowKeys.join(',') });
  };


  //删除事件
  del_article_com = (payload) => {
    const { params } = this.state;
    let _this = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'article/del_article',
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
      val.articleId = curData.articleId;
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

  //表格拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading, selectedRowKeys, search_data, scrollBarToTop } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={global.tableListForm}>
          <Search search_data={search_data} seaSubmit={(data) => this.search(data)}
                  seaReset={() => this.seaReset()}/>
        </div>
        { /*公共功能条-start*/}
        <div className={global.operate_bg}>
          <Link to={{
            pathname: '/manage_article/article_lists_to_add',
          }}>
            {sldIconBtn(null, `${sldComLanguage('添加')}${sldComLanguage('文章')}`, 7, 0)}{/*添加文章*/}
          </Link>
          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
            failTip(`${sldComLanguage('请先选中数据')}`);//请先选中数据
            //确认删除选中的数据吗？
          }, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 4, 'shanchu', '#fa0920') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的数据吗')}？`, () => this.del_article_more(), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 4, 'shanchu', '#fa0920'), 0, 0, '#fa0920')}
        </div>
        { /*公共功能条-end*/}
        { /*标准表格-start*/}
        <StandardTable
          scrollBarToTop={scrollBarToTop}
          totalHeight={document.body.clientHeight - 195}
          selectedRows={selectedRows}
          data={data}
          rowKey={'articleId'}
          isCheck={true}
          columns={columns}
          onSelectRow={this.handleSelectRows}
          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
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
    );
  }
}
