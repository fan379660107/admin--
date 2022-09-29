/*
* 由三列组成，每列都是由图片布局组成，效果图可以点击同名图片查看
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldComLanguage,
} from '@/utils/utils';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_11 extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      modalTitle: '',//弹框的标题
      modal_tip: [],//弹框的提示语
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      modalSpuShow: false,//是否展示选择商品modal
      modalSingleImgVisible: false,//单图选择器modal是否显示
      modalSldDiyTitleLinkVisible: false,//标题链接modal是否显示
      modalComCatSelectorShow: false,//分类选择modal是否显示
      tpl_info: props.tpl_info,
      data: {
        type: 'adv_11',
        row_left: {
          width: 400,
          height: 170,//高度为0的话表示不限制
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
        row_right: {
          top: {
            width: 400,
            height: 350,//高度为0的话表示不限制
            data: [{
              imgUrl: '',
              imgPath: '',
              title: '',
              link_type: '',
              link_value: '',
              info: {},
            }],
          },
          bottom: {
            width: 400,
            height: 170,//高度为0的话表示不限制
            data: [{
              imgUrl: '',
              imgPath: '',
              title: '',
              link_type: '',
              link_value: '',
              info: {},
            }],
          },
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
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    let { data, cur_part } = this.state;
    if (this.operate_type) {
      data[cur_part][this.operate_type].data = val;
    } else {
      data[cur_part].data = val;
    }
    this.setState({
      data,
      modalVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  //编辑板块 part：标示哪一部分，比如left，center type 位置 top/bottom，主要用于区分右侧数据  modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (part = '', type, modalTitle = '', modalTip = []) => {
    let { data, modalVisible, cur_data } = this.state;
    if (type) {
      cur_data = data[part][type];
    } else {
      cur_data = data[part];
    }
    modalVisible = true;
    this.operate_type = type;//当前的修改的位置 top/bottom，主要用于区分右侧数据
    this.setState({
      cur_part: part,
      cur_data,
      modalVisible,
      modalTitle,
      modal_tip: modalTip,
    });
  };


  render() {
    const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_11}`}>
            <div className={` ${styles.adv_11_wrap}`}>
              <div className={`${styles.item} ${styles.row_left}`}>
                <div className={styles.sld_mask}
                     onClick={() => this.editTpl('row_left', '', `${sldComLanguage('左侧图片设置')}`)}>
                  <span>{sldComLanguage('编辑')}</span>
                </div>
                {data.row_left.data.map((item, index) => (
                  <a className={`${index % 2 == 1 ? styles.lb_margin : null}`} key={index}
                     href="javascript:void(0);">
                    {item.imgUrl
                      ? <img src={item.imgUrl}/>
                      : <span>{sldComLanguage('此处添加【400*170】图片')}</span>
                    }
                  </a>
                ))}
              </div>
              <div className={`${styles.item} ${styles.row_right}`}>
                <div className={`${styles.top}`}>
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('row_right', 'top', `${sldComLanguage('右侧上部图片设置')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                  {data.row_right.top.data.map((item, index) => (
                    <a className={`${index % 2 == 1 ? styles.lb_margin : null}`} key={index}
                       href="javascript:void(0);">
                      {item.imgUrl
                        ? <img src={item.imgUrl}/>
                        : <span>{sldComLanguage('此处添加【400*350】图片')}</span>
                      }
                    </a>
                  ))}
                </div>
                <div className={`${styles.bottom}`}>
                  <div className={styles.sld_mask}
                       onClick={() => this.editTpl('row_right', 'bottom', `${sldComLanguage('右侧下部图片设置')}`)}>
                    <span>{sldComLanguage('编辑')}</span>
                  </div>
                  {data.row_right.bottom.data.map((item, index) => (
                    <a className={`${index % 2 == 1 ? styles.lb_margin : null}`} key={index}
                       href="javascript:void(0);">
                      {item.imgUrl
                        ? <img src={item.imgUrl}/>
                        : <span>{sldComLanguage('此处添加【400*170】图片')}</span>
                      }
                    </a>
                  ))}
                </div>

              </div>
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
      </Fragment>
    );
  }
}
