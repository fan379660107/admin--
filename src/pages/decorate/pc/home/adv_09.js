/*
* 一行三列广告，每列由标题和图片布局组成，效果图可以点击同名图片查看
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
export default class Adv_09 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      modalTitle: `${sldComLanguage('编辑五栏广告')}`,//弹框的标题
      modal_tip: [],//弹框的提示语
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalImgVisible: false,//是否展示多图选择modal
      tpl_info: props.tpl_info,
      addData: [{
        type: 'input',
        label: `${sldComLanguage('标题名称')}`,
        name: 'title_name',
        placeholder: `${sldComLanguage('请输入标题名称')}`,
        extra: `${sldComLanguage('最多5个字')}`,
        initialValue: '',
        maxLength: 5,
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
        type: 'adv_09',
        left: {
          width: 187,
          height: 123,//高度为0的话表示不限制
          title_info: {
            title_name: '',//标题名称
            title_color: '#fff',//标题颜色
            title_bg_color: '#6358d4',//标题背景色
          },
          data: [{
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
          }, {
            imgUrl: '',
            imgPath: '',
            title: '',
            link_type: '',
            link_value: '',
            info: {},
          }],
        },
        center: {
          width: 376,
          height: 123,//高度为0的话表示不限制
          title_info: {
            title_name: '',//标题名称
            title_color: '#fff',//标题颜色
            title_bg_color: '#e05795',//标题背景色
          },
          data: [{
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
        right: {
          width: 124,
          height: 185,//高度为0的话表示不限制
          title_info: {
            title_name: '',//标题名称
            title_color: '#fff',//标题颜色
            title_bg_color: '#47c0ca',//标题背景色
          },
          data: [{
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
          }, {
            imgUrl: '',
            imgPath: '',
            title: '',
            link_type: '',
            link_value: '',
            info: {},
          }],
        },
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
    this.setState({ modalVisible: false, modalImgVisible: false });
  };

  sldHandleConfirm = (val) => {
    let { data, addData, cur_part } = this.state;
    if (this.operate_type == 'title_info') {
      //编辑标题
      data[cur_part]['title_info'].title_name = val.title_name;
      for (let i in addData) {
        if (addData[i].name == 'title_color' || addData[i].name == 'title_bg_color') {
          data[cur_part]['title_info'][addData[i].name] = addData[i].initialValue;
        }
      }
    } else if (this.operate_type == 'data') {
      //编辑图片
      data[cur_part].data = val;
    }
    this.setState({
      data,
      modalVisible: false,
      modalImgVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

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

  //编辑板块 part：标示哪一部分,比如left，center   type:标示修改的是标题还是data   modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (part = '', type, modalTitle = '', modalTip = []) => {
    let { data, modalVisible, addData, cur_data, modalImgVisible } = this.state;
    if (type == 'title_info') {
      for (let i in addData) {
        addData[i].initialValue = data[part]['title_info'][addData[i].name];
      }
      modalVisible = true;
    } else if (type == 'data') {
      cur_data = JSON.parse(JSON.stringify(data[part]));
      delete cur_data.title_info;
      modalImgVisible = true;
    }
    this.operate_type = type;//当前的修改的内容  title_info/data
    this.setState({
      cur_part: part,
      cur_data,
      modalVisible,
      modalImgVisible,
      modal_tip: modalTip,
      modalTitle: modalTitle,
    });
  };


  render() {
    const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip, addData, modalImgVisible } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_09}`}>
            <div className={`${styles.adv_09_wrap}`}>
              {/*左侧--start*/}
              <div className={`${styles.item} ${styles.left}`}>
                <div className={`${styles.top_title}`} style={{
                  backgroundColor: data.left.title_info.title_bg_color ? data.left.title_info.title_bg_color : '#6358d4',
                  color: data.left.title_info.title_color ? data.left.title_info.title_color : '#fff',
                }}>
                  {data.left.title_info.title_name ? data.left.title_info.title_name : `${sldComLanguage('请输入标题')}`}
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('left', 'title_info', `${sldComLanguage('左侧标题设置')}`, [`${sldComLanguage('请不要超过5个字')}`])}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                </div>
                <div className={`${styles.main_con}`}>
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('left', 'data', `${sldComLanguage('左侧图片设置')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                  {data.left.data.map((item, index) => (
                    <a key={index}
                       className={`${index % 2 == 0 ? styles.first : null} ${styles.show_tip} ${index > data.left.data.length - 3 ? styles.sld_no_border_bottom : null}`}
                       href="javascript:void(0);">
                      {item.imgUrl
                        ? <img src={item.imgUrl}/>
                        : <span>{sldComLanguage('此处添加【187*123】图片')}</span>
                      }

                    </a>
                  ))}
                </div>
              </div>
              {/*左侧--end*/}
              {/*中间--start*/}
              <div className={`${styles.item} ${styles.center}`}>
                <div className={`${styles.top_title}`} style={{
                  backgroundColor: data.center.title_info.title_bg_color ? data.center.title_info.title_bg_color : '#e05795',
                  color: data.center.title_info.title_color ? data.center.title_info.title_color : '#fff',
                }}>
                  {data.center.title_info.title_name ? data.center.title_info.title_name : `${sldComLanguage('请输入标题')}`}
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('center', 'title_info', `${sldComLanguage('中间标题设置')}`, [`${sldComLanguage('请不要超过5个字')}`])}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                </div>
                <div className={`${styles.main_con}`}>
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('center', 'data', `${sldComLanguage('中间图片设置')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                  {data.center.data.map((item, index) => (
                    <a key={index}
                       className={`${styles.show_tip} ${index == data.center.data.length - 1 ? styles.sld_no_border_bottom : null}`}
                       href="javascript:void(0);">
                      {item.imgUrl
                        ? <img src={item.imgUrl}/>
                        : <span>{sldComLanguage('此处添加【376*123】图片')}</span>
                      }

                    </a>
                  ))}
                </div>
              </div>
              {/*中间--end*/}
              {/*右侧--start*/}
              <div className={`${styles.item} ${styles.right}`}>
                <div className={`${styles.top_title}`} style={{
                  backgroundColor: data.right.title_info.title_bg_color ? data.right.title_info.title_bg_color : '#47c0ca',
                  color: data.right.title_info.title_color ? data.right.title_info.title_color : '#fff',
                }}>
                  {data.right.title_info.title_name ? data.right.title_info.title_name : `${sldComLanguage('请输入标题')}`}
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('right', 'title_info', `${sldComLanguage('右侧标题设置')}`, [`${sldComLanguage('请不要超过5个字')}`])}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                </div>
                <div className={`${styles.main_con}`}>
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('right', 'data', `${sldComLanguage('右侧图片设置')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                  {data.right.data.map((item, index) => (
                    <a key={index}
                       className={`${index % 3 == 0 ? styles.first : null} ${styles.show_tip}  ${index > data.right.data.length - 4 ? styles.sld_no_border_bottom : null}`}
                       href="javascript:void(0);">
                      {item.imgUrl
                        ? <img src={item.imgUrl}/>
                        : <span>{sldComLanguage('此处添加【124*185】图片')}</span>
                      }

                    </a>
                  ))}
                </div>
              </div>
              {/*右侧--end*/}
            </div>
          </div>
        </div>
        { /*标题对话框-start*/}
        <SldModal
          title={modalTitle}
          submiting={submiting}
          width={500}
          modalVisible={modalVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          formItemLayoutModal={formItemLayoutModal}
          content={addData}
        />
        { /*标题对话框-end*/}
        <SldDiyMoreImgModal
          width={1000}
          title={modalTitle}
          sldSeleSingleRow={true}
          submiting={submiting}
          modalVisible={modalImgVisible}
          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
          sldHandleCancle={this.sldHandleCancle}
          content={cur_data}
          modal_tip={modal_tip}
          client={'pc'}
        />
      </Fragment>
    );
  }
}
