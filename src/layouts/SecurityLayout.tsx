import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { firebase } from '@/utils/firebase';
import { getCheckinPath } from '@/services/checkin';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  shouldComponentUpdate(nextProps: SecurityLayoutProps, nextState: SecurityLayoutState) {
    const { dispatch } = nextProps;
    const uid = nextProps.currentUser && nextProps.currentUser.uid
    const preUid = this.props.currentUser && this.props.currentUser.uid
    if (preUid != uid && uid && uid != "-1" && dispatch) {
      firebase.database().ref().child(getCheckinPath(uid, new Date())).on('value', (snap) => {
        dispatch({
          type: 'checkin/saveHistory',
          payload: snap.val()
        })
      })
    }
    return true;
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && currentUser.uid;
    const isGuest = isLogin == "-1";
    const queryString = stringify({
      redirect: window.location.href,
    });
    if (isGuest && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
