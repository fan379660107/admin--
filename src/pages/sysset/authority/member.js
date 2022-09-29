import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  sldIconBtn,
  failTip,
  sucTip,
  sldPopConfirmDiy,
  sldSearchValClear,
  list_com_page_size_10,
  dragSldTableColumn,
  sldHandlePaginationData,
  sldLlineRtextAddGoodsAddMargin,
  formItemLayoutModal,
  getTableNum,
  sldComLanguage,
  list_com_page_more,
  sldtbaleOpeBtnText,
  validatorVendorEmail,
  validatorMemPwd,
  mobile_reg,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ sldsetting }) => ({
  sldsetting,
}))
@Form.create()
export default class Member extends Component {
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
      operateData: [],//modal里面的数据
      addData: [{
        type: 'input',
        label: `${sldComLanguage('账号')}`,
        name: 'adminName',
        extra: `${sldComLanguage('最多10个字符')}`,
        placeholder: `${sldComLanguage('请输入账号')}`,
        initialValue: '',
        maxLength:10,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入账号')}`,
        }],
      }, {
        type: 'input',
        label: `${sldComLanguage('登录密码')}`,
        input_type: 'password',
        name: 'password',
        placeholder: `${sldComLanguage('请设置6-20位的登录密码')}`,
        initialValue: '',
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请设置登录密码')}`,
        }, {
          min: 6,
          max: 20,
          message: `${sldComLanguage('请输入6-20位的密码')}`,
        }],
      },
        {
          type: 'input',
          label: `${sldComLanguage('确认密码')}`,
          input_type: 'password',
          name: 'confirmPwd',
          placeholder: `${sldComLanguage('确认密码需要与密码一致')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入确认密码')}`,
          }, {
            min: 6,
            max: 20,
            message: `${sldComLanguage('请输入6-20位的确认密码')}`,
          }],
        }, {
          type: 'input',
          label: `${sldComLanguage('联系人电话')}`,
          name: 'phone',
          placeholder: `${sldComLanguage('请输入')}${sldComLanguage('联系人电话')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入')}${sldComLanguage('联系人电话')}`,
          }, {
            pattern: mobile_reg,
            message: `${sldComLanguage('请输入正确的手机号')}`,
          }],
        }, {
          type: 'input',
          label: `${sldComLanguage('邮箱')}`,
          name: 'email',
          placeholder: `${sldComLanguage('请输入邮箱')}`,
          initialValue: '',
          maxLength:100,
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入邮箱')}`,
          }, { validator: (rule, value, callback) => validatorVendorEmail(rule, value, callback) }],
        }, {
          type: 'select',
          label: `${sldComLanguage('权限组')}`,
          name: 'roleId',
          placeholder: `${sldComLanguage('请选择权限组')}`,//请选择店铺等级
          sel_data: [],
          sele_key: 'roleId',
          sele_name: 'roleName',
          diy: true,
          rules: [{
            required: true,
            message: `${sldComLanguage('请选择权限组')}`,
          }],
        },
      ],//modal框的数据
      changePwdData: [{
        type: 'input',
        label: `${sldComLanguage('新密码')}`,
        input_type: 'password',
        name: 'newPassword',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('新密码')}`,
        initialValue: '',
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('新密码必填')}`,
        }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }],
      }, {
        type: 'input',
        label: `${sldComLanguage('确认新密码')}`,
        name: 'newPasswordCfm',
        input_type: 'password',
        placeholder: `${sldComLanguage('请再次输入新密码')}`,
        initialValue: '',
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('确认新密码必填')}`,
        }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }],
      }],
      formValues: {},//搜索条件、
      columns: [
        {
          title: ' ',
          dataIndex: 'adminId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('账号')}`,
          dataIndex: 'adminName',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('所属权限组')}`,
          dataIndex: 'roleName',
          align: 'center',
          width: 150,
          render: (text, record, index) => record.isSuper == 1 ? `${sldComLanguage('全部权限')}` : text,
        },
        {
          title: `${sldComLanguage('电话')}`,
          dataIndex: 'phone',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('创建时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        }, {
          title: `${sldComLanguage('状态')}`,
          dataIndex: 'stateValue',
          align: 'center',
          width: 100,
        }, {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 100,
          render: (text, record) => (
            <Fragment>
              {
                record.isSuper == 1 ? '--' : <Fragment>
                  {
                    sldtbaleOpeBtnText(sldComLanguage('编辑'), () => this.editAdminMember(record))
                  }
                  <span className={global.splitLine}></span>
                  {record.state == 1 &&
                  <Fragment>
                    {
                      sldtbaleOpeBtnText(`${sldComLanguage('冻结')}`, () => this.operateAdminMember({
                        adminId: record.adminId,
                        isFreeze: true,
                      }, 'freeze'))
                    }
                    <span className={global.splitLine}></span>
                  </Fragment>
                  }
                  {record.state == 2 &&
                  <Fragment>
                    {
                      sldtbaleOpeBtnText(`${sldComLanguage('解冻')}`, () => this.operateAdminMember({
                        adminId: record.adminId,
                        isFreeze: false,
                      }, 'freeze'))
                    }
                    <span className={global.splitLine}></span>
                  </Fragment>
                  }
                  {
                    sldtbaleOpeBtnText(`${sldComLanguage('重置密码')}`, () => this.changePwd(record))
                  }
                  <span className={global.splitLine}></span>
                  {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateAdminMember(record.adminId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                </Fragment>
              }
            </Fragment>
          ),
        },
      ],
    };
  }

  cur_edit_id = '';//当前操作数据id
  componentDidMount() {
    this.get_list({ pageSize: pageSize });
    this.get_role_list({ pageSize: list_com_page_more });
  }

  //修改密码
  changePwd = (val) => {
    let { changePwdData } = this.state;
    let operateData = [...changePwdData];
    this.cur_edit_id = val.adminId;
    this.setState({ type: 'changePwd', title: `${sldComLanguage('重置密码')}`, operateData, modalVisible: true });
  };

  //编辑操作员
  editAdminMember = (val) => {
    let { addData, operateData } = this.state;
    operateData = [...addData];
    operateData = operateData.filter(item => item.input_type != 'password');
    for (let i in operateData) {
      operateData[i].initialValue = val[operateData[i].name];
    }
    this.cur_edit_id = val.adminId;//当前操作数据id
    this.setState({
      type: 'edit',
      title: `${sldComLanguage('编辑操作员')}`,
      operateData: operateData,
      modalVisible: true,
    });//编辑操作员
  };

  //操作员操作  del：删除 edit: 编辑 freeze 冻结 changePwd 重置密码
  operateAdminMember = (id, type) => {
    this.setState({ submiting: true });
    const { params } = this.state;
    const { dispatch } = this.props;
    let dis_type = '';
    let param_data = {};
    if (type == 'del') {
      dis_type = 'authority/del_admin_member';
      param_data = { adminId: id };
    } else if (type == 'edit') {
      dis_type = 'authority/edit_admin_member';
      param_data = id;
    } else if (type == 'freeze') {
      dis_type = 'authority/freeze_admin_member';
      param_data = id;
    } else if (type == 'changePwd') {
      dis_type = 'authority/reset_admin_member_pwd';
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

  //添加操作员
  addAdminMember = () => {
    let { addData, operateData } = this.state;
    operateData = [...addData];
    operateData = operateData.filter(item => item.input_type != 'password');
    for (let i in operateData) {
      if (operateData[i].name == 'adminName') {
        operateData.splice(i + 1, 0, {
          type: 'input',
          label: `${sldComLanguage('登录密码')}`,
          input_type: 'password',
          name: 'password',
          placeholder: `${sldComLanguage('请设置6-20位的登录密码')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请设置登录密码')}`,
          }, {
            min: 6,
            max: 20,
            message: `${sldComLanguage('请输入6-20位的密码')}`,
          }],
        });
        operateData.splice(i + 2, 0, {
          type: 'input',
          label: `${sldComLanguage('确认密码')}`,
          input_type: 'password',
          name: 'confirmPwd',
          placeholder: `${sldComLanguage('确认密码需要与密码一致')}`,
          initialValue: '',
          rules: [{
            required: true,
            whitespace: true,
            message: `${sldComLanguage('请输入确认密码')}`,
          }, {
            min: 6,
            max: 20,
            message: `${sldComLanguage('请输入6-20位的确认密码')}`,
          }],
        });
      }

    }
    for (let i in operateData) {
      operateData[i].initialValue = '';
    }
    this.setState({
      modalVisible: true,
      type: 'add',
      title: `${sldComLanguage('添加操作员')}`,
      operateData: operateData,
    });//添加操作员
  };

  //获取权限组列表
  get_role_list = (params) => {
    const { dispatch } = this.props;
    let { addData } = this.state;
    dispatch({
      type: 'authority/get_role_lists',
      payload: params,
      callback: (res) => {
        if (res.state == 200) {
          for (let i in addData) {
            if (addData[i].name == 'roleId') {
              addData[i].sel_data = res.data.list;
              break;
            }
          }
          this.setState({ addData });
        }
      },
    });
  };

  //获取数据列表
  get_list = (params) => {
    this.setState({ initLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/get_admin_member',
      payload: params,
      callback: (res) => {
        this.setState({ initLoading: false });
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.currentPage > 1) {
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
    if (type == 'edit') {
      val.adminId = this.cur_edit_id;
      this.operateAdminMember(val, 'edit');
    } else if (type == 'changePwd') {
      val.adminId = this.cur_edit_id;
      if (val.newPassword != val.newPasswordCfm) {
        failTip(`${sldComLanguage('两次密码不一致，请重新输入')}`);//两次密码不一致，请重新输入
        return false;
      }
      this.operateAdminMember(val, 'changePwd');
    } else {
      this.setState({ submiting: true });
      dispatch({
        type: 'authority/add_admin_member',
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

  //搜索
  sldSearch = (val) => {
    this.setState({
      formValues: { adminName: val },
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, adminName: val });
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

  render() {
    const { selectedRows, columns, initLoading, data, submiting, operateData, modalVisible, title, search_con } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1 }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('操作员管理')}`, 0, 0, 10)}
        <div className={global.operate_bg}>
          {sldIconBtn(() => this.addAdminMember(), `${sldComLanguage('新增操作员')}`, 7, 7)}
          {/*请输入操作员账号    搜索*/}
          {sldSearchValClear(`${sldComLanguage('请输入账号')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
        </div>
        <Spin spinning={initLoading}>
          {/*标准表格-start*/}
          <StandardTable
            selectedRows={selectedRows}
            data={data}
            rowKey={'adminId'}
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
      </div>

    );
  }
}
