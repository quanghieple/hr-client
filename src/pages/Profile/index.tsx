import React, { Component } from 'react';

import { FormattedMessage, Dispatch, connect } from 'umi';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';
import { User } from '@/data/database';
import { ConnectState } from '@/models/connect';
import { getUserForUpdate } from './service';

const { Item } = Menu;

interface ProfileProps {
  dispatch: Dispatch;
  currentUser: User;
}

type ProfileStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface ProfileState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: ProfileStateKeys;
  updateOther: boolean;
  user: User;
}

class Profile extends Component<
  ProfileProps,
  ProfileState
> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: ProfileProps) {
    super(props);
    const menuMap = {
      base: <FormattedMessage id="profile.menuMap.basic" defaultMessage="Basic Settings" />,
      security: (
        <FormattedMessage id="profile.menuMap.security" defaultMessage="Security Settings" />
      ),
      // binding: (
      //   <FormattedMessage id="profile.menuMap.binding" defaultMessage="Account Binding" />
      // ),
      // notification: (
      //   <FormattedMessage
      //     id="profile.menuMap.notification"
      //     defaultMessage="New Message Notification"
      //   />
      // ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
      updateOther: false,
      user: {id : -1}
    };
  }

  componentDidMount() {
    getUserForUpdate().then(user => this.setState({user: user}))
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: ProfileStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = (user: User) => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'base':
        return <BaseView user={user} />;
      case 'security':
        return <SecurityView />;
      case 'binding':
        return <BindingView />;
      case 'notification':
        return <NotificationView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { user } = this.state;

    if (user.id < 0) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as ProfileStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren(user)}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser
}))(Profile);
