import { formatMessage } from "umi";
import moment from 'moment';
import GeographicView from "@/share/geographic/GeographicView";
import styles from "./index.less";
import React, { useState } from "react";
import {
  Form,
  Input,
  Tooltip,
  Select,
  Button,
  Alert,
  message,
  Row, DatePicker
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { registerUser } from "@/services/login";
import Col from "antd/es/grid/col";

const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [errorMessage, setMessage] = useState("")
  const [registing, setRegisting] = useState(false)

  const onFinish = (user: any) => {
    setRegisting(true)
    setMessage("")
    delete user.confirm;
    registerUser(user)
      .then((res) => {
        if (res.ok) {
          message.success(`user ${user.name} was successfully created`);
        } else {
          setMessage(res.message)
        }
        setRegisting(false)
      })
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "84",
      }}
      scrollToFirstError
    >
      <Row>
        <Col span={12}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please input your phone number!" }]}
          >
            <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
          </Form.Item>

        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            name="displayName"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="birth"
            label="Birth Date"
          >
            <DatePicker style={{ width: '100%' }}
                        format={dateFormat}
                        defaultPickerValue={moment(`${new Date().getFullYear() - 20}/01/01`, dateFormat)}/>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Role"
            hasFeedback
            rules={[{ required: true, message: 'Please select your role' }]}
          >
            <Select placeholder="Please select Role">
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="title"
            label={
              <span>
                Title&nbsp;
            <Tooltip title="What are your title in your company?">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    <Row>
      <Col span={12}>
      <Form.Item
            name="country"
            label={formatMessage({ id: 'profile.basic.country' })}
          >
            <Select style={{ maxWidth: 220 }}>
              <Option value="Vie">Viet Nam</Option>
            </Select>
          </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
            name="geographic"
            label={formatMessage({ id: 'profile.basic.geographic' })}
          >
            <GeographicView />
          </Form.Item>
      </Col>
    </Row>

      {/* 
      <Form.Item
        label="Captcha"
        extra="We must make sure that your are a human."
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[
                {
                  required: true,
                  message: "Please input the captcha you got!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
       */}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" loading={registing}>
          Register
        </Button>
        {!registing && errorMessage !== "" && (
          <Alert
            style={{
              marginTop: 5
            }}
            message={errorMessage}
            type="error"
            showIcon
          />
        )}
      </Form.Item>
    </Form>
  );
};

export default () => (
  <div className={styles.container}>
    <div id="components-form-demo-register">
      <RegistrationForm />
    </div>
  </div>
);
