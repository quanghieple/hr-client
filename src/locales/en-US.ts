import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import login from './en-US/login';
import menu from './en-US/menu';
import firebase from './en-US/firebase';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import profile from './en-US/profile';
import checkin from './en-US/checkin';
import response from './en-US/response';
import notification from './en-US/notification';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  'error.it.help': 'Something went wrong. Please contact IT support',
  'button.save': 'Save',
  'button.cancel': 'Cancel',
  'button.delete': 'Delete',
  'button.update': 'Update',
  'button.edit': 'Edit',
  'button.create': 'Create',
  'button.approve': 'Approve',
  'button.reject': 'Reject',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...login,
  ...firebase,
  ...profile,
  ...checkin,
  ...response,
  ...notification
};
