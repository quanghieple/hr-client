import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/data/database';

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

  // shouldComponentUpdate(nextProps: SecurityLayoutProps, nextState: SecurityLayoutState) {
  //   const { dispatch } = nextProps;
  //   const uid = nextProps.currentUser && nextProps.currentUser.id
  //   const preUid = this.props.currentUser && this.props.currentUser.id
  //   if (preUid != uid && uid && uid != -1 && dispatch) {
  //     firebase.database().ref().child(getCheckinPath(uid, new Date())).on('value', (snap) => {
  //       dispatch({
  //         type: 'checkin/saveHistory',
  //         payload: snap.val()
  //       })
  //     })
  //   }
  //   return true;
  // }

  render() {
    const { isReady } = this.state;
    const { children} = this.props;
    // You can replace it to your authentication rule (such as check token exists)

    if (!isReady) {
      return <PageLoading />;
    }
    if (!localStorage.getItem('token') && window.location.pathname !== '/user/login') {
      const queryString = stringify({
        redirect: window.location.href,
      });
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
