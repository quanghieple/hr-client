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
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { registerUser } from "@/services/login";

const { Option } = Select;

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
    registerUser(user).then((res) => {
      console.log(res);
      message.success(`user ${user.name} was successfully created`);
      setRegisting(false)
    }).catch((err) => {
      setMessage("Something went wrong. Please contact IT support")
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

      <Form.Item
        name="name"
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

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: "Please input your phone number!" }]}
      >
        <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="role"
        label="Role"
        hasFeedback
        rules={[{ required: true, message: 'Please select your role' }]}
      >
        <Select placeholder="Please select Role">
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>
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
        {!registing && errorMessage != "" && (
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
