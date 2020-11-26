import { Col, Drawer, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import LocationCheck from './location';
import QRScane from './qr';

export default () => {
  const [openL, setOpenL] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  return (
    <div>
    <Row gutter={50} className={styles.checkIn}>
      <Col xs={24} sm={24} md={24} lg={8}>
        <img className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Post.png" />
        <p className={styles.textCheckIn}>Wifi Check In</p>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <img onClick={() => setOpenL(true)} className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Browse.png" />
        <p className={styles.textCheckIn}>Location Check In</p>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <img onClick={() => setOpenQR(true)} className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Share.png" />
        <p className={styles.textCheckIn}>Scan QR Code</p>
      </Col>
    </Row>
        <Drawer
        title="Location Check In"
        width={'50vh'}
        placement="right"
        onClose={() => setOpenL(false)}
        visible={openL}
      >
          <LocationCheck />
      </Drawer>
      <Drawer
        title="Location Check In"
        width={'50vh'}
        placement="right"
        onClose={() => setOpenQR(false)}
        visible={openQR}
      >
          <QRScane />
      </Drawer>
    </div>
  );
};
