import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input, InputNumber, Radio, Upload, Table, Select, Icon, Modal } from 'antd';
import {
  failTip,
  sucTip,
  sldLlineRtextAddGoodsAddMargin,
  sldComLanguage,
  sldtbaleOpeBtnText,
  sldBeforeUpload,
  getSldHorLine,
  getSldEmptyH,
  getSldComImg,
  list_com_page_more,
  getLocalStorageStingVal,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import { apiUrl } from '@/utils/sldconfig.js';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldSelMoreLeftRightSvideo from '@/components/SldSelMoreLeftRightSvideo';
import styles from '@/components/SldModal/SldModal.less';
import Slider from 'react-slick';


let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(({ svideo, global }) => ({
  svideo, global,
}))
@Form.create()
export default class AddTheme extends Component {
  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      showVideo: false,
      showItem: {},
      isFirstLoading: true,//是否第一次加载
      theme_detail: {},//推荐主题详情
      label_data: [],//标签列表
      sle_more_title: '',//选择商品的标题
      modalVisible: false,
      query: props.location.query,
      pageTitle: props.location.query != undefined && props.location.query.id != undefined && props.location.query.id ? `${sldComLanguage('编辑推荐主题')}` : `${sldComLanguage('新增推荐主题')}`,//页面标题
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],//selectedRows的key
      img_data: [{
        name: 'carouselImage',
        fileList: [],
        img_succ_info: {},
      }, {
        name: 'image',
        fileList: [],
        img_succ_info: {},
      }],
      columns_spu: [
        {
          title: ' ',
          dataIndex: 'key',
          align: 'center',
          width: 30,
          render: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: `${sldComLanguage('封面图')}`,
          dataIndex: 'videoImage',
          align: 'center',
          width: 120,
          render: (text, record) => {
            return <div>{getSldComImg(text, 200, 200, 60, 60)}</div>;
          },
        },
        {
          title: `${sldComLanguage('作品名称')}`,
          dataIndex: 'videoName',
          align: 'center',
          width: 180,
        },
        {
          title: `${sldComLanguage('作品简介')}`,
          dataIndex: 'introduction',
          align: 'center',
          width: 250,
        }, {
          title: `${sldComLanguage('作品类型')}`,
          dataIndex: 'videoTypeValue',
          align: 'center',
          width: 100,
        },
        {
          title: `${sldComLanguage('操作')}`,
          align: 'center',
          width: 120,
          render: (text, record) => {
            return <Fragment>
              {sldtbaleOpeBtnText(`${sldComLanguage('预览')}`, () => this.prevVideo(record))}
              <span className={global.splitLine}></span>
              {sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => this.delVideo(record.videoId))}
            </Fragment>;
          },
        },
      ],
    };
  }

  sele_more_svideo = {
    info: [],//选择的短视频数组
    ids: [],//选择的短视频id数组
    min_num: 1,//最小数量，0为不限制
    max_num: 30,//最多选择30个
  };

  componentDidMount() {
    const { query } = this.state;
    if (query.id != undefined && query.id > 0) {
      this.get_detail(query.id);
    } else {
      this.setState({ isFirstLoading: false });
    }
    this.get_all_lable();
  }

  componentWillUnmount() {
  }

  //获取所有标签
  get_all_lable() {
    this.props.dispatch({
      type: 'svideo/get_label_lists',
      payload: { pageSize: list_com_page_more },
      callback: res => {
        if (res.state == 200) {
          this.setState({
            label_data: res.data.list,
          });
        }
      },
    });
  }


  //获取推荐主题详情
  get_detail = async (id) => {
    const { dispatch } = this.props;
    let { img_data, selectedRows, selectedRowKeys } = this.state;
    this.setState({ loading: true });
    dispatch({
      type: 'svideo/get_theme_detail',
      payload: { themeId: id },
      callback: async (res) => {
        if (res.state == 200) {
          img_data.map(item => {
            let fileList = [];
            let tmp_data = {};
            if (item.name == 'carouselImage') {
              tmp_data.uid = res.data.carouselImage;
              tmp_data.name = res.data.carouselImageUrl;
              tmp_data.status = 'done';
              tmp_data.url = res.data.carouselImageUrl;
              fileList.push(tmp_data);
              item.fileList = fileList;
              item.img_succ_info.path = res.data.carouselImage;
            } else if (item.name == 'image') {
              tmp_data.uid = res.data.image;
              tmp_data.name = res.data.imageUrl;
              tmp_data.status = 'done';
              tmp_data.url = res.data.imageUrl;
              fileList.push(tmp_data);
              item.fileList = fileList;
              item.img_succ_info.path = res.data.image;
            }
          });

          res.data.videoList.map(item => {
            selectedRows.push(item);
            selectedRowKeys.push(item.videoId);
            this.sele_more_svideo.info.push(item);
            this.sele_more_svideo.ids.push(item.videoId);
          });

          this.setState({
            theme_detail: res.data,
            loading: false,
            img_data,
            selectedRows,
            selectedRowKeys,
          });
        }
        this.setState({ isFirstLoading: false });
      },
    });
  };

  resetSelVideo = () => {
    this.setState({
      modalVisible: true,
      sle_more_title: `${sldComLanguage('选择作品(最少选择1个)')}`,
    });
  };

  handleSelectRows = (rows, rowkeys) => {
    this.setState({
      selectedRows: rows,
      selectedRowKeys: rowkeys,
    });
  };

//保存并新增事件
  handleSaveAllData = () => {
    const { dispatch } = this.props;
    const { query, selectedRowKeys, img_data } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let param = {};
          if (img_data[0].img_succ_info.path == undefined) {
            failTip(`${sldComLanguage('请上传封面图片～')}`);
            return;
          } else {
            param.carouselImage = img_data[0].img_succ_info.path;
          }
          if (img_data[1].img_succ_info.path == undefined) {
            failTip(`${sldComLanguage('请上传主题图片～')}`);
            return;
          } else {
            param.image = img_data[1].img_succ_info.path;
          }
          if (selectedRowKeys.length == 0) {
            failTip(`${sldComLanguage('请选择作品～')}`);
            return;
          } else {
            param.videoIds = selectedRowKeys.join(',');
          }
          param.sort = values.sort;
          param.labelId = values.labelId;
          param.isShow = values.isShow;
          param.themeName = values.themeName;

          let dis_type = '';
          if (query.id != undefined && query.id > 0) {
            //编辑推荐主题
            param.themeId = query.id;
            dis_type = 'svideo/edit_theme';
          } else {
            //新增推荐主题
            dis_type = 'svideo/add_theme';
          }
          sthis.setState({ loading: true });
          dispatch({
            type: dis_type,
            payload: param,
            callback: (res) => {
              sthis.setState({ loading: false });
              if (res.state == 200) {
                sucTip(res.msg);
                setTimeout(() => {
                  sthis.props.history.goBack();
                }, 500);
              } else {
                failTip(res.msg);
              }
            },
          });

        }
      },
    );
  };

  sldHandleCancle = () => {
    this.setState({
      modalVisible: false,
    });
  };

  // 预览视频
  prevVideo = record => {
    this.setState({
      showItem: record,
      showVideo: true,
    });
  };

  // 取消预览
  sldHandleCancle = () => {
    this.setState({
      showItem: {},
      showVideo: false,
      modalVisible: false,
    });
  };

  //短视频删除事件
  delVideo = (videoId) => {
    let { selectedRows, selectedRowKeys } = this.state;
    selectedRows = selectedRows.filter(item => item.videoId != videoId);
    selectedRowKeys = selectedRowKeys.filter(item => item != videoId);
    this.sele_more_svideo.ids = [...selectedRowKeys];
    this.sele_more_svideo.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
  };

  //短视频多选-回调事件
  seleSvideo = (selectedRows, selectedRowKeys) => {
    this.sele_more_svideo.ids = [...selectedRowKeys];
    this.sele_more_svideo.info = JSON.parse(JSON.stringify(selectedRows));
    this.setState({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
    this.sldHandleCancle();
  };

  //选择标签事件
  handleSelLabel = (e) => {
  };

  //上传图片 dataType:用于区分更改那个数据
  uploadImg = (info, dataType) => {
    let { img_data } = this.state;
    if (info.file.status != undefined && info.file.status != 'error') {
      for (let i in img_data) {
        if (img_data[i].name == dataType) {
          img_data[i].fileList = info.fileList;
          img_data[i].img_succ_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
        }
      }
      this.setState({ img_data });
    }
  };

  //预览图片
  uploadImgPre = (info) => {
    this.viewImg(true, info.thumbUrl || info.url, info.name);
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
    const {
      modalVisible, loading, sle_more_title, columns_spu, selectedRows, label_data, theme_detail, isFirstLoading, preview_img, show_preview_modal, preview_alt_con, img_data, selectedRowKeys, showItem, showVideo, pageTitle,
    } = this.state;
    let {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', pageTitle, 0, 0, 10)}
        {getSldHorLine(1)}
        {getSldEmptyH(10)}
        <Spin spinning={loading}>
          <Form layout="inline">
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 170}>
              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                {/* 基本信息-start */}
                {!isFirstLoading &&
                <Fragment>
                  <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('封面图片')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('建议上传宽710*高345的图片')}`}
                          style={{ width: 300 }}
                        >
                          <Upload
                            beforeUpload={sldBeforeUpload}
                            withCredentials={true}
                            accept={'.gif, .jpeg, .png,.jpg,'}
                            name={'file'}
                            action={apiUrl + `v3/oss/common/upload?source=setting`}
                            listType="picture-card"
                            fileList={img_data[0].fileList}
                            onPreview={(info) => this.uploadImgPre(info)}
                            onChange={(info) => this.uploadImg(info, 'carouselImage')}
                            headers={{
                              Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                            }}
                          >
                            {img_data[0].fileList.length < 1
                              ? <div>
                                <Icon type="plus"/>
                                <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
                              </div>
                              : null
                            }
                          </Upload>
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('主题图片')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('建议上传宽710*高345的图片')}`}
                          style={{ width: 300 }}
                        >
                          <Upload
                            beforeUpload={sldBeforeUpload}
                            withCredentials={true}
                            accept={'.gif, .jpeg, .png,.jpg,'}
                            name={'file'}
                            action={apiUrl + `v3/oss/common/upload?source=setting`}
                            listType="picture-card"
                            fileList={img_data[1].fileList}
                            onPreview={(info) => this.uploadImgPre(info)}
                            onChange={(info) => this.uploadImg(info, 'image')}
                            headers={{
                              Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                            }}
                          >
                            {img_data[1].fileList.length < 1
                              ? <div>
                                <Icon type="plus"/>
                                <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
                              </div>
                              : null
                            }
                          </Upload>
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('主题名称')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('最多可输入5个字')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('themeName', {
                            initialValue: theme_detail.themeName, rules: [{
                              required: true,
                              whitespace: true,
                              message: `${sldComLanguage('请输入主题名称')}`,
                            }],
                          })(
                            <Input maxLength={5} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入主题名称')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('排序')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                          extra={`${sldComLanguage('请输入0~255之间的数字，值越小，显示越靠前')}`}
                        >
                          {getFieldDecorator('sort', {
                            initialValue: theme_detail.sort, rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入排序')}`,
                            }],
                          })(
                            <InputNumber max={255} min={0} precision={0} style={{ width: 400 }}
                                         placeholder={`${sldComLanguage('请输入排序')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('是否显示')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('isShow', {
                            initialValue: theme_detail.isShow != undefined ? theme_detail.isShow * 1 : 1,
                          })(
                            <RadioGroup size={'small'}>
                              <Radio value={1}>{sldComLanguage('显示')}</Radio>
                              <Radio value={0}>{sldComLanguage('不显示')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>


                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('选择所属标签')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {theme_detail.labelId != undefined
                            ? getFieldDecorator('labelId', {
                              initialValue: theme_detail.labelId * 1?theme_detail.labelId * 1:undefined,
                              rules: [{
                                required: true,
                                message: `${sldComLanguage('请选择所属标签')}`,
                              }],
                            })(
                              <Select style={{ width: 200 }} placeholder={`${sldComLanguage('请选择所属标签')}`}
                                      onChange={(e) => this.handleSelLabel(e)}
                                      getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                {label_data.map((item, index) => {
                                  return <Option key={index}
                                                 value={item.labelId}>{item.labelName}</Option>;
                                })}
                              </Select>,
                            )
                            : getFieldDecorator('labelId', {
                              rules: [{
                                required: true,
                                message: `${sldComLanguage('请选择所属标签')}`,
                              }],
                            })(
                              <Select style={{ width: 200 }} placeholder={`${sldComLanguage('请选择所属标签')}`}
                                      onChange={(e) => this.handleSelLabel(e)}
                                      getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                {label_data.map((item, index) => {
                                  return <Option key={index}
                                                 value={item.labelId}>{item.labelName}</Option>;
                                })}
                              </Select>,
                            )
                          }
                        </FormItem>
                      </div>
                    </div>


                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: 'red' }}>*</span>{sldComLanguage('选择作品')}
                      </div>
                      <div className={`${promotion.right}`}>
                      <span className={`${promotion.reset_sel}`} style={{marginTop:7}}
                            onClick={() => this.resetSelVideo()}>{selectedRows.length > 0 ? `${sldComLanguage('重新选择')}` : `${sldComLanguage('选择作品')}`}</span>
                        {selectedRowKeys.length > 0 &&
                        <Scrollbars autoHeight
                                    autoHeightMax={300}>
                          <Table rowKey={'videoId'} pagination={false} columns={columns_spu}
                                 dataSource={selectedRows} size={'small'}/>
                        </Scrollbars>
                        }
                      </div>
                    </div>

                  </div>
                  {/* 基本信息-end */}
                </Fragment>
                }
              </div>
              {!isFirstLoading &&
              <div className={global.m_diy_bottom_wrap}
                   style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                  {sldComLanguage('返回')}
                </div>
                <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                     className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                  {sldComLanguage('保存')}
                </div>
              </div>
              }
              {getSldEmptyH(20)}
            </Scrollbars>
          </Form>
        </Spin>
        {/*短视频多选的modal框-start*/}
        <SldSelMoreLeftRightSvideo selectedRows={this.sele_more_svideo.info}
                                   selectedRowKeys={this.sele_more_svideo.ids}
                                   modalVisible={modalVisible} width={1000} height={document.body.clientHeight - 400}
                                   sldHandleSeleMoreModalCancle={this.sldHandleCancle} seleSvideo={this.seleSvideo}
                                   title={sle_more_title} extra={this.sele_more_svideo}/>
        {/*短视频多选的modal框-end*/}
        {/*图片预览-start*/}
        <SldPreviewImg img={preview_img} show_preview_modal={show_preview_modal} modal_width={600}
                       preview_alt_con={preview_alt_con} closePreviewModal={() => this.viewImg(false)}/>
        {/*图片预览-end*/}
        {/*预览视频*/}
        <Modal
          centered
          title={`${sldComLanguage('预览')}`}
          visible={showVideo}
          footer={null}
          destroyOnClose={true}
          onCancel={this.sldHandleCancle}
        >
          {showItem.videoType == 1
            ? <video src={showItem.videoPath} width={520} height={400} controls autoPlay/>
            : <div className={`${global.flex_row_center_start}`}>
              <div className={`${global.flex_column_start_start} ${styles.svideo_img_text}`}>
                {getSldEmptyH(10)}
                {showItem.imageList != undefined && showItem.imageList && showItem.imageList.length != undefined && showItem.imageList.length &&
                <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                  {showItem.imageList.map((img_item, img_index) => {
                    return <div key={img_index} className={`${global.flex_row_center_center} ${styles.img_wrap}`}>
                      <img src={img_item}/>
                    </div>;
                  })}
                </Slider>
                }
                <div className={styles.text}>
                  {showItem.videoContent}
                </div>
                {getSldEmptyH(15)}
              </div>
            </div>
          }
        </Modal>
      </div>
    );
  }
}
;
