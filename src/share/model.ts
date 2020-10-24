import { Effect, Reducer } from 'umi';
import { GeographicItemType } from './geographic/GeographicView';
import { queryCity, queryProvince} from './service';

export interface ShareState {
  province?: GeographicItemType[];
  city?: GeographicItemType[];
}

export interface ShareType {
  namespace: string;
  state: ShareState;
  effects: {
    fetchProvince: Effect;
    fetchCity: Effect;
  };
  reducers: {
    setProvince: Reducer<ShareState>;
    setCity: Reducer<ShareState>;
  };
}

const Model: ShareType = {
  namespace: 'share',

  state: {
    province: [],
    city: [],
  },

  effects: {
    *fetchProvince(_, { call, put }) {
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },
    *fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
        payload: response,
      });
    },
  },

  reducers: {
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    }
  },
};

export default Model;
