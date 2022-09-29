import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
  sldLlineRtextAddGoods,
  failTip,
  sucTip,
  getSldEmptyH,
  sldComLanguage,
  quillEscapeToHtml,
} from '@/utils/utils';
import router from 'umi/router';
import global from '@/global.less';
import SldEditFormCom from '@/components/SldEditFormCom/SldEditFormCom';
import SldUEditor from '@/components/SldUEditor';
import { Scrollbars } from 'react-custom-scrollbars';

@connect(({ agreement, global }) => ({
  agreement, global,
}))
@Form.create()
export default class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initEditorFlag: false,//加载百度编辑器
      getEditorContentFlag: false,//获取百度编辑器内容标识
      initEditorContent: '',//百度编辑器内容
      query: props.location.query,
      operate_data: [{
        type: 'input',
        label: `${sldComLanguage('协议标题')}`,//协议标题
        name: 'title',
        placeholder: `${sldComLanguage('请输入')}${sldComLanguage('协议标题')}`,//请输入协议标题
        initialValue: '',
        maxLength: 20,
        rules: [{
          required: true,
          whitespace: true,
          message: `${sldComLanguage('请输入')}${sldComLanguage('协议标题')}`,//请输入协议标题
        }],
      }],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'global/getLayoutCollapsed',
    });
    this.get_detail();
  }

  componentWillUnmount() {

  }

  //获取协议详情
  get_detail = () => {
    const { dispatch } = this.props;
    let { operate_data, query } = this.state;
    dispatch({
      type: 'agreement/get_agreement_detail',
      payload: { agreementCode: query.agreementCode },
      callback: (res) => {
        for (let i in operate_data) {
          if (operate_data[i].name == 'title') {
            operate_data[i].initialValue = res.data.title;
          }
        }
        this.setState({ operate_data, initEditorContent: quillEscapeToHtml(res.data.content), initEditorFlag: true });
      },
    });
  };

  //保存并新增事件
  handleSaveAllData = () => {
    this.setState({ getEditorContentFlag: true });
  };

  //保存并新增事件
  saveData = (editorCon) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        values.content = editorCon;
        const { query } = this.state;
        values.agreementCode = query.agreementCode;
        let dis_type = 'agreement/update_agreement';
        dispatch({
          type: dis_type,
          payload: values,
          callback: (res) => {
            if (res.state == 200) {
              sucTip(res.msg);
              router.replace(query.source);
            } else {
              failTip(res.msg);
            }
          },
        });
      }
    });
  };

  //获取编辑器内容
  getEditorContent = (con) => {
    this.saveData(con);
    this.setState({ getEditorContentFlag: false });
  };

  render() {
    const { operate_data, initEditorFlag, getEditorContentFlag, initEditorContent } = this.state;

    return (
      <div className={global.common_page_20}
           style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={document.body.clientHeight - 120}
        >
          <div className={global.flex_row_start_start}>
            <div className={global.flex_column_start_start} style={{ flex: 1 }}>
              {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('基本信息')}`)}
              <div style={{ marginTop: 20 }} className={global.tableListFormAdd}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Form onSubmit={() => this.handleSaveAllData()} layout="inline">
                    <SldEditFormCom form={this.props.form} search_data={operate_data}/>
                    {getSldEmptyH(15)}
                    {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('内容编辑')}`)}
                    <div className={`${global.goods_sku_tab} ${global.flex_column_start_start}`} style={{
                      marginTop: 20,
                      width: document.body.clientWidth - (this.props.global.collapsed ? 90 : 160) - 60,
                    }}>
                      {initEditorFlag &&
                      <SldUEditor id={'agreement'} getContentFlag={getEditorContentFlag}
                                  getEditorContent={this.getEditorContent} initEditorContent={initEditorContent}/>
                      }
                      {getSldEmptyH(30)}
                    </div>

                    <div className={global.m_diy_bottom_wrap}
                         style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}>
                      <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                        {sldComLanguage('返回')}
                      </div>
                      <div onClick={() => this.handleSaveAllData()}
                           className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                        {sldComLanguage('保存并返回')}
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div style={{ height: 100, width: 6, flexShrink: 0 }}/>
          </div>
        </Scrollbars>
      </div>
    );
  }
}
