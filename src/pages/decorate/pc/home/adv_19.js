/*
* 商品楼层，都是商品,效果图可以点击同名图片查看
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  formItemLayoutModal,
  sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import SldModal from '@/components/SldModal/SldModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_19 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      l_tab_index: 0,//左侧选中的tab
      r_tab_index: 0,//右侧选中的tab
      modalTitle: '',//弹框的标题
      modal_tip: [],//弹框的提示语
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalTitleVisible: false,//是否展示标题modal
      tpl_info: props.tpl_info,
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标题名称')}`,
        name: 'title_name',
        placeholder: `${sldComLanguage('请输入标题名称')}`,
        extra: `${sldComLanguage('最多5个字')}`,
        initialValue: '',
        maxLength:5,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入标题名称')}`,
        }],
      }, {
        type: 'more_color_picker',
        label: `${sldComLanguage('标题颜色')}`,
        name: 'title_color',
        placeholder: `${sldComLanguage('请点击选择标题颜色')}`,
        initialValue: '',
        is_show: false,
        callbackShow: (color) => this.sldHandleColorPicker(color, 'title_color', 'is_show'),
        callback: (color) => this.sldHandleColorPicker(color, 'title_color', 'color'),
      }, {
        type: 'more_color_picker',
        label: `${sldComLanguage('背景色')}`,
        name: 'title_bg_color',
        placeholder: `${sldComLanguage('请点击选择背景色')}`,
        initialValue: '',
        is_show: false,
        callbackShow: (color) => this.sldHandleColorPicker(color, 'title_bg_color', 'is_show'),
        callback: (color) => this.sldHandleColorPicker(color, 'title_bg_color', 'color'),
      }, {
        type: 'empty',
        name: 'empty',
        height: 0,
      }],//modal框的数据
      data: {
        type: 'adv_19',
        data: [{
          top: {
            title_info: {
              title_name: '',//标题名称
              title_color: '#fff',//标题颜色
              title_bg_color: '#f89a3f',//标题背景色
            },

          },
          center: {
            left: {
              width: 186,
              height: 340,//高度为0的话表示不限制
              data: [{
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            },
            right: [{
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }, {
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }, {
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }],
          },
          bottom: {
            width: 187,
            height: 120,//高度为0的话表示不限制
            data: [
              {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
          },
        }, {
          top: {
            title_info: {
              title_name: '',//标题名称
              title_color: '#fff',//标题颜色
              title_bg_color: '#f89a3f',//标题背景色
            },
          },
          center: {
            left: {
              width: 186,
              height: 340,//高度为0的话表示不限制
              data: [{
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            },
            right: [{
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }, {
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }, {
              title_info: {
                title_name: '',//标题名称
              },
              width: 172,
              height: 106,//高度为0的话表示不限制
              data: [{
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                main_title: '',
                sub_title: '',
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
            }],
          },
          bottom: {
            width: 187,
            height: 120,//高度为0的话表示不限制
            data: [
              {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }, {
                imgUrl: '',
                imgPath: '',
                title: '',
                link_type: '',
                link_value: '',
                info: {},
              }],
          },
        }],
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

  //设置颜色  color:选中的颜色值  name:addData里面的name  type：color 修改颜色， is_show 是否显示
  sldHandleColorPicker = (color, name, type) => {
    let { addData } = this.state;
    for (let i in addData) {
      if (addData[i].name == name) {
        if (type == 'is_show') {
          addData[i].is_show = color;
        } else if (type == 'color') {
          addData[i].initialValue = color;
        }
      } else {
        if (addData[i].name == 'empty') {
          if (type == 'is_show' && color) {
            addData[i].height = 300;
          } else if (type == 'is_show' && !color) {
            addData[i].height = 0;
          }
        }

        if (type == 'is_show') {
          addData[i].is_show = false;
        }
      }
    }
    this.setState({ addData: addData });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false, modalSldDiyTitleLinkVisible: false, modalTitleVisible: false });
  };

  sldHandleConfirm = (val) => {
    let { data, cur_part, addData, l_tab_index, r_tab_index } = this.state;
    if (cur_part == 'bottom') {
      data.data[this.operate_type][cur_part].data = val;
    } else if (cur_part == 'center_left') {
      data.data[this.operate_type]['center']['left'].data = val;
    } else if (cur_part == 'l_title') {
      //编辑顶部左侧标题+文字颜色+背景色
      data.data[this.operate_type]['top']['title_info'].title_name = val.title_name;
      for (let i in addData) {
        if (addData[i].name == 'title_color' || addData[i].name == 'title_bg_color') {
          data.data[this.operate_type]['top']['title_info'][addData[i].name] = addData[i].initialValue;
        }
      }
    } else if (cur_part == 'r_title') {
      //分类名+图片信息
      data.data[this.operate_type]['center']['right'][this.operate_type == 0 ? l_tab_index : r_tab_index]['title_info']['title_name'] = val.title_name;
      data.data[this.operate_type]['center']['right'][this.operate_type == 0 ? l_tab_index : r_tab_index]['data'] = val.parent_data;
    } else {
      if (this.operate_type == 'title_info') {
        for (let i in val) {
          if (i == 'title') {
            data[cur_part][this.operate_type].title.initialValue = val.title;
          } else if (i == 'sub_title') {
            data[cur_part][this.operate_type].sub_title.initialValue = val.sub_title;
          } else if (i == 'link_type') {
            data[cur_part][this.operate_type].link_type = val.link_type;
            data[cur_part][this.operate_type].link_value = val.link_value;
            data[cur_part][this.operate_type].info = val.info != undefined ? val.info : {};
          }
        }
      } else {
        data[cur_part][this.operate_type].data = val;
      }

    }
    this.setState({
      data,
      modalVisible: false,
      modalTitleVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  //编辑板块 part：标示哪一部分，比如left，center type：某一模块下的具体部分  modalTitle：弹框的标题  modalTip：弹框的整体提示,tab_index 当前选中的tab的index
  editTpl = (part = '', type = '', modalTitle = '', modalTip = [], tab_index = 0) => {
    let { data, modalVisible, cur_data, modalSldDiyTitleLinkVisible, modalTitleVisible, addData } = this.state;
    if (part == 'bottom') {
      cur_data = data.data[type][part];
      modalVisible = true;
    } else if (part == 'center_left') {
      cur_data = data.data[type]['center']['left'];
      modalVisible = true;
    } else if (part == 'l_title') {
      for (let i in addData) {
        addData[i].initialValue = data.data[type]['top']['title_info'][addData[i].name];
      }
      modalTitleVisible = true;
    } else if (part == 'r_title') {
      cur_data = data.data[type]['center']['right'][tab_index];
      modalVisible = true;
    }
    this.operate_type = type;//当前模块下的具体部分
    this.setState({
      cur_part: part,
      cur_data,
      modalVisible,
      modalTitleVisible,
      modalSldDiyTitleLinkVisible,
      modalTitle,
      modal_tip: modalTip,
    });
  };

  selTab = (index, tab_index) => {
    let { l_tab_index, r_tab_index } = this.state;
    if (index == 0) {
      l_tab_index = tab_index;
    } else {
      r_tab_index = tab_index;
    }
    this.setState({ l_tab_index, r_tab_index });
  };


  render() {
    const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip, l_tab_index, r_tab_index, modalTitleVisible, addData } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_19}`}>
            <div className={` ${styles.adv_19_wrap}`}>

              {data.data.map((item, index) => {
                return <div key={index} className={`${styles.item} ${styles.left}`}>
                  <div className={`${styles.top_title}`}
                       style={{ backgroundColor: item.top.title_info.title_bg_color }}>
                    <div className={`${styles.l_title}`}
                         style={{ color: item.top.title_info.title_color }}>
                      <div className={styles.sld_mask}
                           onClick={() => this.editTpl('l_title', index, `${sldComLanguage('顶部标题设置')}`)}>
                        <span>{sldComLanguage('编辑')}</span>
                      </div>
                      {item.top.title_info.title_name
                        ? item.top.title_info.title_name
                        : `${sldComLanguage('添加标题')}`
                      }
                    </div>
                    <div className={`${styles.r_title}`}>
                      <ul>
                        {item.center.right.map((val, key) => {
                          return <li key={key} onMouseOver={() => this.selTab(index, key)}
                                     className={`${index == 0 ? (key == l_tab_index ? styles.sel_tab : null) : (key == r_tab_index ? styles.sel_tab : null)}`}>
                            <div className={styles.sld_mask}
                                 onClick={() => this.editTpl('r_title', index, `${sldComLanguage('标题tab设置')}`, [`${sldComLanguage('为达到页面效果，建议上传4张 172*106大小的图片，标题名称不能为空，最多输入4个字')}`], key)}>
                              <span>{sldComLanguage('编辑')}</span>
                            </div>
                            <span className={`${styles.con}`}>
																	{val.title_info.title_name
                                    ? val.title_info.title_name
                                    : `${sldComLanguage('添加内容')}`
                                  }</span>
                          </li>;
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className={`${styles.center}`}>
                    <div className={`${styles.l_center}`}>
                      <div className={styles.sld_mask}
                           onClick={() => this.editTpl('center_left', index, `${sldComLanguage('中间左侧图片设置')}`)}>
                        <span>{sldComLanguage('编辑')}</span>
                      </div>
                      <a href="javascript:;">
                        {item.center.left.data[0].imgUrl
                          ? <img src={item.center.left.data[0].imgUrl}/>
                          : <span>{sldComLanguage('此处添加【186*340】图片')}</span>
                        }
                      </a>
                    </div>
                    <div className={`${styles.r_center}`}>
                      <div className={`${styles.tabs_panel}`}>
                        {item.center.right.map((vals, keys) => {
                          return <Fragment>
                            {(index == 0 && keys == l_tab_index || index == 1 && keys == r_tab_index) &&
                            vals.data.map((val, key) => {
                              return <div key={key} className={`${styles.item}`}>
                                <div className={`${styles.title_wrap}`}>
                                  <a className={`${styles.main_title}`}
                                     href="javascript:;">
                                    {val.main_title ? val.main_title : `${sldComLanguage('图片标题')}`}
                                  </a>
                                  <a className={`${styles.sub_title}`}
                                     href="javascript:;">
                                    {val.sub_title ? val.sub_title : `${sldComLanguage('图片子标题')}`}
                                  </a>
                                </div>
                                <div className={`${styles.bottom_img}`}>
                                  <a className={`${styles.sld_com_no_img}`}
                                     href="javascript:;">
                                    {val.imgUrl
                                      ? <img src={val.imgUrl}/>
                                      : <span>{sldComLanguage('此处添加【172*106】图片')}</span>
                                    }
                                  </a>
                                </div>
                              </div>;
                            })
                            }
                          </Fragment>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.bottom}`}>
                    <div className={styles.sld_mask}
                         onClick={() => this.editTpl('bottom', index, `${sldComLanguage('底部图片设置')}`)}>
                      <span>{sldComLanguage('编辑')}</span>
                    </div>
                    {item.bottom.data.map((val, key) => {
                      return <a key={key} className={`${styles.sld_com_no_img}`} href="javascript:;">
                        {val.imgUrl
                          ? <img src={val.imgUrl}/>
                          : <span>{sldComLanguage('此处添加【187*120】图片')}</span>
                        }
                      </a>;
                    })}
                  </div>
                </div>;
              })}


            </div>
          </div>
        </div>
        <SldDiyMoreImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
          client={'pc'}
        />
        { /*标题对话框-start*/}
        <SldModal
          title={modalTitle}
          submiting={submiting}
          width={500}
          modalVisible={modalTitleVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />

      </Fragment>
    );
  }
}
