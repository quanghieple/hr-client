import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { routerRedux } from 'dva/router';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { signInUser, signOutUser } from '@/services/auth';
import { reloadAuthorized } from '@/utils/Authorized';
import { queryCurrent } from '@/services/user';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  errorMessage?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(signInUser, payload);
      console.log(response)
      // Login successfully
      if (response.ok) {
        const user = yield call(queryCurrent)
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: user.role,
          },
        });
        yield put({
          type: 'user/saveCurrentUser',
          payload: user
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: "error",
            type: "account",
            errorMessage: response.message
          },
        });
      }
    },

    *logout(_, { put, call }) {
      const response = yield call(signOutUser);
      if (response.ok === true) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
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
        errorMessage: payload.errorMessage
      };
    },
  },
};

export default Model;
