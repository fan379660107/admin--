import React, { PureComponent } from 'react';
import { Upload,Modal,Icon,message } from 'antd';
import styles from './index.less';
import {sldBeforeUpload,getLocalStorageStingVal } from '@/utils/utils';

class UploadImg extends PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: props.flilinfo,
        action:''
    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: nextProps.flilinfo,
        })
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
            flag:1
        });
    }


    //上传成功-服务器返回的图片名称存起来（删除的时候用）并返回给上一级 供提交表单用
    handleChange = ({ file,fileList }) => {
        let count = fileList.length*1-1;
      this.setState({ file,fileList }
      );
        // if(count >= 0){
        //     if(fileList[count]['status'] === 'done'){
        //         if(fileList[count]['response'].state == 255){
        //             message.error(fileList[count]['response'].msg);
        //             message.picname = '';
        //             fileList.pop();
        //         }else{
        //             message.success('上传成功~~~',1);
        //             this.props.uploadPicName(file.response.picname,fileList);
        //             this.setState({serverpicname:file.response.picname});
        //         }
        //     }
        // }


    }
    handleRemove = (file) => {

        let picname = this.state.serverpicname?this.state.serverpicname:file.name;
        return new Promise((resolve,reject) => {
            fetch(this.props.action+'&type=del&picname='+picname,{
               credentials: 'include',
            }).then(response => response.json())
                .then(data => {
                    if(data.state == 255){
                        reject('删除失败');
                    }else{
                        resolve('删除成功');
                        this.props.delPicName();
                    }
                });
        }).then( function(data){
            message.success(data,1);
            return true;
        },function(data){
            message.error(data);
            return false;
        });
    }

    render() {
        const num = this.props.num*1;
        const action = this.state.action!=''?this.state.action:this.props.action;
        const { previewVisible, previewImage,fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="upload" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    withCredentials={true}
                    beforeUpload={sldBeforeUpload}
                    accept={'.gif, .jpeg, .png,.jpg,'}
                    action={action}
                    listType="picture-card"
                    fileList={fileList}
                    supportServerRender = {true}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    className={styles.uploadinline}
                    onRemove={this.handleRemove}
                    headers={{
                      Authorization: 'Bearer ' + getLocalStorageStingVal('sld_token')
                    }}
                >
                    {fileList.length >= num*1 ? null : uploadButton}
                </Upload>
                <span>{this.props.uploadtip}</span>
                <Modal style={{padding:'0px!important',textAlign: 'center'}} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{maxWidth: '100%', maxHeight: '100%'}} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadImg;
