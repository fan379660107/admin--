/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于装修短视频选择
*  */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
  Form, Modal,
} from 'antd';
import {
  failTip,
  list_com_page_size_16,
  sldComLanguage,
  list_com_page_more,
  formatNumW,
} from '@/utils/utils';
import global from '@/global.less';
import styles from './index.less';
import Search from '@/components/Search/Search';
import ALibbSvg from '@/components/ALibbSvg';
import { Scrollbars } from 'react-custom-scrollbars';

let pageSize = list_com_page_size_16;
@connect(({ pc_home, project }) => ({
  pc_home,
  project,
}))
@Form.create()
export default class SldSelMoreLeftRight extends Component {
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
        label: `视频名称`,
        name: 'video_name',
        placeholder: `${sldComLanguage('请输入')}短视频名称`,//请输入短视频名称
      }, {
        type: 'select',
        label: `视频标签`,
        name: 'label_id',
        placeholder: `请选择视频标签`,
        sel_data: [],
        diy: true,
        sele_key: 'label_id',
        sele_name: 'label_name',
      },
      ],
      formValues: {},//搜索条件
    };
  }

  init_flag = true;
  loading_pagination_flag = false;//分页加载标识，防止分页重复加载

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.modalVisible) {
      this.get_list({ pageSize: pageSize });
      this.get_label();
      this.setState({
        selectedRows: [...nextProps.selectedRows],
        selectedRowKeys: [...nextProps.selectedRowKeys],
      });
    }
  }

  componentWillUnmount() {

  }

  //获取数据列表
  get_list = (params) => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    let { data } = this.state;
    let dis_type = '';
    //status：2 视频状态为正常
    let new_params = { ...params, status: 2 };
    dis_type = 'project/get_svideo_lists';
    dispatch({
      type: dis_type,
      payload: new_params,
      callback: (res) => {
        this.setState({ loading: false });
        if (res.state == 200) {
          if (res.data.pagination != undefined) {
            if (res.data.pagination.current == 1) {
              data = res.data;
            } else {
              data.list = data.list.concat(res.data.list);
            }
            data.pagination = res.data.pagination;
          }
          this.setState({
            data: data,
          });
          this.loading_pagination_flag = false;
        }
      },
    });
  };


  //获取短视频标签列表
  get_label = () => {
    let { search_data } = this.state;
    const { dispatch } = this.props;
    //is_show:1,只获取允许显示的标签
    dispatch({
      type: 'project/get_svideo_label_lists',
      payload: { pageSize: list_com_page_more, is_show: 1 },
      callback: (res) => {
        if (res.state == 200) {
          let tmp_data = search_data.filter(item => item.name == 'label_id')[0];
          tmp_data.sel_data = res.data.list;
          this.setState({
            search_data,
          });
        } else {
          failTip(res.msg);
        }
      },
    });
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
      params: { pageSize: pageSize },
    });
    this.props.sldHandleSeleMoreModalCancle();
  };

  sldConfirm = () => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
        failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}个短视频`);//该模块至少需要选择   个短视频
        return false;
      }
      if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
        failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}个短视频`);//该模块需要选择   个短视频
        return false;
      }
      if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
        failTip(`该模块最多选择${this.props.extra.max_num}个短视频`);//该模块至少需要选择   个短视频
        return false;
      }

      this.props.seleSvideo(selectedRows, selectedRowKeys);
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      });
    } else {
      failTip(`请选择短视频`);//请选择短视频
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
    let {data,formValues} = this.state;
    //当滚动到距离底部50px的时候请求分页
    if (e.scrollTop < (height * (data.pagination.current * 1 - 1) + 50) && e.scrollTop > height * (data.pagination.current * 1 - 1)) {
      //是否还有数据
      if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
        //请求分页数据
        this.loading_pagination_flag = true;
        this.get_list({ pageSize: pageSize, current: data.pagination.current * 1 + 1,...formValues });
      }
    }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.indexOf(item.video_id) == -1) {
      selectedRowKeys.push(item.video_id);
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
    selectedRows = selectedRows.filter(items => items.video_id != item.video_id);
    selectedRowKeys = selectedRowKeys.filter(items => items != item.video_id);
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
                    return <div key={index} className={`${styles.item} ${global.flex_row_start_start}`}
                                onClick={() => this.handleLeftItem(item)}
                                style={{ marginBottom: index == data.list.length - 1 ? 10 : 0 }}>
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                        <img src={item.video_image}/>
                        <div className={`${styles.play_icon}`}>
                          <ALibbSvg fill={'#fff'} width={22} height={22} type={'bofang'}/>
                        </div>
                        <div className={`${styles.play_num}`}>
                          <span>播放量:{formatNumW(item.click_num)}</span>
                        </div>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.video_name}</span>
                        <span className={`${styles.svideo_label}`}>{item.label_name}</span>
                        {selectedRowKeys.indexOf(item.video_id) > -1 &&
                        <div className={`${styles.sele_svideo_flag}`}>
                          <ALibbSvg fill={'#FA6F1E'} width={19} height={19} type={'yixuan'}/>
                        </div>
                        }
                      </div>
                    </div>;
                  })
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
                  {selectedRows.length > 0 &&
                  selectedRows.map((item, index) => {
                    return <div key={index} className={`${styles.item} ${global.flex_row_start_start}`}
                                onClick={() => this.handleRightItem(item)}
                                style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}>
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                        <img src={item.video_image}/>
                        <div className={`${styles.play_icon}`}>
                          <ALibbSvg fill={'#fff'} width={22} height={22} type={'bofang'}/>
                        </div>
                        <div className={`${styles.play_num}`}>
                          <span>播放量:{formatNumW(item.click_num)}</span>
                        </div>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.video_name}</span>
                        <span className={`${styles.svideo_label}`}>{item.label_name}</span>
                        <div className={`${styles.sele_svideo_flag}`}>
                          <ALibbSvg fill={'#FA6F1E'} width={19} height={19} type={'ziyuan21'}/>
                        </div>
                      </div>
                    </div>;
                  })
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
