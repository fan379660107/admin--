export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/decorate_pc/diy_page_lists_to_edit',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/decorate_pc/diy_page_lists_to_edit', component: './decorate/pc/home/edit_diy_page' },
    ],
  },
  {
    path: '/decorate_pc/topic_diy_page_lists_to_edit',
    component: '../layouts/UserLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/decorate_pc/topic_diy_page_lists_to_edit', component: './decorate/pc/home/edit_diy_page' },
    ],
  },
  //商品详情
  {
    path: '/manage_product/goods_detail',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/manage_product/goods_detail', component: './manage/product/goods_common_detail' },
    ],
  },
  //订单详情
  {
    path: '/manage_order/order_detail',
    component: '../layouts/UserLayout',
    name: '',
    routes: [
      { path: '/manage_order/order_detail', component: './manage/order/order_common_detail' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/CheckLogin'],
    routes: [
      { path: '/', redirect: '/sysset_home/basic' },
      //系统配置—首页管理
      {
        path: '/sysset_home',
        icon: 'home',
        name: 'home',
        routes: [
          //概况页
          {
            path: '/sysset_home/basic',
            name: 'basic',
            component: './sysset/home/basic',
          },
        ],
      },
      //系统配置—基本配置
      {
        path: '/sysset_setting',
        icon: 'setting',
        name: 'setting',
        routes: [
          //站点配置
          {
            path: '/sysset_setting/site_info',
            name: 'site_info',
            component: './sysset/base/site_info',
          },
          //图片配置
          {
            path: '/sysset_setting/pic_set',
            name: 'pic_set',
            component: './sysset/base/pic_set',
          },
          //支付配置
          {
            path: '/sysset_setting/payment',
            name: 'payment',
            component: './sysset/base/payment',
          },
          //运营配置
          {
            path: '/sysset_setting/order',
            name: 'order',
            component: './sysset/base/order',
          },
          //APP配置
          {
            path: '/sysset_setting/app_set',
            name: 'app_set',
            component: './sysset/base/app_set',
          },
        ],
      },
      //系统配置—通知管理
      {
        path: '/sysset_notice_set',
        icon: 'bell',
        name: 'notice_set',
        routes: [
          //短信配置
          {
            path: '/sysset_notice_set/sms',
            name: 'sms',
            component: './sysset/notice_set/sms',
          },
          //邮件配置
          {
            path: '/sysset_notice_set/email',
            name: 'email',
            component: './sysset/notice_set/email',
          },
          //消息模板
          {
            path: '/sysset_notice_set/msg_tpl',
            name: 'msg_tpl',
            component: './sysset/notice_set/msg_tpl',
          },

        ],
      },
      // 系统配置—三方账号
      {
        path: '/sysset_acount',
        icon: 'usergroup-add',
        name: 'acount',
        routes: [
          //授权配置
          {
            path: '/sysset_acount/union_login',
            name: 'union_login',
            component: './sysset/acount/union_login',
          },
        ],
      },
      //系统配置—权限管理
      {
        path: '/sysset_authority',
        icon: 'security-scan',
        name: 'authority',
        routes: [
          //权限组
          {
            path: '/sysset_authority/authority_group',
            name: 'authority_group',
            component: './sysset/authority/group',
          },
          //操作员管理
          {
            path: '/sysset_authority/authority_member',
            name: 'authority_member',
            component: './sysset/authority/member',
          },
          //操作日志
          {
            path: '/sysset_authority/operate_log',
            name: 'operate_log',
            component: './sysset/authority/operate_log',
          },
        ],
      },
      //系统配置-协议管理
      {
        path: '/sysset_agreement',
        icon: 'reconciliation',
        name: 'agreement',
        routes: [
          //协议管理
          {
            path: '/sysset_agreement/lists',
            name: 'lists',
            component: './sysset/agreement/lists',
          },
          //编辑协议
          {
            path: '/sysset_agreement/lists_to_edit',
            name: '',
            component: './sysset/agreement/edit',
          },
        ],
      },
      //系统配置—物流管理
      {
        path: '/sysset_express',
        icon: 'car',
        name: 'express',
        routes: [
          //物流公司
          {
            path: '/sysset_express/express_lists',
            name: 'express_lists',
            component: './sysset/express/express_lists',
          },
          //物流配置
          {
            path: '/sysset_express/express',
            name: 'express',
            component: './sysset/express/express',
          },
        ],
      },
      // 会员管理
      {
        path: '/member',
        name: 'member',
        icon: 'usergroup-add',
        routes: [
          //会员列表
          {
            path: '/member/lists',
            name: 'lists',
            component: './member/lists',
          },
          //会员详情
          {
            path: '/member/lists_to_detail',
            name: '',
            component: './member/detail',
          },
          //充值管理
          {
            path: '/member/recharge',
            name: 'recharge',
            component: './member/recharge',
          },
          //提现管理
          {
            path: '/member/withdraw',
            name: 'withdraw',
            component: './member/withdraw',
          },
          //资金明细
          {
            path: '/member/balance_log',
            name: 'balance_log',
            component: './member/balance_log',
          },
          //积分设置
          {
            path: '/member/point_setting',
            name: 'point_setting',
            component: './member/point_set',
          },
        ],
      },
      // 商品管理
      {
        path: '/manage_product',
        icon: 'appstore',
        name: 'product',
        routes: [
          //商品设置
          {
            path: '/manage_product/goods_setting',
            name: 'goods_setting',
            component: './manage/product/goods_setting',
          },
          //商品列表
          {
            path: '/manage_product/goods_list',
            name: 'goods_list',
            component: './manage/product/goods_list',
          },
          //商品详情
          {
            path: '/manage_product/goods_list_to_detail',
            name: '',
            component: './manage/product/goods_detail',
          },
          //分类管理
          {
            path: '/manage_product/cate_lists',
            name: 'cate_lists',
            component: './manage/product/cate_lists',
          },
          //品牌列表
          {
            path: '/manage_product/brand',
            name: 'brand',
            component: './manage/product/brand',
          },
          //属性管理
          {
            path: '/manage_product/search_attr',
            name: 'search_attr',
            component: './manage/product/search_attr',
          },
          //商品标签
          {
            path: '/manage_product/goods_label',
            name: 'goods_label',
            component: './manage/product/goods_label',
          },
        ],
      },
      // 商品库管理
      {
        path: '/manage_goods_platform',
        icon: 'cloud-upload',
        name: 'goods_platform',
        routes: [
          //商品资料库
          {
            path: '/manage_goods_platform/list',
            name: 'list',
            component: './manage/goods_platform/list',
          },
          //编辑商品资料
          {
            path: '/manage_goods_platform/list_to_edit',
            name: '',
            component: './manage/goods_platform/edit',
          },
          //添加商品资料
          {
            path: '/manage_goods_platform/add',
            name: 'add',
            component: './manage/goods_platform/add',
          },
          //LM商品库
          {
            path: '/manage_goods_platform/LM',
            name: 'LM',
            component: './manage/goods_platform/lm',
          },
          //VOP商品库
          {
            path: '/manage_goods_platform/VOP',
            name: 'VOP',
            component: './manage/goods_platform/vop',
          },
        ],
      },
      // PC装修
      {
        path: '/decorate_pc',
        icon: 'cluster',
        name: 'decorate_pc',
        routes: [
          // 实例化模版
          {
            path: '/decorate_pc/instance_template_lists',
            name: 'instance_template_lists',
            component: './decorate/pc/home/instance_template_lists',
          },
          // 新增/编辑模版
          {
            path: '/decorate_pc/instance_template_lists_to_add',
            name: '',
            component: './decorate/pc/home/add_template',
          },
          // // 测试模板
          // {
          //   path: '/decorate_pc/adv_21',
          //   name: 'adv_21',
          //   component: './decorate/pc/home/adv_21',
          // },
          // 首页装修
          {
            path: '/decorate_pc/diy_page_lists',
            name: 'diy_page_lists',
            component: './decorate/pc/home/diy_page_lists',
          },
          // 专题装修
          {
            path: '/decorate_pc/topic_diy_page_lists',
            name: 'topic_diy_page_lists',
            component: './decorate/pc/topic/topic_diy_page_lists',
          },
          // 首页广告
          {
            path: '/decorate_pc/home_setting',
            name: 'home_setting',
            component: './decorate/pc/home/home_setting',
          },
          // 首页导航
          {
            path: '/decorate_pc/nav',
            name: 'nav',
            component: './decorate/pc/home/nav',
          },
          //页脚管理
          {
            path: '/decorate_pc/footer',
            name: 'footer',
            component: './decorate/pc/home/footer',
          },
        ],
      },
      // 首页装修
      {
        path: '/decorate_m',
        icon: 'mobile',
        name: 'decorate_m',
        routes: [
          // 首页装修
          {
            path: '/decorate_m/lists',
            name: 'lists',
            component: './decorate/mobile/lists',
          },
          // 首页装修页面
          {
            path: '/decorate_m/lists_to_diy',
            name: '',
            component: './decorate/mobile/edit_diy_page',
          },
          // 专题装修
          {
            path: '/decorate_m/topic_lists',
            name: 'topic_lists',
            component: './decorate/mobile/topic_lists',
          },
          // 专题装修页面
          {
            path: '/decorate_m/topic_lists_to_diy',
            name: '',
            component: './decorate/mobile/edit_diy_page',
          },
          // 分类图片
          {
            path: '/decorate_m/cat_pic',
            name: 'cat_pic',
            component: './decorate/mobile/mcat',
          },
        ],
      },
      // 店铺管理
      {
        path: '/manage_store',
        icon: 'shop',
        name: 'store',
        routes: [
          //自营店铺
          {
            path: '/manage_store/own_list',
            name: 'own_list',
            component: './manage/store/own_list',
          },
          //入驻店铺
          {
            path: '/manage_store/settle_store_list',
            name: 'settle_store_list',
            component: './manage/store/settle_store_list',
          },
          //入驻审核店铺详情
          {
            path: '/manage_store/settle_store_list_apply_detail',
            name: '',
            component: './manage/store/apply_store_detail',
          },
          //店铺入驻信息详情
          {
            path: '/manage_store/settle_store_list_view',
            name: '',
            component: './manage/store/settled_store_detail',
          },
          //编辑店铺入驻信息
          {
            path: '/manage_store/settle_store_list_to_edit',
            name: '',
            component: './manage/store/edit_settled_store',
          },
          //店铺等级
          {
            path: '/manage_store/grade_list',
            name: 'grade_list',
            component: './manage/store/grade_list',
          },
        ],
      },
      // 订单管理
      {
        path: '/manage_order',
        icon: 'form',
        name: 'order',
        routes: [
          //订单列表
          {
            path: '/manage_order/order_lists',
            name: 'order_lists',
            component: './manage/order/order_lists',
          },
          //订单详情
          {
            path: '/manage_order/order_lists_to_detail',
            name: '',
            component: './manage/order/order_detail',
          },
          //售后管理
          {
            path: '/manage_order/service',
            name: 'service',
            component: './manage/order/service',
          },
          //评价管理
          {
            path: '/manage_order/evaluation',
            name: 'evaluation',
            component: './manage/order/evaluation',
          },
          //售后原因
          {
            path: '/manage_order/salereson_lists',
            name: 'salereson_lists',
            component: './manage/order/salereson_lists',
          },
        ],
      },
      // 结算管理
      {
        path: '/manage_bill',
        icon: 'pay-circle',
        name: 'bill',
        routes: [
          //结算账单
          {
            path: '/manage_bill/lists',
            name: 'lists',
            component: './manage/bill/lists',
          },
          //结算账单详情
          {
            path: '/manage_bill/lists_to_detail',
            name: '',
            component: './manage/bill/detail',
          },
        ],
      },
      // 文章管理
      {
        path: '/manage_article',
        icon: 'file-word',
        name: 'article',
        routes: [
          {
            path: '/manage_article/article_cat_lists',
            name: 'article_cat_lists',
            component: './manage/article/article_cat_lists',
          }, {
            path: '/manage_article/article_lists',
            name: 'article_lists',
            component: './manage/article/article_lists',
          }, {
            path: '/manage_article/article_lists_to_add',
            component: './manage/article/add_article',
          },
        ],
      },
      // 促销活动
      {
        path: '/marketing_promotion',
        icon: 'chrome',
        name: 'promotion',
        routes: [
          //优惠券
          {
            path: '/marketing_promotion/center',
            name: 'center',
            component: './marketing/promotion/center',
          },
          //优惠券
          {
            path: '/marketing_promotion/coupon',
            name: 'coupon',
            component: './marketing/promotion/coupon/home',
          },
          //新建优惠券
          {
            path: '/marketing_promotion/coupon_to_add',
            name: '',
            component: './marketing/promotion/coupon/add_coupon',
          },
          //平台优惠券——查看优惠券
          {
            path: '/marketing_promotion/coupon_to_view',
            name: '',
            component: './marketing/promotion/coupon/view_coupon',
          },
          //平台优惠券——优惠券领取列表
          {
            path: '/marketing_promotion/coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/coupon/member_receive_lists',
          },
          //店铺优惠券
          {
            path: '/marketing_promotion/store_coupon',
            name: 'store_coupon',
            component: './marketing/promotion/coupon/store_coupon',
          },
          //店铺优惠券——查看优惠券
          {
            path: '/marketing_promotion/store_coupon_to_view',
            name: '',
            component: './marketing/promotion/coupon/view_coupon',
          },
          //店铺优惠券——优惠券领取列表
          {
            path: '/marketing_promotion/store_coupon_to_receive_list',
            name: '',
            component: './marketing/promotion/coupon/member_receive_lists',
          },
          //排行榜
          {
            path: '/marketing_promotion/rank',
            name: 'rank',
            component: './marketing/promotion/rank/index',
          },
          //关联榜单
          {
            path: '/marketing_promotion/rank_to_bind',
            name: '',
            component: './marketing/promotion/rank/bind_rank_lists',
          },
          //新建排行榜
          {
            path: '/marketing_promotion/rank_to_add',
            name: '',
            component: './marketing/promotion/rank/add',
          },
          //积分抵扣
          {
            path: '/marketing_promotion/point_setting',
            name: 'point_setting',
            component: './marketing/promotion/point_setting',
          },
          //满优惠列表
          {
            path: '/marketing_promotion/full_discount',
            name: 'full_discount',
            component: './marketing/promotion/full/discount',
          },
          //秒杀活动
          {
            path: '/marketing_promotion/seckill',
            name: 'seckill',
            component: './marketing/promotion/seckill/lists',
          },
          //秒杀活动详情——秒杀活动场次
          {
            path: '/marketing_promotion/seckill_detail',
            name: '',
            component: './marketing/promotion/seckill/detail',
          },
          //秒杀活动商品
          {
            path: '/marketing_promotion/seckill_goods_list',
            name: '',
            component: './marketing/promotion/seckill/seckill_goods_lists',
          },
          //拼团活动
          {
            path: '/marketing_promotion/spell_group',
            name: 'spell_group',
            component: './marketing/promotion/spell_group/lists',
          },
          //拼团活动——查看详情
          {
            path: '/marketing_promotion/spell_group_to_view',
            name: '',
            component: './marketing/promotion/spell_group/view_spell_group',
          },
          //拼团活动商品
          {
            path: '/marketing_promotion/spell_group_bind_goods',
            name: '',
            component: './marketing/promotion/spell_group/joined_goods_list',
          },
          //拼团活动订单
          {
            path: '/marketing_promotion/spell_group_order',
            name: '',
            component: './marketing/promotion/spell_group/order_lists',
          },
          //拼团活动订单详情
          {
            path: '/marketing_promotion/spell_group_order_to_detail',
            name: '',
            component: './manage/order/order_detail',
          },
          //拼团团队列表
          {
            path: '/marketing_promotion/spell_group_team_list',
            name: '',
            component: './marketing/promotion/spell_group/team_list',
          },
          //阶梯团活动
          {
            path: '/marketing_promotion/ladder_group',
            name: 'ladder_group',
            component: './marketing/promotion/ladder_group/lists',
          },
          //阶梯团活动——查看详情
          {
            path: '/marketing_promotion/ladder_group_to_view',
            name: '',
            component: './marketing/promotion/ladder_group/view_ladder_group',
          },
          //阶梯团活动——团队列表
          {
            path: '/marketing_promotion/ladder_group_team_list',
            name: '',
            component: './marketing/promotion/ladder_group/team_list',
          },
          //预售活动
          {
            path: '/marketing_promotion/presale',
            name: 'presale',
            component: './marketing/promotion/presale/lists',
          },
          //预售详情
          {
            path: '/marketing_promotion/presale_to_view',
            name: '',
            component: './marketing/promotion/presale/view_presale',
          },
          //预售活动商品
          {
            path: '/marketing_promotion/presale_goods_list',
            name: '',
            component: './marketing/promotion/presale/presale_goods_lists',
          },
          //签到统计列表
          {
            path: '/marketing_promotion/sign',
            name: 'sign',
            component: './marketing/sign/stat',
          },
          //新建签到活动
          {
            path: '/marketing_promotion/sign_to_add',
            name: '',
            component: './marketing/sign/add',
          },
          //会员签到统计详情
          {
            path: '/marketing_promotion/sign_to_member_detail',
            name: '',
            component: './marketing/sign/member_stat_detail',
          },
          //活动签到详情
          {
            path: '/marketing_promotion/sign_to_activity_detail',
            name: '',
            component: './marketing/sign/activity_stat_detail',
          },
          //幸运抽奖列表
          {
            path: '/marketing_promotion/lucky_draw_list',
            name: 'lucky_list',
            component: './marketing/draw/lucky_list',
          },
          //新建幸运抽奖活动
          {
            path: '/marketing_promotion/lucky_draw_list_to_add',
            name: '',
            component: './marketing/draw/add',
          },
          //大转盘抽奖
          {
            path: '/marketing_promotion/turnplate_list',
            name: 'turnplate_list',
            component: './marketing/draw/turnplate_list',
          },
          //新建大转盘抽奖活动
          {
            path: '/marketing_promotion/turnplate_list_to_add',
            name: '',
            component: './marketing/draw/add',
          },
          //刮刮卡
          {
            path: '/marketing_promotion/scratch_list',
            name: 'scratch_list',
            component: './marketing/draw/scratch_list',
          },
          //新建刮刮卡活动
          {
            path: '/marketing_promotion/scratch_list_to_add',
            name: '',
            component: './marketing/draw/add',
          },
          //摇一摇
          {
            path: '/marketing_promotion/shake_list',
            name: 'shake_list',
            component: './marketing/draw/shake_list',
          },
          //新建摇一摇活动
          {
            path: '/marketing_promotion/shake_list_to_add',
            name: '',
            component: './marketing/draw/add',
          },
          //翻翻看
          {
            path: '/marketing_promotion/turn_list',
            name: 'turn_list',
            component: './marketing/draw/turn_list',
          },
          //新建翻翻看活动
          {
            path: '/marketing_promotion/turn_list_to_add',
            name: '',
            component: './marketing/draw/add',
          },
        ],
      },

      // 统计中心
      {
        path: '/statistics',
        icon: 'pie-chart',
        name: 'statistics',
        routes: [
          //实时分析
          {
            path: '/statistics/realtime',
            name: 'realtime',
            component: './statistics/realtime',
          },
          //交易分析
          {
            path: '/statistics/trade',
            name: 'trade',
            component: './statistics/trade',
          },
          //流量分析
          {
            path: '/statistics/flow',
            name: 'flow',
            component: './statistics/flow',
          },
          //商品动销
          {
            path: '/statistics/goods_saling',
            name: 'goods_saling',
            component: './statistics/goods_saling',
          },
          //商品品类
          {
            path: '/statistics/goods_category',
            name: 'goods_category',
            component: './statistics/goods_category',
          },
          //会员分析
          {
            path: '/statistics/member',
            name: 'member',
            component: './statistics/member',
          },
          //店铺分析
          {
            path: '/statistics/store',
            name: 'store',
            component: './statistics/store',
          },
          //地域分析
          {
            path: '/statistics/region',
            name: 'region',
            component: './statistics/region',
          }
        ]
      },
      //svideo-start
      //短视频
      {
        path: '/marketing_svideo',
        icon: 'pay-circle',
        name: 'svideo',
        routes: [
          //短视频设置
          {
            path: '/marketing_svideo/setting',
            name: 'setting',
            component: './marketing/svideo/setting',
          },
          //标签管理
          {
            path: '/marketing_svideo/label',
            name: 'label',
            component: './marketing/svideo/label',
          },
          //推荐主题
          {
            path: '/marketing_svideo/video_theme',
            name: 'theme',
            component: './marketing/svideo/theme',
          },
          //新增推荐主题
          {
            path: '/marketing_svideo/video_theme_to_add',
            name: '',
            component: './marketing/svideo/add_theme',
          },
          //推荐主题绑定的视频
          {
            path: '/marketing_svideo/video_theme_bind_video',
            name: '',
            component: './marketing/svideo/view_theme_video',
          },
          //作者管理
          {
            path: '/marketing_svideo/author_manage',
            name: 'author_manage',
            component: './marketing/svideo/author_manage',
          },
          //作品管理
          {
            path: '/marketing_svideo/video_manage',
            name: 'video_manage',
            component: './marketing/svideo/video_manage',
          },
          //视频绑定的商品
          {
            path: '/marketing_svideo/video_manage_bind_goods',
            name: '',
            component: './marketing/svideo/video_goods',
          },
          //评论管理
          {
            path: '/marketing_svideo/comment_lists',
            name: 'comment_lists',
            component: './marketing/svideo/comment_lists',
          },
          //查看视频评论
          {
            path: '/marketing_svideo/comment_lists_to_view',
            name: '',
            component: './marketing/svideo/view_video_comments',
          },
        ]
      },
      //svideo-end
      

      // 积分商城
      {
        path: '/marketing_point',
        icon: 'transaction',
        name: 'point',
        routes: [
          //积分商城——首页装修
          {
            path: '/marketing_point/diy_home',
            name: 'diy_home',
            component: './marketing/point/mdiy/home',
          },
          // 装修页面
          {
            path: '/marketing_point/diy_home_to_edit',
            name: '',
            component: './marketing/point/mdiy/edit_diy_page',
          },
          //积分商城——积分设置
          {
            path: '/marketing_point/setting',
            name: 'setting',
            component: './marketing/point/setting',
          },
          //积分商城——标签管理
          {
            path: '/marketing_point/label',
            name: 'label',
            component: './marketing/point/label',
          },
          //积分商城——商品管理
          {
            path: '/marketing_point/goods_list',
            name: 'goods_list',
            component: './marketing/point/goods/goods_list',
          },
          //积分商城——订单管理
          {
            path: '/marketing_point/order_list',
            name: 'order_list',
            component: './marketing/point/order/order_lists',
          },
          //积分商城——订单详情
          {
            path: '/marketing_point/order_list_to_detail',
            name: '',
            component: './marketing/point/order/order_detail',
          },
          //积分商城——结算管理
          {
            path: '/marketing_point/bill_list',
            name: 'bill_list',
            component: './marketing/point/bill/lists',
          },
          //积分商城——结算详情
          {
            path: '/marketing_point/bill_list_to_detail',
            name: '',
            component: './marketing/point/bill/detail',
          },
        ]
      },
      
      {
        component: '404',
      },
    ],
  },
];
