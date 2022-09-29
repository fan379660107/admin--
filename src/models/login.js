import { routerRedux } from 'dva/router';
import { getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, failTip, sucTip, sldCommonService ,sldComLanguage} from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({ payload, callback }, { call, put }) {
      //登录
      const response = yield call(sldCommonService, payload, 'post', 'v3/adminLogin/oauth/token');
      // Login successfully
      if (response.state === 200) {
        //获取系统配置的菜单
        if (response.data.resourceList.length > 0) {
          localStorage.setItem('sld_menu_data', JSON.stringify(response.data.resourceList));
          let sld_all_routes = [];//所有页面的路由
          response.data.resourceList.map(item=>{
            item.children.map(child=>{
              sld_all_routes.push(child.frontPath)
            })
          })
          localStorage.setItem('sld_all_routes', JSON.stringify(sld_all_routes));
          let tmp_data = response.data.resourceList;
          let cur_top_nav = [];//顶部菜单
          let cur_top_nav_info = [];//顶部菜单详细信息
          for (let i in tmp_data) {
            let split_first = tmp_data[i].frontPath.split('/');
            let target = split_first[1].split('_')[0];
            if (cur_top_nav.indexOf(target) == -1) {
              let target_data = {};
              target_data.top_nav = target;
              target_data.path = tmp_data[i].children[0].frontPath;
              if (target == 'sysset') {
                target_data.name = '系统配置';
                target_data.icon = 'xitong1';
              } else if (target == 'manage') {
                target_data.name = '商城管理';
                target_data.icon = 'shangchengguanli2';
              }else if (target == 'decorate') {
                target_data.name = '装修';
                target_data.icon = 'ziyuan114';
              } else if (target == 'marketing') {
                target_data.name = '应用中心';
                target_data.icon = 'yunying';
              } else if (target == 'member') {
                target_data.name = '会员中心';
                target_data.icon = 'huiyuanzhongxin';
              } else if (target == 'statistics') {
                target_data.name = '统计中心';
                target_data.icon = 'tongjizhongxin';
              } else if (target == 'im') {
                target_data.name = '客服';
                target_data.icon = 'kefu1';
              }
              cur_top_nav.push(target);
              cur_top_nav_info.push(target_data);
            }
          }

          localStorage.setItem('cur_top_nav', JSON.stringify(cur_top_nav));
          localStorage.setItem('cur_top_nav_info', JSON.stringify(cur_top_nav_info));

        } else {
          failTip(`${sldComLanguage('抱歉，该账号未授予权限，请先授予权限～')}`);
          return false;
        }
        if (callback) callback(response);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        let all_routes = JSON.parse(localStorage.sld_all_routes);
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }else{
          yield put(routerRedux.replace(all_routes[0]));
          return;
        }
        //如果redirect在用户拥有的路由内，则跳转，否则跳转第一个页面
        let contain_redirect_flag = false;
        for(let i= 0;i<all_routes.length;i++){
          if(redirect.indexOf(all_routes[i])>-1){
            contain_redirect_flag = true;
            break;
          }
        }
        if(!contain_redirect_flag){
          redirect = all_routes[0]
        }
        yield put(routerRedux.replace(redirect));
      } else {
        if (callback) callback(response);
      }
    },
    //slodon_获取admin登录图片
    * get_login_img({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getPcMainImage');
      if (callback) callback(response);
    },
    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    //更新配置
    * update_setting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/settingInit');
      if (response.state == 200) {
        sucTip(response.msg);
      } else {
        failTip(response.msg);
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
