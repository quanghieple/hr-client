// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

const ENV = REACT_APP_ENV || 'dev'
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: '空白页面',
          icon: 'smile',
          path: '/user/qr-check',
          component: './time/QrCode',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/users',
              name: 'users',
              icon: 'user',
              authority: ['admin'],
              routes: [
                {
                  name: 'new',
                  path: '/users/create',
                  component: './user/Registry',
                  authority: ['admin'],
                },
                {
                  name: 'list',
                  path: '/users/list',
                  component: './user/ListUser',
                  authority: ['admin'],
                },
              ],
            },
            {
              path: '/settings',
              name: 'settings',
              icon: 'setting',
              authority: ['admin'],
              routes: [
                {
                  name: 'time',
                  path: '/settings/time',
                  component: './settings/Time',
                },
              ],
            },
            {
              name: 'timekeeping',
              icon: 'clock-circle',
              path: '/time/timekeeping',
              component: './time/TimeKeep',
            },
            {
              path: '/account/profile',
              component: './Profile',
            },
            {
              path: '/other/profile',
              component: './Profile',
              authority: ['admin'],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[ENV],
  manifest: {
    basePath: '/',
  },
});
