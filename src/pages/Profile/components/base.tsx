import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message, Alert } from 'antd';
import { connect, FormattedMessage, useIntl, formatMessage } from 'umi';
import React, { Component, useState } from 'react';

import { CurrentUser } from '../data.d';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';
import { saveUpdateUser } from '../service';
import { getDownloadUrl, uploadProfileImage } from '@/services/firebase';

const { Option } = Select;
// const { formatMessage } = useIntl();

const AvatarView = ({ avatar, email, onChange }: { avatar: string, email: string, onChange: Function }) => {
  const [url, setUrl] = useState(avatar);
  const [loading, setUploading] = useState(false)

  const onPreview = async (file: File) => {
    setUploading(true)
    onChange("loading")
    let upload = await uploadProfileImage(file, email)
    if(upload.state == "success") {
      let url = await getDownloadUrl(upload.metadata.fullPath)
      onChange(url);
      setUrl(url)
      setUploading(false)
    } else {
      message.error(formatMessage({id: "profile.basic.avatar.upload.fail"}))
      onChange(null);
      setUploading(false)
    }
  };

  return (<>
    <div className={styles.avatar_title}>
      <FormattedMessage id="profile.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={url} alt="avatar" />
    </div>
    <Upload showUploadList={false}
            beforeUpload={onPreview}>
      <div className={styles.button_view}>
        <Button loading={loading}>
          <UploadOutlined />
          <FormattedMessage id="profile.basic.change-avatar" defaultMessage="Change avatar " />
        </Button>
      </div>
    </Upload>
  </>)
};
interface SelectItem {
  label: string;
  key: string;
}

const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;
  if (!province.key) {
    callback(formatMessage({id: "profile.basic.geographic.province.need"}));
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  if(!value) {
    callback(formatMessage({id:'profile.basic.phone-message'}));
  }
  callback();
};

interface BaseViewProps {
  currentUser?: CurrentUser;
}

interface BaseViewState {
  avatar: string;
  updating: boolean;
  errorMessage: string;
}

class BaseView extends Component<BaseViewProps, BaseViewState> {
  view: HTMLDivElement | undefined = undefined;

  constructor(props: BaseViewProps) {
    super(props);
    this.state = {
      avatar: "",
      updating: false,
      errorMessage: ""
    }
  }

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.photoURL) {
        return currentUser.photoURL;
      }
      const url = '/default_avatar.jpg';
      return url;
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish  = (user: any) => {
    this.setState({updating: true});
    this.setState({errorMessage: ""})
    if(this.state.avatar == "loading") {
      message.info(formatMessage({id: 'profile.basic.avatar.wait'}));
      this.setState({updating: false});
    } else {
      if (this.state.avatar) {
        user.photoURL = this.state.avatar
      }
      saveUpdateUser(user).then((res) => {
        if (res.ok) {
          message.info(formatMessage({id: 'profile.update.success'}))
        } else {
          this.setState({errorMessage: res.message || ""})
        }
        this.setState({updating: false});
      })
    }
  };

  onChangeAvatar = (avatar: string) => {
    this.setState({ avatar: avatar})
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item
              name="email"
              label={formatMessage({ id: 'profile.basic.email' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'profile.basic.email-message' }, {}),
                },
              ]}
            >
              <Input disabled={true}/>
            </Form.Item>
            <Form.Item
              name="displayName"
              label={formatMessage({ id: 'profile.basic.nickname' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'profile.basic.nickname-message' }, {}),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="profile"
              label={formatMessage({ id: 'profile.basic.profile' })}
              // rules={[
              //   {
              //     required: true,
              //     message: formatMessage({ id: 'profile.basic.profile-message' }, {}),
              //   },
              // ]}
            >
              <Input.TextArea
                placeholder={formatMessage({ id: 'profile.basic.profile-placeholder' })}
                rows={4}
              />
            </Form.Item>
            <Form.Item
              name="country"
              label={formatMessage({ id: 'profile.basic.country' })}
              // rules={[
              //   {
              //     required: true,
              //     message: formatMessage({ id: 'profile.basic.country-message' }, {}),
              //   },
              // ]}
            >
              <Select style={{ maxWidth: 220 }}>
                <Option value="Vie">Viet Nam</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="geographic"
              label={formatMessage({ id: 'profile.basic.geographic' })}
              // rules={[
              //   {
              //     required: true,
              //     message: formatMessage({ id: 'profile.basic.geographic-message' }, {}),
              //   },
              //   {
              //     validator: validatorGeographic,
              //   },
              // ]}
            >
              <GeographicView />
            </Form.Item>
            <Form.Item
              name="address"
              label={formatMessage({ id: 'profile.basic.address' })}
              // rules={[
              //   {
              //     required: true,
              //     message: formatMessage({ id: 'profile.basic.address-message' }, {}),
              //   },
              // ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label={formatMessage({ id: 'profile.basic.phone' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'profile.basic.phone-message' }),
                },
                { validator: validatorPhone },
              ]}
            >
              <PhoneView />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary" loading={this.state.updating}>
                <FormattedMessage
                  id="profile.basic.update"
                  defaultMessage="Update Information"
                />
              </Button>
              {!this.state.updating && this.state.errorMessage != "" && (
                <Alert
                style={{
                  marginTop: 5
                }}
                message={this.state.errorMessage}
                type="error"
                showIcon
                />
              )}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} 
                      email={currentUser?.email || "Anonymous"}
                      onChange={this.onChangeAvatar} />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ profile }: { profile: { currentUser: CurrentUser } }) => ({
    currentUser: profile.currentUser,
  }),
)(BaseView);
