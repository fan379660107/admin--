//slodon_配置服务器接口地址
module.exports = {
  // apiUrl: document.location.protocol + '//' + window.location.host + '/',
  apiUrl: 'http://47.98.54.208:9001/',
  imUrl: 'http://121.40.97.153:9005/', //im访问地址
  // apiUrl: 'https://seller.55sld.com/',
  // imUrl: 'https://im.55sld.com/', //im访问地址
  uploadLimit: 20, //上传限制，单位M
  addGoodsSpecLimit: 3, //发布商品添加规格项限制的数量
  addGoodsSpecValLimit: 10, //发布商品添加规格值限制的数量
  specialFlag:
    window.location.host.indexOf('jbbcadmindev.slodon.cn') +
    window.location.host.indexOf('localhost') +
    window.location.host.indexOf('admin.55sld.com'),
  sldStatShowDebug: true, //是否开启统计的调试
};

/** copyright *** slodon *** version-v4.1 *** date-2022-07-22 ***主版本v4.1**/

// apiUrl之前的配置 document.location.protocol+'//'+window.location.host + '/',
// imUrl 之前的配置 https://im.55sld.com/
