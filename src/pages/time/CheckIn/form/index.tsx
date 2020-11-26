import React from 'react';
import { Button, Form, Input, Select } from 'antd';

interface LocationProps {

}

const { Option } = Select;

const FormCheck = (props: LocationProps) => {
    return (
        <Form style={{paddingTop: "20px"}} 
            layout="vertical"
            name="basic"
            >
            <Form.Item
                label="work shift"
                name="shift"
                rules={[{ required: true, message: 'Please select your work shift!' }]}
            >
                <Select placeholder="work shift">
                    <Option value="lucy">Lucy</Option>
                    <Option value="luffy">Luffy</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Note"
                name="note"
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default FormCheck