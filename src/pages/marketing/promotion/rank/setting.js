import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, InputNumber, Upload, Icon, Input } from 'antd';
import {
  failTip,
  sucTip,
  sldComLanguage,
  getSldEmptyH,
  sldBeforeUpload,
  getLocalStorageStingVal,
} from '@/utils/utils';
import { sldRankLeft, sldRankRight } from '@/utils/utils_v2';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import addRank from '@/assets/css/add_rank.less';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let sthis = '';
const FormItem = Form.Item;
@connect(({ spreader, global }) => ({
  spreader, global,
}))
@Form.create()
export default class SpreaderSettingBase extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      preview_img: '',
      preview_alt_con: '',
      show_preview_modal: false,
      homeImgFileList: [],//排行榜首页背景图
      loading: false,
      detail: {},//详情数据
      showFlag: false,//显示页面标识
    };
  }

  componentDidMount() {
    this.get_setting();
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  //获取设置信息
  get_setting = () => {
    const { dispatch } = this.props;
    let { detail, homeImgFileList } = this.state;
    dispatch({
      type: 'common/getSetting',
      payload: { str: 'rank_background_image,rank_max_add_goods_num' },
      callback: (res) => {
        if (res.state == 200) {
          homeImgFileList = [];
          res.data.map(item => {
            detail[item.name] = item.value;
            //处理分享礼包数据
            if (item.name == 'rank_background_image' && item.value) {
              let tmp_data = {};
              tmp_data.uid = item.value;
              tmp_data.name = item.value;
              tmp_data.status = 'done';
              tmp_data.url = item.imageUrl;
              tmp_data.response = {
                data: {
                  url: item.imageUrl,
                  path: item.value,
                },
              };
              homeImgFileList.push(tmp_data);
            }
          });
          this.setState({ detail, showFlag: true, homeImgFileList });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    const { homeImgFileList } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let params = {};
          if (homeImgFileList.length > 0 && homeImgFileList[0].response != undefined && homeImgFileList[0].response.data != undefined) {
            params.rank_background_image = homeImgFileList[0].response.data.path;
          } else {
            params.rank_background_image = '';
          }
          params.rank_max_add_goods_num = values.rank_max_add_goods_num;
          this.setState({ loading: true });
          dispatch({
            type: 'common/saveSetting',
            payload: params,
            callback: (res) => {
              sthis.setState({ loading: false });
              if (res.state == 200) {
                sucTip(res.msg);
                this.props.setUpdateFlag('list');
              } else {
                failTip(res.msg);
              }
            },
          });
        }
      },
    );
  };

  //预览图片
  uploadPreview = (info) => {
    this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadChange = (info) => {
    let { homeImgFileList } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      homeImgFileList = info.fileList;
    }
    this.setState({ homeImgFileList });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
    this.setState({
      preview_img: img,
      preview_alt_con: text,
      show_preview_modal: flag,
    });
  };

  render() {
    const { loading, detail, homeImgFileList, preview_img, preview_alt_con, show_preview_modal, showFlag } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
      </div>
    );
    return (
      <div className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
           style={{ position: 'relative' }}>
        <Spin spinning={loading}>
          {showFlag &&
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 160}>
              <div
                className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity} ${global.flex_column_start_center}`}>
                <div className={addRank.sld_det_lr_wrap}>
                  <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                    {sldRankLeft(true, '榜单最大可添加商品数', 1)}
                    {sldRankRight(<FormItem
                      style={{ width: 300 }}
                      extra={`${sldComLanguage('不可超过100')}`}
                    >
                      <div className={global.flex_row_start_center}>
                        {getFieldDecorator('rank_max_add_goods_num', {
                          initialValue: detail.rank_max_add_goods_num, rules: [{
                            required: true,
                            message: `${sldComLanguage('请输入榜单最大可添加商品数')}`,
                          }],
                        })(
                          <InputNumber max={100} min={1} precision={0} style={{ width: 300 }}
                                       placeholder={`${sldComLanguage('请输入榜单最大可添加商品数')}`}/>,
                        )}
                      </div>
                    </FormItem>, 1)}
                  </div>
                  <div className={`${addRank.sld_det_lr_item_wrap} ${global.flex_row_start_center}`}>
                    {sldRankLeft(false, '排行榜首页背景图', 0, 150)}
                    {sldRankRight(<FormItem
                      style={{ width: 500 }}
                      extra={`${sldComLanguage('建议上传【宽750*高354】的图片，支持gif，jpeg，jpg，png格式的图片')}`}
                    >
                      <div className={`${global.flex_row_start_start}`}>
                        <Upload
                          withCredentials={true}
                          beforeUpload={sldBeforeUpload}
                          accept={'.gif, .jpeg, .png,.jpg,'}
                          name={'file'}
                          action={apiUrl + `v3/oss/common/upload?source=setting`}
                          listType="picture-card"
                          fileList={homeImgFileList}
                          onPreview={(info) => this.uploadPreview(info)}
                          onChange={(info) => this.uploadChange(info)}
                          headers={{
                            Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                          }}
                        >
                          {homeImgFileList.length >= 1 ? null : uploadButton}
                        </Upload>
                      </div>
                    </FormItem>, 0, 150)}
                  </div>
                </div>

                <div>
                </div>
              </div>
              {getSldEmptyH(15)}
              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  {sldComLanguage('保存')}
                </div>
              </div>
            </Scrollbars>
          </Form>
          }
        </Spin>
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={500}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
      </div>
    );
  }
};
