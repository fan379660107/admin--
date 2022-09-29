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
    sldtbaleOpeBtnText,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ authority }) => ({
    authority,
}))
@Form.create()
export default class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            permissionList: [],//权限数据
            search_con: '',
            initLoading: false,
            modalVisiblePer: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            modalItem: {},
            addData: [{
                type: 'input',
                label: `${sldComLanguage('权限组名称')}`,
                name: 'roleName',
                extra: `${sldComLanguage('最多输入10个字')}`,
                placeholder: `${sldComLanguage('请输入权限组名称')}`,
                initialValue: '',
                maxLength:10,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入权限组名称')}`,
                }],
            },  {
                type: 'input',
                label: `权限组描述`,//权限组描述
                name: 'description',
                extra: `${sldComLanguage('最多输入50个字')}`,
                placeholder: `${sldComLanguage('请输入权限组描述')}`,
                initialValue: '',
                maxLength:50,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入权限组描述')}`,
                }],
            },
            ],//modal框的数据
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    dataIndex: 'roleId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
                },
                {
                    title: `${sldComLanguage('权限组名称')}`,
                    dataIndex: 'roleName',
                    align: 'center',
                    width: 100,
                },{
                    title: `${sldComLanguage('权限组描述')}`,
                    dataIndex: 'description',
                    align: 'center',
                    width: 150,
                }, {
                    title: `${sldComLanguage('创建时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150,
                }, {
                    title: `${sldComLanguage('更新时间')}`,
                    dataIndex: 'updateTime',
                    align: 'center',
                    width: 150,
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {record.isInner == 0
                                ? <Fragment>
                                    {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editRole(record))}
                                    <span className={global.splitLine}></span>
                                    {sldtbaleOpeBtnText(`${sldComLanguage('授权')}`, () => this.setPermission(record))}
                                    <span className={global.splitLine}></span>
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateRole(record.roleId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                </Fragment>
                                : '--'
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
        this.get_all_permission();
    }

    //设置授权
    setPermission = (val) => {
        this.cur_edit_id = val.roleId;//当前操作数据id
        this.setState({ modalVisiblePer: true, checkedKeys: val.resourcesList, modalItem: val });
    };

    //编辑权限组
    editRole = (val) => {
        let { addData } = this.state;
        for (let i in addData) {
            if (addData[i].name == 'roleCode') {
                addData[i].disable = true;
            }
            addData[i].initialValue = val[addData[i].name];
        }
        this.cur_edit_id = val.roleId;//当前操作数据id
        this.setState({
            type: 'edit',
            title: `${sldComLanguage('编辑权限组')}`,
            addData: addData,
            modalVisible: true,
        });
    };

    //权限组操作  del：删除 edit: 编辑
    operateRole = (id, type) => {
        this.setState({ submiting: true });
        const { params } = this.state;
        const { dispatch } = this.props;
        let dis_type = '';
        let param_data = {};
        if (type == 'del') {
            dis_type = 'authority/del_role';
            param_data = { roleId: id };
        } else if (type == 'edit') {
            dis_type = 'authority/edit_role';
            param_data = id;
        }
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

    //添加权限组
    addRole = () => {
        let { addData } = this.state;
        for (let i in addData) {
            if (addData[i].name == 'roleCode') {
                addData[i].disable = false;
            }
            addData[i].initialValue = '';
        }
        this.setState({
            modalVisible: true,
            type: 'add',
            title: `${sldComLanguage('添加权限组')}`,
            addData: addData,
            checkedKeys: [],
        });//添加权限组
    };

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'authority/get_role_lists',
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

    //获取数据列表
    get_all_permission = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'authority/get_all_permission',
            callback: (res) => {
                if (res.state == 200) {
                    let tmp_data = res.data.list;
                    this.ExpandedKeys = [];
                    this.setDefaultExpandedKeys(tmp_data);
                    this.setState({
                        permissionList: tmp_data,
                        expandedKeys: this.ExpandedKeys,
                    });
                }
            },
        });
    };

    setDefaultExpandedKeys = (data) => {
      for(let i in data){
        if(data[i].children!=undefined&&data[i].children.length>0){
          this.ExpandedKeys.push(data[i].resourceId.toString());
          if(data[i].children.length>0){
            this.setDefaultExpandedKeys(data[i].children)
          }
        }
      }
    }

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
            val.roleId = this.cur_edit_id;
            this.operateRole(val, 'edit');
        } else {
            dispatch({
                type: 'authority/add_role',
                payload: val,
                callback: (res) => {
                    if (res.state == 200) {
                        sucTip(res.msg);
                        this.get_list({ pageSize: pageSize });
                        this.setState({
                            modalVisible: false,
                            params: { pageSize: pageSize },
                            formValues: {},
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
            formValues: { roleName: val },
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize, roleName: val });
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

    //授权确定操作
    sldHandleConfirmPer = () => {
        const { dispatch } = this.props;
        let { params, modalItem } = this.state;
        this.setState({submiting:true})
        dispatch({
            type: 'authority/bind_role_permission',
            payload: { roleId: this.cur_edit_id, resourceIds: this.state.checkedKeys.join(',')},
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                    this.setState({
                        modalVisiblePer: false,
                    });
                } else {
                    failTip(res.msg);
                }
                this.setState({ submiting: false });
            },
        });

    };

    //取消授权操作
    sldHandleCanclePer = () => {
        this.setState({ modalVisiblePer: false });
    };

    onExpand = expandedKeys => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys });
    };

    render() {
        const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_con, modalVisiblePer, permissionList } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('权限组管理')}`, 0, 0, 10)}
                <div className={global.operate_bg}>
                    {sldIconBtn(() => this.addRole(), `${sldComLanguage('新增权限组')}`, 7, 7)}
                    {/*请输入权限组名称    搜索*/}
                    {sldSearchValClear(`${sldComLanguage('请输入权限组名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
                </div>
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        selectedRows={selectedRows}
                        data={data}
                        rowKey={'roleId'}
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
                {/*授权对话框-start*/}
                <SldModal
                    title={`${sldComLanguage('授权')}`}
                    width={500}
                    submiting={submiting}
                    modalVisible={modalVisiblePer}
                    sldHandleConfirm={this.sldHandleConfirmPer}
                    sldHandleCancle={this.sldHandleCanclePer}
                    formItemLayoutModal={formItemLayoutModal}
                    content={permissionList}
                    java_permission={true}
                    selectedKeys={this.state.selectedKeys}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    expandedKeys={this.state.expandedKeys}
                    onExpand={this.onExpand}
                />
                {/*授权对话框-end*/}
            </div>

        );
    }
}
