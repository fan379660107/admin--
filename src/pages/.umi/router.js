import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'C:/Users/範温柔/Desktop/admin-平台后台/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
        exact: true,
      },
      {
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../User/Login'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/decorate_pc/diy_page_lists_to_edit',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    Routes: [require('../CheckLogin').default],
    routes: [
      {
        path: '/decorate_pc/diy_page_lists_to_edit',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                  m => {
                    return { namespace: 'mdecorate', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                  m => {
                    return { namespace: 'pc_home', ...m.default };
                  },
                ),
              ],
              component: () => import('../decorate/pc/home/edit_diy_page'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../decorate/pc/home/edit_diy_page').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/decorate_pc/topic_diy_page_lists_to_edit',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    Routes: [require('../CheckLogin').default],
    routes: [
      {
        path: '/decorate_pc/topic_diy_page_lists_to_edit',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                  m => {
                    return { namespace: 'mdecorate', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                  m => {
                    return { namespace: 'pc_home', ...m.default };
                  },
                ),
              ],
              component: () => import('../decorate/pc/home/edit_diy_page'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../decorate/pc/home/edit_diy_page').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/manage_product/goods_detail',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/manage_product/goods_detail',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                  m => {
                    return { namespace: 'article', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                  m => {
                    return { namespace: 'bill', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                  m => {
                    return { namespace: 'evaluate', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                  m => {
                    return { namespace: 'goods_platform', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                  m => {
                    return { namespace: 'order', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                  m => {
                    return { namespace: 'product', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                  m => {
                    return { namespace: 'reason', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                  m => {
                    return { namespace: 'store', ...m.default };
                  },
                ),
              ],
              component: () => import('../manage/product/goods_common_detail'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../manage/product/goods_common_detail').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/manage_order/order_detail',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    name: '',
    routes: [
      {
        path: '/manage_order/order_detail',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                  m => {
                    return { namespace: 'article', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                  m => {
                    return { namespace: 'bill', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                  m => {
                    return { namespace: 'evaluate', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                  m => {
                    return { namespace: 'goods_platform', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                  m => {
                    return { namespace: 'order', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                  m => {
                    return { namespace: 'product', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                  m => {
                    return { namespace: 'reason', ...m.default };
                  },
                ),
                import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                  m => {
                    return { namespace: 'store', ...m.default };
                  },
                ),
              ],
              component: () => import('../manage/order/order_common_detail'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../manage/order/order_common_detail').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../CheckLogin').default],
    routes: [
      {
        path: '/',
        redirect: '/sysset_home/basic',
        exact: true,
      },
      {
        path: '/sysset_home',
        icon: 'home',
        name: 'home',
        routes: [
          {
            path: '/sysset_home/basic',
            name: 'basic',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/home/basic'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/home/basic').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_setting',
        icon: 'setting',
        name: 'setting',
        routes: [
          {
            path: '/sysset_setting/site_info',
            name: 'site_info',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/base/site_info'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/base/site_info').default,
            exact: true,
          },
          {
            path: '/sysset_setting/pic_set',
            name: 'pic_set',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/base/pic_set'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/base/pic_set').default,
            exact: true,
          },
          {
            path: '/sysset_setting/payment',
            name: 'payment',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/base/payment'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/base/payment').default,
            exact: true,
          },
          {
            path: '/sysset_setting/order',
            name: 'order',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/base/order'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/base/order').default,
            exact: true,
          },
          {
            path: '/sysset_setting/app_set',
            name: 'app_set',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/base/app_set'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/base/app_set').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_notice_set',
        icon: 'bell',
        name: 'notice_set',
        routes: [
          {
            path: '/sysset_notice_set/sms',
            name: 'sms',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/notice_set/sms'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/notice_set/sms').default,
            exact: true,
          },
          {
            path: '/sysset_notice_set/email',
            name: 'email',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/notice_set/email'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/notice_set/email').default,
            exact: true,
          },
          {
            path: '/sysset_notice_set/msg_tpl',
            name: 'msg_tpl',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/notice_set/msg_tpl'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/notice_set/msg_tpl').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_acount',
        icon: 'usergroup-add',
        name: 'acount',
        routes: [
          {
            path: '/sysset_acount/union_login',
            name: 'union_login',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/acount/union_login'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/acount/union_login').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_authority',
        icon: 'security-scan',
        name: 'authority',
        routes: [
          {
            path: '/sysset_authority/authority_group',
            name: 'authority_group',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/authority/group'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/authority/group').default,
            exact: true,
          },
          {
            path: '/sysset_authority/authority_member',
            name: 'authority_member',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/authority/member'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/authority/member').default,
            exact: true,
          },
          {
            path: '/sysset_authority/operate_log',
            name: 'operate_log',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/authority/operate_log'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/authority/operate_log').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_agreement',
        icon: 'reconciliation',
        name: 'agreement',
        routes: [
          {
            path: '/sysset_agreement/lists',
            name: 'lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/agreement/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/agreement/lists').default,
            exact: true,
          },
          {
            path: '/sysset_agreement/lists_to_edit',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/agreement/edit'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/agreement/edit').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/sysset_express',
        icon: 'car',
        name: 'express',
        routes: [
          {
            path: '/sysset_express/express_lists',
            name: 'express_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/express/express_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/express/express_lists').default,
            exact: true,
          },
          {
            path: '/sysset_express/express',
            name: 'express',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/agreement.js').then(
                      m => {
                        return { namespace: 'agreement', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/authority.js').then(
                      m => {
                        return { namespace: 'authority', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/sysset/models/sldsetting.js').then(
                      m => {
                        return { namespace: 'sldsetting', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../sysset/express/express'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../sysset/express/express').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/member',
        name: 'member',
        icon: 'usergroup-add',
        routes: [
          {
            path: '/member/lists',
            name: 'lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/lists').default,
            exact: true,
          },
          {
            path: '/member/lists_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/detail').default,
            exact: true,
          },
          {
            path: '/member/recharge',
            name: 'recharge',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/recharge'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/recharge').default,
            exact: true,
          },
          {
            path: '/member/withdraw',
            name: 'withdraw',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/withdraw'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/withdraw').default,
            exact: true,
          },
          {
            path: '/member/balance_log',
            name: 'balance_log',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/balance_log'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/balance_log').default,
            exact: true,
          },
          {
            path: '/member/point_setting',
            name: 'point_setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/member/models/member.js').then(
                      m => {
                        return { namespace: 'member', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../member/point_set'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../member/point_set').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_product',
        icon: 'appstore',
        name: 'product',
        routes: [
          {
            path: '/manage_product/goods_setting',
            name: 'goods_setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/goods_setting'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/goods_setting').default,
            exact: true,
          },
          {
            path: '/manage_product/goods_list',
            name: 'goods_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/goods_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/goods_list').default,
            exact: true,
          },
          {
            path: '/manage_product/goods_list_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/goods_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/goods_detail').default,
            exact: true,
          },
          {
            path: '/manage_product/cate_lists',
            name: 'cate_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/cate_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/cate_lists').default,
            exact: true,
          },
          {
            path: '/manage_product/brand',
            name: 'brand',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/brand'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/brand').default,
            exact: true,
          },
          {
            path: '/manage_product/search_attr',
            name: 'search_attr',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/search_attr'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/search_attr').default,
            exact: true,
          },
          {
            path: '/manage_product/goods_label',
            name: 'goods_label',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/product/goods_label'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/product/goods_label').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_goods_platform',
        icon: 'cloud-upload',
        name: 'goods_platform',
        routes: [
          {
            path: '/manage_goods_platform/list',
            name: 'list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/goods_platform/list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/goods_platform/list').default,
            exact: true,
          },
          {
            path: '/manage_goods_platform/list_to_edit',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/goods_platform/edit'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/goods_platform/edit').default,
            exact: true,
          },
          {
            path: '/manage_goods_platform/add',
            name: 'add',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/goods_platform/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/goods_platform/add').default,
            exact: true,
          },
          {
            path: '/manage_goods_platform/LM',
            name: 'LM',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/goods_platform/lm'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/goods_platform/lm').default,
            exact: true,
          },
          {
            path: '/manage_goods_platform/VOP',
            name: 'VOP',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/goods_platform/vop'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/goods_platform/vop').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/decorate_pc',
        icon: 'cluster',
        name: 'decorate_pc',
        routes: [
          {
            path: '/decorate_pc/instance_template_lists',
            name: 'instance_template_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../decorate/pc/home/instance_template_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/instance_template_lists').default,
            exact: true,
          },
          {
            path: '/decorate_pc/instance_template_lists_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/pc/home/add_template'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/add_template').default,
            exact: true,
          },
          {
            path: '/decorate_pc/diy_page_lists',
            name: 'diy_page_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/pc/home/diy_page_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/diy_page_lists').default,
            exact: true,
          },
          {
            path: '/decorate_pc/topic_diy_page_lists',
            name: 'topic_diy_page_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../decorate/pc/topic/topic_diy_page_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/topic/topic_diy_page_lists').default,
            exact: true,
          },
          {
            path: '/decorate_pc/home_setting',
            name: 'home_setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/pc/home/home_setting'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/home_setting').default,
            exact: true,
          },
          {
            path: '/decorate_pc/nav',
            name: 'nav',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/pc/home/nav'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/nav').default,
            exact: true,
          },
          {
            path: '/decorate_pc/footer',
            name: 'footer',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/pc/home/footer'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/pc/home/footer').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/decorate_m',
        icon: 'mobile',
        name: 'decorate_m',
        routes: [
          {
            path: '/decorate_m/lists',
            name: 'lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/mobile/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/mobile/lists').default,
            exact: true,
          },
          {
            path: '/decorate_m/lists_to_diy',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/mobile/edit_diy_page'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/mobile/edit_diy_page').default,
            exact: true,
          },
          {
            path: '/decorate_m/topic_lists',
            name: 'topic_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/mobile/topic_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/mobile/topic_lists').default,
            exact: true,
          },
          {
            path: '/decorate_m/topic_lists_to_diy',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/mobile/edit_diy_page'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/mobile/edit_diy_page').default,
            exact: true,
          },
          {
            path: '/decorate_m/cat_pic',
            name: 'cat_pic',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/mdecorate.js').then(
                      m => {
                        return { namespace: 'mdecorate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/decorate/models/pc_home.js').then(
                      m => {
                        return { namespace: 'pc_home', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../decorate/mobile/mcat'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../decorate/mobile/mcat').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_store',
        icon: 'shop',
        name: 'store',
        routes: [
          {
            path: '/manage_store/own_list',
            name: 'own_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/store/own_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/own_list').default,
            exact: true,
          },
          {
            path: '/manage_store/settle_store_list',
            name: 'settle_store_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/store/settle_store_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/settle_store_list').default,
            exact: true,
          },
          {
            path: '/manage_store/settle_store_list_apply_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/store/apply_store_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/apply_store_detail').default,
            exact: true,
          },
          {
            path: '/manage_store/settle_store_list_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../manage/store/settled_store_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/settled_store_detail').default,
            exact: true,
          },
          {
            path: '/manage_store/settle_store_list_to_edit',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/store/edit_settled_store'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/edit_settled_store').default,
            exact: true,
          },
          {
            path: '/manage_store/grade_list',
            name: 'grade_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/store/grade_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/store/grade_list').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_order',
        icon: 'form',
        name: 'order',
        routes: [
          {
            path: '/manage_order/order_lists',
            name: 'order_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/order_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/order_lists').default,
            exact: true,
          },
          {
            path: '/manage_order/order_lists_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/order_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/order_detail').default,
            exact: true,
          },
          {
            path: '/manage_order/service',
            name: 'service',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/service'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/service').default,
            exact: true,
          },
          {
            path: '/manage_order/evaluation',
            name: 'evaluation',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/evaluation'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/evaluation').default,
            exact: true,
          },
          {
            path: '/manage_order/salereson_lists',
            name: 'salereson_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/salereson_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/salereson_lists').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_bill',
        icon: 'pay-circle',
        name: 'bill',
        routes: [
          {
            path: '/manage_bill/lists',
            name: 'lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/bill/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/bill/lists').default,
            exact: true,
          },
          {
            path: '/manage_bill/lists_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/bill/detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/bill/detail').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/manage_article',
        icon: 'file-word',
        name: 'article',
        routes: [
          {
            path: '/manage_article/article_cat_lists',
            name: 'article_cat_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../manage/article/article_cat_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/article/article_cat_lists').default,
            exact: true,
          },
          {
            path: '/manage_article/article_lists',
            name: 'article_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/article/article_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/article/article_lists').default,
            exact: true,
          },
          {
            path: '/manage_article/article_lists_to_add',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/article/add_article'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/article/add_article').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/marketing_promotion',
        icon: 'chrome',
        name: 'promotion',
        routes: [
          {
            path: '/marketing_promotion/center',
            name: 'center',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/promotion/center'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/center').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/coupon',
            name: 'coupon',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/promotion/coupon/home'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/home').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/coupon_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/add_coupon'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/add_coupon').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/coupon_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/view_coupon'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/view_coupon').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/coupon_to_receive_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/member_receive_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/member_receive_lists')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/store_coupon',
            name: 'store_coupon',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/store_coupon'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/store_coupon').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/store_coupon_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/view_coupon'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/view_coupon').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/store_coupon_to_receive_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/coupon/member_receive_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/coupon/member_receive_lists')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/rank',
            name: 'rank',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/promotion/rank/index'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/rank/index').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/rank_to_bind',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/rank/bind_rank_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/rank/bind_rank_lists').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/rank_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/promotion/rank/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/rank/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/point_setting',
            name: 'point_setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/point_setting'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/point_setting').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/full_discount',
            name: 'full_discount',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/full/discount'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/full/discount').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/seckill',
            name: 'seckill',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/seckill/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/seckill/lists').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/seckill_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/seckill/detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/seckill/detail').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/seckill_goods_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/seckill/seckill_goods_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/seckill/seckill_goods_lists')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group',
            name: 'spell_group',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/spell_group/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/spell_group/lists').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/spell_group/view_spell_group'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/spell_group/view_spell_group')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group_bind_goods',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/spell_group/joined_goods_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/spell_group/joined_goods_list')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group_order',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/spell_group/order_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/spell_group/order_lists')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group_order_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/article.js').then(
                      m => {
                        return { namespace: 'article', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/bill.js').then(
                      m => {
                        return { namespace: 'bill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/evaluate.js').then(
                      m => {
                        return { namespace: 'evaluate', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/goods_platform.js').then(
                      m => {
                        return { namespace: 'goods_platform', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/order.js').then(
                      m => {
                        return { namespace: 'order', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/product.js').then(
                      m => {
                        return { namespace: 'product', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/reason.js').then(
                      m => {
                        return { namespace: 'reason', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/manage/models/store.js').then(
                      m => {
                        return { namespace: 'store', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../manage/order/order_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../manage/order/order_detail').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/spell_group_team_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/spell_group/team_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/spell_group/team_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/ladder_group',
            name: 'ladder_group',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/ladder_group/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/ladder_group/lists').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/ladder_group_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/ladder_group/view_ladder_group'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/ladder_group/view_ladder_group')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/ladder_group_team_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/ladder_group/team_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/ladder_group/team_list')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/presale',
            name: 'presale',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/presale/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/presale/lists').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/presale_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/presale/view_presale'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/presale/view_presale').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/presale_goods_list',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/promotion/presale/presale_goods_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/promotion/presale/presale_goods_lists')
                  .default,
            exact: true,
          },
          {
            path: '/marketing_promotion/sign',
            name: 'sign',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/sign/stat'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/sign/stat').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/sign_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/sign/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/sign/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/sign_to_member_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/sign/member_stat_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/sign/member_stat_detail').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/sign_to_activity_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/sign/activity_stat_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/sign/activity_stat_detail').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/lucky_draw_list',
            name: 'lucky_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/lucky_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/lucky_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/lucky_draw_list_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/turnplate_list',
            name: 'turnplate_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/turnplate_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/turnplate_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/turnplate_list_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/scratch_list',
            name: 'scratch_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/scratch_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/scratch_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/scratch_list_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/shake_list',
            name: 'shake_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/shake_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/shake_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/shake_list_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/add').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/turn_list',
            name: 'turn_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/turn_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/turn_list').default,
            exact: true,
          },
          {
            path: '/marketing_promotion/turn_list_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/draw/add'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/draw/add').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/statistics',
        icon: 'pie-chart',
        name: 'statistics',
        routes: [
          {
            path: '/statistics/realtime',
            name: 'realtime',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/realtime'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/realtime').default,
            exact: true,
          },
          {
            path: '/statistics/trade',
            name: 'trade',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/trade'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/trade').default,
            exact: true,
          },
          {
            path: '/statistics/flow',
            name: 'flow',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/flow'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/flow').default,
            exact: true,
          },
          {
            path: '/statistics/goods_saling',
            name: 'goods_saling',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/goods_saling'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/goods_saling').default,
            exact: true,
          },
          {
            path: '/statistics/goods_category',
            name: 'goods_category',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/goods_category'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/goods_category').default,
            exact: true,
          },
          {
            path: '/statistics/member',
            name: 'member',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/member'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/member').default,
            exact: true,
          },
          {
            path: '/statistics/store',
            name: 'store',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/store'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/store').default,
            exact: true,
          },
          {
            path: '/statistics/region',
            name: 'region',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/statistics/models/statistics.js').then(
                      m => {
                        return { namespace: 'statistics', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../statistics/region'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../statistics/region').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/marketing_svideo',
        icon: 'pay-circle',
        name: 'svideo',
        routes: [
          {
            path: '/marketing_svideo/setting',
            name: 'setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/setting'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/setting').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/label',
            name: 'label',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/label'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/label').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/video_theme',
            name: 'theme',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/theme'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/theme').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/video_theme_to_add',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/add_theme'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/add_theme').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/video_theme_bind_video',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/svideo/view_theme_video'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/view_theme_video').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/author_manage',
            name: 'author_manage',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/author_manage'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/author_manage').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/video_manage',
            name: 'video_manage',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/video_manage'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/video_manage').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/video_manage_bind_goods',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/video_goods'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/video_goods').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/comment_lists',
            name: 'comment_lists',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/svideo/comment_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/comment_lists').default,
            exact: true,
          },
          {
            path: '/marketing_svideo/comment_lists_to_view',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/svideo/view_video_comments'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/svideo/view_video_comments').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/marketing_point',
        icon: 'transaction',
        name: 'point',
        routes: [
          {
            path: '/marketing_point/diy_home',
            name: 'diy_home',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/point/mdiy/home'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/mdiy/home').default,
            exact: true,
          },
          {
            path: '/marketing_point/diy_home_to_edit',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/point/mdiy/edit_diy_page'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/mdiy/edit_diy_page').default,
            exact: true,
          },
          {
            path: '/marketing_point/setting',
            name: 'setting',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/point/setting'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/setting').default,
            exact: true,
          },
          {
            path: '/marketing_point/label',
            name: 'label',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/point/label'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/label').default,
            exact: true,
          },
          {
            path: '/marketing_point/goods_list',
            name: 'goods_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/point/goods/goods_list'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/goods/goods_list').default,
            exact: true,
          },
          {
            path: '/marketing_point/order_list',
            name: 'order_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/point/order/order_lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/order/order_lists').default,
            exact: true,
          },
          {
            path: '/marketing_point/order_list_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import('../marketing/point/order/order_detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/order/order_detail').default,
            exact: true,
          },
          {
            path: '/marketing_point/bill_list',
            name: 'bill_list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/point/bill/lists'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/bill/lists').default,
            exact: true,
          },
          {
            path: '/marketing_point/bill_list_to_detail',
            name: '',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/draw.js').then(
                      m => {
                        return { namespace: 'draw', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/information.js').then(
                      m => {
                        return { namespace: 'information', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/ladder_group.js').then(
                      m => {
                        return { namespace: 'ladder_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/point.js').then(
                      m => {
                        return { namespace: 'point', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/presale.js').then(
                      m => {
                        return { namespace: 'presale', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/promotion.js').then(
                      m => {
                        return { namespace: 'promotion', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/rank.js').then(
                      m => {
                        return { namespace: 'rank', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/seckill.js').then(
                      m => {
                        return { namespace: 'seckill', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/sign.js').then(
                      m => {
                        return { namespace: 'sign', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spell_group.js').then(
                      m => {
                        return { namespace: 'spell_group', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/spreader.js').then(
                      m => {
                        return { namespace: 'spreader', ...m.default };
                      },
                    ),
                    import('C:/Users/範温柔/Desktop/admin-平台后台/src/pages/marketing/models/svideo.js').then(
                      m => {
                        return { namespace: 'svideo', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../marketing/point/bill/detail'),
                  LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                    .default,
                })
              : require('../marketing/point/bill/detail').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../404'),
              LoadingComponent: require('C:/Users/範温柔/Desktop/admin-平台后台/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('C:/Users/範温柔/Desktop/admin-平台后台/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
