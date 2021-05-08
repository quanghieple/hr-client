import { Col, Drawer, Row } from 'antd';
import React, { useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi';
import styles from './index.less';
import LocationCheck from './location';
import QRScane from './qr';

export default () => {
  const [openL, setOpenL] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  return (
    <div>
    <Row gutter={50} className={styles.checkIn}>
      {/* <Col xs={24} sm={24} md={8} lg={8}>
        <img className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Post.png" />
        <p className={styles.textCheckIn}><FormattedMessage id='checkin.wifi.title' /></p>
      </Col> */}
      <Col xs={24} sm={24} md={8} lg={8}>
        <img onClick={() => setOpenL(true)} className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Browse.png" />
        <p className={styles.textCheckIn}><FormattedMessage id='checkin.location.title' /></p>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8}>
        <img onClick={() => setOpenQR(true)} className={styles.imageCheckIn} src="https://sharingwork.com/static/img/introduction/Share.png" />
        <p className={styles.textCheckIn}><FormattedMessage id='checkin.qr.title' /></p>
      </Col>
    </Row>
        <Drawer
        title={formatMessage({id: 'checkin.location.title'})}
        width={'50vh'}
        placement="right"
        onClose={() => setOpenL(false)}
        visible={openL}
      >
          <LocationCheck />
      </Drawer>
      <Drawer
        title={formatMessage({id: 'checkin.qr.title'})}
        width={'50vh'}
        placement="right"
        onClose={() => setOpenQR(false)}
        visible={openQR}
      >
          <QRScane openQR={openQR}/>
      </Drawer>
    </div>
  );
};
