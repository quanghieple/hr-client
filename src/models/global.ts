import { Subscription, Reducer, Effect } from 'umi';

import { NoticeIconData } from '@/components/NoticeIcon';
import { queryNotices } from '@/services/user';
import { ConnectState } from './connect.d';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  cStatus: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  unread: any;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveUnread: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    unread: {}
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      const listOfList = Object.values(data).map((d: any) => d.list);
      const unread = Object.keys(data).reduce((obj, key) => ({...obj, [key]: data[key].unread}), {});
      yield put({
        type: 'saveNotices',
        payload: listOfList.reduce((acc: any[], next: any[]) => acc.concat(next)),
      });
      yield put({
        type: 'saveUnread',
        payload: unread,
      });
      // const unreadCount: number = sumBy(Object.values(data), "unread")
      // const totalCount: number = sumBy(listOfList, "length")
      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount,
      //     unreadCount,
      //   },
      // });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const unread = yield select((state: ConnectState) => state.global.unread);
      delete unread[payload];
      yield put({
        type: 'saveUnread',
        payload: { ...unread },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload.id) {
            notice.status = 2;
          }
          return notice;
        }),
      );
      const unread = yield select((state: ConnectState) => state.global.unread);
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'saveUnread',
        payload: { ...unread, [payload.type]: unread[payload.type] - 1},
      });

      // yield put({
      //   type: 'user/changeNotifyCount',
      //   payload: {
      //     totalCount: notices.length,
      //     unreadCount: notices.filter((item) => !item.read).length,
      //   },
      // });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { notices: [], collapsed: true, unread: {} }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = { notices: [], collapsed: true, unread: {} }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: payload,
      };
    },
    saveUnread(state = { notices: [], collapsed: true, unread: {} }, { payload }): GlobalModelState {
      return {
        ...state,
        unread: payload,
      }
    },
    saveClearedNotices(state = { notices: [], collapsed: true, unread: {} }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
