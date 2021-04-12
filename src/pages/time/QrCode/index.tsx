import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import request from '@/utils/request';
import { GET_QR } from '@/api/CheckinApi';

var QRCode = require('qrcode.react');

export default () => {
  const [value, setvalue] = useState<string>("");
  useEffect(() => {
    const getQR = async () => {
      let qr = await request.get(GET_QR)
      setvalue(qr)
    }

    getQR()
  }, []);
  return (
    <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
      <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <Spin spinning={value == ""} size="large" />
        {value != "" && (
          <QRCode value={value} />
        )}
      </div>
    </PageContainer>
  );
};
