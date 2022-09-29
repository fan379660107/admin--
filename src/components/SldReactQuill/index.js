import React, {PureComponent} from 'react';
import { message} from 'antd';
import {connect} from 'dva';
import ReactQuill from 'react-quill';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';
import {apiUrl} from '@/utils/sldconfig.js';
import './index.less';
@connect(state => ({
    global: state.global,
}))
class SldReactQuill extends PureComponent {
    state = {
        value: '',
        state: false,
    };
    //base64数据装blob
    convertBase64UrlToBlob = (urlData) => {
        //去掉url的头，并转换为byte
        const bytes = window.atob(urlData.split(',')[1]);
        //处理异常,将ascii码小于0的转换为大于0
        const ab = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        ia.forEach((i, index) => {
            ia[index] = bytes.charCodeAt(index);
        });
        return new Blob([ia], {type: urlData.split(',')[0].split(':')[1].split(';')[0]});
    };
    handleChange = (content, delta, source, editor) => {
        let dataDelta = editor.getContents();
        let sldDelta = {};
        for (let i = 0; i < dataDelta.ops.length; i++) {
            if (dataDelta.ops[i]['insert']['image'] != undefined) {
                let imgvalue = dataDelta.ops[i]['insert']['image'];
                //过滤http的图片
                if (imgvalue.indexOf("http://") == -1&&imgvalue.indexOf("https://") == -1) {
                    //base64图片转为blob并上传服务器
                    let blobimg = this.convertBase64UrlToBlob(imgvalue);
                    let fd = new FormData();
                    fd.append("file", blobimg, "image.png");
                    fetch(apiUrl + 'v3/oss/common/upload?source=setting', {
                        credentials: 'include',
                        method: 'POST',
                        headers: {},
                        body: fd
                    }).then(response => response.json())
                        .then(data => {
                            if (data.state == 255) {
                                message.error(data.msg);
                            } else {
                                dataDelta.ops[i]['insert']['image'] = data.data.url;
                                sldDelta = dataDelta.ops;
                                let cfg = {};
                                let converter = new QuillDeltaToHtmlConverter(sldDelta, cfg);
                                let html = converter.convert();
                                this.props.getRQContent(html);
                                this.setState({
                                    value: html,
                                    state: true,
                                })
                            }
                        })
                } else {
                    this.props.getRQContent(content);
                    this.setState({
                        value: content,
                        state: true,
                    })
                }

            }else{
                this.props.getRQContent(content);
                this.setState({
                    value: content,
                    state: true,
                })
            }
        }
    };

    render() {
        const toolbarOptions = this.props.toolbarOptions!=undefined?this.props.toolbarOptions:[
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{'header': 1}, {'header': 2}],               // custom button values
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            [{'direction': 'rtl'}],                         // text direction

            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            [{'header': [1, 2, 3, 4, 5, 6, false]}],

            [{'color': ['#000','#e60000','#ff9900','#ffff00','#008a00','#0066cc','#9933ff','#fff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5','#ebd6ff','#bbbbbb','#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466']}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}],
            [{'align': []}],
            ['link', 'image', 'video'],
            ['clean']                                         // remove formatting button
        ];
        return (
            <div className="clearfix">
                <ReactQuill modules={{toolbar: toolbarOptions}} style={{minHeight: '300px',height:this.props.height!=undefined?this.props.height:'auto'}}
                            value={this.props.value}
                            onChange={(content, delta, source, editor)=>this.handleChange(content, delta, source, editor)}/>
            </div>
        );
    }
}

export default SldReactQuill;
