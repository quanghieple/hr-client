import React, { Component } from 'react';

import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CheckIn from '../CheckIn';
import WorkSheet from '../WorkSheet';
interface TimeKeepProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

class TimeKeep extends Component<TimeKeepProps> {
  handleTabChange = (key: string) => {

  };

  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer title={false}>
        <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
          <TabPane tab="Thêm bữa ăn" key="1">
            <CheckIn />
          </TabPane>
          <TabPane tab="Tracking tháng" key="2">
            <WorkSheet />
          </TabPane>
        </Tabs>
      </PageContainer>
    );
  }
}

export default TimeKeep;
