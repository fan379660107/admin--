/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于装修直播选择
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
  Form, Modal,Empty
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
import ALibbSvg from '../ALibbSvg';
import { Scrollbars } from 'react-custom-scrollbars';

let pageSize = list_com_page_size_16;
@connect(({ pc_home, project }) => ({
  pc_home,
  project,
}))
@Form.create()
export default class SldSelMoreLeftRightLive extends Component {
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
        label: `${sldComLanguage('直播名称')}`,
        name: 'liveName',
        placeholder: `${sldComLanguage('请输入直播名称')}`,//请输入直播名称
      }, {
        type: 'select',
        label: `${sldComLanguage('直播状态')}`,
        name: 'liveState',
        placeholder: `${sldComLanguage('请选择直播状态')}`,
        sel_data: [
          { key: '', name:  `${sldComLanguage('全部')}`},
          { key: '2', name: `${sldComLanguage('直播')}` },
          { key: '3', name:  `${sldComLanguage('回放')}`},
        ],
      }, {
        type: 'select',
        label: `${sldComLanguage('直播标签')}`,
        name: 'labelId',
        placeholder: `${sldComLanguage('请选择直播标签')}`,
        sel_data: [],
        diy: true,
        sele_key: 'labelId',
        sele_name: 'labelName',
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
    let new_params = { ...params,type:'decorate' };
    dis_type = 'project/get_live_lists';
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


  //获取直播标签列表
  get_label = () => {
    let { search_data } = this.state;
    const { dispatch } = this.props;
    //is_show:1,只获取允许显示的标签,type:2表示直播标签
    dispatch({
      type: 'project/get_live_label_lists',
      payload: { pageSize: list_com_page_more, isShow: 1 },
      callback: (res) => {
        if (res.state == 200) {
          let tmp_data = search_data.filter(item => item.name == 'labelId')[0];
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
        failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}个直播`);//该模块至少需要选择   个直播
        return false;
      }
      if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
        failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}个直播`);//该模块需要选择   个直播
        return false;
      }
      if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
        failTip(`${sldComLanguage('该模块最多选择')}${this.props.extra.max_num}${sldComLanguage('个直播')}`);//该模块至少需要选择   个直播
        return false;
      }

      this.props.seleSvideo(selectedRows, selectedRowKeys);
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      });
    } else {
      failTip(`${sldComLanguage('请选择直播')}`);//请选择直播
    }
    this.setState({ params: { pageSize: pageSize } });
  };

  //关闭modal之后重置数据
  closeReset = () => {
    this.init_flag = true;
  };

  //滚动条滚动到底部事件
  handleScrollLeft = (e) => {
    let { data } = this.state;
    //是否还有数据
    if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
      //请求分页数据
      this.loading_pagination_flag = true;
      this.get_list({ pageSize: pageSize, current: data.pagination.current * 1 + 1 });
    }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
    let { selectedRows, selectedRowKeys } = this.state;
    if (selectedRowKeys.indexOf(item.liveId) == -1) {
      selectedRowKeys.push(item.liveId);
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
    selectedRows = selectedRows.filter(items => items.liveId != item.liveId);
    selectedRowKeys = selectedRowKeys.filter(items => items != item.liveId);
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
                        <img className={styles.left_play_icon}
                             src={require('../../assets/m_diy_img/live/modal_' + (item.liveState == 2 ? 'living' : 'back') + '_icon.png')}/>
                        <img className={styles.live_img} src={item.liveCover}/>
                        <div className={`${styles.play_icon}`}>
                          <ALibbSvg fill={'#fff'} width={22} height={22} type={'bofang11'}/>
                        </div>
                        <div className={`${styles.play_num}`}>
                          <span>{formatNumW(item.viewingNum)}{sldComLanguage('人观看')}</span>
                        </div>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.liveName}</span>
                        <span className={`${styles.svideo_label}`}>{item.labelName}</span>
                        {selectedRowKeys.indexOf(item.liveId) > -1 &&
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
                  {selectedRows.length > 0
                    ?selectedRows.map((item, index) => {
                    return <a key={index} href={'javascript:void(0)'}
                              className={`${styles.item} ${global.flex_row_start_start}`}
                              onClick={() => this.handleRightItem(item)}
                              style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}>
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                        <img className={styles.left_play_icon}
                             src={require('../../assets/m_diy_img/live/modal_' + (item.liveState == 2 ? 'living' : 'back') + '_icon.png')}/>
                        <img className={styles.live_img} src={item.liveCover}/>
                        <div className={`${styles.play_icon}`}>
                          <ALibbSvg fill={'#fff'} width={22} height={22} type={'bofang11'}/>
                        </div>
                        <div className={`${styles.play_num}`}>
                          <span>{formatNumW(item.viewingNum)}{sldComLanguage('人观看')}</span>
                        </div>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                        <span className={`${styles.svideo_name}`}>{item.liveName}</span>
                        <span className={`${styles.svideo_label}`}>{item.labelName}</span>
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
