import { UploadOutlined } from '@ant-design/icons';
import { Input, List, Form, Upload, Button, message } from 'antd';
import React, { Fragment } from 'react';
import { getListMeal, uploadMealImage, writeMealData } from '@/services/checkin';
import { getDownloadUrl } from '@/services/firebase';
import SketchExample from '@/share/color-picker';

const BindingView = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState<any[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [color, setColor] = React.useState({ r: '241', g: '112', b: '19', a: '1', });
  const [id, setId] = React.useState<number>(0);

  React.useEffect(() => {
    getListMeal().then((list) => {
      setData(Object.values(list));
    })
  }, [])

  const rgba2hex = (rbga: any) => {
    let { r, g, b, a } = rbga;
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = Math.round(a * 255).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;

    return "#" + r + g + b + a;
  }

  const onFinish = async (val: any) => {
    setSaving(true);
    let downUrl = null
    if (val.images) {
      const upload = await uploadMealImage(val.images[0].originFileObj)
      if(upload.state === "success") {
        downUrl = await getDownloadUrl(upload.metadata.fullPath)
      } else {
        message.error("úp hình lỗi rồi :(")
      }
    }
    writeMealData({id: id || new Date().getTime(),avatar: downUrl, title: val.name, description: val.note || "", color: rgba2hex(color)}).then(() => {
      message.info("Lưu thèn công");
      setSaving(false);
      form.resetFields();
      getListMeal().then((list) => {
        setData(Object.values(list));
      })
    })
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Fragment>
      <h2>Thêm món ăn</h2>
      <Form
        name="validate_other"
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        form={form}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[
            {
              required: true,
              message: "nhập dùm",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Màu"
          name="color"
        >
          <SketchExample color={color} setColor={setColor} />
        </Form.Item>
        <Form.Item
          name="images"
          label="Hình"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "thêm hình dùm",
            },
          ]}
        >
          <Upload maxCount={1} name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Hình của nó</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={saving}>
            Lưu thôi
          </Button>
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={<img style={{width: '150px', height: 'auto'}} src={item.avatar} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
}

export default BindingView;
