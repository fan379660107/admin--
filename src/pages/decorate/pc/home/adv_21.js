/*
* 信息汇聚模块，3列布局，每列布局可以设置标题，3个主标题，每个主标题还可以设置多个子标题
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldDiyTitleLinkModal from '@/components/SldDiyTitleLinkModal/SldDiyTitleLinkModal';
import SldDiyMoreTitleLinkModal from '@/components/SldDiyMoreTitleLinkModal/SldDiyTitleLinkModal';
import global from '@/global.less';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_21 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      cur_data: {},
      l_tab_index: 0,//左侧选中的tab
      r_tab_index: 0,//右侧选中的tab
      modalTitle: '',//弹框的标题
      modal_tip: [],//弹框的提示语
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalTitleVisible: false,//是否展示标题modal
      modalSldDiyMoreTitleLinkVisible: false,//标题链接选择器——多选
      modalSldDiyTitleLinkVisible: false,//标题链接选择器——单选
      tpl_info: props.tpl_info,
      data: {
        type: 'adv_21',
        data: [
          {
            top_title: {
              title: {
                label: `标题`,
                name: 'title',
                initialValue: `左侧标题`,
                required: true,
              },
              sub_title: {
                label: `描述`,
                name: 'sub_title',
                initialValue: `右侧描述`,
                required: true,
              },
              link_type: '',
              link_value: '',
              info: {},
            },
            detail: [
              {
                left: {
                  title: {
                    label: `左标题1`,
                    name: 'title',
                    initialValue: `左标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题2`,
                    name: 'title',
                    initialValue: `左标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题3`,
                    name: 'title',
                    initialValue: `左标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题7`,
                    name: 'title7',
                    initialValue: `子标题7`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题8`,
                    name: 'title8',
                    initialValue: `子标题8`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题9`,
                    name: 'title9',
                    initialValue: `子标题9`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题10`,
                    name: 'title10',
                    initialValue: `子标题10`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题11`,
                    name: 'title11',
                    initialValue: `子标题11`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题12`,
                    name: 'title12',
                    initialValue: `子标题12`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
            ],
          },
          {
            top_title: {
              title: {
                label: `标题`,
                name: 'title',
                initialValue: `左侧标题`,
                required: true,
              },
              sub_title: {
                label: `描述`,
                name: 'sub_title',
                initialValue: `右侧描述`,
                required: true,
              },
              link_type: '',
              link_value: '',
              info: {},
            },
            detail: [
              {
                left: {
                  title: {
                    label: `左标题1`,
                    name: 'title',
                    initialValue: `左标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题2`,
                    name: 'title',
                    initialValue: `左标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题3`,
                    name: 'title',
                    initialValue: `左标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题7`,
                    name: 'title7',
                    initialValue: `子标题7`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题8`,
                    name: 'title8',
                    initialValue: `子标题8`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题9`,
                    name: 'title9',
                    initialValue: `子标题9`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题10`,
                    name: 'title10',
                    initialValue: `子标题10`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题11`,
                    name: 'title11',
                    initialValue: `子标题11`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题12`,
                    name: 'title12',
                    initialValue: `子标题12`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
            ],
          },
          {
            top_title: {
              title: {
                label: `标题`,
                name: 'title',
                initialValue: `左侧标题`,
                required: true,
              },
              sub_title: {
                label: `描述`,
                name: 'sub_title',
                initialValue: `右侧描述`,
                required: true,
              },
              link_type: '',
              link_value: '',
              info: {},
            },
            detail: [
              {
                left: {
                  title: {
                    label: `左标题1`,
                    name: 'title',
                    initialValue: `左标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题2`,
                    name: 'title',
                    initialValue: `左标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
              {
                left: {
                  title: {
                    label: `左标题3`,
                    name: 'title',
                    initialValue: `左标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                },
                right: [{
                  title: {
                    label: `子标题1`,
                    name: 'title1',
                    initialValue: `子标题1`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题2`,
                    name: 'title2',
                    initialValue: `子标题2`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题3`,
                    name: 'title3',
                    initialValue: `子标题3`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题4`,
                    name: 'title4',
                    initialValue: `子标题4`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题5`,
                    name: 'title5',
                    initialValue: `子标题5`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题6`,
                    name: 'title6',
                    initialValue: `子标题6`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题7`,
                    name: 'title7',
                    initialValue: `子标题7`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题8`,
                    name: 'title8',
                    initialValue: `子标题8`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题9`,
                    name: 'title9',
                    initialValue: `子标题9`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题10`,
                    name: 'title10',
                    initialValue: `子标题10`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题11`,
                    name: 'title11',
                    initialValue: `子标题11`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }, {
                  title: {
                    label: `子标题12`,
                    name: 'title12',
                    initialValue: `子标题12`,
                    required: true,
                  },
                  link_type: '',
                  link_value: '',
                  info: {},
                }],
              },
            ],
          },
        ],
      },
    };
  }

  componentDidMount() {
    let { tpl_info } = this.state;
    this.setState({
      data: tpl_info,
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { data } = this.state;
    if (JSON.stringify(nextProps.tpl_info) != JSON.stringify(data)) {
      data = nextProps.tpl_info;
      this.setState({ data });
    }
  }

  componentWillUnmount() {

  }

  sldHandleCancle = () => {
    this.setState({
      modalSldDiyTitleLinkVisible: false,
      modalSldDiyMoreTitleLinkVisible: false,
    });
  };

  //编辑板块 part：标示哪一部分，比如left，center  modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (part = '', modalTitle = '', modalTip = [], index, cur_parent_index) => {
    let { data, cur_data, modalSldDiyTitleLinkVisible, modalSldDiyMoreTitleLinkVisible } = this.state;
    if (part == 'top') {
      //编辑标题
      cur_data = data.data[index]['top_title'];
      modalSldDiyTitleLinkVisible = true;
    } else if (part == 'left') {
      //左侧标题编辑
      cur_data = data.data[cur_parent_index]['detail'][index]['left'];
      modalSldDiyTitleLinkVisible = true;
    } else if (part == 'right') {
      //右侧子标题编辑
      cur_data = data.data[cur_parent_index]['detail'][index]['right'];
      modalSldDiyMoreTitleLinkVisible = true;
    }
    this.setState({
      cur_part: part,
      cur_parent_index: cur_parent_index,//当前操作的父数据index
      cur_index: index,//当前操作的数据index
      cur_data,
      modalSldDiyTitleLinkVisible,
      modalSldDiyMoreTitleLinkVisible,
      modalTitle,
      modal_tip: modalTip,
    });
  };

  sldHandleConfirm = (val) => {
    let { data, cur_part, cur_parent_index, cur_index } = this.state;
    if (cur_part == 'top') {
      data.data[cur_index]['top_title']['title']['initialValue'] = val.title;
      data.data[cur_index]['top_title']['sub_title']['initialValue'] = val.sub_title;
      data.data[cur_index]['top_title']['link_type'] = val.link_type;
      data.data[cur_index]['top_title']['link_value'] = val.link_value;
      data.data[cur_index]['top_title']['info'] = val.info;
    } else if (cur_part == 'left') {
      data.data[cur_parent_index]['detail'][cur_index]['left']['title']['initialValue'] = val.title;
      data.data[cur_parent_index]['detail'][cur_index]['left']['link_type'] = val.link_type;
      data.data[cur_parent_index]['detail'][cur_index]['left']['link_value'] = val.link_value;
      data.data[cur_parent_index]['detail'][cur_index]['left']['info'] = val.info;
    } else if (cur_part == 'right') {
      data.data[cur_parent_index]['detail'][cur_index]['right'] = val;
    }
    this.setState({
      data: JSON.parse(JSON.stringify(data)),
      modalSldDiyTitleLinkVisible: false,
      modalSldDiyMoreTitleLinkVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  render() {
    const { data, submiting, modalTitle, modalSldDiyTitleLinkVisible, modalSldDiyMoreTitleLinkVisible, cur_data, modal_tip, cur_part } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_21}`}>
            <div className={`${styles.adv_21_wrap} ${global.flex_row_start_start}`}>

              {data.data.map((item1, index1) => {
                return <div key={'item1' + index1}
                            className={`${global.flex_column_start_start} ${styles.adv_21_wrap_item}`}>
                  <div className={`${global.flex_row_between_center} ${styles.title_part}`}>
                    <div className={styles.sld_mask}
                         onClick={() => this.editTpl('top', `${sldComLanguage('顶部标题设置')}`, [`${sldComLanguage('左侧标题不能为空，最多输入6个字')}`, `${sldComLanguage('子标题不能为空，最多输入10个字')}`], index1)}>
                      <span>{sldComLanguage('编辑')}</span>
                    </div>
                    <span className={styles.title}>{item1.top_title.title.initialValue}</span>
                    <a className={styles.view_more}>{item1.top_title.sub_title.initialValue}></a>
                  </div>
                  <div className={`${global.flex_column_start_start} ${styles.detail}`}>
                    {item1.detail.map((item2, index2) => {
                      return <div key={'item2' + index2}
                                  className={`${global.flex_row_start_start} ${styles.item}`}>
                        <div className={`${styles.item_left}`}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('left', `左侧标题${index2 + 1}设置`, [`${sldComLanguage('标题不能为空，最多输入5个字')}`], index2, index1)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          {item2.left.title.initialValue}
                        </div>
                        <div className={`${global.flex_row_start_center} ${styles.item_right}`}>
                          <div className={styles.sld_mask}
                               onClick={() => this.editTpl('right', `右侧子标题${sldComLanguage(index2 + 1)}设置`, [`${sldComLanguage('子标题不能为空，最多输入4个字')}`], index2, index1)}>
                            <span>{sldComLanguage('编辑')}</span>
                          </div>
                          {item2.right.map((item3, index3) => {
                            return <span key={'item3' + index3}
                                         className={`${styles.item_right_con}`}>{item3.title.initialValue}</span>;
                          })
                          }
                        </div>
                      </div>;
                    })
                    }
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>
        {/*标题+链接设置-single*/}
        <SldDiyTitleLinkModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalSldDiyTitleLinkVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
          client={'pc'}
          type={'more'}
          extra={{title_limit:cur_part=='top'?6:5,sub_title_limit:10}}
        />
        {/*标题+链接设置-single*/}
        {/*标题+链接设置-more*/}
        <SldDiyMoreTitleLinkModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalSldDiyMoreTitleLinkVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
          client={'pc'}
          type={'more'}
          extra={{input_limit:4}}
        />
        {/*标题+链接设置-more*/}
      </Fragment>
    );
  }
}
