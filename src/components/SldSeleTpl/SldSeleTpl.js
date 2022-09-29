import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Button, Modal, Spin, Popover } from 'antd';
import global from '@/global.less';
import {
  failTip,
  getSldEmptyH,
  list_com_page_more,
  list_com_page_size_10,
  sldHandlePaginationData,
  getTableNum,
  sldComLanguage,
} from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import styles from './SldSeleTpl.less';

let pageSize = list_com_page_size_10;
@connect(({ pc_home }) => ({
  pc_home,
}))
@Form.create()
export default class SldSeleTpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sel_top_cat: '',
      sel_left_tpl_id: '',
      selectedRowKeys: [],
      selectedRows: [],
      params: { pageSize: pageSize },//搜索条件
      loading: false,
      tpl_type_list: [],//装修模板类型
      tpl_list: [],//装修模板列表(模板风格列表)
      data: {},//实例化模板列表
      columns: [
        {
          title: ' ',
          align: 'center',
          dataIndex: 'dataId',
          width: 55,
          render: (text, record, index) => getTableNum(this.state.params, pageSize, index),
        },
        {
          title: `${sldComLanguage('实例化模板名称')}`,
          aligsldSvgIconn: 'left',
          dataIndex: 'name',
          width: 150,
        },

        {
          title: `${sldComLanguage('排序')}`,
          dataIndex: 'sort',
          width: 80,
        },
        {
          title: `${sldComLanguage('创建时间')}`,
          dataIndex: 'createTime',
          align: 'center',
          width: 150,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 180,
          render: (text, record) => (
            <Fragment>
              <Popover placement="leftBottom" content={<div className={global.com_zoom}
                                                            dangerouslySetInnerHTML={{ __html: record.html }}></div>}
                       title={sldComLanguage('装修模版效果预览')}>
                <a>{sldComLanguage('预览')} </a>
              </Popover>
            </Fragment>
          ),
        },
      ],
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.sele_type != '') {
      this.setState({ sele_type: nextProps.sele_type }, () => {
        this.get_tpl_type_list();//获取装修模板分类
      });
    }
  }

  //获取装修模板分类
  get_tpl_type_list = () => {
    const { dispatch } = this.props;
    const { sele_type } = this.state;
    dispatch({
      type: 'pc_home/get_tpl_type_list',
      callback: (res) => {
        if (res.state == 200) {
          if (sele_type == 'main_banner') {
            res.data = res.data.filter(item => item.type == 'main_banner');
          } else if (sele_type == 'floor') {
            res.data = res.data.filter(item => item.type != 'main_banner' && item.type != 'top_com_nav');
          }
          this.setState({
            tpl_type_list: res.data,
            sel_top_cat: res.data.length > 0 ? res.data[0].type : '',
          }, () => {
            if (res.data.length > 0) {
              this.get_tpl_plate(res.data[0].type);
            }
          });
        }
      },
    });
  };

  //确定事件
  sldConfirm = (e) => {
    e.preventDefault();
    const { selectedRows } = this.state;
    if (selectedRows.length == 0) {
      failTip(`${sldComLanguage('至少选择一个装修模板')}`);
      return false;
    } else {
      this.props.sldHandleConfirm(selectedRows);
      this.setState({ selectedRows: [], selectedRowKeys: [] });
    }
  };

  //取消事件-清空表单
  sldCancle = () => {
    this.props.sldHandleCancle();
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.props.form.resetFields();
  };

  //选择模板
  sel_tpl = (type) => {
    this.setState({ sel_top_cat: type });
    this.get_tpl_plate(type);//根据模板类型获取模板风格列表
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
    const { formValues } = this.state;
    const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
    pageSize = params.pageSize;
    this.setState({
      params: params,
    });
    this.get_tpl_instance_list(params);
  };

  //根据模板类型获取模板风格列表(模板列表)
  get_tpl_plate = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pc_home/get_tpl_list',
      payload: { type: type, pageSize: list_com_page_more },
      callback: (res) => {
        if (res.state == 200) {
          this.setState({
            tpl_list: res.data.list,
            sel_left_tpl_id: res.data.list.length > 0 ? res.data.list[0].tplPcId : '',
          }, () => {
            if (res.data.list.length > 0) {
              this.get_tpl_instance_list({ pageSize: pageSize });
            }
          });
        }
      },
    });
  };

  get_tpl_instance_data = (id) => {
    this.setState({ sel_left_tpl_id: id }, () => {
      this.get_tpl_instance_list({ pageSize: pageSize });
    });
  };

  //根据模板获取实例化模板列表
  get_tpl_instance_list = (param) => {
    const { dispatch } = this.props;
    const { params, sel_left_tpl_id } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'pc_home/get_tpl_instance_list',
      payload: { ...param, tplId: sel_left_tpl_id, isEnable: 1 },
      callback: (res) => {
        if (res.state == 200) {
          if (res.data.length == 0 && this.state.params.current > 1) {
            params.current = params.current - 1;
            this.get_tpl_instance_list(params);
          } else {
            this.setState({
              data: res.data,
            });
          }
        }
        this.setState({ loading: false });
      },
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

  render() {
    const { modalVisible, submiting, zIndex, show_foot } = this.props;
    const { tpl_type_list, tpl_list, data, columns, selectedRows, sel_top_cat, sel_left_tpl_id, loading, sele_type } = this.state;
    return <Modal
      title={''}
      zIndex={zIndex}
      afterClose={this.closeReset}
      width={this.props.width ? this.props.width : 416}
      visible={modalVisible}
      onOk={this.sldConfirm}
      onCancel={this.sldCancle}
      footer={show_foot != undefined && !show_foot ? null : [
        <Button key="back" onClick={this.sldCancle}>{sldComLanguage('取消')}</Button>,
        <Button key="submit" type="primary" loading={submiting} onClick={this.sldConfirm}>
          {sldComLanguage('确定')}
        </Button>,
      ]}
    >
      <Form
        layout="horizontal"
      >
        <div className={`${global.flex_com_column_start_start} ${styles.wrap}`}>
          <div className={`${global.flex_com_row_start_center} ${styles.sel_tpl_top}`}>
            <span className={styles.sel_title}>{sldComLanguage('选择模板')}</span>
            {tpl_type_list.length > 0 && tpl_type_list.map((item, index) => {
              return <a key={index}
                        style={{ borderBottomColor: sel_top_cat == item.type ? '#fff' : 'transparent' }}
                        href='javascript:void(0)'
                        onClick={() => this.sel_tpl(item.type)}>{item.typeName}</a>;
            })
            }
          </div>
          <div className={`${global.flex_com_row_start_start} ${styles.sel_tpl_main}`}>

            <div className={`${global.flex_com_column_start_center} ${styles.left}`}>
              <Scrollbars
                autoHeight
                autoHeightMax={455}>
                {getSldEmptyH(8)}
                {tpl_list.length > 0 && tpl_list.map((item, index) => {
                  return <a style={sel_left_tpl_id == item.tplPcId ? {
                    backgroundColor: '#FC701E',
                    color: '#fff',
                  } : { backgroundColor: '#fff', color: '#333' }} key={index} href='javascript:void(0)'
                            onClick={() => this.get_tpl_instance_data(item.tplPcId)}>{item.name.length > 6 ? item.name.substring(0, 6) : item.name}</a>;
                })
                }
              </Scrollbars>
            </div>
            <div className={`${styles.right}`} style={{ width: 875 }}>
              {/*标准表格-start*/}
              <Scrollbars autoHeight
                          autoHeightMin={50}
                          autoHeightMax={450}>
                <Spin spinning={loading}>
                  <StandardTable
                    width={875}
                    selectedRows={selectedRows}
                    data={data}
                    rowKey={'dataId'}
                    isCheck={true}
                    sel_type={sele_type == 'main_banner' ? 'radio' : 'checkbox'}
                    columns={columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                    resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                    isColumnResize={true}
                  />
                </Spin>
              </Scrollbars>
              {/*标准表格-end*/}
            </div>
          </div>
        </div>
      </Form>
    </Modal>;
  }
}


