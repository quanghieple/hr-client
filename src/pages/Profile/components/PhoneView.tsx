import React from 'react';

import { Input } from 'antd';
import styles from './PhoneView.less';
import { values } from 'lodash';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

interface PhoneViewProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneView: React.FC<PhoneViewProps> = (props) => {
  const { value, onChange } = props;
  var values = ["", value];
  if (value?.includes("/")) {
    values = value.replace("+", "").split("/");
  } else {
    try {
      let parse = phoneUtil.parse(value);
      if (value) {
        values = [parse.getCountryCode(), parse.getNationalNumber()];
      }
    } catch(err) {
      values = ["84", "987654321"]
    }
  }

  return (
    <>
      <Input
        className={styles.area_code}
        value={values[0]}
        disabled={true}
        onChange={(e) => {
          if (onChange) {
            onChange(`+${e.target.value}/${values[1]}`);
          }
        }}
      />
      <Input
        className={styles.phone_number}
        disabled={true}
        onChange={(e) => {
          if (onChange) {
            onChange(`+${values[0]}/${e.target.value}`);
          }
        }}
        value={values[1]}
      />
    </>
  );
};

export default PhoneView;
