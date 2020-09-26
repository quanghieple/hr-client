import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import React from 'react';
import UserRegister from './components/UserRegister';

export default () => {
  return (
    <PageHeaderWrapper>
      <Card>
        <UserRegister />
      </Card>
    </PageHeaderWrapper>
  );
};
