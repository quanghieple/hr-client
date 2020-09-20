import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import UserRegister from './components/UserRegister';
import styles from './index.less';

export default () => {
  return (
    <PageContainer className={styles.main}>
      <UserRegister />
    </PageContainer>
  );
};
