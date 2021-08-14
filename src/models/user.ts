import { Effect, Reducer } from 'umi';

import { User } from '@/data/database';
import { getCurrentUser } from '@/services/user';

export interface UserModelState {
  currentUser?: User;
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
      const response = yield call(getCurrentUser);
      yield put({
        type: 'saveCurrentUser',
        payload: response ? response : {id: -1},
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
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
