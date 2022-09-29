import React from 'react';
import Redirect from 'umi/redirect';
import { imUrl } from '@/utils/sldconfig';
import { loginOut } from '@/utils/utils';
export default ({ children }) => {
  let cur_time = new Date().getTime();
  let start_time = localStorage.getItem('time');
  if (typeof start_time == 'undefined' || start_time == null) {
    return <Redirect to="/user/login"/>;
  } else {
    if (cur_time - start_time > ((24 * 60 * 15 - 2) * 60 * 1000)) {
      //用户登陆过期之后直接跳转登录页面(14天23小时58分钟，refresh_token的有效期是15天)
      return <Redirect to="/user/login"/>;
    }
  }
  //如果redirect在用户拥有的路由内，则跳转，否则跳转第一个页面
  if (localStorage.sld_all_routes != undefined) {
    let all_routes = JSON.parse(localStorage.sld_all_routes);
    let contain_redirect_flag = false;
    for (let i = 0; i < all_routes.length; i++) {
      if (children.props.location.pathname.indexOf(all_routes[i]) > -1) {
        contain_redirect_flag = true;
        break;
      }
    }
    if (!contain_redirect_flag) {
      return <Redirect to={all_routes[0]}/>;
    }else if(children.props.location.pathname.indexOf('/im')>-1){
      //需要跳转到im页面
      if(localStorage.sld_token!=undefined&&localStorage.sld_token){
        let userInfo = JSON.parse(localStorage.user_info);
        let target = imUrl + `?sld_token=${localStorage.getItem('sld_token')}&adminId=${userInfo.adminId}&adminName=${userInfo.user_name}&isSuper=${localStorage.getItem('isSuper')}`;
        if(all_routes.length == 1){
          window.location.replace(target);
          return false;
        }else{
          window.open(target,"_blank");
        }
      }else{
        loginOut();
      }
    }
  }
  return children;
};
