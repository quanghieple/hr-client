import moment from 'moment';
import styles from "./index.less";
import React, { useEffect, useState } from "react";
import { useIntl } from 'umi';
import {
  Form,
  Input,
  Select,
  Button,
  Alert,
  message,
  Row, DatePicker
} from "antd";
import { registerUser } from "@/services/login";
import Col from "antd/es/grid/col";
import { getAllRoles } from '@/services/user';

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
  const formatMessage = useIntl().formatMessage;
  const [form] = Form.useForm();
  const [errorMessage, setMessage] = useState<undefined | string>(undefined)
  const [registing, setRegisting] = useState(false)
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    getAllRoles().then(rls => {
      setRoles(rls || [{name: "User", priority: 10, id: 3}])
    })
  }, roles)

  const onFinish = (user: any) => {
    setRegisting(true)
    setMessage(undefined)
    delete user.confirm;
    registerUser(user)
      .then((res) => {
        if (res.code != 0) {
          message.success(`user ${user.name} was successfully created`);
        } else {
          setMessage(formatMessage({id: res.msg}))
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
              {roles.map((role: any) => {
                return <Option value={role.id}>{role.name}</Option>
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...tailFormItemLayout}>
        <Col span={12}>
        <Button type="primary" htmlType="submit" loading={registing} className={styles.registerBtn}>
          Register
        </Button>
        {!registing && errorMessage && (
          <Alert
            style={{
              marginTop: 5
            }}
            message={errorMessage}
            type="error"
            showIcon
          />
        )}
        </Col>
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
