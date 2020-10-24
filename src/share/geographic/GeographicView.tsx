import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { LabeledValue } from 'antd/es/select';
import { connect, Dispatch, formatMessage } from 'umi';
import styles from './GeographicView.less';
import { ConnectState } from '@/models/connect';

const { Option } = Select;

const nullSelectItem: LabeledValue = {
  label: '',
  value: '',
  key: '',
};

export interface GeographicItemType {
  name: string;
  id: string;
}

interface GeographicViewProps {
  dispatch?: Dispatch;
  province?: any[];
  city?: any[];
  value?: {
    province: LabeledValue;
    city: LabeledValue;
  };
  onChange?: (value: { province: LabeledValue; city: LabeledValue }) => void;
}

class GeographicView extends Component<GeographicViewProps> {
  componentDidMount = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'share/fetchProvince',
      });
    }
  };

  componentDidUpdate(props: GeographicViewProps) {
    const { dispatch, value } = this.props;

    if (!props.value && !!value && !!value.province) {
      if (dispatch) {
        dispatch({
          type: 'share/fetchCity',
          payload: value.province.key,
        });
      }
    }
  }

  getProvinceOption() {
    const { province } = this.props;
    if (province) {
      return this.getOption(province["results"], "province_id", "province_name", formatMessage({id: "profile.basic.geographic.province.wait"}));
    }
    return [];
  }

  getCityOption = () => {
    const { city } = this.props;
    if (city) {
      return this.getOption(city["results"], "district_id", "district_name", formatMessage({id: "profile.basic.geographic.district.province"}));
    }
    return [];
  };

  getOption = (list: any[], id: string, name: string, emptyMessage: string) => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={emptyMessage}>
        </Option>
      );
    }
    return list.map((item) => (
      <Option key={item[id]} value={item[id]}>
        {item[name]}
      </Option>
    ));
  };

  selectProvinceItem = (item: LabeledValue) => {
    const { dispatch, onChange } = this.props;

    if (dispatch) {
      dispatch({
        type: 'share/fetchCity',
        payload: item.key,
      });
    }
    if (onChange) {
      onChange({
        province: item,
        city: nullSelectItem,
      });
    }
  };

  selectCityItem = (item: LabeledValue) => {
    const { value, onChange } = this.props;
    if (value && onChange) {
      onChange({
        province: value.province,
        city: item,
      });
    }
  };

  conversionObject() {
    const { value } = this.props;
    if (!value) {
      return {
        province: nullSelectItem,
        city: nullSelectItem,
      };
    }
    const { province, city } = value;
    return {
      province: province || nullSelectItem,
      city: city || nullSelectItem,
    };
  }

  render() {
    const { province, city } = this.conversionObject();

    return (
      <Spin spinning={false} wrapperClassName={styles.row}>
        <Select
          className={styles.item}
          value={province}
          labelInValue
          showSearch
          onSelect={this.selectProvinceItem}
          dropdownMatchSelectWidth={false}
        >
          {this.getProvinceOption()}
        </Select>
        <Select
          className={styles.item}
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
          dropdownMatchSelectWidth={false}
        >
          {this.getCityOption()}
        </Select>
      </Spin>
    );
  }
}

export default connect(({ share }: ConnectState) => ({
  province: share.province,
  city: share.city
}))(GeographicView);
