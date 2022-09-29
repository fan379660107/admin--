/*
* 由三行组成，每行都是由图片布局组成，效果图可以点击同名图片查看
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
export default class Adv_10 extends Component {
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
        type: 'adv_10',
        row_one: {
          width: 1210,
          height: 30,//高度为0的话表示不限制
          data: [{
            imgUrl: '',
            imgPath: '',
            title: '',
            link_type: '',
            link_value: '',
            info: {},
          }],
        },
        row_four: {
          width: 295,
          height: 220,//高度为0的话表示不限制
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
          }],
        },
        row_five: {
          width: 234,
          height: 130,//高度为0的话表示不限制
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
    this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
    let { data, cur_part } = this.state;
    data[cur_part].data = val;
    this.setState({
      data,
      modalVisible: false,
    }, () => {
      this.props.save_tpl_data(data, this.refs.wrap_html.innerHTML);//保存数据
    });
  };

  //编辑板块 part：标示哪一部分，比如left，center  modalTitle：弹框的标题  modalTip：弹框的整体提示
  editTpl = (part = '', modalTitle = '', modalTip = []) => {
    let { data, modalVisible } = this.state;
    modalVisible = true;
    this.setState({
      cur_part: part,
      cur_data: data[part],
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
          <div className={`${styles.w_sld_react_1210} ${styles.adv_10}`}>
            <div className={` ${styles.adv_10_wrap}`}>
              <div className={`${styles.row_one}`}>
                <div className={styles.sld_mask}
                     onClick={() => this.editTpl('row_one', `${sldComLanguage('顶部单图设置')}`)}>
                  <span>{sldComLanguage('编辑')}</span>
                </div>
                {data.row_one.data.map((item, index) => (
                  <a key={index} href="javascript:void(0);">
                    {item.imgUrl
                      ? <img src={item.imgUrl}/>
                      : <span>{sldComLanguage('此处添加【1210*30】图片')}</span>
                    }
                  </a>
                ))}
              </div>

              <div className={`${styles.row_four}`}>
                <div className={styles.sld_mask}
                     onClick={() => this.editTpl('row_four', `${sldComLanguage('中间4图设置')}`)}>
                  <span>{sldComLanguage('编辑')}</span>
                </div>
                {data.row_four.data.map((item, index) => (
                  <a key={index} href="javascript:void(0);">
                    {item.imgUrl
                      ? <img src={item.imgUrl}/>
                      : <span>{sldComLanguage('此处添加【295*220】图片')}</span>
                    }
                  </a>
                ))}
              </div>

              <div className={`${styles.row_five}`}>
                <div className={styles.sld_mask}
                     onClick={() => this.editTpl('row_five', `${sldComLanguage('底部5图设置')}`)}>
                  <span>{sldComLanguage('编辑')}</span>
                </div>
                {data.row_five.data.map((item, index) => (
                  <a key={index} href="javascript:void(0);">
                    {item.imgUrl
                      ? <img src={item.imgUrl}/>
                      : <span>{sldComLanguage('此处添加【234*130】图片')}</span>
                    }
                  </a>
                ))}
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
