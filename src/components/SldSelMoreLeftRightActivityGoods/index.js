/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于装修活动商品选择
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
  Empty,
  Form, Modal,
} from 'antd';
import {
  failTip,
  list_com_page_size_16,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './index.less';
import Search from '@/components/Search/Search';
import ALibbSvg from '../ALibbSvg';
import { Scrollbars } from 'react-custom-scrollbars';

let pageSize = list_com_page_size_16;
@connect(({ pc_home, project }) => ({
  pc_home,
  project,
}))
@Form.create()
export default class SldSelMoreLeftRightActivityGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      modalVisible: false,
      loading: false,
      data: {},
      title: '',
      params: { pageSize: pageSize },//搜索条件
      search_data: [{
        type: 'input',
        label: `${sldComLanguage('商品名称')}`,//商品名称
        name: 'goods_name',
        placeholder: `${sldComLanguage('请输入商品名称')}`,//请输入商品名称
      }, {
        type: 'input',
        label: `${sldComLanguage('店铺名称')}`,//店铺名称
        name: 'store_name',
        placeholder: `${sldComLanguage('请输入店铺名称')}`,//请输入店铺名称
      }],
      formValues: {},//搜索条件
      activityType: props.activityType,//活动类型
    };
  }

  init_flag = true;
  loading_pagination_flag = false;//分页加载标识，防止分页重复加载

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { activityType } = this.state;
    if (nextProps.modalVisible) {
      if (nextProps.activityType == 'pin') {
        activityType = 'pin_tuan';//拼团
      } else if (nextProps.activityType == 'discount') {
        activityType = 'xianshi';//限时折扣
      } else if (nextProps.activityType == 'group_buy') {
        activityType = 'tuan';//团购
      }
      this.setState({
        selectedRows: [...nextProps.selectedRows],
        selectedRowKeys: [...nextProps.selectedRowKeys],
        activityType,
      }, () => {
        this.get_list({ pageSize: pageSize });
      });
    }
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    let { data, activityType } = this.state;
    let dis_type = '';
    let new_params = { goods_state: 1, ...params, activity_type: activityType };
    dis_type = 'project/get_activity_goods_sku_lists';
    dispatch({
      type: dis_type,
      payload: new_params,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.pagination != undefined) {
            if (res.pagination.current == 1) {
              data.list = res.data;
            } else {
              data.list = data.list.concat(res.data);
            }
            data.pagination = res.pagination;
          }
          this.setState({
            data: data,
          });
          this.loading_pagination_flag = false;
        }
      },
    });
  };

  //搜索事件
  search = (data) => {
    for (let i in data) {
      if (data[i] == '') {
        delete data[i];
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
      params: { pageSize: pageSize },
    });
    this.props.sldHandleSeleMoreModalCancle();
  };

  sldConfirm = () => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
        failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
        return false;
      }
      if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
        failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个商品')}`);//该模块需要选择   个商品
        return false;
      }
      if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
        failTip(`${sldComLanguage('该模块最多选择')}${this.props.extra.max_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
        return false;
      }

      this.props.seleSvideo(selectedRows, selectedRowKeys);
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      });
    } else {
      failTip(`${sldComLanguage('请选择商品')}`);//请选择商品
    }
    this.setState({ params: { pageSize: pageSize } });
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.init_flag = true;
  };

  //滚动条滚动到底部事件
  handleScrollLeft = (e) => {
    const { height } = this.props;
    let { data } = this.state;
    //当滚动到距离底部50px的时候请求分页
    if (e.scrollTop < (height * (data.pagination.current * 1 - 1) + 50) && e.scrollTop > height * (data.pagination.current * 1 - 1)) {
      //是否还有数据
      if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
        //请求分页数据
        this.loading_pagination_flag = true;
        this.get_list({ pageSize: pageSize, current: data.pagination.current * 1 + 1 });
      }
    }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.indexOf(item.gid) == -1) {
      selectedRowKeys.push(item.gid);
      selectedRows.push(item);
    }
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  //右侧数据点击事件（移除选中数据，右侧将不显示，左侧的选中标识去掉）
  handleRightItem = (item) => {
    let { selectedRows, selectedRowKeys } = this.state;
    selectedRows = selectedRows.filter(items => items.gid != item.gid);
    selectedRowKeys = selectedRowKeys.filter(items => items != item.gid);
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  render() {
    const { modalVisible, width, title, height } = this.props;
    const { selectedRows, search_data, data, selectedRowKeys } = this.state;
    return (
      <Modal destroyOnClose={true}
             onOk={this.sldConfirm}
             afterClose={this.closeReset}
             onCancel={this.sldCancle}
             visible={modalVisible}
             width={width}
             title={title}>
        <div className={`${styles.component_sele_more} ${global.flex_column_start_start}`}>
          <div className={global.tableListForm}>
            <div style={{ position: 'relative' }}>
              <Search search_data={search_data} top={0} seaSubmit={(data) => this.search(data)}
                      seaReset={() => this.seaReset()}/>
            </div>
          </div>
          <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height }}>
            <div style={{ height: height, background: '#f5f5f5' }}>
              <Scrollbars
                onScrollFrame={(e) => this.handleScrollLeft(e)}
                style={{ width: 438, zIndex: 1 }}>
                <div className={`${styles.left} ${global.flex_row_start_start}`} style={{ height: height }}>
                  {data.list != undefined && data.list.length > 0 &&
                  data.list.map((item, index) => {
                    return <a key={index} href={'javascript:void(0)'}
                              className={`${styles.item} ${global.flex_row_start_start}`}
                              onClick={() => this.handleLeftItem(item)}
                              style={{ marginBottom: index == data.list.length - 1 ? 10 : 0 }}>
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                        <img className={styles.live_img} src={item.goods_image}/>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.goods_name}</span>
                        <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.goods_price}</span>
                        {selectedRowKeys.indexOf(item.gid) > -1 &&
                        <div className={`${styles.sele_svideo_flag}`}>
                          <ALibbSvg fill={'#FA6F1E'} width={19} height={19} type={'yixuan'}/>
                        </div>
                        }
                      </div>
                    </a>;
                  })
                  }
                  {data.list == undefined||data.list.length ==0 &&
                  <div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                  </div>
                  }
                </div>
              </Scrollbars>
            </div>
            <div className={`${styles.center} ${global.flex_row_center_center}`}>
              <ALibbSvg fill={'#ECF5FF'} width={39} height={32} type={'move-up1'}/>
            </div>
            <div style={{ height: height, background: '#f5f5f5' }}>
              <Scrollbars
                style={{ width: 438, zIndex: 1 }}>
                <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                  {selectedRows.length > 0 ?
                  selectedRows.map((item, index) => {
                    return <a key={index} href={'javascript:void(0)'}
                              className={`${styles.item} ${global.flex_row_start_start}`}
                              onClick={() => this.handleRightItem(item)}
                              style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}>
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                        <img className={styles.live_img} src={item.goods_image}/>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.goods_name}</span>
                        <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.goods_price}</span>
                        <div className={`${styles.sele_svideo_flag}`}>
                          <ALibbSvg fill={'#FA6F1E'} width={19} height={19} type={'ziyuan21'}/>
                        </div>
                      </div>
                    </a>;
                  })
                    :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('您还未选择数据')}`}/>
                    </div>
                  }
                </div>
              </Scrollbars>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
