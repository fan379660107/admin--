import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Icon, Spin, Upload, Steps, Button } from 'antd';
import {
  failTip,
  showMoreHelpTip,
  sldComLanguage,
  getLocalStorageStingVal,
  getSldEmptyH,
} from '@/utils/utils';
import global from '@/global.less';
import goods from '@/assets/css/goods.less';
import { apiUrl } from '@/utils/sldconfig.js';

const Dragger = Upload.Dragger;
const { Step } = Steps;

@connect(({ goods_platform }) => ({
  goods_platform,
}))
@Form.create()
export default class ImportExcelGoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curStep: 0,//步骤条当前步骤
      search_con: '',//搜索框内容
      errorFileUrl: '',//错误文件地址
      initLoading: false,
    };
  }

  componentDidMount() {
  }

  //下载商品导入模板
  downLoadMould = () => {
    let paramData = {};
    paramData.fileName = `${sldComLanguage('商品导入模板')}`;
    const { dispatch } = this.props;
    this.setState({ initLoading: true });
    dispatch({
      type: 'goods_platform/download_goods_mould',
      payload: paramData,
      callback: (res) => {
        if (res.state == 255) {
          failTip(res.msg);
        }else{
          this.goUpload();//下载成功后自动到下一步
        }
        this.setState({ initLoading: false });
      },
    });
  };

  uploadFile = (info) => {
    let { errorFileUrl, curStep, initLoading } = this.state;
    if (info.file != undefined && info.file.response != undefined) {
      if (info.file.response.state == 200) {
        curStep = 2;
      } else if (info.file.response.state == 255) {
        failTip(info.file.response.msg);
      } else if (info.file.response.state == 267) {
        errorFileUrl = info.file.response.data;
      }
      initLoading = false;
    }
    this.setState({ errorFileUrl, curStep, initLoading });
  };

  //下一步的点击事件
  goUpload = () => {
    this.setState({ curStep: 1 });
  };

  //继续导入事件
  nextUpload = () => {
    this.setState({ curStep: 1, errorFileUrl: '' });
  };

  handleUploadLimit = (e) => {
    this.setState({ initLoading: true, errorFileUrl: '' });
  };

  render() {
    const { initLoading, curStep, errorFileUrl } = this.state;
    return (
      <div className={global.common_page} style={{ flex: 1,padding:0,paddingTop:10 }}>
        {showMoreHelpTip(`${sldComLanguage('操作提示')}`, [`${sldComLanguage('请先下载商品导入模板，并按照批注中的要求填写商品数据，未按要求填写将会导致商品导入失败')}`, `${sldComLanguage('请选择.xls文件，每次只能导入一个文件，建议每次导入不超过6000条商品数据')}`])}
        <Spin spinning={initLoading}>
          <div style={{ padding: '40px 200px' }}>
            <Steps current={curStep}>
              <Step title={sldComLanguage('下载商品导入模板')}/>
              <Step title={sldComLanguage('上传文件')}/>
              <Step title={sldComLanguage('完成')}/>
            </Steps>
          </div>
          <div className={`${global.flex_column_center_center} ${goods.goods_import}`}>
            {curStep == 0 &&
            <Fragment>
              {getSldEmptyH(10)}
              <Button type="primary" icon="download" size={'large'}
                      onClick={() => this.downLoadMould()}>{sldComLanguage('下载商品导入模板')}</Button>
              {getSldEmptyH(40)}
              <Button type="primary" size={'large'} onClick={() => this.goUpload()}>{sldComLanguage('下一步')}</Button>
            </Fragment>
            }

            {curStep == 1 &&
            <div style={{ width: '100%', height: 150, padding: '0 20px' }}>
              <Dragger
                listType={'picture-card'}
                name={'file'}
                accept={'.xls'}
                beforeUpload={(e) => this.handleUploadLimit(e)}
                action={apiUrl + `v3/goods/admin/goods/platform/import`}
                showUploadList={false}
                onChange={(info) => this.uploadFile(info)}
                onPreview={(info) => {
                }}
                headers={{
                  Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token'),
                }}
              >
                <Icon type="plus" style={{ fontSize: 32, color: '#999' }}/>
                <p>{sldComLanguage('点击上传或者拖拽文件到该区域即可')}</p>
              </Dragger>
              {errorFileUrl &&
              <div style={{ marginTop: 12, color: 'rgb(51, 51, 51)', textAlign: 'center' }}>
                <span style={{ color: 'rgb(225, 0, 0)' }}>{sldComLanguage('上传失败')}！</span>
                {sldComLanguage('您可以')}
                <a download={`${sldComLanguage('错误表格')}.xls`} href={errorFileUrl}
                   style={{ color: '#FF711E' }}>{sldComLanguage('下载错误表格')}</a>
                ，{sldComLanguage('查看错误原因，修改后重新上传')}。
              </div>
              }
            </div>
            }

            {curStep == 2 &&
            <Fragment>
              <p className={goods.import_success_con}>{sldComLanguage('导入成功')}！</p>
              <p className={goods.import_success_tip}>{sldComLanguage('您可以前往商品列表查看已导入的商品，或是继续导入')}。</p>
              {getSldEmptyH(2)}
              <Button type="primary" size={'large'} onClick={() => this.nextUpload()}>{sldComLanguage('继续导入')}</Button>
            </Fragment>
            }
          </div>
        </Spin>
      </div>
    );
  }
}
