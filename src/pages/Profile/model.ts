import { CurrentUser } from '@/data/database';
import { Effect, Reducer } from 'umi';
import { getUserForUpdate} from './service';

export interface ModalState {
  currentUser?: Partial<CurrentUser>;
  isLoading?: boolean;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchUserUpdate: Effect;
    removeUserUpdate: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    changeLoading: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'profile',

  state: {
    currentUser: {},
    isLoading: false,
  },

  effects: {
    *fetchUserUpdate(_, { call, put }) {
      const response = yield call(getUserForUpdate);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *removeUserUpdate(_, { call, put }) {
      yield put({
        type: 'saveCurrentUser'
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};

export default Model;
