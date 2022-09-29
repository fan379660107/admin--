/*
* 五栏广告：一行五图，图片之间没有间隔
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import {
  sldComLanguage,
} from '@/utils/utils';
import {
  tpl_adv_08_modal_tip,
} from '@/utils/util_data';
import styles from '../pcdecorate.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class Adv_08 extends Component {
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
      modalSpuShow: false,//是否展示选择商品modal
      modalSingleImgVisible: false,//单图选择器modal是否显示
      modalSldDiyTitleLinkVisible: false,//标题链接modal是否显示
      modalComCatSelectorShow: false,//分类选择modal是否显示
      tpl_info: props.tpl_info,
      data: {
        type: 'adv_08',
        width: 242,
        height: 0,//高度为0的话表示不限制
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
    let { data } = this.state;
    data.data = val;
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
      cur_data: data,
      modalVisible,
      modal_tip: modalTip,
    });
  };


  render() {
    const { data, submiting, modalTitle, modalVisible, cur_data, modal_tip } = this.state;
    return (
      <Fragment>
        <div ref={'wrap_html'}>
          <div className={`${styles.w_sld_react_1210} ${styles.adv_08}`}>
            <div className={` ${styles.adv_08_wrap}`}>
              <div className={styles.sld_mask}
                   onClick={() => this.editTpl('', '', tpl_adv_08_modal_tip())}>
                <span>{sldComLanguage('编辑')}</span>
              </div>
              {data.data.map((item, index) => (
                <div key={index} className={styles.item}>
                  {item.imgUrl
                    ?<a className={`${item.imgUrl ? null : styles.show_tip}`} href="javascript:void(0);">
                      <img src={item.imgUrl}/>
                    </a>
                    :<a className={`${item.imgUrl ? null : styles.show_tip}`} href="javascript:void(0);" style={{height:350}}>
                      <span>{sldComLanguage('此处添加【242*高度不限】图片')}</span>
                    </a>
                  }

                </div>
              ))
              }
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
