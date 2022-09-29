/*直播、短视频公共modal*/
import { sldCommonService } from '@/utils/utils';

export default {
  namespace: 'videoCommon',

  state: {
    notice: [],
  },

  effects: {
    //slodon_批量保存设置信息
    * saveSetting({ payload, callback }, { call }) {
      const response = yield call(sldCommonService, payload, 'post', 'v3/video/admin/video/setting/updateSettingList');
      if (callback) callback(response);
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
  },
};
