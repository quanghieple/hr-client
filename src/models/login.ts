import { stringify } from 'querystring';
import { history, Reducer, Effect, formatMessage } from 'umi';

import { signInUser, signOutUser } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  errorMessage?: string;
  currentAuthority?: 'user' | 'manager' | 'admin';
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
      const response = yield signInUser(payload);
      if (response.code == 1) {
        let user = response.data.user
        let role = user.role.name.toLowerCase();
        localStorage.setItem('token', response.data.token);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: role,
          },
        });

        yield put({
          type: 'user/saveCurrentUser',
          payload: user
        })

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
        window.location.href = redirect || '/';
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: "error",
            type: "account",
            errorMessage: formatMessage({id: response.msg})
          },
        });
      }
    },

    *logout(_, { put, call }) {
      yield call(signOutUser);

      reloadAuthorized();
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      localStorage.removeItem('token');
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
