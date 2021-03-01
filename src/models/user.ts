import { Effect, Reducer } from 'umi';

import { queryCurrent} from '@/services/user';
import { CurrentUser } from '@/data/database';

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    // changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: undefined,
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response ? response : {id: -1},
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      console.log("payload", action.payload);

      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    // changeNotifyCount(
    //   state = {
    //     currentUser: undefined,
    //   },
    //   action,
    // ) {
    //   return {
    //     ...state,
    //     currentUser: {
    //       ...state.currentUser,
    //       notifyCount: action.payload.totalCount,
    //       unreadCount: action.payload.unreadCount,
    //     },
    //   };
    // },
  },
};

export default UserModel;
