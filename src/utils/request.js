import fetch from 'dva/fetch';
import { loginOut, setLocalStorageTime, getLocalStorageStingVal } from './utils';
import { language_type } from './util_data';
import { parse } from 'qs';
import { getLocale } from 'umi/locale';
import React from 'react';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  245: '抱歉，您没有操作该功能的权限！',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, type = '') {
  const defaultOptions = {
    credentials: 'include',
  };

  let newOptions = { ...defaultOptions, ...options };

  if (newOptions.headers == undefined) {
    newOptions.headers = {};
  }

  //设置当前语言
  const selectedLang = getLocale();
  let api_language = language_type().filter(item=>item.key == selectedLang)[0].val;
  newOptions.headers.Language = api_language;

  //请求接口需要有登录认证请求头，只有登录接口需要传递授权认证，其余接口为token
  if (url.indexOf('adminLogin/oauth/token') > -1) {
    newOptions.headers.Authorization = 'Basic VVcxS2FsRlhVblJoVnpROTpVMjFHTWxsVlFrUmlNMEkxVlcxc2JtRklVa0ZWTW5oMldrYzVkUT09';
  } else {
    newOptions.headers.Authorization = 'Bearer ' + getLocalStorageStingVal('sld_token');
  }

  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': type == 'json' ? 'application/json' : 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      if (type == 'json') {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  }
  let fileName = '';//导出的文件名
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (response.headers.get('Content-Type').indexOf('json') == -1) {//导出功能
        let params = parse(url.split('?')[1]);
        fileName = params.fileName;
        if (response.headers.get('Content-Type').indexOf('excel') > -1) {//导出excel
          fileName += '.xls';
        }else {//导出zip
          fileName += '.zip';
        }
        return response.blob();
      }
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    }).then(data => {
      if (data.state == undefined) {
        download(data, fileName);//下载文件
        return false;
      }
      if (data.state != undefined && (data.state == 501 || data.state === 266)) {
        loginOut();
      } else {
        // 更新sld_token的时间
        // {
        //   setLocalStorageTime();
        // }
        return data;
      }
    }).catch((e) => {
      return { state: 500, msg: '请刷新页面～' };
    });
}

function download(blobData, forDownLoadFileName = '') {
  const aLink = document.createElement('a');
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = window.URL.createObjectURL(blobData);
  aLink.setAttribute('download', forDownLoadFileName);
  aLink.click();
  document.body.removeChild(aLink);
}
