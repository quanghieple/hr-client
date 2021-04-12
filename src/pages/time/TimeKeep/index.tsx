import React, { Component } from 'react';

import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CheckIn from '../CheckIn';
import WorkSheet from '../WorkSheet';
import { Dispatch } from '@/.umi/plugin-dva/connect';
import { ConnectState } from '@/models/connect';
import { connect } from '@/.umi/plugin-dva/exports';
interface TimeKeepProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
  dispatch: Dispatch;
}

class TimeKeep extends Component<TimeKeepProps> {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'checkin/fetchHistory'
      });
    }
  }

  handleTabChange = (key: string) => {

  };

  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer title={false}>
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="Check In/Out" key="1">
            <CheckIn />
          </TabPane>
          <TabPane tab="Work Sheet" key="2">
            <WorkSheet />
          </TabPane>
        </Tabs>
      </PageContainer>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser
}))(TimeKeep);
