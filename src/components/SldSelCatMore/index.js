import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
  Form, Spin, Modal,
} from 'antd';
import {
  failTip,
  sldPopConfirm,
  list_com_page_size_10,
  sldComLanguage,
  getTableNum,
  sldtbaleOpeBtn,
  sldHandlePaginationData,
  dragSldTableColumn,
  list_com_page_more,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ pc_home, project }) => ({
  pc_home, project,
}))
@Form.create()
export default class SldSelCatMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      loading: false,
      data: {},
      title: '',
      params: { pageSize: pageSize },//搜索条件
      search_data: [],
      formValues: {},//搜索条件
      columns: [
        {
          title: `${sldComLanguage('分类名称')}`,//分类名称
          align: 'left',
          dataIndex: 'categoryName',
          width: 250,
        },
      ],
      sel_columns: [
        {
          title: ' ',
          dataIndex: 'categoryId',
          align: 'center',
          width: 55,
          render: (text, record, index) => getTableNum({}, pageSize, index),
        },
        {
          title: `${sldComLanguage('分类名称')}`,//分类名称
          align: 'left',
          dataIndex: 'categoryName',
          width: 250,
        },
        {
          title: `级别`,
          dataIndex: 'grade',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,//操作
          align: 'center',
          width: 60,
          render: (text, record) => {
            return sldPopConfirm('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delSelCat(record.categoryId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldtbaleOpeBtn(sldComLanguage('删除'), 'shanchu2', null), 0, 0, '#1890ff');//删除 删除后不可恢复，是否确定删除？
          },

        },
      ],
    };
  }

  init_flag = true;

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.get_list({ pageSize: pageSize, categoryId: 0 });
    this.setState({
      selectedRows: nextProps.selectedRows,
      selectedRowKeys: nextProps.selectedRowKeys,
    });
  }

  componentWillUnmount() {

  }


  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    let { data } = this.state;
    let dis_type = '';
    let new_params = { ...params, pageSize: list_com_page_more };
    dis_type = 'project/get_cate_list_by_id';
    dispatch({
      type: dis_type,
      payload: new_params,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          //id为0直接赋值
          if (new_params.grade != undefined && new_params.grade) {
            for (let i in data.list) {
              if (new_params.grade == 1) {
                if (data.list[i].categoryId == params.categoryId) {
                  data.list[i].children = res.data.list;
                  break;
                }
              } else {
                if (data.list[i].children != undefined) {
                  for (let j in data.list[i].children) {
                    if (data.list[i].children[j].categoryId == params.categoryId) {
                      data.list[i].children[j].children = res.data.list;
                      break;
                    }
                  }
                }
              }
            }
          } else {
            data.list = res.data.list;
          }
          this.setState({ data });
        }
      },
    });
  };


  handleSelectRows = (rows, rowkeys) => {
    //针对翻页无法保存选择的行数据处理
    let { selectedRows, selectedRowKeys } = this.state;
    let pre_sele_rows_keyarray = [];
    for (let i in selectedRows) {
      pre_sele_rows_keyarray.push(selectedRows[i].categoryId);
    }
    //去掉的话要删掉行数据
    for (let i in selectedRowKeys) {
      if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
        selectedRows = selectedRows.filter(item => item.categoryId != selectedRowKeys[i]);
      }
    }
    //没有的话追加行数据
    for (let i in rowkeys) {
      if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
        let cur_row = rows.filter(item => item.categoryId == rowkeys[i])[0];
        selectedRows.push(cur_row);
      }
    }
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: rowkeys,
    });
  };

  //删除选中的分类
  delSelCat = (id) => {
    let { selectedRows, selectedRowKeys } = this.state;
    selectedRows = selectedRows.filter(item => item.categoryId != id);
    selectedRowKeys = selectedRowKeys.filter(item => item != id);
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  };

  //表格列拖动
  resizeTable = (index, size, type, data) => {
    let datas = dragSldTableColumn(index, size, data);
    this.setState({ [type]: datas });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    if (type == 'main') {
      const { formValues } = this.state;
      const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
      pageSize = params.pageSize;
      this.setState({
        params: params,
      });
      this.get_list(params);
    }
  };


  //搜索事件
  search = (data) => {
    for(let i in data){
      if(data[i] == ''){
        delete data[i]
      }
    }
    this.setState({
      formValues: data,
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize, ...data });
  };
  //搜索重置事件
  seaReset = () => {
    //搜索条件置为空
    this.setState({
      formValues: {},
      params: { pageSize: pageSize }
    });
    this.get_list({ pageSize: pageSize });
  };

  //取消事件
  sldCancle = () => {
    this.setState({
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
    });
    this.props.sldHandleAddSkuModalCancle();
  };

  sldConfirm = () => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
        failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个分类')}`);//该模块至少需要选择   个分类
        return false;
      }
      if (this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
        failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个分类')}`);//该模块需要选择   个分类
        return false;
      }
      if (this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
        failTip(`${sldComLanguage('该模块最多只能选择')}${this.props.extra.max_num}${sldComLanguage('个分类')}`);//该模块最多只能选择   个分类
        return false;
      }
      let tmp_rows = [];
      for (let i in selectedRows) {
        tmp_rows.push({
          categoryId: selectedRows[i].categoryId,
          categoryName: selectedRows[i].categoryName,
          pid: selectedRows[i].pid,
          grade: selectedRows[i].grade,
        });
      }
      this.props.seleSku(tmp_rows, selectedRowKeys);
      this.props.sldHandleAddSkuModalCancle();
    } else {
      failTip(`${sldComLanguage('请选择')}${sldComLanguage('分类')}`);//请选择分类
    }
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.init_flag = true;
  };

  onExpand = (expanded, record) => {
    let { expandedRowKeys } = this.state;
    if (expanded) {
      expandedRowKeys.push(record.categoryId);
      this.get_list({ categoryId: record.categoryId, grade: record.grade });
    } else {
      expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
    }
    this.setState({ expandedRowKeys });
  };

  render() {
    const { modalAddSkuIsShow, width, modaltitle } = this.props;
    const { selectedRows, search_data, data, loading, selectedRowKeys, expandedRowKeys, columns, sel_columns } = this.state;
    return (
      <Modal destroyOnClose={true}
             onOk={this.sldConfirm}
             afterClose={this.closeReset}
             onCancel={this.sldCancle} visible={modalAddSkuIsShow} width={width} title={modaltitle}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={global.common_page} style={{ flex: 1 }}>
            {/*标准表格-start*/}
            {selectedRows.length > 0 &&
            <StandardTable
              totalHeight={200}
              selectedRows={[]}
              selectedRowKeys={[]}
              data={{ list: selectedRows }}
              rowKey={'id'}
              isCheck={false}
              columns={sel_columns}
              onSldHandleSeleRow={null}
              onSelectRow={null}
              onChange={null}
              sldpagination={false}
            />
            }
            {/*标准表格-end*/}
            <div className={global.tableListForm}>
              <div style={{ position: 'relative' }}>
                <Search search_data={search_data} top={0} seaSubmit={(data) => this.search(data)}
                        seaReset={() => this.seaReset()}/>
              </div>
            </div>
            <Spin spinning={loading}>
              {/*标准表格-start*/}
              <StandardTable
                expandedRowKeys={expandedRowKeys}
                selectedRows={selectedRows}
                selectedRowKeys={selectedRowKeys}
                data={data}
                rowKey={'categoryId'}
                isCheck={true}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                flag_show_sele_data={true}
                onExpand={this.onExpand}
                onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                isColumnResize={true}
              />
              {/*标准表格-end*/}
            </Spin>
          </div>
        </div>

      </Modal>
    );
  }
}
