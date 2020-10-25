import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { connect, Dispatch, FormattedMessage, useIntl } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';

const { Tab, UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, errorMessage, type: loginType} = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  const intl = useIntl();

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab={intl.formatMessage({ id: 'login.label.email-login' })}>
          {status === 'error' && loginType === 'account' && !submitting && errorMessage &&(
            <LoginMessage content={errorMessage} />
          )}

          <UserName
            name="userName"
            placeholder={intl.formatMessage({ id: 'login.placeholder.username' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.required.username' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={intl.formatMessage({ id: 'login.placeholder.password' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'login.required.password' }),
              },
            ]}
          />
        </Tab>
{/*         
        <Tab key="mobile" tab={intl.formatMessage({ id: 'login.label.phone-login' })}>
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
         */}
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            <FormattedMessage id="login.label.remember-pass" />
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            <FormattedMessage id="login.label.forget-pass" />
          </a>
        </div>
        <Submit loading={submitting}>
          <FormattedMessage id="login.button.login" />
        </Submit>
        {/* <div className={styles.other}>
          <FormattedMessage id="login.label.login.with" />
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            <FormattedMessage id="login.label.register" />
          </Link>
        </div> */}
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
