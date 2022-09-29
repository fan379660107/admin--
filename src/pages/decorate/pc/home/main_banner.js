/*
* 主轮播图设置，宽度满屏，高度457，主要用于页面分类处
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Carousel } from 'antd';
import {sldComLanguage,
} from '@/utils/utils';
import { tpl_adv_01_modal_tip } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import diy from '../diy_page.less';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';

let sthis = '';
let getFieldDecorator_new = '';
@connect(({ product }) => ({
  product,
}))
@Form.create()
export default class MainBanner extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    const {
      form: { getFieldDecorator },
    } = props;
    getFieldDecorator_new = getFieldDecorator;
    this.state = {
      tpl_info: props.tpl_info,
      cur_index: '',//当前操作数据的index
      cur_data: {},//当前操作的数据
      tpl_adv_01_modal_tip: [],//modal框提示
      submiting: false,//按钮loading
      modalVisible: false,//是否展示modal
      data: {
        type: 'main_banner',
        width: 1920,
        height: 457,//高度为0的话表示不限制
        admin_show_width: 320,
        admin_show_height: 76,
        data: [{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },{
          imgUrl: '',
          imgPath: '',
          title: '',
          link_type: '',
          link_value: '',
          info: {},
        },],
      },//装修的数据
      modal_tip: [],
    };
  }


  componentDidMount() {
    let{data,tpl_info} = this.state;
    if(tpl_info.data.length == 0){
      tpl_info.data = data.data;
    }
    this.setState({ data: tpl_info });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { data,tpl_info } = this.state;
    if (JSON.stringify(nextProps.tpl_info) != JSON.stringify(data)) {
      data = nextProps.tpl_info;
      if(data.data.length == 0){
        data.data = tpl_info.data;
      }
      this.setState({ data });
    }
  }

  componentWillUnmount() {

  }

  editTpl = (tip) => {
    let { data, title } = this.state;
    title = `${sldComLanguage('编辑')}${sldComLanguage('轮播图')}`;
    data.admin_show_width = 320;
    data.admin_show_height = 76;
    this.setState({
      cur_data: data,
      modalVisible: true,
      modal_tip: tip,
      title,
    });
  };

  sldHandleConfirm = (val) => {
    let { data } = this.state;
    data.data = val;
    this.setState({
      data,
      modalVisible: false,
    }, () => {
      this.props.save_tpl_data(data);
    });
  };

  sldHandleCancle = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { data, submiting, modalVisible, modal_tip, cur_data, title } = this.state;
    return (
      <Fragment>
        {data.data.length > 0 &&
        <Carousel autoplay>
          {data.data.map((item, index) => (
            <div key={index} className={`${styles.adv_01_wrap} ${styles.main_banner_item_wrap}`} style={{width:1210}}>
              <img className={styles.adv_01_img} src={item.imgUrl}/>
              <div className={styles.sld_mask}>
                {/*添加轮播图*/}
                <span className={`${styles.btn_common} ${styles.add}`}
                      onClick={() => this.editTpl(tpl_adv_01_modal_tip())}>{sldComLanguage('编辑')}</span>
              </div>
            </div>
          ))}
        </Carousel>
        }

        {data.data.length == 0
        && <div ref={'wrap_html'}>
          <div className={diy.main_banner}>
            <div className={styles.sld_mask}>
              {/*添加轮播图*/}
              <span className={`${styles.btn_common} ${styles.add}`}
                    onClick={() => this.editTpl(tpl_adv_01_modal_tip())}
              >{sldComLanguage('编辑')}</span></div>
          </div>
        </div>
        }

        <SldDiyMoreImgModal
          width={1000}
          title={title}
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
