import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Switch } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  validatorNumbe,
  list_com_page_more,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  sldLlineRtextAddGoodsAddMargin,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
@connect(({ svideo }) => ({
  svideo,
}))
@Form.create()
export default class SvideoTheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        label: `${sldComLanguage('主题名称')}`,
        type: 'input',
        name: 'themeName',
        placeholder: `${sldComLanguage('请输入主题名称')}`,
      }, {
        label: `${sldComLanguage('所属标签')}`,
        type: 'select',
        name: 'labelId',
        initialValue:'',
        placeholder: `${sldComLanguage('请选择所属标签')}`,
        sel_data: [],
        diy: true,
        sele_key: 'labelId',
        sele_name: 'labelName',
      }],
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标签名称')}`,
        name: 'labelName',
        extra: `${sldComLanguage('最多输入6个字')}`,
        placeholder: `${sldComLanguage('请输入标签名称')}`,
        initialValue: '',
        maxLength:6,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标签名称')}`,
        }],
      },{
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,
        name: 'sort',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        extra: `${sldComLanguage('请输入0~255的数字')}`,
        initialValue: '',
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      }
      ],//modal框的数据
      formValues: {},//搜索条件
      columns: [
        {
          title: ' ',
          dataIndex: 'themeId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('主题名称')}`,
          dataIndex: 'themeName',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('所属标签')}`,
          dataIndex: 'labelName',
          align: 'center',
          width: 100,
        },{
          title: `${sldComLanguage('绑定作品数')}`,
          dataIndex: 'videoNum',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('是否显示')}`,
          dataIndex: 'isShow',
          align: 'center',
          width: 80,
          render: (text, record) => (
            <Switch
              onChange={(checked) => this.operate({themeId:record.themeId,isShow:checked?1:0},'switch')}
              checked={text == 1 ? true : false}
              valuepropname={'checked'}/>
          ),
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              <Link to={{
                pathname: '/marketing_svideo/video_theme_bind_video',
                query: {
                  id: record.themeId,
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('查看作品')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              <Link to={{
                pathname: '/marketing_svideo/video_theme_to_add',
                query: {
                  id: record.themeId,
                },
              }}>
                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
              </Link>
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage(`${sldComLanguage('删除后不可恢复，是否确定删除')}?`)}`, () => this.operate(record.themeId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_all_lable();
  }

  //获取所有标签
  get_all_lable() {
    this.props.dispatch({
      type: 'svideo/get_label_lists',
      payload: { pageSize: list_com_page_more },
      callback: res => {
        if (res.state == 200) {
          let { search_data } = this.state;
          let tar_data = search_data.filter(item=>item.name == 'labelId')[0];
          tar_data.sel_data = res.data.list;
          this.setState({
            search_data: search_data,
          });
        }
      },
    });
  }

  //编辑标签
  edit = (val) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = val[addData[i].name];
    }
    this.cur_edit_id = val.themeId;//当前操作数据id
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑秒杀标签')}`,
      addData: addData,
      modalVisible: true,
    });//编辑标签
  };

  //标签操作  del：删除 edit: 编辑
  operate = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'svideo/del_theme';
      param_data = { themeId: id };
    } else if (type == 'switch') {
      dis_type = 'svideo/switch_theme';
      param_data = id;
    }
    dispatch({
      type: dis_type,
      payload: param_data,
      callback: (res) => {
        if (res.state == 200) {
          sucTip(res.msg);
          this.setState({
            modalVisible: false,
          });
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //添加标签
  add = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('新增秒杀标签')}`,
      addData: addData,
    });//添加标签
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'svideo/get_theme_list',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
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


  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    this.setState({ submiting: true });
    if (type == 'edit') {
      val.themeId = this.cur_edit_id;
      this.operate(val, 'edit');
    } else {
      dispatch({
        type: 'svideo/add_label',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.setState({
              modalVisible: false,
            });
          } else {
            failTip(res.msg);
          }
          this.setState({ submiting: false });
        },
      });
    }
  };

  //搜索事件
  search = (data) => {
    const values = { ...data };
    for(let i in values){
      if(values[i] == ''){
        delete values[i]
      }
    }
    this.setState({
      formValues: values,
    });
    this.get_list({ pageSize: pageSize, ...values });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
    });
    this.get_list({ pageSize: pageSize });
  };


  render() {
    const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_data } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('推荐主题')}`, 0, 0, 10)}
        <div className={global.tableListForm}>
          <Search search_data={search_data}
                  seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()}/>
        </div>
        <div className={global.operate_bg}>
          <Link to={{
            pathname: '/marketing_svideo/video_theme_to_add',
          }}>
            {sldIconBtn(() => null, `${sldComLanguage('新增推荐主题')}`, 7, 0)}
          </Link>
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight-180-20}
            selectedRows={selectedRows}
            data={data}
            rowKey={'themeId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            onSldHandleSeleRow={this.onSldHandleSeleRow}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          {/*标准表格-end*/}

        </Spin>
        {/*新增/编辑对话框-start*/}
        <SldModal
          title={title}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        {/*新增/编辑对话框-end*/}

      </div>

    );
  }
}
