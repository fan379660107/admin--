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
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    list_com_page_size_10,
    dateFormat,
    sldtbaleOpeBtnText,
    list_com_page_more,
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import Link from 'umi/link';

let pageSize = list_com_page_size_10;
let pageMore = list_com_page_more;
let sthis = '';

@connect(({ information }) => ({
    information,
}))
@Form.create()
export default class Lists extends Component {
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            params: { pageSize: pageSize },//搜索条件
            formValues: {},//搜索条件
            search_data: [{
                type: 'select',
                label: `通知类型`,
                name: 'tplTypeCode',
                placeholder: `${sldComLanguage('请选择通知类型')}`,//请选择会员状态
                sel_data: [],
            }, {
                type: 'select',
                label: `${sldComLanguage('通知状态')}`,
                name: 'msgState',
                placeholder: `${sldComLanguage('请选择通知状态')}`,//请选择会员状态
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '0', name: `${sldComLanguage('未读')}` },
                    { key: '1', name: `${sldComLanguage('已读')}` },
                ],
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('通知时间')}`,//发布时间
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`,
            }],
            columns: [{
                title: `${sldComLanguage('通知内容')}`,
                dataIndex: 'msgContent',
                align: 'center',
            }, {
                title: `${sldComLanguage('通知类型')}`,
                dataIndex: 'tplName',
                align: 'center',
            }, {
                title: `${sldComLanguage('通知状态')}`,
                dataIndex: 'msgStateValue',
                align: 'center',
            }, {
                title: `${sldComLanguage('操作')}`,
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <Fragment>
                        <Link to={{
                            pathname: '/manage_product/goods_detail',
                            query: {
                                id: record.receiveId,
                                source: '/manage_product/goods_list',
                            },
                        }}>
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                        </Link>
                    </Fragment>
                ),
            },],
            initLoading: false,
            data: [],
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
        }
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        //获取通知类型模板
        this.get_infoList({ pageSize: pageMore });
    }

    get_infoList = (params) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/get_infoTypeModal',
            payload: params,
            callback: res => {
                if(res.state == 200){
                    let searchData = this.state.search_data;
                    let dataList = res.data;
                    let selDataList = [];
                    dataList.map(item => {
                        selDataList.push({
                            key: item.tplTypeCode,
                            name: item.tplName
                        });
                    });
                    searchData[0].sel_data = selDataList;
                    this.setState({
                        search_data: JSON.parse(JSON.stringify(searchData))
                    })

                }else{
                    failTip(res.msg);
                }
            }
        });
    }

    get_list = (params) => {
        const { dispatch } = this.props;
        this.setState({
            initLoading: true,
        })
        dispatch({
            type: 'information/get_infoModal',
            payload: params,
            callback: res => {
                if (res.state == 200) {
                    this.setState({
                        data: res.data,
                        initLoading: false
                    })
                }else{
                    this.setState({
                        initLoading: false
                    })
                    failTip(res.msg);
                }
            }
        })
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

    //搜索事件
    search = (data) => {
        const values = { ...data };
        //时间处理
        if (values.search_create_time) {
            values.startTime = values.search_create_time[0] ? values.search_create_time[0].format(dateFormat) + ' 00:00:00' : '';
            values.endTime = values.search_create_time[1] ? values.search_create_time[1].format(dateFormat) + ' 23:59:59': '';
            values.search_create_time = '';
        }
        for(let i in values){
          if(values[i] == ''){
            delete values[i]
          }
        }
        this.setState({
            formValues: values,
            params: { pageSize: pageSize }
        });
        this.get_list(values);
    };
    //搜索重置事件
    seaReset = () => {
        //搜索条件置为空
        this.setState({
            formValues: {},
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize })
    };
    //商品操作  type:操作类型 del: 删除 readed: 批量标记已读
    operateGoods = (id, type) => {
        const { params } = this.state;
        const { dispatch } = this.props;
        let param_data = {};
        let dis_type = '';
        if (type == 'del') {
            dis_type = 'information/all_delModal';
            param_data.ids = id;
        } else if (type == 'readed') {
            dis_type = 'information/all_readModal';
            param_data.ids = id;
        }
        dispatch({
            type: dis_type,
            payload: param_data,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list(params);
                } else {
                    failTip(res.msg);
                }
            },
        });
    };

    render() {
        const { search_data, data, initLoading, selectedRows, columns, selectedRowKeys } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('通知中心')}`, 0, 0, 5)}
                <div className={global.tableListForm}>
                    <Search search_data={search_data}
                        seaSubmit={(data) => this.search(data)} seaReset={() => this.seaReset()} />
                </div>
                {/*公共功能条-start*/}
                <div className={global.operate_bg}
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                            failTip(`${sldComLanguage('请先选中数据')}`);
                            //确认删除选中的商品吗？
                        }, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 3, 'xinzeng1', '#ff0f3c') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的商品吗？')}`, () => this.operateGoods(selectedRowKeys.join(','), 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 3, 'xinzeng1', '#ff0f3c'), 0, 0, '#ff0f3c')}

                        {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                            failTip(`${sldComLanguage('请先选中数据')}`);
                            //确认标记选中的商品为已读吗？
                        }, `${sldComLanguage('批量标记已读')}`, 7, 0, 15, 15, 3, 'iconbiaoji', '#FA6F1E') : sldPopConfirm('leftBottom', `${sldComLanguage('确认标记选中的商品为已读吗？')}`, () => this.operateGoods(selectedRowKeys.join(','), 'readed'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('批量标记已读')}`, 7, 0, 15, 15, 3, 'iconbiaoji', '#FA6F1E'), 0, 0, '#FA6F1E')}
                    </div>
                </div>
                {/*公共功能条-end*/}
                <Spin spinning={initLoading}>
                    {/*标准表格-start*/}
                    <StandardTable
                        selectedRows={selectedRows}
                        data={data}
                        rowKey={'receiveId'}
                        isCheck={true}
                        columns={columns}
                        onSelectRow={this.handleSelectRows}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                        onSldHandleSeleRow={this.onSldHandleSeleRow}
                        resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                        isColumnResize={true}
                    />
                    {/*标准表格-end*/}

                </Spin>
            </div>

        );
    }
}
