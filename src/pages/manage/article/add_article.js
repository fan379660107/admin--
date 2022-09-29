import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Select, Input, Radio, Spin, InputNumber } from 'antd';
import {
  sldLlineRtextAddGoods,
  failTip,
  sucTip,
  getSldEmptyH,
  sldComLanguage,
  quillEscapeToHtml,
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import { Scrollbars } from 'react-custom-scrollbars';
import SldUEditor from '@/components/SldUEditor';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let sthis = '';
@connect(({ product, global, share }) => ({
  product, global, share,
}))
@Form.create()
export default class Add_article extends Component {

  constructor(props) {
    super(props);
    sthis = this;
    this.state = {
      initEditorFlag: false,//加载百度编辑器
      getEditorContentFlag: false,//获取百度编辑器内容标识
      initEditorContent: '',//百度编辑器内容
      detail: {},//文章详情
      query: props.location.query,
      articleCat: [],//文章分类
      showLoading: true,
    };
  }

  componentDidMount() {
    this.get_article_cat_lists();
    if (this.state.query.id == undefined) {
      this.setState({ initEditorFlag: true });
    }
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
  }

  //获取文章分类列表
  get_article_cat_lists = () => {
    const { dispatch } = this.props;
    let { query, articleCat } = this.state;
    dispatch({
      type: 'article/get_article_cat_lists',
      payload: { pageSize: 10000, isShow: 1 },
      callback: (res) => {
        articleCat = res.data.list;
        this.setState({ articleCat }, () => {
          if (query.id != undefined && query.id > 0) {
            this.getDetail(query.id);
          }
        });
      },
    });
  };

  //根据id获取详细信息
  getDetail = (id) => {
    let { detail, initEditorContent } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'article/get_article_detail',
      payload: { 'articleId': id },
      callback: (res) => {
        if (res.state == 200) {
          //初始化数据
          detail = res.data;
          initEditorContent = quillEscapeToHtml(detail.content);
          this.setState({ initEditorContent, detail, showLoading: false, initEditorFlag: true });
        } else {
          failTip(res.msg);
        }
      },
    });
  };

  //保存并新增事件
  handleSaveAllData = () => {
    this.setState({ getEditorContentFlag: true });
  };

  //获取编辑器内容
  getEditorContent = (con) => {
    this.saveData(con);
    this.setState({ getEditorContentFlag: false });
  };

  //保存并新增事件
  saveData = (editorCon) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        values.state = values.state ? 1 : 0;
        values.content = editorCon;
        const { query } = this.state;
        let dis_type = 'article/add_article';
        //如果有id，则编辑该条数据信息
        if (query.id != 'undefined' && query.id > 0) {
          values.articleId = query.id;
          dis_type = 'article/edit_article';
        }
        dispatch({
          type: dis_type,
          payload: values,
          callback: (res) => {
            if (res.state == 200) {
              this.props.dispatch({
                type: 'share/updateDate',
                payload: { flag: true, type: 'edit_article', sldGlobalShareData: {} },
              });
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
    });
  };

  render() {
    const { articleCat, detail, showLoading, query, initEditorFlag, getEditorContentFlag, initEditorContent } = this.state;
    let { form: { getFieldDecorator } } = this.props;
    return (
      <Scrollbars
        autoHeight
        autoHeightMin={100}
        autoHeightMax={document.body.clientHeight - 120}>
        <Spin spinning={query.id != undefined ? showLoading : false}>
          <div className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
               style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('基本信息')}`)}
            {getSldEmptyH(10)}
            <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
              <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form layout="inline">
                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('文章分类')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                        >
                          {getFieldDecorator('categoryId', {
                            initialValue: detail.categoryId ? detail.categoryId : undefined,
                            rules: [{
                              required: true,
                              message: `${sldComLanguage('请选择文章分类')}`,
                            }],
                          })(
                            <Select placeholder={`${sldComLanguage('请选择文章分类')}`}
                                    style={{ width: 400 }}
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                              {articleCat.map((item, index) => {
                                return <Option key={index}
                                               value={item.categoryId}>{item.categoryName}</Option>;
                              })}
                            </Select>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('文章标题')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('最多输入20个字')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('title', {
                            initialValue: detail.title, rules: [{
                              required: true,
                              whitespace: true,
                              message: `${sldComLanguage('请输入文章标题')}`,
                            }],
                          })(
                            <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入文章标题')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        {sldComLanguage('文章外链')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('outUrl', {
                            initialValue: detail.outUrl,
                          })(
                            <Input maxLength={255} style={{ width: 400 }}
                                   placeholder={`${sldComLanguage('请输入文章外链')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('是否显示')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          style={{ width: 400 }}
                        >
                          {getFieldDecorator('state', {
                            initialValue: detail.state != undefined ? detail.state : 1,
                          })(
                            <RadioGroup size={'small'}>
                              <Radio value={1}>{sldComLanguage('是')}</Radio>
                              <Radio value={0}>{sldComLanguage('否')}</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                      <div className={`${promotion.left}`}>
                        <span style={{ color: '#FF1515' }}>*</span>{sldComLanguage('排序')}
                      </div>
                      <div className={`${promotion.right}`}>
                        <FormItem
                          extra={`${sldComLanguage('请输入0~255的数字，值越小，显示越靠前')}`}
                          style={{ width: 300 }}
                        >
                          {getFieldDecorator('sort', {
                            initialValue: detail.sort, rules: [{
                              required: true,
                              message: `${sldComLanguage('请输入排序')}`,
                            }],
                          })(
                            <InputNumber min={0} max={255} style={{ width: 400 }}
                                         placeholder={`${sldComLanguage('请输入排序')}`}/>,
                          )}
                        </FormItem>
                      </div>
                    </div>

                    {getSldEmptyH(35)}
                    {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('内容编辑')}`)}
                    <div className={global.goods_sku_tab}
                         style={{ display: 'flex', flex: 1, marginTop: 20, position: 'relative' }}>
                      {initEditorFlag &&
                      <SldUEditor id={'agreement'} getContentFlag={getEditorContentFlag}
                                  getEditorContent={this.getEditorContent} initEditorContent={initEditorContent}/>
                      }
                      {getSldEmptyH(30)}
                    </div>
                    <div className={global.m_diy_bottom_wrap}
                         style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                      <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                        {sldComLanguage('返回')}{/*返回*/}
                      </div>

                      <div onClick={() => this.props.form.submit(this.handleSaveAllData)}
                           className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                        保存并返回
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Scrollbars>
    );
  }
}
