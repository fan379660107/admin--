import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldPopConfirmDiy,
  sldSearchValClear,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  sldtbaleOpeBtnText,
  validatorNumbe,
} from '@/utils/utils';
import { diy_link_type } from '@/utils/util_data';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import SldComHeader from '@/components/SldComHeader';

let pageSize = list_com_page_size_10;
@connect(({ pc_home }) => ({
  pc_home,
}))
@Form.create()
export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link_type: '',
      search_con: '',
      initLoading: false,
      submiting: false,
      data: {},//列表数据
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      title: '',
      type: 'add',//'add'新增  'edit'编辑
      params: { pageSize: pageSize },//搜索条件
      operateData: [],//sldmodal操作数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('导航名称')}`,
        name: 'navName',
        extra: `${sldComLanguage('最多6个字')}`,
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('导航名称')}`,
        initialValue: '',
        maxLength: 6,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('导航名称')}`,
        }],
      }, {
        type: 'inputnum',
        label: `${sldComLanguage('排序')}`,
        name: 'sort',
        extra: `${sldComLanguage('请输入0~255的数字，值越小，显示越靠前')}`,
        placeholder: `${sldComLanguage('请输入排序')}`,
        initialValue: '',
        min: 0,
        max: 255,
        rules: [{
          required: true,
          message: `${sldComLanguage('请输入排序')}`,
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }],
      },
        {
        type: 'radio_select',
        label: `${sldComLanguage('是否显示')}`,
        name: 'isShow',
        data: [{
          key: 1,
          value: `${sldComLanguage('是')}`,
        }, {
          key: 0,
          value: `${sldComLanguage('否')}`,
        }],
        initialValue: 1,
      }, {
        type: 'select',
        label: `${sldComLanguage('链接类型')}`,
        name: 'linkData',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('链接类型')}`,//请选择操作类型
        initialValue: '',
        sel_data: diy_link_type(),
        sldChange: this.handleSeleLinkType,
      },
      ],//modal框的数据
      formValues: {},//搜索条件、
      columns: [
        {
          title: ' ',
          dataIndex: 'navId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('导航名称')}`,
          dataIndex: 'navName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('链接类型')}`,
          dataIndex: 'link_type',
          align: 'center',
          width: 150,
          render: (text, record) => {
            let tmp_data = JSON.parse(record.data.replace(/&quot;/g,"\""));
            let data = diy_link_type().filter(item => item.key == tmp_data.link_type)[0];
            return data != undefined ? data.name : '--';
          },
        }, {
          title: `${sldComLanguage('跳转目标')}`,
          dataIndex: 'link_value',
          align: 'center',
          width: 150,
          render: (text, record) => {
            let tmp_data = JSON.parse(record.data.replace(/&quot;/g,"\""));
            return tmp_data.link_value?tmp_data.link_value:'--';
          },
        }, {
          title: `${sldComLanguage('启用状态')}`,
          dataIndex: 'isShow',
          align: 'center',
          width: 100,
          render: (text, record) => {
            return <Switch checked={text == 1 ? true : false}
                           onChange={(val) => this.handleSetEnable(val, record.navId)}/>;
          },
        }, {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {sldtbaleOpeBtnText('编辑', () => this.editNav(record))}{/*编辑*/}
              <span className={global.splitLine}></span>
              {/*删除后不可恢复，是否确定删除？*/}
              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateNav(record.navId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  sele_info = {};//当前选中的数据
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
  }

  handleSeleLinkType = (val) => {
    let { operateData } = this.state;
    operateData = operateData.filter(item => item.name != 'link_value');
    for (let i = 0; i < operateData.length; i++) {
      if (operateData[i].name == 'linkData') {
        operateData[i].initialValue = val;
        if (val == 'url') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('链接地址')}`,
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('链接地址')}`,
            initialValue: '',
            rules: [{
              required: true,
              whitespace: true,
              message: `${sldComLanguage('请输入')}${sldComLanguage('链接地址')}`,
            }],
          });
        } else if (val == 'keyword') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('关键字')}`,//关键字
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('关键字')}`,
            initialValue: '',
            rules: [{
              required: true,
              whitespace: true,
              message: `${sldComLanguage('请输入')}${sldComLanguage('关键字')}`,
            }],
          });
        } else if (val == 'goods') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('商品名称')}`,
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`,
            initialValue: '',
            disable: true,
          });
        } else if (val == 'category') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('分类名称')}`,
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,
            initialValue: '',
            disable: true,
          });
        } else if (val == 'topic') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('专题名称')}`,
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入')}${sldComLanguage('专题名称')}`,
            initialValue: '',
            disable: true,
          });
        }
      }
    }
    this.setState({ operateData, link_type: val });
  };

  //是否启用
  handleSetEnable = (val, id) => {
    this.operateNav({ navId: id, isShow: val ? 1 : 0 }, 'enable');
  };

  //编辑导航
  editNav = (val) => {
    let { operateData, addData } = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    for (let i = 0; i < operateData.length; i++) {
      if (operateData[i].name == 'linkData') {
        let data = JSON.parse(val.data.replace(/&quot;/g,"\""));
        operateData[i].initialValue = data.link_type;
        this.sele_info = data.info;
        if (data.link_type == 'url') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('链接地址')}`,//链接地址
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入链接地址')}`,
            initialValue: data.link_value,
            rules: [{
              required: true,
              whitespace: true,
              message: `${sldComLanguage('请输入链接地址')}`,
            }],
          });
        } else if (data.link_type == 'keyword') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('关键字')}`,//关键字
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入关键字')}`,
            initialValue: data.link_value,
            rules: [{
              required: true,
              whitespace: true,
              message: `${sldComLanguage('请输入关键字')}`,
            }],
          });
        } else if (data.link_type == 'goods') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('商品名称')}`,//商品名称
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入商品名称')}`,
            initialValue: data.link_value,
            disable: true,
          });
        } else if (data.link_type == 'category') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('分类名称')}`,//分类名称
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入分类名称')}`,
            initialValue: data.link_value,
            disable: true,
          });
        } else if (data.link_type == 'topic') {
          operateData.splice(i + 1, 0, {
            type: 'input',
            label: `${sldComLanguage('专题名称')}`,//专题名称
            name: 'link_value',
            placeholder: `${sldComLanguage('请输入专题名称')}`,
            initialValue: data.link_value,
            disable: true,
          });
        }
        operateData[i].sldChange = this.handleSeleLinkType;
      } else if (operateData[i].name != 'link_value') {
        operateData[i].initialValue = val[operateData[i].name];
        if (operateData[i].name == 'sort'){
          operateData[i].rules = [{
            required: true,
            message: `${sldComLanguage('请输入排序')}`,
          }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }];
        }

      }
    }
    this.cur_edit_id = val.navId;//当前操作数据id
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑导航')}`,
      operateData,
      modalVisible: true,
    });//编辑导航
  };

  //导航操作  del：删除 edit: 编辑 enable：是否启用
  operateNav = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'pc_home/del_home_nav';
      param_data = { navId: id };
    } else if (type == 'edit') {
      dis_type = 'pc_home/edit_home_nav';
      param_data = id;
    } else if (type == 'enable') {
      dis_type = 'pc_home/switch_home_nav';
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
          this.sele_info = {};
          this.get_list(params);
        } else {
          failTip(res.msg);
        }
        this.setState({ submiting: false });
      },
    });
  };

  //添加导航
  addNav = () => {
    let { addData, operateData } = this.state;
    operateData = JSON.parse(JSON.stringify(addData));
    for (let i in operateData) {
      if (operateData[i].name == 'sort') {
        operateData[i].rules = [{
          required: true,
          message: `${sldComLanguage('排序必填')}`,//排序必填
        }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }];
      } else if (operateData[i].name == 'linkData') {
        operateData[i].sldChange = this.handleSeleLinkType;
      }
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加导航')}`,
      operateData,
    });//添加导航
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_home_nav_list',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.list.length == 0 && this.state.params.currentPage > 1) {
            params.currentPage = params.currentPage - 1;
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
    val.data = JSON.stringify({
      link_type: val.linkData,
      link_value: val.link_value,
      info: this.sele_info,
    });
    delete val.link_type;
    delete val.link_value;
    delete val.linkData;
    if (type == 'edit') {
      val.navId = this.cur_edit_id;
      this.operateNav(val, 'edit');
    } else {
      dispatch({
        type: 'pc_home/add_home_nav',
        payload: val,
        callback: (res) => {
          if (res.state == 200) {
            sucTip(res.msg);
            this.get_list({ pageSize: pageSize });
            this.sele_info = {};
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

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { navName: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, navName: val });
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

  //商品/分类/专题选中事件
  seleSku = (val) => {
    let { operateData, link_type } = this.state;
    for (let i in operateData) {
      if (operateData[i].name == 'link_value') {
        if (link_type == 'goods') {
          operateData[i].initialValue = val.goodsName;
          this.sele_info.id = val.goodsId;
          this.sele_info.gid = val.defaultProductId;
          this.sele_info.defaultProductId = val.defaultProductId;
        } else if (link_type == 'category') {
          operateData[i].initialValue = val.categoryName;
          this.sele_info.id = val.categoryId;
          this.sele_info.categoryId = val.categoryId;
          this.sele_info.grade = val.grade;
        } else if (link_type == 'topic') {
          operateData[i].initialValue = val.decoName;
          this.sele_info.id = val.decoId;
          this.sele_info.decoId = val.decoId;
        }
        break;
      }
    }
    this.setState({ operateData, link_type: '' });
  };

  //商品/分类/专题取消事件
  sldHandleLinkCancle = () => {
    let { operateData } = this.state;
    operateData = operateData.filter(item => item.name != 'link_value');
    for (let i in operateData) {
      if (operateData[i].name == 'link_type') {
        operateData[i].initialValue = 'topic';
        break;
      }
    }
    this.sele_info = {};
    this.setState({ operateData, link_type: '' });
  };

  render() {
    const { selectedRows, columns, initLoading, data, submiting, operateData, modalVisible, title, search_con, link_type } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        <SldComHeader
          type={2}
          title={sldComLanguage('首页导航设置')}//首页导航设置
          tip_title={sldComLanguage('操作提示')}
          tip_data={[`${sldComLanguage('序号越小，显示越靠前')}`, `${sldComLanguage('PC商城首页展示一行，超出部分不展示，需要根据页面效果调整展示的数据')}`]}
        />
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.addNav(), `${sldComLanguage('添加导航')}`, 7, 7)}{/*添加导航*/}
          {/*请输入导航名称   搜索*/}
          {sldSearchValClear(`${sldComLanguage('请输入')}${sldComLanguage('导航名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'navId'}
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
          content={operateData}
        />
        {/*新增/编辑对话框-end*/}
        <SldSelGoodsSingleDiy link_type={link_type} seleSku={this.seleSku} sldHandleCancle={this.sldHandleLinkCancle}/>
      </div>

    );
  }
}
