import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { LabeledValue } from 'antd/es/select';
import { connect, Dispatch, formatMessage } from 'umi';
import { GeographicItemType } from '../data.d';
import styles from './GeographicView.less';

const { Option } = Select;

const nullSelectItem: LabeledValue = {
  label: '',
  value: '',
  key: '',
};

interface GeographicViewProps {
  dispatch?: Dispatch<any>;
  province?: any[];
  city?: any[];
  value?: {
    province: LabeledValue;
    city: LabeledValue;
  };
  loading?: boolean;
  onChange?: (value: { province: LabeledValue; city: LabeledValue }) => void;
}

class GeographicView extends Component<GeographicViewProps> {
  componentDidMount = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'profile/fetchProvince',
      });
    }
  };

  componentDidUpdate(props: GeographicViewProps) {
    const { dispatch, value } = this.props;

    if (!props.value && !!value && !!value.province) {
      if (dispatch) {
        dispatch({
          type: 'profile/fetchCity',
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
        type: 'profile/fetchCity',
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
    const { loading } = this.props;

    return (
      <Spin spinning={loading} wrapperClassName={styles.row}>
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

export default connect(
  ({
    profile,
    loading,
  }: {
    profile: {
      province: GeographicItemType[];
      city: GeographicItemType[];
    };
    loading: any;
  }) => {
    const { province, city } = profile;
    return {
      province,
      city,
      loading: loading.models.profile,
    };
  },
)(GeographicView);
