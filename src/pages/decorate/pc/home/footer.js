import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,message } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  dragSldTableColumn,
  sldHandlePaginationData,
  list_com_page_size_10,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  validatorNumbe,
  sldComLanguage,
  getTableNum,
  sldtbaleOpeBtnText,
  sldPopConfirmDiy,
  sldSearchValClear,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';


let pageSize = list_com_page_size_10;
@connect(({ pc_home }) => ({
  pc_home,
}))
@Form.create()
export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      submiting: false,//按钮loading
      loading: false,//按钮loading
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      title: '',
      search_con: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      curData: {},//编辑的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标题')}`,
        extra: `${sldComLanguage('最多输入20个字')}`,
        name: 'linkName',
        placeholder: `${sldComLanguage('请输入标题')}`,
        initialValue: '',
        maxLength:20,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标题')}`,
        }],
      },
        {
          type: 'input',
          label: `${sldComLanguage('链接')}`,//链接
          extra: `${sldComLanguage('链接URL应以http://或https://开头')}`,
          name: 'linkUrl',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('链接')}`,
          initialValue: '',
          maxLength:200,
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入')}${sldComLanguage('链接')}`,
          }],
        }, {
          type: 'inputnum',
          label: `${sldComLanguage('排序')}`,//排序
          extra: `${sldComLanguage('请输入0~255的数字，数字越小，该项显示将越靠前')}`,
          name: 'sort',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
          initialValue: '',
          rules: [{
            required: true,
            message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
          }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
        }],//modal框的数据
      columns: [
        {
          title: ' ',
          dataIndex: 'linkId',
          align: 'center',
          width: 50,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('名称')}`,
          align: 'center',
          dataIndex: 'linkName',
          width: 200,
        },
        {
          title: `${sldComLanguage('链接')}`,
          dataIndex: 'linkUrl',
          align: 'center',
          width: 150,
          render: (text) => (
            text != '' ? <a target='_blank' href={text}>{text}</a> : '--'
          ),
        }, {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('创建时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText('编辑', () => this.editFooter(record))}
              <span className={global.splitLine}></span>
              {
                sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateFooter(record.linkId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
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
    this.setState({ loading: true });
    dispatch({
      type: 'pc_home/get_home_footer_list',
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
      pageSize = params.pageSize;
      this.setState({ params });
      this.get_list(params);
    }
  };

  //编辑页脚
  editFooter = (record) => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = record[addData[i].name];
    }
    this.setState({ modalVisible: true, type: 'edit', title: `${sldComLanguage('编辑页脚')}`, addData, curData: record });//编辑页脚
  };

  //页脚操作 edit:编辑 del:删除
  operateFooter = (id, type) => {
    const { dispatch } = this.props;
    const { params } = this.state;
    let dis_type = '';
    let param_data = {};
    if (type == 'edit') {
      dis_type = 'pc_home/edit_home_footer';
      param_data = id;
    } else if (type == 'del') {
      dis_type = 'pc_home/del_home_footer';
      param_data.linkIds = id;
    }
    if(param_data.linkName&&param_data.linkName.length>20){
      message.error(`${sldComLanguage('标题长度不能大于20')}`)
      return false
    }
    this.setState({ submiting: true });
    dispatch({
      type: dis_type,
      payload: param_data,
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

  sldHandleConfirm = (val) => {
    const { curData, type, addData } = this.state;
    const { dispatch } = this.props;
    val.showType = 1;//展示方式：1、文字；2、图片
    if (type == 'edit') {
      val.linkId = curData.linkId;
      this.operateFooter(val, 'edit');
      return false;
    }
    this.setState({ submiting: true });
    dispatch({
      type: 'pc_home/add_home_footer',
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
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { linkName: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, linkName: val });
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

  //添加页脚
  addFooter = () => {
    let { addData } = this.state;
    for (let i in addData) {
      addData[i].initialValue = '';
    }
    this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加页脚')}`, addData: addData });//添加页脚
  };

  render() {
    const { selectedRows, modalVisible, title, addData, columns, submiting, data, loading,search_con } = this.state;
    return (
      <div className={global.common_page}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('页脚管理')}`, 0, 0, 5)}
        <Spin spinning={loading}>
          { /*公共功能条-start*/}
          <div className={global.operate_bg}>
            {sldIconBtn(() => this.addFooter(), `${sldComLanguage('新增页脚')}`, 7, 7)}{/*新增页脚*/}
            {sldSearchValClear(`${sldComLanguage('请输入名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
          </div>
          { /*公共功能条-end*/}
          { /*标准表格-start*/}
          <StandardTable
            totalHeight={document.body.clientHeight - 150 - 15}
            selectedRows={selectedRows}
            data={data}
            rowKey={'linkId'}
            isCheck={false}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
            isColumnResize={true}
          />
          { /*标准表格-end*/}
          { /*新增/编辑对话框-start*/}
          <SldModal
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
      </div>
    );
  }
}
