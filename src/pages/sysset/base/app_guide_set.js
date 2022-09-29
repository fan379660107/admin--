import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
} from '@/utils/utils';
import global from '@/global.less';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import { apiUrl, uploadLimit } from '@/utils/sldconfig.js';

let sthis = '';
@connect(({ common, global }) => ({
  common, global,
}))
@Form.create()
export default class AppGuideSet extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      modal_width: 800,//图片预览宽度
      show_preview_modal: false,//预览图片modal框是否展示
      flag: false,
      preview_img: '',//预览图片
      preview_alt_con: '',//预览图片内容
      initLoading: false,//页面初始化加载状态
      set_data: [{
        type: 'radio',
        label: `${sldComLanguage('引导页类型')}`,
        name: 'type',
        placeholder: ``,
        sel_data: [
          { name: `${sldComLanguage('图片')}`, key: 'image' },
          { name: `${sldComLanguage('视频')}`, key: 'video' },
        ],
        initialValue: 'image',
        onChange: this.handleCurType,
      },
      ],//引导页信息
    };
  }

  video_data = {
    type: 'upload_video',
    label: `${sldComLanguage('视频')}`,
    name: 'video',
    extra: `${sldComLanguage('最大限制')}${uploadLimit}${sldComLanguage('M,支持mp4格式,推荐时长不低于3s,不超过20s')}`,
    fileList: [],
    upload_name: 'file',
    upload_url: apiUrl + `v3/oss/common/upload?source=video`,
    initialValue: '',
    img_succ_info: {},
    required: true,
    item_height: 140,
    uploadPreview: this.uploadImgPre,
    delVideo: this.delVideo,
    uploadChange: (info) => this.uploadVideo(info),
  };//视频数据

  img_data = {
    type: 'upload_img_upload',
    label: `${sldComLanguage('图片')}`,
    name: 'image',
    extra: `${sldComLanguage('最大限制')}${uploadLimit}${sldComLanguage('M,在保证图片质量的情况下图片越小加载效果越好,最多可上传6张')}`,
    fileList: [],
    upload_name: 'file',
    upload_url: apiUrl + `v3/oss/common/upload?source=goods`,
    initialValue: '',
    img_succ_info: {},
    required: true,
    item_height: 140,
    uploadPreview: this.uploadImgPre,
    uploadChange: this.uploadImg,
  };//图片数据

  componentDidMount() {
    this.get_detail();
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  componentWillUnmount() {

  }

  //商品类型选择事件
  handleCurType = (e) => {
    let { set_data } = this.state;
    set_data = set_data.filter(item => item.name != 'image' && item.name != 'video');
    if (e == 'image') {
      let temp = JSON.parse(JSON.stringify(this.img_data));
      temp.uploadPreview = function(info) {
        sthis.uploadImgPre(info);
      };
      temp.uploadChange = function(info) {
        sthis.uploadImg(info);
      };
      set_data.push(temp);
    } else if (e == 'video') {
      let temp = JSON.parse(JSON.stringify(this.video_data));
      temp.uploadPreview = function(info) {
        sthis.uploadImgPre(info);
      };
      temp.delVideo = function(info) {
        sthis.delVideo();
      };
      temp.uploadChange = function(info) {
        sthis.uploadVideo(info);
      };
      set_data.push(temp);
    }
    this.setState({ set_data: set_data });
  };

  //预览图片
  uploadImgPre = (img) => {
    this.viewImg(true, img.url || img.thumbUrl);
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  //上传图片
  uploadImg = (info) => {
    let { set_data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      set_data[1].fileList = info.fileList;
      this.setState({ set_data });
    }
  };

  //删除视频
  delVideo = () => {
    let { set_data } = this.state;
    set_data[1].fileList = [];
    this.setState({ set_data });
  };

  //上传视频
  uploadVideo = (info) => {
    let { set_data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      set_data[1].fileList = info.fileList;
      this.setState({ set_data });
    }
  };

  //获取信息
  get_detail = async () => {
    const { dispatch } = this.props;
    let str_info = 'app_guide_page';
    dispatch({
      type: 'common/getSetting',
      payload: { str: str_info },
      callback: async (res) => {
        if (res.state == 200) {
          if (res.data[0].value) {
            let temp = JSON.parse(res.data[0].value);
            await this.handleCurType(temp.type);
            let new_data = this.state.set_data;
            new_data.map(item => {
              if (item.name == 'image' || item.name == 'video') {
                temp.data.map(img => {
                  let img_info = {};
                  img_info.uid = img;
                  img_info.thumbUrl = img;//图片的url地址
                  img_info.status = 'done';
                  img_info.response = {};
                  img_info.response.state = 200;
                  img_info.response.data = {
                    url: img,//图片的url地址
                  };
                  item.fileList.push(img_info);
                });
              } else {
                item.initialValue = temp.type;
              }
            });
            this.setState({ set_data: new_data, flag: true });
          } else {
            this.handleCurType('image');
          }
        }
      },
    });
  };

  //保存数据
  handleSaveAllData = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { set_data } = this.state;
      const { dispatch } = this.props;
      let param = {};
      param.type = values.type;
      param.data = [];
      let img_data = set_data[1].fileList;
      if (img_data.length == 0) {
        let msg = '';
        if (param.type == 'image') {
          msg = `${sldComLanguage('请上传图片')}～`;
        } else if (param.type == 'video') {
          msg = `${sldComLanguage('请上传视频')}～`;
        }
        failTip(msg);
        return false;
      }
      for (let i in img_data) {
        let item = img_data[i].response;
        if (item.state == 200) {
          param.data.push(item.data.url);
        }
      }
      this.setState({ initLoading: true });
      dispatch({
        type: 'common/saveSetting',
        payload: { app_guide_page: JSON.stringify(param) },
        callback: (res) => {
          this.setState({ initLoading: false });
          if (res.state == 200) {
            sucTip(res.msg);
          } else {
            failTip(res.msg);
          }
        },
      });
    });
  };

  render() {
    const { initLoading, flag, set_data, preview_img, show_preview_modal, modal_width, preview_alt_con } = this.state;
    return (
      <Spin spinning={initLoading}>
        <div className={global.common_page}>
          {flag &&
          <Fragment>
            <SldTableRowTwo part_width={100} lwidth={10} rwidth={90} form={this.props.form}
                            data={set_data}/>
            <div className={global.m_diy_bottom_wrap}
                 style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
              <div onClick={() => this.handleSaveAllData()}
                   className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                {sldComLanguage('保存')}
              </div>
            </div>
          </Fragment>
          }
        </div>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={modal_width}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </Spin>
    );
  }
}
