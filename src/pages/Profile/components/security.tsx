import { FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="profile.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="profile.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="profile.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

class SecurityView extends Component {
  getData = () => [
    {
      title: formatMessage({ id: 'profile.security.password' }, {}),
      description: (
        <>
          {formatMessage({ id: 'profile.security.password-description' })}：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify">
          <FormattedMessage id="profile.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'profile.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'profile.security.phone-description' },
        {},
      )}：138****8293`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="profile.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'profile.security.question' }, {}),
      description: formatMessage({ id: 'profile.security.question-description' }, {}),
      actions: [
        <a key="Set">
          <FormattedMessage id="profile.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'profile.security.email' }, {}),
      description: `${formatMessage(
        { id: 'profile.security.email-description' },
        {},
      )}：ant***sign.com`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="profile.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'profile.security.mfa' }, {}),
      description: formatMessage({ id: 'profile.security.mfa-description' }, {}),
      actions: [
        <a key="bind">
          <FormattedMessage id="profile.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];

  render() {
    const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default SecurityView;
